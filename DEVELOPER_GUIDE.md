# 🚀 Brainrodle Developer Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Development Setup](#development-setup)
4. [Core Concepts](#core-concepts)
5. [Customization Guide](#customization-guide)
6. [Integration Examples](#integration-examples)
7. [Testing and Debugging](#testing-and-debugging)
8. [Performance Optimization](#performance-optimization)
9. [Deployment Guide](#deployment-guide)
10. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites
- Modern web browser with ES6+ support
- Basic knowledge of HTML, CSS, and JavaScript
- Text editor or IDE (VS Code recommended)
- Local development server (optional but recommended)

### Quick Start
1. Clone or download the project files
2. Open `index.html` in a web browser
3. Start playing the daily word game
4. Switch to unlimited mode for extended gameplay

### Development Environment Setup
```bash
# If using a local server (recommended)
python -m http.server 8000
# or
npx serve .

# Open http://localhost:8000 in your browser
```

## Project Structure

```
brainrodle/
├── index.html          # Daily mode main page
├── unlimited.html      # Unlimited mode page
├── script.js           # Daily mode game logic
├── unlimited.js        # Unlimited mode game logic
├── styles.css          # Main stylesheet
├── README.md           # Project overview
├── API_DOCUMENTATION.md # Complete API reference
└── DEVELOPER_GUIDE.md  # This file
```

### File Responsibilities

- **`index.html`**: Daily mode interface and structure
- **`unlimited.html`**: Unlimited mode interface and structure
- **`script.js`**: Core game logic, daily word generation, statistics
- **`unlimited.js`**: Unlimited mode logic, random word selection
- **`styles.css`**: All styling, animations, and responsive design

## Development Setup

### Local Development
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd brainrodle
   ```

2. **Set up a local server**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   - Navigate to `http://localhost:8000`
   - Use browser dev tools for debugging

### Development Tools
- **Browser DevTools**: Essential for debugging and testing
- **Console**: Monitor game state and debug issues
- **Network Tab**: Check for any external resource loading
- **Elements Tab**: Inspect DOM structure and CSS

## Core Concepts

### Game State Management
The game uses a simple state management pattern with global variables:

```javascript
// Core state variables
let currentRow = 0;        // Current row (0-5)
let currentTile = 0;       // Current tile position
let isGameOver = false;    // Game completion status
let currentWord = "";      // Target word to guess
let gameBoard;             // DOM reference to game board
```

### Word Generation Strategy
- **Daily Mode**: Deterministic seeding based on Warsaw timezone
- **Unlimited Mode**: True random selection from word list

```javascript
// Daily mode - deterministic
function getDailyWord() {
    const warsawTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Warsaw' });
    const today = new Date(warsawTime).toISOString().split('T')[0];
    let seed = today.split('-').reduce((acc, num) => acc + parseInt(num), 0);
    // ... seeding logic
}

// Unlimited mode - random
function getRandomWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}
```

### Event-Driven Architecture
The game follows an event-driven pattern:

```javascript
// Keyboard events
document.addEventListener("keyup", handleKeyPress);

// Button clicks
button.addEventListener("click", handleButtonClick);

// Game state changes
function checkRow() {
    // ... validation logic
    if (gameWon) {
        updateStats(true, attempts);
        showMessage("Congratulations! 🎉");
    }
}
```

## Customization Guide

### Adding New Words
To add new words to the game:

1. **Update the WORDS array** in both `script.js` and `unlimited.js`:
   ```javascript
   const WORDS = [
       // Existing words...
       "NEWWORD",    // Your new word
       "ANOTHER",    // Another new word
       // ... more words
   ];
   ```

2. **Add descriptions** in `script.js`:
   ```javascript
   function getWordDescription(word) {
       const descriptions = {
           // Existing descriptions...
           "NEWWORD": "Description of your new word",
           "ANOTHER": "Description of another word",
           // ... more descriptions
       };
       return descriptions[word] || "";
   }
   ```

### Modifying Game Rules
To change game mechanics:

1. **Adjust attempts limit**:
   ```javascript
   // Change from 6 to 8 attempts
   for (let i = 0; i < 8; i++) {  // Instead of 6
       // ... row creation logic
   }
   ```

2. **Modify word length**:
   ```javascript
   // Ensure all words have consistent length
   const WORDS = [
       "FIVE",      // 4 letters
       "SEVEN",     // 5 letters
       // ... ensure consistency
   ];
   ```

3. **Change scoring system**:
   ```javascript
   function updateStats(won, attempts) {
       // Custom scoring logic
       if (won) {
           const score = Math.max(0, 100 - (attempts * 10));
           // ... save score
       }
   }
   ```

### Styling Customization
To modify the visual appearance:

1. **Color scheme** in `styles.css`:
   ```css
   :root {
       --primary-color: #ff00ff;      /* Neon pink */
       --secondary-color: #00ffff;    /* Neon cyan */
       --background-color: #0a0a0a;   /* Dark background */
       --text-color: #ffffff;         /* White text */
   }
   ```

2. **Animation timing**:
   ```css
   .shake {
       animation: shake 0.5s ease-in-out; /* Adjust duration */
   }
   
   .glitch {
       animation: glitch 3s infinite; /* Adjust frequency */
   }
   ```

3. **Responsive breakpoints**:
   ```css
   @media (max-width: 768px) {
       /* Mobile-specific styles */
   }
   
   @media (max-width: 480px) {
       /* Small mobile styles */
   }
   ```

## Integration Examples

### Embedding in Another Website
To integrate Brainrodle into an existing website:

```html
<!-- In your HTML -->
<div id="brainrodle-container">
    <iframe src="brainrodle/index.html" 
            width="100%" 
            height="600px" 
            frameborder="0"
            scrolling="no">
    </iframe>
</div>
```

### API Integration
To use Brainrodle functions in external code:

```javascript
// Wait for game to load
document.addEventListener('DOMContentLoaded', () => {
    // Access game functions (if made globally available)
    if (window.brainrodle) {
        const game = window.brainrodle;
        
        // Start a new game
        game.resetGame();
        
        // Get current word (for testing)
        console.log(game.currentWord);
    }
});
```

### Custom Word Lists
To implement custom word categories:

```javascript
// Create themed word lists
const TECH_WORDS = ["PYTHON", "JAVASCRIPT", "REACT", "NODEJS"];
const FOOD_WORDS = ["PIZZA", "BURGER", "SUSHI", "TACOS"];

// Dynamic word selection
function getThemedWord(category) {
    const wordLists = {
        tech: TECH_WORDS,
        food: FOOD_WORDS,
        default: WORDS
    };
    
    const selectedList = wordLists[category] || wordLists.default;
    return selectedList[Math.floor(Math.random() * selectedList.length)];
}
```

### Statistics Integration
To integrate with external analytics:

```javascript
// Enhanced statistics tracking
function updateStats(won, attempts) {
    // Original logic
    // ... existing code ...
    
    // External analytics
    if (window.gtag) {
        gtag('event', 'game_completed', {
            'game_mode': 'daily',
            'result': won ? 'win' : 'loss',
            'attempts': attempts,
            'word_length': currentWord.length
        });
    }
    
    // Custom event for other integrations
    const event = new CustomEvent('brainrodle_game_complete', {
        detail: { won, attempts, word: currentWord }
    });
    document.dispatchEvent(event);
}
```

## Testing and Debugging

### Console Debugging
Enable detailed logging for development:

```javascript
// Add to the top of script files for debugging
const DEBUG = true;

function debugLog(message, data) {
    if (DEBUG) {
        console.log(`[Brainrodle] ${message}`, data);
    }
}

// Usage throughout the code
debugLog('Game state updated', { currentRow, currentTile, isGameOver });
```

### Game State Inspection
Monitor game state in real-time:

```javascript
// Add to browser console for debugging
function inspectGameState() {
    return {
        currentRow,
        currentTile,
        isGameOver,
        currentWord,
        gameBoard: gameBoard ? gameBoard.children.length : 'Not initialized',
        stats: stats || 'Not loaded'
    };
}

// Use in console: inspectGameState()
```

### Testing Game Logic
Create test scenarios:

```javascript
// Test word validation
function testWordValidation() {
    const testWords = ["VALID", "INVALID", "TOOLONG", "SHORT"];
    
    testWords.forEach(word => {
        const isValid = WORDS.includes(word);
        console.log(`${word}: ${isValid ? 'Valid' : 'Invalid'}`);
    });
}

// Test game flow
function testGameFlow() {
    // Simulate a complete game
    resetGame();
    console.log('Game reset, word:', currentWord);
    
    // Simulate typing
    insertLetter('A');
    console.log('Inserted A, current tile:', currentTile);
}
```

### Error Handling
Implement robust error handling:

```javascript
// Enhanced error handling
function safeExecute(fn, context = 'Unknown') {
    try {
        return fn();
    } catch (error) {
        console.error(`[Brainrodle] Error in ${context}:`, error);
        
        // Graceful fallback
        showMessage("An error occurred. Please refresh the page.");
        
        // Report error (in production)
        if (window.errorReporting) {
            window.errorReporting.captureException(error);
        }
        
        return null;
    }
}

// Usage
safeExecute(() => checkRow(), 'checkRow');
```

## Performance Optimization

### DOM Manipulation
Optimize DOM updates:

```javascript
// Batch DOM updates
function updateGameBoard(updates) {
    const fragment = document.createDocumentFragment();
    
    updates.forEach(update => {
        const element = document.createElement('div');
        element.className = update.className;
        element.textContent = update.text;
        fragment.appendChild(element);
    });
    
    gameBoard.appendChild(fragment);
}

// Instead of multiple individual updates
// updateGameBoard([{ className: 'letter-box', text: 'A' }, ...]);
```

### Event Delegation
Reduce event listener overhead:

```javascript
// Single event listener for keyboard
document.addEventListener('click', (e) => {
    if (e.target.matches('.keyboard-row button')) {
        const key = e.target.getAttribute('data-key');
        handleKeyPress(key);
    }
    
    if (e.target.matches('.nav-button')) {
        const action = e.target.dataset.action;
        handleNavigation(action);
    }
});
```

### Memory Management
Prevent memory leaks:

```javascript
// Clean up intervals and timeouts
let gameTimer;

function startGameTimer() {
    gameTimer = setInterval(updateTimer, 1000);
}

function stopGameTimer() {
    if (gameTimer) {
        clearInterval(gameTimer);
        gameTimer = null;
    }
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    stopGameTimer();
    // Clean up other resources
});
```

### Lazy Loading
Implement lazy loading for non-critical features:

```javascript
// Lazy load word descriptions
const wordDescriptions = new Map();

async function getWordDescriptionAsync(word) {
    if (wordDescriptions.has(word)) {
        return wordDescriptions.get(word);
    }
    
    // Simulate API call or heavy computation
    const description = await fetchWordDescription(word);
    wordDescriptions.set(word, description);
    
    return description;
}
```

## Deployment Guide

### Production Build
Prepare for production deployment:

1. **Minify JavaScript** (optional):
   ```bash
   # Using terser
   npm install -g terser
   terser script.js -o script.min.js
   terser unlimited.js -o unlimited.min.js
   ```

2. **Optimize CSS** (optional):
   ```bash
   # Using cssnano
   npm install -g cssnano
   cssnano styles.css styles.min.css
   ```

3. **Update HTML references**:
   ```html
   <!-- Change from -->
   <script src="script.js"></script>
   
   <!-- To -->
   <script src="script.min.js"></script>
   ```

### Deployment Options

#### Static Hosting
- **GitHub Pages**: Free hosting for public repositories
- **Netlify**: Drag-and-drop deployment with custom domains
- **Vercel**: Fast deployment with automatic builds
- **Firebase Hosting**: Google's hosting solution

#### Server Deployment
- **Apache**: Standard web server
- **Nginx**: High-performance web server
- **Node.js**: Express.js server
- **Python**: Flask or Django server

### Environment Configuration
Set up environment-specific settings:

```javascript
// Environment configuration
const CONFIG = {
    development: {
        debug: true,
        apiUrl: 'http://localhost:3000',
        enableLogging: true
    },
    production: {
        debug: false,
        apiUrl: 'https://api.yoursite.com',
        enableLogging: false
    }
};

const currentEnv = window.location.hostname === 'localhost' ? 'development' : 'production';
const settings = CONFIG[currentEnv];
```

### CDN Integration
Use CDN for better performance:

```html
<!-- External resources via CDN -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&display=swap" rel="stylesheet">

<!-- Self-hosted fallback -->
<script>
    // Check if fonts loaded, fallback to system fonts
    document.fonts.ready.then(() => {
        if (!document.fonts.check('1em Chakra Petch')) {
            document.body.style.fontFamily = 'monospace, sans-serif';
        }
    });
</script>
```

## Troubleshooting

### Common Issues

#### Game Not Loading
```javascript
// Check if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}

function initializeGame() {
    // Game initialization logic
    console.log('Game initializing...');
}
```

#### Statistics Not Saving
```javascript
// Check localStorage availability
function checkLocalStorage() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        console.warn('localStorage not available:', e);
        return false;
    }
}

// Fallback to sessionStorage or memory
if (!checkLocalStorage()) {
    // Implement alternative storage
    window.gameStats = {};
}
```

#### Mobile Issues
```javascript
// Mobile-specific fixes
function detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (detectMobile()) {
    // Mobile-specific adjustments
    document.body.classList.add('mobile-device');
    
    // Prevent zoom on input focus
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    }
}
```

#### Performance Issues
```javascript
// Performance monitoring
const performance = {
    start: Date.now(),
    marks: new Map()
};

function mark(label) {
    performance.marks.set(label, Date.now() - performance.start);
}

function measure(label) {
    const start = performance.marks.get(label);
    if (start) {
        const duration = Date.now() - performance.start - start;
        console.log(`${label}: ${duration}ms`);
    }
}

// Usage
mark('gameStart');
// ... game logic
measure('gameStart');
```

### Debug Mode
Enable comprehensive debugging:

```javascript
// Debug mode toggle
const DEBUG_MODE = localStorage.getItem('brainrodle_debug') === 'true';

function toggleDebugMode() {
    const newMode = !DEBUG_MODE;
    localStorage.setItem('brainrodle_debug', newMode);
    location.reload();
}

// Debug panel (only in debug mode)
if (DEBUG_MODE) {
    const debugPanel = document.createElement('div');
    debugPanel.innerHTML = `
        <div style="position: fixed; top: 10px; right: 10px; background: rgba(0,0,0,0.8); color: white; padding: 10px; z-index: 10000;">
            <h4>Debug Mode</h4>
            <p>Current Word: ${currentWord}</p>
            <p>Current Row: ${currentRow}</p>
            <p>Game Over: ${isGameOver}</p>
            <button onclick="toggleDebugMode()">Disable Debug</button>
        </div>
    `;
    document.body.appendChild(debugPanel);
}
```

### Support and Resources
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Refer to `API_DOCUMENTATION.md`
- **Community**: Join discussions and share solutions
- **Examples**: Check integration examples and use cases

---

This developer guide provides comprehensive information for customizing, extending, and deploying the Brainrodle word game. For specific API details, refer to the `API_DOCUMENTATION.md` file.