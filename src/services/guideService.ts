import { apiClient } from "./api";
import {
  Guide,
  CreateGuideParams,
  ApiResponse,
  GuideData,
  UpdateGuideParams,
} from "./types";

export class GuideService {
  private static instance: GuideService;

  private constructor() {}

  static getInstance(): GuideService {
    if (!GuideService.instance) {
      GuideService.instance = new GuideService();
    }
    return GuideService.instance;
  }

  async createGuide(params: CreateGuideParams): Promise<Guide> {
    const { userId, cityGuideId, days } = params;

    const response = await apiClient.post<ApiResponse<GuideData>>("/guides", {
      data: {
        user: userId,
        city_guide: cityGuideId,
        days,
      },
    });

    const guide: Guide = {
      id: response.data.id,
      userId: response.data.attributes.user.data.id,
      cityGuideId: response.data.attributes.city_guide.data.id,
      status: response.data.attributes.status,
      days: response.data.attributes.days,
    };

    return guide;
  }

  async updateGuide(
    guideId: number,
    params: UpdateGuideParams
  ): Promise<Guide> {
    const response = await apiClient.put<ApiResponse<GuideData>>(
      `/guides/${guideId}?populate=user,city_guide`,
      {
        data: params,
      }
    );

    const guide: Guide = {
      id: response.data.id,
      userId: response.data.attributes.user.data.id,
      cityGuideId: response.data.attributes.city_guide.data.id,
      status: response.data.attributes.status,
      days: response.data.attributes.days,
    };

    return guide;
  }

  async getGuideById(guideId: number): Promise<Guide> {
    const response = await apiClient.request<ApiResponse<GuideData>>(
      `/guides/${guideId}?populate=user,city_guide`
    );

    return {
      id: response.data.id,
      userId: response.data.attributes.user.data.id,
      cityGuideId: response.data.attributes.city_guide.data.id,
      status: response.data.attributes.status,
      days: response.data.attributes.days,
    };
  }
}

// Export singleton
export const guideService = GuideService.getInstance();
