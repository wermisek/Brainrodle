## Brainrodle Daily Mode API (script.js)

This document describes the public-facing functions, events, storage schema, and UI hooks used by the Daily Mode implementation in `script.js`.

### Overview
Daily mode presents one word per day based on Europe/Warsaw time. Players get 6 attempts. The board size adapts to the length of the daily word. Core logic initializes on `DOMContentLoaded`.

### Initialization
- Attaches mobile menu toggles and outside-click behavior
- Initializes stats from `localStorage`
- Binds word list modal controls
- Creates the game board for the current word length
- If the player already played today, shows a live countdown until next day and displays last guesses

### Public Behavior and Events
- Keyboard input: letter keys A–Z insert tiles; Enter submits; Backspace deletes
- On-screen keyboard: `[data-key]` buttons emulate the same
- Stats button (`.stats-button`) opens the statistics modal
- Word list button (`#viewWordsBtn`) opens the word list modal

### Functions
- `getDailyWord(): string`
  - Deterministically selects the day’s word using Warsaw time as a seed over the `WORDS` list.
- `getTimeUntilNextWord(): string`
  - Returns a human-readable `xh ym zs` string until midnight Warsaw time.
- `updateTimer(): void`
  - Updates countdown UI; when in played state, also shows prior guesses.
- `checkIfPlayed(): boolean`
  - Determines if the user has already played today; sets up timer if so.
- `showMessage(message: string, duration = 2000): void`
  - Displays a transient or persistent message in `#message-container`.
- `updateStats(won: boolean, attempts: 1..6): void`
  - Updates daily statistics, streak logic, and guess distribution; persists to `localStorage`.
- `createGameBoard(): void`
  - Builds a 6-row board sized to the current word length.
- `resetGame(): void`
  - Regenerates the daily word, resets state, board, and keyboard colors.
- `checkRow(): void`
  - Validates a submitted guess against the word list and marks tiles as `correct`, `present`, or `absent`. Ends game on win/lose and updates stats.
- `insertLetter(letter: string): void`
  - Inserts a letter into the current row if space remains.
- `deleteLetter(): void`
  - Removes the last letter from the current row.
- `shakeRow(): void`
  - Adds a temporary `shake` class to the current row (invalid actions feedback).
- `showStats(): void`
  - Renders and displays the Statistics modal for daily mode.

### Data and State
- `WORDS: string[]`
  - Slang and internet culture words; must contain uppercase entries.
- Game state (internal): `currentRow`, `currentTile`, `isGameOver`, `currentWord`, `gameBoard`

### Local Storage Schema
- Key: `brainrodle_stats`
```
{
  gamesPlayed: number,
  gamesWon: number,
  currentStreak: number,
  maxStreak: number,
  lastPlayedDate: string | null,  // ISO yyyy-mm-dd in Warsaw time
  lastGuesses: string[],          // Visualized guesses with emojis
  guessDistribution: { 1: number, 2: number, 3: number, 4: number, 5: number, 6: number }
}
```
- Default values are applied and missing fields are merged on load.

### DOM Structure and CSS Hooks
- `#game-board` contains 6 `.letter-row` rows of `.letter-box` tiles sized to the word length.
- Keyboard buttons are `[data-key]` with special keys `ENTER` and `DELETE`.
- Tile classes applied by checking:
  - `correct` (right letter and position)
  - `present` (letter exists elsewhere)
  - `absent` (letter not in word)
- Keyboard color hints via inline `style.backgroundColor` updates matching tile states.

### Modals
- Word list modal: `#words-modal` with `.words-list` entries and `.close-button`.
- Stats modal: dynamically created `#stats-modal` with `#stats-container`.

### Anti-cheat Behaviors
- Disables context menu and common source/devtools shortcuts.
- Heuristically detects DevTools via window dimension checks and replaces `document.body` on detection.

### Usage Examples
- Submit a guess programmatically:
```js
// Fill N letters then submit
['B','A','S','E','D'].forEach(insertLetter);
checkRow();
```
- Show a persistent message until game end:
```js
showMessage('Good luck!', 0);
```

