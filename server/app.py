# server/app.py
from flask import Flask, request, jsonify
from gemini_handler import generate_reply
import os

app = Flask(__name__)

@app.route('/', methods=['POST'])
def process_text():
    """Handle text input from client"""
    data = request.form or request.json
    if not data or 'text' not in data:
        return "No text provided", 400

    user_text = data['text']
    print(f"[📝] Text received: {user_text}")

    # Directly generate reply using same function
    reply = generate_reply(user_text)
    print(f"[💬] Reply: {reply}")
    return reply


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
