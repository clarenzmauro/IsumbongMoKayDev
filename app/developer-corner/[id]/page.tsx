import DeveloperCornerClient from "./developer-corner-clients";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  // ✅ Unwrap the `params` Promise
  const { id } = await params;

  // ✅ Pass the unwrapped id to the Client Component
  return <DeveloperCornerClient id={id} />;
}
