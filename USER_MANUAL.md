# Space Math — User Manual (for parents)

Space Math is a math practice game for children aged about **7–8 and up** (roughly Grade 2–3).
It runs in a web browser, **works without internet once set up**, and can be added to the Home Screen
of an iPhone, iPad or Android device like a normal app.

---

## Contents

1. [What's in the game](#1-whats-in-the-game)
2. [Quick start on a Mac (no internet setup needed)](#2-quick-start-on-a-mac)
3. [Quick start on Windows](#3-quick-start-on-windows)
4. [Put the app online — free (needed for iPhone, iPad and Android)](#4-put-the-app-online--free)
5. [Install on iPhone / iPad](#5-install-on-iphone--ipad)
6. [Install on an Android phone or tablet](#6-install-on-an-android-phone-or-tablet)
7. [Check that it works offline](#7-check-that-it-works-offline)
8. [Using more than one device](#8-using-more-than-one-device)
9. [Voice and sound settings](#9-voice-and-sound-settings)
10. [Managing players](#10-managing-players)
11. [Updating the app](#11-updating-the-app)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. What's in the game

There are **16 levels**, shown as planets on a star map. Each level has **10 questions**: the first 5 are easier
and the last 5 are harder.

| # | Level | Example |
|---|-------|---------|
| 1 | Warm-up (add & take away to 20) | 8 + 5 = 13 |
| 2 | Missing Number | 7 + ? = 15 |
| 3 | Tens & Ones (place value) | 4 rods + 7 cubes = 47 |
| 4 | Bigger or Smaller (< = >) | 482 > 428 |
| 5 | Number Patterns (skip counting) | 35, 40, ?, 50 |
| 6 | Space Time (reading a clock) | quarter past 3 |
| 7 | Big Adding (2-digit) | 34 + 25 |
| 8 | Carry the Ten | 47 + 38 |
| 9 | Big Take Away (2-digit) | 68 − 25 |
| 10 | Swap a Ten (borrowing) | 52 − 27 |
| 11 | Hundreds Hop | 380 + 50 |
| 12 | Equal Groups (start of ×) | 3 groups of 4 |
| 13 | Times 2, 5, 10 | 7 × 5 |
| 14 | Times 3 & 4 | 6 × 4 |
| 15 | Fair Shares (start of ÷) | 12 shared by 3 |
| 16 | Space Stories (two-step word problems) | read aloud |

**How it plays:**

- Everything is **read aloud**, and the words are also shown at the bottom of the screen as **subtitles**.
  Tap 🔊 or the subtitle bar to hear it again.
- Levels 1–6 and 12 use **3 big answer buttons**. The other levels use an on-screen **number pad**.
- A wrong answer shows a **hint** and gives one more try. After two misses, the game **explains the answer**
  step by step and moves on.
- **Stars** count answers that were right on the *first* try. 9–10 right earns ★★★, 7–8 earns ★★, and
  5–6 earns ★. **One star opens the next planet.**

---

## 2. Quick start on a Mac

This runs the game from the folder on your Mac. You don't need to put it online.

1. Open the **Terminal** app (press ⌘ Space, type *Terminal*, press Return).
2. Type `cd ` (with a space after it), then **drag the Space Math folder (the one with `index.html` inside)** into the Terminal window
   and press Return.
3. Type the following and press Return:
   ```
   python3 -m http.server 8000
   ```
4. Open **Safari** or **Chrome** and go to **http://localhost:8000**.
5. Make it an app (optional):
   - **Safari:** menu **File → Add to Dock**.
   - **Chrome:** click the **install icon** at the right end of the address bar.

After the first visit, the game is saved on the Mac and works offline. It still opens even when the
Terminal command isn't running. To stop the command, press **Ctrl + C** in Terminal.

> ⚠️ Double-clicking `index.html` does **not** work, because browsers block apps opened straight from a file.
> Use one of the methods above or the online link.

---

## 3. Quick start on Windows

The easiest way is to put the app online ([section 4](#4-put-the-app-online--free)) and open the link in
**Edge** or **Chrome**. Then install it:

- **Edge:** click **⋯ → Apps → Install this site as an app**, or click the "App available" icon in the address bar.
- **Chrome:** click **⋮ → Cast, save and share → Install page as app**, or click the install icon in the address bar.

*Alternative (no hosting):* install Python from python.org. Open the game folder in File Explorer, type `cmd`
in the address bar and press Enter. Then run `py -m http.server 8000` and open **http://localhost:8000**.

---

## 4. Put the app online — free

iPhones, iPads and Android devices need the app to come from a secure (**https**) web address **once**.
After that first visit, they keep their own copy and work offline. All three services below are **free**,
work for **any number of devices**, and this app is tiny (well under 1 MB), so it stays far inside every
free limit. Pick whichever is easiest for you. You only need **one**.

| | Netlify | GitHub Pages | Cloudflare Pages |
|---|---|---|---|
| Free account needed | Yes (for a permanent link) | Yes | Yes |
| How you upload | Drag & drop the folder | Upload files in the browser | Drag & drop the folder |
| Setup time | ~3 min | ~10 min | ~5 min |
| Link looks like | `your-name.netlify.app` | `username.github.io/orbit-5e5ag` | `your-name.pages.dev` |
| Updating later | Drag the folder again | Upload the changed files again | Upload the folder again |

> The exact button names on these websites change from time to time. If something looks slightly
> different, look for a similarly named option.

### Option A — Netlify (easiest)

1. Go to **https://app.netlify.com/signup** and create a free account (email, Google or GitHub).
2. After signing in, choose **Add new project → Deploy manually** (or go to **https://app.netlify.com/drop**).
3. **Drag the whole Space Math folder** onto the page.
4. Wait a few seconds. You get a link like `https://random-words-123.netlify.app`.
5. *(Optional)* Give it a nicer name: **Project configuration → Change project name**, for example `orbit-5e5ag`.
6. Open the link on each device (sections 5–6).

> Without an account, Netlify Drop only keeps the site for about an hour. Sign up so the link stays.

**To update later:** open your project → **Deploys**, then drag the folder onto the drop area.

### Option B — GitHub Pages

1. Create a free account at **https://github.com/signup**.
2. Click **+ → New repository**. Give it a **hard-to-guess name** such as `orbit-5e5ag`, choose **Public**
   (free accounts can only publish public repositories), then click **Create repository**.
   > 🔒 **Keeping it private:** the name becomes part of the link, so a random-looking name keeps the game
   > unlisted. Don't post the link anywhere public. The app already tells search engines not to list it.
   > No players or stars are ever uploaded; they stay on each device.
3. On the new page, click **uploading an existing file**.
4. Open the Space Math folder (the one with `index.html` inside) in Finder or File Explorer. Select **everything inside it** (files *and*
   folders: `index.html`, `css`, `js`, `icons`, …) and drag it onto the upload page. Click **Commit changes**.
5. Go to **Settings → Pages**. Under **Build and deployment → Source**, pick **Deploy from a branch**,
   choose **main** and **/ (root)**, then click **Save**.
6. Wait 1–2 minutes and refresh. The page shows your link, for example `https://yourname.github.io/orbit-5e5ag/`.

**To update later:** in the repository, click **Add file → Upload files**, drag in the changed files and
folders, then click **Commit changes**.

### Option C — Cloudflare Pages

1. Create a free account at **https://dash.cloudflare.com/sign-up**.
2. In the dashboard, open **Workers & Pages → Create → Pages → Upload assets** (sometimes shown as "Drag and drop your files").
3. Type a project name, e.g. `space-math`, and click **Create project**.
4. **Drag the Space Math folder (the one with `index.html` inside)** in and click **Deploy site**.
5. Your link is `https://space-math.pages.dev` (or similar).

**To update later:** open the project → **Create deployment** (or "Upload new version") → drag the folder again.

---

## 5. Install on iPhone / iPad

1. Open your app link in **Safari**. Other browsers on iPhone can't install apps properly.
2. Tap the **Share** button (the square with an arrow pointing up).
3. Scroll down and tap **Add to Home Screen**. If you see **Open as Web App**, leave it on. Tap **Add**.
4. Open **Space Math from the Home Screen icon** once while online, and wait about 5 seconds.
5. Done! It now works offline.

> **Important on iPhone/iPad:** the Home Screen app keeps its own players and stars, separate from a Safari tab.
> Always play from the **Home Screen icon**.

---

## 6. Install on an Android phone or tablet

1. Open your app link in **Chrome**.
2. Tap **⋮** (top right), then tap **Install app** or **Add to Home screen**.
3. Open it from the Home screen once while online.

---

## 7. Check that it works offline

1. Turn on **Airplane mode** (or turn off Wi-Fi).
2. Open Space Math from the Home Screen or Dock.
3. Play a level. Everything should work, including the voice.

You can also check in the app: on the **Who's playing?** screen, **press and hold "Grown-ups"** →
**Offline & updates**. It should say **"✅ Ready to play offline on this device."**

---

## 8. Using more than one device

- Every device uses the **same link**. Set it up once per device (sections 5–6).
- Each device keeps **its own players and stars**. Progress doesn't move between devices,
  so a child playing on the iPad and the iPhone has separate stars on each.
- Several children can share one device. Each makes their own player (section 10).

---

## 9. Voice and sound settings

Open the settings: on **Who's playing?**, **press and hold "Grown-ups"** → **Sound & voice**.

- **Read aloud (voice)** — turn the voice on or off. Subtitles always show.
- **Sound effects** — the little chimes.
- **Voice** — pick which voice reads, then tap **▶ Test voice**.

**Getting a nicer voice (free, works offline):**

- **iPhone / iPad:** Settings → Accessibility → Spoken Content → Voices → English → choose a voice marked
  *Enhanced* or *Premium* and download it. Then pick it in the app's Voice list.
- **Mac:** System Settings → Accessibility → Spoken Content → System voice → Manage Voices.
- **Windows:** Settings → Time & language → Speech → Manage voices → Add voices.
  In Chrome, prefer voices named **Microsoft …**. Voices named **Google …** need internet.

---

## 10. Managing players

- **Add a player:** on **Who's playing?**, tap **+ New player**, type a name, pick a picture and a color, then tap **Create**.
- **Delete a player:** **press and hold** their card, then confirm.
  Or go to **Grown-ups → Players → Delete**.
- **Reset a player's stars:** **Grown-ups → Players → Reset stars**.

Up to 8 players per device.

---

## 11. Updating the app

When a new version of the game files is ready:

1. Upload the new folder to your host, the same way as before (section 4).
2. On each device, **open the app once while online**. It downloads the update in the background and switches
   to it the next time you change screens. It never interrupts a level.
3. To force it: **Grown-ups → Offline & updates → ⟳ Check for updates**.

The version number is shown on that same page. Players and stars are kept across updates.

---

## 12. Troubleshooting

| Problem | What to try |
|---|---|
| **No voice on iPhone/iPad** | Check the **silent switch / Silent mode** and the volume. Make sure **Read aloud** is on in Grown-ups. Tap 🔊 to replay. |
| **No voice at all** | Some browsers have no built-in voice. The subtitles still show. Try Safari, Chrome or Edge, or install a voice (section 9). |
| **"Not ready for offline yet"** | Open the app from its **https link** (or `http://localhost:8000` on a computer) while online, wait a few seconds, then reload once. |
| **Blank page** | Make sure you didn't open `index.html` by double-clicking it (section 2). Close the app completely and reopen it while online. |
| **Stars disappeared** | Clearing browser data (e.g. Safari → *Clear History and Website Data*) erases them. On iPhone/iPad, check you opened the **Home Screen icon**, not a Safari tab. |
| **Old version still showing** | Open the app online, then use **Grown-ups → ⟳ Check for updates**. |
| **A level is locked** | Earn at least one star on the planet before it, which means 5 answers right on the first try. |
