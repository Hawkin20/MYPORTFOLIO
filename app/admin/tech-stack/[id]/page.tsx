"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { TechForm } from "@/components/admin/tech-form";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TechEditPageProps {
  params: Promise<{ id: string }>;
}

export default function TechEditPage({ params }: TechEditPageProps) {
  const router = useRouter();
  const supabase = createClient();
  const [tech, setTech] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(false);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (!id) return;

    async function loadTech() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("technologies")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setTech(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load technology"
        );
        router.push("/admin/tech-stack");
      } finally {
        setIsLoading(false);
      }
    }

    loadTech();
  }, [id, supabase, router]);

  async function handleDelete() {
    try {
      const { error } = await supabase
        .from("technologies")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Technology deleted successfully");
      router.push("/admin/tech-stack");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete technology"
      );
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading technology...</div>
      </div>
    );
  }

  if (!tech) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Technology not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Technology</h1>
          <p className="text-muted-foreground mt-2">
            Update {tech.name}
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={() => setDeleteId(true)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Technology
        </Button>
      </div>

      <TechForm tech={tech} />

      {/* Delete Dialog */}
      <AlertDialog open={deleteId} onOpenChange={setDeleteId}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Technology</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{tech.name}"? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
