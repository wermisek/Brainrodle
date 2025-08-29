## Usage and Examples

This guide explains how to play, interact with the UI, and programmatically drive the game for tests or demos.

### Playing the Game
- Type letters using your keyboard or click on the on-screen keys
- Press Enter to submit a guess
- Press Backspace (or click Delete) to remove the last letter

Tile colors after submitting:
- 🟩 `correct`: Letter is correct and in the correct position
- 🟨 `present`: Letter exists in the word but in a different position
- ⬛ `absent`: Letter is not in the word

### Daily Mode
- One word per day, synced to Europe/Warsaw time
- If you have already played today, the game shows a countdown until the next word and your last guesses
- Open statistics via the "📊 Statistics" button
- Open the full word list via the "📖 View Words" button

Programmatic interactions:
```js
// Insert letters then submit
['B','A','S','E','D'].forEach(insertLetter);
checkRow();

// Show a persistent message
showMessage('Welcome back!', 0);
```

### Unlimited Mode
- Play as many rounds as you want with random words
- Click "🔄 New Word" or press Enter after a completed game to start a new round
- Toggle the word list side panel with "📖 View Words"

Programmatic interactions:
```js
// Start a fresh game
resetGame();

// Submit a guess
['R','I','Z','Z'].forEach(insertLetter);
checkRow();
```

### Keyboard Shortcuts and Controls
- Letters A–Z: input
- Enter: submit
- Backspace: delete

### Stats
- Daily mode: Displays a modal with Played, Win Rate, Current Streak, Max Streak, and Guess Distribution
- Unlimited mode: Displays an overlay summary with Played, Won, Win Rate, Best and Current Streak

### Anti-cheat and Limitations
- Right-click context menu and common dev tool shortcuts are disabled
- Heuristic dev tools detection may interfere with debugging; temporarily disable when developing

