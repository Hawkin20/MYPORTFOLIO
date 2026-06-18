import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export default async function JourneyPage() {
  const supabase = await createClient();

  // Fetch journey entries
  const { data: journeyEntries } = await supabase
    .from("journey_entries")
    .select("*")
    .is("deleted_at", null)
    .order("date", { ascending: false });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">My Journey</h1>
          <p className="text-xl text-muted-foreground">
            Milestones, learnings, and growth along the way
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {journeyEntries && journeyEntries.length > 0 ? (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/20 transform md:-translate-x-1/2" />

            {/* Entries */}
            <div className="space-y-12">
              {journeyEntries.map((entry, index) => (
                <div key={entry.id} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute left-0 md:left-1/2 top-0 w-12 h-12 bg-background border-4 border-primary rounded-full flex items-center justify-center transform md:-translate-x-1/2 -translate-x-0 z-10">
                    <div className="w-3 h-3 bg-primary rounded-full" />
                  </div>

                  {/* Content */}
                  <div className={`pl-20 md:pl-0 md:${index % 2 === 0 ? "pr-[calc(50%+3rem)]" : "pl-[calc(50%+3rem)]"}`}>
                    <Card className="p-6 hover:border-primary/50 transition-all hover:shadow-lg">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-bold text-foreground">
                          {entry.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap flex-shrink-0">
                          <Calendar className="h-4 w-4" />
                          {formatDate(entry.date)}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {entry.description}
                      </p>

                      {/* Tags */}
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Image */}
                      {entry.image_url && (
                        <div className="mt-4 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                          <div className="aspect-video w-full flex items-center justify-center">
                            <div className="text-4xl font-bold text-muted-foreground/20">
                              📸
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">
              Journey milestones coming soon
            </p>
          </Card>
        )}
      </section>

      {/* Bottom decoration */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-t border-border pt-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Continuing to Build</h2>
          <p className="text-muted-foreground">
            Every day is an opportunity to learn, grow, and create something
            meaningful. My journey is ongoing.
          </p>
        </div>
      </section>
    </div>
  );
}
