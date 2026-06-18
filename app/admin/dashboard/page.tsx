import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FolderKanban,
  Image,
  Users,
  Eye,
  Mail,
  Activity,
} from "lucide-react";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch stats
  const [
    projectsResult,
    mediaResult,
    profilesResult,
    analyticsResult,
    messagesResult,
    activitiesResult,
  ] = await Promise.all([
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("media_files").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("visitor_analytics")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact" })
      .eq("read", false),
    supabase.from("activities").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    {
      label: "Projects",
      value: projectsResult.count || 0,
      icon: FolderKanban,
      color: "text-blue-500",
    },
    {
      label: "Media Files",
      value: mediaResult.count || 0,
      icon: Image,
      color: "text-purple-500",
    },
    {
      label: "Users",
      value: profilesResult.count || 0,
      icon: Users,
      color: "text-green-500",
    },
    {
      label: "Page Visits",
      value: analyticsResult.count || 0,
      icon: Eye,
      color: "text-orange-500",
    },
    {
      label: "Unread Messages",
      value: messagesResult.data?.length || 0,
      icon: Mail,
      color: "text-red-500",
    },
    {
      label: "Total Activities",
      value:
        (activitiesResult.data?.length === 5
          ? activitiesResult.count || 0
          : activitiesResult.data?.length) || 0,
      icon: Activity,
      color: "text-cyan-500",
    },
  ];

  const activities = activitiesResult.data || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your portfolio.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="bg-card hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activities */}
      {activities.length > 0 && (
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 pb-4 border-b border-border last:border-b-0 last:pb-0"
                >
                  <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {activity.action} on {activity.entity_type}
                    </p>
                    {activity.details && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {JSON.stringify(activity.details).substring(0, 100)}...
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
