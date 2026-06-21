import { motion } from "framer-motion";
import { Lightbulb, TrendingDown, Wind } from "lucide-react";

const insights = [
  {
    icon: Lightbulb,
    tag: "High impact",
    tagColor: "text-primary bg-primary/15",
    title: "Transportation drives 62% of your footprint",
    body: "Three weekly car commutes account for most of your CO₂. Switching two of them to public transit cuts 1.4 t/year.",
  },
  {
    icon: Wind,
    tag: "Medium impact",
    tagColor: "text-accent bg-accent/15",
    title: "AC usage is 1.8× your local average",
    body: "Raising thermostat by 2°C and using a fan saves 320 kg CO₂ annually — and roughly $180 on bills.",
  },
  {
    icon: TrendingDown,
    tag: "Quick win",
    tagColor: "text-cyan bg-cyan/15",
    title: "Shift one beef meal/week to plant-based",
    body: "Lowest-effort change in your plan. Estimated yearly saving: 290 kg CO₂. Difficulty: 1/5.",
  },
];

export function Insights() {
  return (
    <section id="insights" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto w-fit rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
            AI Insights Engine
          </div>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
            Recommendations that <span className="text-gradient">actually move the needle</span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {insights.map((ins, i) => (
            <motion.div
              key={ins.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass relative overflow-hidden rounded-2xl p-6 transition-all hover:shadow-glow"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aurora shadow-glow">
                  <ins.icon className="h-4 w-4 text-background" strokeWidth={2.5} />
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${ins.tagColor}`}>
                  {ins.tag}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold leading-snug">{ins.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ins.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
