import { motion } from "framer-motion";

const items = [
  {
    quote: "I used to feel guilty about climate change. Now I have a plan, and I've cut my footprint by 41% in 6 months.",
    name: "Maya R.",
    role: "Product designer",
  },
  {
    quote: "The AI insights are scarily accurate. It identified that my flights — not my car — were my real problem.",
    name: "Daniel K.",
    role: "Software engineer",
  },
  {
    quote: "Finally a sustainability tool that doesn't feel like homework. The dashboard is genuinely beautiful.",
    name: "Priya S.",
    role: "Climate journalist",
  },
];

export function Testimonials() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-4xl font-semibold tracking-tight md:text-5xl"
        >
          Loved by <span className="text-gradient">climate-conscious humans</span>
        </motion.h2>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <blockquote className="text-[15px] leading-relaxed text-foreground/90">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-aurora font-display text-xs font-semibold text-background">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
