# 🕰️ MemoryLane

<div align="center">

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

### 🔐 **Secure Authentication**
- Email/Password with bcrypt hashing
- Google OAuth integration
- JWT session management
- Protected routes via middleware

### 🤖 **AI-Powered Assistance**
- Smart caption generation
- Content summarization
- Description enhancement
- Memory idea suggestions
*Powered by Google Gemini 2.0 Flash*

### ⏳ **Smart Capsule Management**
- 4-step creation wizard
- Theme-based organization
- Flexible privacy controls
- Automatic scheduled unlocking

</td>
<td width="50%">

### 👥 **Collaboration System**
- Invite contributors to capsules
- Multi-user media uploads
- Role-based permissions
- Real-time updates

### 💬 **Interactive Engagement**
- Emoji reactions (❤️ ✨ 😢 🙏 🎉)
- Threaded comments
- Post-unlock discussions
- Community sharing

### 📧 **Smart Notifications**
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

```
Step 1: Details     → Title, description, theme, privacy, AI suggestions
Step 2: Media       → Upload images/videos/audio/PDFs with AI captions
Step 3: Recipients  → Add collaborators, set unlock date/time
Step 4: Review      → Confirm all settings before creation
```

### Supported Themes

| Theme | Icon | Theme | Icon |
|-------|------|-------|------|
| Childhood | 🧒 | Wedding | 💒 |
| Family History | 👨‍👩‍👧‍👦 | Travel Adventures | ✈️ |
| College Years | 🎓 | Career Milestones | 🏆 |
| Friendship | 🤝 | Other | 📦 |

### Media Upload Specifications

| Type | Max Files | Size Limit | Format |
|------|-----------|------------|--------|
| **Images** | 10 | 4MB each | JPG, PNG, GIF, WebP |
| **Videos** | 5 | 128MB each | MP4, MOV, AVI |
| **Audio** | 10 | 32MB each | MP3, WAV, OGG |
| **PDFs** | 5 | 16MB each | PDF |

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="20%">
<img src="https://cdn.simpleicons.org/nextdotjs/000000" width="48" height="48" alt="Next.js"/><br/>
<b>Next.js 14</b><br/>
<sub>App Router</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.simpleicons.org/typescript/3178C6" width="48" height="48" alt="TypeScript"/><br/>
<b>TypeScript</b><br/>
<sub>Type Safety</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.simpleicons.org/mongodb/47A248" width="48" height="48" alt="MongoDB"/><br/>
<b>MongoDB</b><br/>
<sub>Database</sub>
</td>
<td align="center" width="20%">
<img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" width="48" height="48" alt="Tailwind"/><br/>
<b>Tailwind CSS</b><br/>
<sub>Styling</sub>
</td>
<td align="center" width="20%">
<img src="https://authjs.dev/img/logo-sm.png" width="48" height="48" alt="NextAuth"/><br/>
<b>NextAuth.js</b><br/>
<sub>Authentication</sub>
</td>
</tr>
</table>

**Additional Technologies:** shadcn/ui • Radix UI • UploadThing • Google Gemini AI • Nodemailer

---

## 🚀 Quick Start

### Prerequisites

Ensure you have the following installed:

- **Node.js** v18+ and npm v9+
- **MongoDB** (local or Atlas cluster)
- **Google Cloud** project for OAuth
- **UploadThing** account
- **Google AI API** key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/memorylane.git
cd memorylane

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev

# Open your browser
# Navigate to http://localhost:3000
```

---

## 🔑 Environment Configuration

Create a `.env.local` file with the following variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/memorylane

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# File Uploads
UPLOADTHING_SECRET=sk_live_xxxxx
UPLOADTHING_APP_ID=your-app-id

# AI Features
GEMINI_API_KEY=your-gemini-api-key

# Email Notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=MemoryLane <noreply@memorylane.com>

# Cron Jobs (Optional)
CRON_SECRET=your-cron-secret-for-scheduled-jobs
```

> **📌 Note:** For Gmail SMTP, you'll need to generate an [App Password](https://support.google.com/accounts/answer/185833)

---

## 📂 Project Structure

```
memorylane/
├── 📁 app/
│   ├── 🔒 (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── 🌐 api/
│   │   ├── auth/
│   │   ├── capsules/
│   │   ├── cron/unlock/
│   │   └── uploadthing/
│   ├── 📦 capsule/[id]/upload/
│   ├── ➕ create/capsule/
│   ├── 📊 dashboard/
│   │   ├── capsules/
│   │   └── collections/
│   ├── 🔓 unlocked/[id]/
│   └── 🏠 page.tsx
├── 🧩 components/
│   ├── ui/                    # shadcn components
│   ├── AiAssistant.tsx
│   ├── CapsuleCard.tsx
│   ├── CountdownTimer.tsx
│   ├── ReactionBar.tsx
│   └── CommentSection.tsx
├── 📚 lib/
│   ├── ai.ts                  # Gemini integration
│   ├── auth.ts                # NextAuth config
│   ├── db.ts                  # MongoDB connection
│   ├── email.ts               # Nodemailer utilities
│   └── uploadthing.ts
├── 🗃️ models/
│   ├── Capsule.ts
│   ├── User.ts
│   ├── Media.ts
│   ├── Reaction.ts
│   └── Comment.ts
└── 📄 package.json
```

---

## 📡 API Reference

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create new user account |
| `*` | `/api/auth/[...nextauth]` | NextAuth.js handler (login/callback) |

### Capsule Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/capsules/create` | Create new time capsule | ✅ |
| `POST` | `/api/capsules/uploadmedia` | Add media to capsule | ✅ |
| `POST` | `/api/capsules/[id]/unlock` | Manually unlock capsule | ✅ (Owner) |
| `POST` | `/api/capsules/collaborate` | Add collaborator | ✅ (Owner) |
| `POST` | `/api/capsules/react` | Add/toggle emoji reaction | ✅ |
| `POST` | `/api/capsules/comment` | Post a comment | ✅ |

### AI Features

| Method | Endpoint | Action | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/capsules/ai` | `generateCaption` | Create media captions (<100 chars) |
| `POST` | `/api/capsules/ai` | `summarize` | Condense text (<30 words) |
| `POST` | `/api/capsules/ai` | `enhance` | Rewrite vividly (<120 words) |
| `POST` | `/api/capsules/ai` | `suggest` | Generate 5 memory ideas |

### Automation

| Method | Endpoint | Description | Trigger |
|--------|----------|-------------|---------|
| `GET` | `/api/cron/unlock` | Auto-unlock due capsules | Hourly cron job |

---

## 🗄️ Database Schema

### Capsule Model

```typescript
{
  title: string
  description?: string
  ownerId: ObjectId → User
  collaborators: ObjectId[] → User
  recipientEmails: string[]
  unlockDate: Date
  status: 'locked' | 'unlocked'
  theme: 'Childhood' | 'Family History' | 'College Years' | 'Wedding' | 
         'Travel Adventures' | 'Career Milestones' | 'Friendship' | 'Other'
  privacy: 'private' | 'public' | 'recipients-only'
  mediaIds: ObjectId[] → Media
  timestamps: { createdAt, updatedAt }
}
```

### Additional Models

**User** • **Media** • **Reaction** • **Comment**

> Full schema documentation available in `/models` directory

---

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy with one click!

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Test thoroughly before submitting
- Update documentation as needed

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Special thanks to these amazing projects:

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [UploadThing](https://uploadthing.com/) - Simple file uploads for Next.js
- [Google Gemini](https://ai.google.dev/) - Powerful AI capabilities
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

<div align="center">

**Made with ❤️ for preserving memories**

[⬆ Back to Top](#-memorylane)

</div>
