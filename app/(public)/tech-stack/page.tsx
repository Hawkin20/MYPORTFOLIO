import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Stack",
  description: "Technologies and tools used in development.",
};

interface Technology {
  id: string;
  name: string;
  category: "frontend" | "backend" | "database" | "devops" | "tools";
  experience_level: string;
  notes: string | null;
  icon_url: string | null;
  sort_order: number;
}

const CATEGORY_DISPLAY: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  devops: "DevOps",
  tools: "Tools",
};

function getExperienceIndicator(level: string) {
  const normalized = level.toLowerCase();
  if (normalized.includes("expert") || normalized.includes("advanced")) return "5";
  if (normalized.includes("intermediate") || normalized.includes("proficient")) return "4";
  if (normalized.includes("beginner") || normalized.includes("learning")) return "2";
  return "3";
}

export default async function TechStackPage() {
  const supabase = await createClient();

  const { data: technologies, error } = await supabase
    .from("technologies")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching technologies:", error);
  }

  const grouped = (technologies || []).reduce(
    (acc, tech: Technology) => {
      if (!acc[tech.category]) {
        acc[tech.category] = [];
      }
      acc[tech.category].push(tech);
      return acc;
    },
    {} as Record<string, Technology[]>
  );

  const categories = Object.keys(grouped).sort();

  return (
    <div className="page-transition min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Tech Stack</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Technologies and tools I use to build modern, scalable solutions.
          </p>
        </div>

        {!technologies || technologies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-muted-foreground">No technologies configured yet.</p>
          </div>
        ) : (
          <Tabs defaultValue={categories[0] || "frontend"} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {CATEGORY_DISPLAY[category] || category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {grouped[category].map((tech: Technology) => {
                    const dots = parseInt(getExperienceIndicator(tech.experience_level));
                    return (
                      <Card key={tech.id} className="hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3 mb-2">
                            {tech.icon_url ? (
                              <img
                                src={tech.icon_url}
                                alt={tech.name}
                                className="w-8 h-8 rounded"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-xs">
                                {tech.name[0]}
                              </div>
                            )}
                            <div className="flex-1">
                              <CardTitle className="text-lg">{tech.name}</CardTitle>
                              <CardDescription className="text-xs">
                                {CATEGORY_DISPLAY[category]}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-3">
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground mb-1.5">
                              Experience
                            </p>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((dot) => (
                                <div
                                  key={dot}
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    dot <= dots ? "bg-primary" : "bg-secondary"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>

                          {tech.experience_level && (
                            <div>
                              <Badge variant="outline" className="text-xs">
                                {tech.experience_level}
                              </Badge>
                            </div>
                          )}

                          {tech.notes && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {tech.notes}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}
