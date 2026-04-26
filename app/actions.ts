"use server";

import { MembershipStatus, PaymentMethod } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { buildDefaultPhotoUrl } from "@/lib/club-data";
import { prisma } from "@/lib/prisma";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalValue(formData: FormData, key: string) {
  const fieldValue = value(formData, key);
  return fieldValue ? fieldValue : null;
}

function parseDate(formData: FormData, key: string) {
  const fieldValue = value(formData, key);
  return fieldValue ? new Date(fieldValue) : null;
}

function parseFee(formData: FormData, key: string, fallback = 0) {
  const amount = Number(value(formData, key));
  return Number.isFinite(amount) ? amount : fallback;
}

function parseMembershipStatus(rawStatus: string) {
  if (rawStatus in MembershipStatus) {
    return rawStatus as MembershipStatus;
  }

  return MembershipStatus.PENDING;
}

function parsePaymentMethod(rawMethod: string) {
  if (rawMethod in PaymentMethod) {
    return rawMethod as PaymentMethod;
  }

  return PaymentMethod.ONLINE;
}

function studentPayload(formData: FormData) {
  const firstName = value(formData, "firstName");
  const lastName = value(formData, "lastName");
  const photoUrl = value(formData, "photoUrl");

  return {
    studentId: value(formData, "studentId"),
    firstName,
    lastName,
    preferredName: optionalValue(formData, "preferredName"),
    email: value(formData, "email"),
    phone: value(formData, "phone"),
    dateOfBirth: parseDate(formData, "dateOfBirth"),
    gender: optionalValue(formData, "gender"),
    major: value(formData, "major"),
    minor: optionalValue(formData, "minor"),
    department: value(formData, "department"),
    college: value(formData, "college"),
    yearLevel: value(formData, "yearLevel"),
    graduationTerm: optionalValue(formData, "graduationTerm"),
    enrollmentStatus: value(formData, "enrollmentStatus"),
    addressLine1: value(formData, "addressLine1"),
    addressLine2: optionalValue(formData, "addressLine2"),
    city: value(formData, "city"),
    state: value(formData, "state"),
    postalCode: value(formData, "postalCode"),
    emergencyContactName: value(formData, "emergencyContactName"),
    emergencyContactPhone: value(formData, "emergencyContactPhone"),
    guardianName: optionalValue(formData, "guardianName"),
    guardianPhone: optionalValue(formData, "guardianPhone"),
    membershipStatus: parseMembershipStatus(value(formData, "membershipStatus")),
    annualFee: parseFee(formData, "annualFee", 75),
    notes: optionalValue(formData, "notes"),
    photoUrl: photoUrl || buildDefaultPhotoUrl(`${firstName} ${lastName}`),
  };
}

export async function createStudentMember(formData: FormData) {
  const payload = studentPayload(formData);

  await prisma.studentMember.create({
    data: payload,
  });

  revalidatePath("/");
}

export async function updateStudentMember(formData: FormData) {
  const id = value(formData, "id");

  if (!id) {
    throw new Error("Missing student identifier.");
  }

  await prisma.studentMember.update({
    where: { id },
    data: studentPayload(formData),
  });

  revalidatePath("/");
}

export async function deleteStudentMember(formData: FormData) {
  const id = value(formData, "id");

  if (!id) {
    throw new Error("Missing student identifier.");
  }

  await prisma.studentMember.delete({
    where: { id },
  });

  revalidatePath("/");
}

export async function recordPayment(formData: FormData) {
  const studentPk = value(formData, "studentPk");

  if (!studentPk) {
    throw new Error("Missing student identifier.");
  }

  await prisma.payment.create({
    data: {
      studentPk,
      amount: parseFee(formData, "amount"),
      periodLabel: value(formData, "periodLabel"),
      paidAt: parseDate(formData, "paidAt") ?? new Date(),
      method: parsePaymentMethod(value(formData, "method")),
      reference: optionalValue(formData, "reference"),
      note: optionalValue(formData, "note"),
    },
  });

  revalidatePath("/");
}
