/**
 * The single mapping from domain status enums → semantic status tokens.
 * Every table cell, map pin, and health bar routes through this so the
 * green/amber/red/blue system is enforced in exactly one place.
 *
 * Token CSS vars come from @busla/tokens (--color-status-*).
 */

export type StatusTone = "onTime" | "delayed" | "issue" | "info" | "neutral";

/** Maps any backend status string to a tone. Extend as enums land per slice. */
const STATUS_TONE: Record<string, StatusTone> = {
  // trips / live tracking
  on_time: "onTime",
  ready: "onTime",
  completed: "onTime",
  active: "onTime",
  attend: "onTime",
  in_service: "onTime",
  checked_in: "onTime",
  scheduled: "onTime",
  in_progress: "info",
  delayed: "delayed",
  maintenance: "delayed",
  soon: "delayed",
  pending: "delayed",
  off_duty: "neutral",
  unscheduled: "delayed",
  broken_down: "issue",
  off_route: "issue",
  issue: "issue",
  absent: "issue",
  critical: "issue",
  no_response: "issue",
  unassigned: "issue",
  incomplete: "issue",
};

export function toneFor(status: string): StatusTone {
  return STATUS_TONE[status.toLowerCase().replace(/[\s-]/g, "_")] ?? "neutral";
}

export const TONE_VAR: Record<StatusTone, string> = {
  onTime: "var(--color-status-on-time)",
  delayed: "var(--color-status-delayed)",
  issue: "var(--color-status-issue)",
  info: "var(--color-status-info)",
  neutral: "var(--color-neutral-500)",
};
