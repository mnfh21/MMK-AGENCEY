import { redirect } from "next/navigation";

export default async function AdminProjectRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin?project=${encodeURIComponent(id)}`);
}
