import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import { toast } from "sonner";

export function SiteHeader() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="mx-auto max-w-7xl">
        <div className="glass-strong flex items-center justify-between rounded-2xl px-5 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-aurora shadow-glow">
              <Leaf className="h-4 w-4 text-background" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">
              EcoLens<span className="text-primary"> AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {[
              { label: "Features", href: "#features" },
              { label: "How it works", href: "#how" },
              { label: "Pricing", href: "#pricing" },
              { label: "FAQ", href: "#faq" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.href === "#pricing") {
                    e.preventDefault();
                    toast.info("Pricing plans coming soon!");
                  }
                }}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground md:block"
            >
              Sign in
            </Link>
            <Link
              to="/auth"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:scale-[1.03] hover:brightness-110"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
