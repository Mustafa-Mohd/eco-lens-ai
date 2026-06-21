import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-semibold tracking-tight md:text-5xl"
          >
            Simple, transparent <span className="text-gradient">pricing</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          >
            Free for individuals making a difference. Affordable plans for teams building a sustainable future.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-10 flex justify-center"
        >
          <div className="flex items-center gap-2 rounded-full border border-border bg-card/50 p-1 backdrop-blur-md">
            <button
              onClick={() => setIsAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                !isAnnual ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                isAnnual ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly <span className="ml-1 text-[10px] uppercase tracking-wider text-primary-foreground/80">(Save 20%)</span>
            </button>
          </div>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
          {/* Free Tier */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="glass-strong relative flex flex-col rounded-3xl p-8 shadow-elegant"
          >
            <h3 className="font-display text-2xl font-semibold">Individual</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-5xl font-bold tracking-tight">$0</span>
              <span className="text-sm font-medium text-muted-foreground">/ forever</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Everything you need to track and reduce your personal carbon footprint.
            </p>
            <ul className="mt-8 flex-1 space-y-4">
              {["Personal footprint calculator", "Live dashboard tracking", "Basic AI reduction insights", "Up to 3 active goals", "Community access"].map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-primary/20 p-1 text-primary">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/auth"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-6 py-3.5 text-sm font-medium transition-all hover:bg-card hover:border-primary/50"
            >
              Get started for free
            </Link>
          </motion.div>

          {/* Pro Tier */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="glass-strong relative flex flex-col rounded-3xl p-8 shadow-elegant border-primary/30"
          >
            <div className="absolute inset-0 -z-10 rounded-3xl bg-aurora opacity-10" />
            <div className="absolute -top-4 right-8 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-xs font-medium text-background shadow-glow">
              Most Popular
            </div>
            
            <h3 className="font-display text-2xl font-semibold">Pro</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-5xl font-bold tracking-tight">${isAnnual ? "12" : "15"}</span>
              <span className="text-sm font-medium text-muted-foreground">/ month</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Advanced tracking, detailed reports, and team collaboration.
            </p>
            <ul className="mt-8 flex-1 space-y-4">
              {["Everything in Individual", "Advanced AI recommendations", "Exportable PDF reports", "Unlimited goals & history", "Offset purchasing (coming soon)"].map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-primary/20 p-1 text-primary">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/auth"
              className="mt-8 group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:brightness-110"
            >
              Start 14-day free trial
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
