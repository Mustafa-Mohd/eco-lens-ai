import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";
import earthImg from "@/assets/earth-hero.jpg";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ParticleField } from "@/components/ParticleField";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const earthScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden pt-32 pb-20">
      <ParticleField count={40} />

      <motion.div style={{ y, opacity }} className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI-powered climate intelligence
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mx-auto mt-6 max-w-4xl text-center text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
        >
          See your carbon footprint.{" "}
          <span className="text-gradient">Reduce it intelligently.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted-foreground md:text-xl"
        >
          EcoLens AI transforms raw sustainability data into personalized actions — so you finally know
          what drives your emissions, and how to cut them.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <a
            href="#get-started"
            className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:scale-[1.03] hover:brightness-110"
          >
            Start tracking free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#how"
            className="glass inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium transition-all hover:bg-white/10"
          >
            See live demo
          </a>
        </motion.div>

        {/* Earth visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          style={{ scale: earthScale }}
          className="relative mx-auto mt-16 aspect-[16/10] max-w-5xl"
        >
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-aurora opacity-30 blur-3xl animate-pulse-glow" />
          <div className="glass-strong relative overflow-hidden rounded-[2rem] shadow-elegant">
            <img
              src={earthImg}
              alt="Earth with aurora"
              width={1536}
              height={960}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

            {/* Floating live stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
              className="glass-strong absolute top-6 left-6 rounded-2xl p-4 md:top-10 md:left-10"
            >
              <div className="text-xs font-medium text-muted-foreground">Global CO₂ today</div>
              <div className="mt-1 font-display text-2xl font-semibold text-gradient md:text-3xl">
                <AnimatedCounter to={101.4} decimals={1} suffix="M t" duration={2.5} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
              className="glass-strong absolute right-6 bottom-20 rounded-2xl p-4 md:right-10 md:bottom-28"
            >
              <div className="text-xs font-medium text-muted-foreground">Avg reduction by users</div>
              <div className="mt-1 font-display text-2xl font-semibold text-primary md:text-3xl">
                <AnimatedCounter to={32} suffix="%" duration={2} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
