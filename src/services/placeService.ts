import { apiClient } from "./api";
import { ApiListResponse, PlaceData, Place } from "./types";

export class PlaceService {
  private static instance: PlaceService;

  private constructor() {}

  static getInstance(): PlaceService {
    if (!PlaceService.instance) {
      PlaceService.instance = new PlaceService();
    }
    return PlaceService.instance;
  }

  async getPlacesByCity(cityId: number): Promise<Place[]> {
    const endpoint = `/places?filters[city][id][$eq]=${cityId}&populate=tags&pagination[pageSize]=1000`;
    const response = await apiClient.request<ApiListResponse<PlaceData>>(
      endpoint
    );

    const places: Place[] = response.data.map((item) => ({
      id: item.id,
      name: item.attributes.name,
      address: item.attributes.address,
      description: item.attributes.description,
      mapLink: item.attributes.mapLink,
      coords: item.attributes.coords,
      imageUrl: item.attributes.imageUrl,
      tags: item.attributes.tags.map((tag) => tag.name),
    }));

    return places;
  }

  // Method for preloading places for specific city
  async preloadPlacesForCity(cityId: number): Promise<void> {
    try {
      await this.getPlacesByCity(cityId);
    } catch (error) {
      console.error(`Failed to preload places for city ${cityId}:`, error);
    }
  }
}

// Export singleton
export const placeService = PlaceService.getInstance();
