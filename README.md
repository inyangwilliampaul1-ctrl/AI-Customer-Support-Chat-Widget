AI Customer Support Chat Widget (SaaS)

A production-ready, multi-tenant AI customer support platform that allows businesses to deploy an AI-powered chat widget trained on their own FAQs.  
Each business has isolated data, secure authentication, persistent chat history, and an AI assistant powered by **Google AI Studio (Gemini)**.

This project demonstrates real-world SaaS architecture, secure backend design, and practical AI integration.

---

## 🚀 Key Features

- 🔐 Secure authentication with Supabase Auth
- 🏢 Business management (one user → one business)
- 📚 FAQ knowledge base per business
- 🤖 AI-powered customer support (Google AI Studio / Gemini)
- 💬 Persistent chats and message history
- 🔒 Row Level Security (RLS) on all tables
- 🧩 Multi-tenant SaaS architecture
- ⚡ Next.js App Router + Server Actions
- 🎨 Modern UI with Tailwind CSS

---

## 🏗️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

### Backend
- Supabase (PostgreSQL, Auth, RLS)
- Server Actions & API Routes
- Google AI Studio (Gemini)

### Infrastructure
- PostgreSQL migrations
- Secure environment variables
- SaaS-ready project structure

---

## 🧠 How the AI Chat Works

1. A user sends a message through the chat widget
2. The system identifies the business
3. Relevant FAQs are fetched from the database
4. FAQs + user message are sent to Google AI Studio
5. The AI generates a professional support response
6. Messages are saved to the database
7. The response is returned to the user

Each business has its **own isolated AI assistant**, trained only on its data.

---

## 🔐 Security & Multi-Tenancy

- Row Level Security (RLS) enforced on all tables
- Users can only access data tied to their business
- No cross-business data leakage
- Secure server-side AI requests
