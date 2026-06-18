"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const resumeSchema = z.object({
  file_url: z.string().min(1, "File URL is required"),
  file_name: z.string().min(1, "File name is required"),
  is_active: z.boolean().default(false),
});

type ResumeFormValues = z.infer<typeof resumeSchema>;

export default function ResumePage() {
  const supabase = createClient();
  const [resumes, setResumes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      file_url: "",
      file_name: "",
      is_active: false,
    },
  });

  useEffect(() => {
    loadResumes();
  }, []);

  async function loadResumes() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .order("uploaded_at", { ascending: false });

      if (error) throw error;
      setResumes(data || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load resumes"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(values: ResumeFormValues) {
    setIsSubmitting(true);
    try {
      // If this is active, deactivate others
      if (values.is_active) {
        await supabase
          .from("resumes")
          .update({ is_active: false })
          .eq("is_active", true);
      }

      const { error } = await supabase.from("resumes").insert([
        {
          file_url: values.file_url,
          file_name: values.file_name,
          is_active: values.is_active,
        },
      ]);

      if (error) throw error;
      toast.success("Resume uploaded successfully");
      form.reset();
      loadResumes();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteResume(id: string) {
    try {
      const { error } = await supabase
        .from("resumes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Resume deleted successfully");
      setDeleteId(null);
      loadResumes();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete resume"
      );
    }
  }

  async function toggleActive(id: string, currentState: boolean) {
    try {
      if (!currentState) {
        // If activating, deactivate all others
        await supabase
          .from("resumes")
          .update({ is_active: false })
          .eq("is_active", true);
      }

      const { error } = await supabase
        .from("resumes")
        .update({ is_active: !currentState })
        .eq("id", id);

      if (error) throw error;
      toast.success("Resume status updated");
      loadResumes();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update resume"
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume Management</h1>
        <p className="text-muted-foreground mt-2">
          Upload and manage your resume files
        </p>
      </div>

      {/* Upload Form */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Upload New Resume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* File URL */}
              <FormField
                control={form.control}
                name="file_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/resume.pdf"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* File Name */}
              <FormField
                control={form.control}
                name="file_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="My Resume - 2024.pdf"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Active */}
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Set as active (visible on portfolio)
                    </FormLabel>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "Uploading..." : "Upload Resume"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Resumes List */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Your Resumes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading resumes...
            </div>
          ) : resumes.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No resumes uploaded yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>File Name</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resumes.map((resume) => (
                  <TableRow key={resume.id} className="border-border">
                    <TableCell className="font-medium">
                      {resume.file_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(resume.uploaded_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {resume.is_active ? (
                        <Badge className="bg-green-500/20 text-green-400">
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-muted">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toggleActive(resume.id, resume.is_active)
                          }
                        >
                          {resume.is_active
                            ? "Deactivate"
                            : "Activate"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                          onClick={() => setDeleteId(resume.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Resume</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this resume? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteResume(deleteId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
