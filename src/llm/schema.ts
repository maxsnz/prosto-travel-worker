import { z } from "zod";

// Schema for individual plan item
const PlanItemSchema = z.object({
  index: z.number().int().positive(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  title: z.string().min(1),
  description: z.string().min(1),
  placeId: z.number().int().positive(),
  placeTitle: z.string().min(1),
});

// Schema for place information
const PlaceSchema = z.object({
  title: z.string().min(1),
  motivation: z.string().min(1),
  description: z.string().min(1),
  who: z.string().min(1),
  notes: z.string().optional(),
  tags: z.array(z.string().min(1)),
  placeId: z.number().int().positive(),
});

// Schema for daily schedule
const ScheduleDaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().min(1),
  plan: z.array(PlanItemSchema).min(1),
});

// Schema for daily summary
const SummaryDaySchema = z.object({
  day: z.number().int().positive(),
  morning: z.string().min(1),
  afternoon: z.string().min(1),
  evening: z.string().min(1),
});

// Main response schema
export const GPTResponseSchema = z.object({
  summary: z.array(SummaryDaySchema).min(1),
  schedule: z.array(ScheduleDaySchema).min(1),
});

// Type inference from schema
export type GPTResponse = z.infer<typeof GPTResponseSchema>;
export type GuideSchedule = {
  summary: SummaryDay[];
  schedule: ScheduleDay[];
};
export type SummaryDay = z.infer<typeof SummaryDaySchema>;
export type ScheduleDay = z.infer<typeof ScheduleDaySchema>;
export type PlanItem = z.infer<typeof PlanItemSchema>;
export type Place = z.infer<typeof PlaceSchema>;

// Validation function
export function validateGPTResponse(data: unknown): GPTResponse {
  return GPTResponseSchema.parse(data);
}

// Safe validation function that returns result instead of throwing
export function safeValidateGPTResponse(
  data: unknown
): { success: true; data: GPTResponse } | { success: false; error: string } {
  try {
    const result = GPTResponseSchema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Validation failed: ${error.errors
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(", ")}`,
      };
    }
    return { success: false, error: "Unknown validation error" };
  }
}
