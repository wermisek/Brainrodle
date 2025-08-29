# Brainrodle Function Reference

## Daily Mode Functions (`script.js`)

### Word Management Functions

#### `getDailyWord(): string`
**Purpose:** Generates a deterministic daily word based on Warsaw timezone.

**Algorithm:**
1. Gets current date in 'Europe/Warsaw' timezone
2. Extracts date components (year, month, day)
3. Creates seed by summing date components
4. Uses seeded random number generator
5. Selects word from WORDS array

**Example:**
```javascript
const todaysWord = getDailyWord();
console.log(todaysWord); // Same word for entire day
```

**Implementation Details:**
```javascript
function getDailyWord() {
    const warsawTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Warsaw' });
    const today = new Date(warsawTime).toISOString().split('T')[0];
    let seed = today.split('-').reduce((acc, num) => acc + parseInt(num), 0);
    const seededRandom = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };
    return WORDS[Math.floor(seededRandom() * WORDS.length)];
}
```

#### `getWordDescription(word: string): string`
**Purpose:** Returns descriptive text for words in the game.

**Parameters:**
- `word` (string): Word to get description for (case-sensitive, should be uppercase)

**Returns:**
- (string): Description text or empty string if not found

**Example:**
```javascript
getWordDescription("BASED"); // "Strong agreement/approval"
getWordDescription("SIGMA"); // "Independent/lone wolf mindset"
getWordDescription("UNKNOWN"); // ""
```

**Word Categories:**
- Classic Brainrot: BASED, ALPHA, AURA, BAKA, etc.
- Modern Terms: ACOUSTIC, BACKSHOT, BEDROT, etc.
- Extended Terms: ANGELSHOT, BACKROOMS, BATTLEBUS, etc.

#### `showWordList(): void`
**Purpose:** Displays modal with all available words and descriptions.

**Behavior:**
1. Populates modal with word list
2. Shows word + description for each entry
3. Displays modal overlay

**HTML Structure Created:**
```html
<div class="word-item">
    WORD<br>
    <small>Description text</small>
</div>
```

### Time Management Functions

#### `getTimeUntilNextWord(): string`
**Purpose:** Calculates time remaining until next daily word becomes available.

**Returns:**
- (string): Formatted time string in format "Xh Ym Zs"

**Example:**
```javascript
const timeLeft = getTimeUntilNextWord();
console.log(timeLeft); // "14h 32m 18s"
```

**Implementation:**
```javascript
function getTimeUntilNextWord() {
    const now = new Date();
    const warsawTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Warsaw' }));
    const tomorrow = new Date(warsawTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeLeft = tomorrow - warsawTime;
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
}
```

#### `updateTimer(): void`
**Purpose:** Updates the countdown display for next word availability.

**Behavior:**
1. Gets time until next word
2. Updates message container with countdown
3. Shows previous guesses if available
4. Called every second when game is completed

### Game State Functions

#### `checkIfPlayed(): boolean`
**Purpose:** Determines if user has already played today's word.

**Returns:**
- (boolean): `true` if already played today, `false` otherwise

**Side Effects:**
- Sets `isGameOver = true` if already played
- Starts timer display
- Shows completion message

**Example:**
```javascript
if (checkIfPlayed()) {
    console.log("User already played today");
    // Timer will start automatically
}
```

#### `createGameBoard(): void`
**Purpose:** Creates the visual game board with appropriate tile count.

**Behavior:**
1. Clears existing game board
2. Creates 6 rows (maximum guesses)
3. Each row has tiles equal to current word length
4. Applies base CSS classes

**HTML Structure Created:**
```html
<div class="letter-row">
    <div class="letter-box"></div>
    <div class="letter-box"></div>
    <!-- ... tiles equal to word length -->
</div>
<!-- ... 6 total rows -->
```

#### `resetGame(): void`
**Purpose:** Resets game state for new daily word.

**Actions Performed:**
1. Gets new daily word
2. Resets position counters (`currentRow = 0`, `currentTile = 0`)
3. Sets `isGameOver = false`
4. Creates fresh game board
5. Resets keyboard button colors

### Input Handling Functions

#### `insertLetter(pressedKey: string): void`
**Purpose:** Adds a letter to the current tile position.

**Parameters:**
- `pressedKey` (string): Single letter A-Z to insert

**Constraints:**
- Only works if `currentTile < currentWord.length`
- Adds letter to current row at current tile position
- Advances tile position after insertion
- Applies visual styling (`filled-box` class)

**Example:**
```javascript
insertLetter("A"); // Adds "A" to current tile
insertLetter("B"); // Adds "B" to next tile
```

#### `deleteLetter(): void`
**Purpose:** Removes the last entered letter from current row.

**Behavior:**
1. Moves tile position back one step
2. Clears tile content
3. Removes visual styling
4. Does nothing if already at row start

**Example:**
```javascript
deleteLetter(); // Removes last letter and moves cursor back
```

#### `shakeRow(): void`
**Purpose:** Applies shake animation to current row for invalid input feedback.

**Implementation:**
```javascript
function shakeRow() {
    const row = gameBoard.children[currentRow];
    row.classList.add("shake");
    setTimeout(() => {
        row.classList.remove("shake");
    }, 500);
}
```

### Game Logic Functions

#### `checkRow(): void`
**Purpose:** Validates current guess and provides feedback.

**Validation Steps:**
1. **Length Check:** Ensures row is completely filled
2. **Word Validation:** Checks if guess exists in WORDS array
3. **Letter Analysis:** Processes each letter for feedback
4. **Win/Lose Check:** Determines game completion

**Letter Feedback Algorithm:**
```javascript
// Two-pass algorithm for accurate feedback
// Pass 1: Mark correct positions (green)
for (let i = 0; i < wordLength; i++) {
    if (currentWord[i] === guessWord[i]) {
        tile.classList.add("correct");
        letterCount[letter]--; // Reduce available count
    }
}

// Pass 2: Mark present/absent (yellow/gray)
for (let i = 0; i < wordLength; i++) {
    if (!tile.classList.contains("correct")) {
        if (letterCount[letter] > 0) {
            tile.classList.add("present");
            letterCount[letter]--;
        } else {
            tile.classList.add("absent");
        }
    }
}
```

**Color Coding:**
- **Green** (`#538d4e`): Correct letter, correct position
- **Yellow** (`#b59f3b`): Letter in word, wrong position  
- **Gray** (`#3a3a3c`): Letter not in word

**Win Conditions:**
- Guess matches target word exactly
- Game ends immediately with congratulations

**Lose Conditions:**
- 6 incorrect guesses completed
- Shows correct word in game over message

### Statistics Functions

#### `updateStats(won: boolean, attempts: number): void`
**Purpose:** Updates player statistics after game completion.

**Parameters:**
- `won` (boolean): Whether the player won
- `attempts` (number): Number of guesses used (1-6)

**Statistics Updated:**
```javascript
stats.gamesPlayed++;
if (won) {
    stats.gamesWon++;
    stats.currentStreak++;
    stats.bestStreak = Math.max(stats.bestStreak, stats.currentStreak);
    stats.guessDistribution[attempts - 1]++;
} else {
    stats.currentStreak = 0;
}
stats.lastPlayedDate = today;
stats.lastGuesses = [/* current game guesses */];
```

#### `showStats(): void`
**Purpose:** Displays comprehensive statistics modal.

**Modal Content:**
- Games played count
- Win percentage calculation
- Current streak display
- Best streak record
- Guess distribution chart
- Next word countdown (if applicable)

**Calculation Examples:**
```javascript
const winPercentage = Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
const maxGuesses = Math.max(...stats.guessDistribution);
// Bar chart heights based on distribution
```

### Message Display Functions

#### `showMessage(message: string, duration: number = 2000): void`
**Purpose:** Displays temporary or persistent messages to user.

**Parameters:**
- `message` (string): Text to display (supports HTML)
- `duration` (number): Display time in milliseconds (0 = permanent)

**Behavior:**
1. Shows message container
2. Converts newlines to `<br>` tags
3. Auto-hides after duration (unless `isGameOver`)
4. Permanent display if `duration = 0` or game completed

**Usage Examples:**
```javascript
showMessage("Word not in list!", 2000); // 2-second display
showMessage("Congratulations! 🎉"); // Permanent until game reset
showMessage("Game Over! The word was SIGMA"); // Game end message
```

## Unlimited Mode Functions (`unlimited.js`)

### Core Game Functions

#### `getRandomWord(): string`
**Purpose:** Selects a random word for unlimited mode gameplay.

**Implementation:**
```javascript
function getRandomWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}
```

**Difference from Daily Mode:**
- Uses `Math.random()` instead of seeded random
- New word each game session
- No time-based restrictions

#### `resetGame(): void`
**Purpose:** Resets game state for new unlimited game.

**Actions:**
1. Sets `isGameOver = false`
2. Resets position counters
3. Gets new random word
4. Calculates word length
5. Recreates game board
6. Resets keyboard colors
7. Clears message display
8. Resets guess tracking

**Key Difference from Daily Mode:**
```javascript
currentWord = getRandomWord(); // Random vs. daily word
wordLength = currentWord.length; // Dynamic length calculation
```

### Unlimited-Specific Functions

#### `populateWordList(): void`
**Purpose:** Fills the word list panel with available words.

**Implementation:**
```javascript
function populateWordList() {
    wordListContent.innerHTML = WORDS.map(word => {
        return `<div class="word-item">${word}</div>`;
    }).join('');
}
```

**Note:** Unlimited mode doesn't show descriptions in word list (simplified UI).

#### `updateStats(won: boolean): void`
**Purpose:** Updates unlimited mode statistics (simplified version).

**Parameters:**
- `won` (boolean): Whether player won the game

**Statistics Tracked:**
```javascript
unlimitedStats.gamesPlayed++;
if (won) {
    unlimitedStats.gamesWon++;
}
// No streak tracking or guess distribution
```

### Event Handling Differences

#### New Word Button Handler
```javascript
document.querySelectorAll('#newWordBtn, .nav-button#newWordBtn').forEach(button => {
    button.addEventListener("click", () => {
        window.location.reload(); // Simple page refresh for new game
    });
});
```

#### Game Over Behavior
```javascript
// In unlimited mode, Enter key after game over reloads page
if (isGameOver && e.key === "Enter") {
    window.location.reload();
    return;
}
```

## Shared Functions

### Input Validation

Both modes share identical input validation logic:

```javascript
// Keyboard input filtering
let pressedKey = String(e.key).toUpperCase();
let found = pressedKey.match(/[A-Z]/g);
if (!found || found.length > 1) return;

// Word validation
if (!WORDS.includes(guessWord)) {
    showMessage("Word not in list!");
    shakeRow();
    return;
}
```

### UI Interaction

#### Menu Toggle (Both Modes)
```javascript
hamburgerMenu.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && 
        !hamburgerMenu.contains(e.target) && 
        navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
    }
});
```

## Function Call Hierarchy

### Daily Mode Initialization
```
DOMContentLoaded →
├── checkIfPlayed()
│   ├── getDailyWord()
│   └── updateTimer() (if already played)
├── createGameBoard()
└── Event Listener Setup
```

### Game Play Flow
```
User Input →
├── insertLetter() OR deleteLetter() OR
└── checkRow()
    ├── Word Validation
    ├── Letter Analysis
    ├── Win/Lose Check
    └── updateStats() (if game ends)
        └── showStats()
```

### Unlimited Mode Flow
```
DOMContentLoaded →
├── resetGame()
│   ├── getRandomWord()
│   └── createGameBoard()
└── Event Listener Setup
    └── New Word Button → window.location.reload()
```

## Error Handling

### Common Error Scenarios

1. **Invalid Input Length**
   ```javascript
   if (currentTile !== wordLength) {
       showMessage(`Word must be ${wordLength} letters!`);
       shakeRow();
       return;
   }
   ```

2. **Invalid Word**
   ```javascript
   if (!WORDS.includes(guessWord)) {
       showMessage("Word not in list!");
       shakeRow();
       return;
   }
   ```

3. **Missing DOM Elements**
   ```javascript
   if (!gameBoard) {
       console.error("Game board element not found!");
       return;
   }
   ```

4. **Storage Errors**
   ```javascript
   try {
       localStorage.setItem('brainrodle_stats', JSON.stringify(stats));
   } catch (error) {
       console.error('Failed to save statistics:', error);
   }
   ```

This function reference provides detailed documentation for all major functions in the Brainrodle game, including their purposes, parameters, return values, and implementation details.