const textDisplay = document.getElementById("text-display");
const inputBox = document.getElementById("input-box");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const cpmEl = document.getElementById("cpm");
const mistakesEl = document.getElementById("mistakes");
const missingEl = document.getElementById("missing");
const extraEl = document.getElementById("extra");
const restartBtn = document.getElementById("restart");

const texts = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing games improve your speed and accuracy.",
    "Practice makes perfect, so keep typing every day.",
    "Python programming is fun and powerful.",
    "Creativity and focus help you learn faster.",
    "Never give up, even if you make mistakes.",
    "Speed comes with practice, patience, and persistence.",
    "A good typist always keeps their fingers on the keys.",
    "Challenge yourself to beat your previous score.",
    "Consistency is key to becoming a typing master."
];

let currentText = "";
let time = 60;
let timer = null;
let isRunning = false;
let isFinished = false; // new flag to freeze stats after full stop

function setNewText() {
    currentText = texts[Math.floor(Math.random() * texts.length)];
    displayText("");
    inputBox.value = "";
    time = 60;
    timeEl.textContent = time;
    wpmEl.textContent = 0;
    cpmEl.textContent = 0;
    mistakesEl.textContent = 0;
    missingEl.textContent = currentText.length;
    extraEl.textContent = 0;
    inputBox.disabled = false;
    isRunning = false;
    isFinished = false;
}

function displayText(userInput) {
    if (isFinished) return; // freeze display after full stop

    let html = "";
    let mistakes = 0;
    let missing = 0;
    let extra = 0;

    for (let i = 0; i < currentText.length; i++) {
        if (i < userInput.length) {
            if (userInput[i] === currentText[i]) {
                html += `<span style="color:green">${currentText[i]}</span>`;
            } else {
                html += `<span style="color:red">${currentText[i]}</span>`;
                mistakes++;
            }
        } else {
            html += currentText[i];
            missing++;
        }
    }

    if (userInput.length > currentText.length) {
        extra = userInput.length - currentText.length;
    }

    textDisplay.innerHTML = html;

    // update live stats
    mistakesEl.textContent = mistakes;
    missingEl.textContent = missing;
    extraEl.textContent = extra;
    wpmEl.textContent = calculateWPM(userInput);
    cpmEl.textContent = calculateCPM(userInput);
}

function calculateWPM(userInput) {
    const wordsTyped = userInput.trim().split(/\s+/).filter(Boolean).length;
    const minutesElapsed = (60 - time) / 60;
    return minutesElapsed > 0 ? Math.round(wordsTyped / minutesElapsed) : 0;
}

function calculateCPM(userInput) {
    const charsTyped = userInput.length;
    const minutesElapsed = (60 - time) / 60;
    return minutesElapsed > 0 ? Math.round(charsTyped / minutesElapsed) : 0;
}

function stopTest() {
    clearInterval(timer);
    inputBox.disabled = true;
    isFinished = true; // freeze stats
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(() => {
            if (isFinished) return; // stop timer updates

            time--;
            timeEl.textContent = time;

            if (time <= 0) stopTest();
        }, 1000);
    }
}

// Event listener
inputBox.addEventListener("input", () => {
    if (isFinished) return; // ignore input after full stop

    displayText(inputBox.value);
    startTimer();

    // stop immediately if last typed character is a full stop
    if (inputBox.value.endsWith(".")) {
        stopTest();
    }
});

restartBtn.addEventListener("click", () => {
    clearInterval(timer);
    setNewText();
    inputBox.focus();
});

// Initialize
setNewText();
