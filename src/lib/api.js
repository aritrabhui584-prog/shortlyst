/**
 * api.js — Frontend API client for resume screening
 *
 * Sends job description and extracted resume texts to the Vercel serverless
 * function at /api/screen, which forwards them to the Google Gemini API
 * for AI-powered candidate scoring and ranking.
 */

/**
 * POSTs job description and extracted resume texts to the backend screening API.
 * @param {string} jobDescription - Target job requirements text
 * @param {Array<{filename: string, text: string}>} resumes - Array of candidate resumes
 * @returns {Promise<{results: Array<{name: string, filename: string, years_experience: number, key_skills: string[], score: number, reasoning: string}>}>}
 */
export async function postForScoring(jobDescription, resumes) {
  let response;
  try {
    response = await fetch('/api/screen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobDescription,
        resumes
      })
    });
  } catch (_error) {
    throw new Error('Unable to reach the screening service');
  }

  if (!response.ok) {
    let errorMessage = 'Failed to screen candidates';
    try {
      const errData = await response.json();
      if (errData && (errData.error || errData.message)) {
        errorMessage = errData.error === 'Method Not Allowed'
          ? errData.message
          : errData.error;
      }
    } catch (_e) {
      // Ignore JSON parse error
    }
    throw new Error(errorMessage);
  }

  try {
    return await response.json();
  } catch (_error) {
    throw new Error('The screening service returned an invalid response');
  }
}
