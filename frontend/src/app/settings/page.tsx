import { SettingsView } from "@/components/settings-view";
import { getBusinessProfile } from "@/lib/api";

export default async function SettingsPage() {
  const business = await getBusinessProfile();
  return <SettingsView initialProfile={business.data} dataSource={business.source} />;
}
