import { OpenAI } from "openai";
import { env } from "../config/env";
import { CityGuide, Guide, placeService } from "../services";
import { getUserPrompt } from "./getUserPrompt";
import { systemPrompt } from "./systemPrompt";
import { llmRequestService } from "../services/llmRequestService";
import { safeValidateGPTResponse, GPTResponse } from "./schema";
import { calculateGPTCost, getCostBreakdown } from "./costCalculator";

export class GPTService {
  private openai: OpenAI;
  private maxRetries: number = 3;
  private retryDelay: number = 1000;

  constructor() {
    this.openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async makeGPTRequest(
    systemPrompt: string,
    userPrompt: string,
    model: string = "gpt-4o",
    previousResponse?: string,
    validationError?: string
  ) {
    const messages: Array<{ role: "system" | "user"; content: string }> = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ];

    if (previousResponse && validationError) {
      const correctionPrompt = `Your previous response had validation errors. Please fix them and provide a correct response.

Previous response:
${previousResponse}

Validation errors:
${validationError}

Please provide a corrected response that follows the JSON schema exactly.`;

      messages.push({ role: "user", content: correctionPrompt });
    }

    return await this.openai.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      temperature: 0.8,
      messages,
    });
  }

  private async processGPTResponse(
    response: any,
    llmRequestId: number,
    model: string
  ) {
    const text = response.choices[0]?.message?.content?.trim();
    if (!text) {
      throw new Error("GPT did not return any content");
    }

    const json = JSON.parse(text);

    const costCalculation = calculateGPTCost(response.usage, model);

    const validationResult = safeValidateGPTResponse(json);
    if (!validationResult.success) {
      console.error("Validation failed:", validationResult.error);

      return {
        success: false,
        error: validationResult.error,
        response: text,
        cost: costCalculation.totalCost,
      };
    }

    await llmRequestService.updateLLMRequest(llmRequestId, {
      completion: JSON.stringify(validationResult.data),
      status: "done",
      cost: costCalculation.totalCost,
    });

    return {
      success: true,
      data: validationResult.data,
      cost: costCalculation.totalCost,
    };
  }

  async askGPT({
    guide,
    cityGuide,
  }: {
    cityGuide: CityGuide;
    guide: Guide;
  }): Promise<GPTResponse> {
    const places = await placeService.getPlacesByCity(cityGuide.cityId);
    const userPrompt = getUserPrompt({ cityGuide, days: guide.days, places });
    const model = "gpt-4o";

    let previousResponse: string | undefined;
    let validationError: string | undefined;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`Asking GPT (attempt ${attempt}/${this.maxRetries})`);

        const llmRequest = await llmRequestService.createLLMRequest({
          systemPrompt,
          userPrompt:
            attempt === 1
              ? userPrompt
              : `Correction attempt ${attempt}: ${userPrompt}`,
          guideId: guide.id,
          model,
        });

        const response = await this.makeGPTRequest(
          systemPrompt,
          userPrompt,
          model,
          previousResponse,
          validationError
        );

        const result = await this.processGPTResponse(
          response,
          llmRequest.id,
          model
        );

        if (result.success && result.data) {
          console.log("GPT success");
          return result.data;
        } else {
          previousResponse = result.response;
          validationError = result.error;

          console.log(
            `Validation failed on attempt ${attempt}, will try correction`
          );

          await llmRequestService.updateLLMRequest(llmRequest.id, {
            status: "error",
            error: result.error,
            completion: result.response,
            cost: result.cost,
          });

          if (attempt === this.maxRetries) {
            throw new Error(
              `Validation failed after ${this.maxRetries} attempts. Last error: ${result.error}`
            );
          }

          console.log(`Retrying with correction in ${this.retryDelay}ms...`);
          await this.delay(this.retryDelay);
          this.retryDelay *= 2;
        }
      } catch (error) {
        lastError = error as Error;
        console.error(`GPT error on attempt ${attempt}:`, error);

        if (attempt < this.maxRetries) {
          console.log(`Retrying in ${this.retryDelay}ms...`);
          await this.delay(this.retryDelay);
          this.retryDelay *= 2;
        }
      }
    }

    throw new Error(
      `All ${this.maxRetries} attempts failed. Last error: ${lastError?.message}`
    );
  }
}

const gptService = new GPTService();

export default gptService;
