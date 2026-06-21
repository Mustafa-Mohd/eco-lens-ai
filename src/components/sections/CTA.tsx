import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section id="get-started" className="relative px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="glass-strong relative mx-auto max-w-5xl overflow-hidden rounded-3xl p-12 text-center shadow-elegant md:p-20"
      >
        <div className="absolute inset-0 -z-10 bg-aurora opacity-20" />
        <div className="absolute -top-32 left-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl animate-pulse-glow" />

        <h2 className="text-4xl font-semibold tracking-tight md:text-6xl">
          Your climate impact, <br />
          <span className="text-gradient">in your hands</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
          Join thousands cutting emissions with personalized AI guidance. Free forever for individuals.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#signup"
            className="group inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:scale-[1.03] hover:brightness-110"
          >
            Start free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#book-demo"
            className="glass inline-flex items-center rounded-xl px-7 py-3.5 text-sm font-medium transition-all hover:bg-white/10"
          >
            Book a demo
          </a>
        </div>
      </motion.div>
    </section>
  );
}
