import { z } from "zod";
import { computeFootprint } from "./carbon";
import { supabase } from "@/integrations/supabase/client";

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

export async function saveFootprint({ data }: { data: z.infer<typeof FootprintInputSchema> }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const validated = FootprintInputSchema.parse(data);
  const computed = computeFootprint(validated);

  const { error: fpError } = await supabase.from("footprints").insert({
    user_id: user.id,
    ...validated,
    ...computed,
  });
  if (fpError) throw new Error(fpError.message);

  await supabase
    .from("profiles")
    .update({ onboarded: true })
    .eq("id", user.id);

  return { ok: true, computed };
}

export async function getLatestFootprint() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("footprints")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function getFootprintHistory() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("footprints")
    .select("created_at, co2_total, eco_score")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

const ProfileUpdateSchema = z.object({
  display_name: z.string().min(2).max(50),
});

export async function updateProfile({ data }: { data: z.infer<typeof ProfileUpdateSchema> }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const validated = ProfileUpdateSchema.parse(data);

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: validated.display_name })
    .eq("id", user.id);

  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function listGoals() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

const GoalInput = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  target_reduction_pct: z.number().int().min(1).max(100),
});

export async function createGoal({ data }: { data: z.infer<typeof GoalInput> }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const validated = GoalInput.parse(data);

  const { error } = await supabase.from("goals").insert({
    user_id: user.id,
    title: validated.title,
    description: validated.description ?? null,
    target_reduction_pct: validated.target_reduction_pct,
  });

  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function isAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return false;
  
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS || "";
  const emails = adminEmails.split(",").map((e: string) => e.trim().toLowerCase());
  return emails.includes(user.email.toLowerCase());
}

export async function getAllProfiles() {
  const isUserAdmin = await isAdmin();
  if (!isUserAdmin) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAllFootprints() {
  const isUserAdmin = await isAdmin();
  if (!isUserAdmin) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("footprints")
    .select("*, profiles(display_name)") // profiles doesn't contain email
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}
