import { getTeamFromNotion, type TeamMember } from "@/lib/notion-team";

// Order within the Leads section (campus-level first)
const CAMPUS_POSITION_ORDER = ["Campus Lead", "Campus Co-lead", "Mentor"];

const Team = async () => {
  const raw = await getTeamFromNotion();

  if (!raw || raw.length === 0) return null;

  // ── Leads section ────────────────────────────────────────────
  // Campus Lead / Campus Co-lead / Mentor first, then remaining Leads by team
  const campusLeads = CAMPUS_POSITION_ORDER.flatMap((pos) =>
    raw.filter((m) => m.position === pos),
  );
  const otherLeads = raw
    .filter((m) => m.position === "Lead")
    .sort((a, b) => (a.team ?? "").localeCompare(b.team ?? ""));
  const leadsSection = [...campusLeads, ...otherLeads];

  // ── Team sections (Co-leads grouped by team, Lead included) ──
  const teamMap = new Map<string, { lead: TeamMember | null; coleads: TeamMember[] }>();
  for (const m of raw) {
    if (!m.team) continue;
    if (m.position !== "Lead" && m.position !== "Colead") continue;
    if (!teamMap.has(m.team)) teamMap.set(m.team, { lead: null, coleads: [] });
    const entry = teamMap.get(m.team)!;
    if (m.position === "Lead") entry.lead = m;
    else entry.coleads.push(m);
  }

  // Only show team sections that actually have co-leads
  const teamSections = [...teamMap.entries()]
    .filter(([, { coleads }]) => coleads.length > 0)
    .sort(([a], [b]) => a.localeCompare(b));

  // ── Styles ───────────────────────────────────────────────────
  const cardShell =
    "group flex h-full flex-col items-center rounded-[28px] border border-[#eadcf7] bg-white/85 p-[22px] text-center shadow-[0_18px_45px_rgba(58,16,93,0.08)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(58,16,93,0.12)]";
  const photoShell =
    "flex h-[132px] w-[132px] items-center justify-center rounded-full bg-gradient-to-br from-[#f8efff] via-white to-[#f3e7ff] p-[6px] ring-1 ring-[#efe2fb] max-[768px]:h-[118px] max-[768px]:w-[118px]";
  const photoImg =
    "h-full w-full rounded-full object-cover ring-4 ring-white shadow-[0_12px_28px_rgba(173,88,255,0.14)]";

  const TeamCard = ({ member }: { member: TeamMember }) => (
    <div className={cardShell}>
      <div className={photoShell}>
        <img className={photoImg} src={member.image} alt={member.name} loading="lazy" />
      </div>
      <p className="mt-[18px] text-[1.05rem] font-semibold tracking-tight text-[#111827]">{member.name}</p>
      <span className="mt-[8px] inline-flex rounded-full bg-[#f7efff] px-[14px] py-[5px] text-[0.78rem] font-semibold text-[#ad58ff]">
        {member.position}
      </span>
      {member.team && (
        <span className="mt-[4px] text-[0.75rem] text-[#6b7280]">{member.team}</span>
      )}
    </div>
  );

  const SectionHeading = ({ label }: { label: string }) => (
    <div className="mb-5 flex items-center gap-4">
      <h2 className="shrink-0 text-[1.1rem] font-semibold text-[#111827]">{label}</h2>
      <div className="h-px flex-1 bg-gradient-to-r from-[#eadcf7] to-transparent" />
    </div>
  );

  return (
    <div className="flex w-full flex-col items-center justify-center gap-12 px-4.5 py-12 sm:px-7 lg:px-11" id="team">

      {/* Page header */}
      <div className="flex max-w-230 flex-col items-center gap-3.5 text-center">
        <p className="text-[0.78rem] font-semibold uppercase tracking-[0.35em] text-[#ad58ff]">Our Team</p>
        <h1 className="text-[clamp(2rem,4vw,3.2rem)] font-bold tracking-tight text-[#111827]">
          Leads organized for clear ownership and strong execution
        </h1>
        <p className="max-w-190 text-[0.98rem] leading-[1.75] text-[#5b5f6a] max-[640px]:text-[0.92rem]">
          A structured view of the campus leadership team and the functional leads who keep MuLearn moving.
        </p>
      </div>

      {/* Leads section */}
      {leadsSection.length > 0 && (
        <section className="w-full max-w-310">
          <SectionHeading label="Leads" />
          <div className="grid grid-cols-2 gap-4 sm:gap-5.5 lg:grid-cols-3 xl:grid-cols-4">
            {leadsSection.map((member) => (
              <TeamCard key={`lead-${member.name}`} member={member} />
            ))}
          </div>
        </section>
      )}

      {/* Team sections: one per team, Lead + Co-leads together */}
      {teamSections.map(([teamName, { lead, coleads }]) => (
        <section key={teamName} className="w-full max-w-310">
          <SectionHeading label={teamName} />
          <div className="grid grid-cols-2 gap-4 sm:gap-5.5 lg:grid-cols-3 xl:grid-cols-4">
            {lead && <TeamCard key={`${teamName}-lead`} member={lead} />}
            {coleads.map((member) => (
              <TeamCard key={`${teamName}-colead-${member.name}`} member={member} />
            ))}
          </div>
        </section>
      ))}

    </div>
  );
};

export default Team;
