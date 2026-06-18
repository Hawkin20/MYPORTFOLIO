"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const journeySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  image_url: z.string().optional(),
  tags: z.string(),
});

type JourneyFormValues = z.infer<typeof journeySchema>;

interface JourneyFormProps {
  entry?: any;
}

export function JourneyForm({ entry }: JourneyFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<JourneyFormValues>({
    resolver: zodResolver(journeySchema),
    defaultValues: {
      title: entry?.title || "",
      description: entry?.description || "",
      date: entry?.date ? entry.date.split("T")[0] : "",
      image_url: entry?.image_url || "",
      tags: entry?.tags?.join(", ") || "",
    },
  });

  async function onSubmit(values: JourneyFormValues) {
    setIsLoading(true);
    try {
      const entryData = {
        title: values.title,
        description: values.description,
        date: values.date,
        image_url: values.image_url || null,
        tags: values.tags
          ? values.tags.split(",").map((t) => t.trim())
          : [],
      };

      if (entry) {
        const { error } = await supabase
          .from("journey_entries")
          .update(entryData)
          .eq("id", entry.id);

        if (error) throw error;
        toast.success("Journey entry updated successfully");
      } else {
        const { error } = await supabase
          .from("journey_entries")
          .insert([entryData]);

        if (error) throw error;
        toast.success("Journey entry created successfully");
      }

      router.push("/admin/journey");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>{entry ? "Edit Journey Entry" : "Create Journey Entry"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Journey milestone..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell the story..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image URL */}
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
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

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="learning, achievement, milestone"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Comma-separated list of tags
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading
                  ? "Saving..."
                  : entry
                    ? "Update Entry"
                    : "Create Entry"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/journey")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
