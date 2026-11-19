import { describe, it, expect, vi } from 'vitest';
import { postForScoring } from './api';

// Mock the global fetch object
global.fetch = vi.fn();

describe('postForScoring API client helper tests', () => {
  it('should format request payloads correctly and return JSON results on HTTP 200 OK', async () => {
    const mockResponse = {
      results: [
        {
          name: 'Alex Rivera',
          filename: 'Alex_Rivera_Frontend_Engineer.pdf',
          years_experience: 6,
          key_skills: ['React', 'TypeScript', 'Node.js'],
          score: 9.2,
          reasoning: 'Exceptional match for the frontend role.'
        }
      ]
    };

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const jd = 'Senior Frontend Developer';
    const resumes = [{ filename: 'Alex_Rivera_Frontend_Engineer.pdf', text: '6 years experience with React.' }];

    const result = await postForScoring(jd, resumes);

    expect(fetch).toHaveBeenCalledWith('/api/screen', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobDescription: jd,
        resumes
      })
    });
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error with backend message when response is not OK', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Google Gemini API quota exceeded.' })
    });

    await expect(postForScoring('DevOps', [])).rejects.toThrow('Google Gemini API quota exceeded.');
  });

  it('should fallback to default error message if error JSON parsing fails', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => { throw new Error('Bad JSON response'); }
    });

    await expect(postForScoring('UX Designer', [])).rejects.toThrow('Failed to screen candidates');
  });

  it('should report network failures clearly', async () => {
    fetch.mockRejectedValueOnce(new Error('Network unavailable'));

    await expect(postForScoring('Designer', [])).rejects.toThrow('Unable to reach the screening service');
  });

  it('should reject invalid successful responses', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => { throw new Error('Bad JSON response'); }
    });

    await expect(postForScoring('Engineer', [])).rejects.toThrow('The screening service returned an invalid response');
  });
});
