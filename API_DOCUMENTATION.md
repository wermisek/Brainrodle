# 🧠 Brainrodle – Developer & API Documentation

## Table of Contents
1. Introduction
2. Quick Start
3. Project Structure
4. Public JavaScript APIs
   1. Daily Mode (`script.js`)
   2. Unlimited Mode (`unlimited.js`)
5. UI Components & DOM Structure
6. Styling Conventions (`styles.css`)
7. Extending Brainrodle
8. Frequently Asked Questions (FAQ)

---

## 1. Introduction
Brainrodle is a lightweight, dependency-free word-guessing game written in plain HTML, CSS & JavaScript. This document explains every **public** function, utility, and component so you can confidently extend, embed, or debug the game.

## 2. Quick Start
```bash
# Clone & serve (for example with live-server)
$ git clone <repo-url>
$ cd brainrodle
$ npx live-server  # or any static file server
```
Open `http://localhost:8080/index.html` for Daily Mode or `unlimited.html` for Unlimited Mode.

## 3. Project Structure
```text
├── index.html          # Daily mode page
├── unlimited.html      # Unlimited mode page
├── script.js           # Daily-mode logic & APIs
├── unlimited.js        # Unlimited-mode logic & APIs
├── styles.css          # Shared styles
├── README.md           # High-level overview (non-API)
└── API_DOCUMENTATION.md# ← you are here 🌟
```

## 4. Public JavaScript APIs
*All functions live inside a `DOMContentLoaded` callback so they are **not** exposed globally by default.*
If you need them from external scripts, explicitly re-export them, e.g.
```js
window.resetDailyGame = resetGame; // expose to global scope
```

### 4.1 Daily Mode – `script.js`
| Function | Parameters | Returns | Purpose |
|----------|------------|---------|---------|
| `showWordList()` | – | `void` | Render the full slang word list in the modal and open it. |
| `getWordDescription(word)` | `word: string` | `string` | Retrieve a friendly description for a given slang word. |
| `getDailyWord()` | – | `string` | Deterministically generate **today’s word** based on Warsaw time. |
| `getTimeUntilNextWord()` | – | `string` | Human-readable countdown until the next daily word. |
| `updateTimer()` | – | `void` | Refresh the countdown text inside the message container every second. |
| `checkIfPlayed()` | – | `boolean` | Returns `true` if the player has already completed today’s challenge. |
| `showMessage(msg, duration=2000)` | `msg: string`, `duration?: number` | `void` | Display a toast-style message (supports multi-line via `\n`). |
| `updateStats(won, attempts)` | `won: boolean`, `attempts: number` | `void` | Persist game outcome, streaks & distribution in `localStorage`. |
| `createGameBoard()` | – | `void` | (Re)build the HTML game board based on current word length. |
| `resetGame()` | – | `void` | Start a brand new daily game (used after midnight rollover). |
| `checkRow()` | – | `void` | Validate the current guess row, colour tiles, update keyboard & finish game if matched. |
| `insertLetter(letter)` | `letter: string` | `void` | Insert a single letter into the current tile. |
| `deleteLetter()` | – | `void` | Remove the last entered letter from the row. |
| `shakeRow()` | – | `void` | Apply a shake animation to the current row (invalid guess feedback). |
| `showStats()` | – | `void` | Open the statistics modal with win rate, streaks and last guesses. |

#### Daily Mode Usage Example
```html
<button id="skip">Skip to tomorrow</button>
<script type="module">
  import './script.js'; // ensures DOMContentLoaded logic runs
  document.getElementById('skip').onclick = () => {
    resetGame();          // reuse in-game API
    showMessage('New day, new word!');
  };
</script>
```

### 4.2 Unlimited Mode – `unlimited.js`
| Function | Parameters | Returns | Purpose |
|----------|------------|---------|---------|
| `getRandomWord()` | – | `string` | Return a random word from the shared slang dictionary. |
| `resetGame()` | – | `void` | Initialise a completely fresh unlimited-mode round. |
| `populateWordList()` | – | `void` | Render the side-panel word list. |
| `showMessage(msg, duration=2000)` | `msg: string`, `duration?: number` | `void` | Same as daily mode. |
| `showStats()` | – | `void` | Display unlimited-mode statistics (win rate, streak, last game layout). |
| `updateStats(won)` | `won: boolean` | `void` | Persist unlimited stats to `localStorage`. |
| `insertLetter(letter)` | `letter: string` | `void` | Add a letter to the active tile. |
| `deleteLetter()` | – | `void` | Remove last letter in the active tile. |
| `shakeRow()` | – | `void` | Shake animation for invalid guesses. |
| `checkRow()` | – | `void` | Validate current guess against `currentWord`. |

#### Unlimited Mode Usage Example
```js
// Start a new word without full page reload
resetGame();
showMessage('Fresh word loaded!');
```

## 5. UI Components & DOM Structure
| Selector / Element | File | Description |
|--------------------|------|-------------|
| `#game-board` | `index.html`, `unlimited.html` | Container holding 6 `.letter-row` divs dynamically generated by JS. |
| `.letter-row` | generated | Flex row containing `.letter-box` tiles. |
| `.letter-box` | generated | Individual square tile that turns 🟩/🟨/⬛ based on guess feedback. |
| `.keyboard-row` | HTML | On-screen keyboard rows. Buttons have `data-key` attributes. |
| `#message-container` | HTML | Toast-style overlay for messages & countdown. |
| `.stats-modal` | HTML | Pop-up modal with aggregated game statistics. |
| `#words-modal` | HTML | Modal containing detailed word list with descriptions (daily mode). |
| `.word-list-panel` | HTML | Slide-out panel with plain word list (unlimited mode). |

Refer to the actual HTML files for full markup and IDs.

## 6. Styling Conventions (`styles.css`)
* CSS variables define the neon colour palette (`--neon-green`, `--neon-pink`, …).
* Utility classes: `.glitch`, `.hidden`, `.fade-in` control animations.
* Mobile breakpoints start at **max-width: 768 px**.

Feel free to override variables or extend classes; all animations use standard `@keyframes` so no external libraries are needed.

## 7. Extending Brainrodle
1. **Add new words**: Edit the `WORDS` array in both JS files. Keep them uppercase!
2. **Custom word length**: `createGameBoard()` and `resetGame()` automatically adapt to the *current word’s length*.
3. **Expose APIs globally** if you plan to control the game from other scripts, e.g. bots or integration tests.
4. **Styling**: Append new classes/variables in `styles.css`; components use semantic class names.

## 8. FAQ
| Question | Answer |
|----------|--------|
| *How do I clear saved stats?* | `localStorage.removeItem('brainrodle_stats'); localStorage.removeItem('brainrodle_unlimited_stats');` in DevTools. |
| *How to disable anti-cheat console blocks?* | Uncomment the immediately-invoked function at the top of `unlimited.js`, or remove it entirely. |
| *Can I embed Brainrodle as an iframe?* | Yes – host the files and embed with `<iframe src="/index.html" …></iframe>`; ensure same-origin to keep `localStorage` working. |

---
Happy hacking 💜