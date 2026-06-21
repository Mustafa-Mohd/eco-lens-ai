import { Leaf } from "lucide-react";

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
            { title: "Product", links: ["Features", "Dashboard", "AI Insights", "Reports"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Press"] },
            { title: "Resources", links: ["Docs", "Climate Data", "Privacy", "Terms"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 font-display text-sm font-semibold">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {l}
                    </a>
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
