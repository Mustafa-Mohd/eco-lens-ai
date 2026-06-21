import { Leaf } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-aurora">
                <Leaf className="h-4 w-4 text-background" strokeWidth={2.5} />
              </div>
              <span className="font-display text-lg font-semibold">
                EcoLens<span className="text-primary"> AI</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Turn your sustainability data into measurable climate action. Powered by AI, built for the planet.
            </p>
          </div>

          {[
            { title: "Product", links: [
              { label: "Features", href: "#features" },
              { label: "Dashboard", to: "/dashboard" },
              { label: "AI Insights", href: "#insights" },
              { label: "Reports", comingSoon: true }
            ] },
            { title: "Company", links: [
              { label: "About", comingSoon: true },
              { label: "Blog", comingSoon: true },
              { label: "Careers", comingSoon: true },
              { label: "Press", comingSoon: true }
            ] },
            { title: "Resources", links: [
              { label: "Docs", comingSoon: true },
              { label: "Climate Data", comingSoon: true },
              { label: "Privacy", comingSoon: true },
              { label: "Terms", comingSoon: true }
            ] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 font-display text-sm font-semibold">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                        {l.label}
                      </Link>
                    ) : (
                      <a 
                        href={l.href || "#"} 
                        onClick={l.comingSoon ? (e) => { e.preventDefault(); toast.info(`${l.label} coming soon!`); } : undefined}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 text-xs text-muted-foreground md:flex-row">
          <p>© 2026 EcoLens AI. All rights reserved.</p>
          <p>Made with care for a cooler planet 🌍</p>
        </div>
      </div>
    </footer>
  );
}
