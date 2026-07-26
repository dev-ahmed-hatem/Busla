/**
 * Mock data for Users Management (Screenshots 378–381, 393–396). Row data is English
 * (mirrors the design); table chrome is localised.
 */

export type UserTab = "students" | "drivers" | "supervisors";

export interface UserRow {
  id: string;
  series: number;
  name: string;
  phone: string;
  area: string;
  route: string | null;
  bus: string;
  status: string;
}

export const STUDENTS: UserRow[] = [
  { id: "s1", series: 1, name: "Samy Ahmed", phone: "011234567890", area: "New Cairo", route: "Al Narges", bus: "Bus 05", status: "Scheduled" },
  { id: "s2", series: 2, name: "Tarek Youssef", phone: "011234567891", area: "New Cairo", route: "Al Narges", bus: "Bus 06", status: "Scheduled" },
  { id: "s3", series: 3, name: "Hassan Salah", phone: "011234567892", area: "New Cairo", route: "Al Narges", bus: "Bus 07", status: "Absent" },
  { id: "s4", series: 4, name: "Lara Nabil", phone: "011234567893", area: "New Cairo", route: "Al Narges", bus: "Bus 08", status: "Scheduled" },
  { id: "s5", series: 5, name: "Karim Fathy", phone: "011234567894", area: "New Cairo", route: "Al Narges", bus: "Bus 09", status: "Absent" },
  { id: "s6", series: 6, name: "Sara Youssef", phone: "011234567895", area: "New Cairo", route: null, bus: "Bus 10", status: "Unscheduled" },
];

export const DRIVERS: UserRow[] = [
  { id: "dr1", series: 1, name: "Samy Ahmed", phone: "011234567890", area: "New Cairo", route: "Al Narges", bus: "Bus 05", status: "Active" },
  { id: "dr2", series: 2, name: "Tarek Youssef", phone: "011234567891", area: "New Cairo", route: "Al Narges", bus: "Bus 06", status: "Off-Duty" },
  { id: "dr3", series: 3, name: "Hassan Salah", phone: "011234567892", area: "New Cairo", route: "Al Narges", bus: "Bus 07", status: "Absent" },
  { id: "dr4", series: 4, name: "Omar Nabil", phone: "011234567893", area: "New Cairo", route: "Al Narges", bus: "Bus 08", status: "Active" },
  { id: "dr5", series: 5, name: "Karim Fathy", phone: "011234567894", area: "New Cairo", route: "Al Narges", bus: "Bus 09", status: "Absent" },
  { id: "dr6", series: 6, name: "Tarek Younis", phone: "011234567896", area: "New Cairo", route: "Al Narges", bus: "Bus 10", status: "Active" },
];

export const SUPERVISORS: UserRow[] = [
  { id: "su1", series: 1, name: "Abeer Sayed", phone: "011234567890", area: "New Cairo", route: "Al Narges", bus: "Bus 05", status: "Active" },
  { id: "su2", series: 2, name: "Dina Farouk", phone: "011234567891", area: "New Cairo", route: "Al Narges", bus: "Bus 06", status: "Off-Duty" },
  { id: "su3", series: 3, name: "Laila Hamdy", phone: "011234567892", area: "New Cairo", route: "Al Narges", bus: "Bus 07", status: "Absent" },
  { id: "su4", series: 4, name: "Nadia Mostafa", phone: "011234567893", area: "New Cairo", route: "Al Narges", bus: "Bus 08", status: "Active" },
  { id: "su5", series: 5, name: "Mona Khalil", phone: "011234567894", area: "New Cairo", route: "Al Narges", bus: "Bus 09", status: "Absent" },
  { id: "su6", series: 6, name: "Laila Hassan", phone: "011234567896", area: "New Cairo", route: "Al Narges", bus: "Bus 10", status: "Active" },
];

export const USER_ROWS: Record<UserTab, UserRow[]> = {
  students: STUDENTS,
  drivers: DRIVERS,
  supervisors: SUPERVISORS,
};

// --- Student profile (for the profile modal, Screenshots 393–396) ----------

export interface Guardian {
  name: string;
  role: string;
  primary?: boolean;
  isNew?: boolean;
  phone: string;
  email?: string;
}

export interface StudentProfile {
  name: string;
  studentId: string;
  status: string;
  personal: { dob: string; grade: string; class: string; address: string };
  guardians: Guardian[];
  transportation: {
    bus: string;
    driver: string;
    supervisor: string;
    morningPickup: { time: string; address: string };
    afternoonDropoff: { time: string; address: string };
  };
  request: {
    date: string;
    current: { address: string; route: string; tag: string };
    requested: { address: string; status: string };
    suggestion: { text: string; bus: string; seatsLeft: number; percent: number };
  } | null;
}

export const STUDENT_PROFILE: StudentProfile = {
  name: "Ahmed Ali Hassan",
  studentId: "84920",
  status: "Attend",
  personal: {
    dob: "11 Oct 2017",
    grade: "Primary 3",
    class: "3A",
    address: "Building 12, Street 45, Fifth Settlement, New Cairo",
  },
  guardians: [
    { name: "Sara Mohamed Hussien", role: "Mother", primary: true, phone: "01234567789", email: "Sara@gmail.com" },
    { name: "Ali Hassan Mohamed", role: "Father", phone: "01234567789", email: "Ali@gmail.com" },
  ],
  transportation: {
    bus: "Bus 2345",
    driver: "Sami Ali",
    supervisor: "Abeer Ahmed",
    morningPickup: { time: "7:15 am", address: "Building 12, Street 45, Fifth Settlement, New Cairo" },
    afternoonDropoff: { time: "3:45 pm", address: "Building 55, Street 10, El Tagamoa El 5, New Cairo" },
  },
  request: {
    date: "Sunday, June 1, 2026",
    current: {
      address: "Building 12, Street 45, Fifth Settlement, New Cairo",
      route: "Bus 05 - Al Narges Route",
      tag: "Afternoon Trip Only",
    },
    requested: {
      address: "Building 55, Street 10, El Tagamoa El 5, New Cairo",
      status: "Pending Assignment",
    },
    suggestion: {
      text: "Based on the new address, we suggest switching to Bus 02 North Route to minimize travel time.",
      bus: "Bus 02 North (Suggested)",
      seatsLeft: 4,
      percent: 75,
    },
  },
};
