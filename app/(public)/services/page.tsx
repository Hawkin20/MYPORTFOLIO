import { createClient } from "@/lib/supabase/server";
import { Briefcase, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description: "Professional services offered by Developer Studio.",
};

export default async function ServicesPage() {
  const supabase = await createClient();

  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching services:", error);
  }

  return (
    <div className="page-transition min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Services</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Professional development services tailored to your project needs.
          </p>
        </div>

        {!services || services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6 p-4 rounded-full bg-primary/10">
              <Briefcase className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Services are being crafted</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Check back soon for professional offerings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service) => (
              <Card
                key={service.id}
                className="overflow-hidden hover:border-primary/50 transition-colors flex flex-col"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-2xl">{service.name}</CardTitle>
                    <Badge variant="outline" className="whitespace-nowrap">
                      {service.status === "published" ? "Available" : service.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-6">
                  {service.features && service.features.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-3 text-foreground">
                        Key Features
                      </h4>
                      <ul className="space-y-2">
                        {service.features.map((feature: string, idx: number) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-sm text-muted-foreground"
                          >
                            <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {service.inquiry_info && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Next Steps:</span>{" "}
                        {service.inquiry_info}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
