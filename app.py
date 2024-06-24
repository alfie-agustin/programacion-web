from flask import Flask, request, jsonify, Response
from Backend.GenAIBot import predict as bot
import os
from flask_cors import CORS

app = Flask(__name__,  static_folder='frontend', static_url_path='')
frontend_directory = os.path.join(os.path.dirname(__file__), 'frontend')
CORS(app)


@app.route('/response', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        user_interaction = data.get('user_interaction', "")
        response = bot(user_interaction)
        return jsonify({'result': response}), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500


@app.route('/')
def index():
    return app.send_static_file('index.html')


if __name__ == '__main__':
    app.run(debug=True)