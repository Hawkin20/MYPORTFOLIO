import { TechForm } from "@/components/admin/tech-form";

export const metadata = {
  title: "Add Technology",
};

export default function NewTechPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Technology</h1>
        <p className="text-muted-foreground mt-2">
          Add a new technology or skill to your tech stack
        </p>
      </div>

      <TechForm />
    </div>
  );
}
