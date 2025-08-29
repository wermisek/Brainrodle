# Brainrodle API Documentation

## Overview

Brainrodle is a modern word-guessing game built with vanilla HTML, CSS, and JavaScript. This documentation covers all public APIs, functions, components, and usage patterns for developers who want to understand, modify, or extend the game.

## Table of Contents

1. [Game Architecture](#game-architecture)
2. [Core APIs](#core-apis)
3. [Daily Mode Functions](#daily-mode-functions)
4. [Unlimited Mode Functions](#unlimited-mode-functions)
5. [UI Components](#ui-components)
6. [CSS Classes and Styling](#css-classes-and-styling)
7. [Event Handlers](#event-handlers)
8. [Data Storage](#data-storage)
9. [Security Features](#security-features)
10. [Usage Examples](#usage-examples)

## Game Architecture

The application consists of two main game modes:
- **Daily Mode** (`index.html` + `script.js`): One word per day based on Warsaw timezone
- **Unlimited Mode** (`unlimited.html` + `unlimited.js`): Infinite gameplay with random words

Both modes share the same word list and core game mechanics but differ in word selection and statistics tracking.

## Core APIs

### Word Management

#### `WORDS` Array
The master word list containing Gen Z slang and internet culture terms.

```javascript
const WORDS = [
    "ALPHA", "AURA", "BASED", "BETA", "BRUH", "CAP", "CHAD", 
    // ... 100+ more words
];
```

**Usage:**
- Used for word validation during gameplay
- Source for random word selection in unlimited mode
- Basis for daily word generation using seeded random

#### `getWordDescription(word: string): string`
Returns descriptive text for a given word from the word list.

**Parameters:**
- `word` (string): The word to get description for (must be uppercase)

**Returns:**
- (string): Description of the word, or empty string if not found

**Example:**
```javascript
const description = getWordDescription("BASED");
// Returns: "Strong agreement/approval"
```

### Game State Management

#### Global Game Variables
```javascript
let currentWord = "";        // The target word for current game
let currentRow = 0;         // Current guess row (0-5)
let currentTile = 0;        // Current tile position in row
let isGameOver = false;     // Game completion status
let wordLength = 0;         // Length of current word
```

## Daily Mode Functions

### Core Game Functions

#### `getDailyWord(): string`
Generates a deterministic daily word based on the current date in Warsaw timezone.

**Returns:**
- (string): The daily word

**Algorithm:**
1. Gets current date in Warsaw timezone
2. Creates seed from date components
3. Uses seeded random to select from WORDS array
4. Ensures same word for entire day

**Example:**
```javascript
const todaysWord = getDailyWord();
console.log(todaysWord); // e.g., "SIGMA"
```

#### `getTimeUntilNextWord(): string`
Calculates time remaining until next daily word.

**Returns:**
- (string): Formatted time string "Xh Ym Zs"

**Example:**
```javascript
const timeLeft = getTimeUntilNextWord();
console.log(timeLeft); // "14h 32m 18s"
```

#### `checkIfPlayed(): boolean`
Checks if user has already played today's word.

**Returns:**
- (boolean): `true` if already played today, `false` otherwise

**Side Effects:**
- Sets `isGameOver = true` if already played
- Starts countdown timer display
- Shows previous guesses if available

### Game Mechanics

#### `createGameBoard(): void`
Creates the visual game board with appropriate number of tiles.

**Behavior:**
- Clears existing board
- Creates 6 rows of tiles
- Each row has tiles equal to current word length
- Adds appropriate CSS classes

#### `checkRow(): void`
Validates and processes the current guess.

**Validation Steps:**
1. Ensures row is completely filled
2. Validates word exists in WORDS array
3. Processes letter feedback (correct/present/absent)
4. Updates keyboard colors
5. Checks win/lose conditions

**Color Coding:**
- Green (`#538d4e`): Correct letter in correct position
- Yellow (`#b59f3b`): Letter exists but wrong position
- Gray (`#3a3a3c`): Letter not in word

#### `insertLetter(pressedKey: string): void`
Adds a letter to the current tile.

**Parameters:**
- `pressedKey` (string): The letter to insert (A-Z)

**Constraints:**
- Only works if current tile is within word length
- Only accepts single alphabetic characters

#### `deleteLetter(): void`
Removes the last entered letter from current row.

**Behavior:**
- Moves cursor back one position
- Clears tile content and styling
- Does nothing if at start of row

### Statistics and Progress

#### `updateStats(won: boolean, attempts: number): void`
Updates player statistics after game completion.

**Parameters:**
- `won` (boolean): Whether player won the game
- `attempts` (number): Number of attempts used (1-6)

**Statistics Tracked:**
- Total games played
- Win percentage
- Current streak
- Best streak
- Guess distribution
- Last played date
- Last guesses

#### `showStats(): void`
Displays statistics modal with player progress.

**Modal Contents:**
- Games played count
- Win percentage
- Current/best streaks
- Guess distribution chart
- Next word countdown (if already played)

## Unlimited Mode Functions

### Core Unlimited Functions

#### `getRandomWord(): string`
Selects a random word from the WORDS array.

**Returns:**
- (string): A randomly selected word

**Example:**
```javascript
const randomWord = getRandomWord();
console.log(randomWord); // Random word each time
```

#### `resetGame(): void`
Resets game state for new unlimited game.

**Actions:**
- Selects new random word
- Resets all game variables
- Clears and recreates game board
- Resets keyboard colors
- Clears message display
- Resets guess tracking

### Unlimited Statistics

#### `updateStats(won: boolean): void`
Updates unlimited mode statistics (simpler than daily mode).

**Parameters:**
- `won` (boolean): Whether player won the game

**Statistics Tracked:**
- Total games played
- Total wins
- Win percentage

## UI Components

### Navigation Components

#### Hamburger Menu
Mobile-responsive navigation menu.

**HTML Structure:**
```html
<button class="hamburger-menu">☰</button>
<div class="nav-menu">
    <div class="subtitle">Guess the brainrot text!</div>
    <div class="instructions">Press ENTER to confirm • BACKSPACE to delete</div>
    <div class="nav-buttons">
        <!-- Navigation buttons -->
    </div>
</div>
```

**Functionality:**
- Toggles navigation menu visibility
- Closes when clicking outside
- Contains game mode switcher and utility buttons

#### Navigation Buttons

**Daily Mode Navigation:**
```html
<button class="nav-button" onclick="window.location.href='unlimited.html'">
    🎮 Unlimited Mode
</button>
<button class="nav-button" id="viewWordsBtn">📖 View Words</button>
<button class="stats-button">📊 Statistics</button>
```

**Unlimited Mode Navigation:**
```html
<button class="nav-button" onclick="window.location.href='index.html'">
    🏠 Daily Mode
</button>
<button class="nav-button" id="newWordBtn">🔄 New Word</button>
<button class="nav-button" id="viewWordsBtn">📖 View Words</button>
<button class="stats-button">📊 Statistics</button>
```

### Game Board Components

#### Game Board Structure
```html
<div id="game-board">
    <div class="letter-row">
        <div class="letter-box"></div>
        <div class="letter-box"></div>
        <!-- ... more tiles based on word length -->
    </div>
    <!-- ... 6 total rows -->
</div>
```

**CSS Classes:**
- `.letter-box`: Individual tile styling
- `.letter-row`: Row container styling
- `.filled-box`: Applied when tile contains letter
- `.correct`: Green background for correct letters
- `.present`: Yellow background for present letters
- `.absent`: Gray background for absent letters

### Keyboard Component

#### On-Screen Keyboard Structure
```html
<div id="keyboard-container">
    <div class="keyboard-row">
        <button data-key="Q">Q</button>
        <!-- ... QWERTY layout -->
    </div>
    <div class="keyboard-row">
        <button data-key="ENTER" class="wide-button">Enter ↵</button>
        <!-- ... second row -->
        <button data-key="DELETE" class="wide-button">⌫ Delete</button>
    </div>
</div>
```

**Key Features:**
- QWERTY layout
- Visual feedback matching game board
- Special keys for Enter and Delete
- Responsive design for mobile

### Modal Components

#### Word List Modal (Daily Mode)
```html
<div id="words-modal" class="modal">
    <div class="modal-content">
        <span class="close-button">&times;</span>
        <h2>Word List</h2>
        <div class="words-list">
            <!-- Populated by showWordList() -->
        </div>
    </div>
</div>
```

#### Word List Panel (Unlimited Mode)
```html
<div class="word-list-panel">
    <h3>Word List</h3>
    <div id="word-list-content">
        <!-- Populated by populateWordList() -->
    </div>
</div>
```

### Message Display

#### Message Container
```html
<div id="message-container"></div>
```

**Usage with `showMessage()`:**
```javascript
showMessage("Congratulations! 🎉");
showMessage("Word not in list!", 2000);
showMessage("Game Over! The word was SIGMA");
```

## CSS Classes and Styling

### Layout Classes

#### `.game-container`
Main container for entire game interface.
```css
.game-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    position: relative;
    z-index: 2;
}
```

#### `.mobile-header`
Mobile-specific header layout.
```css
.mobile-header {
    display: none;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1rem;
}
```

### Game Board Styling

#### `.letter-box`
Individual tile styling with glitch effects.
```css
.letter-box {
    width: 62px;
    height: 62px;
    border: 2px solid #3a3a3c;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
    font-weight: bold;
    color: white;
    background-color: transparent;
}
```

#### State Classes
```css
.letter-box.filled-box {
    border-color: #565758;
    animation: pulse 0.2s ease-in-out;
}

.letter-box.correct {
    background-color: #538d4e;
    border-color: #538d4e;
}

.letter-box.present {
    background-color: #b59f3b;
    border-color: #b59f3b;
}

.letter-box.absent {
    background-color: #3a3a3c;
    border-color: #3a3a3c;
}
```

### Animation Classes

#### `.shake`
Row shake animation for invalid inputs.
```css
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

.shake {
    animation: shake 0.5s ease-in-out;
}
```

#### `.glitch`
Title glitch effect animation.
```css
@keyframes glitch {
    0%, 100% {
        text-shadow: 2px 2px 0px #ff00ff, -2px -2px 0px #00ffff;
    }
    25% {
        text-shadow: -2px 2px 0px #ff00ff, 2px -2px 0px #00ffff;
    }
    50% {
        text-shadow: 2px -2px 0px #ff00ff, -2px 2px 0px #00ffff;
    }
    75% {
        text-shadow: -2px -2px 0px #ff00ff, 2px 2px 0px #00ffff;
    }
}
```

### Responsive Design

#### Mobile Breakpoints
```css
@media (max-width: 768px) {
    .mobile-header { display: flex; }
    header h1:not(.mobile-header h1) { display: none; }
    .nav-menu { 
        position: fixed;
        top: 0;
        right: -100%;
        width: 300px;
        height: 100vh;
        transition: right 0.3s ease;
    }
    .nav-menu.show { right: 0; }
}
```

## Event Handlers

### Keyboard Input Handling

#### Physical Keyboard Events
```javascript
document.addEventListener("keyup", (e) => {
    if (isGameOver && e.key === "Enter") {
        // Handle game restart
        return;
    }
    
    if (e.key === "Backspace") {
        deleteLetter();
        return;
    }

    if (e.key === "Enter") {
        checkRow();
        return;
    }
    
    // Handle letter input
    let pressedKey = String(e.key).toUpperCase();
    let found = pressedKey.match(/[A-Z]/g);
    if (!found || found.length > 1) return;
    
    insertLetter(pressedKey);
});
```

#### On-Screen Keyboard Events
```javascript
document.querySelectorAll(".keyboard-row button").forEach(button => {
    button.addEventListener("click", () => {
        const key = button.getAttribute("data-key");
        
        if (key === "ENTER") {
            checkRow();
        } else if (key === "DELETE") {
            deleteLetter();
        } else {
            insertLetter(key);
        }
    });
});
```

### UI Interaction Events

#### Menu Toggle
```javascript
hamburgerMenu.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && 
        !hamburgerMenu.contains(e.target) && 
        navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
    }
});
```

## Data Storage

### Local Storage Structure

#### Daily Mode Statistics
```javascript
const stats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    bestStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0], // Wins in 1-6 guesses
    lastPlayedDate: null,
    lastGuesses: []
};

// Stored as: 'brainrodle_stats'
localStorage.setItem('brainrodle_stats', JSON.stringify(stats));
```

#### Unlimited Mode Statistics
```javascript
const unlimitedStats = {
    gamesPlayed: 0,
    gamesWon: 0,
    lastGuesses: []
};

// Stored as: 'brainrodle_unlimited_stats'
localStorage.setItem('brainrodle_unlimited_stats', JSON.stringify(unlimitedStats));
```

### Data Persistence Functions

#### Loading Statistics
```javascript
// Daily mode
const stats = JSON.parse(localStorage.getItem('brainrodle_stats') || '{}');

// Unlimited mode
const unlimitedStats = JSON.parse(localStorage.getItem('brainrodle_unlimited_stats') || '{}');
```

#### Saving Statistics
```javascript
// Daily mode
localStorage.setItem('brainrodle_stats', JSON.stringify(stats));

// Unlimited mode
localStorage.setItem('brainrodle_unlimited_stats', JSON.stringify(unlimitedStats));
```

## Security Features

### Anti-Cheat Protection

#### Console Access Prevention
```javascript
// Override console methods
const noop = () => undefined;
Object.defineProperties(window.console, {
    log: { get: () => noop },
    debug: { get: () => noop },
    // ... other console methods
});
```

#### Developer Tools Detection
```javascript
function checkDevTools() {
    if (window.outerHeight - window.innerHeight > 200 || 
        window.outerWidth - window.innerWidth > 200) {
        document.body.innerHTML = 'Cheating detected!';
    }
}

// Monitor every second
setInterval(checkDevTools, 1000);
```

#### Keyboard Shortcut Blocking
```javascript
document.addEventListener('keydown', function(e) {
    // Block Ctrl+U (view source), Ctrl+S (save), F12, etc.
    if ((e.ctrlKey || e.metaKey) && 
        (e.key === 'u' || e.key === 's' || e.key === 'i' || e.key === 'c')) {
        e.preventDefault();
        return false;
    }
});
```

#### Right-Click Prevention
```javascript
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});
```

## Usage Examples

### Basic Game Integration

#### Creating a New Game Mode
```javascript
// 1. Define word selection logic
function getCustomWord() {
    // Custom word selection logic
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}

// 2. Initialize game state
let currentWord = getCustomWord();
let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

// 3. Create game board
createGameBoard();

// 4. Set up event listeners
document.addEventListener("keyup", handleKeyInput);
```

#### Custom Word Validation
```javascript
function validateCustomWord(word) {
    // Add custom validation logic
    const isValidLength = word.length >= 3 && word.length <= 8;
    const isInWordList = WORDS.includes(word.toUpperCase());
    const hasValidCharacters = /^[A-Z]+$/.test(word.toUpperCase());
    
    return isValidLength && isInWordList && hasValidCharacters;
}
```

### Extending the Word List

#### Adding New Words
```javascript
// Add to existing WORDS array
const CUSTOM_WORDS = ["NEWWORD", "CUSTOM", "EXTEND"];
const EXTENDED_WORDS = [...WORDS, ...CUSTOM_WORDS];

// Update word descriptions
function getExtendedWordDescription(word) {
    const customDescriptions = {
        "NEWWORD": "A newly added word",
        "CUSTOM": "Custom addition to word list",
        "EXTEND": "Extended functionality"
    };
    
    return customDescriptions[word] || getWordDescription(word);
}
```

### Custom Statistics Tracking

#### Advanced Statistics
```javascript
function updateAdvancedStats(won, attempts, timeSpent) {
    const advancedStats = JSON.parse(
        localStorage.getItem('advanced_stats') || '{}'
    );
    
    advancedStats.totalTime = (advancedStats.totalTime || 0) + timeSpent;
    advancedStats.averageAttempts = calculateAverage(attempts);
    advancedStats.dailyProgress = trackDailyProgress();
    
    localStorage.setItem('advanced_stats', JSON.stringify(advancedStats));
}
```

### Theming and Customization

#### Custom Color Schemes
```javascript
// Define theme colors
const themes = {
    neon: {
        correct: '#538d4e',
        present: '#b59f3b',
        absent: '#3a3a3c',
        primary: '#ff00ff',
        secondary: '#00ffff'
    },
    classic: {
        correct: '#6aaa64',
        present: '#c9b458',
        absent: '#787c7e',
        primary: '#000000',
        secondary: '#ffffff'
    }
};

// Apply theme
function applyTheme(themeName) {
    const theme = themes[themeName];
    document.documentElement.style.setProperty('--correct-color', theme.correct);
    document.documentElement.style.setProperty('--present-color', theme.present);
    document.documentElement.style.setProperty('--absent-color', theme.absent);
}
```

### API Integration Examples

#### External Word API
```javascript
async function fetchExternalWords() {
    try {
        const response = await fetch('https://api.example.com/words');
        const externalWords = await response.json();
        
        // Merge with existing words
        const combinedWords = [...WORDS, ...externalWords];
        return combinedWords;
    } catch (error) {
        console.error('Failed to fetch external words:', error);
        return WORDS; // Fallback to default
    }
}
```

#### Statistics API
```javascript
async function syncStatistics(stats) {
    try {
        await fetch('/api/stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(stats)
        });
    } catch (error) {
        console.error('Failed to sync statistics:', error);
    }
}
```

## Best Practices

### Performance Optimization

1. **Minimize DOM Manipulation**: Batch DOM updates when possible
2. **Use Event Delegation**: Attach event listeners to parent containers
3. **Optimize Animations**: Use CSS animations over JavaScript when possible
4. **Cache DOM Elements**: Store frequently accessed elements in variables

### Accessibility

1. **Keyboard Navigation**: Ensure all functionality is keyboard accessible
2. **ARIA Labels**: Add appropriate ARIA attributes for screen readers
3. **Color Contrast**: Maintain sufficient contrast ratios
4. **Focus Management**: Provide clear focus indicators

### Code Organization

1. **Modular Functions**: Keep functions small and focused
2. **Consistent Naming**: Use clear, descriptive variable and function names
3. **Error Handling**: Implement proper error handling and fallbacks
4. **Documentation**: Comment complex logic and maintain this documentation

This documentation provides a comprehensive overview of the Brainrodle game's architecture, APIs, and usage patterns. It serves as both a reference for developers working with the codebase and a guide for extending or customizing the game.