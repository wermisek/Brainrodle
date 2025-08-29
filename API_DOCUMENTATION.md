# 🧠 Brainrodle API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Core Game Functions](#core-game-functions)
3. [Game State Management](#game-state-management)
4. [User Interface Functions](#user-interface-functions)
5. [Statistics and Data Management](#statistics-and-data-management)
6. [Utility Functions](#utility-functions)
7. [Event Handlers](#event-handlers)
8. [CSS Classes and Components](#css-classes-and-components)
9. [HTML Structure](#html-structure)
10. [Usage Examples](#usage-examples)
11. [Game Modes](#game-modes)
12. [Security Features](#security-features)

## Overview

Brainrodle is a modern word-guessing game built with vanilla HTML, CSS, and JavaScript. The game features two modes: Daily Mode (one word per day) and Unlimited Mode (play as many times as you want). This documentation covers all public APIs, functions, and components available for developers and users.

## Core Game Functions

### `getDailyWord()`
**File:** `script.js`  
**Description:** Generates a deterministic daily word based on Warsaw timezone.  
**Returns:** `string` - A random word from the predefined word list.  
**Usage:** Called automatically when the game initializes.

```javascript
// The function uses a seeded random algorithm based on the current date
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

### `getRandomWord()`
**File:** `unlimited.js`  
**Description:** Selects a random word for unlimited mode gameplay.  
**Returns:** `string` - A random word from the word list.  
**Usage:** Called when starting a new game in unlimited mode.

```javascript
function getRandomWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}
```

### `checkRow()`
**File:** `script.js`, `unlimited.js`  
**Description:** Validates the current row guess and updates the game state.  
**Parameters:** None  
**Returns:** `void`  
**Usage:** Called when the user presses Enter to submit a guess.

**Features:**
- Validates word length
- Checks if word exists in the word list
- Marks correct, present, and absent letters
- Updates keyboard colors
- Handles game win/loss conditions

```javascript
function checkRow() {
    const wordLength = currentWord.length;
    
    if (currentTile !== wordLength) {
        showMessage(`Word must be ${wordLength} letters!`);
        shakeRow();
        return;
    }
    
    // ... validation and game logic
}
```

### `insertLetter(pressedKey)`
**File:** `script.js`, `unlimited.js`  
**Description:** Inserts a letter into the current game board position.  
**Parameters:** `pressedKey` (string) - The letter to insert.  
**Returns:** `void`  
**Usage:** Called when a letter key is pressed or clicked.

```javascript
function insertLetter(pressedKey) {
    if (currentTile >= currentWord.length) return;
    
    const row = gameBoard.children[currentRow];
    const box = row.children[currentTile];
    box.textContent = pressedKey;
    box.classList.add("filled-box");
    currentTile++;
}
```

### `deleteLetter()`
**File:** `script.js`, `unlimited.js`  
**Description:** Removes the last letter from the current row.  
**Parameters:** None  
**Returns:** `void`  
**Usage:** Called when Backspace is pressed or Delete button is clicked.

```javascript
function deleteLetter() {
    if (currentTile <= 0) return;
    
    currentTile--;
    const row = gameBoard.children[currentRow];
    const box = row.children[currentTile];
    box.textContent = "";
    box.classList.remove("filled-box");
}
```

### `resetGame()`
**File:** `script.js`, `unlimited.js`  
**Description:** Resets the game state and creates a new game board.  
**Parameters:** None  
**Returns:** `void`  
**Usage:** Called when starting a new game or after game completion.

```javascript
function resetGame() {
    currentWord = getDailyWord(); // or getRandomWord() in unlimited mode
    currentRow = 0;
    currentTile = 0;
    isGameOver = false;
    createGameBoard();
    
    // Reset keyboard colors
    document.querySelectorAll(".keyboard-row button").forEach(button => {
        button.style.backgroundColor = "";
        button.style.color = "white";
    });
}
```

## Game State Management

### Game State Variables
**File:** `script.js`, `unlimited.js`  
**Description:** Core variables that track the current game state.

```javascript
let currentRow = 0;        // Current row being played (0-5)
let currentTile = 0;       // Current tile position in the row
let isGameOver = false;    // Whether the game has ended
let currentWord = "";      // The word to be guessed
let gameBoard;             // Reference to the game board DOM element
```

### `createGameBoard()`
**File:** `script.js`  
**Description:** Dynamically creates the game board HTML structure.  
**Parameters:** None  
**Returns:** `void`  
**Usage:** Called during game initialization and reset.

```javascript
function createGameBoard() {
    gameBoard.innerHTML = '';
    const wordLength = currentWord.length;
    
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("div");
        row.className = "letter-row";
        
        for (let j = 0; j < wordLength; j++) {
            const box = document.createElement("div");
            box.className = "letter-box";
            row.appendChild(box);
        }
        
        gameBoard.appendChild(row);
    }
}
```

### `checkIfPlayed()`
**File:** `script.js`  
**Description:** Checks if the user has already played the daily word today.  
**Parameters:** None  
**Returns:** `boolean` - True if already played, false otherwise.  
**Usage:** Called during game initialization to prevent multiple plays per day.

```javascript
function checkIfPlayed() {
    const warsawTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Warsaw' });
    const today = new Date(warsawTime).toISOString().split('T')[0];
    
    if (stats.lastPlayedDate === today) {
        isGameOver = true;
        updateTimer();
        setInterval(updateTimer, 1000);
        return true;
    }
    return false;
}
```

## User Interface Functions

### `showMessage(message, duration)`
**File:** `script.js`, `unlimited.js`  
**Description:** Displays a temporary message to the user.  
**Parameters:** 
- `message` (string) - The message to display
- `duration` (number, optional) - How long to show the message in milliseconds (default: 2000)  
**Returns:** `void`  
**Usage:** Used to show game feedback, errors, and notifications.

```javascript
function showMessage(message, duration = 2000) {
    const messageContainer = document.getElementById("message-container");
    messageContainer.style.display = "block";
    messageContainer.innerHTML = message.replace(/\n/g, '<br>');
    if (duration > 0 && !isGameOver) {
        setTimeout(() => {
            messageContainer.style.display = "none";
        }, duration);
    }
}
```

### `shakeRow()`
**File:** `script.js`, `unlimited.js`  
**Description:** Applies a shake animation to the current row (used for invalid inputs).  
**Parameters:** None  
**Returns:** `void`  
**Usage:** Called when the user submits an invalid word.

```javascript
function shakeRow() {
    const row = gameBoard.children[currentRow];
    row.classList.add("shake");
    setTimeout(() => {
        row.classList.remove("shake");
    }, 500);
}
```

### `showWordList()`
**File:** `script.js`  
**Description:** Displays the modal containing all available words and their descriptions.  
**Parameters:** None  
**Returns:** `void`  
**Usage:** Called when the "View Words" button is clicked.

```javascript
function showWordList() {
    wordsList.innerHTML = WORDS.map(word => {
        const description = getWordDescription(word);
        return `<div class="word-item">${word}<br><small>${description}</small></div>`;
    }).join('');
    modal.style.display = "block";
}
```

### `getWordDescription(word)`
**File:** `script.js`  
**Description:** Returns the description/meaning of a given word.  
**Parameters:** `word` (string) - The word to get a description for.  
**Returns:** `string` - The description of the word.  
**Usage:** Used to populate the word list modal with helpful descriptions.

```javascript
function getWordDescription(word) {
    const descriptions = {
        "BASED": "Strong agreement/approval",
        "ALPHA": "Socially dominant person",
        "AURA": "Energy/personality vibe",
        // ... more descriptions
    };
    return descriptions[word] || "";
}
```

## Statistics and Data Management

### `updateStats(won, attempts)`
**File:** `script.js`  
**Description:** Updates and saves game statistics to localStorage.  
**Parameters:** 
- `won` (boolean) - Whether the game was won
- `attempts` (number) - Number of attempts taken  
**Returns:** `void`  
**Usage:** Called after each game completion to track performance.

```javascript
function updateStats(won, attempts) {
    // ... date handling and streak logic
    
    stats.gamesPlayed++;
    if (won) {
        stats.gamesWon++;
        stats.currentStreak++;
        stats.maxStreak = Math.max(stats.currentStreak, stats.maxStreak);
        stats.guessDistribution[attempts]++;
    } else {
        stats.currentStreak = 0;
    }
    
    localStorage.setItem('brainrodle_stats', JSON.stringify(stats));
    showStats();
}
```

### `showStats()`
**File:** `script.js`, `unlimited.js`  
**Description:** Displays the statistics modal with current game performance data.  
**Parameters:** None  
**Returns:** `void`  
**Usage:** Called when the statistics button is clicked.

```javascript
function showStats() {
    const winRate = Math.round((stats.gamesWon / stats.gamesPlayed) * 100) || 0;
    const statsHTML = `
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-value">${stats.gamesPlayed}</div>
                <div class="stat-label">Played</div>
            </div>
            // ... more stats
        </div>
    `;
    
    statsContainer.innerHTML = statsHTML;
    statsModalElement.style.display = "block";
}
```

### Statistics Data Structure
**File:** `script.js`  
**Description:** The structure of stored statistics data.

```javascript
const defaultStats = {
    gamesPlayed: 0,           // Total games played
    gamesWon: 0,              // Total games won
    currentStreak: 0,         // Current winning streak
    maxStreak: 0,             // Longest winning streak
    lastPlayedDate: null,     // Last date played
    lastGuesses: [],          // Last game's guesses
    guessDistribution: {       // Distribution of wins by attempt count
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
    }
};
```

## Utility Functions

### `getTimeUntilNextWord()`
**File:** `script.js`  
**Description:** Calculates the time remaining until the next daily word is available.  
**Parameters:** None  
**Returns:** `string` - Formatted time string (e.g., "23h 45m 30s").  
**Usage:** Used to display countdown timer for daily mode.

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

### `updateTimer()`
**File:** `script.js`  
**Description:** Updates the countdown timer display and shows previous game results.  
**Parameters:** None  
**Returns:** `void`  
**Usage:** Called every second when the daily word has already been played.

```javascript
function updateTimer() {
    const timeLeft = getTimeUntilNextWord();
    const messageContainer = document.getElementById("message-container");
    const guessesDisplay = stats.lastGuesses && stats.lastGuesses.length > 0 
        ? `<br><br>Your guesses:<br>${stats.lastGuesses.join('<br>')}`
        : '';
    messageContainer.innerHTML = `You've already played today!<br>Next word in: ${timeLeft}${guessesDisplay}`;
    messageContainer.style.display = "block";
}
```

## Event Handlers

### Keyboard Event Handling
**File:** `script.js`, `unlimited.js`  
**Description:** Handles keyboard input for letter entry, submission, and deletion.

```javascript
document.addEventListener("keyup", (e) => {
    if (isGameOver) return;
    
    if (e.key === "Backspace") {
        deleteLetter();
        return;
    }

    if (e.key === "Enter") {
        checkRow();
        return;
    }
    
    let pressedKey = String(e.key).toUpperCase();
    let found = pressedKey.match(/[A-Z]/g);
    if (!found || found.length > 1) return;
    
    insertLetter(pressedKey);
});
```

### On-Screen Keyboard Handling
**File:** `script.js`, `unlimited.js`  
**Description:** Handles clicks on the virtual keyboard buttons.

```javascript
document.querySelectorAll(".keyboard-row button").forEach(button => {
    button.addEventListener("click", () => {
        if (isGameOver) return;
        
        const key = button.getAttribute("data-key");
        if (key === "ENTER") {
            checkRow();
            return;
        }
        
        if (key === "DELETE") {
            deleteLetter();
            return;
        }
        
        insertLetter(key);
    });
});
```

### Mobile Menu Handling
**File:** `script.js`, `unlimited.js`  
**Description:** Manages the mobile hamburger menu functionality.

```javascript
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navMenu = document.querySelector('.nav-menu');

hamburgerMenu.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburgerMenu.contains(e.target) && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
    }
});
```

## CSS Classes and Components

### Core Game Classes
- `.game-container` - Main game wrapper
- `.letter-row` - Individual row in the game board
- `.letter-box` - Individual letter tile
- `.filled-box` - Letter tile with content
- `.correct` - Correct letter in correct position (green)
- `.present` - Letter exists but wrong position (yellow)
- `.absent` - Letter not in word (gray)

### Interactive Elements
- `.keyboard-row` - Keyboard button row
- `.wide-button` - Special buttons (Enter, Delete)
- `.nav-button` - Navigation buttons
- `.stats-button` - Statistics button
- `.hamburger-menu` - Mobile menu toggle

### Modal and Overlay Classes
- `.modal` - Modal overlay container
- `.modal-content` - Modal content wrapper
- `.close-button` - Modal close button
- `.stats-content` - Statistics modal specific styling
- `.words-list` - Word list container

### Animation Classes
- `.shake` - Row shake animation for invalid inputs
- `.glitch` - Text glitch effect animation

## HTML Structure

### Main Game Container
```html
<div class="game-container">
    <header>
        <!-- Game title and navigation -->
    </header>
    
    <div id="game-board">
        <!-- Dynamically generated game rows -->
    </div>
    
    <div id="keyboard-container">
        <!-- Virtual keyboard -->
    </div>
</div>
```

### Game Board Structure
```html
<div id="game-board">
    <div class="letter-row">
        <div class="letter-box"></div>
        <div class="letter-box"></div>
        <!-- ... more boxes based on word length -->
    </div>
    <!-- ... 5 more rows -->
</div>
```

### Keyboard Structure
```html
<div id="keyboard-container">
    <div class="keyboard-row">
        <!-- QWERTY row -->
    </div>
    <div class="keyboard-row">
        <!-- ASDFGHJKL row -->
    </div>
    <div class="keyboard-row">
        <!-- Enter + ZXCVBNM + Delete row -->
    </div>
</div>
```

## Usage Examples

### Starting a New Game
```javascript
// Reset the game state
resetGame();

// The game automatically:
// - Generates a new word
// - Creates the game board
// - Resets all counters
// - Clears the keyboard colors
```

### Handling User Input
```javascript
// User types a letter
insertLetter('A');

// User deletes a letter
deleteLetter();

// User submits a guess
checkRow();
```

### Displaying Messages
```javascript
// Show a temporary message
showMessage("Great guess!", 3000);

// Show a persistent message
showMessage("Game Over!", 0);
```

### Managing Statistics
```javascript
// Update stats after game completion
updateStats(true, 4); // Won in 4 attempts

// Display current statistics
showStats();
```

## Game Modes

### Daily Mode (`script.js`)
- **Word Selection:** Deterministic daily word based on Warsaw timezone
- **Play Limit:** One game per day
- **Statistics:** Persistent across days with streak tracking
- **Features:** Countdown timer, previous game results display

### Unlimited Mode (`unlimited.js`)
- **Word Selection:** Random word selection
- **Play Limit:** Unlimited games
- **Statistics:** Separate tracking from daily mode
- **Features:** New word button, immediate replay capability

## Security Features

### Anti-Cheat Protection
**File:** `script.js`, `unlimited.js`  
**Description:** Multiple layers of protection against cheating and code inspection.

```javascript
// Disable right-click context menu
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Disable keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 's' || e.key === 'i' || e.key === 'c')) {
        e.preventDefault();
        return false;
    }
});

// DevTools detection
function checkDevTools() {
    if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
        document.body.innerHTML = 'Cheating detected!';
    }
}
```

### Console Protection
**File:** `unlimited.js` (commented out in production)  
**Description:** Advanced console and debugging protection.

```javascript
// Override console methods
Object.defineProperties(window.console, {
    log: { get: noopReturn(noop) },
    debug: { get: noopReturn(noop) },
    // ... more console methods
});

// Prevent debugging
setInterval(() => {
    const start = performance.now();
    debugger;
    const end = performance.now();
    if (end - start > 100) {
        showMessage("No cheating! 😉");
    }
}, 1000);
```

## Word List

The game includes a curated list of Gen Z slang and internet culture terms, including:

- **Classic Terms:** BASED, ALPHA, BETA, CHAD, RIZZ, SUS
- **Modern Slang:** ACOUSTIC, BACKSHOT, BEDROT, BRAINROT
- **Internet Culture:** BOOKTOK, BALKAN, BACKROOMS, BATTLEBUS
- **Expressions:** AHH, AYO, BRUH, CAP, F, G, L, W

Each word includes a description explaining its meaning and usage context.

## Browser Compatibility

- **Modern Browsers:** Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Support:** Full responsive design with touch-friendly interface
- **JavaScript Features:** ES6+ features, localStorage, DOM manipulation
- **CSS Features:** Flexbox, CSS Grid, CSS animations, CSS variables

## Performance Considerations

- **Minimal Dependencies:** Pure vanilla JavaScript, no external libraries
- **Efficient DOM Updates:** Minimal reflows and repaints
- **Local Storage:** Efficient data persistence without server calls
- **Responsive Design:** Optimized for various screen sizes and devices

---

This documentation covers all public APIs, functions, and components of the Brainrodle word game. For additional support or questions, refer to the source code or contact the development team.