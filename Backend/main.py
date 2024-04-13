from langchain_google_vertexai import VertexAI
from langchain_google_vertexai import ChatVertexAI
from google.cloud import bigquery as bq
import time
import matplotlib.pyplot as plt
import prompt as pr
import pandas as pd

code_bison = VertexAI(model_name="code-bison")
chat = ChatVertexAI(model_name="gemini-pro")
textbison = VertexAI(model_name="text-bison")


def generate_query(user_input, table_id):
    prompt = pr.code_prompt_SQL(user_input, table_id)
    response = code_bison.generate([prompt])
    return response.generations[0][0].text


def query_db(query):
    bq_client = bq.Client()
    query_job = bq_client.query(query)
    results = query_job.result()
    results_list = [dict(row) for row in results]
    return results_list


def augment_response(user_input, bq_response):
    prompt = pr.chat_prompt(user_input, bq_response)
    response = textbison.generate([prompt])
    return response.generations[0][0].text


def generate_query_table(user_input, table_id):
    prompt = pr.code_prompt_table(user_input, table_id)
    response = code_bison.generate([prompt])
    return response.generations[0][0].text


def create_df(bq_result):
    return pd.DataFrame(bq_result)


def create_python_code(user_input, df):
    prompt = pr.code_prompt_python(user_input, df)
    response = code_bison.generate([prompt])
    return response.generations[0][0].text


def generate_graph(df, python_code):
    exec(python_code)
    graph = plt.show()
    return graph


def pipeline(user_input, table_id, max_retries=10, delay_between_retries=1):
    graph = False
    if graph:
        retries = 0
        while retries < max_retries:
            try:
                query = generate_query_table(user_input, table_id)
                bq_result = query_db(query)
                df = create_df(bq_result)

                retries2 = 0
                while retries2 < max_retries:
                    try:
                        python_code = create_python_code(user_input, df)
                        graph = generate_graph(df, python_code)
                        return graph
                    except Exception as e:
                        user_input = f"""this is the user_input request {user_input}.
                        This was your inital response: {query}
                        This error appeared while querying the db: {e}

                        Write the prompt so the query does not fail. Remember to only return the SQL query."""
                        retries2 += 1
                        print(f"Retry attempt {retries2}/{max_retries}")
                        if retries2 < max_retries:
                            print(f"Retrying after {delay_between_retries} seconds...")
                            time.sleep(delay_between_retries)
            except Exception as e:
                user_input = f"""this is the user_input request {user_input}.
                This was your inital response: {query}
                This error appeared while querying the db: {e}

                Write the prompt so the query does not fail. Remember to only return the SQL query."""
                retries += 1
                print(f"Retry attempt {retries}/{max_retries}")
                if retries < max_retries:
                    print(f"Retrying after {delay_between_retries} seconds...")
                    time.sleep(delay_between_retries)



    else:
        # text generation response
        retries = 0
        while retries < max_retries:
            try:
                query = generate_query(user_input, table_id)
                bq_result = query_db(query)
                final_response = augment_response(user_input, bq_result)
                return final_response
            except Exception as e:
                user_input = f"""this is the user_input request {user_input}.
                This was your inital response: {query}
                This error appeared while querying the db: {e}

                Write the prompt so the query does not fail. Remember to only return the SQL query."""
                retries += 1
                print(f"Retry attempt {retries}/{max_retries}")
                if retries < max_retries:
                    print(f"Retrying after {delay_between_retries} seconds...")
                    time.sleep(delay_between_retries)
