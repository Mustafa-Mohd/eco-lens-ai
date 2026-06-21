import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";
import { Leaf, ArrowRight, RefreshCcw } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 -z-10 bg-aurora opacity-10 blur-3xl" />
      <div className="glass-strong relative z-10 w-full max-w-md rounded-3xl p-8 text-center shadow-elegant md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 shadow-glow">
          <Leaf className="h-8 w-8 text-primary" strokeWidth={2.5} />
        </div>
        <h1 className="mt-8 font-display text-7xl font-bold tracking-tight text-gradient">404</h1>
        <h2 className="mt-4 font-display text-2xl font-semibold">Lost in the woods</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The page you're looking for doesn't exist, has been moved, or perhaps was naturally biodegraded.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:brightness-110"
          >
            Find your way home
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 -z-10 bg-destructive/5 blur-3xl" />
      <div className="glass-strong relative z-10 w-full max-w-md rounded-3xl p-8 text-center shadow-elegant md:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
          <RefreshCcw className="h-8 w-8 text-destructive" strokeWidth={2.5} />
        </div>
        <h1 className="mt-8 font-display text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Our system encountered an unexpected error. Please try refreshing the page or navigating back home.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:brightness-110"
          >
            <RefreshCcw className="h-4 w-4 transition-transform group-hover:rotate-180" />
            Try again
          </button>
          <a
            href="/"
            className="glass inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-medium transition-all hover:bg-white/10"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster theme="dark" position="top-center" richColors />
    </QueryClientProvider>
  );
}
