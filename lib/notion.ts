import { Client, isFullPage } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const MEMBERS_DB_ID = process.env.MEMBERS_DB_ID || "";
const EXECOMS_DB_ID = process.env.EXECOMS_DB_ID || "";
const EXECOM_MEMBERSHIPS_DB_ID =
  process.env.EXECOM_MEMBERS_MEMBERSHIPS_DB_ID ||
  process.env.EXECOM_MEMBERSHIPS_DB_ID ||
  "";

export type TeamMember = {
  name: string;
  position: string | null;
  photoUrl: string | null;
  batch: string | null;
  linkedin: string | null;
  instagram: string | null;
  github: string | null;
  team?: string;
};

export type Team = { name: string; members: TeamMember[] };

export type TeamsResponse = { execom: string; year: string; teams: Team[] };

// Precise types for Notion properties to satisfy TS without 'any'
type TitleProperty = { type: "title"; title: Array<{ plain_text: string }> };
type SelectProperty = { type: "select"; select: { name: string } | null };
type RelationProperty = { type: "relation"; relation: Array<{ id: string }> };
type UrlProperty = { type: "url"; url: string | null };
type FilesProperty = {
  type: "files";
  files: Array<
    | { type: "external"; external: { url: string } }
    | { type: "file"; file: { url: string } }
  >;
};

type NotionPage = {
  id: string;
  properties: Record<string, unknown>;
};

export async function getTeams(): Promise<TeamsResponse> {
  if (
    !process.env.NOTION_TOKEN ||
    !EXECOMS_DB_ID ||
    !EXECOM_MEMBERSHIPS_DB_ID ||
    !MEMBERS_DB_ID
  ) {
    throw new Error("Missing Notion environment variables");
  }

  // 1. Resolve the target Execom: Status = "Current"
  const execomResponse = await notion.databases.query({
    database_id: EXECOMS_DB_ID,
    filter: {
      property: "Status",
      select: {
        equals: "Current",
      },
    },
  });

  const targetExecom = execomResponse.results[0];
  if (!targetExecom || !isFullPage(targetExecom)) {
    throw new Error("No current Execom found or it is not a full page object");
  }

  const execomNameProp = targetExecom.properties.Name as TitleProperty;
  const execomName =
    execomNameProp?.type === "title"
      ? execomNameProp.title[0]?.plain_text || "Unknown Execom"
      : "Unknown Execom";

  const execomYearProp = targetExecom.properties.Year as SelectProperty;
  const execomYear =
    execomYearProp?.type === "select" ? execomYearProp.select?.name || "" : "";

  // 2. Query EXECOM_MEMBERSHIPS_DB_ID filtered by Execom relation
  const memberships: NotionPage[] = [];
  let hasMore = true;
  let cursor: string | undefined = undefined;

  while (hasMore) {
    const response = await notion.databases.query({
      database_id: EXECOM_MEMBERSHIPS_DB_ID,
      filter: {
        property: "Execom",
        relation: {
          contains: targetExecom.id,
        },
      },
      start_cursor: cursor,
    });

    for (const result of response.results) {
      if (isFullPage(result)) {
        memberships.push(result as unknown as NotionPage);
      }
    }

    hasMore = response.has_more;
    cursor = response.next_cursor ?? undefined;
  }

  // 3. Extract member IDs and fetch member details
  const memberCache = new Map<string, NotionPage>();
  const results: TeamMember[] = [];

  for (const ms of memberships) {
    const props = ms.properties as Record<string, unknown>;

    const teamProp = props.Team as SelectProperty;
    const team =
      teamProp?.type === "select" ? teamProp.select?.name || "Other" : "Other";

    const positionProp = props.Position as SelectProperty;
    const position =
      positionProp?.type === "select"
        ? positionProp.select?.name || null
        : null;

    const memberProp = props.Member as RelationProperty;
    const memberId =
      memberProp?.type === "relation" ? memberProp.relation[0]?.id : undefined;

    if (!memberId) continue;

    let memberPage = memberCache.get(memberId);
    if (!memberPage) {
      try {
        const pageResponse = await notion.pages.retrieve({
          page_id: memberId,
        });
        if (isFullPage(pageResponse)) {
          memberPage = pageResponse as unknown as NotionPage;
          memberCache.set(memberId, memberPage);
        } else {
          continue;
        }
      } catch (e) {
        console.error(`Failed to fetch member ${memberId}`, e);
        continue;
      }
    }

    const mProps = memberPage.properties as Record<string, unknown>;

    // Photo handling
    const photoProp = mProps.Photo as FilesProperty;
    let photoUrl = null;
    if (photoProp?.type === "files" && photoProp.files.length > 0) {
      const file = photoProp.files[0];
      photoUrl = file.type === "external" ? file.external.url : file.file.url;
    }

    const nameProp = mProps.Name as TitleProperty;
    const batchProp = mProps.Batch as SelectProperty;
    const linkedinProp = mProps["LinkedIn Profile"] as UrlProperty;
    const instagramProp = mProps["Instagram Profile"] as UrlProperty;
    const githubProp = mProps["GitHub Profile"] as UrlProperty;

    results.push({
      name:
        nameProp?.type === "title"
          ? nameProp.title[0]?.plain_text || "Unknown"
          : "Unknown",
      position,
      photoUrl,
      batch:
        batchProp?.type === "select" ? batchProp.select?.name || null : null,
      linkedin: linkedinProp?.type === "url" ? linkedinProp.url || null : null,
      instagram:
        instagramProp?.type === "url" ? instagramProp.url || null : null,
      github: githubProp?.type === "url" ? githubProp.url || null : null,
      team,
    });
  }

  // 4. Group by Team
  const teamsMap = new Map<string, TeamMember[]>();
  for (const m of results) {
    const teamName = m.team || "Other";
    const memberCopy = { ...m };
    delete memberCopy.team;

    if (!teamsMap.has(teamName)) {
      teamsMap.set(teamName, []);
    }
    teamsMap.get(teamName)!.push(memberCopy);
  }

  // Position rank mapping
  const positionRank: Record<string, number> = {
    Mentor: 1,
    "Campus Lead": 2,
    "Campus Co-lead": 3,
    Lead: 4,
    Colead: 5,
    "IG Manager": 6,
    "Lead - IOT & Robotics": 7,
  };

  // 4. Group by Team and sort members
  const teamsMapSorted = new Map<string, TeamMember[]>();
  for (const [teamName, members] of teamsMap.entries()) {
    const sortedMembers = [...members].sort((a, b) => {
      const rankA = positionRank[a.position || ""] || 99;
      const rankB = positionRank[b.position || ""] || 99;
      if (rankA !== rankB) return rankA - rankB;
      return a.name.localeCompare(b.name);
    });
    teamsMapSorted.set(teamName, sortedMembers);
  }

  // Sort teams
  const teamOrder = [
    "Creative",
    "Marketing & Content",
    "Interest Groups",
    "Technical",
    "Operations",
    "μ",
    "Media",
    "Community",
  ];
  const sortedTeams: Team[] = Array.from(teamsMapSorted.entries())
    .map(([name, members]) => ({ name, members }))
    .sort((a, b) => {
      const indexA = teamOrder.indexOf(a.name);
      const indexB = teamOrder.indexOf(b.name);
      if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

  return {
    execom: execomName,
    year: execomYear,
    teams: sortedTeams,
  };
}
