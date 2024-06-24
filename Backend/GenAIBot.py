import requests
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def predict(user_input):
    API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large"
    headers = {"Authorization": "Bearer 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"}

    def query(payload):
        response = requests.post(API_URL, headers=headers, json=payload)
        return response.json()

    output = query({
        "inputs": f"{user_input}",
    })
    log = output[0]["generated_text"]
    logger.info(f"this is the response from the model {log}")
    return output[0]["generated_text"]
