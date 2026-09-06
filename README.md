<h1 align="center">📘 notesportal</h1>

<p align="center">
  <b>An AI-powered, collaborative note-sharing platform built by students, for students.</b><br/>
  Upload, organize, and search notes by subject — with AI helping you find and understand them faster.
</p>

<p align="center">
  🔗 <a href="https://notesportal.tech" target="_blank"><b>Visit notesportal</b></a>
</p>

---

## 🎨 About

notesportal makes academic resources **accessible, organized, and collaborative**. Students upload their notes, and everyone else can browse, search, favorite, and download them — organized by subject.

On top of that, notesportal layers a few AI features (smart subject search, a QnA engine, and a "chat with PDF" tool) to help students get straight to the answer instead of digging through files.

---

## 🚀 Features

- 📂 **Upload File** – Upload a PDF, which is stored in Cloudflare R2 with its metadata saved to Supabase.
- 🔍 **Index File** – On upload, the file is automatically extracted, chunked, and embedded so it becomes searchable.
- 🔎 **Smart Search** – Hybrid (keyword + semantic) search across subjects to surface the most relevant files.
- ❓ **Practice Q&A** – Auto-generates questions from a file's content and grades your answers with AI.
- 💬 **Chat with PDF** – Conversational Q&A directly against a specific uploaded file.
- ⭐ **Favorites** – Save frequently used notes for quick access.
- 📚 **My Files & Subject Management** – Manage your own uploads and add, remove, or favorite subjects.
- 🔐 **Email OTP Auth** – Simple signup/login flow with one-time-password email verification.
- 🎨 **Dynamic Theming** – Switch between preset and custom accent colors, applied instantly and persisted across sessions.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS 4, Framer Motion
- **Auth:** JWT (`jose`) + email OTP via Nodemailer
- **Database:** Supabase
- **File Storage:** Cloudflare R2 (presigned uploads/downloads)
- **AI:** Gemini-powered search, Q&A, and PDF chat
- **Analytics:** Vercel Analytics & Speed Insights

---

## 👥 Founders

**Arya Chawan · Arhaan Bhiwandkar · Bevin Johnson · Sharvil Gharkar**

---

## 🎯 Vision

To give students a **centralized, AI-assisted hub of academic resources** — making it easier to find, share, and actually learn from each other's notes.

---

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-notesportal-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Supabase-Powered-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Cloudflare%20R2-File%20Storage-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Gemini%20AI-Q%26A%20%26%20Chat-4285F4?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Student-Collaboration-6C63FF?style=for-the-badge" />
</p>
