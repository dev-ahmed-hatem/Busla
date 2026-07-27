/** "in_service" → "In Service", "off_duty" → "Off Duty". */
export function humanizeStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
