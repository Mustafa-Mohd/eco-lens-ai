import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Features } from "@/components/sections/Features";
import { Demo } from "@/components/sections/Demo";
import { Insights } from "@/components/sections/Insights";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoLens AI — See your carbon footprint, reduce it intelligently" },
      {
        name: "description",
        content:
          "EcoLens AI transforms your sustainability data into personalized, AI-powered actions. Track emissions, set goals, and cut your carbon footprint with measurable impact.",
      },
      { property: "og:title", content: "EcoLens AI — AI-powered climate intelligence" },
      {
        property: "og:description",
        content:
          "Turn raw sustainability data into measurable climate action with personalized AI insights.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate({ to: "/dashboard" });
      }
    });
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <SiteHeader />
      <main>
        <Hero />
        <Problem />
        <Features />
        <Demo />
        <Insights />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <SiteFooter />
    </div>
  );
}
