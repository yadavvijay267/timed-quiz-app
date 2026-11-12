# Testing — Timed Quiz App

## Automated check

```bash
python3 tests/validate.py
```

`validate.py` parses `src/index.html` and `src/app.js` and asserts the required structure is present: the three screens, the category/difficulty controls, the timer bar, a question bank with ≥ 10 entries, the three time limits (30/20/15s), the review screen, and the `localStorage` best-score key. It exits non-zero on any failure.

## Manual test checklist

- [ ] Open `src/index.html` — setup screen shows, best score reads 0 on first run.
- [ ] Start a round with the network off — quiz still loads 10 questions from the fallback bank.
- [ ] Start a round online — questions come from Open Trivia DB.
- [ ] Timer counts down and the bar shrinks; it turns red at 5 seconds.
- [ ] Let a question time out — it is marked wrong and the correct answer is shown.
- [ ] Answer all 10 — results screen shows the score and a message matching the score band.
- [ ] Beat your previous best — "New best score!" appears and the header updates.
- [ ] Click "Review My Mistakes" — every wrong answer is listed with the correct answer and an explanation; a perfect round shows the no-mistakes message.
- [ ] Click "Play Again" — returns to the setup screen.
- [ ] Resize to a 360px-wide viewport — layout stays usable, no horizontal overflow.
