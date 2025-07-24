# FSS Virtual Assistant - FastAPI Backend

This repository contains the backend service for the FSS Virtual Assistant, a conversational AI application. It is built with FastAPI and connects to a MongoDB database to manage user sessions and conversation history. The backend handles user authentication, session management, and streams responses from a Large Language Model (LLM).

---

## ✨ Features

- **Asynchronous API**: Built with **FastAPI** for high performance.
- **Database Integration**: Uses **MongoDB** with the `motor` driver for non-blocking database operations.
- **LLM Streaming**: Streams responses directly from an LLM (e.g., Azure OpenAI) for a real-time chat experience.
- **Session Management**: Endpoints to create, retrieve, rename, and delete user chat sessions.
- **Data Validation**: Uses **Pydantic** for robust data validation and serialization.
- **Authentication**: Secure endpoints using a token-based authentication scheme.

---

## 🛠️ Tech Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (with `motor`)
- **LLM Integration**: [LangChain](https://www.langchain.com/) / [OpenAI SDK](https://github.com/openai/openai-python)
- **Async Server**: [Uvicorn](https://www.uvicorn.org/)
- **Data Models**: [Pydantic](https://pydantic.dev/)

---

## 🚀 Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- Python 3.10+
- A running MongoDB instance (local or cloud)

### 1. Clone the Repository

```bash
git clone [https://github.com/joao-cainglet/fss-va-2025.git](https://github.com/joao-cainglet/fss-va-2025.git)
cd fss-va-2025/backend


```

### 2. Create the virtual environment

```bash
python3 -m venv venv

source venv/bin/activate
```

### 3. Install requirements.txt

```bash
pip install -r requirements.txt
```

### 4. Run the application

```bash
uvicorn app.main:app --reload
```
