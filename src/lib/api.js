/**
 * POSTs job description and extracted resume texts to the backend screening API.
 * @param {string} jobDescription - Target job requirements text
 * @param {Array<{filename: string, text: string}>} resumes - Array of candidate resumes
 * @returns {Promise<{results: Array<{name: string, filename: string, years_experience: number, key_skills: string[], score: number, reasoning: string}>}>}
 */
export async function postForScoring(jobDescription, resumes) {
  const response = await fetch('/api/screen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      jobDescription,
      resumes
    })
  });

  if (!response.ok) {
    let errorMessage = 'Failed to screen candidates';
    try {
      const errData = await response.json();
      if (errData && errData.error) {
        errorMessage = errData.error;
      }
    } catch (e) {
      // Ignore JSON parse error
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
