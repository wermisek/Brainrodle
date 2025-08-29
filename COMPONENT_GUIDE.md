# Brainrodle Component Guide

## Overview

This guide documents all UI components, HTML structures, and interactive elements in the Brainrodle game. Each component includes its HTML structure, CSS classes, JavaScript interactions, and usage examples.

## Navigation Components

### Hamburger Menu

**Purpose:** Mobile-responsive navigation toggle

**HTML Structure:**
```html
<button class="hamburger-menu">☰</button>
```

**CSS Classes:**
- `.hamburger-menu`: Styling for the hamburger icon button

**JavaScript Interaction:**
```javascript
hamburgerMenu.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});
```

**Responsive Behavior:**
- Visible only on mobile devices (max-width: 768px)
- Toggles navigation menu visibility
- Changes appearance when menu is active

### Navigation Menu

**Purpose:** Main navigation container with game controls

**HTML Structure:**
```html
<div class="nav-menu">
    <div class="subtitle">Guess the brainrot text!</div>
    <div class="instructions">Press ENTER to confirm • BACKSPACE to delete</div>
    <div class="nav-buttons">
        <!-- Navigation buttons -->
    </div>
</div>
```

**CSS Classes:**
- `.nav-menu`: Main container styling
- `.nav-menu.show`: Active state for mobile
- `.subtitle`: Game mode description
- `.instructions`: Control instructions
- `.nav-buttons`: Button container

**Responsive Behavior:**
```css
@media (max-width: 768px) {
    .nav-menu {
        position: fixed;
        top: 0;
        right: -100%;
        width: 300px;
        height: 100vh;
        transition: right 0.3s ease;
    }
    .nav-menu.show {
        right: 0;
    }
}
```

### Navigation Buttons

#### Daily Mode Buttons

**Game Mode Switcher:**
```html
<button class="nav-button" onclick="window.location.href='unlimited.html'">
    🎮 Unlimited Mode
</button>
```

**Word List Viewer:**
```html
<button class="nav-button" id="viewWordsBtn">📖 View Words</button>
```

**Statistics Display:**
```html
<button class="stats-button">📊 Statistics</button>
```

#### Unlimited Mode Buttons

**Game Mode Switcher:**
```html
<button class="nav-button" onclick="window.location.href='index.html'">
    🏠 Daily Mode
</button>
```

**New Word Generator:**
```html
<button class="nav-button nav-new-word" id="newWordBtn">🔄 New Word</button>
```

**Word List Viewer:**
```html
<button class="nav-button" id="viewWordsBtn">📖 View Words</button>
```

**CSS Classes:**
- `.nav-button`: Standard navigation button styling
- `.nav-new-word`: Special styling for new word button
- `.stats-button`: Statistics button styling

## Game Board Components

### Game Container

**Purpose:** Main wrapper for entire game interface

**HTML Structure:**
```html
<div class="game-container">
    <header>...</header>
    <div id="game-board">...</div>
    <div id="keyboard-container">...</div>
    <div id="message-container"></div>
</div>
```

**CSS Properties:**
```css
.game-container {
    min-height: 100vh;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    position: relative;
    z-index: 2;
    max-width: 100%;
    margin: 0 auto;
    overflow: hidden;
}
```

### Header Component

**Purpose:** Game title and mobile navigation

**HTML Structure:**
```html
<header>
    <div class="mobile-header">
        <button class="hamburger-menu">☰</button>
        <h1>BRAINRODLE</h1>
    </div>
    <h1>BRAINRODLE</h1>
    <div class="nav-menu">...</div>
</header>
```

**Title Styling:**
```css
h1 {
    font-size: 3.5rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 3px;
    text-shadow: 
        2px 2px 0px #ff00ff,
        -2px -2px 0px #00ffff;
    animation: glitch 3s infinite;
}
```

**Mobile Header:**
- Hidden on desktop
- Visible on mobile with hamburger menu
- Responsive title sizing

### Game Board

**Purpose:** Main playing area with letter tiles

**HTML Structure:**
```html
<div id="game-board">
    <div class="letter-row">
        <div class="letter-box"></div>
        <div class="letter-box"></div>
        <div class="letter-box"></div>
        <!-- Dynamic number based on word length -->
    </div>
    <!-- 6 total rows -->
</div>
```

**Dynamic Creation:**
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

### Letter Tiles

**Purpose:** Individual letter input/display cells

**Base CSS:**
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
    transition: all 0.3s ease;
}
```

**State Classes:**

**Filled State:**
```css
.letter-box.filled-box {
    border-color: #565758;
    animation: pulse 0.2s ease-in-out;
    transform: scale(1.1);
}
```

**Correct Letter:**
```css
.letter-box.correct {
    background-color: #538d4e;
    border-color: #538d4e;
    color: white;
}
```

**Present Letter:**
```css
.letter-box.present {
    background-color: #b59f3b;
    border-color: #b59f3b;
    color: white;
}
```

**Absent Letter:**
```css
.letter-box.absent {
    background-color: #3a3a3c;
    border-color: #3a3a3c;
    color: white;
}
```

**Row Styling:**
```css
.letter-row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    gap: 5px;
    flex-wrap: nowrap;
}
```

**Shake Animation:**
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

## Keyboard Components

### Keyboard Container

**Purpose:** On-screen keyboard for letter input

**HTML Structure:**
```html
<div id="keyboard-container">
    <div class="keyboard-row">
        <!-- First row: QWERTYUIOP -->
    </div>
    <div class="keyboard-row">
        <!-- Second row: ASDFGHJKL -->
    </div>
    <div class="keyboard-row">
        <!-- Third row: ENTER ZXCVBNM DELETE -->
    </div>
</div>
```

**Container Styling:**
```css
#keyboard-container {
    margin-top: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 100%;
    max-width: 500px;
}
```

### Keyboard Rows

**Row Structure:**
```css
.keyboard-row {
    display: flex;
    gap: 6px;
    justify-content: center;
    width: 100%;
}
```

### Keyboard Buttons

**Standard Letter Keys:**
```html
<button data-key="Q">Q</button>
<button data-key="W">W</button>
<!-- ... etc -->
```

**Special Action Keys:**
```html
<button data-key="ENTER" class="wide-button">Enter ↵</button>
<button data-key="DELETE" class="wide-button">⌫ Delete</button>
```

**Button Styling:**
```css
.keyboard-row button {
    min-width: 43px;
    height: 58px;
    border-radius: 4px;
    border: none;
    background-color: #818384;
    color: white;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    font-size: 14px;
    transition: all 0.2s ease;
}

.wide-button {
    min-width: 65px !important;
    font-size: 12px !important;
}
```

**Button States:**
```css
.keyboard-row button:hover {
    background-color: #9ca3af;
    transform: translateY(-1px);
}

.keyboard-row button:active {
    transform: translateY(1px);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}
```

**Feedback Colors:**
- Correct: `#538d4e` (Green)
- Present: `#b59f3b` (Yellow)
- Absent: `#3a3a3c` (Dark Gray)

### Keyboard Event Handling

**Button Click Handler:**
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

## Modal Components

### Word List Modal (Daily Mode)

**Purpose:** Displays all available words with descriptions

**HTML Structure:**
```html
<div id="words-modal" class="modal">
    <div class="modal-content">
        <span class="close-button">&times;</span>
        <h2>Word List</h2>
        <div class="words-list">
            <!-- Populated dynamically -->
        </div>
    </div>
</div>
```

**Modal Styling:**
```css
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
}

.modal-content {
    background-color: #1a1a1b;
    margin: 5% auto;
    padding: 20px;
    border: 2px solid #ff00ff;
    width: 90%;
    max-width: 600px;
    max-height: 80%;
    overflow-y: auto;
    border-radius: 10px;
    position: relative;
}
```

**Word Item Structure:**
```html
<div class="word-item">
    WORD<br>
    <small>Description text</small>
</div>
```

**Word Item Styling:**
```css
.word-item {
    padding: 12px;
    margin-bottom: 8px;
    background: rgba(255, 0, 255, 0.1);
    border: 1px solid rgba(255, 0, 255, 0.3);
    border-radius: 6px;
    text-align: center;
    transition: all 0.2s ease;
}

.word-item:hover {
    background: rgba(255, 0, 255, 0.2);
    transform: translateY(-2px);
}
```

### Word List Panel (Unlimited Mode)

**Purpose:** Side panel for word browsing in unlimited mode

**HTML Structure:**
```html
<div class="word-list-panel">
    <h3>Word List</h3>
    <div id="word-list-content">
        <!-- Populated dynamically -->
    </div>
</div>
```

**Panel Styling:**
```css
.word-list-panel {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 250px;
    background: rgba(26, 26, 27, 0.95);
    padding: 20px;
    overflow-y: auto;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 1000;
    border-left: 2px solid #ff00ff;
    backdrop-filter: blur(10px);
}

.word-list-panel.show {
    transform: translateX(0);
}
```

## Message Components

### Message Container

**Purpose:** Displays game messages and feedback

**HTML Structure:**
```html
<div id="message-container"></div>
```

**Styling:**
```css
#message-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(26, 26, 27, 0.95);
    color: white;
    padding: 20px 30px;
    border-radius: 10px;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    z-index: 1000;
    border: 2px solid #ff00ff;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgba(255, 0, 255, 0.3);
    display: none;
}
```

**Usage Examples:**
```javascript
showMessage("Word not in list!", 2000);
showMessage("Congratulations! 🎉");
showMessage("Game Over! The word was SIGMA");
```

## Statistics Components

### Statistics Modal

**Purpose:** Displays player performance statistics

**Dynamic Content Structure:**
```html
<div class="stats-container">
    <div class="stats-row">
        <div class="stat-item">
            <div class="stat-number">${stats.gamesPlayed}</div>
            <div class="stat-label">Played</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${winPercentage}%</div>
            <div class="stat-label">Win %</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${stats.currentStreak}</div>
            <div class="stat-label">Current Streak</div>
        </div>
        <div class="stat-item">
            <div class="stat-number">${stats.bestStreak}</div>
            <div class="stat-label">Best Streak</div>
        </div>
    </div>
    
    <div class="guess-distribution">
        <h3>Guess Distribution</h3>
        <!-- Distribution bars -->
    </div>
</div>
```

**Statistics Styling:**
```css
.stats-container {
    text-align: center;
    padding: 20px;
}

.stats-row {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #ff00ff;
}

.stat-label {
    font-size: 0.9rem;
    color: #ccc;
    margin-top: 5px;
}
```

### Guess Distribution Chart

**Purpose:** Visual representation of guess attempts

**Dynamic Generation:**
```javascript
const maxGuesses = Math.max(...stats.guessDistribution);
const distributionHTML = stats.guessDistribution.map((count, index) => {
    const width = maxGuesses > 0 ? (count / maxGuesses) * 100 : 0;
    return `
        <div class="distribution-row">
            <div class="guess-number">${index + 1}</div>
            <div class="distribution-bar">
                <div class="bar-fill" style="width: ${width}%"></div>
            </div>
            <div class="guess-count">${count}</div>
        </div>
    `;
}).join('');
```

**Chart Styling:**
```css
.distribution-row {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.guess-number {
    width: 20px;
    text-align: center;
    font-weight: bold;
}

.distribution-bar {
    flex: 1;
    height: 20px;
    background-color: #3a3a3c;
    margin: 0 10px;
    border-radius: 3px;
    overflow: hidden;
}

.bar-fill {
    height: 100%;
    background-color: #538d4e;
    transition: width 0.5s ease;
}

.guess-count {
    width: 30px;
    text-align: center;
    font-weight: bold;
}
```

## Footer Components

### Social Footer

**Purpose:** External links and attribution

**HTML Structure:**
```html
<footer class="social-footer">
    <a href="https://github.com/wermisek" target="_blank" class="social-link">
        <svg><!-- GitHub icon --></svg>
        GitHub
    </a>
</footer>
```

**Footer Styling:**
```css
.social-footer {
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 100;
}

.social-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #ff00ff;
    text-decoration: none;
    font-size: 14px;
    padding: 8px 12px;
    background: rgba(26, 26, 27, 0.8);
    border-radius: 20px;
    border: 1px solid #ff00ff;
    transition: all 0.2s ease;
}

.social-link:hover {
    background: rgba(255, 0, 255, 0.1);
    transform: translateY(-2px);
}
```

## Responsive Design Components

### Mobile Adaptations

**Breakpoint:** `max-width: 768px`

**Header Changes:**
```css
@media (max-width: 768px) {
    .mobile-header {
        display: flex;
    }
    
    header h1:not(.mobile-header h1) {
        display: none;
    }
}
```

**Navigation Changes:**
```css
@media (max-width: 768px) {
    .nav-menu {
        position: fixed;
        top: 0;
        right: -100%;
        width: 300px;
        height: 100vh;
        background: rgba(26, 26, 27, 0.98);
        backdrop-filter: blur(10px);
        transition: right 0.3s ease;
    }
}
```

**Game Board Scaling:**
```css
@media (max-width: 480px) {
    .letter-box {
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
    }
    
    #game-board {
        gap: 3px;
    }
}
```

**Keyboard Scaling:**
```css
@media (max-width: 480px) {
    .keyboard-row button {
        min-width: 30px;
        height: 45px;
        font-size: 12px;
    }
    
    .wide-button {
        min-width: 50px !important;
        font-size: 10px !important;
    }
}
```

## Animation Components

### Glitch Effect

**Applied to:** Main title

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

### Pulse Animation

**Applied to:** Filled letter boxes

```css
@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}
```

### Scanline Effect

**Applied to:** Body background

```css
body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.15) 0px,
        rgba(0, 0, 0, 0.15) 1px,
        transparent 1px,
        transparent 2px
    );
    pointer-events: none;
    z-index: 1;
}
```

## Usage Examples

### Creating Custom Components

**Custom Message Component:**
```javascript
function createCustomMessage(text, type = 'info') {
    const messageElement = document.createElement('div');
    messageElement.className = `custom-message ${type}`;
    messageElement.textContent = text;
    
    document.body.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}
```

**Custom Keyboard Layout:**
```javascript
function createCustomKeyboard(layout) {
    const container = document.getElementById('keyboard-container');
    container.innerHTML = '';
    
    layout.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.className = 'keyboard-row';
        
        row.forEach(key => {
            const button = document.createElement('button');
            button.setAttribute('data-key', key);
            button.textContent = key;
            button.addEventListener('click', () => handleKeyPress(key));
            rowElement.appendChild(button);
        });
        
        container.appendChild(rowElement);
    });
}
```

This component guide provides comprehensive documentation for all UI components in the Brainrodle game, including their structure, styling, interactions, and responsive behavior.