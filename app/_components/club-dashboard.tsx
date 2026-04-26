"use client";

import Image from "next/image";
import { useDeferredValue, useMemo, useState } from "react";

import {
  createStudentMember,
  deleteStudentMember,
  recordPayment,
  updateStudentMember,
} from "@/app/actions";
import { type DashboardStats, type DashboardStudent } from "@/lib/club-data";
import { buildEmailSummary, formatCurrency } from "@/lib/club-utils";

import styles from "./club-dashboard.module.css";

type ClubDashboardProps = {
  students: DashboardStudent[];
  stats: DashboardStats;
};

const statusOptions = ["ACTIVE", "PENDING", "LAPSED", "ALUMNI"] as const;
const paymentMethods = ["CASH", "CARD", "TRANSFER", "ONLINE", "CHECK"] as const;
type StatusFilter = (typeof statusOptions)[number] | "ALL";

export default function ClubDashboard({ students, stats }: ClubDashboardProps) {
  const [selectedId, setSelectedId] = useState<string>(students[0]?.id ?? "");
  const [editorMode, setEditorMode] = useState<"create" | "edit">("edit");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const deferredSearch = useDeferredValue(search);

  const filteredStudents = useMemo(() => {
    const query = deferredSearch.toLowerCase().trim();

    return students.filter((student) => {
      const matchesStatus =
        statusFilter === "ALL" ? true : student.membershipStatus === statusFilter;
      const haystack = [
        student.fullName,
        student.studentId,
        student.email,
        student.major,
        student.department,
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!query || haystack.includes(query));
    });
  }, [deferredSearch, statusFilter, students]);

  const selectedMember =
    students.find((student) => student.id === selectedId) ??
    filteredStudents[0] ??
    students[0] ??
    null;
  const formMember = editorMode === "edit" ? selectedMember : null;

  const exportHref = selectedMember
    ? `/api/export?studentId=${selectedMember.id}`
    : "/api/export";

  const emailHref = selectedMember
    ? `mailto:?subject=${encodeURIComponent(`Club member record: ${selectedMember.fullName}`)}&body=${encodeURIComponent(buildEmailSummary(selectedMember))}`
    : "mailto:";

  return (
    <div className={styles.shell}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>University Club System Management</p>
          <h1>ClubHub keeps membership, fees, and student stories in one living desk.</h1>
          <p className={styles.heroCopy}>
            Search members, update records, print clean summaries, export club data,
            and track dues without losing the human context behind each student.
          </p>
        </div>

        <div className={styles.heroAside}>
          <div className={styles.heroBrief}>
            <p className={styles.panelEyebrow}>Operations snapshot</p>
            <h2>Everything officers need for one clean meeting workflow.</h2>
            <p>
              Review the live roster, track payments, and update member records
              without scattered panels or oversized sections.
            </p>
          </div>

          <div className={styles.heroStats}>
            <StatTile label="Members" value={String(stats.totalMembers)} />
            <StatTile label="Active" value={String(stats.activeMembers)} />
            <StatTile label="Pending" value={String(stats.pendingMembers)} />
            <StatTile label="Collected" value={formatCurrency(stats.totalCollected)} />
          </div>
        </div>
      </section>

      <section className={styles.controlBand}>
        <label className={styles.searchField}>
          <span>Search students</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name, student ID, major, department"
          />
        </label>

        <label className={styles.filterField}>
          <span>Status</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          >
            <option value="ALL">All statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.controlActions}>
          <button type="button" onClick={() => setEditorMode("create")}>
            Add student
          </button>
          <a href="/api/export">Export roster</a>
          <button type="button" onClick={() => window.print()}>
            Print
          </button>
        </div>
      </section>

      <section className={styles.workspace}>
        <div className={styles.rosterPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.panelEyebrow}>Member roster</p>
              <h2>{filteredStudents.length} records in view</h2>
            </div>
            <p className={styles.balanceCaption}>
              Outstanding club dues: {formatCurrency(stats.outstandingFees)}
            </p>
          </div>

          <div className={styles.memberList}>
            {filteredStudents.map((student) => {
              const isSelected = selectedMember?.id === student.id;

              return (
                <button
                  key={student.id}
                  type="button"
                  className={isSelected ? styles.memberCardSelected : styles.memberCard}
                  onClick={() => {
                    setSelectedId(student.id);
                    setEditorMode("edit");
                  }}
                >
                  <Image
                    src={student.photoUrl}
                    alt={student.fullName}
                    width={56}
                    height={68}
                    unoptimized
                    className={styles.avatar}
                  />

                  <div className={styles.memberCardBody}>
                    <div className={styles.memberCardHead}>
                      <h3>{student.fullName}</h3>
                      <span data-status={student.membershipStatus}>
                        {student.membershipStatus}
                      </span>
                    </div>
                    <p>{student.major}</p>
                    <p>
                      {student.studentId} - {student.yearLevel}
                    </p>
                  </div>
                </button>
              );
            })}

            {filteredStudents.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No students match that search.</h3>
                <p>Try a broader term or clear the status filter.</p>
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles.detailPanel}>
          {selectedMember ? (
            <>
              <div className={styles.profileHeader}>
                <Image
                  src={selectedMember.photoUrl}
                  alt={selectedMember.fullName}
                  width={120}
                  height={140}
                  unoptimized
                  className={styles.profilePhoto}
                />

                <div>
                  <p className={styles.panelEyebrow}>Student profile</p>
                  <h2>{selectedMember.fullName}</h2>
                  <p className={styles.profileMeta}>
                    {selectedMember.studentId} - {selectedMember.department}
                  </p>
                  <div className={styles.quickActions}>
                    <a href={exportHref}>Export student</a>
                    <a href={emailHref}>Email handoff</a>
                    <button type="button" onClick={() => setEditorMode("edit")}>
                      Edit record
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.profileGrid}>
                <InfoItem label="Preferred name" value={selectedMember.preferredName ?? "None"} />
                <InfoItem label="Email" value={selectedMember.email} />
                <InfoItem label="Phone" value={selectedMember.phone} />
                <InfoItem label="Date of birth" value={selectedMember.dateOfBirth ?? "Not set"} />
                <InfoItem label="Gender" value={selectedMember.gender ?? "Not set"} />
                <InfoItem label="College" value={selectedMember.college} />
                <InfoItem
                  label="Major / Minor"
                  value={
                    selectedMember.minor
                      ? `${selectedMember.major} / ${selectedMember.minor}`
                      : selectedMember.major
                  }
                />
                <InfoItem label="Graduation" value={selectedMember.graduationTerm ?? "Not set"} />
                <InfoItem
                  label="Address"
                  value={`${selectedMember.addressLine1}${selectedMember.addressLine2 ? `, ${selectedMember.addressLine2}` : ""}, ${selectedMember.city}, ${selectedMember.state} ${selectedMember.postalCode}`}
                />
                <InfoItem
                  label="Emergency contact"
                  value={`${selectedMember.emergencyContactName} - ${selectedMember.emergencyContactPhone}`}
                />
                <InfoItem
                  label="Membership"
                  value={`${selectedMember.membershipStatus} - joined ${selectedMember.joinedAt.slice(0, 10)}`}
                />
                <InfoItem
                  label="Fees"
                  value={`${formatCurrency(selectedMember.totalPaid)} paid of ${formatCurrency(selectedMember.annualFee)}`}
                />
              </div>

              <div className={styles.notesStrip}>
                <p className={styles.panelEyebrow}>Adviser notes</p>
                <p>{selectedMember.notes || "No additional notes recorded."}</p>
              </div>

              <div className={styles.paymentSection}>
                <div className={styles.panelHeader}>
                  <div>
                    <p className={styles.panelEyebrow}>Payment tracking</p>
                    <h3>
                      {formatCurrency(selectedMember.outstandingBalance)} still outstanding
                    </h3>
                  </div>
                </div>

                <div className={styles.paymentHistory}>
                  {selectedMember.payments.map((payment) => (
                    <div key={payment.id} className={styles.paymentRow}>
                      <div>
                        <strong>{payment.periodLabel}</strong>
                        <p>
                          {payment.paidAt.slice(0, 10)} - {payment.method}
                        </p>
                      </div>
                      <div className={styles.paymentAmount}>
                        <strong>{formatCurrency(payment.amount)}</strong>
                        <p>{payment.reference ?? "No reference"}</p>
                      </div>
                    </div>
                  ))}

                  {selectedMember.payments.length === 0 ? (
                    <p className={styles.emptyCopy}>No payment history recorded yet.</p>
                  ) : null}
                </div>

                <form action={recordPayment} className={styles.paymentForm}>
                  <input type="hidden" name="studentPk" value={selectedMember.id} />
                  <label>
                    <span>Fee label</span>
                    <input name="periodLabel" placeholder="Spring 2026 dues" required />
                  </label>
                  <label>
                    <span>Amount</span>
                    <input name="amount" type="number" min="0" defaultValue={25} required />
                  </label>
                  <label>
                    <span>Paid on</span>
                    <input name="paidAt" type="date" />
                  </label>
                  <label>
                    <span>Method</span>
                    <select name="method" defaultValue="ONLINE">
                      {paymentMethods.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span>Reference</span>
                    <input name="reference" placeholder="Receipt or transfer ID" />
                  </label>
                  <label className={styles.wideField}>
                    <span>Note</span>
                    <input name="note" placeholder="Optional context for treasurer or adviser" />
                  </label>
                  <button type="submit">Record payment</button>
                </form>
              </div>
            </>
          ) : (
            <div className={styles.emptyStateTall}>
              <h2>No student selected</h2>
              <p>Add a new student or pick an existing record from the roster.</p>
            </div>
          )}
        </div>

        <div className={styles.editorPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.panelEyebrow}>Record editor</p>
              <h2>{editorMode === "create" ? "Add new member" : "Update member"}</h2>
            </div>

            {editorMode === "edit" && selectedMember ? (
              <form
                action={deleteStudentMember}
                onSubmit={(event) => {
                  if (!window.confirm("Delete this student record and payment history?")) {
                    event.preventDefault();
                  }
                }}
              >
                <input type="hidden" name="id" value={selectedMember.id} />
                <button type="submit" className={styles.destructiveButton}>
                  Delete
                </button>
              </form>
            ) : null}
          </div>

          <form
            key={`${editorMode}-${selectedMember?.id ?? "new"}`}
            action={editorMode === "create" ? createStudentMember : updateStudentMember}
            className={styles.editorForm}
          >
            {editorMode === "edit" && selectedMember ? (
              <input type="hidden" name="id" value={selectedMember.id} />
            ) : null}

            <FormField
              label="Student ID"
              name="studentId"
              defaultValue={formMember?.studentId}
              required
            />
            <FormField
              label="First name"
              name="firstName"
              defaultValue={formMember?.fullName.split(" ")[0]}
              required
            />
            <FormField
              label="Last name"
              name="lastName"
              defaultValue={formMember?.fullName.split(" ").slice(1).join(" ")}
              required
            />
            <FormField
              label="Preferred name"
              name="preferredName"
              defaultValue={formMember?.preferredName ?? ""}
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              defaultValue={formMember?.email}
              required
            />
            <FormField
              label="Phone"
              name="phone"
              defaultValue={formMember?.phone}
              required
            />
            <FormField
              label="Date of birth"
              name="dateOfBirth"
              type="date"
              defaultValue={formMember?.dateOfBirth ?? ""}
            />
            <FormField label="Gender" name="gender" defaultValue={formMember?.gender ?? ""} />
            <FormField label="Major" name="major" defaultValue={formMember?.major} required />
            <FormField label="Minor" name="minor" defaultValue={formMember?.minor ?? ""} />
            <FormField
              label="Department"
              name="department"
              defaultValue={formMember?.department}
              required
            />
            <FormField
              label="College"
              name="college"
              defaultValue={formMember?.college}
              required
            />
            <FormField
              label="Year level"
              name="yearLevel"
              defaultValue={formMember?.yearLevel}
              required
            />
            <FormField
              label="Graduation term"
              name="graduationTerm"
              defaultValue={formMember?.graduationTerm ?? ""}
            />
            <FormField
              label="Enrollment status"
              name="enrollmentStatus"
              defaultValue={formMember?.enrollmentStatus}
              required
            />
            <FormField
              label="Address line 1"
              name="addressLine1"
              defaultValue={formMember?.addressLine1}
              required
            />
            <FormField
              label="Address line 2"
              name="addressLine2"
              defaultValue={formMember?.addressLine2 ?? ""}
            />
            <FormField label="City" name="city" defaultValue={formMember?.city} required />
            <FormField label="State" name="state" defaultValue={formMember?.state} required />
            <FormField
              label="Postal code"
              name="postalCode"
              defaultValue={formMember?.postalCode}
              required
            />
            <FormField
              label="Emergency contact"
              name="emergencyContactName"
              defaultValue={formMember?.emergencyContactName}
              required
            />
            <FormField
              label="Emergency phone"
              name="emergencyContactPhone"
              defaultValue={formMember?.emergencyContactPhone}
              required
            />
            <FormField
              label="Guardian name"
              name="guardianName"
              defaultValue={formMember?.guardianName ?? ""}
            />
            <FormField
              label="Guardian phone"
              name="guardianPhone"
              defaultValue={formMember?.guardianPhone ?? ""}
            />
            <label>
              <span>Membership status</span>
              <select
                name="membershipStatus"
                defaultValue={formMember?.membershipStatus ?? "PENDING"}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <FormField
              label="Annual fee"
              name="annualFee"
              type="number"
              defaultValue={formMember?.annualFee ?? 75}
              required
            />
            <FormField
              label="Photo URL"
              name="photoUrl"
              defaultValue={formMember?.photoUrl ?? ""}
            />
            <label className={styles.wideField}>
              <span>Notes</span>
              <textarea
                name="notes"
                rows={5}
                defaultValue={formMember?.notes ?? ""}
                placeholder="Committee roles, advising notes, payment follow-up, accessibility needs..."
              />
            </label>
            <div className={styles.formActions}>
              <button type="submit">
                {editorMode === "create" ? "Create member" : "Save changes"}
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setEditorMode(editorMode === "create" ? "edit" : "create")}
              >
                {editorMode === "create" ? "Switch to edit" : "Create another"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.statTile}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoItem}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FormField({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span>{label}</span>
      <input name={name} type={type} defaultValue={defaultValue ?? ""} required={required} />
    </label>
  );
}
