/* Timed Quiz App — original code by Clamor.
   10 questions per round, per-question countdown, instant feedback,
   best-score persistence, and a "review your mistakes" screen that
   explains the correct answer for every question you got wrong.
   Questions: Open Trivia DB when online, built-in bank as fallback. */
"use strict";

const FALLBACK_BANK = [
  { category: "general", difficulty: "easy", q: "How many days are there in a leap year?", options: ["365", "366", "364", "367"], answer: 1, why: "A leap year adds 29 February, making 366 days in total." },
  { category: "general", difficulty: "easy", q: "Which planet is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Saturn"], answer: 2, why: "Mars looks red because its surface is rich in iron oxide — rust." },
  { category: "general", difficulty: "medium", q: "What is the smallest prime number?", options: ["0", "1", "2", "3"], answer: 2, why: "2 is the only even prime number; 1 is not prime by definition." },
  { category: "general", difficulty: "medium", q: "In which year did humans first land on the Moon?", options: ["1959", "1969", "1975", "1981"], answer: 1, why: "Apollo 11 landed on 20 July 1969." },
  { category: "general", difficulty: "hard", q: "Which country was the first to grant women the right to vote?", options: ["USA", "UK", "New Zealand", "France"], answer: 2, why: "New Zealand granted women the vote in 1893, the first country to do so." },
  { category: "science", difficulty: "easy", q: "What is the chemical symbol for water?", options: ["CO2", "O2", "H2O", "NaCl"], answer: 2, why: "Water is two hydrogen atoms bonded to one oxygen atom: H2O." },
  { category: "science", difficulty: "easy", q: "What force keeps us on the ground?", options: ["Magnetism", "Friction", "Gravity", "Inertia"], answer: 2, why: "Gravity pulls masses toward each other — Earth pulls us down." },
  { category: "science", difficulty: "medium", q: "Which organ in the human body produces insulin?", options: ["Liver", "Pancreas", "Kidney", "Spleen"], answer: 1, why: "The pancreas produces insulin, which regulates blood sugar." },
  { category: "science", difficulty: "medium", q: "What is the speed of light in a vacuum (approx.)?", options: ["150,000 km/s", "300,000 km/s", "450,000 km/s", "1,000,000 km/s"], answer: 1, why: "Light travels at about 299,792 km per second in a vacuum." },
  { category: "science", difficulty: "hard", q: "Which subatomic particle carries a negative charge?", options: ["Proton", "Neutron", "Electron", "Photon"], answer: 2, why: "Electrons are negatively charged; protons are positive and neutrons neutral." },
  { category: "tech", difficulty: "easy", q: "What does 'HTML' stand for?", options: ["HyperText Markup Language", "HighText Machine Language", "Hyperlink Text Mode Language", "Home Tool Markup Language"], answer: 0, why: "HTML = HyperText Markup Language, the standard language of web pages." },
  { category: "tech", difficulty: "easy", q: "Which company created the Android operating system?", options: ["Apple", "Microsoft", "Google", "Samsung"], answer: 2, why: "Android was developed by Android Inc., acquired by Google in 2005." },
  { category: "tech", difficulty: "medium", q: "What does 'CPU' stand for?", options: ["Central Process Unit", "Central Processing Unit", "Computer Personal Unit", "Central Program Utility"], answer: 1, why: "CPU = Central Processing Unit, the brain of the computer." },
  { category: "tech", difficulty: "medium", q: "Which language is primarily used to style web pages?", options: ["JavaScript", "Python", "CSS", "SQL"], answer: 2, why: "CSS (Cascading Style Sheets) controls layout, colours and fonts." },
  { category: "tech", difficulty: "hard", q: "In programming, what does 'API' stand for?", options: ["Application Programming Interface", "Advanced Program Integration", "Automated Process Instruction", "Application Protocol Internet"], answer: 0, why: "API = Application Programming Interface — a contract for software to talk to software." },
  { category: "geography", difficulty: "easy", q: "What is the capital of Japan?", options: ["Seoul", "Beijing", "Tokyo", "Bangkok"], answer: 2, why: "Tokyo has been Japan's capital since 1868." },
  { category: "geography", difficulty: "easy", q: "Which is the longest river in the world?", options: ["Amazon", "Yangtze", "Mississippi", "Nile"], answer: 3, why: "The Nile is generally regarded as the longest river, at about 6,650 km." },
  { category: "geography", difficulty: "medium", q: "Which desert is the largest hot desert in the world?", options: ["Gobi", "Sahara", "Kalahari", "Mojave"], answer: 1, why: "The Sahara covers about 9 million km² across North Africa." },
  { category: "geography", difficulty: "medium", q: "Mount Everest sits on the border of Nepal and which other country?", options: ["India", "China", "Bhutan", "Pakistan"], answer: 1, why: "Everest straddles the Nepal–China (Tibet) border." },
  { category: "geography", difficulty: "hard", q: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], answer: 2, why: "Canberra is the capital — Sydney is the largest city, not the capital." },
  { category: "general", difficulty: "hard", q: "How many sides does a heptagon have?", options: ["5", "6", "7", "8"], answer: 2, why: "Heptagon comes from Greek 'hepta' (seven) — it has seven sides." },
  { category: "science", difficulty: "hard", q: "What is the powerhouse of the cell?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"], answer: 2, why: "Mitochondria generate most of the cell's ATP energy." },
  { category: "tech", difficulty: "easy", q: "What does 'www' stand for?", options: ["World Wide Web", "World Web Window", "Wide World Web", "Web World Wide"], answer: 0, why: "WWW = World Wide Web, invented by Tim Berners-Lee in 1989." },
  { category: "geography", difficulty: "easy", q: "Which ocean is the largest?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3, why: "The Pacific covers more area than all of Earth's land combined." },
];

const TIME_LIMITS = { easy: 30, medium: 20, hard: 15 };
const CATEGORY_IDS = { general: 9, science: 17, tech: 18, geography: 22 };

const $ = (id) => document.getElementById(id);
const setupScreen = $("setupScreen"), quizScreen = $("quizScreen"), resultsScreen = $("resultsScreen");

let questions = [], current = 0, score = 0, timeLeft = 0, timerId = null, answered = false, results = [];

function bestScore() { return Number(localStorage.getItem("timed-quiz-best") || 0); }
function renderBest() { $("bestScore").textContent = bestScore(); }
renderBest();

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function decodeHtml(s) { const t = document.createElement("textarea"); t.innerHTML = s; return t.value; }

async function fetchTrivia(category, difficulty) {
  const params = new URLSearchParams({ amount: "10", type: "multiple", difficulty });
  if (category !== "mixed") params.set("category", CATEGORY_IDS[category]);
  const res = await fetch(`https://opentdb.com/api.php?${params}`, { signal: AbortSignal.timeout(5000) });
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error("No questions returned");
  return data.results.map((r) => {
    const options = shuffle([r.correct_answer, ...r.incorrect_answers]);
    return { category, difficulty, q: decodeHtml(r.question), options: options.map(decodeHtml), answer: options.indexOf(r.correct_answer), why: `The correct answer is "${decodeHtml(r.correct_answer)}".` };
  });
}

function localQuestions(category, difficulty) {
  const pool = FALLBACK_BANK.filter((q) => (category === "mixed" || q.category === category) && q.difficulty === difficulty);
  const extra = FALLBACK_BANK.filter((q) => (category === "mixed" || q.category === category) && q.difficulty !== difficulty);
  return shuffle([...pool, ...extra]).slice(0, 10);
}

$("startBtn").addEventListener("click", async () => {
  const category = $("categorySelect").value, difficulty = $("difficultySelect").value;
  $("startBtn").disabled = true; $("startBtn").textContent = "Loading questions…";
  try { questions = await fetchTrivia(category, difficulty); }
  catch (e) { questions = localQuestions(category, difficulty); }
  $("startBtn").disabled = false; $("startBtn").textContent = "Start Quiz";
  current = 0; score = 0; results = [];
  setupScreen.hidden = true; resultsScreen.hidden = true; quizScreen.hidden = false;
  showQuestion(difficulty);
});

function showQuestion(difficulty) {
  const q = questions[current];
  answered = false;
  $("progressText").textContent = `Question ${current + 1} of ${questions.length}`;
  $("scoreText").textContent = `Score: ${score}`;
  $("questionText").textContent = q.q;
  $("questionCategory").textContent = `${q.category} · ${q.difficulty}`;
  $("feedback").textContent = ""; $("feedback").className = "feedback";
  $("nextBtn").hidden = true;
  const box = $("answers"); box.innerHTML = "";
  q.options.forEach((opt, i) => {
    const b = document.createElement("button");
    b.className = "answer-btn"; b.textContent = opt;
    b.addEventListener("click", () => answer(i));
    box.appendChild(b);
  });
  timeLeft = TIME_LIMITS[difficulty];
  updateTimer();
  clearInterval(timerId);
  timerId = setInterval(() => { timeLeft--; updateTimer(); if (timeLeft <= 0) { clearInterval(timerId); answer(-1); } }, 1000);
}

function updateTimer() {
  const total = TIME_LIMITS[$("difficultySelect").value];
  $("timerNum").textContent = Math.max(timeLeft, 0);
  const bar = $("timerBar");
  bar.style.width = `${(Math.max(timeLeft, 0) / total) * 100}%`;
  bar.classList.toggle("low", timeLeft <= 5);
}

function answer(picked) {
  if (answered) return;
  answered = true; clearInterval(timerId);
  const q = questions[current];
  const correct = picked === q.answer;
  if (correct) score++;
  results.push({ ...q, picked, correct, timedOut: picked === -1 });
  document.querySelectorAll(".answer-btn").forEach((b, i) => {
    b.disabled = true;
    if (i === q.answer) b.classList.add("correct");
    else if (i === picked) b.classList.add("wrong");
  });
  const fb = $("feedback");
  fb.textContent = picked === -1 ? `⏰ Time's up! Correct answer: ${q.options[q.answer]}` : correct ? "✅ Correct!" : `❌ Wrong — correct answer: ${q.options[q.answer]}`;
  fb.className = "feedback " + (correct ? "good" : "bad");
  $("scoreText").textContent = `Score: ${score}`;
  $("nextBtn").hidden = false;
  $("nextBtn").textContent = current === questions.length - 1 ? "See Results →" : "Next Question →";
}

$("nextBtn").addEventListener("click", () => {
  current++;
  if (current < questions.length) showQuestion($("difficultySelect").value);
  else showResults();
});

function showResults() {
  quizScreen.hidden = true; resultsScreen.hidden = false;
  const total = questions.length;
  $("resultHeading").textContent = score === total ? "🏆 Perfect score!" : score >= total * 0.7 ? "🎉 Great job!" : score >= total * 0.4 ? "👍 Not bad — keep practising!" : "📚 Keep practising!";
  $("finalScore").textContent = `${score} / ${total}`;
  $("resultMessage").textContent = `You answered ${score} out of ${total} correctly.`;
  const best = bestScore();
  if (score > best) { localStorage.setItem("timed-quiz-best", String(score)); $("newBest").hidden = false; renderBest(); }
  else $("newBest").hidden = true;
  $("reviewList").hidden = true; $("reviewList").innerHTML = "";
}

$("reviewBtn").addEventListener("click", () => {
  const list = $("reviewList");
  const mistakes = results.filter((r) => !r.correct);
  if (mistakes.length === 0) { list.innerHTML = "<p>🎉 No mistakes — you got every question right!</p>"; }
  else {
    list.innerHTML = "";
    mistakes.forEach((r, i) => {
      const div = document.createElement("div");
      div.className = "review-item";
      div.innerHTML = `<h3>${i + 1}. ${r.q}</h3>
        <p>Your answer: <strong>${r.timedOut ? "⏰ No answer (time ran out)" : r.options[r.picked]}</strong></p>
        <p>Correct answer: <strong>${r.options[r.answer]}</strong></p>
        <p class="why">Why: ${r.why}</p>`;
      list.appendChild(div);
    });
  }
  list.hidden = false;
});

$("restartBtn").addEventListener("click", () => {
  resultsScreen.hidden = true; setupScreen.hidden = false;
});
