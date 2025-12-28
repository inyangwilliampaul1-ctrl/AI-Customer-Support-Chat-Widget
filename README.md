# AI Customer Support Widget (SaaS)

![Project Status](https://img.shields.io/badge/status-live-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Tech Stack](https://img.shields.io/badge/stack-Next.js_|_Supabase_|_OpenAI-black)

A full-stack **SaaS (Software as a Service)** platform that allows businesses to create their own **AI-powered Customer Support Chat Widget**. 

Business owners can sign up, upload their "Frequently Asked Questions" (FAQs), and generate a simple JavaScript snippet to embed a smart chat assistant on their extensive website. The AI answers customer queries accurately based *only* on the provided business data.

---

## 🚀 Features

### For Business Owners (SaaS Dashboard)
- **Secure Authentication**: Implementation using Supabase Auth (Email/Password).
- **Business Profile Management**: rigorous isolation of data using Row Level Security (RLS).
- **Knowledge Base (FAQs)**: Simple interface to Add, Edit, and Delete FAQs that train the AI.
- **Live Preview**: Test the AI chat widget directly within the dashboard before deploying.
- **One-Click Integration**: logical generation of a `<script>` tag for easy website embedding.

### For End-Users (The Widget)
- **Smart AI Responses**: Powered by **OpenAI GPT-4o-mini**, providing human-like answers.
- **Context-Aware**: Strictly adheres to the business's specific FAQs to prevent hallucinations.
- **Lightweight**: Minimalist, fast-loading, and responsive design.
- **Universal Compatibility**: Works on WordPress, Shopify, Wix, Webflow, and custom HTML sites.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **AI Model**: [OpenAI API](https://openai.com/) (GPT-4o-mini)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📦 Getting Started (Local Development)

Follow these steps to run the project locally on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/inyangwilliampaul1-ctrl/AI-Customer-Support-Chat-Widget.git
cd AI-Customer-Support-Chat-Widget
```

### 2. Install Dependencies
```bash
npm install
```
*(Note: We use `legacy-peer-deps` in .npmrc to ensure compatibility with React 19)*

### 3. Environment Setup
Create a `.env.local` file in the root directory and add your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### 4. Database Setup (Supabase)
Run the SQL migrations located in `supabase/migrations` or use the Supabase Dashboard SQL Editor to create:
- `businesses` table
- `faqs` table
- `get_business_by_api_key` (RPC function)
- `get_faqs_by_api_key` (RPC function)

### 5. Run the Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🔌 Embedding the Widget

To use the widget on an external site, simply add this code to your HTML `<body>`:

```html
<script 
  src="https://your-vercel-domain.vercel.app/widget.js" 
  data-api-key="YOUR_BUSINESS_API_KEY">
</script>
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Built with ❤️ by [Inyang William Paul](https://github.com/inyangwilliampaul1-ctrl)
