import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion, AnimatePresence } from "framer-motion";
import { Car, Zap, Utensils, Recycle, Droplet, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { saveFootprint } from "@/lib/ecolens.functions";
import type { FootprintInput } from "@/lib/carbon";

export const Route = createFileRoute("/_authenticated/onboarding")({
  component: Onboarding,
});

const initial: FootprintInput = {
  car_km_week: 100,
  transit_km_week: 30,
  flights_year: 2,
  electricity_kwh_month: 250,
  ac_hours_day: 3,
  diet: "omnivore",
  shopping_level: 3,
  recycling_level: 3,
  water_liters_day: 150,
};

function Onboarding() {
  const navigate = useNavigate();
  const save = useServerFn(saveFootprint);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FootprintInput>(initial);
  const [loading, setLoading] = useState(false);

  const steps = [
    { icon: Car, title: "Transportation", color: "from-emerald-400 to-teal-400" },
    { icon: Zap, title: "Energy", color: "from-teal-400 to-cyan-400" },
    { icon: Utensils, title: "Food", color: "from-cyan-400 to-blue-400" },
    { icon: Recycle, title: "Lifestyle", color: "from-blue-400 to-emerald-400" },
    { icon: Droplet, title: "Water", color: "from-emerald-400 to-cyan-400" },
  ];

  function update<K extends keyof FootprintInput>(k: K, v: FootprintInput[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  async function finish() {
    setLoading(true);
    try {
      await save({ data });
      toast.success("Footprint calculated!");
      navigate({ to: "/dashboard" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save");
      setLoading(false);
    }
  }

  const Icon = steps[step].icon;
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="relative min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Step {step + 1} of {steps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-card">
            <motion.div
              className="h-full bg-aurora"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35 }}
            className="glass-strong rounded-3xl p-8 shadow-elegant md:p-10"
          >
            <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${steps[step].color} shadow-glow`}>
              <Icon className="h-6 w-6 text-background" strokeWidth={2.5} />
            </div>
            <h2 className="mt-5 text-center font-display text-3xl font-semibold">{steps[step].title}</h2>

            <div className="mt-8 space-y-6">
              {step === 0 && <>
                <NumberField label="Car driven per week (km)" value={data.car_km_week} onChange={(v) => update("car_km_week", v)} max={1000} />
                <NumberField label="Public transport per week (km)" value={data.transit_km_week} onChange={(v) => update("transit_km_week", v)} max={1000} />
                <NumberField label="Flights per year (round trips)" value={data.flights_year} onChange={(v) => update("flights_year", v)} max={30} step={1} />
              </>}
              {step === 1 && <>
                <NumberField label="Electricity per month (kWh)" value={data.electricity_kwh_month} onChange={(v) => update("electricity_kwh_month", v)} max={2000} />
                <NumberField label="Air conditioning use (hours/day)" value={data.ac_hours_day} onChange={(v) => update("ac_hours_day", v)} max={24} step={1} />
              </>}
              {step === 2 && (
                <div>
                  <label className="mb-3 block text-sm font-medium text-muted-foreground">Diet</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["vegan", "vegetarian", "omnivore", "heavy_meat"] as const).map((d) => (
                      <button
                        key={d}
                        onClick={() => update("diet", d)}
                        className={`rounded-xl border p-4 text-left text-sm transition-all ${
                          data.diet === d
                            ? "border-primary bg-primary/15 text-foreground shadow-glow"
                            : "border-border bg-card/40 text-muted-foreground hover:border-border/80 hover:bg-card/70"
                        }`}
                      >
                        <div className="font-display font-semibold capitalize">{d.replace("_", " ")}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === 3 && <>
                <SliderField label="Shopping habits" hint="1 = minimal · 5 = frequent" value={data.shopping_level} onChange={(v) => update("shopping_level", v)} />
                <SliderField label="Recycling habits" hint="1 = none · 5 = always" value={data.recycling_level} onChange={(v) => update("recycling_level", v)} />
              </>}
              {step === 4 && <NumberField label="Water use per day (liters)" value={data.water_liters_day} onChange={(v) => update("water_liters_day", v)} max={1000} />}
            </div>

            <div className="mt-10 flex items-center justify-between gap-3">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="glass inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all hover:bg-white/10 disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {step < steps.length - 1 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:brightness-110"
                >
                  Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              ) : (
                <button
                  onClick={finish}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:brightness-110 disabled:opacity-60"
                >
                  {loading ? "Calculating..." : <>Calculate footprint <Check className="h-4 w-4" /></>}
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange, max, step = 1 }: { label: string; value: number; onChange: (v: number) => void; max: number; step?: number }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <label className="text-sm font-medium text-muted-foreground">{label}</label>
        <span className="font-display text-xl font-semibold text-gradient">{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}

function SliderField({ label, hint, value, onChange }: { label: string; hint: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <label className="text-sm font-medium text-muted-foreground">{label}</label>
        <span className="font-display text-xl font-semibold text-gradient">{value}</span>
      </div>
      <div className="text-[11px] text-muted-foreground/70">{hint}</div>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-primary"
      />
    </div>
  );
}
