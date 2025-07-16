import { GuideSchedule } from "../llm/schema";
import { apiClient } from "./api";
import {
  ApiResponse,
  LLMRequest,
  CreateLLMRequestParams,
  LLMRequestData,
  UpdateLLMRequestParams,
} from "./types";

export class LLMRequestService {
  private static instance: LLMRequestService;

  private constructor() {}

  static getInstance(): LLMRequestService {
    if (!LLMRequestService.instance) {
      LLMRequestService.instance = new LLMRequestService();
    }
    return LLMRequestService.instance;
  }

  async createLLMRequest(params: CreateLLMRequestParams): Promise<LLMRequest> {
    const { systemPrompt, userPrompt, guideId, model, completion } = params;

    const response = await apiClient.post<ApiResponse<LLMRequestData>>(
      "/llm-requests?populate=guide",
      {
        data: {
          systemPrompt,
          userPrompt,
          completion,
          guide: guideId,
          model,
        },
      }
    );

    const LLMRequest: LLMRequest = {
      id: response.data.id,
      systemPrompt: response.data.attributes.systemPrompt,
      userPrompt: response.data.attributes.userPrompt,
      completion: response.data.attributes.completion,
      guideId: response.data.attributes.guide.data.id,
      model: response.data.attributes.model,
      status: response.data.attributes.status,
      error: response.data.attributes.error,
    };

    return LLMRequest;
  }

  async updateLLMRequest(
    id: number,
    params: UpdateLLMRequestParams
  ): Promise<LLMRequest> {
    const response = await apiClient.put<ApiResponse<LLMRequestData>>(
      `/llm-requests/${id}?populate=guide`,
      {
        data: params,
      }
    );

    const LLMRequest: LLMRequest = {
      id: response.data.id,
      systemPrompt: response.data.attributes.systemPrompt,
      userPrompt: response.data.attributes.userPrompt,
      completion: response.data.attributes.completion,
      guideId: response.data.attributes.guide.data.id,
      model: response.data.attributes.model,
      status: response.data.attributes.status,
      error: response.data.attributes.error,
    };

    return LLMRequest;
  }

  async getLLMRequestById(id: number): Promise<LLMRequest> {
    const response = await apiClient.request<ApiResponse<LLMRequestData>>(
      `/llm-requests/${id}?populate=guide`
    );

    return {
      id: response.data.id,
      systemPrompt: response.data.attributes.systemPrompt,
      userPrompt: response.data.attributes.userPrompt,
      completion: response.data.attributes.completion,
      guideId: response.data.attributes.guide.data.id,
      model: response.data.attributes.model,
      status: response.data.attributes.status,
      error: response.data.attributes.error,
    };
  }

  async getCompletion(guideId: number): Promise<GuideSchedule | null> {
    const response = await apiClient.request<ApiResponse<LLMRequestData[]>>(
      `/llm-requests?filters[guide][$eq]=${guideId}&filters[status][$eq]=done`
    );
    if (response.data.length === 0) {
      return null;
    }
    const completion = response.data[0].attributes.completion;
    if (!completion) {
      return null;
    }
    return completion;
  }
}

// Export singleton
export const llmRequestService = LLMRequestService.getInstance();
