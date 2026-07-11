import "server-only";
import { unstable_cache } from "next/cache";

export type Execom = {
  id: string;
  name: string;
  status: string | null;
  year: string | null;
};

export type TeamMember = {
  id: string;
  username: string | null;
  name: string;
  position: string | null;
  team: string | null;
  image: string | null;
  batch: string | null;
  email: string | null;
  phone: string | null;
  muid: string | null;
  gender: string | null;
  dob: string | null;
  linkedin: string | null;
  instagram: string | null;
  github: string | null;
};

export type MemberRole = {
  execomName: string;
  execomYear: string | null;
  team: string | null;
  position: string | null;
};

export type MemberProfile = TeamMember & {
  roles: MemberRole[];
};

type Membership = {
  memberId: string;
  execomId: string;
  team: string | null;
  position: string | null;
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
  url?: string | null;
  email?: string | null;
  phone_number?: string | null;
  date?: { start: string } | null;
  relation?: Array<{ id: string }>;
};

type NotionPage = {
  id: string;
  properties: Record<string, NotionProperty>;
  cover?: NotionFile | null;
};

function isNotionPage(result: unknown): result is NotionPage {
  return (
    typeof result === "object" &&
    result !== null &&
    "properties" in result &&
    "id" in result
  );
}

function getText(prop: NotionProperty | undefined): string | null {
  if (!prop) return null;
  if (prop.type === "title")
    return (
      prop.title
        ?.map((p) => p.plain_text)
        .join("")
        .trim() || null
    );
  if (prop.type === "rich_text")
    return (
      prop.rich_text
        ?.map((p) => p.plain_text)
        .join("")
        .trim() || null
    );
  if (prop.type === "select") return prop.select?.name?.trim() || null;
  if (prop.type === "url") return prop.url?.trim() || null;
  if (prop.type === "email") return prop.email?.trim() || null;
  if (prop.type === "phone_number") return prop.phone_number?.trim() || null;
  if (prop.type === "date") return prop.date?.start || null;
  return null;
}

function getRelationIds(prop: NotionProperty | undefined): string[] {
  if (!prop || prop.type !== "relation" || !prop.relation) return [];
  return prop.relation.map((r) => r.id);
}

function getImage(
  prop: NotionProperty | undefined,
  cover: NotionFile | null | undefined,
): string | null {
  if (prop?.type === "files") {
    const file = prop.files?.[0];
    if (file?.type === "external") return file.external?.url ?? null;
    if (file?.type === "file") return file.file?.url ?? null;
  }
  if (cover?.type === "external") return cover.external?.url ?? null;
  if (cover?.type === "file") return cover.file?.url ?? null;
  return null;
}

function parseMember(page: NotionPage): TeamMember | null {
  const p = page.properties;
  const name = getText(p["Name"]);

  if (!name) return null;

  return {
    id: page.id,
    name: name,
    username: getText(p["Username"]),
    position: null, // To be filled from membership
    team: null, // To be filled from membership
    image: getImage(p["Photo"], page.cover),
    batch: getText(p["Batch"]),
    email: getText(p["Email"]),
    phone: getText(p["Phone Number"]),
    muid: getText(p["μID"]),
    gender: getText(p["Gender"]),
    dob: getText(p["DOB"]),
    linkedin: getText(p["LinkedIn Profile"]),
    instagram: getText(p["Instagram Profile"]),
    github: getText(p["GitHub Profile"]),
  };
}

export const getExecomsFromNotion = unstable_cache(
  async (): Promise<Execom[] | null> => {
    const token = process.env.NOTION_TOKEN;
    const databaseId = process.env.EXECOMS_DB_ID;

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
            page_size: 100,
            sorts: [{ property: "Year", direction: "descending" }],
          }),
        },
      );

      if (!response.ok) return null;

      const payload = (await response.json()) as NotionQueryResponse;

      return payload.results
        .filter(isNotionPage)
        .map((page) => {
          const p = page.properties;
          const name = getText(p["Name"]);
          if (!name) return null;
          return {
            id: page.id,
            name,
            status: getText(p["Status"]),
            year: getText(p["Year"]),
          };
        })
        .filter((e): e is Execom => e !== null);
    } catch (error) {
      console.error("[Notion] Error fetching execoms:", error);
      return null;
    }
  },
  ["execoms"],
  { revalidate: 3600 },
);

const fetchAllMembers = unstable_cache(
  async (): Promise<TeamMember[]> => {
    const token = process.env.NOTION_TOKEN;
    const databaseId = process.env.MEMBERS_DB_ID;

    if (!token || !databaseId) return [];

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
          body: JSON.stringify({ page_size: 100 }),
        },
      );

      if (!response.ok) return [];

      const payload = (await response.json()) as NotionQueryResponse;

      return payload.results
        .filter(isNotionPage)
        .map(parseMember)
        .filter((m): m is TeamMember => m !== null);
    } catch (error) {
      console.error("[Notion] Error fetching all members:", error);
      return [];
    }
  },
  ["all-members"],
  { revalidate: 3600 },
);

const fetchMemberships = unstable_cache(
  async (filter: Record<string, unknown>): Promise<Membership[]> => {
    const token = process.env.NOTION_TOKEN;
    const databaseId =
      process.env.EXECOM_MEMBERSHIPS_DB_ID ||
      "6523f2af-ecc5-4d00-845d-cc1c3a3320f4";

    if (!token || !databaseId) return [];

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
          body: JSON.stringify({ filter, page_size: 100 }),
        },
      );

      if (!response.ok) return [];

      const payload = (await response.json()) as NotionQueryResponse;

      return payload.results
        .filter(isNotionPage)
        .map((page) => {
          const p = page.properties;
          const memberIds = getRelationIds(p["Member"]);
          const execomIds = getRelationIds(p["Execom"]);
          if (memberIds.length === 0 || execomIds.length === 0) return null;

          return {
            memberId: memberIds[0],
            execomId: execomIds[0],
            team: getText(p["Team"]),
            position: getText(p["Position"]),
          };
        })
        .filter((m): m is Membership => m !== null);
    } catch (error) {
      console.error("[Notion] Error fetching memberships:", error);
      return [];
    }
  },
  ["memberships"],
  { revalidate: 3600 },
);

export async function getExecomMembersFromNotion(
  execomId: string,
): Promise<TeamMember[] | null> {
  const memberships = await fetchMemberships({
    property: "Execom",
    relation: { contains: execomId },
  });

  if (memberships.length === 0) return [];

  const allMembers = await fetchAllMembers();
  const memberMap = new Map(allMembers.map((m) => [m.id, m]));

  return memberships
    .map((ms) => {
      const member = memberMap.get(ms.memberId);
      if (!member) return null;
      return {
        ...member,
        team: ms.team,
        position: ms.position,
      };
    })
    .filter((m): m is TeamMember => m !== null);
}

export async function getMemberByUsername(
  username: string,
): Promise<MemberProfile | null> {
  const allMembers = await fetchAllMembers();
  const member = allMembers.find(
    (m) =>
      m.username?.toLowerCase() === username.toLowerCase() ||
      m.name.toLowerCase() === username.toLowerCase(),
  );

  if (!member) return null;

  const memberships = await fetchMemberships({
    property: "Member",
    relation: { contains: member.id },
  });

  const allExecoms = await getExecomsFromNotion();
  const execomMap = new Map((allExecoms || []).map((e) => [e.id, e]));

  const roles: MemberRole[] = memberships
    .map((ms) => {
      const execom = execomMap.get(ms.execomId);
      if (!execom) return null;
      return {
        execomName: execom.name,
        execomYear: execom.year,
        team: ms.team,
        position: ms.position,
      };
    })
    .filter((r): r is MemberRole => r !== null);

  // Set the "current" position/team from the most recent execom if available
  // or just use the first one as a default.
  const currentRole = roles[0];

  return {
    ...member,
    position: currentRole?.position || null,
    team: currentRole?.team || null,
    roles,
  };
}

// Keep for compatibility
export async function getTeamFromNotion(): Promise<TeamMember[] | null> {
  return fetchAllMembers();
}
