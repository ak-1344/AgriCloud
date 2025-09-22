import requests
from config import GEMINI_MODEL, GEMINI_API_KEY

def generate_reply(prompt):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    headers = { "Content-Type": "application/json" }
    data = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ]
    }
    response = requests.post(url, headers=headers, json=data)
    if response.status_code == 200:
        try:
            return response.json()["candidates"][0]["content"]["parts"][0]["text"]
        except:
            return "[Gemini Error] Unexpected response"
    else:
        return f"[Gemini Error] {response.status_code} - {response.text}"