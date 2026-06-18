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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, FileIcon, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const mediaSchema = z.object({
  file_url: z.string().min(1, "File URL is required"),
  file_name: z.string().min(1, "File name is required"),
  folder: z.enum([
    "profile",
    "projects",
    "journey",
    "products",
    "services",
    "resumes",
  ]),
  alt_text: z.string().optional(),
});

type MediaFormValues = z.infer<typeof mediaSchema>;

const folderLabels: Record<string, string> = {
  profile: "Profile",
  projects: "Projects",
  journey: "Journey",
  products: "Products",
  services: "Services",
  resumes: "Resumes",
};

export default function MediaPage() {
  const supabase = createClient();
  const [media, setMedia] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>("");

  const form = useForm<MediaFormValues>({
    resolver: zodResolver(mediaSchema),
    defaultValues: {
      file_url: "",
      file_name: "",
      folder: "projects",
      alt_text: "",
    },
  });

  useEffect(() => {
    loadMedia();
  }, []);

  async function loadMedia() {
    try {
      setIsLoading(true);
      let query = supabase.from("media_files").select("*");

      if (selectedFolder) {
        query = query.eq("folder", selectedFolder);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load media"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(values: MediaFormValues) {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("media_files").insert([
        {
          file_url: values.file_url,
          file_name: values.file_name,
          folder: values.folder,
          alt_text: values.alt_text || null,
          file_path: `${values.folder}/${values.file_name}`,
          file_size: 0,
          mime_type: "application/octet-stream",
        },
      ]);

      if (error) throw error;
      toast.success("Media uploaded successfully");
      form.reset();
      setIsDialogOpen(false);
      loadMedia();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function deleteMedia(id: string) {
    try {
      const { error } = await supabase
        .from("media_files")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Media deleted successfully");
      setDeleteId(null);
      loadMedia();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete media"
      );
    }
  }

  useEffect(() => {
    loadMedia();
  }, [selectedFolder]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground mt-2">
            Manage your portfolio media files
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Upload File
        </Button>
      </div>

      {/* Filter */}
      <div className="w-full md:w-48">
        <Select value={selectedFolder} onValueChange={setSelectedFolder}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by folder..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Folders</SelectItem>
            {Object.entries(folderLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">
          Loading media...
        </div>
      ) : media.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground bg-card rounded-lg">
          No media files. Upload one to get started!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {media.map((file) => (
            <Card key={file.id} className="bg-card hover:border-primary/50 transition-colors overflow-hidden">
              <div className="aspect-video bg-secondary flex items-center justify-center relative group">
                {file.file_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={file.file_url}
                    alt={file.alt_text || file.file_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileIcon className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <CardContent className="p-4">
                <p className="font-medium text-sm truncate">
                  {file.file_name}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {folderLabels[file.folder] || file.folder}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(file.file_url);
                      toast.success("URL copied to clipboard");
                    }}
                  >
                    Copy URL
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600"
                    onClick={() => setDeleteId(file.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Media File</DialogTitle>
          </DialogHeader>
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
                        placeholder="https://example.com/image.jpg"
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
                        placeholder="my-image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Folder */}
              <FormField
                control={form.control}
                name="folder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Folder</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(folderLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Alt Text */}
              <FormField
                control={form.control}
                name="alt_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alt Text</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Image description for accessibility"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "Uploading..." : "Upload"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Media</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this media file? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMedia(deleteId)}
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
