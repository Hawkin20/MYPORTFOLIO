import { createClient } from "@/lib/supabase/server";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description: "Download my professional resume and qualifications.",
};

export default async function ResumePage() {
  const supabase = await createClient();

  const { data: resume, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("is_active", true)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching resume:", error);
  }

  return (
    <div className="page-transition min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Resume</h1>
          <p className="text-lg text-muted-foreground">
            View and download my professional background and experience.
          </p>
        </div>

        {!resume ? (
          <Card className="border-border/50">
            <CardContent className="pt-12 pb-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No resume available at this time.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl mb-2">{resume.file_name}</CardTitle>
                    <CardDescription>
                      Uploaded on {new Date(resume.uploaded_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                  </div>
                  <a
                    href={resume.file_url}
                    download
                    className="flex-shrink-0"
                  >
                    <Button className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </a>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="bg-secondary/50 rounded-lg p-8 border border-border/50">
                  <div className="flex items-center justify-center text-center">
                    <div>
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground text-sm mb-4">
                        Click download to view the full resume document
                      </p>
                      <a href={resume.file_url} download>
                        <Button variant="outline" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download Resume
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
              <p className="text-sm text-muted-foreground">
                For more details about my experience, skills, and projects, please download the
                resume or check out the{" "}
                <a href="/journey" className="text-primary hover:underline">
                  Journey
                </a>
                {" "}section.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
