## Storage Schemas and Timing Behavior

This guide documents how Brainrodle uses `localStorage` and how day rollover and timers are computed.

### Daily Mode Storage
- Key: `brainrodle_stats`
```
{
  gamesPlayed: number,
  gamesWon: number,
  currentStreak: number,
  maxStreak: number,
  lastPlayedDate: string | null,  // ISO date in Warsaw time (yyyy-mm-dd)
  lastGuesses: string[],          // Visual representation of guesses with 🟩🟨⬛
  guessDistribution: { 1: number, 2: number, 3: number, 4: number, 5: number, 6: number }
}
```

Initialization rules:
- On load, missing fields are merged with defaults to maintain backward compatibility
- When the day changes (Warsaw time), `lastGuesses` resets on the next play

Streak handling:
- `currentStreak` increments on win, resets to 0 on loss
- If the gap between `lastPlayedDate` and today is more than 1 day, streak resets to 0
- `maxStreak` tracks the maximum value of `currentStreak`

Guess distribution:
- On win, the bucket corresponding to attempts (1..6) increments

### Unlimited Mode Storage
- Key: `brainrodle_unlimited_stats`
```
{
  gamesPlayed: number,
  gamesWon: number,
  bestStreak: number,
  currentStreak: number,
  lastGuesses: string[]
}
```

Rules:
- `currentStreak` increments on win, resets on loss
- `bestStreak` is the max of `currentStreak`
- `lastGuesses` stores the visualized board of the last completed game

### Timing and Day Rollover (Daily Mode)
- Daily word is chosen by seeding with the ISO date for Europe/Warsaw
- The countdown uses the current Warsaw time and computes the duration until Warsaw midnight
- The countdown display is refreshed every second when the player has already played today

### Notes for Developers
- All words in `WORDS` must be uppercase to match user input normalization
- Avoid renaming storage keys without a migration; the code merges defaults but keys must remain stable
- Changes to word length automatically flow through board creation logic and UI

