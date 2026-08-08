# Shortlyst — Vercel Production Deployment Guide

This guide provides step-by-step instructions for deploying **Shortlyst** to Vercel (React 19 Vite Frontend + Node.js Serverless API Function `/api/screen`).

---

## 📋 Required Environment Variables

| Variable Name | Required | Description | Where to Get |
|---|:---:|---|---|
| `GEMINI_API_KEY` | **Yes** | Google Gemini API key used by `/api/screen` to score candidate resumes | [Google AI Studio](https://aistudio.google.com/apikey) |

> 🔒 **Security Note**: The `GEMINI_API_KEY` is consumed **strictly server-side** by the Vercel serverless function (`api/screen.js`). It is never exposed to the client bundle or browser network logs.

---

## 🚀 Option 1: Deploy via Vercel Web Dashboard (Recommended)

### Step 1: Push Repository to GitHub
Ensure your repository is pushed to your GitHub account:
```bash
git add .
git commit -m "Shortlyst submission build"
git push origin main
```

### Step 2: Import Project in Vercel
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** → **"Project"**.
3. Import your `shortlyst` GitHub repository.

### Step 3: Configure Project Settings
- **Framework Preset**: `Vite`
- **Root Directory**: `./` (leave default)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 4: Add Environment Variable
Under the **Environment Variables** section:
- **Key**: `GEMINI_API_KEY`
- **Value**: `your_actual_gemini_api_key_here`
- Select Environments: **Production**, **Preview**, **Development**
- Click **Add**.

### Step 5: Deploy
Click **Deploy**. Vercel will automatically build the React Vite bundle and deploy the Node serverless function at `/api/screen`.

Your live URL will be generated at `https://<your-project-name>.vercel.app`.

---

## ⚡ Option 2: Deploy via Vercel CLI

If you prefer command-line deployment:

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Log in to Vercel
vercel login

# 3. Deploy to production with environment variable
vercel --prod -e GEMINI_API_KEY="your_actual_gemini_api_key_here"
```

---

## 🧪 Post-Deployment Verification Checklist

After deployment completes, open your live Vercel URL and test:

1. **Landing Page**: Verify hero video background plays cleanly and poster fallback renders instantly.
2. **Authentication**: Click **Sign In** → enter a work email & password → click **Sign In to Screener**.
3. **Screening Pipeline**:
   - Paste a sample Job Description into the text area.
   - Drag & drop 2–3 sample PDF resumes.
   - Click **Screen Candidates**.
4. **Scoring Results**: Confirm Gemini 2.5 Flash returns candidate match scores (1–10), skill chips, and written reasoning.
5. **Exporting**: Click **Export** → download CSV spreadsheet & JSON formats.

---

## 🔧 Production Troubleshooting

- **500 Internal Server Error on Screening**: Verify `GEMINI_API_KEY` is set in Vercel Dashboard under **Settings** → **Environment Variables** and trigger a redeploy (**Deployments** → **Redeploy**).
- **PDF Extraction Error**: Mozilla PDF.js runs client-side in the browser, so PDF files never leave the user's device. No additional server setup is required for PDF parsing.
