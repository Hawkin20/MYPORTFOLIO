"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ServiceForm } from "@/components/admin/service-form";
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

interface ServiceEditPageProps {
  params: Promise<{ id: string }>;
}

export default function ServiceEditPage({ params }: ServiceEditPageProps) {
  const router = useRouter();
  const supabase = createClient();
  const [service, setService] = useState<any>(null);
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

    async function loadService() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        setService(data);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to load service"
        );
        router.push("/admin/services");
      } finally {
        setIsLoading(false);
      }
    }

    loadService();
  }, [id, supabase, router]);

  async function handleDelete() {
    try {
      const { error } = await supabase
        .from("services")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      toast.success("Service deleted successfully");
      router.push("/admin/services");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete service"
      );
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading service...</div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Service not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Service</h1>
          <p className="text-muted-foreground mt-2">
            Update {service.name}
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={() => setDeleteId(true)}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Service
        </Button>
      </div>

      <ServiceForm service={service} />

      {/* Delete Dialog */}
      <AlertDialog open={deleteId} onOpenChange={setDeleteId}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Service</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{service.name}"? This action cannot be undone.
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
