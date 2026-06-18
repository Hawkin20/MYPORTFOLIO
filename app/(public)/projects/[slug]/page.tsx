import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Github, ExternalLink, Calendar } from "lucide-react";

const categoryDisplayNames: Record<string, string> = {
  web_apps: "Web Apps",
  saas: "SaaS",
  automation: "Automation",
  games: "Games",
  experiments: "Experiments",
  school_projects: "School Projects",
};

const statusDisplayNames: Record<string, string> = {
  draft: "Draft",
  in_progress: "In Progress",
  published: "Published",
  archived: "Archived",
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch project
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .is("deleted_at", null)
    .single();

  if (!project) {
    notFound();
  }

  // Fetch project images
  const { data: projectImages } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", project.id)
    .order("sort_order", { ascending: true });

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
      {/* Back Button */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
      </section>

      {/* Hero Section with Screenshot */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-b border-border">
        {project.hero_screenshot_url ? (
          <div className="w-full rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 border border-border/50">
            <div className="w-full aspect-video flex items-center justify-center">
              <div className="text-4xl font-bold text-muted-foreground/20">
                🖼️
              </div>
            </div>
          </div>
        ) : project.cover_image_url ? (
          <div className="w-full rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 border border-border/50">
            <div className="w-full aspect-video flex items-center justify-center">
              <div className="text-4xl font-bold text-muted-foreground/20">
                📸
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 border border-border/50 flex items-center justify-center aspect-video">
            <div className="text-4xl font-bold text-muted-foreground/20">
              {project.title.charAt(0)}
            </div>
          </div>
        )}
      </section>

      {/* Project Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Title and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">
                {categoryDisplayNames[project.category] || project.category}
              </Badge>
              <Badge variant="secondary">
                {statusDisplayNames[project.status] || project.status}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Right: Meta Info */}
          <div className="space-y-6">
            {project.published_at && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Published
                </p>
                <div className="flex items-center gap-2 text-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  {formatDate(project.published_at)}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="space-y-2">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="w-full gap-2 justify-start"
                  >
                    <Github className="h-4 w-4" />
                    View on GitHub
                  </Button>
                </a>
              )}
              {project.live_demo_url && (
                <a
                  href={project.live_demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full gap-2 justify-start">
                    <ExternalLink className="h-4 w-4" />
                    Live Demo
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Left: Features and Challenges */}
          <div className="md:col-span-2 space-y-8">
            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                <ul className="space-y-3">
                  {project.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex gap-3">
                      <span className="text-primary font-bold mt-1">✓</span>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Challenges */}
            {project.challenges && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Challenges & Solutions</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {project.challenges}
                </p>
              </div>
            )}
          </div>

          {/* Right: Technologies */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Technologies</h2>
            {project.technologies && project.technologies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No technologies listed
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {projectImages && projectImages.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-border">
          <h2 className="text-2xl font-bold mb-8">Project Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectImages.map((image) => (
              <Dialog key={image.id}>
                <DialogTrigger asChild>
                  <div className="group cursor-pointer">
                    <Card className="overflow-hidden hover:border-primary/50 transition-all h-64">
                      <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-muted-foreground/20 mb-2">
                            🖼️
                          </div>
                          {image.caption && (
                            <p className="text-sm text-muted-foreground px-2">
                              {image.caption}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <div className="w-full bg-secondary rounded-lg p-4 flex items-center justify-center min-h-96">
                    <div className="text-center">
                      <div className="text-6xl font-bold text-muted-foreground/20 mb-4">
                        🖼️
                      </div>
                      {image.caption && (
                        <p className="text-sm text-muted-foreground">
                          {image.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-8 text-center bg-secondary/30">
          <h2 className="text-2xl font-bold mb-4">Interested in similar work?</h2>
          <p className="text-muted-foreground mb-6">
            Feel free to reach out to discuss how I can help with your next
            project.
          </p>
          <Link href="/about">
            <Button size="lg">Get In Touch</Button>
          </Link>
        </Card>
      </section>
    </div>
  );
}
