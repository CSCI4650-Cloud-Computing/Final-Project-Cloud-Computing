import type { DashboardStudent } from "@/lib/club-data";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function buildEmailSummary(student: DashboardStudent) {
  return [
    `Student: ${student.fullName}`,
    `Student ID: ${student.studentId}`,
    `Major: ${student.major}`,
    `Year: ${student.yearLevel}`,
    `Membership: ${student.membershipStatus}`,
    `Dues paid: ${formatCurrency(student.totalPaid)}`,
    `Outstanding: ${formatCurrency(student.outstandingBalance)}`,
  ].join("\n");
}
