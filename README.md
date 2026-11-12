# ⏱️ Timed Quiz App

A timed multiple-choice quiz with categories, scoring, and a results review screen. Pick a category and difficulty, answer 10 questions against the clock, get instant feedback — then review every mistake with an explanation of the correct answer.

## Features

- **Category & difficulty selection** — General Knowledge, Science, Technology, Geography, or Mixed; Easy (30s), Medium (20s) or Hard (15s) per question.
- **10 questions per round** — fetched live from the Open Trivia DB (free, no key) with a built-in 24-question bank as an offline fallback, so the quiz always works.
- **Per-question countdown timer** — visual progress bar that turns red under 5 seconds; running out of time counts as a wrong answer.
- **Instant feedback** — correct/wrong highlighting and the right answer shown immediately.
- **Final score & answer review** — results screen with a score message, plus a "Review My Mistakes" screen that explains the correct answer for every question you got wrong.
- **Best-score persistence** — your best score out of 10 is saved in `localStorage` and shown on the setup screen.

## Tech Stack

- HTML, CSS, JavaScript (no frameworks, no build step)
- Open Trivia DB API (free, no key) — with a local fallback question bank

## How to Run

No installation needed:

```bash
# Option 1: just open the file
open src/index.html        # macOS
xdg-open src/index.html    # Linux
start src/index.html       # Windows

# Option 2: serve it locally (recommended, so the trivia API works without file:// limits)
python3 -m http.server --directory src 8000
# then visit http://localhost:8000
```

## How to Play

1. Choose a category and difficulty, then click **Start Quiz**.
2. Answer each question before the timer runs out — click an answer or let the clock decide for you.
3. Click **Next Question** after each answer.
4. On the results screen, click **Review My Mistakes** to see every wrong answer explained, then **Play Again**.

## Screenshots

Screenshots live in [`screenshots/`](screenshots/) — see `SCREENSHOTS.md` there for the naming convention.

## Project Structure

```
timed-quiz-app/
├── src/
│   ├── index.html   # setup / quiz / results screens
│   ├── styles.css   # dark theme, timer bar, answer states
│   └── app.js       # game logic, timer, trivia fetch + fallback bank
├── assets/          # logo.svg
├── docs/            # ARCHITECTURE.md
├── tests/           # TESTING.md + validate.py
└── screenshots/     # SCREENSHOTS.md
```

## License

MIT — see [LICENSE](LICENSE). Copyright (c) 2026 Clamor.
