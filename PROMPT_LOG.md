# Prompt Log

Major prompts used to build Profilr™ with Claude Code (agentic prompt engineering), copied verbatim.
Small operational prompts (restart the server, questions, confirmations) are left out.
Times are IST (UTC+5:30), 17 Oct 2026.

## Prompt 1: Master prompt

**Time:** 2026-10-17 11:38 IST  
**What changed:** Full spec (18 features, demo mode, README, prompt log, git). Interrupted while planning to save time; only the folder was inspected, nothing was written. Superseded by Prompt 2.

````text
ROLE
You are a senior front-end engineer building a satirical "worst UX ever" demo for a hackathon, working inside my existing Git repo.

GOAL
Build an "Edit Your Profile" experience for a fictional social app "Profilr™". Every element technically works but is maximally infuriating. The user should ALMOST finish, then lose everything.

HARD CONSTRAINTS
1. Exactly 2 pages: index.html (profile editor) and saved.html (save result). Shared style.css and script.js. Vanilla HTML/CSS/JS only: no frameworks, libraries, build step or network calls. Must run by double-clicking index.html.
2. Each feature is its own function (initCookieHydra(), initRunawaySave(), ...) wrapped in try/catch, so one broken feature never breaks the others.
3. Harmless parody: no real data stored or sent, no flashing faster than 3x/sec, no browser locking (no alert loops, no beforeunload traps), no CPU-heavy loops.
4. Annoying but beatable: every feature can be completed with persistence.
5. Original branding only; no real company names or logos.
6. At first glance it must look like a polished, modern SaaS settings page (clean cards, nice font), so the rage hits harder.
7. The repo already contains sound-effect files. Do NOT modify, move, rename or delete any existing files you didn't create.

FEATURES — index.html
1. Rage-O-Meter: fixed top bar. Every failed or annoying event adds +5%. Labels change: Calm 😌 → Annoyed 😤 → Fuming 🤬 → Laptop-Yeeting 💻🚀.
2. Fake loader: "Preparing your experience…" bar climbs to 99%, drops to 12%, then completes. Max 6 seconds.
3. Hydra cookie banner: "Accept All" is huge. "Reject" is tiny grey text. Each Reject spawns 2 more banners at random positions ("Are you sure?", "Really sure?"), capped at 8, then shows "We accepted for you ❤️".
4. Name field: physical typing is blocked. An on-screen A–Z keyboard reshuffles its key positions after every press. Backspace deletes 2 characters.
5. Email field: on blur, "helpful" autocorrect changes gmail.com → gmial.com and .com → .co. The validation message alternates between "Email must be lowercase" and "Email must contain an uppercase letter".
6. Phone number: set only via a slider from 0 to 9,999,999,999 (step 1). There are +1/−1 fine-tune buttons, but −1 secretly adds 1 30% of the time.
7. Date of birth: starts at today. Only two buttons: "−1 day" and "+1 year".
8. Password game: rules appear one at a time as each is satisfied. ≥8 chars → uppercase → a number → digits sum to 25 → contains the current hour (24h) → an emoji → the word "please" → the name of the birth month from the DOB field. The strength meter reads "Weak 😬" until every rule passes, then "Mediocre". Confirm-password blocks paste with the toast "Pasting is cheating 🤨".
9. Profile photo: the upload button jumps to a random corner on hover (first 3 times only). The uploaded image shows rotated 90°, mirrored and "deep-fried" (CSS saturate/contrast). A "Crop" button zooms to 400%.
10. Bio: the character limit shrinks every 5s (280 → 140 → 69). Overflow is deleted from the START of the text.
11. Country dropdown: 40 options in random order. "India" appears 5 times with lookalike spellings (lndia, Indla, Inida, India.). Only one is valid. A wrong pick shows "Country not found".
12. "I'm not a robot": the checkbox unchecks itself after 2s. On the 3rd tick it says "Too fast. Robots are fast." and opens a 3×3 CAPTCHA titled "Select all squares containing emotional damage" with abstract tiles. Every answer is "Incorrect" until the 3rd attempt, which passes.
13. Terms & Conditions: you must scroll to the bottom, but the box appends more paragraphs as you near the bottom (3 times) before the checkbox enables. Label: "Uncheck this box if you do not wish to not agree."
14. Swapped buttons: "Delete Account" is the big blue primary button. It opens a fake confirmation and is harmless. "Save" is small grey text that runs from the cursor (moves when it comes within 80px), then gives up after 5 dodges with "fine 🙄".
15. Inactivity punishment: after 15s with no input, the form shakes and the focused field is cleared. Toast: "Session refreshed for your security 🔒".
16. Mascot "Blobby" (an original CSS blob character): pops up every ~20s with useless advice ("Have you tried typing faster?", "87% of users finished by now"). Its ✕ opens "Are you sure you want to close help?" with Yes/No positions swapped.
17. Dark-mode toggle: each click makes the page 20% darker. At full black it shows "Dark mode enabled ✅" in black text. After 3s it switches to a blinding yellow "light mode" with a smooth transition (no flashing).

FEATURE — saved.html
18. A successful Save navigates to saved.html, passing rage %, failed attempts and seconds spent as URL params. The page shows "Saving… estimated time: 3 years" with a bar that reaches 99%, then an "Error 418: Your profile is a teapot ☕. All changes have been discarded." card. The card includes a Rage Report (final rage %, failed attempts, time wasted). Its only button, "OK 😊", returns to a completely fresh index.html, cookie banner included.

DEMO MODE (for screen recording)
On index.html, Ctrl+Shift+D toggles a small hidden panel listing features 1–17. Each has a button to jump to it or trigger it instantly, skipping timers.

SOUND HOOKS (sounds get added in a later prompt)
In script.js create an SFX map (event → file path, empty for now) and playSfx(event), which is a silent no-op when no file is mapped and never throws. Unlock audio on the first user click. Call playSfx() at these events: keyPress, reject, error, captchaFail, dodge, toast, rageLevelUp, darkMode, saving, teapot.

README.md
Write a concise README with:
- Title and one-line pitch.
- Demo video placeholder.
- How to run.
- A feature table (# | Feature | How to trigger | Why it's infuriating).
- Demo Mode shortcut.
- File structure.
- Tech and constraints.
- A "How we built it" section (agentic prompt engineering: master prompt, then targeted per-feature fix prompts).
- A parody/harmless disclaimer.
- A team placeholder.

PROMPT LOG
Maintain PROMPT_LOG.md. Append each of my prompts verbatim with a timestamp and a one-line summary of what you changed.

ACCEPTANCE CRITERIA
- Zero console errors on both pages.
- Every feature triggers and is beatable.
- The full flow, from load to Error 418 to a fresh index.html, works end to end.
- No horizontal scroll at 1366×768 or 1920×1080.

GIT
After the build meets the acceptance criteria, stage only the files you created, commit "feat: ragebait profile page base build", and push to the current branch's remote. Commit and push again after every later change with a short conventional message. Never force-push or rewrite history. If a push fails, stop and show me the exact error.

PROCESS
First reply with a 5-line plan and the list of init functions. Then write all files. Finish with a one-line "how to trigger" for each feature, plus the push result.
````

## Prompt 2: Fast build prompt

**Time:** 2026-10-17 11:59 IST  
**What changed:** Built index.html, saved.html, style.css and script.js: 12 features, each in its own try/catch-wrapped init function, plus a no-op playSfx().

````text
Do NOT plan or explain. Write files immediately, one at a time. Vanilla HTML/CSS/JS, no libraries. Exactly 2 pages: index.html and saved.html, plus style.css and script.js. Don't touch existing files. Each feature in its own function wrapped in try/catch. Clean modern SaaS look for a fake app "Profilr™". Harmless: no flashing, no alert loops.

index.html, an "Edit Profile" page with:
1. Rage-O-Meter top bar: +5% per failed action. Labels: Calm → Annoyed → Fuming → Laptop-Yeeting.
2. Cookie banner: huge Accept, tiny Reject. Each Reject spawns 2 more banners (max 8), then "We accepted for you ❤️".
3. Name: typing blocked. On-screen A–Z keyboard reshuffles after every press. Backspace deletes 2 chars.
4. Email: on blur, gmail.com becomes gmial.com.
5. Phone: slider 0–9999999999 only.
6. DOB: starts today. Only "−1 day" and "+1 year" buttons.
7. Password rules appear one by one: 8+ chars → uppercase → number → digits sum to 25 → an emoji → the word "please". Strength meter always says "Weak 😬".
8. "I'm not a robot" checkbox unchecks itself after 2s. Works on the 3rd try with "Too fast. Robots are fast."
9. T&C box adds more text whenever you scroll near the bottom (3 times), then its checkbox enables.
10. "Delete Account" is the big blue button (fake confirm). "Save" is small grey text that runs from the cursor 5 times, then says "fine 🙄".
11. Dark-mode toggle: each click darkens the page 20%. At black, it switches to blinding yellow after 3s.

saved.html:
12. "Saving… estimated time: 3 years" bar reaches 99%, then "Error 418: Your profile is a teapot ☕. All changes discarded." with a rage % taken from a URL param. The OK button returns to a fresh index.html.

Also define playSfx(name) as an empty no-op (sounds come later).
````

## Prompt 3: Vine boom on click

**Time:** 2026-10-17 12:05 IST  
**What changed:** Mapped the vine-boom mp3 to playSfx('click') and played it on every click on both pages.

````text
WHenever I click on page i want you to play the vine-boom sound effect file , add it to playsfx in that manner
````

## Prompt 4: Dry fart on typing

**Time:** 2026-10-17 12:07 IST  
**What changed:** Mapped the dry-fart mp3 to playSfx('keyPress') for every keystroke in any field; fixed URL encoding for the '#' in its filename.

````text
while typing anything anywhere for ex. email , I want dry fart sound
````
