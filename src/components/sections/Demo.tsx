import { motion } from "framer-motion";
import { Car, Zap, Utensils, Trash2, Droplet } from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
  XAxis,
} from "recharts";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const breakdown = [
  { name: "Transport", value: 38, color: "oklch(0.78 0.17 165)" },
  { name: "Energy", value: 24, color: "oklch(0.72 0.13 195)" },
  { name: "Food", value: 18, color: "oklch(0.72 0.18 230)" },
  { name: "Waste", value: 12, color: "oklch(0.85 0.14 200)" },
  { name: "Water", value: 8, color: "oklch(0.62 0.18 145)" },
];

const trend = [
  { m: "Jan", v: 520 },
  { m: "Feb", v: 480 },
  { m: "Mar", v: 510 },
  { m: "Apr", v: 440 },
  { m: "May", v: 410 },
  { m: "Jun", v: 380 },
  { m: "Jul", v: 360 },
  { m: "Aug", v: 320 },
];

const categories = [
  { icon: Car, label: "Transport", value: "1.9 t" },
  { icon: Zap, label: "Energy", value: "1.2 t" },
  { icon: Utensils, label: "Food", value: "0.9 t" },
  { icon: Trash2, label: "Waste", value: "0.6 t" },
  { icon: Droplet, label: "Water", value: "0.4 t" },
];

export function Demo() {
  return (
    <section id="how" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto w-fit rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent">
            Live preview
          </div>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
            Your impact, <span className="text-gradient">beautifully visualized</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="glass-strong relative mt-16 overflow-hidden rounded-3xl p-6 shadow-elegant md:p-10"
        >
          <div className="absolute inset-0 -z-10 bg-aurora opacity-10" />

          {/* KPIs */}
          <div className="grid gap-3 md:grid-cols-4">
            {[
              { label: "Total CO₂", value: 5.0, suffix: " t", decimals: 1 },
              { label: "Eco Score", value: 78, suffix: "/100", decimals: 0 },
              { label: "Monthly cut", value: 12, suffix: "%", decimals: 0 },
              { label: "Trees needed", value: 84, suffix: "", decimals: 0 },
            ].map((k) => (
              <div key={k.label} className="glass rounded-xl p-4">
                <div className="text-xs text-muted-foreground">{k.label}</div>
                <div className="mt-1 font-display text-2xl font-semibold text-gradient">
                  <AnimatedCounter to={k.value} suffix={k.suffix} decimals={k.decimals} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-5">
            {/* Pie */}
            <div className="glass rounded-2xl p-6 lg:col-span-2">
              <h4 className="font-display text-sm font-semibold text-muted-foreground">Emission breakdown</h4>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={breakdown}
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {breakdown.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.21 0.025 200 / 0.95)",
                        border: "1px solid oklch(1 0 0 / 0.1)",
                        borderRadius: "0.75rem",
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-5 gap-1">
                {breakdown.map((b) => (
                  <div key={b.name} className="text-center">
                    <div className="mx-auto h-2 w-2 rounded-full" style={{ background: b.color }} />
                    <div className="mt-1.5 text-[10px] text-muted-foreground">{b.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trend */}
            <div className="glass rounded-2xl p-6 lg:col-span-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-semibold text-muted-foreground">8-month trend</h4>
                <div className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
                  ↓ 38%
                </div>
              </div>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend}>
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.78 0.17 165)" stopOpacity={0.6} />
                        <stop offset="100%" stopColor="oklch(0.78 0.17 165)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="m" tick={{ fill: "oklch(0.68 0.02 200)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "oklch(0.21 0.025 200 / 0.95)",
                        border: "1px solid oklch(1 0 0 / 0.1)",
                        borderRadius: "0.75rem",
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke="oklch(0.78 0.17 165)"
                      strokeWidth={2.5}
                      fill="url(#grad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Category strip */}
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
            {categories.map((c) => (
              <div key={c.label} className="glass flex items-center gap-3 rounded-xl p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <c.icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground">{c.label}</div>
                  <div className="font-display text-sm font-semibold">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
