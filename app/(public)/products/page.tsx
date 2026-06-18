import { createClient } from "@/lib/supabase/server";
import { Rocket } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Explore digital products and SaaS tools built by Developer Studio.",
};

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="page-transition min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Products</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover digital products and SaaS tools crafted with precision and care.
          </p>
        </div>

        {!products || products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-6 p-4 rounded-full bg-primary/10">
              <Rocket className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Products are on the way</h2>
            <p className="text-muted-foreground text-center max-w-md">
              Stay tuned for upcoming SaaS tools and digital products.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => {
              const mainImage = product.product_images?.[0];
              return (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:border-primary/50 transition-colors flex flex-col"
                >
                  <div className="w-full h-48 bg-secondary overflow-hidden flex items-center justify-center">
                    {mainImage && mainImage.image_url ? (
                      <img
                        src={mainImage.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>

                  <CardHeader className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <Badge variant="outline" className="whitespace-nowrap">
                        {product.status === "published" ? "Available" : product.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {product.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold text-primary">
                      ${parseFloat(product.price).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
