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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const settingsSchema = z.object({
  site_name: z.string().min(1, "Site name is required"),
  owner_name: z.string().min(1, "Owner name is required"),
  owner_title: z.string().optional(),
  biography: z.string().optional(),
  profile_photo_url: z.string().optional(),
  email: z.string().email().optional(),
  github_url: z.string().optional(),
  linkedin_url: z.string().optional(),
  facebook_url: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      site_name: "",
      owner_name: "",
      owner_title: "",
      biography: "",
      profile_photo_url: "",
      email: "",
      github_url: "",
      linkedin_url: "",
      facebook_url: "",
      seo_title: "",
      seo_description: "",
      seo_keywords: "",
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        form.reset({
          site_name: data.site_name || "",
          owner_name: data.owner_name || "",
          owner_title: data.owner_title || "",
          biography: data.biography || "",
          profile_photo_url: data.profile_photo_url || "",
          email: data.email || "",
          github_url: data.github_url || "",
          linkedin_url: data.linkedin_url || "",
          facebook_url: data.facebook_url || "",
          seo_title: data.seo_title || "",
          seo_description: data.seo_description || "",
          seo_keywords: data.seo_keywords || "",
        });
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load settings"
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(values: SettingsFormValues) {
    setIsSubmitting(true);
    try {
      const settingsData = {
        site_name: values.site_name,
        owner_name: values.owner_name,
        owner_title: values.owner_title || null,
        biography: values.biography || null,
        profile_photo_url: values.profile_photo_url || null,
        email: values.email || null,
        github_url: values.github_url || null,
        linkedin_url: values.linkedin_url || null,
        facebook_url: values.facebook_url || null,
        seo_title: values.seo_title || null,
        seo_description: values.seo_description || null,
        seo_keywords: values.seo_keywords || null,
        updated_at: new Date().toISOString(),
      };

      // Try to update, if no rows then insert
      const { data: existingData, error: fetchError } = await supabase
        .from("settings")
        .select("id")
        .limit(1)
        .single();

      let error;
      if (existingData?.id) {
        ({ error } = await supabase
          .from("settings")
          .update(settingsData)
          .eq("id", existingData.id));
      } else {
        ({ error } = await supabase
          .from("settings")
          .insert([settingsData]));
      }

      if (error) throw error;
      toast.success("Settings saved successfully");
      loadSettings();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Configure your portfolio settings
        </p>
      </div>

      {/* Settings Form */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Portfolio Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Site Name */}
                <FormField
                  control={form.control}
                  name="site_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Developer Studio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Owner Name */}
                <FormField
                  control={form.control}
                  name="owner_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Owner Title */}
              <FormField
                control={form.control}
                name="owner_title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Full-Stack Developer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Biography */}
              <FormField
                control={form.control}
                name="biography"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biography</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell your story..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Profile Photo URL */}
              <FormField
                control={form.control}
                name="profile_photo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Photo URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/photo.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Information */}
              <div>
                <h3 className="font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* GitHub URL */}
                  <FormField
                    control={form.control}
                    name="github_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://github.com/username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* LinkedIn URL */}
                  <FormField
                    control={form.control}
                    name="linkedin_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://linkedin.com/in/username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Facebook URL */}
                  <FormField
                    control={form.control}
                    name="facebook_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://facebook.com/username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* SEO Settings */}
              <div>
                <h3 className="font-semibold mb-4">SEO Settings</h3>
                <div className="space-y-4">
                  {/* SEO Title */}
                  <FormField
                    control={form.control}
                    name="seo_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your Portfolio - Developer Studio"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Appears in browser tabs and search results
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* SEO Description */}
                  <FormField
                    control={form.control}
                    name="seo_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of your portfolio for search engines..."
                            className="min-h-20"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Max 160 characters recommended
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* SEO Keywords */}
                  <FormField
                    control={form.control}
                    name="seo_keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Keywords</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="developer, portfolio, full-stack, web development"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Comma-separated keywords
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
