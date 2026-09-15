<div align="center">
<img width="100" height="100" alt="Agaaw_logo_noBG" src="https://github.com/user-attachments/assets/e58a0675-b9b3-4399-ac8d-6a5a9c39879a" />

#  Agaaw
### *Fly to Your Future*

**A study-abroad and scholarship platform connecting students with verified peer mentors — real students already studying abroad.**

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)

[Live Demo](www.agaaw.com)

</div>

## 🎯 The Problem

Every year, thousands of students across Bangladesh and South Asia dream of studying abroad — but the path to get there is broken:

- **Information is scattered** across forums, Facebook groups, and outdated blog posts, with no single trusted source for scholarships, visa requirements, or university options.
- **Fraudulent consultancy agencies** charge large, often opaque fees while offering generic advice from staff who have never studied abroad themselves.
- **Authentic peer guidance is nearly impossible to find** — the people best positioned to help (students who've actually made the journey) have no platform to be discovered or to monetize their expertise.

The result: talented students either give up on their ambitions or lose significant money and time to unreliable middlemen.

## ✅ The Solution

**Agaaw** is an all-in-one platform that replaces guesswork and fraud with **verified peer mentorship**. Students get direct access to real, currently-enrolled international students — not agencies — for guidance on everything from choosing a country to writing a Statement of Purpose to preparing for a visa interview.

At the same time, Agaaw gives students already studying abroad a way to **monetize their experience** as mentors, creating a two-sided marketplace built on trust, verification, and lived experience rather than paid advertising.

---

## 🔗 Live Demo

**https://www.agaaw.com**

## ✨ Feature Overview

### For Students
- 🔐 Role-based registration with **OAuth (Google / Facebook)** — choose Student or Mentor at sign-up
- 🧭 Personalized dashboard: scholarship feed, saved universities, saved mentors, application status
- 🎓 Browse curated **scholarships** (DAAD, Erasmus Mundus, MEXT, Chevening, Fulbright, Swedish Institute, and more) and **country profiles** (visa rules, tuition, work rights, top universities)
- 🤝 Post a mentorship request and receive bids from mentors — an Upwork-style matching flow
- 📝 **CV & SOP builder** — guided templates, section-based writing, live preview, multi-version drafts, export to DOCX/PDF
- 📁 Secure document vault for transcripts, LORs, and test scores with access-controlled sharing to a chosen mentor
- 📊 **Application tracker** with per-university status, assigned mentor, and deadline reminders
- 💬 Real-time chat with mentors
- 📹 Schedule and join **live 1:1 video mentorship sessions**, directly in-browser
- 📚 Resource hub / blog for study guides and scholarship tips

### For Mentors (Verified Students Abroad)
- 👤 Public, freelancer-style profile (Fiverr-style) with portfolio/blog to build credibility
- 💰 Set custom pricing per service — *CV/SOP Review*, *CV/SOP Review + Edit*, *Consultancy*, *Full Mentorship*
- 📥 Manage inbound mentorship requests and bids from students
- 🗓️ Schedule sessions and track total students mentored, active mentees, and income earned
- ✍️ Publish blog posts to reach and build trust with prospective mentees

### Platform-Wide / Admin
- 🌐 Bilingual content operations — platform content in English, with community outreach (Facebook) in Bengali
- 🛠️ Structured, reusable content pipelines for scholarship listings and country profiles
- 🔔 Real-time notification system (bookings, reschedules, cancellations, reminders) over WebSockets

---

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js, React.js |
| **Backend** | NestJS (Node.js + TypeScript) |
| **ORM** | Prisma |
| **Database** | PostgreSQL (managed via Neon) |
| **Authentication** | OAuth 2.0 (Google, Facebook) + JWT, enforced via NestJS Guards |
| **Real-Time Messaging** | Socket.io |
| **Video Conferencing** | Daily.co Prebuilt (embedded iframe, provider-agnostic interface) |
| **Payments** | Stripe (international), SSLCommerz (local/Bangladesh) |
| **File Storage** | Cloudflare R2 |
| **Cloud / Infra** | AWS (ECS Fargate, ALB, CloudFront, ElastiCache Redis, S3, SES) |
| **Deployment** | Vercel (frontend), Railway (backend) |
| **Version Control / CI** | GitHub — PR-based `dev` → `main` workflow with preview deploys |

---

## 🏗 System Architecture

```
┌─────────────────┐        ┌──────────────────────┐        ┌─────────────────┐
│   Next.js App    │◄──────►│   NestJS API (REST)   │◄──────►│   PostgreSQL     │
│   (Vercel)       │  HTTPS │   (Railway)           │ Prisma │   (Neon)         │
└────────┬─────────┘        └──────────┬───────────┘        └─────────────────┘
         │                             │
         │ WebSocket (Socket.io)       ├──► OAuth 2.0 (Google / Facebook)
         │                             ├──► Stripe / SSLCommerz (payments)
         ▼                             ├──► Cloudflare R2 (file storage)
┌──────────────────┐                   └──► Daily.co (video rooms + tokens)
│  Real-time layer  │
│  chat, notifications,
│  session events    │
└──────────────────┘
```

**Core domain modules:** Auth, Users/Profiles, Mentorship Connections, Sessions & Video, Scholarships, Countries, CV/SOP Builder, Document Management, Notifications, Payments.

---

## 👤 Author

**OmarFarukMaruf** — Founder & Technical Lead, Agaaw
Building the platform end-to-end: leading architecture decisions, backend/frontend code review, and production deployments, while also driving product content and growth.

- LinkedIn: [_omar-faruk-maruf_](https://www.linkedin.com/in/omar-faruk-maruf/)
- Portfolio: https://omarfarukmaruf.github.io
- Email: omarfaruk.maruff@gmail.com

---

## 📄 License

This project is currently proprietary — **© 2025–2026 Agaaw. All rights reserved.**
