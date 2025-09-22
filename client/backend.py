# backend.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# CORS for your local frontend
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat(payload: dict):
    user_message = payload.get("text")
    if not user_message:
        return {"reply": "No message received."}

    try:
        # Use Docker service name 'server' instead of localhost
        ai_response = requests.post(
            "http://server:5000",  # server = Docker service name
            data={"text": "Reply to this being an expert in crop management and prduction:" + user_message},
            timeout=10
        )
        reply_text = ai_response.text
    except Exception as e:
        reply_text = f"Error contacting AI server: {e}"

    return {"reply": reply_text}
