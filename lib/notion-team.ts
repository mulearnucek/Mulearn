import "server-only";

export type TeamMember = {
  name: string;
  position: string;
  team: string | null;
  image: string;
};

type NotionQueryResponse = {
  results: unknown[];
};

type NotionFile = {
  type: "external" | "file";
  external?: { url: string };
  file?: { url: string };
};

type NotionProperty = {
  type: string;
  title?: Array<{ plain_text: string }>;
  rich_text?: Array<{ plain_text: string }>;
  select?: { name: string } | null;
  files?: NotionFile[];
};

type NotionPage = {
  properties: Record<string, NotionProperty>;
  cover?: NotionFile | null;
};

function isNotionPage(result: unknown): result is NotionPage {
  return typeof result === "object" && result !== null && "properties" in result;
}

function getText(prop: NotionProperty | undefined): string | null {
  if (!prop) return null;
  if (prop.type === "title") return prop.title?.map((p) => p.plain_text).join("").trim() || null;
  if (prop.type === "rich_text") return prop.rich_text?.map((p) => p.plain_text).join("").trim() || null;
  if (prop.type === "select") return prop.select?.name?.trim() || null;
  return null;
}

function getImage(prop: NotionProperty | undefined, cover: NotionFile | null | undefined): string | null {
  if (prop?.type === "files") {
    const file = prop.files?.[0];
    if (file?.type === "external") return file.external?.url ?? null;
    if (file?.type === "file") return file.file?.url ?? null;
  }
  if (cover?.type === "external") return cover.external?.url ?? null;
  if (cover?.type === "file") return cover.file?.url ?? null;
  return null;
}

export async function getTeamFromNotion(): Promise<TeamMember[] | null> {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_TEAM_DB_ID;

  if (!token || !databaseId) return null;

  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ page_size: 100 }),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    console.error("[Notion Team] API error", response.status, await response.text().catch(() => ""));
    return null;
  }

  const payload = (await response.json()) as NotionQueryResponse;

  return payload.results
    .filter(isNotionPage)
    .map((page) => {
      const p = page.properties;
      const name = getText(p["Name"]);
      const position = getText(p["Position"]);
      const team = getText(p["Team"]);
      const image = getImage(p["Photo"], page.cover);
      if (!name || !position || !image) return null;
      return { name: name.trim(), position, team, image };
    })
    .filter((m): m is TeamMember => m !== null);
}
