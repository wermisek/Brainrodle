## Components, DOM Structure, and CSS Hooks

This guide catalogs the key DOM elements, dynamic components, and the CSS classes/attributes used to style and interact with the Brainrodle UI.

### Global Containers
- `.game-container`: Wrapper for header, board, and keyboard
- `#message-container`: Overlay area for instructional or result messages

### Header and Navigation
- `<header>`: Contains title and nav
  - `.mobile-header`: Compact header with hamburger menu
  - `.hamburger-menu`: Toggles mobile navigation
  - `.nav-menu`: Container for subtitle, instructions, and nav buttons
    - `.subtitle`: Mode description text
    - `.instructions`: Input hint text
    - `.nav-buttons`: Wrapper for navigation buttons
      - `.nav-button`: Primary navigation buttons
      - `.stats-button`: Opens statistics UI (modal in daily mode; overlay in unlimited mode)
      - `#viewWordsBtn`: Opens word list (modal or slide-in panel depending on mode)
      - `#newWordBtn` (Unlimited): Starts a new round

### Game Board
- `#game-board`: Dynamic container filled by JavaScript
  - `.letter-row` × 6: Each attempt row
    - `.letter-box` × N: One tile per letter of the current word
      - State classes applied by logic:
        - `filled-box`: Tile currently contains a letter
        - `correct`: Letter and position match
        - `present`: Letter exists in word but different position
        - `absent`: Letter not in word
  
Keyboard hints:
- `[data-key]` buttons in the on-screen keyboard receive inline `backgroundColor` reflecting `correct`/`present`/`absent` state precedence.

### On-screen Keyboard
- `#keyboard-container`
  - `.keyboard-row` × 3
    - `[data-key="Q".."P"]` top row
    - `[data-key="A".."L"]` middle row
    - `[data-key="Z".."M"]` bottom row, plus:
      - `[data-key="ENTER"]` (`.wide-button` or `.enter-key-btn`)
      - `[data-key="DELETE"]` (`.wide-button` or `.delete-key-btn`)

### Word List UI
- Daily mode: `#words-modal` with `.modal-content`, `.close-button`, and `.words-list`
- Unlimited mode: `.word-list-panel` slide-in with `#word-list-content`

### Statistics UI
- Daily mode: Modal injected at runtime
  - `#stats-modal.modal`
  - `.modal-content.stats-content`
  - `#closeStatsBtn`
  - `#stats-container`
- Unlimited mode: Stats displayed via `showMessage()` overlay in `#message-container`

### Footer
- `.social-footer`: Footer with social link(s)
  - `.social-link`: External link styling

### Accessibility and Interaction Notes
- Buttons have visible labels or emojis; important actions have `title` attributes in daily mode.
- Keyboard support mirrors on-screen keyboard behavior for all letters and Enter/Delete.

