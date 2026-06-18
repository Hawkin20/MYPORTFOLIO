import { ProductForm } from "@/components/admin/product-form";

export const metadata = {
  title: "New Product",
};

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Product</h1>
        <p className="text-muted-foreground mt-2">
          Add a new product
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
