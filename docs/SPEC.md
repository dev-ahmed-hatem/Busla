# BUSLA — Product Specification

> **Status:** Draft v0.1 · Derived from the Figma web-admin design (33 screens).
> **Scope note:** This spec fully covers the **Web Admin dashboard**. The **Mobile apps** (Parent, Driver/Nanny) are described as *inferred requirements* pending their Figma screens. Sections marked 🟡 need confirmation.

---

## 1. Overview

**BUSLA** is a school-bus fleet operations and real-time tracking platform. It lets a school's transport operations team plan bus routes (with AI assistance), track buses live, manage the people and vehicles involved, and respond to parent requests and daily incidents — with the goal of getting every student to school safely and on time.

**Primary outcome:** guarantee on-time, safe school transport while minimizing manual dispatch/coordination work.

### 1.1 Product surfaces
| Surface | Primary user | Status |
|---|---|---|
| **Web Admin dashboard** | Operations Manager / transport admin | ✅ Designed (this spec) |
| **Parent mobile app** | Parents/guardians | 🟡 Inferred, Figma pending |
| **Driver / Nanny mobile app** | Drivers & bus supervisors | 🟡 Inferred, Figma pending |

### 1.2 Reference scale (from the design data)
~20 buses · ~24 drivers · ~24 supervisors (nannies) · ~625 students · zones: New Cairo, Shorouk, Madinaty, Al-Narjis.

---

## 2. Personas & Roles

- **Operations Manager (Admin)** — the logged-in web user ("Ahmed Saeed"). Full access: dashboards, live tracking, route planning, user/bus management, request approvals. *This is the only role visible in the current design.* 🟡 Other admin roles (viewer, dispatcher, school staff) TBD.
- **Driver** — operates a bus on a route; has license info, experience, and a duty status (Active / Off-Duty / Absent); must **check in** before the shift.
- **Supervisor / Nanny** — rides the bus to supervise students; her **home address becomes route Stop 1**.
- **Student** — the transported passenger; belongs to a grade/class, an area, a route, and a bus; has attendance status.
- **Parent / Guardian** — one primary contact + additional authorized pickup guardians; submits **requests** (pickup address / zone changes).

---

## 3. Domain glossary

| Term | Meaning |
|---|---|
| **Trip / Journey** | One scheduled bus run (e.g. Morning or Afternoon shift) from origin zone to school (or reverse). |
| **Shift** | Time band for trips: **Morning** / **Afternoon** (multi-shift = one driver does consecutive trips). |
| **Route** | Ordered set of stops assigned to a bus, with driver, nanny, students, distance, duration. |
| **Stop** | A pickup/drop point on a route. Nanny's home = Stop 1; siblings share a stop. |
| **Shift Readiness** | Pre-dawn (04:00) driver check-in status confirming the fleet is ready. |
| **Zone / Area** | Residential region (New Cairo, Shorouk, Madinaty, Al-Narjis). |
| **Parent Request** | Guardian-submitted change (pickup address, zone move, stop adjustment) needing admin approval. |
| **Nanny stop** | The supervisor's boarding stop shown in route tables. |

---

## 4. Data model (entities)

> Field lists below are drawn from the forms/tables in the design. Types are proposed.

### Bus
`id/number` (e.g. "Bus 05") · `model` (e.g. Toyota Coaster 2024) · `licensePlate` (Arabic-capable, e.g. `أ ب د 234`) · `capacity` (seats) · `odometerKm` · `route` · `driverId` · `status` (In Service / Maintenance / Issue) · `breakdownReason` (Engine / Electrical / Suspension / …) · `lastMaintenanceDate` · **maintenance health**: `oilHealth` (current/limit KM + state), `tireLife` (current/limit KM + state).

### Driver
`id` · `fullName` · `photo` · `phone` · `nationalId` · `licenseNumber` · `licenseExpiryDate` · `yearsOfExperience` · `area` · `route` · `busId` · `status` (Active / Off-Duty / Absent) · `shiftCheckIn` (time / no response).

### Supervisor (Nanny)
`id` · `fullName` · `photo` · `phone` · `nationalId` · `homeAddress` {area, fullAddress} *(→ route Stop 1)* · `area` · `route` · `busId` · `status`.

### Student
`id` (e.g. 84920) · `fullName` · `photo` · `dateOfBirth` · `grade` (e.g. Primary 3) · `class` (e.g. 3A) · `phone` · `area` · `address` · `routeId` · `busId` · `attendanceStatus` (Scheduled / Attend / Absent / Unscheduled / Unassigned) · **transportation**: {bus, driver, supervisor, morningPickup{time,address}, afternoonDropOff{time,address}}.

### Guardian
`studentId` · `primaryGuardian` {name, phone, relationship (Mother/Father/Other), email} · `authorizedPickupGuardians[]` {name, relationship, phone, isNew}.

### Route
`id` (e.g. R-01) · `busId` · `shift` · `studentCount` (e.g. 22/25) · `distanceKm` · `estDurationMin` · `driverId` · `nannyStop` · `status` (Ready / Incomplete) · `stops[]` (ordered) · `path` (map polyline) · origin/destination.

### Trip / JourneyLog
`journeyId` (e.g. #2583) · `busId` · `driverId` · `nannyId` · `shift` · `scheduledDeparture` / `actualDeparture` · `scheduledArrival` / `actualArrival` · `status` (On-time / Delayed Xm / Broken down / Terminated) · `from` / `to` · `stopsCount`.

### Notification
`type` (trip-update / parent-request / shift-readiness) · `category` · `title` · `body` · `timestamp` · `read` · `relatedEntity`.

### ParentRequest
`id` · `studentId` · `type` (pickup-address change / zone change / stop adjustment) · `currentTrip` · `requestedTrip` · `status` (Pending / Approved / Rejected) · `systemSuggestion` (suggested bus reassignment) · `submittedAt`.

---

## 5. Web Admin — modules & screens

Global chrome: **top bar** (BUSLA logo, global search, notifications bell w/ unread count, profile w/ role) + **left sidebar** (Dashboard, Live tracking [badge], Route Planning, Users Management, Buses Management, Settings, Sign Out).

### 5.1 Dashboard
- **KPI cards** (4): Buses, Drivers, Supervisors, Students — each with total + breakdown (active/available/unavailable/on-trip/scheduled/unscheduled) + a utilization % bar.
- **Main Map** with live bus pins + "Open Full Map".
- **Action Required** feed (count badge, "View All"): breakdown, off-route, driver absent, pickup-change request — each with relative time and drill-in.
- **Trips Status Today** donut: Completed / In progress / Delayed / Issues with counts + %.
- **Bus Capacity Overview** table (Bus, Route, Capacity, Occupied, Available) + pagination + period filter.

### 5.2 Notifications
Header + 3 tabs with counts:
- **Trips** — Morning/Afternoon trip started, Trip completed, Delay detected, Bus breakdown. Grouped by Today / Yesterday / Earlier; unread dot.
- **Parent Requests** — request rows (student, zone change A→B, reason) + "View Request" CTA.
- **Shift Readiness** — "22/24 drivers checked in" at 04:00; rows show Checked in HH:MM / Pending / No response with **Send reminder** and **Find substitute** actions.

### 5.3 Live Tracking
- **Map** with color-coded bus pins: 🟢 On-time · 🟡 Delayed · 🔴 Broken down · 🟠 Off-route. Zone filter (All Zones / Madinaty / Shorouk / Al-Narjis). Zoom controls.
- **Map / Journey Logs** toggle.
- **Live Journeys** side panel (count): searchable list; each card = bus, status pill, "Heading to \<district\>", progress bar, seats (e.g. 4/25), ETA (30 mins), distance (3/30 KM), driver + nanny avatars.
- **Nearest available bus** popover → "Share Location" / "Dispatch Bus 11".
- **Bus detail view** (breadcrumb Live Tracking › Bus 05): route polyline on map + side card with **Route Timeline** (Completed / Current / Upcoming stops w/ times, e.g. Start 06:00 → Current 06:25 → Next 06:50 → Endpoint School 07:15).
- **Journey Logs** view: date picker; KPI cards (Completed / On-time / Delayed / Incidents); filters (Shift, Area, Status); table (Journey id, Bus, Driver, Nanny, Shift, Departed [sched/actual], Arrived [sched/actual], Status, View); **Export Report**.

### 5.4 Route Planning (AI)
- **Empty state**: "N Students Ready for Route Planning" → **Configure & Plan Routes**.
- **Route Optimization Settings** modal: student data source (use system / upload Excel — name+address), supervisor data source (system / upload), ☑ Enable Multi-Shift Scheduling (double-shifting per driver), Number of Buses, Seats per Bus, "+ Add more bus types", School Arrival Deadline → **Run AI Optimization**.
- **Generated Routes** table: Route, Bus, Students (x/25), Distance, Est. Duration, Driver (or "Assign driver" CTA if missing), Nanny stop, Status (Ready / Incomplete), actions (view/delete). Header: "Re-optimize Routes", "Refresh Data", "+ Add New Route", filters (Shift/Area/Status).
- **Route Journey Details** modal: bus card (model, plate, seats occupied %), assign-driver card, assigned supervisor card, **Stops (12)** list, route map with numbered stops, Est. Duration + Total Distance, "+ Add Student".
- **Add New Route** modal (manual): Route ID, Bus, Shift, driver, supervisor, student multi-select, live route map, Save.

### 5.5 Users Management
Tabs: **Students / Drivers / Supervisors**. Shared pattern: title, search, Filter, **Upload File** (CSV/Excel), **Add \<entity\>**, data table w/ row select, bulk actions (**Export**, **Delete All**, "N items selected / Clear selection"), pagination, per-row view/delete.

- **Students table**: Series, Student(+avatar), Phone, Area, Route, Bus, Status (Scheduled/Attend/Absent/Unscheduled/Unassigned).
  - **Add New Student** modal (3 steps/tabs): *Personal Info* (photo, full name, DOB, grade, class), *Contact* (primary guardian name, phone, relationship, email optional), *Address* (area, full address).
  - **Student Profile** modal (tabs): *Personal Info* · *Guardian* (primary + additional guardian cards w/ phone/email) · *Transportation* (bus, driver, supervisor, morning pickup + afternoon drop-off w/ times/addresses) · *Requests* (approve/reject a pending change; shows Current vs Requested trip, an AI **System Suggestion** to reassign bus w/ seats-left meter, authorized pickup guardians; **empty state** when none). Actions: Edit, Print Report.
- **Drivers table**: same shape; Status Active/Off-Duty/Absent. **Add New Driver** modal: photo, full name, phone, national ID, license number, license expiry, years of experience.
- **Supervisors table**: Nanny name, phone, area, route, bus, status. **Add New Supervisor** modal: photo, full name, phone, national ID, home address (area + full address → used as initial route stop).

### 5.6 Buses Management
- Title + description; **Bus List** with quick filters **In Service / Maintenance / Issue** + Filter + **Add Bus**.
- Table: Series, Bus num(+icon), License Num (Arabic), Route, Last maintenance, Status, Breakdown (Engine/Electrical/Suspension), Actions. In *Maintenance/Issue* views, rows expose **Resolve** / **Maintenance** actions.
- **Bus Profile** modal (tabs): *Info* (driver, model, plate, capacity) · *Route* (route, current odometer KM) · *Maintenance* (breakdown reason, last maintenance, **Oil Health** + **Tire Life** progress bars w/ Critical/Soon states). Actions: **Resolve**, **Delete Bus**.
- **Add New Bus** modal: Bus Number/ID, Bus Model, License Plate (Arabic), Total Capacity (seats), Odometer.

---

## 6. Mobile apps 🟡 (inferred — awaiting Figma)

The web flows imply two mobile clients. To confirm once mobile screens arrive:

### 6.1 Parent app
- Live tracking of *my child's* bus + ETA to pickup/school.
- Trip notifications (started / arrived / delayed / boarded).
- Submit **requests** (change pickup address, zone, stop) — the source of §5.2 Parent Requests.
- Manage **authorized pickup guardians**.
- View child's route, driver, and nanny.

### 6.2 Driver / Nanny app
- **Shift check-in** (source of §5.2 Shift Readiness).
- Turn-by-turn route + ordered stop list; mark student boarded/absent.
- Report incidents (breakdown / off-route) → surfaces in Action Required.
- Trip start/complete events.

---

## 7. Cross-cutting requirements

- **Status color system:** 🟢 green = on-time / active / ready · 🟡 amber = delayed / maintenance / soon · 🔴 red = broken-down / absent / issue / critical · 🔵 blue = informational.
- **Internationalization / RTL:** UI is English, but content includes Arabic (license plates). Likely Arabic/English bilingual + RTL support required. 🟡 Confirm.
- **Maps:** live positions, route polylines, numbered stops, zone overlays, nearest-bus queries, dispatch. (Provider TBD — Google Maps / Mapbox.)
- **Bulk data import:** CSV/Excel upload for students, drivers, supervisors (name + address, template-validated).
- **Reporting/Export:** journey logs and entity lists exportable; per-student "Print Report".
- **Notifications:** real-time (trip events, incidents, requests, readiness) — implies push + in-app + a live channel.
- **Design language:** navy + amber brand, school-bus-yellow iconography, rounded cards, light theme, table + modal heavy, generous whitespace.
- **Realtime:** live tracking and journey progress need a streaming/websocket layer.

---

## 8. AI features

1. **Route optimization** — ingest students + supervisors (system or Excel) + constraints (bus count, seats/bus, shift rules, school arrival deadline) → generate optimal zoned routes and assignments.
2. **Reassignment suggestions** — when a student's address changes, suggest the best alternative bus/route to minimize travel time, with a seats-left check ("System Suggestion" in the student Requests tab).

---

## 9. Open questions

1. **Mobile:** Parent and Driver/Nanny app screens — confirm flows in §6.
2. **Auth & roles:** login/signup, password reset, multi-role permissions, multi-school/tenant support?
3. **Settings** screen contents (referenced in nav, not designed).
4. **i18n/RTL:** is full Arabic + RTL in scope for v1?
5. **Map provider** and **AI/optimization engine** (build vs. 3rd-party routing API)?
6. **Notification delivery** channels (push/SMS/email) and real-time transport choice.
7. **Backend/tenancy:** single school vs. multi-school SaaS.
