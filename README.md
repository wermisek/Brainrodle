# 🧠 Brainrodle

A modern word-guessing game focused on Gen Z slang and internet culture. Try to guess the daily word in 6 attempts or play unlimited mode!

## 🎮 Game Modes

- **Daily Mode**: One word per day, synchronized with Warsaw time
- **Unlimited Mode**: Play as many times as you want with random words

## 🎯 Features

- Modern UI with glitch effects and neon aesthetics
- Mobile-responsive design
- Word list with Gen Z slang and internet culture terms
- Statistics tracking for both game modes
- Anti-cheat protection
- Keyboard support and on-screen keyboard

## 🎲 How to Play

1. Try to guess the word in 6 attempts
2. Each guess must be a valid word from the list
3. After each guess, tiles will show:
   - 🟩 Green: Letter is correct and in right position
   - 🟨 Yellow: Letter is in the word but wrong position
   - ⬛ Gray: Letter is not in the word

## 🛠️ Technical Details

- Pure HTML, CSS, and JavaScript
- No external dependencies
- Local storage for game statistics
- Responsive design for all screen sizes

## 🔒 Security Features

- Anti-cheat protection
- Source code protection
- Console and DevTools restrictions

## 🎨 UI Features

- Dark theme with neon accents
- Glitch effects and animations
- Responsive keyboard
- Mobile-friendly menu
- Statistics modal
- Word list panel

## 📱 Mobile Support

- Full mobile compatibility
- Touch-friendly interface
- Optimized layout for small screens
- Hamburger menu for navigation

## 🔄 Daily Updates

The game updates with a new word every day at midnight (Warsaw time).

## 📚 Documentation

Comprehensive documentation is available for developers who want to understand, modify, or extend the game:

### 📖 Core Documentation
- **[API Documentation](API_DOCUMENTATION.md)** - Complete overview of all APIs, functions, and components with examples
- **[Function Reference](FUNCTION_REFERENCE.md)** - Detailed documentation of all JavaScript functions
- **[Component Guide](COMPONENT_GUIDE.md)** - HTML components and UI elements documentation
- **[CSS Reference](CSS_REFERENCE.md)** - Complete styling system and design patterns
- **[Usage Examples](USAGE_EXAMPLES.md)** - Integration guide with practical examples

### 🚀 Quick Start for Developers

1. **Understanding the Codebase**: Start with [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for a high-level overview
2. **Function Details**: Reference [FUNCTION_REFERENCE.md](FUNCTION_REFERENCE.md) for specific function implementations
3. **UI Components**: Check [COMPONENT_GUIDE.md](COMPONENT_GUIDE.md) for HTML structure and styling
4. **Customization**: Use [CSS_REFERENCE.md](CSS_REFERENCE.md) for theming and design modifications
5. **Integration**: Follow [USAGE_EXAMPLES.md](USAGE_EXAMPLES.md) for extending the game

### 🔧 Key APIs

#### Game Functions
- `getDailyWord()` - Generate deterministic daily word
- `checkRow()` - Validate guesses and provide feedback
- `updateStats()` - Track player performance
- `createGameBoard()` - Generate game interface

#### UI Components
- `.letter-box` - Individual game tiles
- `.keyboard-row` - On-screen keyboard
- `.nav-menu` - Navigation interface
- `.modal` - Popup dialogs

#### Customization
- Theme system with CSS variables
- Custom word lists and validation
- Statistics tracking and visualization
- Responsive design patterns

## 🎯 Architecture

The game is built with a modular architecture:

```
├── index.html          # Daily mode interface
├── unlimited.html      # Unlimited mode interface
├── script.js          # Daily mode game logic
├── unlimited.js       # Unlimited mode logic
├── styles.css         # Complete styling system
└── docs/              # Documentation files
    ├── API_DOCUMENTATION.md
    ├── FUNCTION_REFERENCE.md
    ├── COMPONENT_GUIDE.md
    ├── CSS_REFERENCE.md
    └── USAGE_EXAMPLES.md
```

## 🛠️ Development

### Local Development
1. Clone the repository
2. Open `index.html` in a web browser for daily mode
3. Open `unlimited.html` for unlimited mode
4. No build process required - pure vanilla JavaScript

### Customization
- Modify word lists in JavaScript files
- Customize themes in `styles.css`
- Add new game modes by extending base functions
- Integrate with external APIs using provided examples

### Testing
- All functions are documented with usage examples
- UI components include responsive design patterns
- Cross-browser compatibility ensured

See the documentation files for detailed implementation guides and examples. 