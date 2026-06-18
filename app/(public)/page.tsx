import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categoryDisplayNames: Record<string, string> = {
  web_apps: "Web Apps",
  saas: "SaaS",
  automation: "Automation",
  games: "Games",
  experiments: "Experiments",
  school_projects: "School Projects",
};

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch settings
  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .single();

  // Fetch published projects with images
  const { data: projects } = await supabase
    .from("projects")
    .select(
      `
      id,
      title,
      slug,
      description,
      technologies,
      cover_image_url,
      category,
      published_at
    `
    )
    .eq("status", "published")
    .is("deleted_at", null)
    .order("published_at", { ascending: false })
    .limit(3);

  // Fetch stats
  const { count: projectCount } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("status", "published")
    .is("deleted_at", null);

  const { count: techCount } = await supabase
    .from("technologies")
    .select("*", { count: "exact", head: true });

  const { data: journeyData } = await supabase
    .from("journey_entries")
    .select("id, date")
    .is("deleted_at", null)
    .order("date", { ascending: true })
    .limit(1);

  const journeyCount = await supabase
    .from("journey_entries")
    .select("*", { count: "exact", head: true })
    .is("deleted_at", null);

  const yearsLearning = journeyData && journeyData.length > 0
    ? new Date().getFullYear() - new Date(journeyData[0].date).getFullYear()
    : 0;

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Text Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
                  {settings?.full_name || "Developer"}
                </h1>
                <p className="text-xl text-primary mb-2">
                  {settings?.owner_title || "Software Engineer"}
                </p>
              </div>
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                {settings?.biography ||
                  "Building beautiful, performant software with a focus on user experience and clean code."}
              </p>
              <div className="flex gap-3 pt-4">
                <Link href="/about">
                  <Button size="lg" className="gap-2">
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button size="lg" variant="outline">
                    View Projects
                  </Button>
                </Link>
              </div>
              <div className="flex gap-4 pt-4">
                {settings?.github_url && (
                  <a
                    href={settings.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {settings?.linkedin_url && (
                  <a
                    href={settings.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
                {settings?.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Right: Profile Photo or Avatar */}
            <div className="flex justify-center">
              {settings?.profile_photo_url ? (
                <div className="w-full max-w-sm aspect-square rounded-xl overflow-hidden border border-border/50 bg-gradient-to-br from-primary/20 to-secondary">
                  {/* Image would be displayed here */}
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-transparent" />
                </div>
              ) : (
                <div className="w-full max-w-sm aspect-square rounded-xl bg-gradient-to-br from-primary/20 to-secondary border border-border/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-primary/30">DS</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Project */}
      {projects && projects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Featured Project</h2>
            <p className="text-muted-foreground">Latest work from the studio</p>
          </div>
          <Link href={`/projects/${projects[0].slug}`}>
            <Card className="group overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl cursor-pointer">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                {/* Image */}
                <div className="md:col-span-1">
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all overflow-hidden">
                    {projects[0].cover_image_url ? (
                      <div className="w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-4xl font-bold text-muted-foreground/20">
                          {projects[0].title.charAt(0)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">
                        {categoryDisplayNames[
                          projects[0].category as keyof typeof categoryDisplayNames
                        ] || projects[0].category}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {projects[0].title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {projects[0].description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {projects[0].technologies &&
                      projects[0].technologies.slice(0, 3).map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    {projects[0].technologies &&
                      projects[0].technologies.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{projects[0].technologies.length - 3} more
                        </Badge>
                      )}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        </section>
      )}

      {/* Recent Projects Grid */}
      {projects && projects.length > 1 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Recent Projects</h2>
            <p className="text-muted-foreground">
              A selection of recent work
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.slice(1, 3).map((project) => (
              <Link key={project.id} href={`/projects/${project.slug}`}>
                <Card className="group h-full overflow-hidden hover:border-primary/50 transition-all hover:shadow-xl cursor-pointer">
                  <div className="p-6 h-full flex flex-col">
                    {/* Image */}
                    <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all mb-4 overflow-hidden flex-shrink-0">
                      {project.cover_image_url ? (
                        <div className="w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-4xl font-bold text-muted-foreground/20">
                            {project.title.charAt(0)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-grow">
                      <Badge variant="outline" className="w-fit mb-2">
                        {categoryDisplayNames[
                          project.category as keyof typeof categoryDisplayNames
                        ] || project.category}
                      </Badge>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies &&
                          project.technologies.slice(0, 2).map((tech: string) => (
                            <Badge key={tech} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        {project.technologies &&
                          project.technologies.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{project.technologies.length - 2}
                            </Badge>
                          )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 rounded-lg bg-secondary/30 border border-border/50">
            <div className="text-3xl font-bold text-primary mb-2">
              {projectCount || 0}
            </div>
            <p className="text-sm text-muted-foreground">Projects Built</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-secondary/30 border border-border/50">
            <div className="text-3xl font-bold text-primary mb-2">
              {techCount || 0}
            </div>
            <p className="text-sm text-muted-foreground">Technologies</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-secondary/30 border border-border/50">
            <div className="text-3xl font-bold text-primary mb-2">
              {journeyCount.count || 0}
            </div>
            <p className="text-sm text-muted-foreground">Journey Milestones</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-secondary/30 border border-border/50">
            <div className="text-3xl font-bold text-primary mb-2">
              {yearsLearning}+
            </div>
            <p className="text-sm text-muted-foreground">Years Learning</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to create something?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore my work, learn about my journey, or get in touch to discuss
            your next project.
          </p>
          <Link href="/projects">
            <Button size="lg" className="gap-2">
              Explore All Projects
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
