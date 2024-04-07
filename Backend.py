from google.cloud import bigquery
from vertexai.preview.generative_models import (
    GenerationConfig,
    GenerativeModel
)
from google.generativeai.types import HarmCategory, HarmBlockThreshold
import vertexai.preview.generative_models as generative_models


client = bigquery.Client()

project_id = ""
dataset_name = ""
table_name = ""

class Backend(object):

    def __init__(self, project_id, dataset_name, table_name, bq_client):
    #private db keys
        config = GenerationConfig(temperature=0.1)
        self.model = GenerativeModel(model_name="gemini-pro",generation_config=config)
        self.bq_client = bq_client
        self.project_id = project_id
        self.dataset_name = dataset_name
        self.table_name = table_name

    def chat(self):
        pass

    def pipeline(self, user_utterance):
        query = self.generate_query(user_utterance)
        information = self.query_db(query)
        # Generate graph if needed
        # Store the data
        augment_response = self.response_augementation(information)
        return augment_response

    def generate_query(self):
        prompt = """Prompt ot generate the query based on user uterance


        """
        query = self.model.generate_content(prompt)

    def query_db(self, query_string):
        query_job = self.bq_client.query(query_string)
        results = query_job.result()
        return results

    def response_augementation(self, information):
        prompt = """
        """
        response = self.model.generate_content(prompt)

        return response

    def generate_graph(self):
        raise NotImplementedError



