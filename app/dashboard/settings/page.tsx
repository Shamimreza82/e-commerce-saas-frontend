import { StoreSetupForm } from "@/modules/tenant/components/StoreSetupForm";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Store Settings</h1>
        <p className="text-zinc-500">Update your store information, branding, and contact details.</p>
      </div>
      <StoreSetupForm />
    </div>
  );
}
