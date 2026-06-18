import { createClient } from "@/lib/supabase/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Briefcase, Code2, Target } from "lucide-react";

const techCategoryNames: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  devops: "DevOps",
  tools: "Tools",
};

export default async function AboutPage() {
  const supabase = await createClient();

  // Fetch settings
  const { data: settings } = await supabase
    .from("settings")
    .select("*")
    .single();

  // Fetch technologies grouped by category
  const { data: technologies } = await supabase
    .from("technologies")
    .select("*")
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  // Fetch gallery images
  const { data: galleryImages } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true });

  // Group technologies by category
  const techsByCategory: Record<string, typeof technologies> = {};
  technologies?.forEach((tech) => {
    if (!techsByCategory[tech.category]) {
      techsByCategory[tech.category] = [];
    }
    techsByCategory[tech.category]!.push(tech);
  });

  const goals = [
    "Build products that solve real problems",
    "Master full-stack development across modern tech stacks",
    "Contribute to open-source communities",
    "Share knowledge and mentor emerging developers",
    "Create memorable user experiences",
  ];

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">About Me</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Passionate software engineer focused on building beautiful,
            performant products
          </p>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 border-t border-border">
        <Tabs defaultValue="biography" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="biography">Biography</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="technologies">Technologies</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          {/* Biography Tab */}
          <TabsContent value="biography" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-4">Professional Background</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  {settings?.biography ||
                    "I'm a passionate software engineer dedicated to creating beautiful, performant, and user-centered digital experiences. With expertise across the full stack, I work with modern technologies to build solutions that matter."}
                </p>
                <p>
                  My approach combines technical excellence with creative problem-solving, always keeping the end-user at the center of every decision. I believe in writing clean, maintainable code and continuously learning new technologies.
                </p>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-primary" />
                Professional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                  <p className="text-lg font-semibold">
                    {settings?.full_name || "Developer"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Title</p>
                  <p className="text-lg font-semibold">
                    {settings?.owner_title || "Software Engineer"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="text-lg font-semibold break-all">
                    {settings?.email || "contact@example.com"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="text-lg font-semibold">Global</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Code2 className="h-6 w-6 text-primary" />
                Core Competencies
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Frontend Development</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "React",
                      "Next.js",
                      "TypeScript",
                      "Tailwind CSS",
                      "Vue.js",
                      "HTML/CSS",
                    ].map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Backend Development</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Node.js",
                      "PostgreSQL",
                      "REST APIs",
                      "GraphQL",
                      "Authentication",
                      "Database Design",
                    ].map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">DevOps & Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Git",
                      "Docker",
                      "CI/CD",
                      "AWS",
                      "Supabase",
                      "Vercel",
                    ].map((skill) => (
                      <Badge key={skill} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Target className="h-6 w-6 text-primary" />
                Goals & Aspirations
              </h2>
              <ul className="space-y-3">
                {goals.map((goal, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span className="text-muted-foreground">{goal}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </TabsContent>

          {/* Technologies Tab */}
          <TabsContent value="technologies" className="space-y-6">
            {Object.entries(techsByCategory).length > 0 ? (
              Object.entries(techsByCategory).map(([category, techs]) => (
                <Card key={category} className="p-8">
                  <h3 className="text-2xl font-bold mb-6">
                    {techCategoryNames[category] || category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {techs?.map((tech) => (
                      <div
                        key={tech.id}
                        className="p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          {tech.icon_url && (
                            <div className="w-8 h-8 rounded flex-shrink-0 bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                              {tech.name.charAt(0)}
                            </div>
                          )}
                          <div className="flex-grow min-w-0">
                            <h4 className="font-semibold text-sm mb-1">
                              {tech.name}
                            </h4>
                            <Badge variant="secondary" className="text-xs mb-2">
                              {tech.experience_level || "Intermediate"}
                            </Badge>
                            {tech.notes && (
                              <p className="text-xs text-muted-foreground">
                                {tech.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No technologies added yet</p>
              </Card>
            )}
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            {galleryImages && galleryImages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((image) => (
                  <Dialog key={image.id}>
                    <DialogTrigger asChild>
                      <div className="group cursor-pointer">
                        <Card className="overflow-hidden hover:border-primary/50 transition-all h-64">
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-4xl font-bold text-muted-foreground/20 mb-2">
                                {image.image_url ? "🖼" : "📷"}
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
                            {image.image_url ? "🖼" : "📷"}
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
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Gallery coming soon</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <Card className="p-8 text-center bg-secondary/30">
          <h2 className="text-2xl font-bold mb-4">Let's Connect</h2>
          <p className="text-muted-foreground mb-6">
            Interested in collaborating or just want to say hello?
          </p>
          {settings?.email && (
            <a href={`mailto:${settings.email}`}>
              <Button size="lg" className="gap-2">
                <Mail className="h-4 w-4" />
                Get In Touch
              </Button>
            </a>
          )}
        </Card>
      </section>
    </div>
  );
}
