import ClubDashboard from "@/app/_components/club-dashboard";
import { getDashboardData } from "@/lib/club-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { students, stats } = await getDashboardData();

  return (
    <main>
      <ClubDashboard students={students} stats={stats} />
    </main>
  );
}
