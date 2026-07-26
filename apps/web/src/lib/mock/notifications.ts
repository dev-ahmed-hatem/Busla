/**
 * Mock data for the Notifications screen (Screenshots 365–367). Content strings are
 * kept as data (English, mirroring the design); the chrome/labels are localised.
 */

export type NotifGroup = "today" | "yesterday" | "earlier";

// --- Trips tab -------------------------------------------------------------

export type TripNotifKind = "breakdown" | "off_route" | "trip_started" | "delay" | "completed";

export interface TripNotif {
  id: string;
  kind: TripNotifKind;
  title: string;
  subtitle: string;
  time: string;
  group: NotifGroup;
}

export const TRIP_NOTIFS: TripNotif[] = [
  {
    id: "t1",
    kind: "breakdown",
    title: "Bus 12 Breakdown",
    subtitle: "Engine issue detected near Al Yasmine St. Trip is currently stopped",
    time: "10 min ago",
    group: "today",
  },
  {
    id: "t2",
    kind: "off_route",
    title: "Bus 07 Off Route",
    subtitle: "Bus is off the planned route for more than 5 minutes",
    time: "30 min ago",
    group: "today",
  },
  {
    id: "t3",
    kind: "trip_started",
    title: "Morning Trip Started",
    subtitle: "Bus 05 has started the morning trip successfully",
    time: "1 hr ago",
    group: "today",
  },
  {
    id: "t4",
    kind: "delay",
    title: "Delay Detected",
    subtitle: "Bus 09 is delayed by 12 minutes",
    time: "1 hr ago",
    group: "today",
  },
  {
    id: "t5",
    kind: "trip_started",
    title: "Afternoon Trip Started",
    subtitle: "Bus 02 has started the afternoon trip successfully",
    time: "Yesterday, 03:45 PM",
    group: "yesterday",
  },
  {
    id: "t6",
    kind: "completed",
    title: "Trip Completed",
    subtitle: "Bus 06 completed the morning trip successfully",
    time: "May 28, 02:45 PM",
    group: "earlier",
  },
  {
    id: "t7",
    kind: "delay",
    title: "Delay Detected",
    subtitle: "Bus 09 is delayed by 12 minutes",
    time: "May 28, 03:45 PM",
    group: "earlier",
  },
  {
    id: "t8",
    kind: "trip_started",
    title: "Morning Trip Started",
    subtitle: "Bus 05 has started the morning trip successfully",
    time: "May 28, 08:45 AM",
    group: "earlier",
  },
];

// --- Parent Requests tab ---------------------------------------------------

export interface ParentRequest {
  id: string;
  name: string;
  zone: string;
  reason: string;
  time: string;
  group: NotifGroup;
}

export const PARENT_REQUESTS: ParentRequest[] = [
  {
    id: "p1",
    name: "Layla Mohamed",
    zone: "Zone B → Zone A",
    reason: "Requested a pickup address change",
    time: "10 min ago",
    group: "today",
  },
  {
    id: "p2",
    name: "Omar Hassan",
    zone: "Same zone",
    reason: "Minor stop adjustment needed",
    time: "30 min ago",
    group: "today",
  },
  {
    id: "p3",
    name: "Leila Nassar",
    zone: "Zone C → Zone A",
    reason: "Requested a pickup address change",
    time: "1 hr ago",
    group: "today",
  },
  {
    id: "p4",
    name: "Layla Mohamed",
    zone: "Zone B → Zone A",
    reason: "Requested a pickup address change",
    time: "2 hr ago",
    group: "today",
  },
  {
    id: "p5",
    name: "Youssif Karim",
    zone: "Same zone",
    reason: "Minor stop adjustment needed",
    time: "Yesterday, 03:45 PM",
    group: "yesterday",
  },
];

// --- Shift Readiness tab ---------------------------------------------------

export type CheckInState = "no_response" | "pending" | "checked_in";

export interface DriverCheckin {
  id: string;
  name: string;
  bus: string;
  state: CheckInState;
  detail: string;
}

export const SHIFT_SUMMARY = { time: "04:00 AM", checkedIn: 22, total: 24 };

export const DRIVER_CHECKINS: DriverCheckin[] = [
  { id: "d1", name: "Ahmad Sayed", bus: "Bus 05", state: "no_response", detail: "No response" },
  { id: "d2", name: "Omar Hassan", bus: "Bus 08", state: "pending", detail: "Pending - 18 min" },
  { id: "d3", name: "Mo'men Abdelsalam", bus: "Bus 07", state: "checked_in", detail: "Checked in 04:00" },
  { id: "d4", name: "Mohamed Helmy", bus: "Bus 09", state: "checked_in", detail: "Checked in 03:57" },
  { id: "d5", name: "Abdullah Elsaied", bus: "Bus 02", state: "checked_in", detail: "Checked in 03:55" },
  { id: "d6", name: "Ziad Yasser", bus: "Bus 01", state: "checked_in", detail: "Checked in 03:52" },
  { id: "d7", name: "Basil Nagah", bus: "Bus 06", state: "checked_in", detail: "Checked in 03:52" },
];

// Tab badge counts (from the design).
export const NOTIF_COUNTS = { trips: 8, parentRequests: 5, shiftReadiness: 2 };
