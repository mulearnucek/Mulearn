import { getMemberByUsername } from "@/lib/notion-team";
import { notFound } from "next/navigation";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { FaLinkedin, FaInstagram, FaGithub } from "react-icons/fa";
import Link from "next/link";
import FadeInImage from "../../Components/Team/FadeInImage";

export const revalidate = 3600;

export default async function MemberProfilePage(props: {
  params: Promise<{ username: string }>;
}) {
  const params = await props.params;
  // Notion properties are case-sensitive usually, but let's just pass decodeURIComponent
  const username = decodeURIComponent(params.username);
  const member = await getMemberByUsername(username);

  if (!member) {
    notFound();
  }

  const memberRoles = member.roles || [];

  return (
    <main className="appWrapper min-h-screen justify-start! bg-gray-50 text-gray-900">
      <Navbar />
      <div className="pt-32 pb-24 w-full px-6 max-w-4xl mx-auto grow">
        {/* Navigation */}
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/team"
            className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#ad58ff] transition-all flex items-center gap-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              &larr;
            </span>{" "}
            Back to Team
          </Link>
          <div className="h-px grow mx-8 bg-gray-200 hidden md:block"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 opacity-50">
            Profile Card
          </span>
        </div>

        {/* The Card - Enhanced Shadow and Border */}
        <div className="bg-white rounded-[2.5rem] border border-gray-200 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Column: Essential Info */}
            <div className="w-full md:w-[38%] p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-100 flex flex-col items-center md:items-start text-center md:text-left bg-white">
              <div className="relative mb-10">
                <FadeInImage
                  src={member.image || "/fallback-avatar.png"}
                  alt={member.name}
                  containerClassName="h-44 w-44 rounded-[2.8rem] ring-8 ring-gray-50 shadow-md"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                  priority
                />
              </div>

              <div className="space-y-5 w-full">
                <h1 className="text-4xl font-black tracking-tight text-gray-900 leading-[1.1]">
                  {member.name}
                </h1>

                <div className="space-y-1.5">
                  <p className="text-sm font-black text-[#ad58ff] uppercase tracking-[0.15em]">
                    {member.position}
                  </p>
                  {member.team &&
                    member.team !== "μ" &&
                    member.team !== "MU" && (
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                        {member.team}
                      </p>
                    )}
                </div>

                {member.username && (
                  <p className="text-sm text-gray-400 font-semibold tracking-wide">
                    @{member.username}
                  </p>
                )}

                <div className="flex gap-4 pt-8 justify-center md:justify-start">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-50 text-gray-400 hover:text-[#0077b5] hover:bg-blue-50 rounded-2xl transition-all shadow-sm"
                    >
                      <FaLinkedin size={20} />
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100 rounded-2xl transition-all shadow-sm"
                    >
                      <FaGithub size={20} />
                    </a>
                  )}
                  {member.instagram && (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-50 text-gray-400 hover:text-[#E1306C] hover:bg-pink-50 rounded-2xl transition-all shadow-sm"
                    >
                      <FaInstagram size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Roles & History */}
            <div className="w-full md:w-[62%] p-8 md:p-14 bg-[#fafafa]">
              <div className="flex items-center gap-5 mb-12">
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">
                  Experience
                </h3>
                <div className="h-px grow bg-gray-200/60"></div>
              </div>

              <div className="space-y-10">
                {memberRoles.length > 0 ? (
                  memberRoles.map((role, idx) => (
                    <div key={idx} className="relative pl-10 group">
                      {/* Timeline Line */}
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 group-last:bg-transparent"></div>
                      {/* Timeline Dot */}
                      <div className="absolute -left-1.25 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-gray-300 group-hover:bg-[#ad58ff] group-hover:scale-125 transition-all shadow-sm"></div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest tabular-nums">
                          {role.execomYear || "Current"}
                        </span>
                        <h4 className="text-xl font-black text-gray-900 group-hover:text-[#ad58ff] transition-colors leading-tight">
                          {role.position}
                        </h4>
                        <p className="text-[13px] text-gray-500 font-bold uppercase tracking-wide">
                          {role.team && role.team !== "μ" && role.team !== "MU"
                            ? role.team
                            : role.execomName}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center md:text-left bg-white/50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-bold text-sm tracking-wide">
                      No experience recorded yet.
                    </p>
                  </div>
                )}
              </div>

              {/* Identity Details - Vertically Stacked */}
              {(member.muid || member.batch) && (
                <div className="mt-20 pt-10 border-t border-gray-200/60 space-y-4">
                  {member.muid && (
                    <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                        μID
                      </span>
                      <span className="text-sm font-black text-gray-800 tabular-nums">
                        {member.muid}
                      </span>
                    </div>
                  )}
                  {member.batch && (
                    <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                        Batch
                      </span>
                      <span className="text-sm font-black text-gray-800 tabular-nums">
                        {member.batch}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
