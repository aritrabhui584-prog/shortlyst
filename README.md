# Shortlyst - AI Resume Screener

Shortlyst is an AI-powered candidate evaluation tool that parses resume PDFs in-browser, analyzes candidate qualifications against job requirements using the Gemini API, and provides structured scores and fit assessments.

## Key Features

- **Interactive Drag & Drop Upload**: Multi-file PDF selection with chip management and enter/leave visual transitions.
- **In-Browser PDF Text Extraction**: Uses `pdfjs-dist` to extract resume text on the client without uploading raw files.
- **Serverless AI Candidate Scoring**: Powered by `@google/genai` (Gemini API) with structured JSON schema outputs (`gemini-2.5-flash`).
- **Ranked Candidate Dashboard**: Animating score badges, key skill tags, experience summaries, and AI fit assessments sorted by score.
- **Active Loading & Error States**: Rotating status messages during evaluation, skeleton loaders with shimmer effects, and dismissible inline error handling.
- **Responsive & Accessible Design**: Dark-theme design tokens, keyboard focus states, smooth 300ms page view transitions, and 375px mobile breakpoint support.

## Tech Stack

- **Frontend**: React 18, Vite, Lucide React Icons
- **PDF Extraction**: `pdfjs-dist`
- **Backend / API**: Express, Node.js serverless handler
- **AI Model**: `@google/genai` SDK (`gemini-2.5-flash`)
- **Styling**: Tailwind CSS & CSS Custom Property Tokens (`src/styles/tokens.css`)

## Project Structure

```
├── api/
│   └── screen.js            # Serverless screening endpoint with Gemini AI
├── public/
│   └── favicon.svg          # Shortlyst app logo
├── src/
│   ├── components/
│   │   ├── CandidateCard.jsx # Candidate evaluation card with score badge
│   │   ├── EmptyState.jsx    # Initial empty state placeholder
│   │   ├── JobDescriptionInput.jsx # Labeled job description textarea with char counter
│   │   ├── LoadingState.jsx  # Shimmer skeleton loader with rotating status
│   │   ├── ResultsList.jsx   # Ranked candidate list with top match highlights
│   │   ├── ScoreBadge.jsx    # Color-coded animated score circle (0 to 10)
│   │   └── UploadZone.jsx    # Drag-and-drop PDF upload area with animated chips
│   ├── lib/
│   │   ├── api.js            # API fetch client for /api/screen
│   │   └── pdfExtract.js     # In-browser PDF text extractor
│   ├── styles/
│   │   └── tokens.css        # Dark theme color tokens & CSS keyframes
│   ├── App.jsx               # Two-column interactive layout
│   └── main.jsx              # React app entry point
├── server.ts                 # Full-stack Express server entry point
└── package.json              # Build scripts and dependencies
```

## Getting Started

1. **Environment Setup**:
   Ensure `GEMINI_API_KEY` is configured in your environment or `.env` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

2. **Development**:
   Start the local development server:
   ```bash
   npm run dev
   ```

3. **Build & Production**:
   Build the frontend bundle and server, then start the production server:
   ```bash
   npm run build
   npm run start
   ```
