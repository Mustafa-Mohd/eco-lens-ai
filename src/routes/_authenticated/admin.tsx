import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users, Activity, Loader2, AlertTriangle, ArrowLeft } from "lucide-react";
import { getAllProfiles, getAllFootprints, isAdmin } from "@/lib/ecolens.functions";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();

  const adminQ = useQuery({ queryKey: ["isAdmin"], queryFn: () => isAdmin() });
  const profilesQ = useQuery({ 
    queryKey: ["allProfiles"], 
    queryFn: () => getAllProfiles(),
    enabled: !!adminQ.data
  });
  const footprintsQ = useQuery({ 
    queryKey: ["allFootprints"], 
    queryFn: () => getAllFootprints(),
    enabled: !!adminQ.data
  });

  const [activeTab, setActiveTab] = useState<"users" | "footprints">("users");

  useEffect(() => {
    if (adminQ.isFetched && !adminQ.data) {
      toast.error("You don't have admin privileges.");
      navigate({ to: "/dashboard" });
    }
  }, [adminQ.data, adminQ.isFetched, navigate]);

  if (adminQ.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!adminQ.data) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen pb-20 pt-24 md:pt-32">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </button>
            <h1 className="font-display text-4xl font-bold tracking-tight text-gradient">Admin Dashboard</h1>
            <p className="mt-2 text-muted-foreground">Manage users and platform data</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "users" ? "bg-primary text-primary-foreground shadow-glow" : "glass hover:bg-white/5"
              }`}
            >
              <Users className="h-4 w-4" /> Users
            </button>
            <button
              onClick={() => setActiveTab("footprints")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "footprints" ? "bg-primary text-primary-foreground shadow-glow" : "glass hover:bg-white/5"
              }`}
            >
              <Activity className="h-4 w-4" /> Footprints
            </button>
          </div>
        </div>

        {(profilesQ.error || footprintsQ.error) && (
          <div className="mb-8 rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-destructive flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Data Access Error</h3>
              <p className="text-sm mt-1">
                Could not fetch data. This is likely due to Row Level Security (RLS) policies on your Supabase tables. 
                Ensure that your admin email has permissions to SELECT all rows in the `profiles` and `footprints` tables.
              </p>
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-strong overflow-hidden rounded-2xl border border-white/10"
        >
          {activeTab === "users" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">User ID</th>
                    <th className="px-6 py-4 font-medium">Display Name</th>
                    <th className="px-6 py-4 font-medium">Onboarded</th>
                    <th className="px-6 py-4 font-medium">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {profilesQ.isLoading ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></td>
                    </tr>
                  ) : profilesQ.data?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground">No users found.</td>
                    </tr>
                  ) : (
                    profilesQ.data?.map((profile: any) => (
                      <tr key={profile.id} className="transition-colors hover:bg-white/5">
                        <td className="whitespace-nowrap px-6 py-4 font-mono text-xs">{profile.id}</td>
                        <td className="px-6 py-4 font-medium">{profile.display_name || "Unknown"}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${profile.onboarded ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {profile.onboarded ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-medium">User ID</th>
                    <th className="px-6 py-4 font-medium">Display Name</th>
                    <th className="px-6 py-4 font-medium text-right">CO₂ Total (kg)</th>
                    <th className="px-6 py-4 font-medium text-right">Eco Score</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {footprintsQ.isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></td>
                    </tr>
                  ) : footprintsQ.data?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">No footprints found.</td>
                    </tr>
                  ) : (
                    footprintsQ.data?.map((fp: any) => (
                      <tr key={fp.id} className="transition-colors hover:bg-white/5">
                        <td className="whitespace-nowrap px-6 py-4 font-mono text-xs">{fp.user_id}</td>
                        <td className="px-6 py-4 font-medium">{fp.profiles?.display_name || "Unknown"}</td>
                        <td className="px-6 py-4 text-right font-mono text-primary">{Math.round(fp.co2_total).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-medium">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${fp.eco_score > 70 ? 'bg-primary/20 text-primary' : fp.eco_score > 40 ? 'bg-yellow-500/20 text-yellow-500' : 'bg-destructive/20 text-destructive'}`}>
                            {Math.round(fp.eco_score)}/100
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(fp.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
