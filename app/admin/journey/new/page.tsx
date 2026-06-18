import { JourneyForm } from "@/components/admin/journey-form";

export const metadata = {
  title: "New Journey Entry",
};

export default function NewJourneyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Journey Entry</h1>
        <p className="text-muted-foreground mt-2">
          Document a milestone in your journey
        </p>
      </div>

      <JourneyForm />
    </div>
  );
}
