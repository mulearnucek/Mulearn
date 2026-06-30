import { getLinkById } from "@/lib/notion-links";
import { redirect, notFound } from "next/navigation";

export const revalidate = 0;

export default async function LinkRedirectPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const linkId = decodeURIComponent(params.id);
  const link = await getLinkById(linkId);

  if (!link?.url) {
    notFound();
  }

  redirect(link.url);
}
