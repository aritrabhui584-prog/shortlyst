# Shortlyst — AI-Powered Resume Screener & Hiring Portal

> **One-line tagline:** Instantly screen and rank candidate resumes using Google Gemini 2.5 Flash while maintaining 100% privacy with in-browser local PDF parsing and real-time Recruiter-Candidate outreach.

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React 18" />
  <img src="https://img.shields.io/badge/Gemini_2.5_Flash-AI-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini 2.5 Flash" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/PDF.js-6.2-FF6600?style=flat-square&logo=mozilla&logoColor=white" alt="PDF.js" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License" />
</p>

---

## ⚡ Problem

Recruiters spend hours manually screening resume backlogs to map qualifications. On the other hand, job seekers apply blindly without any feedback regarding their resume alignment against target requirements, leading to high friction on both sides of the recruitment pipeline.

---

## 💡 Solution

Shortlyst is a **connected recruiter-candidate screening portal** modeled after modern Applicant Tracking Systems (ATS).
- **Recruiters** conduct job offerings, toggle active hiring statuses, review candidate applications, view parsed candidate profiles (complete with contact info, experience details, and AI evaluation metrics), approve/reject candidates, and send direct outreach messages.
- **Candidates** go through a 5-step onboarding survey, check their resume match fit score (1–10) privately, view open vacancies mapped directly to their preferences, and receive real-time notifications about recruiter status updates.

Raw resumes stay strictly private; PDF text extraction runs **100% client-side in the browser** using Mozilla PDF.js. Only text tokens are forwarded to the serverless Gemini 2.5 Flash endpoint, keeping candidate data secure and storage-free.

---

## 🌐 Live Demo & Submission Links

| Artifact | Live Link | Status |
|---|---|:---:|
| 🌐 **Live Web Application** | [https://shortlyst.vercel.app](https://shortlyst.vercel.app) *(Replace with your live URL)* | 🟢 Live |
| 📦 **GitHub Repository** | [https://github.com/your-username/shortlyst](https://github.com/your-username/shortlyst) *(Replace with your repository)* | 🟢 Public |
| 📹 **LinkedIn Demonstration Video** | [https://linkedin.com/posts/your-post-id](https://linkedin.com/posts/your-post-id) *(Replace with your post)* | 🟢 Deployed |

---

## 🎬 Demo Preview

![Shortlyst Application Demo](./docs/demo.gif)

---

## ⚙️ AI Engine: Strict Candidate Screening Filters

To ensure recruiter dashboard rankings are accurate, the Gemini 2.5 Flash API evaluates resumes against job descriptions using a rigorous, zero-leniency scoring rubric:

1. **Experience Threshold Validation**:
   - Compares the candidate's actual history against the target requirements.
   - *Strict Penalty*: Candidates lacking the requested years of experience are capped at a maximum match score of `6.0/10` regardless of skill alignment.
2. **Core Technology Fit Penalities**:
   - Scans for essential skills (e.g., React, TypeScript, K8s). 
   - Lack of listed core/critical libraries incurs a deduction of up to `2.5 points` per missing primary stack component.
3. **Role Deviation Indexing**:
   - Evaluates if the candidate's historical trajectory aligns with the target role. A DevOps engineer applying for a UI/UX Designer role is flagged for misalignment and receives a heavy penalty.
4. **Structured JSON Validation**:
   - The API uses strict schema enforcement (`responseSchema`), returning clean data attributes:
     - `name`: Candidate's parsed full name.
     - `years_experience`: Verified experience count.
     - `score`: Double float fit rating from `1.0` to `10.0`.
     - `key_skills`: Parsed skills chips.
     - `reasoning`: Objective AI evaluation statement detailing strengths and gaps.

---

## ✨ Key Features

- **Recruiter Center (Supreme Portal)**:
  - **Job Offerings Manager**: Create and publish job openings with custom titles, salary bands, and descriptions. Toggling status between `Open` (green) and `Closed` (red) dynamically updates recruitment pipelines.
  - **ATS Leaderboard & Applicants Feed**: Automatically lists candidates who have applied to the selected job posting, ranked from best-to-worst using AI match scores.
  - **Interactive Candidate Profile Drawer**: Clicking "Profile" opens a detailed glassmorphic view of candidate details (mock email, phone number, location, LinkedIn) and AI evaluation metrics.
  - **Review & Approve Workflow**: Approve or reject candidates inside cards or the profile drawer. Approved cards highlight green; rejected cards dim to 55% opacity.
  - **Live Outreach Messages**: Dispatch direct interview invitation logs. Tapping send pushes live notifications to the candidate's mailbox.
- **Candidate Fit Portal**:
  - **Onboarding preference checklist**: 5-step survey to set career preferences, technology specialization, setup choice, and salary expectations.
  - **Jobs Market Hub**: Browse live vacancies published by recruiters and dynamically mapped to candidate preferences.
  - **Single Resume Fit Evaluation**: Drag & drop single PDF to calculate match scores, review skill tag gaps, and apply to job openings.
- **Visual Design & Aesthetics (Google Gemini UI Style)**:
  - **Google Gemini Typography**: Large headings feature the iconic Gemini text-gradient, flowing from cyan-blue to purple-magenta.
  - **Pill Button Styles**: Core action buttons are shaped as rounded pills (`border-radius: 9999px`) with glowing gradient drop shadows.
  - **Frosted Blue Neon Glassmorphism**: Cards feature translucent backdrops, frosted borders, and glowing neon-blue LED lighting shadows.
  - **Theme Switcher**: Fully integrated Light/Dark mode switcher. Header navbar contrast bugs are resolved using theme-aware variables.
- **Sandbox Console**: Features a **Mock AI Toggle** and a **1-Click Demo** button to populate forms and screen mock candidates locally without API keys.

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite 6, React Router v7 | Component SPA framework & client-side route tracking |
| **Styling** | Vanilla CSS (Custom Design Tokens) | Frost Glassmorphism & Neon Shadows (`tokens.css`) |
| **AI Engine** | Google Gemini 2.5 Flash | Structured resume evaluation via `@google/genai` |
| **PDF Processing** | Mozilla PDF.js 6.2 | Local in-browser text stream extraction |
| **Icons & Motion** | Lucide React, GPU Keyframes | UI icon set & floating backdrop blur transitions |
| **Backend** | Vercel Serverless Functions | `/api/screen` Node.js serverless API endpoint |

---

## 🏗️ Architecture / How It Works

```
   Candidate Portal                              Recruiter Center
   ────────────────                              ────────────────
 ┌───────────────────┐                         ┌──────────────────┐
 │ Onboarding Survey │                         │ Manage Open Jobs │
 └─────────▼─────────┘                         └────────┬─────────┘
           │                                            │
           ▼                                            ▼
 ┌───────────────────┐  Local PDF.js parsing   ┌──────────────────┐
 │   Upload Resume   │────────────────────────▶│ Upload Batch JDs │
 └─────────┬─────────┘ (Privacy Text Stream)   └────────┬─────────┘
           │                                            │
           ▼                                            ▼
 ┌───────────────────┐                         ┌──────────────────┐
 │  Check Match Fit  │◀───[ Gemini Scoring ]──▶│ Review / Approve │
 └─────────▲─────────┘                         └────────┬─────────┘
           │                                            │
           └──────────────────[ Live Chat ]─────────────┘
```

### Directory Overview

```
shortlyst/
├── api/
│   └── screen.js              # Vercel serverless — Gemini 2.5 Flash scoring
├── demo-resumes/              # Evaluator sample data directory
│   ├── Alex_Rivera_Frontend_Engineer.pdf
│   ├── Elena_Rostova_Data_Analyst.pdf
│   ├── Marcus_Chen_DevOps_Engineer.pdf
│   └── README.md              # Demo instructions & cross-screening guide
├── docs/
│   ├── demo.gif               # Walkthrough preview GIF
│   └── demo-guide.md          # Recording storyboard guide
├── public/
│   ├── favicon.svg            # Brand favicon
│   └── logo.png               # Shortlyst brand logo
├── src/
│   ├── assets/
│   │   ├── hero-bg.mp4        # Loop backdrop video
│   │   └── hero-poster.svg    # Static SVG poster fallback
│   ├── components/
│   │   ├── CandidateCard.jsx  # Candidate card with score & DM buttons
│   │   ├── EmptyState.jsx     # Dashboard empty state
│   │   ├── FAQ.jsx            # Accordion FAQ panel
│   │   ├── GlobalBackground.jsx # Universal path-aware loop video backdrop
│   │   ├── InputField.jsx     # Shared form field with explicit icon padding
│   │   ├── JobDescriptionInput.jsx # JD textarea with char counter
│   │   ├── LoadingState.jsx   # Shimmer skeleton loader
│   │   ├── Navbar.jsx         # Header navigation bar + outreach inbox
│   │   ├── PipelineSection.jsx # Visual connecting workflow grid
│   │   ├── ProtectedRoute.jsx # Dynamic role routing guard wrapper
│   │   ├── ResultsList.jsx    # Recruiter candidate leaderboard & exports
│   │   ├── ScoreBadge.jsx     # Animated score indicator
│   │   └── UploadZone.jsx     # Drag-and-drop file dropzone
│   ├── context/
│   │   └── AuthContext.jsx    # User role context & sessions provider
│   ├── lib/
│   │   ├── api.js             # API request client for /api/screen
│   │   └── pdfExtract.js      # Client-side PDF parser
│   ├── pages/
│   │   ├── LandingPage.jsx    # Public overview & workflow guide
│   │   ├── LoginPage.jsx      # Role selector & validation forms
│   │   ├── CandidateDashboard.jsx # Scoped candidate preferences & fit checker
│   │   └── ScreenerPage.jsx   # Recruiter batch uploader & job postings management
│   ├── styles/
│   │   └── tokens.css         # CSS design tokens, shadows, and themes
│   ├── App.jsx                # Route declarations
│   └── main.jsx               # React DOM mount entry
└── vercel.json                # Vercel endpoint routing configurations
```

---

## 🚀 Getting Started

### Quick Install & Local Run

```bash
# 1. Clone repository
git clone https://github.com/your-username/shortlyst.git
cd shortlyst

# 2. Install dependencies
npm install

# 3. Configure environment variable
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_key_here

# 4. Start local development server
npm run dev
# → http://localhost:5173
```

---

## 🧪 Running Sandbox Demo Test Data

To test the uploader workflow in **1-Click** without setting API keys:
1. Log in to Shortlyst as a **Recruiter**.
2. Click **"Load Sandbox Candidates"** at the top of the card. The Sandbox console will instantly populate the uploader dropzone with 3 resumes and fill the job description textbox.
3. Review the results leaderboard: search skills, approve or reject candidates, click **"Contact Candidate"** or click **"Profile"** on approved profiles to inspect candidates.
4. Log out, then log in as a **Candidate** using the default credentials or a new account.
5. Go through the onboarding checklist. In the Candidate dashboard, click **"Notifications"** to see your recruiter interview invitation synced in real-time!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👥 Credits

Developed by **aritrabhui584** for the **PromptWars X Hacktropica** Hackathon event.
- Google Gemini API integration powered by the official `@google/genai` SDK.
- PDF parsing handled by Mozilla `pdfjs-dist`.
