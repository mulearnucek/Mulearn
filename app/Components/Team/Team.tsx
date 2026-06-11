import Link from "next/link";
import {
  getExecomMembersFromNotion,
  type TeamMember,
  type Execom,
} from "@/lib/notion-team";
import ExecomSwitcher from "./ExecomSwitcher";
import FadeInImage from "./FadeInImage";

const Team = async ({
  execoms,
  selectedExecomId,
}: {
  execoms: Execom[];
  selectedExecomId?: string;
}) => {
  let raw: TeamMember[] | null = null;

  if (selectedExecomId) {
    raw = await getExecomMembersFromNotion(selectedExecomId);
  }

  // ── Minimal Components ───────────────────────────────────────

  const MemberCard = ({
    member,
    featured = false,
  }: {
    member: TeamMember;
    featured?: boolean;
  }) => {
    const slug = member.username || member.name;
    return (
      <Link
        href={`/team/${encodeURIComponent(slug)}`}
        className={`group flex flex-col items-center transition-all duration-300 ${featured ? "gap-6" : "gap-4"}`}
      >
        <FadeInImage
          src={member.image || "/fallback-avatar.png"}
          alt={member.name}
          containerClassName={`rounded-2xl transition-all duration-500 group-hover:grayscale ${featured ? "h-48 w-48 md:h-56 md:w-56" : "h-32 w-32 md:h-40 md:w-40"}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="flex flex-col items-center text-center">
          <p
            className={`${featured ? "text-xl" : "text-base"} font-bold text-gray-900 group-hover:text-[#ad58ff] transition-colors`}
          >
            {member.name}
          </p>
          <p
            className={`${featured ? "text-sm" : "text-xs"} font-medium text-[#ad58ff] uppercase tracking-wider mt-1`}
          >
            {member.position}
          </p>
          {member.team &&
            member.team.toLowerCase() !== "mu" &&
            member.team.toLowerCase() !== "μ" && (
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1.5 font-semibold">
                {member.team}
              </p>
            )}
        </div>
      </Link>
    );
  };

  const SectionTitle = ({ label }: { label: string }) => (
    <div className="relative w-full mb-12 flex justify-center">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-100"></div>
      </div>
      <div className="relative bg-white px-6">
        <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
          {label}
        </span>
      </div>
    </div>
  );

  return (
    <div
      className="flex w-full flex-col items-center py-20 px-6 max-w-7xl mx-auto"
      id="team"
    >
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
          Meet the Leadership
        </h1>
        <div className="h-1 w-20 bg-[#ad58ff] mx-auto rounded-full" />
      </div>

      {!raw || raw.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            No team members found
          </h2>
          <p className="mt-2 text-gray-500">
            Please check your Notion integration and environment variables.
          </p>
        </div>
      ) : (
        (() => {
          // ── Data Processing ──────────────────────────────────────────

          // 1. Campus Lead (featured at the top)
          const campusLead = raw.find((m) => m.position === "Campus Lead");

          // 2. Other Main Leads (Campus Co-lead, Mentor, etc.)
          const otherMainLeads = raw.filter(
            (m) => m.position === "Campus Co-lead" || m.position === "Mentor",
          );

          // 3. Functional Leads (Position is "Lead")
          const functionalLeads = raw
            .filter((m) => m.position === "Lead")
            .sort((a, b) => (a.team ?? "").localeCompare(b.team ?? ""));

          // 4. Team Groupings (Lead + Co-leads)
          const teamMap = new Map<
            string,
            { lead: TeamMember | null; coleads: TeamMember[] }
          >();
          for (const m of raw) {
            if (!m.team) continue;
            if (m.position !== "Lead" && m.position !== "Colead") continue;

            if (!teamMap.has(m.team))
              teamMap.set(m.team, { lead: null, coleads: [] });
            const entry = teamMap.get(m.team)!;

            if (m.position === "Lead") entry.lead = m;
            else entry.coleads.push(m);
          }

          const teamSections = [...teamMap.entries()]
            .filter(([, { coleads }]) => coleads.length > 0)
            .sort(([a], [b]) => a.localeCompare(b));

          return (
            <div className="w-full">
              {/* Featured Campus Lead */}
              {campusLead && (
                <div className="mb-24 w-full flex flex-col items-center">
                  <MemberCard member={campusLead} featured={true} />
                </div>
              )}

              {/* Campus Core (Co-leads, Mentors) */}
              {otherMainLeads.length > 0 && (
                <section className="w-full mb-24">
                  <div className="flex flex-wrap justify-center gap-12 max-w-4xl mx-auto">
                    {otherMainLeads.map((member) => (
                      <MemberCard key={member.name} member={member} />
                    ))}
                  </div>
                </section>
              )}

              {/* Functional Leads */}
              {functionalLeads.length > 0 && (
                <section className="w-full mb-32">
                  <SectionTitle label="Functional Leads" />
                  <div className="flex flex-wrap justify-center gap-x-8 gap-y-16">
                    {functionalLeads.map((member) => (
                      <MemberCard key={`lead-${member.name}`} member={member} />
                    ))}
                  </div>
                </section>
              )}

              {/* Detailed Team Sections */}
              {teamSections.map(([teamName, { lead, coleads }]) => (
                <section key={teamName} className="w-full mb-32">
                  <SectionTitle label={`${teamName} Team`} />
                  <div className="flex flex-wrap justify-center gap-x-8 gap-y-16">
                    {lead && (
                      <MemberCard key={`${teamName}-lead`} member={lead} />
                    )}
                    {coleads.map((member) => (
                      <MemberCard
                        key={`${teamName}-colead-${member.name}`}
                        member={member}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          );
        })()
      )}

      <ExecomSwitcher execoms={execoms} currentExecomId={selectedExecomId} />
    </div>
  );
};

export default Team;
