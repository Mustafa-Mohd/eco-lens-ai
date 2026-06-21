import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Activity, Brain, Leaf, LogOut, Settings, Sparkles, TreePine, TrendingDown, Target, Plus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Area, AreaChart, XAxis, YAxis, BarChart, Bar } from "recharts";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  getLatestFootprint,
  getFootprintHistory,
  getProfile,
  listGoals,
  createGoal,
} from "@/lib/ecolens.functions";
import { generateInsights, type FootprintInput } from "@/lib/carbon";
import { AnimatedCounter } from "@/components/AnimatedCounter";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const fetchLatest = useServerFn(getLatestFootprint);
  const fetchHistory = useServerFn(getFootprintHistory);
  const fetchProfile = useServerFn(getProfile);
  const fetchGoals = useServerFn(listGoals);
  const addGoal = useServerFn(createGoal);

  const profileQ = useQuery({ queryKey: ["profile"], queryFn: () => fetchProfile() });
  const fpQ = useQuery({ queryKey: ["footprint"], queryFn: () => fetchLatest() });
  const histQ = useQuery({ queryKey: ["history"], queryFn: () => fetchHistory() });
  const goalsQ = useQuery({ queryKey: ["goals"], queryFn: () => fetchGoals() });

  useEffect(() => {
    if (profileQ.data && profileQ.data.onboarded === false) {
      navigate({ to: "/onboarding" });
    } else if (profileQ.data && !fpQ.data && !fpQ.isLoading && fpQ.isFetched) {
      navigate({ to: "/onboarding" });
    }
  }, [profileQ.data, fpQ.data, fpQ.isLoading, fpQ.isFetched, navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  const fp = fpQ.data;
  const history = histQ.data ?? [];

  if (!fp) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="glass rounded-2xl px-8 py-6 text-center">
          <div className="animate-pulse text-sm text-muted-foreground">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  const breakdown = [
    { name: "Transport", value: Number(fp.co2_transport), color: "oklch(0.78 0.17 165)" },
    { name: "Energy", value: Number(fp.co2_energy), color: "oklch(0.72 0.13 195)" },
    { name: "Food", value: Number(fp.co2_food), color: "oklch(0.72 0.18 230)" },
    { name: "Waste", value: Number(fp.co2_waste), color: "oklch(0.85 0.14 200)" },
    { name: "Water", value: Number(fp.co2_water), color: "oklch(0.62 0.18 145)" },
  ];

  const trees = Math.ceil(Number(fp.co2_total) / 21); // ~21 kg CO2 per tree/year

  const trendData = history.length > 1
    ? history.map((h) => ({ d: new Date(h.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }), v: Number(h.co2_total) }))
    : [{ d: "Now", v: Number(fp.co2_total) }];

  const insights = generateInsights(
    {
      co2_transport: Number(fp.co2_transport),
      co2_energy: Number(fp.co2_energy),
      co2_food: Number(fp.co2_food),
      co2_waste: Number(fp.co2_waste),
      co2_water: Number(fp.co2_water),
      co2_total: Number(fp.co2_total),
      eco_score: Number(fp.eco_score),
    },
    {
      car_km_week: Number(fp.car_km_week),
      transit_km_week: Number(fp.transit_km_week),
      flights_year: Number(fp.flights_year),
      electricity_kwh_month: Number(fp.electricity_kwh_month),
      ac_hours_day: Number(fp.ac_hours_day),
      diet: fp.diet as FootprintInput["diet"],
      shopping_level: Number(fp.shopping_level),
      recycling_level: Number(fp.recycling_level),
      water_liters_day: Number(fp.water_liters_day),
    },
  );

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-aurora shadow-glow">
              <Leaf className="h-4 w-4 text-background" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-semibold">EcoLens<span className="text-primary"> AI</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/onboarding" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              <Settings className="h-4 w-4" />
            </Link>
            <button onClick={signOut} className="glass inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-all hover:bg-white/10">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display text-3xl font-semibold md:text-4xl">
            Hi {profileQ.data?.display_name || "there"} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">Here's your climate impact, updated live.</p>
        </motion.div>

        {/* KPIs */}
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            { icon: Activity, label: "Total CO₂ / year", value: Number(fp.co2_total) / 1000, suffix: " t", decimals: 2 },
            { icon: Sparkles, label: "Eco Score", value: Number(fp.eco_score), suffix: "/100", decimals: 0 },
            { icon: TrendingDown, label: "vs world avg", value: Math.round((1 - Number(fp.co2_total) / 4700) * 100), suffix: "%", decimals: 0 },
            { icon: TreePine, label: "Trees to offset", value: trees, suffix: "", decimals: 0 },
          ].map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{k.label}</span>
                <k.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="mt-3 font-display text-3xl font-semibold text-gradient">
                <AnimatedCounter to={k.value} decimals={k.decimals} suffix={k.suffix} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts row */}
        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6 lg:col-span-2"
          >
            <h3 className="font-display text-sm font-semibold text-muted-foreground">Emission breakdown</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={breakdown} innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value" stroke="none">
                    {breakdown.map((e) => (<Cell key={e.name} fill={e.color} />))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v} kg`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 grid grid-cols-5 gap-1">
              {breakdown.map((b) => (
                <div key={b.name} className="text-center">
                  <div className="mx-auto h-2 w-2 rounded-full" style={{ background: b.color }} />
                  <div className="mt-1 text-[10px] text-muted-foreground">{b.name}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 lg:col-span-3"
          >
            <h3 className="font-display text-sm font-semibold text-muted-foreground">Footprint trend</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.78 0.17 165)" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="oklch(0.78 0.17 165)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="d" tick={{ fill: "oklch(0.68 0.02 200)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "oklch(0.68 0.02 200)", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => `${v} kg`} />
                  <Area type="monotone" dataKey="v" stroke="oklch(0.78 0.17 165)" strokeWidth={2.5} fill="url(#trendGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Bar comparison */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass mt-6 rounded-2xl p-6">
          <h3 className="font-display text-sm font-semibold text-muted-foreground">Category emissions (kg CO₂/yr)</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={breakdown}>
                <XAxis dataKey="name" tick={{ fill: "oklch(0.68 0.02 200)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.68 0.02 200)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 0.04)" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {breakdown.map((e) => (<Cell key={e.name} fill={e.color} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Insights */}
        <div className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">AI Insights</h2>
              <p className="text-sm text-muted-foreground">Personalized actions ranked by impact</p>
            </div>
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((ins, i) => {
              const tagColors = {
                high: "bg-primary/15 text-primary",
                medium: "bg-accent/15 text-accent",
                low: "bg-cyan/15 text-cyan",
              };
              return (
                <motion.div
                  key={ins.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  whileHover={{ y: -3 }}
                  className="glass rounded-2xl p-5 transition-all hover:shadow-glow"
                >
                  <div className="flex items-center justify-between">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tagColors[ins.tag]}`}>
                      {ins.tag} impact
                    </span>
                    <span className="font-display text-xs font-semibold text-primary">−{ins.savingKg} kg</span>
                  </div>
                  <h4 className="mt-3 font-display text-base font-semibold leading-snug">{ins.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ins.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Goals */}
        <div className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">Sustainability Goals</h2>
              <p className="text-sm text-muted-foreground">Track meaningful commitments</p>
            </div>
            <Target className="h-5 w-5 text-primary" />
          </div>
          <GoalsSection
            goals={goalsQ.data ?? []}
            onAdd={async (input) => {
              try {
                await addGoal({ data: input });
                toast.success("Goal created");
                goalsQ.refetch();
              } catch (e) {
                toast.error(e instanceof Error ? e.message : "Failed");
              }
            }}
          />
        </div>
      </main>
    </div>
  );
}

const tooltipStyle = {
  background: "oklch(0.21 0.025 200 / 0.95)",
  border: "1px solid oklch(1 0 0 / 0.1)",
  borderRadius: "0.75rem",
  fontSize: 12,
};

function GoalsSection({
  goals,
  onAdd,
}: {
  goals: Array<{ id: string; title: string; description: string | null; target_reduction_pct: number; progress_pct: number; status: string }>;
  onAdd: (g: { title: string; description?: string; target_reduction_pct: number }) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [pct, setPct] = useState(20);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {goals.map((g) => (
        <motion.div key={g.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
          <div className="font-display text-base font-semibold">{g.title}</div>
          {g.description && <p className="mt-1 text-sm text-muted-foreground">{g.description}</p>}
          <div className="mt-4 flex items-baseline justify-between text-xs text-muted-foreground">
            <span>Target: -{g.target_reduction_pct}%</span>
            <span>{g.progress_pct}%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-card">
            <div className="h-full bg-aurora" style={{ width: `${g.progress_pct}%` }} />
          </div>
        </motion.div>
      ))}

      {open ? (
        <div className="glass rounded-2xl p-5">
          <input
            placeholder="Goal title — e.g. Bike to work 3x/week"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-border bg-card/40 px-3 py-2 text-sm outline-none focus:border-primary/50"
          />
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground"><span>Target reduction</span><span>{pct}%</span></div>
            <input type="range" min={5} max={80} value={pct} onChange={(e) => setPct(Number(e.target.value))} className="mt-1 w-full accent-primary" />
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={() => setOpen(false)} className="flex-1 rounded-lg border border-border px-3 py-2 text-xs">Cancel</button>
            <button
              onClick={async () => {
                if (title.length < 2) { toast.error("Add a title"); return; }
                await onAdd({ title, target_reduction_pct: pct });
                setTitle(""); setPct(20); setOpen(false);
              }}
              className="flex-1 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground"
            >
              Create
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="glass flex min-h-[140px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
        >
          <Plus className="h-5 w-5" />
          <span className="text-sm font-medium">New goal</span>
        </button>
      )}
    </div>
  );
}
