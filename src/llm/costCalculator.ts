import { pricingService, ModelPricing } from "./pricingService";

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface CostCalculation {
  inputCost: number;
  outputCost: number;
  totalCost: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  model: string;
  pricing: ModelPricing;
}

/**
 * Calculate the cost of a GPT API request based on token usage and model
 * @param usage - Token usage from OpenAI API response
 * @param model - The model used for the request
 * @returns Cost calculation with breakdown
 */
export function calculateGPTCost(
  usage: TokenUsage,
  model: string = "gpt-4o"
): CostCalculation {
  const pricing = pricingService.getPricing(model);

  const inputTokens = usage.prompt_tokens;
  const outputTokens = usage.completion_tokens;
  const totalTokens = usage.total_tokens;

  // Calculate costs (pricing is per 1K tokens)
  const inputCost = (inputTokens / 1000) * pricing.input;
  const outputCost = (outputTokens / 1000) * pricing.output;
  const totalCost = inputCost + outputCost;

  return {
    inputCost: Math.round(inputCost * 1000000) / 1000000, // Round to 6 decimal places
    outputCost: Math.round(outputCost * 1000000) / 1000000,
    totalCost: Math.round(totalCost * 1000000) / 1000000,
    inputTokens,
    outputTokens,
    totalTokens,
    model,
    pricing,
  };
}

/**
 * Format cost for display
 * @param cost - Cost in dollars
 * @returns Formatted cost string
 */
export function formatCost(cost: number): string {
  if (cost < 0.01) {
    return `$${(cost * 1000).toFixed(2)}m`; // Show in millicents
  }
  return `$${cost.toFixed(4)}`;
}

/**
 * Get cost breakdown as a string for logging
 * @param calculation - Cost calculation result
 * @returns Formatted cost breakdown
 */
export function getCostBreakdown(calculation: CostCalculation): string {
  return `Cost: ${formatCost(calculation.totalCost)} (Input: ${
    calculation.inputTokens
  } tokens, Output: ${calculation.outputTokens} tokens)`;
}

/**
 * Get pricing information for all models
 */
export function getAllModelPricing() {
  return pricingService.getAllPricing();
}
