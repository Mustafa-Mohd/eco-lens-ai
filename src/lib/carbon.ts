// Simple, transparent carbon estimation (kg CO2 / year)
// Coefficients are reasonable averages drawn from public IPCC / EPA datasets.

export interface FootprintInput {
  car_km_week: number;
  transit_km_week: number;
  flights_year: number;
  electricity_kwh_month: number;
  ac_hours_day: number;
  diet: "vegan" | "vegetarian" | "omnivore" | "heavy_meat";
  shopping_level: number; // 1-5
  recycling_level: number; // 1-5
  water_liters_day: number;
}

export interface FootprintResult {
  co2_transport: number;
  co2_energy: number;
  co2_food: number;
  co2_waste: number;
  co2_water: number;
  co2_total: number;
  eco_score: number;
}

const DIET_KG_YEAR = {
  vegan: 1100,
  vegetarian: 1700,
  omnivore: 2500,
  heavy_meat: 3300,
};

export function computeFootprint(i: FootprintInput): FootprintResult {
  // Transport: car ~0.17 kg/km, transit ~0.04, flight ~250 kg avg/short-haul
  const co2_transport =
    i.car_km_week * 52 * 0.17 + i.transit_km_week * 52 * 0.04 + i.flights_year * 250;

  // Energy: 0.4 kg/kWh grid avg + AC ~1.5 kWh/hour
  const co2_energy =
    i.electricity_kwh_month * 12 * 0.4 + i.ac_hours_day * 365 * 1.5 * 0.4;

  const co2_food = DIET_KG_YEAR[i.diet];

  // Waste: shopping_level drives consumption; recycling reduces
  const co2_waste = i.shopping_level * 180 - i.recycling_level * 40;

  // Water: 0.0003 kg per liter (treatment + heating)
  const co2_water = i.water_liters_day * 365 * 0.0003;

  const co2_total = Math.max(
    0,
    co2_transport + co2_energy + co2_food + Math.max(0, co2_waste) + co2_water,
  );

  // Eco score 0-100: world avg ~4700 kg = 50; <1500 ≈ 95; >9000 ≈ 10
  const eco_score = Math.max(
    5,
    Math.min(100, Math.round(100 - (co2_total / 9000) * 90)),
  );

  return {
    co2_transport: Math.round(co2_transport),
    co2_energy: Math.round(co2_energy),
    co2_food: Math.round(co2_food),
    co2_waste: Math.round(Math.max(0, co2_waste)),
    co2_water: Math.round(co2_water),
    co2_total: Math.round(co2_total),
    eco_score,
  };
}

export function generateInsights(r: FootprintResult, i: FootprintInput): Array<{
  tag: "high" | "medium" | "low";
  title: string;
  body: string;
  savingKg: number;
}> {
  const insights: Array<{ tag: "high" | "medium" | "low"; title: string; body: string; savingKg: number }> = [];
  const total = r.co2_total || 1;

  const pctTransport = (r.co2_transport / total) * 100;
  if (pctTransport > 35 && i.car_km_week > 50) {
    const saving = Math.round(i.car_km_week * 0.4 * 52 * 0.17);
    insights.push({
      tag: "high",
      title: `Transportation drives ${Math.round(pctTransport)}% of your footprint`,
      body: `Shifting 40% of your car kilometers to public transport could cut about ${saving} kg CO₂ per year.`,
      savingKg: saving,
    });
  }

  if (i.flights_year >= 2) {
    const saving = Math.round(250 * Math.min(i.flights_year - 1, i.flights_year));
    insights.push({
      tag: "high",
      title: `Air travel adds ${Math.round(i.flights_year * 250)} kg CO₂/yr`,
      body: `One fewer round-trip flight per year saves roughly ${saving} kg CO₂ — often more than any other single action.`,
      savingKg: saving,
    });
  }

  if (i.ac_hours_day >= 4) {
    const saving = Math.round(2 * 365 * 1.5 * 0.4);
    insights.push({
      tag: "medium",
      title: "AC usage is above average",
      body: `Reducing AC by 2 hours/day saves ~${saving} kg CO₂ a year and noticeably lowers your bill.`,
      savingKg: saving,
    });
  }

  if (i.diet === "heavy_meat" || i.diet === "omnivore") {
    const saving = i.diet === "heavy_meat" ? 800 : 400;
    insights.push({
      tag: "medium",
      title: "Diet is a high-leverage lever",
      body: `Swapping just 3 meat meals/week to plant-based saves ~${saving} kg CO₂ annually.`,
      savingKg: saving,
    });
  }

  if (i.recycling_level <= 2) {
    insights.push({
      tag: "low",
      title: "Recycling habits could improve",
      body: "Sorting recyclables and composting organics reduces waste-related emissions by 30-50%.",
      savingKg: 120,
    });
  }

  if (i.electricity_kwh_month > 350) {
    const saving = Math.round(i.electricity_kwh_month * 0.2 * 12 * 0.4);
    insights.push({
      tag: "medium",
      title: "Electricity use is on the higher end",
      body: `Switching to LED bulbs, unplugging idle electronics, and a smart thermostat can shave ~20% — about ${saving} kg CO₂/yr.`,
      savingKg: saving,
    });
  }

  // Always include a quick win
  insights.push({
    tag: "low",
    title: "Quick win: shorter showers",
    body: "Cutting shower time by 3 minutes saves roughly 40 kg CO₂ per year (and a lot of water).",
    savingKg: 40,
  });

  return insights.slice(0, 6);
}
