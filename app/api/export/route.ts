import { NextResponse } from "next/server";

import { buildCsv, getDashboardData } from "@/lib/club-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");
  const format = searchParams.get("format") ?? "csv";
  const { students } = await getDashboardData();
  const filteredStudents = studentId
    ? students.filter((student) => student.id === studentId)
    : students;

  if (format === "json") {
    return NextResponse.json(filteredStudents);
  }

  const csv = buildCsv(filteredStudents);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${studentId ? "member" : "club-members"}-export.csv"`,
    },
  });
}
