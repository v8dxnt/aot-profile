# Profilr™ — The Worst "Edit Profile" Page Ever

> A polished-looking SaaS settings page where every field technically works and is maximally infuriating. You almost finish, then lose everything.

## Demo video

_Add your demo video link here._

## How to run

- **Quickest:** double-click `index.html`.
- **For sound:** serve the folder (some browsers block audio on `file://`):
  ```bash
  python -m http.server 5173
  ```
  Then open http://localhost:5173/index.html.

## Features

| # | Feature | How to trigger | Why it's infuriating |
|---|---------|----------------|----------------------|
| 1 | Rage-O-Meter | Automatic | Every failed action adds +5%: Calm 😌 → Annoyed 😤 → Fuming 🤬 → Laptop-Yeeting 💻🚀 |
| 2 | Hydra cookie banner | Click the tiny "reject" | Each reject spawns 2 more banners (max 8), then "We accepted for you ❤️" |
| 3 | Name keyboard | Type in Name, or use the on-screen keys | Physical typing is blocked, keys reshuffle after every press, ⌫ deletes 2 characters |
| 4 | Email autocorrect | Type `you@gmail.com`, click away | "Helpfully" changes gmail.com → gmial.com (gives up after 3 tries) |
| 5 | Phone slider | Drag the slider | 0 to 9,999,999,999, step 1. Good luck. |
| 6 | Date of birth | "−1 day" / "+1 year" buttons | Starts at today. Going back 25 years takes ~9,000 clicks. |
| 7 | Password game | Type a password | Rules appear one by one (8+ chars → uppercase → number → digits sum to 25 → "please"). Strength stays "Weak 😬". Try `Abcdefg997please`. |
| 8 | "I'm not a robot" | Tick the checkbox | Unchecks itself after 2s; the 3rd try says "Too fast. Robots are fast." then passes |
| 9 | Infinite T&C | Scroll the terms box | Adds more text near the bottom 3 times before the checkbox enables. "Uncheck this box if you do not wish to not agree." |
| 10 | Swapped buttons | Click "Delete Account" / chase "Save" | Delete is the big blue button (fake, harmless). Save is grey text that runs from the cursor 5 times, then "fine 🙄" |
| 11 | Dark mode | Click "Dark mode" 5 times | Each click darkens 20%. At full black, it fades to blinding yellow after 3s. |
| 12 | Rage-gated Save | Click Save | Refuses with "You're not angry enough to save yet 😌" (+5% rage each time) until the Rage-O-Meter hits 100%, then shows an "Account info saved ✅" popup. Nothing is actually stored. |
| 🔊 | Sound effects | Click / type anywhere | Vine boom on every click, dry fart on every keystroke |

## File structure

```
index.html   Profile editor (all features)
saved.html   "Error 418: Your profile is a teapot ☕" page (currently not linked)
style.css    Shared styles
script.js    All features, one init function each, plus playSfx()
*.mp3        Sound effects (vine boom, dry fart)
PROMPT_LOG.md  Major prompts used to build it, verbatim
```

## Tech and constraints

- Vanilla HTML, CSS and JS. No frameworks, libraries, build step or network calls.
- Each feature is its own function (`initCookieHydra()`, `initRunawaySave()`, …) run inside try/catch, so one broken feature never breaks the others.
- `playSfx(event)` looks up an `SFX` map and stays silent when no file is mapped.
- Harmless by design: no data stored or sent, no flashing, no alert loops, no `beforeunload` traps. Every feature is beatable.

## How we built it

Agentic prompt engineering with Claude Code: one master prompt defined the pages, constraints and every feature, then short targeted prompts handled fixes and additions (sound effects, removing the untypable emoji password rule, rage-gated save). Every major prompt is logged verbatim in [PROMPT_LOG.md](PROMPT_LOG.md).

## Disclaimer

Profilr™ is a fictional product and a parody of bad UX. No real company, data or account is involved. Nothing you enter leaves your browser.

## Team

_Add team member names here._
