import "server-only";

import { MembershipStatus, PaymentMethod, type Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type StudentWithPayments = Prisma.StudentMemberGetPayload<{
  include: { payments: { orderBy: { paidAt: "desc" } } };
}>;

function createAvatarDataUri(initials: string, base: string, accent: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="280" viewBox="0 0 240 280">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${base}" />
          <stop offset="100%" stop-color="${accent}" />
        </linearGradient>
      </defs>
      <rect width="240" height="280" rx="36" fill="url(#g)" />
      <circle cx="120" cy="102" r="58" fill="rgba(255,255,255,0.25)" />
      <path d="M44 246c16-46 55-69 76-69 21 0 60 23 76 69" fill="rgba(255,255,255,0.22)" />
      <text x="120" y="121" text-anchor="middle" font-size="54" font-family="Georgia, serif" fill="white">${initials}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function buildSeedMembers() {
  const now = new Date();

  return [
    {
      studentId: "UNO-2026-0142",
      firstName: "Amara",
      lastName: "Johnson",
      preferredName: "AJ",
      email: "amara.johnson@clubhub.edu",
      phone: "(402) 555-0142",
      dateOfBirth: new Date("2004-08-19"),
      gender: "Female",
      major: "Computer Science",
      minor: "Data Science",
      department: "School of Computer Science",
      college: "College of Information Science",
      yearLevel: "Senior",
      graduationTerm: "Spring 2027",
      enrollmentStatus: "Full-time",
      addressLine1: "1602 Maverick Lane",
      addressLine2: "Apartment 4B",
      city: "Omaha",
      state: "NE",
      postalCode: "68182",
      emergencyContactName: "Denise Johnson",
      emergencyContactPhone: "(402) 555-1120",
      guardianName: "Denise Johnson",
      guardianPhone: "(402) 555-1120",
      membershipStatus: MembershipStatus.ACTIVE,
      annualFee: 90,
      notes: "Leads hack-night mentoring and coordinates first-year onboarding.",
      photoUrl: createAvatarDataUri("AJ", "#0f766e", "#34d399"),
      joinedAt: new Date("2024-09-10"),
      payments: [
        {
          amount: 50,
          periodLabel: "Fall 2025 dues",
          method: PaymentMethod.CARD,
          paidAt: new Date("2025-09-14"),
          reference: "RCPT-1184",
          note: "Paid during welcome social.",
        },
        {
          amount: 40,
          periodLabel: "Spring 2026 dues",
          method: PaymentMethod.ONLINE,
          paidAt: new Date("2026-01-16"),
          reference: "RCPT-1232",
          note: "Balance cleared for current year.",
        },
      ],
    },
    {
      studentId: "UNO-2026-0227",
      firstName: "Mateo",
      lastName: "Ramirez",
      preferredName: "",
      email: "mateo.ramirez@clubhub.edu",
      phone: "(402) 555-0227",
      dateOfBirth: new Date("2005-02-04"),
      gender: "Male",
      major: "Civil Engineering",
      minor: "Urban Studies",
      department: "Department of Engineering",
      college: "College of Public Affairs",
      yearLevel: "Junior",
      graduationTerm: "Fall 2027",
      enrollmentStatus: "Full-time",
      addressLine1: "908 Howard Street",
      addressLine2: "",
      city: "Omaha",
      state: "NE",
      postalCode: "68102",
      emergencyContactName: "Elena Ramirez",
      emergencyContactPhone: "(531) 555-3984",
      guardianName: "Elena Ramirez",
      guardianPhone: "(531) 555-3984",
      membershipStatus: MembershipStatus.PENDING,
      annualFee: 90,
      notes: "Waiting on reimbursement confirmation from student leadership office.",
      photoUrl: createAvatarDataUri("MR", "#1d4ed8", "#38bdf8"),
      joinedAt: new Date("2025-08-22"),
      payments: [
        {
          amount: 45,
          periodLabel: "Spring 2026 deposit",
          method: PaymentMethod.TRANSFER,
          paidAt: new Date("2026-02-07"),
          reference: "BANK-7741",
          note: "Partial payment received.",
        },
      ],
    },
    {
      studentId: "UNO-2026-0310",
      firstName: "Soraya",
      lastName: "Lee",
      preferredName: "Sora",
      email: "soraya.lee@clubhub.edu",
      phone: "(402) 555-0310",
      dateOfBirth: new Date("2003-11-12"),
      gender: "Female",
      major: "Biology",
      minor: "Chemistry",
      department: "Life Sciences Division",
      college: "College of Arts and Sciences",
      yearLevel: "Senior",
      graduationTerm: "Summer 2026",
      enrollmentStatus: "Part-time",
      addressLine1: "3210 Pacific Street",
      addressLine2: "Residence Hall C",
      city: "Omaha",
      state: "NE",
      postalCode: "68131",
      emergencyContactName: "Thomas Lee",
      emergencyContactPhone: "(402) 555-8500",
      guardianName: "Thomas Lee",
      guardianPhone: "(402) 555-8500",
      membershipStatus: MembershipStatus.ACTIVE,
      annualFee: 75,
      notes: "Research liaison for community science outreach.",
      photoUrl: createAvatarDataUri("SL", "#be123c", "#fb7185"),
      joinedAt: new Date("2023-10-03"),
      payments: [
        {
          amount: 75,
          periodLabel: "2025-2026 annual dues",
          method: PaymentMethod.CHECK,
          paidAt: new Date("2025-10-01"),
          reference: "CHK-0381",
          note: "Department sponsorship applied.",
        },
      ],
    },
    {
      studentId: "UNO-2026-0419",
      firstName: "Noah",
      lastName: "Bennett",
      preferredName: "",
      email: "noah.bennett@clubhub.edu",
      phone: "(402) 555-0419",
      dateOfBirth: new Date("2006-06-07"),
      gender: "Male",
      major: "Business Administration",
      minor: "Marketing",
      department: "Management and Entrepreneurship",
      college: "College of Business",
      yearLevel: "Sophomore",
      graduationTerm: "Spring 2028",
      enrollmentStatus: "Full-time",
      addressLine1: "18 Maverick Village",
      addressLine2: "",
      city: "Omaha",
      state: "NE",
      postalCode: "68182",
      emergencyContactName: "Rachel Bennett",
      emergencyContactPhone: "(531) 555-2211",
      guardianName: "Rachel Bennett",
      guardianPhone: "(531) 555-2211",
      membershipStatus: MembershipStatus.LAPSED,
      annualFee: 75,
      notes: "Needs follow-up before spring event registration opens.",
      photoUrl: createAvatarDataUri("NB", "#92400e", "#f59e0b"),
      joinedAt: new Date("2024-01-19"),
      payments: [
        {
          amount: 25,
          periodLabel: "Fall 2025 hold fee",
          method: PaymentMethod.CASH,
          paidAt: new Date("2025-09-02"),
          reference: "CASH-020",
          note: "Remaining balance overdue.",
        },
      ],
    },
    {
      studentId: "UNO-2026-0564",
      firstName: "Lina",
      lastName: "Okafor",
      preferredName: "",
      email: "lina.okafor@clubhub.edu",
      phone: "(402) 555-0564",
      dateOfBirth: new Date("2004-01-28"),
      gender: "Female",
      major: "Psychology",
      minor: "Leadership",
      department: "Behavioral Health",
      college: "College of Education and Human Sciences",
      yearLevel: "Junior",
      graduationTerm: "Spring 2027",
      enrollmentStatus: "Full-time",
      addressLine1: "7012 South 72nd Avenue",
      addressLine2: "",
      city: "Papillion",
      state: "NE",
      postalCode: "68046",
      emergencyContactName: "Adaeze Okafor",
      emergencyContactPhone: "(402) 555-4412",
      guardianName: "Adaeze Okafor",
      guardianPhone: "(402) 555-4412",
      membershipStatus: MembershipStatus.ACTIVE,
      annualFee: 100,
      notes: "Coordinates peer wellness workshops and alumni newsletters.",
      photoUrl: createAvatarDataUri("LO", "#0f172a", "#22c55e"),
      joinedAt: new Date("2024-08-28"),
      payments: [
        {
          amount: 100,
          periodLabel: "2025-2026 leadership dues",
          method: PaymentMethod.ONLINE,
          paidAt: new Date("2025-08-29"),
          reference: "RCPT-1011",
          note: "Paid in full with workshop materials fee.",
        },
      ],
    },
  ].map((member) => ({
    ...member,
    joinedAt: member.joinedAt ?? now,
  }));
}

export type DashboardStudent = {
  id: string;
  studentId: string;
  fullName: string;
  preferredName: string | null;
  email: string;
  phone: string;
  dateOfBirth: string | null;
  gender: string | null;
  major: string;
  minor: string | null;
  department: string;
  college: string;
  yearLevel: string;
  graduationTerm: string | null;
  enrollmentStatus: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  guardianName: string | null;
  guardianPhone: string | null;
  membershipStatus: MembershipStatus;
  annualFee: number;
  totalPaid: number;
  outstandingBalance: number;
  notes: string | null;
  photoUrl: string;
  joinedAt: string;
  updatedAt: string;
  payments: {
    id: string;
    amount: number;
    periodLabel: string;
    paidAt: string;
    method: PaymentMethod;
    reference: string | null;
    note: string | null;
  }[];
};

export type DashboardStats = {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  lapsedMembers: number;
  totalCollected: number;
  outstandingFees: number;
};

function serializeStudent(student: StudentWithPayments): DashboardStudent {
  const totalPaid = student.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const outstandingBalance = Math.max(student.annualFee - totalPaid, 0);

  return {
    id: student.id,
    studentId: student.studentId,
    fullName: `${student.firstName} ${student.lastName}`,
    preferredName: student.preferredName,
    email: student.email,
    phone: student.phone,
    dateOfBirth: student.dateOfBirth?.toISOString().slice(0, 10) ?? null,
    gender: student.gender,
    major: student.major,
    minor: student.minor,
    department: student.department,
    college: student.college,
    yearLevel: student.yearLevel,
    graduationTerm: student.graduationTerm,
    enrollmentStatus: student.enrollmentStatus,
    addressLine1: student.addressLine1,
    addressLine2: student.addressLine2,
    city: student.city,
    state: student.state,
    postalCode: student.postalCode,
    emergencyContactName: student.emergencyContactName,
    emergencyContactPhone: student.emergencyContactPhone,
    guardianName: student.guardianName,
    guardianPhone: student.guardianPhone,
    membershipStatus: student.membershipStatus,
    annualFee: student.annualFee,
    totalPaid,
    outstandingBalance,
    notes: student.notes,
    photoUrl: student.photoUrl,
    joinedAt: student.joinedAt.toISOString(),
    updatedAt: student.updatedAt.toISOString(),
    payments: student.payments.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      periodLabel: payment.periodLabel,
      paidAt: payment.paidAt.toISOString(),
      method: payment.method,
      reference: payment.reference,
      note: payment.note,
    })),
  };
}

export async function ensureSeedData() {
  const count = await prisma.studentMember.count();

  if (count > 0) {
    return;
  }

  for (const member of buildSeedMembers()) {
    const { payments, ...student } = member;

    await prisma.studentMember.create({
      data: {
        ...student,
        preferredName: student.preferredName || null,
        addressLine2: student.addressLine2 || null,
        guardianName: student.guardianName || null,
        guardianPhone: student.guardianPhone || null,
        minor: student.minor || null,
        graduationTerm: student.graduationTerm || null,
        notes: student.notes || null,
        gender: student.gender || null,
        payments: {
          create: payments,
        },
      },
    });
  }
}

export async function getDashboardData() {
  await ensureSeedData();

  const students = await prisma.studentMember.findMany({
    orderBy: [{ membershipStatus: "asc" }, { lastName: "asc" }],
    include: {
      payments: {
        orderBy: {
          paidAt: "desc",
        },
      },
    },
  });

  const serializedStudents = students.map(serializeStudent);

  const stats = serializedStudents.reduce<DashboardStats>(
    (accumulator, student) => {
      accumulator.totalMembers += 1;
      accumulator.totalCollected += student.totalPaid;
      accumulator.outstandingFees += student.outstandingBalance;

      if (student.membershipStatus === MembershipStatus.ACTIVE) {
        accumulator.activeMembers += 1;
      }

      if (student.membershipStatus === MembershipStatus.PENDING) {
        accumulator.pendingMembers += 1;
      }

      if (student.membershipStatus === MembershipStatus.LAPSED) {
        accumulator.lapsedMembers += 1;
      }

      return accumulator;
    },
    {
      totalMembers: 0,
      activeMembers: 0,
      pendingMembers: 0,
      lapsedMembers: 0,
      totalCollected: 0,
      outstandingFees: 0,
    },
  );

  return {
    students: serializedStudents,
    stats,
  };
}

export function buildDefaultPhotoUrl(name: string) {
  const initials = name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return createAvatarDataUri(initials || "SM", "#115e59", "#f97316");
}

export function buildCsv(students: DashboardStudent[]) {
  const header = [
    "Student ID",
    "Full Name",
    "Preferred Name",
    "Email",
    "Phone",
    "Major",
    "Department",
    "Year Level",
    "Membership Status",
    "Annual Fee",
    "Total Paid",
    "Outstanding Balance",
    "Joined At",
  ];

  const rows = students.map((student) => [
    student.studentId,
    student.fullName,
    student.preferredName ?? "",
    student.email,
    student.phone,
    student.major,
    student.department,
    student.yearLevel,
    student.membershipStatus,
    String(student.annualFee),
    String(student.totalPaid),
    String(student.outstandingBalance),
    student.joinedAt.slice(0, 10),
  ]);

  return [header, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(","),
    )
    .join("\n");
}
