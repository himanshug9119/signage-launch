# ScreenSetu dashboard: page documentation

- **Base URL:** `https://screensetu.com/app`. The dashboard lives under the marketing domain, not app.* or dashboard.*.
- **Layout:** a left sidebar (logo "ScreenSetu", nav, "Logout", footer "Console version v1.9.0"). The top bar has the page title, a light/dark toggle ("Switch to light mode") and an avatar menu ("SC").
- **Theme:** the default theme observed was **dark**. A light mode is available through the toggle.
- **Capture date:** 9 Oct 2026. Quoted text in "…" is the exact UI wording.

---

## 1. Dashboard (overview): `/app`
**Purpose:** at-a-glance health of the whole signage network.

- **Alert banner:** "⚠️ Connection Alert: You have N display screen(s) offline for > 1h. Check network connection."
- **KPI cards:** "Screens Active" (e.g. "0/2"), "Locations Configured", "Playlists Created", "Active Rotations".
- **"RECENT UPLOADS" list:** file name, type ("VIDEO" / "IMAGE"), upload date.
- **"RECENT SCREENS" list:** screen name, status pill ("● OFFLINE" / "● ONLINE"), last-seen time.

**What a user does:** checks status, then jumps to the offline screens or the latest uploads.

## 2. Content (media library): `/app/content`
**Purpose:** upload and manage the images and videos that screens play.

- **Button:** "Upload Media".
- **Category filter:** "All Categories", "Images Only", "Videos Only", "Company Assets".
- **Sort:** "Newest First", "Oldest First", "Alphabetical".
- **Table columns:** "PREVIEW", "TITLE & DESCRIPTION", "CATEGORY", "SIZE". Rows show the media type (Video/Image), an optional "Company Asset" tag, the size and the MIME type (e.g. "video/mp4", "image/png").
- **Loading state:** "Loading content library…"

**Steps:** Upload Media → pick files → they appear in the table → use them in playlists.

## 3. Devices (screens): `/app/devices`
**Purpose:** pair, monitor and control every display. This page also holds Emergency Takeover.

- **Top buttons:**
  - "Download Player App" → `/download`
  - "Pair Screen", which opens the **"Pair New Screen"** modal:
    - "Screen Name *" (placeholder "e.g. DEL_Kaushambi_001", hint "Use a consistent name: CITY_Location_Number")
    - "Select Location (Optional)"
    - "Cancel" / "Generate Pairing Code"
- **"EMERGENCY TAKEOVER OVERRIDE" panel:**
  - Description: "Force an immediate playlist override on specific screens, locations, or company-wide. This bypasses all normal scheduling until cleared."
  - "Target Scope": "Specific Screen" / "Location" / "Company-wide (All Screens)"
  - "Select Screen" ("-- Choose Screen --")
  - "Select Emergency Playlist" ("-- Choose Playlist --")
  - Red button "Activate Takeover"
- **Screen list controls:**
  - Search "Search screens by name..."
  - Status filter "All Statuses" / "Online Only" / "Offline Only"
  - Sort "Sort by Name" / "Sort by Status" / "Sort by Last Seen"
  - "VIEW MODE:" "Grouped" / "Flat List"
  - "SELECT ALL (N items found)" checkbox for bulk actions
- **Grouped view:** sections per location with an "X / Y Online" count, plus "Unassigned Locations".
- **Location empty state:** "No screens in this location. Pair a screen or reassign one to this location directory to activate it."
- **Each screen card:** name, status ("● offline" / "● online"), "Seen: 2 months ago", a "LOCATION:" dropdown to reassign (e.g. "Unassigned" / "Delhi" / "Setu Café Lobby"), a storage figure (e.g. "3.8 GB"), and a preview thumbnail or "No Screen".

**Steps to pair:**
1. Click "Pair Screen", enter a name, optionally pick a location, and click "Generate Pairing Code".
2. On the display (APK or `https://tv.screensetu.com`), enter the 8-character code in the "CODE1234" box and submit.
3. The screen appears in the list.

## 4. Locations: `/app/locations`
**Purpose:** organise screens by site.

- **Button:** "Create Location".
- **Filter:** "All Locations", "Active Devices Only", "Empty Locations (No Devices)".
- **Table columns:** "LOCATION NAME", "DESCRIPTION", "ACTIVE DEVICES", "CREATED AT".

## 5. Playlists: `/app/playlists`
**Purpose:** build ordered sequences of media.

- **Button:** "Create Playlist".
- **Filter:** "All Playlists", "Active (In-use)", "Unused Only".
- **Cards:** name, description, "N Items", "Used in N schedules".
- There is a system playlist called "LIVE_PUBLISH" (description "live_publish"), which is created by the "publish now" flow.

## 6. Schedules (dayparting): `/app/schedules`
**Purpose:** decide what plays where and when.

- **Button:** "New Schedule".
- **Tabs:** "ALL", "ACTIVE", "UPCOMING", "EXPIRED".
- **Schedule cards show:**
  - the playlist name
  - a status chip ("ACTIVE" / "EXPIRED") and a priority ("⚡ PRIORITY 10")
  - the date range ("Aug 1, 12:27 AM → Ongoing")
  - a runtime note ("Scheduled — device offline" / "Ended 2 months ago")
  - the recurrence ("🕒 Every day (12:00 AM – 11:59 PM)")
  - the target screens ("💻 Cafe Main Display")

## 7. Users (team & roles): `/app/users`
**Purpose:** invite teammates with role-based access.

- **Button:** "Add User".
- **Empty state:** "👥 No team members. You are currently the only member in this company. Add teammates to collaborate!"
- The roles per the marketing site are Manager and Viewer. **Not opened:** the Add User form, since inviting a user was out of scope.

## 8. Settings: `/app/settings`
**Purpose:** company profile and on-screen overlays.

- **"ORGANIZATION PROFILE":** logo ("📷 Edit"), company name.
- **"General Information":**
  - "Company Name *"
  - "Contact Email *" ("This is your registered company email and can't be changed here.")
  - **"Snapshot Interval"**: "Off (On-demand only)" / "Every 1 minute" / "Every 5 minutes" / "Every 10 minutes" / "Every 30 minutes". Help text: "Configures how frequently screens automatically upload display snapshots to the dashboard."
- **"Headquarters Address":** Street Address, City, State / Province, Postal / Zip Code, Country.
- **"Display Overlays":** "Configure persistent logo bug watermark and scrolling ticker announcements broadcasted to all active displays."
  - "Logo Bug Overlay": "Render logo watermark on displays". "Logo Screen Corner Position": Top Left / Top Right / Bottom Left / Bottom Right.
  - "Text Ticker Overlay": "Broadcast scrolling text on displays", "Ticker Message Text", "Position" (Bottom Bar / Top Bar), "Crawl Speed" (Slow / Medium / Fast).
  - **"LIVE OVERLAY SCREEN PREVIEW":** a mock "DIGITAL SIGNAGE SCREEN" with the ticker "Welcome! Custom ticker announcement scrolling across digital signage screens."
- **Button:** "Save Profile". This was **not** clicked, per the safety rules.

## 9. Web player: `https://tv.screensetu.com`
- **Pairing screen:** "Enter the pairing code from your dashboard to connect this display", an input with placeholder "CODE1234", and the button "PAIR DEVICE".

## 10. Device card actions and the Device Health modal (`/app/devices`)
- **Each device card** has 4 icon buttons: health (pulse icon), live snapshot (eye), playlist, and remote control.
- **"Device Health" modal**, for example on "Cafe Main Display":
  - **Metric tiles:** "CPU UTILIZATION" (System Load), "MEMORY USAGE" (Active RAM), "STORAGE AVAILABLE" ("3.8 GB of 5.8 GB"), "BATTERY LEVEL" (On Battery)
  - **"HARDWARE & DISPLAY":** Manufacturer, Model, Android Version, Display
  - **"SYSTEM INFO":** App Version ("1.3.1+20"), Last Check-in, Screen ID
  - **"RECENT HEARTBEATS":** timestamped rows of CPU / Bat / PSS
  - **Button:** "Close Monitor"
- **Not opened:** the remote-control icon, since its commands (restart, clear cache) would act on a real device.

## 11. Not present in the dashboard nav
- **No Billing / Plan page** in the sidebar. The avatar menu ("SC ▾") wasn't explored.
- **No separate health page.** Health lives in the Device Health modal.

## 12. Bugs and UX notes found
1. **The theme toggle crashes the app.** Clicking "Switch to light mode" in the top bar showed **"Something went wrong. An unexpected error occurred… Cannot read properties of undefined (reading 'devices')"** with a "Reload page" button. Light mode does work when set before the page loads. See `screenshots/bug-light-mode-toggle-crash.png`.
2. **Light-mode contrast:** the sidebar footer "Console version v1.9.0" is almost invisible on the light background.
3. **The Pair Screen button sometimes needs a second click** before its modal opens; the same happened with "Create Location".
4. **Pairing direction may confuse users.** The dashboard generates the code and the TV types it in, which is the reverse of most signage apps. The marketing site's wording ("Launch the player app… It will automatically generate and show a unique 8-character pairing code") describes the opposite direction.
5. **The Connection Alert banner is permanent** while the two old test screens stay offline. Retire or relink them before filming.
6. **"Used in 1 schedules"** should read "Used in 1 schedule" (pluralisation on the playlist cards).
7. **Device Health shows "N/A"** for CPU, memory and battery on offline devices. It would read better as "—" or "Offline".

