# 🧠 T3 Chat Clone — Multi-LLM Chat App

**T3 Chat Clone** is a powerful multi-agent AI chat application that lets users talk to various LLMs through a single, unified interface. Built using **Next.js** for the frontend, **NestJS** for the backend, and a **Python**-based LLM server.

Designed for speed, simplicity, and seamless AI interaction — all wrapped in a slick UI.

---

## ⚡ Key Features

- Chat with multiple AI agents from one place
- Secure backend with JWT-based auth
- Persistent conversation history
- Easy to extend and customize
- Responsive and modern UI with shadcn/ui

---

## 🛠 Tech Stack

- **Frontend**: Next.js, TailwindCSS, shadcn/ui
- **Backend**: NestJS, PostgreSQL
- **LLM Server**: Python + FastAPI

---

## 🚀 Getting Started

### 1. Clone the Project

```bash
git https://github.com/VrajDarji/T3-Cloneathon.git
cd T3-Cloneathon
```

### 2. Setup Frontend

```bash
cd client
npm install
npm run dev
```

### 3. Setup Backend

```bash
cd server
npm install
npm run start:dev
```

### 4. Setup LLM Server

```bash
cd llm-server
pip install -r requirements.txt
uvicorn main:app --reload
```

## 🏁 License

This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.

---
