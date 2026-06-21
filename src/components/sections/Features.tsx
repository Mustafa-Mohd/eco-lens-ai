import { motion } from "framer-motion";
import { Activity, Brain, Target, FileBarChart, Sparkles, Compass } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Carbon Tracking",
    desc: "Continuous footprint measurement across transportation, energy, food, and lifestyle — updated in real time.",
  },
  {
    icon: Brain,
    title: "AI Insights",
    desc: "Personalized analysis explains why your footprint looks the way it does, in plain language.",
  },
  {
    icon: Target,
    title: "Goal Setting",
    desc: "Set ambitious yet achievable reduction goals with smart milestones and badges along the way.",
  },
  {
    icon: FileBarChart,
    title: "Sustainability Reports",
    desc: "Beautiful, downloadable PDF reports for personal record, sharing, or corporate ESG submissions.",
  },
  {
    icon: Compass,
    title: "Reduction Planner",
    desc: "Priority-ranked actions with quantified CO₂ savings, cost impact, and difficulty estimates.",
  },
  {
    icon: Sparkles,
    title: "Smart Recommendations",
    desc: "Predictive nudges learn your habits and surface the right action at the right moment.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            Everything you need
          </div>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
            A complete climate <span className="text-gradient">command center</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            From first measurement to long-term reduction — every tool is designed for clarity, not climate guilt.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass group relative overflow-hidden rounded-2xl p-7 transition-all hover:shadow-glow"
            >
              <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-aurora shadow-glow">
                  <f.icon className="h-5 w-5 text-background" strokeWidth={2.5} />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
