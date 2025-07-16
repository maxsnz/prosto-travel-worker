import { apiClient } from "./api";
import {
  ApiListResponse,
  ApiResponse,
  CityGuideData,
  CityGuide,
  CityGuideShort,
} from "./types";

export class CityGuideService {
  private static instance: CityGuideService;

  private constructor() {}

  static getInstance(): CityGuideService {
    if (!CityGuideService.instance) {
      CityGuideService.instance = new CityGuideService();
    }
    return CityGuideService.instance;
  }

  async getAllCityGuides(): Promise<CityGuideShort[]> {
    const response = await apiClient.request<ApiListResponse<CityGuideData>>(
      "/city-guides"
    );

    const cities = response.data.map((item) => ({
      id: item.id,
      name: item.attributes.name,
      cityId: item.attributes.city.data.id,
      cityName: item.attributes.city.data.attributes.name,
    }));

    return cities;
  }

  async getCityGuideById(id: number): Promise<CityGuide> {
    const response = await apiClient.request<ApiResponse<CityGuideData>>(
      `/city-guides/${id}?populate=city&populate=cover&populate=gallery_1&populate=gallery_2&populate=gallery_3`
    );

    const city: CityGuide = {
      id: response.data.id,
      name: response.data.attributes.name,
      intro: response.data.attributes.intro,
      history: response.data.attributes.history,
      resources: response.data.attributes.resources,
      planPrompt: response.data.attributes.planPrompt,
      cityId: response.data.attributes.city.data.id,
      cityName: response.data.attributes.city.data.attributes.name,
      cover: response.data.attributes.cover?.data?.attributes || undefined,
      gallery_1:
        response.data.attributes.gallery_1?.data?.map(
          (item) => item.attributes
        ) || [],
      gallery_2:
        response.data.attributes.gallery_2?.data?.map(
          (item) => item.attributes
        ) || [],
      gallery_3:
        response.data.attributes.gallery_3?.data?.map(
          (item) => item.attributes
        ) || [],
    };

    return city;
  }

  // Method for preloading all cities
  async preloadCityGuides(): Promise<void> {
    try {
      await this.getAllCityGuides();
    } catch (error) {
      console.error("Failed to preload city-guides:", error);
    }
  }
}

// Export singleton
export const cityGuideService = CityGuideService.getInstance();
