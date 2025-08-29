# Brainrodle CSS Reference

## Overview

This reference documents all CSS classes, styling patterns, and design system used in the Brainrodle game. The game uses a cyberpunk/neon aesthetic with glitch effects and responsive design.

## Design System

### Color Palette

#### Primary Colors
```css
:root {
    --primary-neon: #ff00ff;      /* Hot pink/magenta */
    --secondary-neon: #00ffff;    /* Cyan */
    --background-dark: #0a0a0a;   /* Deep black */
    --background-mid: #1a1a1a;    /* Dark gray */
    --text-primary: #ffffff;      /* White */
    --text-secondary: #cccccc;    /* Light gray */
}
```

#### Game State Colors
```css
:root {
    --correct-color: #538d4e;     /* Green - correct letter */
    --present-color: #b59f3b;     /* Yellow - present letter */
    --absent-color: #3a3a3c;      /* Gray - absent letter */
    --keyboard-default: #818384;  /* Default key color */
    --keyboard-hover: #9ca3af;    /* Key hover state */
}
```

#### Border Colors
```css
:root {
    --border-default: #3a3a3c;    /* Default borders */
    --border-active: #565758;     /* Active/filled state */
    --border-neon: #ff00ff;       /* Neon accent borders */
}
```

### Typography

#### Font Family
```css
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&display=swap');

body {
    font-family: 'Chakra Petch', sans-serif;
}
```

#### Font Weights
- **400**: Regular text, instructions
- **600**: Subtitles, emphasis
- **700**: Headings, game title

#### Font Sizes
```css
/* Headings */
h1 { font-size: 3.5rem; }      /* Main title */
h2 { font-size: 2rem; }        /* Modal titles */
h3 { font-size: 1.5rem; }      /* Section titles */

/* UI Text */
.subtitle { font-size: 1.3rem; }
.instructions { font-size: 1.2rem; }
.nav-button { font-size: 1rem; }

/* Game Elements */
.letter-box { font-size: 2rem; }
.keyboard-row button { font-size: 14px; }
.wide-button { font-size: 12px; }
```

## Layout Classes

### Container Classes

#### `.game-container`
**Purpose:** Main wrapper for entire game interface

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

**Usage:**
- Wraps all game content
- Ensures full viewport height
- Centers content vertically and horizontally
- Prevents horizontal scrolling

#### `.mobile-header`
**Purpose:** Mobile-specific header layout

```css
.mobile-header {
    display: none;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1rem;
}

@media (max-width: 768px) {
    .mobile-header {
        display: flex;
    }
}
```

**Responsive Behavior:**
- Hidden on desktop
- Becomes flex container on mobile
- Contains hamburger menu and title

### Navigation Classes

#### `.nav-menu`
**Purpose:** Main navigation container

```css
.nav-menu {
    text-align: center;
    padding: 1rem;
    background: rgba(26, 26, 27, 0.9);
    border-radius: 10px;
    border: 1px solid #ff00ff;
    backdrop-filter: blur(10px);
}
```

**Mobile Override:**
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
        z-index: 1000;
        padding: 2rem 1rem;
        border-radius: 0;
        border: none;
        border-left: 2px solid #ff00ff;
    }
    
    .nav-menu.show {
        right: 0;
    }
}
```

#### `.nav-buttons`
**Purpose:** Container for navigation buttons

```css
.nav-buttons {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
}

@media (min-width: 769px) {
    .nav-buttons {
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
    }
}
```

### Game Board Classes

#### `#game-board`
**Purpose:** Main playing area container

```css
#game-board {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    padding: 10px;
    margin: 10px auto;
    max-width: 100%;
    overflow-x: auto;
}
```

**Responsive Adjustments:**
```css
@media (max-width: 480px) {
    #game-board {
        gap: 3px;
        padding: 5px;
    }
}
```

#### `.letter-row`
**Purpose:** Container for letter tiles in each guess

```css
.letter-row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    gap: 5px;
    flex-wrap: nowrap;
}

@media (max-width: 480px) {
    .letter-row {
        gap: 3px;
    }
}
```

## Component Classes

### Letter Box Classes

#### `.letter-box`
**Purpose:** Individual letter tile styling

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
    text-transform: uppercase;
    user-select: none;
}
```

**Responsive Sizing:**
```css
@media (max-width: 480px) {
    .letter-box {
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
    }
}

@media (max-width: 320px) {
    .letter-box {
        width: 45px;
        height: 45px;
        font-size: 1.3rem;
    }
}
```

#### `.letter-box.filled-box`
**Purpose:** Styling for tiles with entered letters

```css
.letter-box.filled-box {
    border-color: #565758;
    animation: pulse 0.2s ease-in-out;
    transform: scale(1.05);
}
```

#### Game State Classes

**Correct Letter (Green):**
```css
.letter-box.correct {
    background-color: #538d4e;
    border-color: #538d4e;
    color: white;
    box-shadow: 0 0 10px rgba(83, 141, 78, 0.5);
}
```

**Present Letter (Yellow):**
```css
.letter-box.present {
    background-color: #b59f3b;
    border-color: #b59f3b;
    color: white;
    box-shadow: 0 0 10px rgba(181, 159, 59, 0.5);
}
```

**Absent Letter (Gray):**
```css
.letter-box.absent {
    background-color: #3a3a3c;
    border-color: #3a3a3c;
    color: white;
    opacity: 0.6;
}
```

### Keyboard Classes

#### `#keyboard-container`
**Purpose:** On-screen keyboard wrapper

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

@media (max-width: 480px) {
    #keyboard-container {
        padding: 0.5rem;
        gap: 6px;
        max-width: 100%;
    }
}
```

#### `.keyboard-row`
**Purpose:** Individual keyboard row container

```css
.keyboard-row {
    display: flex;
    gap: 6px;
    justify-content: center;
    width: 100%;
}

@media (max-width: 480px) {
    .keyboard-row {
        gap: 4px;
    }
}
```

#### `.keyboard-row button`
**Purpose:** Individual key styling

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
    text-transform: uppercase;
}
```

**Interactive States:**
```css
.keyboard-row button:hover {
    background-color: #9ca3af;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(255, 0, 255, 0.3);
}

.keyboard-row button:active {
    transform: translateY(1px);
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}

.keyboard-row button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
```

**Mobile Responsive:**
```css
@media (max-width: 480px) {
    .keyboard-row button {
        min-width: 30px;
        height: 45px;
        font-size: 12px;
    }
}
```

#### `.wide-button`
**Purpose:** Special keys (Enter, Delete)

```css
.wide-button {
    min-width: 65px !important;
    font-size: 12px !important;
    padding: 0 8px;
}

@media (max-width: 480px) {
    .wide-button {
        min-width: 50px !important;
        font-size: 10px !important;
        padding: 0 4px;
    }
}
```

### Button Classes

#### `.nav-button`
**Purpose:** Standard navigation buttons

```css
.nav-button {
    background: linear-gradient(135deg, #ff00ff, #8b00ff);
    border: none;
    color: white;
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-width: 180px;
    text-transform: uppercase;
    letter-spacing: 1px;
}
```

**Interactive States:**
```css
.nav-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 0, 255, 0.4);
    background: linear-gradient(135deg, #ff33ff, #9933ff);
}

.nav-button:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(255, 0, 255, 0.3);
}
```

#### `.stats-button`
**Purpose:** Statistics display button

```css
.stats-button {
    background: linear-gradient(135deg, #00ffff, #0080ff);
    border: none;
    color: white;
    padding: 12px 24px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 180px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.stats-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 255, 255, 0.4);
    background: linear-gradient(135deg, #33ffff, #3399ff);
}
```

#### `.hamburger-menu`
**Purpose:** Mobile menu toggle

```css
.hamburger-menu {
    background: none;
    border: 2px solid #ff00ff;
    color: #ff00ff;
    font-size: 1.5rem;
    width: 50px;
    height: 50px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hamburger-menu:hover {
    background: rgba(255, 0, 255, 0.1);
    transform: scale(1.05);
}

.hamburger-menu:active {
    transform: scale(0.95);
    background: rgba(255, 0, 255, 0.2);
}
```

### Modal Classes

#### `.modal`
**Purpose:** Modal overlay base

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
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
```

#### `.modal-content`
**Purpose:** Modal content container

```css
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
    box-shadow: 0 10px 30px rgba(255, 0, 255, 0.3);
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        transform: translateY(-50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
```

#### `.close-button`
**Purpose:** Modal close button

```css
.close-button {
    color: #ff00ff;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s ease;
    position: absolute;
    right: 15px;
    top: 10px;
}

.close-button:hover {
    color: #ff33ff;
    transform: scale(1.2);
}
```

### Message Classes

#### `#message-container`
**Purpose:** Game message display

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
    animation: messageSlide 0.3s ease;
}

@keyframes messageSlide {
    from {
        transform: translate(-50%, -70%);
        opacity: 0;
    }
    to {
        transform: translate(-50%, -50%);
        opacity: 1;
    }
}
```

### Statistics Classes

#### `.stats-container`
**Purpose:** Statistics modal content

```css
.stats-container {
    text-align: center;
    padding: 20px;
}

.stats-row {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 10px;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 60px;
}

.stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #ff00ff;
    text-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
}

.stat-label {
    font-size: 0.9rem;
    color: #ccc;
    margin-top: 5px;
    text-transform: uppercase;
    letter-spacing: 1px;
}
```

#### `.guess-distribution`
**Purpose:** Guess distribution chart

```css
.guess-distribution {
    margin-top: 20px;
}

.distribution-row {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    gap: 10px;
}

.guess-number {
    width: 20px;
    text-align: center;
    font-weight: bold;
    color: #00ffff;
}

.distribution-bar {
    flex: 1;
    height: 20px;
    background-color: #3a3a3c;
    border-radius: 3px;
    overflow: hidden;
    position: relative;
}

.bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #538d4e, #6aaa64);
    transition: width 0.5s ease;
    border-radius: 3px;
}

.guess-count {
    width: 30px;
    text-align: center;
    font-weight: bold;
    color: white;
}
```

### Word List Classes

#### `.words-list`
**Purpose:** Word list container (daily mode)

```css
.words-list {
    max-height: 400px;
    overflow-y: auto;
    margin-top: 20px;
}

.word-item {
    padding: 12px;
    margin-bottom: 8px;
    background: rgba(255, 0, 255, 0.1);
    border: 1px solid rgba(255, 0, 255, 0.3);
    border-radius: 6px;
    text-align: center;
    transition: all 0.2s ease;
    cursor: default;
}

.word-item:hover {
    background: rgba(255, 0, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 0, 255, 0.2);
}

.word-item small {
    color: #ccc;
    font-size: 0.8rem;
    display: block;
    margin-top: 4px;
}
```

#### `.word-list-panel`
**Purpose:** Side panel (unlimited mode)

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

.word-list-panel h3 {
    color: #ff00ff;
    text-align: center;
    margin-bottom: 20px;
    font-size: 1.2rem;
}
```

### Footer Classes

#### `.social-footer`
**Purpose:** Social links footer

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
    backdrop-filter: blur(5px);
}

.social-link:hover {
    background: rgba(255, 0, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 0, 255, 0.3);
}

.social-link svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
}
```

## Animation Classes

### Text Effects

#### `.glitch`
**Purpose:** Glitch effect for main title

```css
@keyframes glitch {
    0%, 100% {
        text-shadow: 
            2px 2px 0px #ff00ff, 
            -2px -2px 0px #00ffff;
    }
    25% {
        text-shadow: 
            -2px 2px 0px #ff00ff, 
            2px -2px 0px #00ffff;
    }
    50% {
        text-shadow: 
            2px -2px 0px #ff00ff, 
            -2px 2px 0px #00ffff;
    }
    75% {
        text-shadow: 
            -2px -2px 0px #ff00ff, 
            2px 2px 0px #00ffff;
    }
}

h1 {
    animation: glitch 3s infinite;
}
```

### Interactive Effects

#### `.shake`
**Purpose:** Row shake animation for invalid input

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

#### `.pulse`
**Purpose:** Pulse animation for filled tiles

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

.letter-box.filled-box {
    animation: pulse 0.2s ease-in-out;
}
```

### Loading Effects

#### `.fade-in`
**Purpose:** Fade in animation

```css
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in {
    animation: fadeIn 0.5s ease-out;
}
```

#### `.slide-in`
**Purpose:** Slide in animation

```css
@keyframes slideIn {
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.slide-in {
    animation: slideIn 0.3s ease-out;
}
```

## Utility Classes

### Display Utilities

```css
.show { display: block !important; }
.hide { display: none !important; }
.invisible { visibility: hidden; }
.visible { visibility: visible; }
```

### Text Utilities

```css
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
.text-uppercase { text-transform: uppercase; }
.text-lowercase { text-transform: lowercase; }
.font-bold { font-weight: bold; }
.font-normal { font-weight: normal; }
```

### Spacing Utilities

```css
.m-0 { margin: 0; }
.m-1 { margin: 0.25rem; }
.m-2 { margin: 0.5rem; }
.m-3 { margin: 0.75rem; }
.m-4 { margin: 1rem; }

.p-0 { padding: 0; }
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
```

### Color Utilities

```css
.text-primary { color: #ff00ff; }
.text-secondary { color: #00ffff; }
.text-white { color: white; }
.text-gray { color: #ccc; }

.bg-primary { background-color: #ff00ff; }
.bg-secondary { background-color: #00ffff; }
.bg-dark { background-color: #1a1a1a; }
.bg-transparent { background-color: transparent; }
```

## Responsive Breakpoints

### Breakpoint System

```css
/* Mobile First Approach */

/* Extra Small Devices (phones, less than 576px) */
@media (max-width: 575.98px) {
    /* Mobile styles */
}

/* Small Devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
    /* Small device styles */
}

/* Medium Devices (tablets, 768px and up) */
@media (min-width: 768px) {
    /* Tablet styles */
}

/* Large Devices (desktops, 992px and up) */
@media (min-width: 992px) {
    /* Desktop styles */
}

/* Extra Large Devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
    /* Large desktop styles */
}
```

### Key Responsive Classes

#### Mobile Navigation
```css
@media (max-width: 768px) {
    .mobile-header { display: flex; }
    .desktop-header { display: none; }
    .nav-menu {
        position: fixed;
        right: -100%;
        transition: right 0.3s ease;
    }
    .nav-menu.show { right: 0; }
}
```

#### Game Board Scaling
```css
@media (max-width: 480px) {
    .letter-box {
        width: 50px;
        height: 50px;
        font-size: 1.5rem;
    }
    .keyboard-row button {
        min-width: 30px;
        height: 45px;
    }
}

@media (max-width: 320px) {
    .letter-box {
        width: 45px;
        height: 45px;
        font-size: 1.3rem;
    }
}
```

## Background Effects

### Scanline Effect

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

### Gradient Backgrounds

```css
body {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
}

.nav-button {
    background: linear-gradient(135deg, #ff00ff, #8b00ff);
}

.stats-button {
    background: linear-gradient(135deg, #00ffff, #0080ff);
}
```

## Usage Examples

### Creating Custom Themes

```css
/* Dark Theme (Default) */
:root[data-theme="dark"] {
    --bg-primary: #0a0a0a;
    --bg-secondary: #1a1a1a;
    --text-primary: #ffffff;
    --accent-primary: #ff00ff;
    --accent-secondary: #00ffff;
}

/* Light Theme */
:root[data-theme="light"] {
    --bg-primary: #ffffff;
    --bg-secondary: #f5f5f5;
    --text-primary: #000000;
    --accent-primary: #8b00ff;
    --accent-secondary: #0080ff;
}

/* Apply theme */
body {
    background-color: var(--bg-primary);
    color: var(--text-primary);
}
```

### Custom Component Styling

```css
/* Custom game tile variant */
.letter-box.special {
    background: linear-gradient(45deg, #ff00ff, #00ffff);
    border: 2px solid gold;
    animation: rainbow 2s infinite;
}

@keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
}

/* Custom button variant */
.nav-button.premium {
    background: linear-gradient(135deg, gold, orange);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}
```

This CSS reference provides comprehensive documentation of all styling classes, design patterns, and responsive behaviors used in the Brainrodle game.