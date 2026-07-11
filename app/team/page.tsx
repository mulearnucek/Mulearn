import Navbar from "../Components/Navbar/Navbar";
import Team from "../Components/Team/Team";
import Footer from "../Components/Footer/Footer";
import { getExecomsFromNotion } from "@/lib/notion-team";

export const revalidate = 3600;

export default async function TeamPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const execoms = await getExecomsFromNotion();

  const currentExecom =
    execoms?.find((e) => e.status === "Current") || execoms?.[0];
  const selectedExecomId =
    (searchParams?.execom as string) || currentExecom?.id;

  return (
    <main className="appWrapper min-h-screen justify-start!">
      <Navbar />
      <div className="pt-24 w-full">
        <Team execoms={execoms || []} selectedExecomId={selectedExecomId} />
      </div>
      <Footer />
    </main>
  );
}
