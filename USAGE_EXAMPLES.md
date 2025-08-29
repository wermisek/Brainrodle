# Brainrodle Usage Examples & Integration Guide

## Overview

This guide provides practical examples for integrating, customizing, and extending the Brainrodle game. It includes code samples, implementation patterns, and best practices for developers.

## Table of Contents

1. [Basic Integration](#basic-integration)
2. [Custom Game Modes](#custom-game-modes)
3. [Word List Management](#word-list-management)
4. [Statistics Integration](#statistics-integration)
5. [UI Customization](#ui-customization)
6. [API Integration](#api-integration)
7. [Mobile Optimization](#mobile-optimization)
8. [Performance Optimization](#performance-optimization)
9. [Accessibility Enhancements](#accessibility-enhancements)
10. [Testing Examples](#testing-examples)

## Basic Integration

### Embedding in Existing Website

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website - Brainrodle Game</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        /* Custom integration styles */
        .game-wrapper {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: rgba(26, 26, 27, 0.95);
            border-radius: 15px;
            border: 2px solid #ff00ff;
        }
    </style>
</head>
<body>
    <header>
        <nav><!-- Your site navigation --></nav>
    </header>
    
    <main>
        <div class="game-wrapper">
            <!-- Brainrodle game content -->
            <div class="game-container">
                <!-- Game components here -->
            </div>
        </div>
    </main>
    
    <footer><!-- Your site footer --></footer>
    
    <script src="script.js"></script>
</body>
</html>
```

### Initialize Game with Custom Configuration

```javascript
// Custom game initialization
class BrainrodleGame {
    constructor(config = {}) {
        this.config = {
            wordLength: config.wordLength || null, // Auto-detect if null
            maxAttempts: config.maxAttempts || 6,
            timeZone: config.timeZone || 'Europe/Warsaw',
            customWords: config.customWords || [],
            enableStats: config.enableStats !== false,
            enableSounds: config.enableSounds || false,
            theme: config.theme || 'neon',
            ...config
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadCustomWords();
        this.applyTheme();
        this.createGameBoard();
    }
    
    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeGame();
        });
    }
    
    loadCustomWords() {
        if (this.config.customWords.length > 0) {
            WORDS.push(...this.config.customWords);
        }
    }
    
    applyTheme() {
        document.body.setAttribute('data-theme', this.config.theme);
    }
}

// Usage
const game = new BrainrodleGame({
    maxAttempts: 8,
    customWords: ['CUSTOM', 'WORDS', 'HERE'],
    enableSounds: true,
    theme: 'classic'
});
```

## Custom Game Modes

### Timed Mode Implementation

```javascript
class TimedBrainrodle extends BrainrodleGame {
    constructor(config) {
        super(config);
        this.timeLimit = config.timeLimit || 300; // 5 minutes
        this.timeRemaining = this.timeLimit;
        this.timerInterval = null;
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.timeRemaining <= 0) {
                this.endGameByTimeout();
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const timerElement = document.getElementById('timer-display');
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    endGameByTimeout() {
        clearInterval(this.timerInterval);
        isGameOver = true;
        showMessage(`Time's up! The word was ${currentWord}`);
        updateStats(false, currentRow + 1);
    }
    
    resetGame() {
        super.resetGame();
        this.timeRemaining = this.timeLimit;
        this.startTimer();
    }
}

// Usage
const timedGame = new TimedBrainrodle({
    timeLimit: 180, // 3 minutes
    maxAttempts: 10
});
```

### Multiplayer Mode Structure

```javascript
class MultiplayerBrainrodle {
    constructor(config) {
        this.players = config.players || [];
        this.currentPlayer = 0;
        this.gameState = {
            word: getDailyWord(),
            attempts: {},
            scores: {},
            finished: false
        };
        
        this.initPlayers();
    }
    
    initPlayers() {
        this.players.forEach(player => {
            this.gameState.attempts[player.id] = [];
            this.gameState.scores[player.id] = 0;
        });
    }
    
    switchPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        this.updatePlayerDisplay();
    }
    
    submitGuess(guess) {
        const playerId = this.players[this.currentPlayer].id;
        const result = this.validateGuess(guess);
        
        this.gameState.attempts[playerId].push({
            guess: guess,
            result: result,
            timestamp: Date.now()
        });
        
        if (result.isCorrect) {
            this.gameState.scores[playerId] += this.calculateScore(result);
            this.endGame(playerId);
        } else {
            this.switchPlayer();
        }
        
        this.saveGameState();
    }
    
    calculateScore(result) {
        const baseScore = 100;
        const attemptBonus = Math.max(0, (6 - result.attemptNumber) * 10);
        const timeBonus = Math.max(0, (300 - result.timeElapsed) / 10);
        
        return Math.round(baseScore + attemptBonus + timeBonus);
    }
}
```

### Challenge Mode with Special Rules

```javascript
class ChallengeBrainrodle extends BrainrodleGame {
    constructor(config) {
        super(config);
        this.challenges = [
            'no_vowels_shown',    // Don't show vowel feedback
            'reverse_colors',     // Swap green/yellow meanings
            'limited_backspace',  // Only 3 backspaces allowed
            'blind_mode',         // No visual feedback until end
            'speed_round'         // Must guess within 30 seconds per word
        ];
        this.activeChallenge = config.challenge || this.getRandomChallenge();
        this.challengeData = {};
    }
    
    getRandomChallenge() {
        return this.challenges[Math.floor(Math.random() * this.challenges.length)];
    }
    
    applyChallenge() {
        switch (this.activeChallenge) {
            case 'no_vowels_shown':
                this.hideVowelFeedback();
                break;
            case 'reverse_colors':
                this.reverseColorMeanings();
                break;
            case 'limited_backspace':
                this.challengeData.backspacesLeft = 3;
                this.limitBackspace();
                break;
            case 'blind_mode':
                this.enableBlindMode();
                break;
            case 'speed_round':
                this.enableSpeedMode();
                break;
        }
    }
    
    hideVowelFeedback() {
        const originalCheckRow = checkRow;
        checkRow = function() {
            const result = originalCheckRow.call(this);
            // Hide feedback for vowels
            document.querySelectorAll('.letter-box').forEach(box => {
                if ('AEIOU'.includes(box.textContent)) {
                    box.className = 'letter-box filled-box'; // Remove color classes
                }
            });
            return result;
        };
    }
}
```

## Word List Management

### Dynamic Word Loading

```javascript
class WordManager {
    constructor() {
        this.baseWords = [...WORDS];
        this.customWords = [];
        this.categories = {};
        this.difficulty = 'normal';
    }
    
    async loadWordsFromAPI(endpoint) {
        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            
            if (data.words && Array.isArray(data.words)) {
                this.customWords = data.words.map(w => w.toUpperCase());
                return true;
            }
        } catch (error) {
            console.error('Failed to load words from API:', error);
            return false;
        }
    }
    
    loadWordsFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const words = e.target.result
                        .split('\n')
                        .map(w => w.trim().toUpperCase())
                        .filter(w => w.length > 0);
                    
                    this.customWords = words;
                    resolve(words);
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsText(file);
        });
    }
    
    categorizeWords() {
        const categories = {
            short: [], // 3-4 letters
            medium: [], // 5-6 letters
            long: [], // 7+ letters
            slang: [],
            technical: [],
            popular: []
        };
        
        this.getAllWords().forEach(word => {
            // Length categorization
            if (word.length <= 4) categories.short.push(word);
            else if (word.length <= 6) categories.medium.push(word);
            else categories.long.push(word);
            
            // Content categorization (simplified)
            if (this.isSlangWord(word)) categories.slang.push(word);
            if (this.isTechnicalWord(word)) categories.technical.push(word);
            if (this.isPopularWord(word)) categories.popular.push(word);
        });
        
        this.categories = categories;
        return categories;
    }
    
    getWordsByDifficulty(difficulty) {
        const difficultyMap = {
            easy: this.categories.short || [],
            normal: this.categories.medium || [],
            hard: this.categories.long || []
        };
        
        return difficultyMap[difficulty] || this.getAllWords();
    }
    
    getAllWords() {
        return [...this.baseWords, ...this.customWords];
    }
    
    getRandomWordByCategory(category) {
        const words = this.categories[category] || this.getAllWords();
        return words[Math.floor(Math.random() * words.length)];
    }
    
    isSlangWord(word) {
        const slangIndicators = ['YEET', 'BRUH', 'SIGMA', 'ALPHA', 'BASED'];
        return slangIndicators.includes(word);
    }
    
    isTechnicalWord(word) {
        const techWords = ['API', 'JSON', 'HTTP', 'CSS', 'HTML'];
        return techWords.includes(word);
    }
    
    isPopularWord(word) {
        // Could be based on usage statistics
        const popularWords = ['VIRAL', 'TREND', 'MEME', 'TIKTOK'];
        return popularWords.includes(word);
    }
}

// Usage
const wordManager = new WordManager();

// Load words from API
wordManager.loadWordsFromAPI('/api/words').then(success => {
    if (success) {
        wordManager.categorizeWords();
        console.log('Categories:', wordManager.categories);
    }
});

// Load words from file
const fileInput = document.getElementById('word-file');
fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        try {
            const words = await wordManager.loadWordsFromFile(file);
            console.log(`Loaded ${words.length} words`);
        } catch (error) {
            console.error('Error loading file:', error);
        }
    }
});
```

### Word Validation System

```javascript
class WordValidator {
    constructor() {
        this.validationRules = [
            this.checkLength,
            this.checkCharacters,
            this.checkProfanity,
            this.checkDifficulty
        ];
        this.profanityList = []; // Load from external source
        this.minLength = 3;
        this.maxLength = 10;
    }
    
    validateWord(word) {
        const results = {
            isValid: true,
            errors: [],
            warnings: []
        };
        
        for (const rule of this.validationRules) {
            const result = rule.call(this, word);
            if (!result.valid) {
                results.isValid = false;
                results.errors.push(result.error);
            }
            if (result.warning) {
                results.warnings.push(result.warning);
            }
        }
        
        return results;
    }
    
    checkLength(word) {
        if (word.length < this.minLength) {
            return { valid: false, error: `Word too short (minimum ${this.minLength} letters)` };
        }
        if (word.length > this.maxLength) {
            return { valid: false, error: `Word too long (maximum ${this.maxLength} letters)` };
        }
        return { valid: true };
    }
    
    checkCharacters(word) {
        if (!/^[A-Z]+$/.test(word)) {
            return { valid: false, error: 'Word contains invalid characters' };
        }
        return { valid: true };
    }
    
    checkProfanity(word) {
        if (this.profanityList.includes(word)) {
            return { valid: false, error: 'Word contains inappropriate content' };
        }
        return { valid: true };
    }
    
    checkDifficulty(word) {
        const difficulty = this.calculateDifficulty(word);
        if (difficulty > 8) {
            return { 
                valid: true, 
                warning: 'Word might be too difficult for most players' 
            };
        }
        return { valid: true };
    }
    
    calculateDifficulty(word) {
        let difficulty = word.length;
        
        // Add difficulty for uncommon letters
        const uncommonLetters = 'QXZJK';
        for (const letter of word) {
            if (uncommonLetters.includes(letter)) {
                difficulty += 1;
            }
        }
        
        // Add difficulty for repeated letters
        const letterCounts = {};
        for (const letter of word) {
            letterCounts[letter] = (letterCounts[letter] || 0) + 1;
            if (letterCounts[letter] > 1) {
                difficulty += 0.5;
            }
        }
        
        return difficulty;
    }
    
    suggestAlternatives(word) {
        const alternatives = [];
        const wordLength = word.length;
        
        // Find words with similar length
        const similarLength = WORDS.filter(w => 
            Math.abs(w.length - wordLength) <= 1
        );
        
        // Find words with similar letters
        const wordLetters = new Set(word);
        const similarLetters = WORDS.filter(w => {
            const wLetters = new Set(w);
            const intersection = new Set([...wordLetters].filter(x => wLetters.has(x)));
            return intersection.size >= Math.min(wordLetters.size, wLetters.size) * 0.6;
        });
        
        alternatives.push(...similarLength.slice(0, 3));
        alternatives.push(...similarLetters.slice(0, 3));
        
        return [...new Set(alternatives)]; // Remove duplicates
    }
}
```

## Statistics Integration

### Advanced Statistics Tracking

```javascript
class AdvancedStats {
    constructor() {
        this.stats = this.loadStats();
        this.sessionStats = {
            startTime: Date.now(),
            gamesPlayed: 0,
            totalTime: 0,
            averageTime: 0,
            keystrokes: 0,
            backspaces: 0
        };
    }
    
    loadStats() {
        const defaultStats = {
            // Basic stats
            totalGames: 0,
            totalWins: 0,
            currentStreak: 0,
            bestStreak: 0,
            guessDistribution: [0, 0, 0, 0, 0, 0],
            
            // Advanced stats
            averageGuesses: 0,
            averageTime: 0,
            totalTime: 0,
            fastestWin: null,
            hardestWord: null,
            easiestWord: null,
            
            // Letter analysis
            letterAccuracy: {},
            commonMistakes: {},
            
            // Temporal stats
            dailyStats: {},
            weeklyStats: {},
            monthlyStats: {},
            
            // Difficulty tracking
            difficultyPerformance: {
                easy: { played: 0, won: 0 },
                normal: { played: 0, won: 0 },
                hard: { played: 0, won: 0 }
            }
        };
        
        return {
            ...defaultStats,
            ...JSON.parse(localStorage.getItem('brainrodle_advanced_stats') || '{}')
        };
    }
    
    trackGameStart() {
        this.gameStartTime = Date.now();
        this.sessionStats.gamesPlayed++;
    }
    
    trackKeypress(key) {
        this.sessionStats.keystrokes++;
        
        // Track letter usage
        if (/^[A-Z]$/.test(key)) {
            this.stats.letterAccuracy[key] = this.stats.letterAccuracy[key] || { used: 0, correct: 0 };
            this.stats.letterAccuracy[key].used++;
        }
    }
    
    trackBackspace() {
        this.sessionStats.backspaces++;
    }
    
    trackGameEnd(won, attempts, word) {
        const gameTime = Date.now() - this.gameStartTime;
        const today = new Date().toISOString().split('T')[0];
        
        // Update basic stats
        this.stats.totalGames++;
        this.stats.totalTime += gameTime;
        this.stats.averageTime = this.stats.totalTime / this.stats.totalGames;
        
        if (won) {
            this.stats.totalWins++;
            this.stats.currentStreak++;
            this.stats.bestStreak = Math.max(this.stats.bestStreak, this.stats.currentStreak);
            this.stats.guessDistribution[attempts - 1]++;
            
            // Track fastest win
            if (!this.stats.fastestWin || gameTime < this.stats.fastestWin.time) {
                this.stats.fastestWin = { time: gameTime, word: word, attempts: attempts };
            }
        } else {
            this.stats.currentStreak = 0;
        }
        
        // Update daily stats
        if (!this.stats.dailyStats[today]) {
            this.stats.dailyStats[today] = { played: 0, won: 0, totalTime: 0 };
        }
        this.stats.dailyStats[today].played++;
        if (won) this.stats.dailyStats[today].won++;
        this.stats.dailyStats[today].totalTime += gameTime;
        
        // Calculate average guesses
        const totalAttempts = this.stats.guessDistribution.reduce((sum, count, index) => 
            sum + (count * (index + 1)), 0
        );
        this.stats.averageGuesses = totalAttempts / this.stats.totalWins;
        
        this.saveStats();
        this.updateSessionStats(gameTime);
    }
    
    updateSessionStats(gameTime) {
        this.sessionStats.totalTime += gameTime;
        this.sessionStats.averageTime = this.sessionStats.totalTime / this.sessionStats.gamesPlayed;
    }
    
    getPerformanceInsights() {
        const insights = [];
        
        // Win rate analysis
        const winRate = (this.stats.totalWins / this.stats.totalGames) * 100;
        if (winRate > 80) {
            insights.push({ type: 'positive', message: 'Excellent win rate! You\'re a Brainrodle master!' });
        } else if (winRate < 50) {
            insights.push({ type: 'improvement', message: 'Try focusing on common letter patterns to improve your win rate.' });
        }
        
        // Streak analysis
        if (this.stats.currentStreak > 5) {
            insights.push({ type: 'positive', message: `Amazing ${this.stats.currentStreak}-game streak!` });
        }
        
        // Speed analysis
        if (this.stats.averageTime < 60000) { // Less than 1 minute
            insights.push({ type: 'positive', message: 'Lightning fast solver!' });
        }
        
        // Guess efficiency
        if (this.stats.averageGuesses < 3.5) {
            insights.push({ type: 'positive', message: 'Very efficient guessing strategy!' });
        } else if (this.stats.averageGuesses > 4.5) {
            insights.push({ type: 'improvement', message: 'Try starting with words that have common vowels and consonants.' });
        }
        
        return insights;
    }
    
    exportStats() {
        return {
            basic: {
                gamesPlayed: this.stats.totalGames,
                gamesWon: this.stats.totalWins,
                winPercentage: (this.stats.totalWins / this.stats.totalGames) * 100,
                currentStreak: this.stats.currentStreak,
                bestStreak: this.stats.bestStreak
            },
            advanced: {
                averageGuesses: this.stats.averageGuesses,
                averageTime: this.stats.averageTime,
                fastestWin: this.stats.fastestWin,
                letterAccuracy: this.stats.letterAccuracy
            },
            session: this.sessionStats,
            insights: this.getPerformanceInsights()
        };
    }
    
    saveStats() {
        localStorage.setItem('brainrodle_advanced_stats', JSON.stringify(this.stats));
    }
}

// Usage
const advancedStats = new AdvancedStats();

// Integrate with game events
document.addEventListener('gameStart', () => advancedStats.trackGameStart());
document.addEventListener('keypress', (e) => advancedStats.trackKeypress(e.key));
document.addEventListener('gameEnd', (e) => {
    advancedStats.trackGameEnd(e.detail.won, e.detail.attempts, e.detail.word);
});
```

### Statistics Visualization

```javascript
class StatsVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.stats = new AdvancedStats();
    }
    
    drawGuessDistribution() {
        const distribution = this.stats.stats.guessDistribution;
        const maxValue = Math.max(...distribution);
        const barWidth = this.canvas.width / distribution.length;
        const maxBarHeight = this.canvas.height * 0.8;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        distribution.forEach((count, index) => {
            const barHeight = (count / maxValue) * maxBarHeight;
            const x = index * barWidth;
            const y = this.canvas.height - barHeight;
            
            // Draw bar
            this.ctx.fillStyle = '#538d4e';
            this.ctx.fillRect(x + 5, y, barWidth - 10, barHeight);
            
            // Draw label
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(index + 1, x + barWidth / 2, this.canvas.height - 5);
            
            // Draw count
            if (count > 0) {
                this.ctx.fillText(count, x + barWidth / 2, y - 5);
            }
        });
    }
    
    drawTimelineChart(days = 30) {
        const dailyStats = this.stats.stats.dailyStats;
        const dates = Object.keys(dailyStats)
            .sort()
            .slice(-days);
        
        if (dates.length === 0) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const pointWidth = this.canvas.width / dates.length;
        const maxWinRate = 100;
        
        // Draw grid lines
        this.ctx.strokeStyle = '#3a3a3c';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = (i / 4) * this.canvas.height;
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        // Draw line chart
        this.ctx.strokeStyle = '#ff00ff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        dates.forEach((date, index) => {
            const dayStats = dailyStats[date];
            const winRate = dayStats.played > 0 ? (dayStats.won / dayStats.played) * 100 : 0;
            const x = index * pointWidth + pointWidth / 2;
            const y = this.canvas.height - (winRate / maxWinRate) * this.canvas.height;
            
            if (index === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
            
            // Draw point
            this.ctx.fillStyle = '#ff00ff';
            this.ctx.fillRect(x - 2, y - 2, 4, 4);
        });
        
        this.ctx.stroke();
    }
    
    drawHeatmap() {
        // Letter usage heatmap
        const letterAccuracy = this.stats.stats.letterAccuracy;
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const cellSize = 20;
        const cols = 6;
        const rows = Math.ceil(letters.length / cols);
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        letters.forEach((letter, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            const x = col * cellSize;
            const y = row * cellSize;
            
            const accuracy = letterAccuracy[letter];
            let intensity = 0;
            
            if (accuracy && accuracy.used > 0) {
                intensity = accuracy.correct / accuracy.used;
            }
            
            // Color based on accuracy
            const red = Math.floor(255 * (1 - intensity));
            const green = Math.floor(255 * intensity);
            this.ctx.fillStyle = `rgb(${red}, ${green}, 0)`;
            this.ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
            
            // Draw letter
            this.ctx.fillStyle = '#000000';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(letter, x + cellSize / 2, y + cellSize / 2 + 4);
        });
    }
}

// Usage
const visualizer = new StatsVisualizer('stats-canvas');
visualizer.drawGuessDistribution();
```

## UI Customization

### Theme System Implementation

```javascript
class ThemeManager {
    constructor() {
        this.themes = {
            neon: {
                name: 'Neon Cyberpunk',
                colors: {
                    primary: '#ff00ff',
                    secondary: '#00ffff',
                    background: '#0a0a0a',
                    surface: '#1a1a1a',
                    text: '#ffffff',
                    correct: '#538d4e',
                    present: '#b59f3b',
                    absent: '#3a3a3c'
                },
                fonts: {
                    primary: 'Chakra Petch',
                    fallback: 'monospace'
                }
            },
            classic: {
                name: 'Classic Wordle',
                colors: {
                    primary: '#6aaa64',
                    secondary: '#c9b458',
                    background: '#ffffff',
                    surface: '#f6f7f8',
                    text: '#1a1a1b',
                    correct: '#6aaa64',
                    present: '#c9b458',
                    absent: '#787c7e'
                },
                fonts: {
                    primary: 'Clear Sans',
                    fallback: 'sans-serif'
                }
            },
            dark: {
                name: 'Dark Mode',
                colors: {
                    primary: '#818384',
                    secondary: '#565758',
                    background: '#121213',
                    surface: '#1a1a1b',
                    text: '#ffffff',
                    correct: '#538d4e',
                    present: '#b59f3b',
                    absent: '#3a3a3c'
                },
                fonts: {
                    primary: 'Helvetica Neue',
                    fallback: 'sans-serif'
                }
            }
        };
        
        this.currentTheme = 'neon';
        this.customThemes = this.loadCustomThemes();
    }
    
    applyTheme(themeName) {
        const theme = this.themes[themeName] || this.customThemes[themeName];
        if (!theme) {
            console.error(`Theme "${themeName}" not found`);
            return;
        }
        
        const root = document.documentElement;
        
        // Apply color variables
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });
        
        // Apply font variables
        Object.entries(theme.fonts).forEach(([key, value]) => {
            root.style.setProperty(`--font-${key}`, value);
        });
        
        // Update body class
        document.body.className = `theme-${themeName}`;
        
        this.currentTheme = themeName;
        localStorage.setItem('brainrodle_theme', themeName);
    }
    
    createCustomTheme(name, config) {
        const baseTheme = this.themes.neon;
        const customTheme = {
            name: config.name || name,
            colors: { ...baseTheme.colors, ...config.colors },
            fonts: { ...baseTheme.fonts, ...config.fonts }
        };
        
        this.customThemes[name] = customTheme;
        this.saveCustomThemes();
        
        return customTheme;
    }
    
    loadCustomThemes() {
        return JSON.parse(localStorage.getItem('brainrodle_custom_themes') || '{}');
    }
    
    saveCustomThemes() {
        localStorage.setItem('brainrodle_custom_themes', JSON.stringify(this.customThemes));
    }
    
    generateThemeCSS(themeName) {
        const theme = this.themes[themeName] || this.customThemes[themeName];
        if (!theme) return '';
        
        let css = `:root {\n`;
        
        Object.entries(theme.colors).forEach(([key, value]) => {
            css += `  --color-${key}: ${value};\n`;
        });
        
        Object.entries(theme.fonts).forEach(([key, value]) => {
            css += `  --font-${key}: ${value};\n`;
        });
        
        css += `}\n\n`;
        
        // Add theme-specific styles
        css += `.theme-${themeName} {\n`;
        css += `  background-color: var(--color-background);\n`;
        css += `  color: var(--color-text);\n`;
        css += `  font-family: var(--font-primary), var(--font-fallback);\n`;
        css += `}\n`;
        
        return css;
    }
    
    exportTheme(themeName) {
        const theme = this.themes[themeName] || this.customThemes[themeName];
        if (!theme) return null;
        
        return {
            name: theme.name,
            config: theme,
            css: this.generateThemeCSS(themeName)
        };
    }
    
    importTheme(themeData) {
        if (!themeData.name || !themeData.config) {
            throw new Error('Invalid theme data');
        }
        
        const name = themeData.name.toLowerCase().replace(/\s+/g, '-');
        this.customThemes[name] = themeData.config;
        this.saveCustomThemes();
        
        return name;
    }
}

// Usage
const themeManager = new ThemeManager();

// Apply theme
themeManager.applyTheme('neon');

// Create custom theme
const customTheme = themeManager.createCustomTheme('sunset', {
    name: 'Sunset Vibes',
    colors: {
        primary: '#ff6b35',
        secondary: '#f7931e',
        background: '#2d1b69',
        surface: '#1e1b4b',
        text: '#ffffff'
    }
});

// Theme selector UI
function createThemeSelector() {
    const selector = document.createElement('select');
    selector.id = 'theme-selector';
    selector.className = 'theme-selector';
    
    // Add default themes
    Object.entries(themeManager.themes).forEach(([key, theme]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = theme.name;
        selector.appendChild(option);
    });
    
    // Add custom themes
    Object.entries(themeManager.customThemes).forEach(([key, theme]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = theme.name + ' (Custom)';
        selector.appendChild(option);
    });
    
    selector.value = themeManager.currentTheme;
    
    selector.addEventListener('change', (e) => {
        themeManager.applyTheme(e.target.value);
    });
    
    return selector;
}
```

### Custom Component Creation

```javascript
class CustomComponents {
    static createAnimatedButton(text, onClick, className = '') {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = `animated-button ${className}`;
        
        // Add ripple effect
        button.addEventListener('click', (e) => {
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            if (onClick) onClick(e);
        });
        
        return button;
    }
    
    static createProgressBar(current, max, label = '') {
        const container = document.createElement('div');
        container.className = 'progress-container';
        
        if (label) {
            const labelElement = document.createElement('div');
            labelElement.className = 'progress-label';
            labelElement.textContent = label;
            container.appendChild(labelElement);
        }
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.width = `${(current / max) * 100}%`;
        
        const progressText = document.createElement('div');
        progressText.className = 'progress-text';
        progressText.textContent = `${current}/${max}`;
        
        progressBar.appendChild(progressFill);
        progressBar.appendChild(progressText);
        container.appendChild(progressBar);
        
        return container;
    }
    
    static createTooltip(element, text, position = 'top') {
        const tooltip = document.createElement('div');
        tooltip.className = `tooltip tooltip-${position}`;
        tooltip.textContent = text;
        
        element.addEventListener('mouseenter', () => {
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            let left, top;
            
            switch (position) {
                case 'top':
                    left = rect.left + rect.width / 2 - tooltipRect.width / 2;
                    top = rect.top - tooltipRect.height - 10;
                    break;
                case 'bottom':
                    left = rect.left + rect.width / 2 - tooltipRect.width / 2;
                    top = rect.bottom + 10;
                    break;
                case 'left':
                    left = rect.left - tooltipRect.width - 10;
                    top = rect.top + rect.height / 2 - tooltipRect.height / 2;
                    break;
                case 'right':
                    left = rect.right + 10;
                    top = rect.top + rect.height / 2 - tooltipRect.height / 2;
                    break;
            }
            
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
            tooltip.style.opacity = '1';
        });
        
        element.addEventListener('mouseleave', () => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        });
    }
    
    static createModal(title, content, options = {}) {
        const modal = document.createElement('div');
        modal.className = 'custom-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'custom-modal-content';
        
        if (title) {
            const titleElement = document.createElement('h2');
            titleElement.textContent = title;
            modalContent.appendChild(titleElement);
        }
        
        if (options.closable !== false) {
            const closeButton = document.createElement('button');
            closeButton.className = 'modal-close';
            closeButton.innerHTML = '&times;';
            closeButton.onclick = () => modal.remove();
            modalContent.appendChild(closeButton);
        }
        
        const contentElement = document.createElement('div');
        contentElement.className = 'modal-body';
        if (typeof content === 'string') {
            contentElement.innerHTML = content;
        } else {
            contentElement.appendChild(content);
        }
        modalContent.appendChild(contentElement);
        
        if (options.buttons) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'modal-buttons';
            
            options.buttons.forEach(button => {
                const btn = this.createAnimatedButton(
                    button.text,
                    button.onClick,
                    button.className || ''
                );
                buttonContainer.appendChild(btn);
            });
            
            modalContent.appendChild(buttonContainer);
        }
        
        modal.appendChild(modalContent);
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal && options.closable !== false) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
        
        return modal;
    }
}

// Usage examples
const saveButton = CustomComponents.createAnimatedButton(
    'Save Game',
    () => console.log('Game saved!'),
    'save-button'
);

const progressBar = CustomComponents.createProgressBar(3, 6, 'Current Streak');

CustomComponents.createTooltip(
    document.getElementById('stats-button'),
    'View your game statistics',
    'bottom'
);

const settingsModal = CustomComponents.createModal(
    'Game Settings',
    '<p>Customize your game experience</p>',
    {
        buttons: [
            { text: 'Save', onClick: () => console.log('Settings saved') },
            { text: 'Cancel', onClick: (modal) => modal.remove() }
        ]
    }
);
```

This comprehensive usage examples and integration guide provides practical implementations for extending and customizing the Brainrodle game, covering everything from basic integration to advanced features like custom game modes, statistics tracking, and UI customization.