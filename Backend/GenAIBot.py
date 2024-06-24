import requests


def predict(user_input):
    API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large"
    headers = {"Authorization": "Bearer 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"}

    def query(payload):
        response = requests.post(API_URL, headers=headers, json=payload)
        return response.json()

    output = query({
        "inputs": f"{user_input}",
    })
    return output[0]["generated_text"]
