# BUSLA Web Admin — Design Catalog

Build spec derived from the Figma screenshots in `design/web/`. Each entry describes one
screenshot's app UI (Figma/browser chrome ignored). Used to rebuild the admin to parity.

**Design system:** light theme only, EN + AR (RTL). Tokens in `@busla/tokens`
(navy `#12284b`, amber `#f5a623`, status green `#22c55e` / amber `#f59e0b` / red `#ef4444`
/ info blue `#3b82f6`; neutrals slate scale; radii sm6/md10/lg16/pill).

**Status color system (consistent across screens):** green = active / completed / on-time;
red = out-of-service / issue / breakdown; amber/orange = delayed / in-progress / pending;
blue = links / primary / info / unread dot.

**Screen families / duplicates:**
- 364 & 368 — same Dashboard (full vs zoomed-out).
- 365 / 366 / 367 — Notifications, three tab states (Trips / Parent Requests / Shift Readiness).
- 369 / 370 / 371 — Live Tracking map: list default → dispatch popover → single-bus route+timeline.
- 372 — Live Tracking → Journey Logs (with date picker).

---

## Chrome (consistent across all screens)

- **Header (full-width, white, border-bottom):** BUSLA logo left (blue "BUS" + amber "L" + "A");
  optional breadcrumb (e.g. `Dashboard › Notifications`, three levels on detail screens);
  centered Search input ("Search"); bell icon with red count badge (20); user chip
  "Ahmed Saeed / Operations Manager" with avatar, green online dot, dropdown chevron.
- **Sidebar (left, white, border-end):** icon+label items — Dashboard, Live tracking (red badge "10"),
  Route Planning, Users Management, Buses Management; divider; Settings; Sign Out (red).
  Active item highlighted (light bg + navy text/indicator).

---

## Batch 1 — Screenshots 364–372

### Screenshot (364) — Dashboard (overview)
- **Layout:** header + sidebar; main grid: top row = 4 KPI stat cards; middle = Main Map (~60%) + Action Required (~40%); bottom = Trips Status donut (left) + Bus Capacity table (right).
- **KPI cards** (icon, title, big total, two sub-metrics each with small colored progress bar + %):
  - Buses **20** Total — 19 Active Now, 1 Out of Service, 76.7%
  - Drivers **24** Total — 20 Available, 4 Unavailable, 91%
  - Supervisors **24** Total — 19 On Trips, 5 Unavailable, 95%
  - Students **625** Total — 600 Scheduled Today, 25 Unscheduled, 85%
- **Main Map card:** title "Main Map"; street map with colored bus pins (green/red/orange) + school pin; "Open Full Map" button (expand icon, top-right).
- **Action Required card:** title + red count badge "12"; "View All" link. Rows = colored icon, bold title, subtitle, "X min ago", chevron. Samples: "Bus 12 – Breakdown / Engine failure – Trip is currently stopped / 10 min ago"; "Bus 45 – Off Route / deviated by 1.2 KM / 12 min ago"; "Driver Mohamed Ali – Absent / Morning trip has not started / 20 min ago"; "Pickup Change Request / Requested to change pickup location / 30 min ago".
- **Trips Status Today card:** "Today" dropdown; donut, center "24 / Total Trips"; legend rows w/ colored dot + count + %: Completed 18 (75%), In progress 3 (12.5%), Delayed 2 (8.3%), Issues 1 (4.2%).
- **Bus Capacity Overview card:** "Today" dropdown; table cols **Bus No. | Route | Capacity | Occupied | Available** (Capacity shows small horizontal bar); pagination pills 01–05 + Previous/Next. Samples: Bus 1/Route 1/50/44/6; Bus 2/Route 2/50/20/30; Bus 3/Route 3/50/32/18; Bus 4/Route 4/25/14/11.
- **Notes:** KPI sub-metric bars green with small red segment; bus markers = amber school-bus icon in colored pin.

### Screenshot (368) — Dashboard (duplicate of 364, zoomed-out artboard). Same inventory/data.

### Screenshot (365) — Notifications › Trips tab (default)
- **Page header:** title "Notifications", subtitle "Track trips updates, parent requests, and important alerts".
- **Tabs:** Trips (active, badge 8) · Parent Requests (badge 5) · Shift Readiness (badge 2); active underlined.
- **Date groups:** "Today 4", "Yesterday 1", "Earlier 3".
- **Rows (card):** leading circular status icon, bold title, subtitle, right timestamp, blue unread dot far-right.
- **Samples:** "Bus 12 Breakdown / Engine issue detected near Al Yasmine St… / 10 min ago" (red triangle); "Bus 07 Off Route / off planned route >5 min / 30 min ago" (red pin); "Morning Trip Started / Bus 05 … / 1 hr ago" (bus); "Delay Detected / Bus 09 delayed 12 min / 1 hr ago" (amber clock); "Trip Completed / Bus 03 … / 2 hr ago" (green check). Yesterday/Earlier use "Yesterday, 03:45 PM" / "May 28, 03:45 PM" timestamps.

### Screenshot (366) — Notifications › Parent Requests tab
- Same layout; rows add a dark pill **"View Request →"** button. Row = parent avatar, name + zone summary, reason subtitle, View Request button, timestamp, unread dot.
- **Samples:** "Layla Mohamed - Zone B → Zone A / Requested a pickup address change / 10 min ago"; "Omar Hassan - Same zone / Minor stop adjustment needed / 30 min ago"; "Leila Nassar - Zone C → Zone A / … / 1 hr ago"; "Youssif Karim - Same zone / … / Yesterday, 03:45 PM".

### Screenshot (367) — Notifications › Shift Readiness tab
- **Summary row:** "Today 04:00 AM" + blue pill "22 / 24 drivers checked in".
- **Rows:** driver avatar, name, bus label, right = status text or action button, unread dot. Action variants: **"Find substitute"** (dark pill, person icon) for No-response; **"Send reminder"** (light pill) for Pending; else "Checked in HH:MM" (muted).
- **Samples:** "Ahmad Sayed / Bus 05 — [Find substitute] — No response"; "Omar Hassan / Bus 08 — [Send reminder] — Pending - 18 min"; "Mo'men Abdelsalam / Bus 07 — Checked in 04:00"; "Ziad Yasser / Bus 01 — Checked in 03:52".

### Screenshot (369) — Live tracking › Map (default)
- **Layout:** main split — large map (center-left) + "Live Journeys" panel (right ~30%). Above map: view toggle + legend.
- **View toggle:** **Map** (active) / Journey Logs segmented control. **Legend chips:** On-time (green), Delayed (amber), Broken down (red), Off-route (orange).
- **Map:** bus pins Bus 05/06/07/08/09/11 in status colors + school pin; zoom +/- controls; zone dropdown (All Zones / Madinaty / Shorouk / Al-Narjis).
- **Live Journeys panel:** header "Live Journeys (8)"; search "Search by Bus no. or Driver name…" + filter icon; journey cards.
- **Journey card:** status chip (top-right); bus icon + "Bus 0X"; "Heading to / [Destination]" (or "Stopped at"); route progress bar w/ bus marker; metrics row (students 4/25, clock 30 mins, distance 3/30 KM); Driver + Nanny mini-profiles w/ avatars.
- **Samples:** Bus 05 On-time → Narjas District, 4/25, 30 mins, 3/30 KM, Driver Samy Ahmed, Nanny Abeer sayed. Bus 05 Delayed → Shorouk city, 18/25, 12 mins, 15/30 KM. Bus 07 Broken down, Stopped at Narjas District (red progress).

### Screenshot (370) — Live tracking › Map + dispatch popover (selected state)
- Same as 369 with a map popover **"Nearest available bus"**: bus icon + "Bus 11 - Omar Fathy", "2.3 km away · 6 min ETA", badge "6 min", buttons **"Share Location"** (light) + **"Dispatch Bus 11"** (dark).

### Screenshot (371) — Live tracking › Bus 05 detail (route + timeline)
- **Breadcrumb:** Dashboard › Live Tracking › Bus 05. Map draws a **blue route polyline** start→school, yellow current-position marker.
- **Right panel:** Bus 05 detail card (× to close): status "On-time", "Bus 05", "Heading to Narjas District", progress bar, metrics 4/25 · 30 mins · 3/30 KM, Driver Samy Ahmed + Nanny Abeer sayed.
  - **Trip summary:** From Narjas District → To New Smart School; Departure 06:00 AM | Stops 4 | Estimated Arrival 07:15 AM.
  - **Route Timeline** (vertical stepper, status chip per stop): Completed "Starting point - Narjis district / 5 Settlement / 06:00 AM"; On-time (current) "Shorouk City - Gate 1 / 06:25 AM"; Upcoming "Madinaty - Craft Zone / 06:50 AM"; Upcoming "Endpoint - School / 07:15 AM".

### Screenshot (372) — Live tracking › Journey Logs
- **Breadcrumb:** Dashboard › Live Tracking › Journey Logs. Toggle Map / **Journey Logs**; date pill "1 Apr 2026".
- **4 KPI cards w/ sparklines:** Completed Trips 18 (75% of total); On time Trips 12 (50%); Delayed Trips 5 (Avg. delay +15m); Incidents 1 (Requires attention).
- **Toolbar:** "Journey Logs" title; search; filters **Shift ▾ / Area ▾ / Status ▾**; **"Export Report"** primary (download icon).
- **Table cols:** **Journey id | Bus | Driver | Nanny | Shift | Departed | Arrived | Status | Actions**. Departed/Arrived show Scheduled vs Actual (two lines); Status = colored badge; Actions = View (eye).
- **Samples:** #2583 Bus 05 Samy/Abeer Morning 06:00/06:05 07:30/07:35 **Delayed 5m** ; #2584 Bus 06 On-time 06:00/06:00 07:30/07:30 ; #2586 Bus 08 Afternoon 02:30/02:30 07:30/"Terminated at 06:45" **Broken down**.
- **Date-picker popover:** month calendar "April 2026", prev/next, Su–Sa, date grid, Cancel / Apply Changes.
- **Notes:** KPI sparklines green (positive) / red (delayed/incidents). Pagination Previous · 01–10 · Next.

---

## Batch 3 — Screenshots 382–390 (Users & Buses modals + Bus List)

### Screenshot (382) — Users Management › Add New Student modal (3 tabs)
- Centered modal (~420px). Header: title "Add New Student", subtitle "Enter the student's details, guardian contact, and address…", close X.
- **Segmented pill tabs:** Personal Info | Contact | Address (active = pale-blue fill).
- **Personal Info:** photo uploader ("Upload student photo / PNG, JPG, up to 5MB", gray avatar + blue "+"); Full Name*, Date of Birth* (DD/MM/YYYY, calendar), Grade* + Class* (two dropdowns side by side).
- **Contact:** Primary Guardian Name*, Phone Number*, Relationship* (Mother/Father/Other), Email (Optional).
- **Address:** Area* (dropdown, e.g. New Cairo), Full Address* (Building, Street, District, Landmarks).
- **Footer:** Cancel (outline) + **+ Add Student** (navy). Required = red asterisk.

### Screenshot (383) — Users Management › Add New Driver + Add New Supervisor modals
- **Add New Driver:** subtitle "…personal details, license information, and experience…". Section "Personal Info": photo uploader; Full Name*; row Phone Number* + National ID*. Section "Work Info": Driver's License Number*; row License Expiry Date* (DD/MM/YYYY) + Years of Experience*. Footer Cancel + **+ Add Driver**.
- **Add New Supervisor:** subtitle "…personal details and home address. The system will use the address as the initial route stop." Section "Personal Info": photo uploader; Full Name*; row Phone Number* + National ID*. Section "Home Address": Area* dropdown; Full Address*. Footer Cancel + **+ Add Supervisor**.
- Note: these use plain section labels (not pill tabs).

### Screenshots (384–387) — Buses Management › Bus List (4 filter states)
- **Shell:** page header "Buses Management" + subtitle "Manage your school bus fleet, track vehicle operational status, and monitor maintenance…". Card toolbar: "Bus List" heading, search, filter pills **In Service | Maintenance | Issue**, **Filter ▾**, **+ Add Bus** (navy).
- **Table cols:** checkbox | **Series | Bus num | License Num | Route | Last maintenance | Status | Breakdown | Actions**. Pagination Previous · 01…10 · Next.
- **384 (All/default):** mixed statuses; Actions = view (eye) + delete (trash). Samples: `1 · Bus 05 · أ ب د 234 · Al Narges · Tue . 12 Dec 2026 · Maintenance · Engine`; `2 · Bus 06 · … · In Service · —`; `5 · Bus 09 · … · Issue · Electrical`.
- **385 (In Service filter active):** all rows In Service (green), blank breakdown; Actions view+delete.
- **386 (Maintenance filter):** all rows Maintenance (amber) + breakdown reason; Actions = green **✓ Resolve** + eye.
- **387 (Issue filter):** all rows Issue (red) + breakdown; Actions = red **⇄ Maintenance** (send-to-maintenance) + eye.
- **Notes:** Status badges — Maintenance amber, In Service green, Issue red. Plate numbers Arabic (`أ ب د 234`). Row action differs per filter state.

### Screenshots (388–390) — Buses Management › Bus Profile modal (Info / Route / Maintenance)
- **Left panel:** yellow circular bus avatar, **Bus 05**, status badge (Maintenance amber), **✓ Resolve** (green) + **🗑 Delete Bus** (red outline). Close X.
- **Tabs:** Info | Route | Maintenance (red "1" badge).
- **Info tab (388):** Driver → Mohamed Ali (avatar); Bus Model → ###### ; Bus Plate → أ ب د 234; Capacity → 25 student.
- **Route tab (389):** Route → Al Narges; Odometer (Current KM) → 350 km.
- **Maintenance tab (390):** Breakdown → Engine Failure; Last maintenance → "Currently in maintenance" (amber); Oil Health → "5,120 / 5,000 KM · Critical" (full **red** bar); Tire Life → "95,000 / 100,000 KM · Soon" (**orange** bar ~90%).

### Screenshot (390 right) — Buses Management › Add New Bus modal
- Title "Add New Bus", subtitle "Enter the vehicle's identification, specifications, and capacity…". Fields: Bus Number / ID*; row Bus Model* + License Plate Number*; Total Capacity (Seats)*; Odometer (Current KM)*. Footer Cancel + **+ Add Bus** (navy).

---

## Batch 4 — Screenshots 391–396 (Dashboard dup, Notifications, Student Profile modal)

### Screenshot (391) — Dashboard (duplicate of 364). Same inventory/data. Note: Trips donut legend colors here read Completed green / In progress **blue** / Delayed **yellow** / Issues red.

### Screenshot (392) — Notifications › Parent Requests (same as 366). Breadcrumb "Dashboard › Notifications".

### Student Profile modal (Users Management › Students › row → profile). Shared structure across 393–396:
- **Left summary column:** student photo, name "Ahmed Ali Hassan", "Student ID: 84920", green **Attend** status pill, navy **Edit** (pencil) button, outlined **Print Report** (printer) button, close X.
- **Right pane tabs:** Personal Info | Guardian | Transportation | Requests (badge "1" when populated).
- Background page (behind modal): Students (active) | Drivers | Supervisors tabs; **+ Add Student**; table with checkbox column + red delete icons; pagination.

### Screenshot (394 left) — Personal Info tab
- Rows (icon + label + value): Date of Birth — 11 Oct 2017; Grade — Primary 3; Class — 3A; Address — Building 12, Street 45, Fifth Settlement, New Cairo.

### Screenshot (394 right) — Guardian tab
- Two guardian cards (photo, name, role, phone, email): Sara Mohamed Hussien — Mother (Primary Contact) — 01234567789 — Sara@gmail.com; Ali Hassan Mohamed — Father — 01234567789 — Ali@gmail.com.

### Screenshot (395 left) — Transportation tab
- "Bus 2345" (large, blue); Driver: Sami Ali; Supervisor: Abeer Ahmed; divider; two cards: **Morning Pickup** — 7:15 am — Building 12, Street 45, Fifth Settlement, New Cairo; **Afternoon Drop-Off** — 3:45 pm — Building 55, Street 10, El Tagamoa El 5, New Cairo (location-pin icons, right-aligned times).

### Screenshots (393 / 395 right) — Requests tab (populated)
- "Change Details" header + date "Sunday, June 1, 2026".
- **Current Trip** card: "Building 12, Street 45, Fifth Settlement, New Cairo" / "Bus 05 - Al Narges Route"; green tag "Afternoon Trip Only". Swap ↕ arrow between cards.
- **Requested Trip** card: "Building 55, Street 10, El Tagamoa El 5, New Cairo"; orange "Pending Assignment"; yellow/orange left accent.
- **System Suggestion** panel (light yellow): lightbulb + "Based on the new address, we suggest switching to Bus 02 North Route…"; field **Assign New Bus*** dropdown ("Bus 02 North (Suggested)"); capacity meter "4 Seats Left … 75%" (orange bar).
- **Authorized Pickup Guardians:** guardian cards (Sara Mohamed Hussien / Mother — Primary Contact; and a "New"-tagged Sara Mohamed Hussien / New Guardian / 01234567789).
- **Footer:** **Reject Request** (red/outline, X) + **Approve Request** (green, check).

### Screenshot (396) — Requests tab EMPTY STATE
- Centered illustration (person with empty box + question mark), heading "No Available Requests", subtext "New requests will appear here once submitted". Requests tab has NO badge in empty state; no Edit button in this frame.

---

## Batch 2 — Screenshots 373–381 (Route Planning + Users Management tables)

### Screenshots (373–374) — Route Planning › Routes list (+ empty state)
- **Empty state (373 left):** title "Route Planning" + subtitle about AI analyzing student list; "Refresh Data" button. Large dashed card: robot/AI icon, "250 Students Ready for Route Planning", "AI is ready to optimize routes for maximum efficiency.", primary **"Configure & Plan Routes"**.
- **Populated (374):** subtitle "Routes successfully generated and optimized…"; buttons "Refresh Data" (outline) + **"Re-optimize Routes"** (dark). "Routes (15)" heading; search "Search by Bus no. or Driver name…"; filters Shift / Area / Status; **+ Add New Route**.
- **Table cols:** Route | Bus | Students | Distance | Est. Duration | Driver | Nanny stop | Status | Actions (eye+trash). Students shows progress bar (green 25/25, orange 22/25). Driver = avatar+name OR pink dashed **"+ Assign driver"** pill when unassigned. Nanny stop = name + address (2-line).
- **Samples:** R-01 / Bus 05 / 25/25 / 18 KM / 45 min / [Assign driver] / Abeer sayed, Shorouk Block 5 / **Incomplete** (pink). R-02 / Bus 06 / 22/25 / 25 KM / 30 min / Tarek Youssef / Dina Farouk, Narjes St 7 / **Ready** (green). R-05 / Bus 09 / 25/25 / 50 KM / 35 min / Karim Fathy / Mona Khalil / Ready.

### Screenshot (375) — Route Planning › Route Optimization Settings modal
- Title "Route Optimization Settings" + subtitle "Configure your fleet and arrival constraints…".
- **Student data source*** — two radio cards: "Use students from system / 625 students…" | "Upload new Excel file / …" (selected = blue border); selected shows dashed dropzone "Click to upload Excel file / .xlsx or .csv, Name + Address columns required".
- **Supervisors data source*** — two radio cards (Use from system / 24 supervisors | Upload Excel).
- Checkbox "Enable Multi-Shift Scheduling (Double-shifting) per driver" + helper.
- Row: **Number of Buses*** + **Seats per Bus***. Dashed **"+ Add more bus types"**. **School Arrival Deadline*** (e.g. 07:45 AM). Full-width primary **"Run AI Optimization"**.

### Screenshot (376) — Route Planning › Route Detail modal + Add New Route modal
- **Route 05 - Journey Details:** subtitle "New Cairo • Morning Shift • 25 Students". Cards row: Bus card (Bus 05 - Toyota Coaster / A B C 123 / 20/25 Seats occupied / 75%, orange bar, swap icon); "+ Assign Driver" dashed card; Supervisor card ("Assigned (1/2)", Abeer Ahmed / Narjas Route 01, swap). "Stops (12)" + "+ Add Student". Map with numbered stop pins (Stop 1 green start → Stop 12) + blue polyline + school marker; overlay "Estimated Duration: 45 Mins / Total Distance: 12 KM".
- **Add new route:** subtitle "Create a manual route — assign bus, stops, and students"; blue info banner "Selecting a supervisor sets her home as Stop 1…". Section "Route info*": Route ID (R-16), Bus* dropdown, Shift* dropdown. "Crew Assignment*": Select driver*, Select supervisor*. "Route Path & Passengers*": Select students* (+ "Clear all"), search. Map preview + overlay. Footer Cancel + **Save Route**.

### Screenshot (377) — Users Management › import/empty state
- Title "User Management" + subtitle "Add students, drivers, and supervisors to get your fleet started…". Pill tabs Students (active) | Drivers | Supervisors. Large dashed dropzone: "Drag and drop your file here / or click to browse", **"Upload File"** primary. "Before you upload:" numbered list (CSV/Excel only; one category per file; required fields filled).

### Screenshots (378–381) — Users Management › data tables (Students/Drivers/Supervisors)
- **Shared:** pill tabs Students | Drivers | Supervisors. Toolbar (default): "{X} Data" heading, Search, **Filter ▾**, **Upload File** (outline), **+ Add {X}** (primary). Table cols: `[checkbox] | Series | {Person} | Phone Number | Area | Route | Bus | Status | Actions (eye+trash)`. Pagination Previous · 01…10 · Next.
- **378 Students (default):** rows e.g. `1 / Samy Ahmed / 011234567890 / New Cairo / Al Narges / Bus 05 / Scheduled`; `3 / Hassan Salah / … / Bus 07 / Absent`; `6 / Sara Youssef / … / ---------- (no route) / Bus 10 / Unscheduled`. Badges: green Scheduled, pink Absent, yellow Unscheduled; missing route = dashed `----------`.
- **379 Students (selection mode):** toolbar swaps to Search / Filter / **Export** / **Delete All** (red); info bar "2 Item selected · Clear selection"; header + row checkboxes; selected rows highlighted. (Status labels variant: Attend / Absent / Unassigned.)
- **380 Drivers:** person col "Driver"; **+ Add Driver**. Status: green Active, gray Off-Duty, pink Absent.
- **381 Supervisors:** person col "Nanny"; **+ Add Supervisor**. Same status set.

---

## Component inventory (reusable primitives to build once)

- **AppHeader** — logo, breadcrumb, search, notification bell+badge, user chip+menu.
- **Sidebar** — icon nav, active highlight, red count badges, Settings + Sign Out footer.
- **KpiStatCard** — icon, title, big total, 1–2 sub-metrics with mini progress bar + %. (sparkline variant for Journey Logs.)
- **StatusBadge** — tone map: green (Ready/Scheduled/Active/Attend/On-time/Completed/In Service), pink-red (Incomplete/Absent/Issue/Breakdown), amber/yellow (Maintenance/Delayed/In progress/Unscheduled/Pending), gray (Off-Duty), blue (info).
- **DataTable** — checkbox select, sortable header, row actions (eye/trash/resolve/etc.), selection-mode toolbar (Export / Delete All), pagination (Previous · 01…N · Next). Shared by Buses, Users(3), Route Planning, Journey Logs, Bus Capacity.
- **Tabs** — underline tabs (Notifications) + count badges; segmented pill tabs (Users tables, modals); segmented toggle (Map / Journey Logs).
- **DonutChart** — inline SVG, center total + legend (Trips Status).
- **Sparkline** — inline SVG mini area/line (Journey Logs KPIs).
- **NotificationRow / TimelineStepper / JourneyCard / GuardianCard / PickupCard / SystemSuggestion** — list/detail widgets.
- **ProgressMeter** — labeled bar with threshold color (capacity, oil/tire health, seats-left).
- **Modal / Drawer** — form modals (Add Student/Driver/Supervisor/Bus/Route), profile modals (Student/Bus), settings modal; empty-state block.
- **MapPanel** — Google Maps placeholder for now (pins, route polyline, zoom, "Open Full Map"); real maps later.
- **FormField primitives** — labeled input, dropdown/select, date input, radio-card, checkbox, file dropzone, photo uploader.
- **Buttons** — primary (navy, +icon), outline, danger (red), success (green ✓), pill toggles.
- **Breadcrumb**, **SearchInput**, **FilterDropdown**, **EmptyState** (illustration + heading + subtext).

## Route map (Next App Router, under `[locale]/(dashboard)`)

- `/dashboard` — overview (364).
- `/notifications` — tabs Trips | Parent Requests | Shift Readiness (365–367).
- `/live-tracking` — Map (369/370) + `/live-tracking/journey-logs` (372) + bus detail (371, drawer or `/live-tracking/[bus]`).
- `/route-planning` — routes list + empty state (373/374); settings, route-detail, add-route modals (375/376).
- `/users` — tabs Students | Drivers | Supervisors (378–381); import (377); Add modals (382/383); Student Profile modal (393–396).
- `/buses` — list w/ 4 filter states (384–387); Bus Profile modal (388–390); Add Bus modal (390).
- `/settings` — (no dedicated screenshot; build a sensible shell).

**Data:** all screens run on a typed **mock-data layer** (`src/lib/mock/*`) until Phase 2–4 endpoints exist. Numbers mirror the design (20 buses, 24 drivers/supervisors, 625 students, 15 routes, 24 trips).
