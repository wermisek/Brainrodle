document.addEventListener('DOMContentLoaded', () => {
    // Brainrot word list - curated from Gen Z slang
    const WORDS = [
        // Classic Brainrot Words
        "BASED",     // Strong agreement/approval
        "ALPHA",     // Socially dominant person
        "AHHH",      // Supports description
        "AURA",      // Energy/personality vibe
        "BAKA",      // Japanese for fool
        "BLUD",      // Brother/friend
        "BETA",      // Socially submissive
        
        // Modern Brainrot Terms
        "ACOUSTIC",  // Being different/odd
        "BACKSHOT", // From behind
        "BEDROT",   // Lying in bed too long
        "BRAINROT", // Brain fixated on topic
        "BOOKTOK",  // Book side of TikTok
        "BALKAN",   // From Balkan region
        "BLUMPKIN", // NSFW act
        
        // Extended Terms
        "ANGELSHOT",    // Bar safety code
        "BACKROOMS",    // Endless plane existence
        "BATTLEBUS",    // Fortnite starting bus
        "BONESMASH",    // Jaw manipulation
        "BIBLICALLY",   // According to Bible
        "BINGCHILLING", // Ice cream (Chinese)
        
        // Existing Words
        "RATIO",  // Getting more likes
        "SUSSY",  // Suspicious behavior
        "YIKES",  // Expression of shock
        "SLAYZ",  // Doing excellent
        "SIGMA",  // Independent mindset
        "BRUHH",  // Expression of shock
        "BUSSI",  // Extremely good
        "DRIPP",  // Stylish fashion
        "STANX",  // Super fan
        "TEAAA",  // Gossip/drama
        "VIBEN",  // Good vibes
        "IYKYK",  // If you know you know
        "BFFRS",  // Be for real
        "NAHHH",  // Expression of disbelief
        "CHEUG",  // Outdated/trying hard
        "SKIBZ",  // Skibbidi trend
        "DELUU",  // Delusional
        "RIZZY",  // Charisma
        "PURPL",  // Purple heart trend
        "COOKT",  // From cooking
        "PERIODT", // Emphasizing point
        "FINNA",  // Going to
        "BOUJEE", // High class
        "SERVV",  // Doing well
        "SNATCHED" // Looking perfect
    ];

    // Game state
    let currentRow = 0;
    let currentTile = 0;
    let isGameOver = false;
    let gameBoard = document.getElementById("game-board");

    // Stats in localStorage with proper initialization
    const defaultStats = {
        gamesPlayed: 0,
        gamesWon: 0,
        currentStreak: 0,
        maxStreak: 0,
        lastPlayedDate: null,
        lastGuesses: [],
        guessDistribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}
    };

    let stats;
    try {
        const savedStats = localStorage.getItem('brainrodle_stats');
        stats = savedStats ? JSON.parse(savedStats) : defaultStats;
    } catch (e) {
        console.log('Error loading stats, resetting to default');
        stats = defaultStats;
    }

    // Ensure all required properties exist
    stats = {
        ...defaultStats,
        ...stats
    };

    // Ensure lastGuesses exists
    if (!stats.lastGuesses) {
        stats.lastGuesses = [];
    }

    // Word list modal functionality
    const viewWordsBtn = document.getElementById('viewWordsBtn');
    const modal = document.getElementById('words-modal');
    const closeBtn = document.querySelector('.close-button');
    const wordsList = document.querySelector('.words-list');

    function showWordList() {
        // Create word items with descriptions
        wordsList.innerHTML = WORDS.map(word => {
            const description = getWordDescription(word);
            return `<div class="word-item">${word}<br><small>${description}</small></div>`;
        }).join('');
        modal.style.display = "block";
    }

    function getWordDescription(word) {
        const descriptions = {
            // Classic Brainrot Words
            "BASED": "Strong agreement/approval",
            "ALPHA": "Socially dominant person",
            "AHHH": "Supports description of someone",
            "AURA": "Energy/personality vibe",
            "BAKA": "Japanese for fool",
            "BLUD": "Brother/friend",
            "BETA": "Socially submissive person",
            
            // Modern Brainrot Terms
            "ACOUSTIC": "Being different/odd",
            "BACKSHOT": "From behind",
            "BEDROT": "Lying in bed too long",
            "BRAINROT": "Brain fixated on topic",
            "BOOKTOK": "Book side of TikTok",
            "BALKAN": "From Balkan region",
            "BLUMPKIN": "NSFW act",
            
            // Extended Terms
            "ANGELSHOT": "Bar safety code",
            "BACKROOMS": "Endless plane existence",
            "BATTLEBUS": "Fortnite starting bus",
            "BONESMASH": "Jaw manipulation",
            "BIBLICALLY": "According to Bible",
            "BINGCHILLING": "Ice cream (Chinese)",
            
            // Existing Words
            "RATIO": "Getting more likes than original post",
            "SUSSY": "Suspicious behavior",
            "YIKES": "Expression of shock",
            "SLAYZ": "Doing excellent",
            "SIGMA": "Independent/lone wolf mindset",
            "BRUHH": "Expression of shock/disappointment",
            "BUSSI": "From 'bussin' - extremely good",
            "DRIPP": "Stylish fashion",
            "STANX": "Super fan",
            "TEAAA": "Gossip/drama",
            "VIBEN": "Good vibes/energy",
            "IYKYK": "If you know you know",
            "BFFRS": "Be for real/best friends",
            "NAHHH": "Expression of disbelief",
            "CHEUG": "Outdated/trying too hard",
            "SKIBZ": "From 'skibbidi' trend",
            "DELUU": "From 'delulu' - delusional",
            "RIZZY": "From 'rizz' - charisma",
            "PURPL": "Purple heart trend",
            "COOKT": "From 'cooked/cooking'",
            "PERIODT": "Emphasizing a point",
            "FINNA": "Going to/about to",
            "BOUJEE": "High class/fancy",
            "SERVV": "Doing something well",
            "SNATCHED": "Looking good/perfect"
        };
        return descriptions[word] || "";
    }

    viewWordsBtn.onclick = showWordList;
    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    };

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

    function updateTimer() {
        const timeLeft = getTimeUntilNextWord();
        const messageContainer = document.getElementById("message-container");
        const guessesDisplay = stats.lastGuesses && stats.lastGuesses.length > 0 
            ? `<br><br>Your guesses:<br>${stats.lastGuesses.join('<br>')}`
            : '';
        messageContainer.innerHTML = `You've already played today!<br>Next word in: ${timeLeft}${guessesDisplay}`;
        messageContainer.style.display = "block";
    }

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

    function updateStats(won, attempts) {
        const warsawTime = new Date().toLocaleString('en-US', { timeZone: 'Europe/Warsaw' });
        const today = new Date(warsawTime).toISOString().split('T')[0];
        
        if (stats.lastPlayedDate !== today) {
            if (stats.lastPlayedDate) {
                const lastPlayed = new Date(stats.lastPlayedDate);
                const currentDate = new Date(today);
                const daysDiff = Math.floor((currentDate - lastPlayed) / (1000 * 60 * 60 * 24));
                if (daysDiff > 1) {
                    stats.currentStreak = 0;
                }
            }
            stats.lastGuesses = [];
        }

        const currentBoard = [];
        for (let i = 0; i <= currentRow; i++) {
            const row = gameBoard.children[i];
            let rowGuess = "";
            for (const tile of row.children) {
                rowGuess += tile.textContent;
                if (tile.classList.contains("correct")) {
                    rowGuess += "🟩";
                } else if (tile.classList.contains("present")) {
                    rowGuess += "🟨";
                } else if (tile.classList.contains("absent")) {
                    rowGuess += "⬛";
                }
            }
            currentBoard.push(rowGuess);
        }
        stats.lastGuesses = currentBoard;

        stats.gamesPlayed++;
        if (won) {
            stats.gamesWon++;
            stats.currentStreak++;
            stats.maxStreak = Math.max(stats.currentStreak, stats.maxStreak);
            stats.guessDistribution[attempts]++;
        } else {
            stats.currentStreak = 0;
        }
        
        stats.lastPlayedDate = today;
        localStorage.setItem('brainrodle_stats', JSON.stringify(stats));
        showStats();
    }

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

    function resetGame() {
        currentWord = getDailyWord();
        currentRow = 0;
        currentTile = 0;
        isGameOver = false;
        createGameBoard();
        
        // Reset keyboard
        document.querySelectorAll(".keyboard-row button").forEach(button => {
            button.style.backgroundColor = "";
            button.style.color = "white";
        });
    }

    function checkRow() {
        const wordLength = currentWord.length;
        
        if (currentTile !== wordLength) {
            showMessage(`Word must be ${wordLength} letters!`);
            shakeRow();
            return;
        }

        const row = gameBoard.children[currentRow];
        let guessWord = "";
        const rowTiles = Array.from(row.children).slice(0, wordLength);

        for (const tile of rowTiles) {
            guessWord += (tile.textContent || '').trim().toUpperCase();
        }

        if (!WORDS.includes(guessWord)) {
            showMessage("Word not in list!");
            shakeRow();
            return;
        }

        let letterCount = {};
        for (let i = 0; i < wordLength; i++) {
            let letter = currentWord[i];
            letterCount[letter] = (letterCount[letter] || 0) + 1;
        }

        // First pass - mark correct ones
        for (let i = 0; i < wordLength; i++) {
            let tile = rowTiles[i];
            let letter = tile.textContent;
            
            if (currentWord[i] === letter) {
                tile.classList.add("correct");
                let button = document.querySelector(`[data-key='${letter}']`);
                if (button) {
                    button.style.backgroundColor = "#538d4e";
                }
                letterCount[letter]--;
            }
        }

        // Second pass - mark present and absent
        for (let i = 0; i < wordLength; i++) {
            let tile = rowTiles[i];
            let letter = tile.textContent;

            if (!tile.classList.contains("correct")) {
                if (letterCount[letter] && letterCount[letter] > 0) {
                    tile.classList.add("present");
                    let button = document.querySelector(`[data-key='${letter}']`);
                    if (button && !button.style.backgroundColor.includes("538d4e")) {
                        button.style.backgroundColor = "#b59f3b";
                    }
                    letterCount[letter]--;
                } else {
                    tile.classList.add("absent");
                    let button = document.querySelector(`[data-key='${letter}']`);
                    if (button && !button.style.backgroundColor.includes("538d4e") && 
                        !button.style.backgroundColor.includes("b59f3b")) {
                        button.style.backgroundColor = "#3a3a3c";
                    }
                }
            }
        }

        if (guessWord === currentWord) {
            isGameOver = true;
            updateStats(true, currentRow + 1);
            showMessage("Congratulations! 🎉");
            return;
        }

        if (currentRow >= 5) {
            isGameOver = true;
            updateStats(false, 6);
            showMessage(`Game Over! The word was ${currentWord}`);
            return;
        }

        currentRow++;
        currentTile = 0;
    }

    function insertLetter(pressedKey) {
        if (currentTile >= currentWord.length) return;
        
        const row = gameBoard.children[currentRow];
        const box = row.children[currentTile];
        box.textContent = pressedKey;
        box.classList.add("filled-box");
        currentTile++;
    }

    function deleteLetter() {
        if (currentTile <= 0) return;
        
        currentTile--;
        const row = gameBoard.children[currentRow];
        const box = row.children[currentTile];
        box.textContent = "";
        box.classList.remove("filled-box");
    }

    function shakeRow() {
        const row = gameBoard.children[currentRow];
        row.classList.add("shake");
        setTimeout(() => {
            row.classList.remove("shake");
        }, 500);
    }

    // Initialize game
    let currentWord = getDailyWord();
    
    // Create game board regardless of played status
    if (!gameBoard) {
        console.error("Game board element not found!");
        return;
    }

    // Always create the game board
    createGameBoard();

    // Check if already played today
    if (checkIfPlayed()) {
        // If already played, just show the timer and previous guesses
        updateTimer();
        setInterval(updateTimer, 1000);
    } else {
        // Handle keyboard input
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

        // Handle on-screen keyboard
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
    }

    // Add stats button if it doesn't exist
    if (!document.querySelector('.stats-button')) {
        const header = document.querySelector('header');
        const statsButton = document.createElement('button');
        statsButton.className = 'stats-button';
        statsButton.textContent = '📊 Statistics';
        statsButton.onclick = showStats;
        header.appendChild(statsButton);
    }

    // Add stats modal HTML dynamically if it doesn't exist
    if (!document.getElementById('stats-modal')) {
        const statsModal = document.createElement('div');
        statsModal.id = 'stats-modal';
        statsModal.className = 'modal';
        statsModal.innerHTML = `
            <div class="modal-content stats-content">
                <span class="close-button" id="closeStatsBtn">&times;</span>
                <h2>Statistics</h2>
                <div id="stats-container"></div>
            </div>
        `;
        document.body.appendChild(statsModal);
    }

    // Initialize stats modal elements
    const statsModalElement = document.getElementById('stats-modal');
    const closeStatsBtn = document.getElementById('closeStatsBtn');
    const statsContainer = document.getElementById('stats-container');

    function showStats() {
        const winRate = Math.round((stats.gamesWon / stats.gamesPlayed) * 100) || 0;
        const statsHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${stats.gamesPlayed}</div>
                    <div class="stat-label">Played</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${winRate}%</div>
                    <div class="stat-label">Win Rate</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.currentStreak}</div>
                    <div class="stat-label">Current Streak</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${stats.maxStreak}</div>
                    <div class="stat-label">Max Streak</div>
                </div>
            </div>
        `;
        
        statsContainer.innerHTML = statsHTML;
        statsModalElement.style.display = "block";
    }

    // Close stats modal when clicking X or outside
    closeStatsBtn.onclick = () => statsModalElement.style.display = "none";
    window.onclick = (e) => {
        if (e.target === statsModalElement) {
            statsModalElement.style.display = "none";
        } else if (e.target === modal) {
            modal.style.display = "none";
        }
    };

    // Prevent console access and debugging
    (function() {
        // Override console methods
        const noop = () => undefined;
        const noopReturn = (val) => () => val;
        
        // More thorough console blocking
        Object.defineProperties(window.console, {
            log: { get: noopReturn(noop) },
            debug: { get: noopReturn(noop) },
            info: { get: noopReturn(noop) },
            warn: { get: noopReturn(noop) },
            error: { get: noopReturn(noop) },
            dir: { get: noopReturn(noop) },
            dirxml: { get: noopReturn(noop) },
            trace: { get: noopReturn(noop) },
            group: { get: noopReturn(noop) },
            groupCollapsed: { get: noopReturn(noop) },
            groupEnd: { get: noopReturn(noop) },
            clear: { get: noopReturn(noop) },
            count: { get: noopReturn(noop) },
            assert: { get: noopReturn(noop) },
            profile: { get: noopReturn(noop) },
            profileEnd: { get: noopReturn(noop) },
            time: { get: noopReturn(noop) },
            timeEnd: { get: noopReturn(noop) },
            timeStamp: { get: noopReturn(noop) },
            table: { get: noopReturn(noop) }
        });

        // Prevent debugging
        const handler = {
            get: function(target, name) {
                return name === 'toString' ? () => '[object Object]' : target[name];
            }
        };
        
        // Override toString to prevent object inspection
        Error.prototype.toString = () => '[object Error]';
        Function.prototype.toString = () => '[object Function]';
        
        // Additional protection against dev tools
        setInterval(() => {
            const start = performance.now();
            debugger;
            const end = performance.now();
            if (end - start > 100) {
                showMessage("No cheating! 😉");
            }
        }, 1000);

        // Detect dev tools opening
        window.addEventListener('devtoolschange', function(e) {
            if (e.detail.open) {
                showMessage("No cheating! 😉");
            }
        });
    })();
}); 