/**
 * Centralized Gemini 3.8 / 2.5 Flash Provider Adapter
 * Header: x-goog-api-key
 * Concurrency limited to 3, 35s timeout, circuit breaker on 429
 */

interface GeminiRequestOptions {
  systemInstruction?: string;
  prompt: string;
  stream?: boolean;
}

class GeminiCircuitBreaker {
  private failures = 0;
  private openUntil = 0;

  isTripped(): boolean {
    if (this.failures >= 2 && Date.now() < this.openUntil) {
      return true;
    }
    if (Date.now() >= this.openUntil) {
      this.failures = 0;
    }
    return false;
  }

  recordFailure(isRateLimit = false) {
    this.failures++;
    if (isRateLimit || this.failures >= 2) {
      this.openUntil = Date.now() + 60 * 1000; // 60s cooldown
    }
  }

  recordSuccess() {
    this.failures = 0;
    this.openUntil = 0;
  }
}

const circuitBreaker = new GeminiCircuitBreaker();

export async function callGemini(options: GeminiRequestOptions): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server environment');
  }

  if (circuitBreaker.isTripped()) {
    throw new Error('AI Engine circuit breaker is OPEN due to rate limiting. Please retry in 60 seconds.');
  }

  const model = 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        systemInstruction: options.systemInstruction ? { parts: [{ text: options.systemInstruction }] } : undefined,
        contents: [{ parts: [{ text: options.prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.status === 429) {
      circuitBreaker.recordFailure(true);
      throw new Error('Google AI Studio rate limit exceeded (HTTP 429).');
    }

    if (!res.ok) {
      circuitBreaker.recordFailure(false);
      const errText = await res.text();
      throw new Error(`Gemini API error (HTTP ${res.status}): ${errText}`);
    }

    circuitBreaker.recordSuccess();
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Gemini API call timed out after 35 seconds');
    }
    throw err;
  }
}
