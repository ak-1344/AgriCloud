# Dockerized AI Chat Assistant

A full-stack AI Chat Assistant project with **server, client, and frontend** containers, using Docker for easy deployment and networking. This project allows you to interact with an AI model through a web-based chat UI, with seamless backend communication handled via Docker services.

---

## GitHub Description

**Dockerized AI Chat Assistant**: A full-stack project using Next.js, FastAPI, and Python AI backend. Fully containerized with Docker and Docker Compose. Features include:

* AI-powered chat responses
* FastAPI bridge for backend communication
* Next.js frontend with React + TypeScript
* Docker networking for seamless container communication
* CORS configured for host/frontend access

Perfect for developers who want a reproducible AI chat environment that runs anywhere with a single command.

---

## Project Structure

```
agri-assist/
│
├── server/                # AI server (Python, Flask or FastAPI)
│   ├── app.py             # main server logic
│   ├── requirements.txt
│   └── Dockerfile
│
├── client/                # FastAPI bridge (Python)
│   ├── backend.py         # FastAPI bridge logic
│   ├── config.py          # contains SERVER_URL = "http://server:5000"
│   ├── requirements.txt
│   └── Dockerfile
│
└── frontend/              # Next.js frontend (React + TS)
    ├── package.json
    ├── tsconfig.json
    ├── public/
    ├── src/
    └── Dockerfile
```

---

## Tech Stack

* **Server:** Python 3.11, FastAPI/Flask, AI/LLM backend
* **Client/Bridge:** Python 3.11, FastAPI, requests
* **Frontend:** Next.js 14, React, TypeScript, TailwindCSS
* **Containerization:** Docker, Docker Compose

---

## Docker Architecture

* **server:** Handles AI processing. Exposes port `5000`.
* **client:** FastAPI bridge between frontend and server. Exposes port `8000`. Uses CORS middleware to allow requests from frontend.
* **frontend:** Next.js chat UI. Exposes port `3000`. Fetches API from `client:8000` inside Docker network.

**Networking:**

* Docker Compose sets up an internal network.
* Containers communicate using service names (`server`, `client`).
* Frontend on host can access client via `localhost:8000`.

---

## Setup & Running

### 1. Clone repository

```bash
git clone <repo_url>
cd agri-assist
```

### 2. Build and run all services with Docker Compose

```bash
sudo docker-compose up --build
```

* Frontend → `http://localhost:3000`
* Client → `http://localhost:8000/chat` (can test via curl or Postman)
* Server → `http://localhost:5000` (optional direct access)

### 3. Test individually

**Server:**

```bash
sudo curl -X POST http://localhost:5000 -d "text=Hello"
```

**Client:**

```bash
sudo curl -X POST http://localhost:8000/chat -H "Content-Type: application/json" -d '{"message":"Hello"}'
```

**Frontend:** Open browser → `http://localhost:3000` → type message → see AI reply

### 4. Restart containers (if needed)

```bash
sudo docker-compose restart <container_name>
```

### 5. Stop and remove containers + network

```bash
sudo docker-compose down -v
```

---

## Key Features

* Fully Dockerized, reproducible environment
* Frontend → Client → Server → Frontend message flow
* CORS configured for host frontend → Docker client
* AI server responds dynamically to text input

---

## Notes

* Make sure to use **service names** for internal Docker communication (`client`, `server`).
* Frontend fetch URL inside Docker: `http://client:8000/chat`
* Client config points to server: `SERVER_URL = "http://server:5000"`
* Hot-reload development can be configured separately if needed.

---

