document.addEventListener('DOMContentLoaded', () => {
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

    // Import word list from main game
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
    let currentWord = "";
    let wordLength = 0;

    // Stats for unlimited mode - separate from daily mode
    let unlimitedStats = JSON.parse(localStorage.getItem('brainrodle_unlimited_stats')) || {
        gamesPlayed: 0,
        gamesWon: 0,
        bestStreak: 0,
        currentStreak: 0,
        lastGuesses: []
    };

    function getRandomWord() {
        return WORDS[Math.floor(Math.random() * WORDS.length)];
    }

    function resetGame() {
        isGameOver = false;
        currentRow = 0;
        currentTile = 0;
        currentWord = getRandomWord();
        wordLength = currentWord.length;

        gameBoard.innerHTML = '';
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

        document.querySelectorAll(".keyboard-row button").forEach(button => {
            button.style.backgroundColor = "";
            button.style.color = "white";
        });

        const messageContainer = document.getElementById("message-container");
        messageContainer.style.display = "none";

        unlimitedStats.lastGuesses = [];
        localStorage.setItem('brainrodle_unlimited_stats', JSON.stringify(unlimitedStats));
    }

    // Handle keyboard input
    document.addEventListener("keyup", (e) => {
        if (isGameOver && e.key === "Enter") {
            window.location.reload();
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
        
        if (isGameOver) return;
        
        let pressedKey = String(e.key).toUpperCase();
        let found = pressedKey.match(/[A-Z]/g);
        if (!found || found.length > 1) return;
        
        insertLetter(pressedKey);
    });

    // Handle on-screen keyboard
    document.querySelectorAll(".keyboard-row button").forEach(button => {
        button.addEventListener("click", () => {
            if (isGameOver) {
                if (button.getAttribute("data-key") === "ENTER") {
                    window.location.reload();  // Refresh page when pressing Enter after game over
                }
                return;
            }
            
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

    // Handle "New Word" button clicks
    document.querySelectorAll('#newWordBtn, .nav-button#newWordBtn').forEach(button => {
        button.addEventListener("click", () => {
            window.location.reload();  // Simply refresh the page for a new word
        });
    });

    // Add stats button functionality
    const statsButton = document.querySelector('.stats-button');
    statsButton.onclick = showStats;

    // Initialize the game board
    resetGame();

    // Word list panel functionality
    const toggleWordListBtn = document.querySelector('.toggle-word-list');
    const wordListPanel = document.querySelector('.word-list-panel');
    const wordListContent = document.getElementById('word-list-content');

    // Populate word list
    function populateWordList() {
        wordListContent.innerHTML = WORDS.map(word => {
            const description = getWordDescription(word);
            return `<div class="word-item">${word}<small>${description}</small></div>`;
        }).join('');
    }

    // Word descriptions
    function getWordDescription(word) {
        const descriptions = {
            "RATIO": "Getting more likes than original post",
            "BASED": "Strong agreement/approval",
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

    // Toggle word list panel
    toggleWordListBtn.addEventListener('click', () => {
        wordListPanel.classList.toggle('show');
        if (wordListPanel.classList.contains('show')) {
            populateWordList();
        }
    });

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

    function showStats() {
        const winRate = Math.round((unlimitedStats.gamesWon / unlimitedStats.gamesPlayed) * 100) || 0;
        const lastGuessesDisplay = unlimitedStats.lastGuesses && unlimitedStats.lastGuesses.length > 0 
            ? `\n\nLast Game:\n${unlimitedStats.lastGuesses.join('\n')}`
            : '';

        const statsMessage = `
            Unlimited Mode Statistics:
            Games Played: ${unlimitedStats.gamesPlayed}
            Games Won: ${unlimitedStats.gamesWon}
            Win Rate: ${winRate}%
            Best Streak: ${unlimitedStats.bestStreak}
            Current Streak: ${unlimitedStats.currentStreak}${lastGuessesDisplay}
        `;
        showMessage(statsMessage, 5000);
    }

    function updateStats(won) {
        // Update stats
        unlimitedStats.gamesPlayed++;
        if (won) {
            unlimitedStats.gamesWon++;
            unlimitedStats.currentStreak++;
            unlimitedStats.bestStreak = Math.max(unlimitedStats.bestStreak, unlimitedStats.currentStreak);
        } else {
            unlimitedStats.currentStreak = 0;
        }

        // Save current board state
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
        unlimitedStats.lastGuesses = currentBoard;

        // Save to localStorage
        localStorage.setItem('brainrodle_unlimited_stats', JSON.stringify(unlimitedStats));
    }

    function insertLetter(pressedKey) {
        if (currentTile >= wordLength) return;
        
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

    function checkRow() {
        if (currentTile !== wordLength) {
            showMessage(`Word must be ${wordLength} letters!`);
            shakeRow();
            return;
        }

        const row = gameBoard.children[currentRow];
        let guessWord = "";
        const rowTiles = Array.from(row.children).slice(0, wordLength);

        // Construct word with normalized tiles
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
            updateStats(true);
            showMessage("Congratulations! 🎉<br>Click 'New Word' to play again!");
            return;
        }

        if (currentRow >= 5) {
            isGameOver = true;
            updateStats(false);
            showMessage(`Game Over! The word was ${currentWord}<br>Click 'New Word' to try again!`);
            return;
        }

        currentRow++;
        currentTile = 0;
    }
}); 