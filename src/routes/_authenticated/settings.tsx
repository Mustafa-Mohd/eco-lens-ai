import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Leaf, User, ArrowLeft, LogOut, Loader2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getProfile, updateProfile } from "@/lib/ecolens.functions";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const navigate = useNavigate();

  const profileQ = useQuery({ queryKey: ["profile"], queryFn: () => getProfile() });

  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profileQ.data?.display_name) {
      setDisplayName(profileQ.data.display_name);
    }
  }, [profileQ.data]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ data: { display_name: displayName } });
      toast.success("Profile updated");
      profileQ.refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (profileQ.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen px-4 py-12">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 flex items-center gap-4">
          <Link
            to="/dashboard"
            className="glass flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="font-display text-2xl font-semibold">Settings</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Profile Section */}
          <div className="glass-strong rounded-3xl p-6 shadow-elegant md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold">Profile Details</h2>
                <p className="text-sm text-muted-foreground">Update your personal information.</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-muted-foreground">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-border bg-card/40 px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary/50 focus:bg-card/80"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading || displayName === profileQ.data?.display_name}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition-all hover:brightness-110 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Account Actions Section */}
          <div className="glass-strong rounded-3xl p-6 shadow-elegant md:p-8">
            <h2 className="mb-4 font-display text-lg font-semibold">Account Actions</h2>
            
            <div className="space-y-3">
              <Link
                to="/onboarding"
                className="flex w-full items-center justify-between rounded-xl border border-border bg-card/40 p-4 transition-colors hover:bg-card/80"
              >
                <div>
                  <div className="font-medium text-foreground">Retake Footprint Quiz</div>
                  <div className="text-sm text-muted-foreground">Recalculate your baseline emissions.</div>
                </div>
                <Leaf className="h-4 w-4 text-primary" />
              </Link>
              
              <button
                onClick={signOut}
                className="flex w-full items-center justify-between rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive transition-colors hover:bg-destructive/10"
              >
                <div>
                  <div className="font-medium text-left">Sign Out</div>
                  <div className="text-sm opacity-80 text-left">End your current session.</div>
                </div>
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
