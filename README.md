# Resume Builder SaaS (Next.js)

A complete resume builder SaaS: 62 templates, AI-powered ATS analysis, MongoDB-backed user accounts.

## Quick start

```bash
cd nextjs-app
cp .env.example .env.local
# edit .env.local — set MONGODB_URI and NEXTAUTH_SECRET
npm install
npm run dev
```

Open http://localhost:3000.

## Stack

- **Next.js 14** App Router + TypeScript
- **MongoDB** via Mongoose
- **NextAuth** credentials provider (email + password, bcrypt)
- **Tailwind CSS** with a violet brand palette
- **Nunjucks** for server-side template rendering (62 templates ported from Jinja2)
- **Ollama** (gpt-oss:120b) for AI-powered ATS analysis — falls back to a rule-based engine when no API key is configured

## Routes

| Path | What |
|---|---|
| `/` | Landing page |
| `/login`, `/register` | Auth |
| `/dashboard` | User resumes list |
| `/builder` | Create / edit a resume |
| `/templates` | Browse all 62 templates |
| `/preview/[id]` | Live preview with a chosen template |
| `/ats` | AI-powered ATS analysis |

## API

| Method | Path | Auth | Body |
|---|---|---|---|
| POST | `/api/auth/register` | — | `{name, email, password}` |
| POST | `/api/auth/[...nextauth]` | — | NextAuth credentials |
| GET | `/api/resumes` | session | — |
| POST | `/api/resumes` | session | JSON Resume payload |
| GET | `/api/resumes/[id]` | session | — |
| PUT | `/api/resumes/[id]` | session | JSON Resume payload |
| DELETE | `/api/resumes/[id]` | session | — |
| POST | `/api/upload-resume` | session | `multipart/form-data` with PDF |
| GET | `/api/templates` | — | (paginated, searchable) |
| GET | `/api/templates/[id]` | — | — |
| POST | `/api/templates/[id]/render` | — | `{resume: <JSON Resume>}` |
| GET | `/api/templates/[id]/preview` | — | (uses sample or `?resumeId=`) |
| POST | `/api/ats-analyze` | — | `{resume: <JSON Resume>}` or `{resumeId: "..."}` |

## Deploying

- Vercel: connect repo, add env vars (`MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, optional `OLLAMA_API_KEY`).
- Self-hosted: `npm run build && npm start`.
