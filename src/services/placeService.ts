import { apiClient } from "./api";
import { ApiResponse, ApiListResponse, PlaceData, Place } from "./types";

export class PlaceService {
  private static instance: PlaceService;
  private placeCache: Map<number, Place> = new Map();

  private constructor() {}

  static getInstance(): PlaceService {
    if (!PlaceService.instance) {
      PlaceService.instance = new PlaceService();
    }
    return PlaceService.instance;
  }

  getPlaceByIdSync(placeId: number): Place | null {
    if (this.placeCache.has(placeId)) {
      console.log(`[PlaceService] Place ${placeId} found in cache`);
      return this.placeCache.get(placeId)!;
    }

    return null;
  }

  async getPlaceById(placeId: number): Promise<Place | null> {
    // Check cache first
    if (this.placeCache.has(placeId)) {
      console.log(`[PlaceService] Place ${placeId} found in cache`);
      return this.placeCache.get(placeId)!;
    }

    try {
      console.log(
        `[PlaceService] Place ${placeId} not in cache, fetching from API`
      );
      const endpoint = `/places/${placeId}?populate=tags`;
      const response = await apiClient.request<ApiResponse<PlaceData>>(
        endpoint
      );

      const place: Place = {
        id: response.data.id,
        name: response.data.attributes.name,
        address: response.data.attributes.address,
        description: response.data.attributes.description,
        mapLink: response.data.attributes.mapLink,
        coords: response.data.attributes.coords,
        imageUrl: response.data.attributes.imageUrl,
        tags: response.data.attributes.tags.map(
          (tag: { name: string }) => tag.name
        ),
      };

      this.placeCache.set(placeId, place);

      return place;
    } catch (error) {
      console.error(`[PlaceService] Failed to fetch place ${placeId}:`, error);
      return null;
    }
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
      tags: item.attributes.tags.map((tag: { name: string }) => tag.name),
    }));

    places.forEach((place) => {
      this.placeCache.set(place.id, place);
    });

    return places;
  }

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
