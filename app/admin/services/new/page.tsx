import { ServiceForm } from "@/components/admin/service-form";

export const metadata = {
  title: "New Service",
};

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Service</h1>
        <p className="text-muted-foreground mt-2">
          Add a new service
        </p>
      </div>

      <ServiceForm />
    </div>
  );
}
