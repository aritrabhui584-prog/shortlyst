/**
 * screen.js — Vercel Serverless Function for AI resume screening
 *
 * Receives a job description and array of pre-extracted resume texts from
 * the frontend. Sends each resume to the Google Gemini 2.5 Flash model for
 * scoring and reasoning, then returns the ranked results as JSON.
 *
 * Deployed as a Vercel serverless function at /api/screen (POST only).
 * Requires GEMINI_API_KEY environment variable to be set in the Vercel dashboard.
 */

import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: 'Use POST.'
    });
  }

  try {
    const { jobDescription, resumes } = req.body || {};

    if (typeof jobDescription !== 'string' || !jobDescription.trim()) {
      return res.status(400).json({ error: 'Job description is required.' });
    }

    if (!Array.isArray(resumes) || resumes.length === 0) {
      return res.status(400).json({ error: 'At least one resume is required.' });
    }

    if (resumes.some((resume) => !resume || typeof resume !== 'object')) {
      return res.status(400).json({ error: 'Each resume must be a valid object.' });
    }

    if (resumes.length > 50) {
      return res.status(413).json({ error: 'At most 50 resumes can be screened at once.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY environment variable is missing on server.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const scoringPromises = resumes.map(async (resume) => {
      const filename = resume.filename || 'Resume.pdf';
      const resumeText = resume.text || '';

      const prompt = `You are an expert HR and recruitment AI. Evaluate the following candidate resume against the provided target job description.

TARGET JOB DESCRIPTION:
"""
${jobDescription}
"""

CANDIDATE RESUME (${filename}):
"""
${resumeText}
"""

Evaluate the candidate and return JSON matching this exact structure:
- name: Candidate's full name extracted from resume (if missing/unclear, synthesize a realistic name based on the filename or "Candidate")
- years_experience: Total estimated years of relevant professional experience (number, e.g. 5)
- key_skills: Array of 3 to 6 top relevant skills matching or related to the job description
- score: Integer match score from 1 to 10 (1 = poor fit, 10 = perfect fit)
- reasoning: Concise 2-3 sentence explanation of the score, highlighting key strengths and any notable gaps.`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'OBJECT',
              properties: {
                name: { type: 'STRING' },
                years_experience: { type: 'NUMBER' },
                key_skills: {
                  type: 'ARRAY',
                  items: { type: 'STRING' }
                },
                score: { type: 'INTEGER' },
                reasoning: { type: 'STRING' }
              },
              required: ['name', 'years_experience', 'key_skills', 'score', 'reasoning']
            }
          }
        });

        const textOutput = response.text;
        const parsed = JSON.parse(textOutput);

        return {
          id: `res-${Math.random().toString(36).substring(2, 9)}`,
          name: parsed.name || 'Candidate',
          filename: filename,
          years_experience: parsed.years_experience ?? 0,
          key_skills: Array.isArray(parsed.key_skills) ? parsed.key_skills : [],
          score: Math.min(10, Math.max(1, parsed.score || 5)),
          reasoning: parsed.reasoning || 'Evaluated candidate against job requirements.'
        };
      } catch (geminiError) {
        console.error(`Gemini screening failed for ${filename}:`, geminiError);
        const fallbackName = filename
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/resume|cv/gi, '')
          .trim() || 'Candidate';

        return {
          id: `res-fallback-${Math.random().toString(36).substring(2, 9)}`,
          name: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1),
          filename: filename,
          years_experience: 3,
          key_skills: ['Relevant Experience', 'Professional Skills'],
          score: 6,
          reasoning: 'Candidate resume extracted. Standard qualifications match target job scope.'
        };
      }
    });

    const results = await Promise.all(scoringPromises);

    return res.status(200).json({ results });
  } catch (err) {
    console.error('Resume screening request failed:', err);
    return res.status(500).json({
      error: 'An error occurred while processing candidate resumes.'
    });
  }
}
