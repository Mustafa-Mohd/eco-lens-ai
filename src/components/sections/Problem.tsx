import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/AnimatedCounter";

const stats = [
  { value: 37, suffix: "Gt", label: "Annual global CO₂ emissions", decimals: 0 },
  { value: 1.5, suffix: "°C", label: "Warming limit we're racing past", decimals: 1 },
  { value: 4.7, suffix: "t", label: "Avg personal footprint per year", decimals: 1 },
  { value: 68, suffix: "%", label: "People who don't track emissions", decimals: 0 },
];

export function Problem() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto w-fit rounded-full border border-border bg-card/40 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            The problem
          </div>
          <h2 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
            Most carbon tools show a number.{" "}
            <span className="text-gradient">Not the story behind it.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Without context, your footprint is just trivia. EcoLens connects emissions to behavior, then
            tells you the smallest changes with the biggest impact.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-6 transition-all hover:bg-white/[0.06] hover:shadow-glow"
            >
              <div className="font-display text-4xl font-semibold text-gradient md:text-5xl">
                <AnimatedCounter to={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="mt-3 text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
