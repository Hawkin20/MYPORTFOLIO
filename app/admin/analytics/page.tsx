import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = {
  title: "Analytics",
};

export default async function AnalyticsPage() {
  const supabase = await createClient();

  // Fetch analytics data
  const { data: analyticsData } = await supabase
    .from("visitor_analytics")
    .select("page_path")
    .order("visited_at", { ascending: false });

  // Group by page_path
  const pageStats: Record<string, number> = {};
  analyticsData?.forEach((record) => {
    const path = record.page_path || "(unknown)";
    pageStats[path] = (pageStats[path] || 0) + 1;
  });

  // Sort by count descending
  const sortedPages = Object.entries(pageStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 50); // Top 50 pages

  const totalVisits = analyticsData?.length || 0;
  const uniquePages = Object.keys(pageStats).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Portfolio visitor analytics
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalVisits}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total page views tracked
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{uniquePages}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Different pages visited
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Page Stats */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Most Visited Pages</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {sortedPages.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No analytics data available yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Page Path</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPages.map(([path, count]) => (
                  <TableRow key={path} className="border-border">
                    <TableCell className="font-medium text-sm">
                      {path}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {count}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {((count / totalVisits) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Note */}
      <Card className="bg-card border-blue-500/20">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            This analytics dashboard shows page visit statistics tracked by the
            visitor analytics system. Data includes page paths and timestamps of
            visits to your portfolio.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
