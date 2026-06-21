import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "How does EcoLens calculate my carbon footprint?",
    a: "We use peer-reviewed emission factors from the IPCC and country-specific grid data, combined with your answers from the onboarding questionnaire and any connected data sources.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your personal data is encrypted end-to-end. We never sell data and you can export or delete everything at any time.",
  },
  {
    q: "How accurate are the AI recommendations?",
    a: "Each recommendation is grounded in published lifecycle assessments and adjusted to your behavior profile. We surface confidence levels with every estimate.",
  },
  {
    q: "Can I use this for my company?",
    a: "EcoLens Teams is in private beta. Reach out via the contact form to join the waitlist for ESG-grade reporting.",
  },
  {
    q: "Do you support carbon offsets?",
    a: "Yes — once you've reduced what you can, EcoLens connects you with verified Gold Standard offset projects to neutralize the rest.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-4xl font-semibold tracking-tight md:text-5xl"
        >
          Questions, <span className="text-gradient">answered</span>
        </motion.h2>

        <div className="mt-14 space-y-3">
          {faqs.map((f, i) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass overflow-hidden rounded-2xl"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-white/[0.03]"
              >
                <span className="font-display text-base font-semibold">{f.q}</span>
                <Plus
                  className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                    open === i ? "rotate-45" : ""
                  }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
