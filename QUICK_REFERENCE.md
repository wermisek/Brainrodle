# ⚡ Brainrodle Quick Reference

## 🚀 Essential Functions

### Game Control
```javascript
resetGame()           // Start new game
checkRow()            // Submit current guess
insertLetter(key)     // Add letter to board
deleteLetter()        // Remove last letter
```

### State Management
```javascript
currentRow            // Current row (0-5)
currentTile           // Current tile position
isGameOver            // Game completion status
currentWord           // Target word to guess
```

### User Interface
```javascript
showMessage(msg, duration)  // Display message
showStats()                 // Show statistics
showWordList()              // Display word list
shakeRow()                  // Animate invalid input
```

## 🎮 Game Modes

### Daily Mode (`script.js`)
- **Word Selection**: Deterministic daily word
- **Play Limit**: One game per day
- **Features**: Countdown timer, streak tracking

### Unlimited Mode (`unlimited.js`)
- **Word Selection**: Random word selection
- **Play Limit**: Unlimited games
- **Features**: New word button, immediate replay

## 📊 Statistics Structure

```javascript
const stats = {
    gamesPlayed: 0,           // Total games
    gamesWon: 0,              // Games won
    currentStreak: 0,         // Current streak
    maxStreak: 0,             // Best streak
    lastPlayedDate: null,     // Last play date
    lastGuesses: [],          // Last game guesses
    guessDistribution: {       // Win distribution
        1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
    }
};
```

## 🎨 CSS Classes

### Game Board
```css
.game-container      /* Main wrapper */
.letter-row         /* Game row */
.letter-box         /* Letter tile */
.filled-box         /* Tile with content */
.correct            /* Green - correct position */
.present            /* Yellow - wrong position */
.absent             /* Gray - not in word */
```

### Interactive Elements
```css
.keyboard-row       /* Keyboard button row */
.wide-button        /* Enter/Delete buttons */
.nav-button         /* Navigation buttons */
.stats-button       /* Statistics button */
.hamburger-menu     /* Mobile menu toggle */
```

### Modals & Overlays
```css
.modal              /* Modal overlay */
.modal-content      /* Modal content */
.close-button       /* Close button */
.stats-content      /* Stats modal */
.words-list         /* Word list container */
```

### Animations
```css
.shake              /* Row shake animation */
.glitch             /* Text glitch effect */
```

## 🔧 Common Code Patterns

### Event Handling
```javascript
// Keyboard input
document.addEventListener("keyup", (e) => {
    if (e.key === "Enter") checkRow();
    if (e.key === "Backspace") deleteLetter();
    if (/[A-Z]/i.test(e.key)) insertLetter(e.key.toUpperCase());
});

// Button clicks
button.addEventListener("click", () => {
    const key = button.getAttribute("data-key");
    if (key === "ENTER") checkRow();
    else if (key === "DELETE") deleteLetter();
    else insertLetter(key);
});
```

### DOM Manipulation
```javascript
// Create game board
function createGameBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const row = document.createElement("div");
        row.className = "letter-row";
        // ... add tiles
        gameBoard.appendChild(row);
    }
}

// Update tile state
function updateTile(row, col, letter, state) {
    const tile = gameBoard.children[row].children[col];
    tile.textContent = letter;
    tile.className = `letter-box ${state}`;
}
```

### Local Storage
```javascript
// Save stats
localStorage.setItem('brainrodle_stats', JSON.stringify(stats));

// Load stats
const stats = JSON.parse(localStorage.getItem('brainrodle_stats')) || defaultStats;

// Check availability
const hasStorage = (() => {
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
    } catch (e) {
        return false;
    }
})();
```

## 🛠️ Utility Functions

### Time & Date
```javascript
// Warsaw timezone
const warsawTime = new Date().toLocaleString('en-US', { 
    timeZone: 'Europe/Warsaw' 
});

// Format time remaining
function formatTime(ms) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
}
```

### Word Validation
```javascript
// Check if word is valid
function isValidWord(word) {
    return WORDS.includes(word.toUpperCase());
}

// Check word length
function checkWordLength(word, expectedLength) {
    return word.length === expectedLength;
}

// Get word description
function getWordDescription(word) {
    return descriptions[word] || "";
}
```

### Random Generation
```javascript
// Seeded random for daily mode
function seededRandom(seed) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

// True random for unlimited mode
function getRandomWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}
```

## 📱 Mobile Support

### Responsive Design
```css
@media (max-width: 768px) {
    /* Tablet styles */
}

@media (max-width: 480px) {
    /* Mobile styles */
}
```

### Touch Events
```javascript
// Prevent zoom on input focus
const meta = document.querySelector('meta[name="viewport"]');
if (meta) {
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
}

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
```

## 🔒 Security Features

### Anti-Cheat
```javascript
// Disable right-click
document.addEventListener('contextmenu', e => e.preventDefault());

// Disable keyboard shortcuts
document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && ['u', 's', 'i', 'c'].includes(e.key)) {
        e.preventDefault();
        return false;
    }
});

// DevTools detection
function checkDevTools() {
    if (window.outerHeight - window.innerHeight > 200 || 
        window.outerWidth - window.innerWidth > 200) {
        document.body.innerHTML = 'Cheating detected!';
    }
}
```

## 🧪 Debug & Testing

### Debug Mode
```javascript
// Enable debug mode
localStorage.setItem('brainrodle_debug', 'true');

// Debug logging
const DEBUG = localStorage.getItem('brainrodle_debug') === 'true';
function debugLog(msg, data) {
    if (DEBUG) console.log(`[Brainrodle] ${msg}`, data);
}
```

### Game State Inspection
```javascript
// Console helper
function inspectGame() {
    return {
        currentRow,
        currentTile,
        isGameOver,
        currentWord,
        stats
    };
}

// Performance monitoring
const perf = { start: Date.now() };
function mark(label) { perf[label] = Date.now() - perf.start; }
function measure(label) { console.log(`${label}: ${Date.now() - perf.start - perf[label]}ms`); }
```

## 📋 Word List Management

### Adding Words
```javascript
// Add to WORDS array
const WORDS = [
    // ... existing words
    "NEWWORD",    // Your new word
    "ANOTHER"     // Another word
];

// Add descriptions
const descriptions = {
    // ... existing descriptions
    "NEWWORD": "Description of new word",
    "ANOTHER": "Description of another word"
};
```

### Word Categories
```javascript
// Themed word lists
const CATEGORIES = {
    classic: ["BASED", "ALPHA", "BETA", "CHAD"],
    modern: ["ACOUSTIC", "BACKSHOT", "BEDROT"],
    expressions: ["AHH", "AYO", "BRUH", "CAP"]
};

// Get random word from category
function getCategoryWord(category) {
    const words = CATEGORIES[category] || WORDS;
    return words[Math.floor(Math.random() * words.length)];
}
```

## 🚀 Performance Tips

### DOM Optimization
```javascript
// Batch DOM updates
const fragment = document.createDocumentFragment();
updates.forEach(update => {
    const element = document.createElement('div');
    // ... configure element
    fragment.appendChild(element);
});
gameBoard.appendChild(fragment);

// Use CSS classes instead of inline styles
element.classList.add('correct');  // Good
element.style.backgroundColor = '#538d4e';  // Avoid
```

### Event Optimization
```javascript
// Event delegation
document.addEventListener('click', (e) => {
    if (e.target.matches('.keyboard-row button')) {
        handleKeyPress(e.target.getAttribute('data-key'));
    }
});

// Debounce frequent events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
```

## 🔗 Integration Examples

### Embedding
```html
<!-- Iframe integration -->
<iframe src="brainrodle/index.html" 
        width="100%" 
        height="600px" 
        frameborder="0">
</iframe>

<!-- Direct integration -->
<div id="brainrodle-game"></div>
<script>
    // Load game into container
    fetch('brainrodle/index.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('brainrodle-game').innerHTML = html;
        });
</script>
```

### API Integration
```javascript
// Custom events
document.addEventListener('brainrodle_game_complete', (e) => {
    const { won, attempts, word } = e.detail;
    // Handle game completion
    analytics.track('game_completed', { won, attempts, word });
});

// External analytics
function updateStats(won, attempts) {
    // ... existing logic
    
    // Google Analytics
    if (window.gtag) {
        gtag('event', 'game_completed', {
            'game_mode': 'daily',
            'result': won ? 'win' : 'loss',
            'attempts': attempts
        });
    }
}
```

## 📚 File Reference

### Core Files
- **`index.html`**: Daily mode interface
- **`unlimited.html`**: Unlimited mode interface
- **`script.js`**: Daily mode logic
- **`unlimited.js`**: Unlimited mode logic
- **`styles.css`**: All styling

### Documentation
- **`README.md`**: Project overview
- **`API_DOCUMENTATION.md`**: Complete API reference
- **`DEVELOPER_GUIDE.md`**: Development guide
- **`QUICK_REFERENCE.md`**: This file

---

**Need more details?** Check the full `API_DOCUMENTATION.md` for comprehensive information or `DEVELOPER_GUIDE.md` for development workflows.