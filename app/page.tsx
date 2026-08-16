import { WeddingInvitation } from "@/components/WeddingInvitation";
import { getWeddingContent } from "@/lib/wedding-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getWeddingContent();

  return <WeddingInvitation content={content} />;
}
