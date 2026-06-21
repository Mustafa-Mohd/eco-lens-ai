import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="mx-auto max-w-7xl">
        <div className="glass-strong flex items-center justify-between rounded-2xl px-5 py-3">
          <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-aurora shadow-glow">
              <Leaf className="h-4 w-4 text-background" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">
              EcoLens<span className="text-primary"> AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((item) => (
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
              onClick={() => setMobileMenuOpen(false)}
            >
              Get started
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-1 p-1 text-muted-foreground hover:text-foreground md:hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-6 right-6 top-24 rounded-2xl glass-strong p-6 shadow-elegant md:hidden"
          >
            <nav className="flex flex-col gap-4 text-center">
              {links.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    if (item.href === "#pricing") {
                      e.preventDefault();
                      toast.info("Pricing plans coming soon!");
                    }
                  }}
                  className="font-display text-lg font-medium text-foreground transition-colors hover:text-primary"
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-2 border-t border-border/50 pt-4">
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign in
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
