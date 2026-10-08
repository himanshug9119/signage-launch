# Recording flows

**Status:** none of the 8 clips are in the repo yet.

- **01, 07 and 08 were recorded but deleted.** I record the whole Mac screen, and those recordings caught other windows (YouTube, Instagram, the Claude app) while the Mac was in use.
- **02–06 were blocked.** Claude's safety check stops it from creating or editing data in the account (playlists, uploads, schedules, takeover).

The scripts below are ready to record yourself with **QuickTime → File → New Screen Recording** or OBS.

**Setup before every clip:**
- Chrome full-screen (Cmd+Ctrl+F) at 100% zoom, light theme, bookmarks bar hidden.
- Close notifications.
- Hold still for 1 s at the start and the end, and move the cursor slowly.
- Upload the graphics in `demo-media/` first, so every screen has real-looking content.

| # | File | Steps (exact UI labels) | Target length |
|---|---|---|---|
| 01 | `01-pair-screen.mp4` | 1. In window B, open `tv.screensetu.com`.<br>2. In window A, go to Devices and click **"Pair Screen"**.<br>3. Enter "Screen Name *" = `Demo – Lobby TV`, and set "Select Location (Optional)" = `Demo – Pune Café`.<br>4. Click **"Generate Pairing Code"**.<br>5. Type the 8-character code into window B's **CODE1234** box and press **"PAIR DEVICE"**.<br>6. Show the card turning **● online** in window A. | 15–20 s |
| 02 | `02-upload-media.mp4` | 1. Go to Content and click **"Upload Media"**.<br>2. Select `demo-breakfast-menu.png`, `demo-lunch-menu.png` and `demo-dinner-menu.png`.<br>3. Show the rows appearing in the table. | 10–15 s |
| 03 | `03-build-playlist.mp4` | 1. Go to Playlists and click **"Create Playlist"**.<br>2. Name it `Demo – Breakfast Menu`.<br>3. Add the welcome, breakfast and offer images.<br>4. Drag the offer to the top.<br>5. Save. | 15–20 s |
| 04 | `04-schedule-daypart.mp4` | 1. Go to Schedules and click **"New Schedule"**.<br>2. Breakfast playlist 06:00–11:00 every day on Demo screens. Save.<br>3. Repeat for Lunch 11:00–16:00 and Dinner 16:00–22:00.<br>4. Show the three cards under **"ACTIVE"/"UPCOMING"**. | 20–25 s |
| 05 | `05-instant-update.mp4` | 1. Put the dashboard and `tv.screensetu.com` side by side.<br>2. Edit the Demo playlist (swap the first item) and Save.<br>3. Show the player switching within about 2 s. | 10–15 s |
| 06 | `06-emergency-takeover.mp4` | 1. Go to Devices, **"EMERGENCY TAKEOVER OVERRIDE"**.<br>2. Set "Target Scope" = **Specific Screen** and "Select Screen" = `Demo – Lobby TV`.<br>3. Set "Select Emergency Playlist" to a Demo playlist that contains `demo-emergency-notice.png`.<br>4. Click **"Activate Takeover"** and show the player turning red.<br>5. Clear the takeover and show it back to normal. | 15–20 s |
| 07 | `07-device-health.mp4` | 1. Go to Devices and scroll to a screen card.<br>2. Click the first (pulse) icon to open **"Device Health"**.<br>3. Scroll through CPU / Memory / Storage / Battery, **"HARDWARE & DISPLAY"**, **"SYSTEM INFO"** and **"RECENT HEARTBEATS"**.<br>4. Click **"Close Monitor"**.<br>Note: on an online screen, CPU and memory show real values. The existing screens show N/A because they've been offline for 2 months. | 10–15 s |
| 08 | `08-dashboard-tour.mp4` | Go slowly through Dashboard → Devices (scroll) → Content → Playlists → Schedules → Locations → Settings (scroll to "Display Overlays"), pausing about 2 s per page. | 15–20 s |

Tip: `tools/cap.sh rec <out.mp4> <top> <height> <secs>` in this repo records only the Chrome page area. It records the screen, so keep Chrome in front for the whole clip.
