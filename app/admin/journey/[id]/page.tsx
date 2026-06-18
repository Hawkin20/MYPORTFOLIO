"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { JourneyForm } from "@/components/admin/journey-form";
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

interface JourneyEditPageProps {
  params: Promise<{ id: string }>;
}

export default function JourneyEditPage({ params }: JourneyEditPageProps) {
  const router = useRouter();
  const supabase = createClient();
  const [entry, setEntry] = useState<any>(null);
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

    async function loadEntry() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("journey_entries")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setEntry(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load entry"
        );
        router.push("/admin/journey");
      } finally {
        setIsLoading(false);
      }
    }

    loadEntry();
  }, [id, supabase, router]);

  async function handleDelete() {
    try {
      const { error } = await supabase
        .from("journey_entries")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast.success("Entry deleted successfully");
      router.push("/admin/journey");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete entry"
      );
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading entry...</div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Entry not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Journey Entry</h1>
          <p className="text-muted-foreground mt-2">
            Update "{entry.title}"
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={() => setDeleteId(true)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Entry
        </Button>
      </div>

      <JourneyForm entry={entry} />

      {/* Delete Dialog */}
      <AlertDialog open={deleteId} onOpenChange={setDeleteId}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Entry</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{entry.title}"? This action cannot be undone.
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
