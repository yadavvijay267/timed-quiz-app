# Architecture — Timed Quiz App

## Overview

A single-page app with three screens (setup → quiz → results) toggled by the `hidden` attribute. No framework, no build step, no server.

## Files

| File | Role |
| --- | --- |
| `src/index.html` | Markup for all three screens: setup form, quiz area (timer bar, question, answers), results + review list. |
| `src/styles.css` | Dark theme, timer bar, answer-button states (correct/wrong), review cards. |
| `src/app.js` | All game logic (below). |

## Flow

```
Start → fetch 10 questions (Open Trivia DB, 5s timeout)
        └─ on failure → localQuestions() picks 10 from FALLBACK_BANK
     → showQuestion(): render question, start 1s interval timer
     → answer(i) or timeout: stop timer, mark correct/wrong, show feedback
     → Next → next question … after Q10 → showResults()
     → Review My Mistakes → render only results where correct === false,
       with the stored `why` explanation for each
```

## Key decisions

- **Fallback question bank:** 24 original questions across 4 categories × 3 difficulties, each with an explanation (`why`). The Open Trivia DB path maps API results into the same `{q, options, answer, why}` shape, so the rest of the code never knows which source was used.
- **Timer:** `TIME_LIMITS = {easy: 30, medium: 20, hard: 15}` seconds. One `setInterval` per question, cleared on answer or timeout. The bar width is a percentage of the limit and turns red at ≤ 5s.
- **Scoring & persistence:** score is a plain counter; best score is stored under `timed-quiz-best` in `localStorage` and only overwritten when beaten.
- **Timeouts count as wrong:** answering with `picked = -1` records `timedOut: true`, so the review screen can say "No answer (time ran out)".

## Data shape

```js
{ category, difficulty, q, options: [String ×4], answer: Number, why: String }
```
