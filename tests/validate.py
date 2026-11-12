#!/usr/bin/env python3
"""Automated structural validation for the Timed Quiz App.
Checks that src/index.html + src/app.js contain every element the
guide entry requires. Run: python3 tests/validate.py (exit 0 = pass)."""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
html = (ROOT / "src" / "index.html").read_text()
js = (ROOT / "src" / "app.js").read_text()
css = (ROOT / "src" / "styles.css").read_text()

checks = [
    ("index.html exists and references styles.css", 'href="styles.css"' in html),
    ("index.html references app.js", 'src="app.js"' in html),
    ("setup screen present", 'id="setupScreen"' in html),
    ("quiz screen present", 'id="quizScreen"' in html),
    ("results screen present", 'id="resultsScreen"' in html),
    ("category selector present", 'id="categorySelect"' in html),
    ("difficulty selector present", 'id="difficultySelect"' in html),
    ("timer bar present", 'id="timerBar"' in html),
    ("review button present", 'id="reviewBtn"' in html),
    ("fallback question bank has >= 10 questions", len(re.findall(r"\bq: \"", js)) >= 10),
    ("every bank question has an explanation", js.count("why:") >= 10),
    ("time limits 30/20/15s present", all(x in js for x in ("easy: 30", "medium: 20", "hard: 15"))),
    ("Open Trivia DB fetch present", "opentdb.com/api.php" in js),
    ("best score persisted in localStorage", "timed-quiz-best" in js),
    ("timeout handled as wrong answer", "timedOut" in js),
    ("timer bar styled", ".timer-bar" in css),
]
failed = [name for name, ok in checks if not ok]
for name, ok in checks:
    print(("PASS " if ok else "FAIL ") + name)
print(f"{len(checks) - len(failed)}/{len(checks)} checks passed")
sys.exit(1 if failed else 0)
