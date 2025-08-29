## Brainrodle Unlimited Mode API (unlimited.js)

This document describes the functions, events, storage schema, and UI hooks used by the Unlimited Mode implementation in `unlimited.js`.

### Overview
Unlimited mode lets players play continuously with randomly selected words from the shared `WORDS` list. Board size adapts to the current word’s length. Core logic initializes on `DOMContentLoaded`.

### Initialization
- Attaches mobile menu toggles and outside-click behavior
- Initializes unlimited statistics from `localStorage`
- Creates game board sized to the random word
- Binds on-screen keyboard and physical keyboard controls
- Binds "New Word" button(s) to refresh for a new game
- Binds word list panel toggle and outside-click close

### Public Behavior and Events
- Keyboard: letter keys A–Z insert tiles; Enter submits; Backspace deletes
- When game is over, pressing Enter or clicking "New Word" reloads for a new round
- Word list button (`#viewWordsBtn`) toggles the slide-in word list panel
- Stats button (`.stats-button`) shows statistics via message overlay

### Functions
- `getRandomWord(): string`
  - Returns a random entry from `WORDS`.
- `resetGame(): void`
  - Resets state, selects a new word, rebuilds board and keyboard colors, clears messages and last guesses.
- `showMessage(message: string, duration = 2000): void`
  - Displays a transient message in `#message-container`. If `duration` is `0`, remains visible until changed.
- `showStats(): void`
  - Computes summary metrics and displays a stats message overlay.
- `updateStats(won: boolean): void`
  - Updates unlimited-mode statistics and captures the current board visualization to `lastGuesses`. Persists to storage.
- `insertLetter(letter: string): void`
  - Inserts a letter into the current row if space remains.
- `deleteLetter(): void`
  - Removes the last letter from the current row.
- `shakeRow(): void`
  - Adds temporary `shake` class to the current row for feedback.
- `checkRow(): void`
  - Validates a submitted guess against the `WORDS` list and marks tiles as `correct`, `present`, or `absent`. Ends game on win/lose and updates stats.
- `populateWordList(): void`
  - Fills the side panel with clickable word entries (display-only).

### Data and State
- `WORDS: string[]`
  - Shared slang terms; uppercase entries required.
- Game state (internal): `currentRow`, `currentTile`, `isGameOver`, `currentWord`, `wordLength`, `gameBoard`

### Local Storage Schema
- Key: `brainrodle_unlimited_stats`
```
{
  gamesPlayed: number,
  gamesWon: number,
  bestStreak: number,
  currentStreak: number,
  lastGuesses: string[]
}
```

### DOM Structure and CSS Hooks
- `#game-board` contains 6 `.letter-row` rows of `.letter-box` tiles sized to the word length.
- Keyboard buttons are `[data-key]` with special keys `ENTER` and `DELETE`.
- Tile classes applied by checking:
  - `correct` (right letter and position)
  - `present` (letter exists elsewhere)
  - `absent` (letter not in word)
- Keyboard color hints via inline `style.backgroundColor` updates matching tile states.
- Word list panel: `.word-list-panel` with `#word-list-content` entries; toggled with `#viewWordsBtn`.

### Anti-cheat Behaviors
- Disables context menu and common source/devtools shortcuts.
- Heuristically detects DevTools via window dimension checks and replaces `document.body` on detection.

### Usage Examples
- Start a new round programmatically:
```js
resetGame();
```
- Submit a guess programmatically:
```js
['R','I','Z','Z'].forEach(insertLetter);
checkRow();
```

