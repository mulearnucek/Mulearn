import "server-only";

type NotionQueryResponse = {
  results: unknown[];
};

type NotionPage = {
  id: string;
  properties: Record<
    string,
    {
      type: string;
      title?: Array<{ plain_text: string }>;
      rich_text?: Array<{ plain_text: string }>;
      url?: string | null;
    }
  >;
};

function isNotionPage(result: unknown): result is NotionPage {
  return (
    typeof result === "object" &&
    result !== null &&
    "properties" in result &&
    "id" in result
  );
}

function getText(
  prop: NotionPage["properties"][string] | undefined,
): string | null {
  if (!prop) return null;
  if (prop.type === "title" && prop.title)
    return (
      prop.title
        .map((t) => t.plain_text)
        .join("")
        .trim() || null
    );
  if (prop.type === "rich_text" && prop.rich_text)
    return (
      prop.rich_text
        .map((t) => t.plain_text)
        .join("")
        .trim() || null
    );
  if (prop.type === "url") return prop.url?.trim() || null;
  return null;
}

export type LinkEntry = {
  name: string | null;
  id: string | null;
  url: string | null;
};

export async function getLinkById(linkId: string): Promise<LinkEntry | null> {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.LINKS_DB_ID;

  if (!token || !databaseId) return null;

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page_size: 1,
          filter: {
            property: "Id",
            rich_text: { equals: linkId },
          },
        }),
        next: { revalidate: 0 },
      },
    );

    if (!response.ok) return null;

    const payload = (await response.json()) as NotionQueryResponse;

    const page = payload.results.filter(isNotionPage)[0];
    if (!page) return null;

    const p = page.properties;
    return {
      name: getText(p["Name"]),
      id: getText(p["Id"]),
      url: getText(p["Url"]),
    };
  } catch (error) {
    console.error("[Notion] Error fetching link:", error);
    return null;
  }
}
