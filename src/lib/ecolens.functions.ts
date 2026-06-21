import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { computeFootprint } from "./carbon";

const FootprintInputSchema = z.object({
  car_km_week: z.number().min(0).max(2000),
  transit_km_week: z.number().min(0).max(2000),
  flights_year: z.number().min(0).max(50),
  electricity_kwh_month: z.number().min(0).max(5000),
  ac_hours_day: z.number().min(0).max(24),
  diet: z.enum(["vegan", "vegetarian", "omnivore", "heavy_meat"]),
  shopping_level: z.number().int().min(1).max(5),
  recycling_level: z.number().int().min(1).max(5),
  water_liters_day: z.number().min(0).max(2000),
});

export const saveFootprint = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => FootprintInputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const computed = computeFootprint(data);
    const { error: fpError } = await context.supabase.from("footprints").insert({
      user_id: context.userId,
      ...data,
      ...computed,
    });
    if (fpError) throw new Error(fpError.message);

    await context.supabase
      .from("profiles")
      .update({ onboarded: true })
      .eq("id", context.userId);

    return { ok: true, computed };
  });

export const getLatestFootprint = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("footprints")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const getFootprintHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("footprints")
      .select("created_at, co2_total, eco_score")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const listGoals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("goals")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const GoalInput = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  target_reduction_pct: z.number().int().min(1).max(100),
});

export const createGoal = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => GoalInput.parse(data))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("goals").insert({
      user_id: context.userId,
      title: data.title,
      description: data.description ?? null,
      target_reduction_pct: data.target_reduction_pct,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
