/**
 * Official Fanar AI Provider Adapter
 * Provider: Qatar Computing Research Institute (QCRI)
 * Endpoint: https://api.fanar.qa/v1
 */

export interface FanarChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface FanarGenerateOptions {
  messages: FanarChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
}

export interface FanarGenerateResult {
  content: string;
  model: string;
  latencyMs: number;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface FanarModelInfo {
  id: string;
  object: string;
  owned_by: string;
}

export class FanarProviderAdapter {
  private baseUrl: string;
  private apiKey: string;
  private defaultModel: string;

  constructor() {
    this.baseUrl = (process.env.FANAR_BASE_URL || 'https://api.fanar.qa').replace(/\/$/, '');
    this.apiKey = process.env.FANAR_API_KEY || 'qvsh8QHpTecX6rcTj8z3olbUY91MpLil';
    this.defaultModel = process.env.FANAR_MODEL || 'Fanar';
  }

  public isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  /**
   * Tests connection to the official Fanar API
   */
  public async testConnection(): Promise<{ success: boolean; latencyMs: number; error?: string }> {
    if (!this.isConfigured()) {
      return { success: false, latencyMs: 0, error: 'FANAR_API_KEY is not configured.' };
    }

    const start = Date.now();
    try {
      const res = await fetch(`${this.baseUrl}/v1/models`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(12000),
      });

      const latencyMs = Date.now() - start;

      if (!res.ok) {
        return {
          success: false,
          latencyMs,
          error: `Fanar API returned status ${res.status}: ${res.statusText}`,
        };
      }

      return { success: true, latencyMs };
    } catch (err) {
      return {
        success: false,
        latencyMs: Date.now() - start,
        error: err instanceof Error ? err.message : 'Connection failed',
      };
    }
  }

  /**
   * Retrieves list of available models from Fanar
   */
  public async getModels(): Promise<FanarModelInfo[]> {
    const res = await fetch(`${this.baseUrl}/v1/models`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch Fanar models: ${res.statusText}`);
    }

    const data = await res.json();
    return data.models || [];
  }

  /**
   * Generates a chat response using Fanar API with retry and timeout
   */
  public async generateResponse(options: FanarGenerateOptions): Promise<FanarGenerateResult> {
    const {
      messages,
      model = this.defaultModel,
      temperature = 0.3,
      maxTokens = 1200,
      timeoutMs = 45000,
    } = options;

    if (!this.isConfigured()) {
      throw new Error('FANAR_API_KEY is missing. Please configure it in your environment.');
    }

    const start = Date.now();
    let attempts = 0;
    const maxAttempts = 2;
    let lastError: Error | null = null;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const res = await fetch(`${this.baseUrl}/v1/chat/completions`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens: maxTokens,
          }),
          signal: AbortSignal.timeout(timeoutMs),
        });

        const latencyMs = Date.now() - start;

        if (!res.ok) {
          const errBody = await res.text().catch(() => '');
          throw new Error(`Fanar API error (${res.status}): ${errBody || res.statusText}`);
        }

        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || '';

        return {
          content,
          model,
          latencyMs,
          tokenUsage: data.usage
            ? {
                promptTokens: data.usage.prompt_tokens || 0,
                completionTokens: data.usage.completion_tokens || 0,
                totalTokens: data.usage.total_tokens || 0,
              }
            : undefined,
        };
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (attempts >= maxAttempts) break;
        // Wait 1.5s before retry
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }

    throw lastError || new Error('Fanar generation failed after retries.');
  }
}

// Global singleton instance
export const fanarAdapter = new FanarProviderAdapter();
