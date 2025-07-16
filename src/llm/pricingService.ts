export interface ModelPricing {
  input: number;
  output: number;
  model: string;
}

// Updated pricing as of 2024-2025 (converted from per 1M tokens to per 1K tokens)
// Source: https://openai.com/pricing
const PRICING: Record<string, ModelPricing> = {
  // GPT-4.1 models
  "gpt-4.1": { input: 0.002, output: 0.008, model: "gpt-4.1" },
  "gpt-4.1-mini": { input: 0.0004, output: 0.0016, model: "gpt-4.1-mini" },
  "gpt-4.1-nano": { input: 0.0001, output: 0.0004, model: "gpt-4.1-nano" },

  // GPT-4.5 preview
  "gpt-4.5-preview": { input: 0.075, output: 0.15, model: "gpt-4.5-preview" },

  // GPT-4o models
  "gpt-4o": { input: 0.0025, output: 0.01, model: "gpt-4o" },
  "gpt-4o-audio-preview": {
    input: 0.0025,
    output: 0.01,
    model: "gpt-4o-audio-preview",
  },
  "gpt-4o-realtime-preview": {
    input: 0.005,
    output: 0.02,
    model: "gpt-4o-realtime-preview",
  },
  "gpt-4o-mini": { input: 0.00015, output: 0.0006, model: "gpt-4o-mini" },
  "gpt-4o-mini-audio-preview": {
    input: 0.00015,
    output: 0.0006,
    model: "gpt-4o-mini-audio-preview",
  },
  "gpt-4o-mini-realtime-preview": {
    input: 0.0006,
    output: 0.0024,
    model: "gpt-4o-mini-realtime-preview",
  },

  // O1 and O3 models
  o1: { input: 0.015, output: 0.06, model: "o1" },
  "o3-pro": { input: 0.02, output: 0.08, model: "o3-pro" },
  o3: { input: 0.002, output: 0.008, model: "o3" },
  "o4-mini": { input: 0.0011, output: 0.0044, model: "o4-mini" },

  // Legacy models (keeping for backward compatibility)
  "gpt-4": { input: 0.03, output: 0.06, model: "gpt-4" },
  "gpt-4-turbo": { input: 0.01, output: 0.03, model: "gpt-4-turbo" },
  "gpt-3.5-turbo": { input: 0.0005, output: 0.0015, model: "gpt-3.5-turbo" },
};

class PricingService {
  getPricing(model: string): ModelPricing {
    return PRICING[model] || PRICING["gpt-4o"];
  }

  getAllPricing(): Record<string, ModelPricing> {
    return PRICING;
  }
}

export const pricingService = new PricingService();
