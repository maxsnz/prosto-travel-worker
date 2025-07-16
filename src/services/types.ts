import { GuideSchedule } from "../llm/schema";

// Base types for API responses
export interface ApiResponse<T> {
  data: T;
}

export interface ApiListResponse<T> {
  data: T[];
}

// Types for cities
export interface City {
  id: number;
  name: string;
}

export interface CityAttributes {
  name: string;
}

export interface MediaAttributes {
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  url: string;
  formats: {
    large: {
      url: string;
    };
  };
}

export interface CityData {
  id: number;
  attributes: CityAttributes;
}

export interface MediaData {
  id: number;
  attributes: MediaAttributes;
}

// Types for cityGuides
export interface CityGuide {
  id: number;
  name: string;
  cityName: string;
  intro?: string;
  history?: string;
  resources?: string;
  planPrompt?: string;
  cityId: number;
  cover: MediaAttributes;
  gallery_1: MediaAttributes[];
  gallery_2: MediaAttributes[];
  gallery_3: MediaAttributes[];
}

export interface CityGuideShort {
  id: number;
  name: string;
  cityName: string;
}

export interface CityGuideAttributes {
  name: string;
  intro?: string;
  history?: string;
  resources?: string;
  planPrompt?: string;
  city: { data: CityData };
  cover: { data: MediaData };
  gallery_1: { data: MediaData[] };
  gallery_2: { data: MediaData[] };
  gallery_3: { data: MediaData[] };
}

export interface CityGuideData {
  id: number;
  attributes: CityGuideAttributes;
}

// Types for places
export interface PlaceTag {
  name: string;
}

export interface PlaceAttributes {
  name: string;
  address: string;
  description: string;
  mapLink: string;
  coords: string;
  imageUrl: string;
  tags: PlaceTag[];
}

export interface PlaceData {
  id: number;
  attributes: PlaceAttributes;
}

export interface Place {
  id: number;
  name: string;
  address: string;
  description: string;
  mapLink: string;
  coords: string;
  imageUrl: string;
  tags: string[];
}

// Types for users
export interface User {
  id: number;
  telegramId: string;
  username?: string;
  firstName?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserParams {
  telegramId: number;
  username?: string;
  firstName?: string;
  email?: string;
}

export interface UserAttributes {
  telegramId: number;
  username?: string;
  firstName?: string;
  email?: string;
}

export interface UserData {
  id: number;
  attributes: UserAttributes;
}

// Types for guides
export interface Guide {
  id: number;
  userId: number;
  cityGuideId: number;
  publicId?: string;
  htmlContent?: string;
  status: "draft" | "paid" | "generating" | "ready" | "failed" | "delivered";
  days: number;
}

export interface GuideAttributes {
  userId: number;
  publicId?: string;
  htmlContent?: string;
  status: "draft" | "paid" | "generating" | "ready" | "failed" | "delivered";
  days: number;
  user: { data: UserData };
  city_guide: { data: CityData };
}

export interface GuideData {
  id: number;
  attributes: GuideAttributes;
}

export interface CreateGuideParams {
  userId: number;
  cityGuideId: number;
  days: number;
}

export interface UpdateGuideParams {
  htmlContent?: string;
  status?: "draft" | "paid" | "generating" | "ready" | "failed" | "delivered";
  publicId?: string;
}

// Types for LLM requests
export interface LLMRequest {
  id: number;
  systemPrompt: string;
  userPrompt: string;
  completion?: GuideSchedule;
  guideId: number;
  status: "pending" | "done" | "error";
  model: string;
  error?: string;
  cost?: number;
}

export interface LLMRequestAttributes {
  systemPrompt: string;
  userPrompt: string;
  completion?: GuideSchedule;
  guide: { data: GuideData };
  model: string;
  status: "pending" | "done" | "error";
  error?: string;
  cost?: number;
}

export interface LLMRequestData {
  id: number;
  attributes: LLMRequestAttributes;
}

export interface CreateLLMRequestParams {
  systemPrompt: string;
  userPrompt: string;
  guideId: number;
  model: string;
  completion?: GuideSchedule;
}

export interface UpdateLLMRequestParams {
  status?: "pending" | "done" | "error";
  completion?: string;
  error?: string;
  cost?: number;
}
