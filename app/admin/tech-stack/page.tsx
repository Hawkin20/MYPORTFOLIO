"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const categoryLabels: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  devops: "DevOps",
  tools: "Tools",
};

const categoryColors: Record<string, string> = {
  frontend: "bg-blue-500/20 text-blue-400",
  backend: "bg-green-500/20 text-green-400",
  database: "bg-purple-500/20 text-purple-400",
  devops: "bg-orange-500/20 text-orange-400",
  tools: "bg-cyan-500/20 text-cyan-400",
};

const levelColors: Record<string, string> = {
  Beginner: "bg-gray-500/20 text-gray-400",
  Intermediate: "bg-blue-500/20 text-blue-400",
  Advanced: "bg-orange-500/20 text-orange-400",
  Expert: "bg-green-500/20 text-green-400",
};

export default function TechStackPage() {
  const supabase = createClient();
  const [techs, setTechs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadTechs();
  }, []);

  async function loadTechs() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("technologies")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setTechs(data || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load technologies"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteTech(id: string) {
    try {
      const { error } = await supabase
        .from("technologies")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Technology deleted successfully");
      setDeleteId(null);
      loadTechs();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete technology"
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tech Stack</h1>
          <p className="text-muted-foreground mt-2">
            Manage technologies and skills
          </p>
        </div>
        <Link href="/admin/tech-stack/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Technology
          </Button>
        </Link>
      </div>

      {/* Tech Stack Table */}
      <Card className="bg-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading technologies...
            </div>
          ) : techs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No technologies added yet. Add one to get started!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {techs.map((tech) => (
                  <TableRow key={tech.id} className="border-border">
                    <TableCell className="font-medium">{tech.name}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          categoryColors[tech.category] || "bg-muted"
                        }
                        variant="secondary"
                      >
                        {categoryLabels[tech.category] || tech.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          levelColors[tech.experience_level] || "bg-muted"
                        }
                        variant="secondary"
                      >
                        {tech.experience_level}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/tech-stack/${tech.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                          onClick={() => setDeleteId(tech.id)}
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
          <AlertDialogTitle>Delete Technology</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this technology? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteTech(deleteId)}
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
