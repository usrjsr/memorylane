# 🕰️ MemoryLane

<div align="center">

🎥 **Live Demo**

<video src="public/memorylane-demo.mp4" controls autoplay muted loop width="90%">
Your browser does not support the video tag.
</video>

<br/>

📽️ *A complete walkthrough of MemoryLane — capsule creation, media uploads, AI-powered features, collaboration, and unlocking experience.*

---

**Preserve precious memories in digital time capsules that unlock on special dates**

Create, collaborate, and relive cherished moments with photos, videos, audio, and heartfelt messages.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Demo](#) • [Documentation](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## ✨ Features at a Glance

<table>
<tr>
<td width="50%">

### 🔐 Secure Authentication
- Email/Password with bcrypt hashing
- Google OAuth integration
- JWT session management
- Protected routes via middleware

### 🤖 AI-Powered Assistance
- Smart caption generation
- Content summarization
- Description enhancement
- Memory idea suggestions  
*Powered by Google Gemini 2.0 Flash*

### ⏳ Smart Capsule Management
- 4-step creation wizard
- Theme-based organization
- Flexible privacy controls
- Automatic scheduled unlocking

</td>
<td width="50%">

### 👥 Collaboration System
- Invite contributors to capsules
- Multi-user media uploads
- Role-based permissions
- Real-time updates

### 💬 Interactive Engagement
- Emoji reactions (❤️ ✨ 😢 🙏 🎉)
- Threaded comments
- Post-unlock discussions
- Community sharing

### 📧 Smart Notifications
- Creation confirmations
- Unlock alerts
- Collaborator invites
- Email via Nodemailer/SMTP

</td>
</tr>
</table>

---

## 🎯 Core Capabilities

### Capsule Creation Wizard

Navigate through a seamless 4-step process:





---

## 🎨 Supported Themes

| Theme | Icon | Theme | Icon |
|------|------|------|------|
| Childhood | 🧒 | Wedding | 💒 |
| Family History | 👨‍👩‍👧‍👦 | Travel Adventures | ✈️ |
| College Years | 🎓 | Career Milestones | 🏆 |
| Friendship | 🤝 | Other | 📦 |

---

## 📁 Media Upload Specifications

| Type | Max Files | Size Limit | Format |
|----|----|----|----|
| Images | 10 | 4MB | JPG, PNG, GIF, WebP |
| Videos | 5 | 128MB | MP4, MOV, AVI |
| Audio | 10 | 32MB | MP3, WAV, OGG |
| PDFs | 5 | 16MB | PDF |

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Styling:** Tailwind CSS
- **UI:** shadcn/ui, Radix UI
- **Auth:** NextAuth.js (Google OAuth + Credentials)
- **Uploads:** UploadThing
- **AI:** Google Gemini API
- **Emails:** Nodemailer (SMTP)
- **Deployment:** Vercel

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Google OAuth credentials
- UploadThing account
- Gemini API key

### Installation

```bash
git clone https://github.com/your-username/memorylane.git
cd memorylane
npm install
cp .env.example .env.local
npm run dev
