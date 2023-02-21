
// Get the HTML elements from the page
var quizContainer = document.getElementById("question");
var choiceContainer = document.getElementById("choices");
var scoreContainer = document.getElementById("score");
var timerContainer = document.getElementById("timer");
var startButton = document.getElementById("start");
var saveButton = document.getElementById("save");
var restartButton = document.getElementById("restart");


// Set initial values
var currentQuestion = 0;
var score = 0;
var timer;
var timeLeft = 60;

// Define the quiz questions
var questions = [
  {
    question: "What team did Michael Jordan play for?",
    choices: ["Bulls", "Knicks", "Yankees", "Redsox"],
    correctAnswer: 0,
  },
  {
    question: "Name a player on the current Mets roster?",
    choices: ["Allen Houston", "Pete Alonso", "Lebron James", "Michael Jackson"],
    correctAnswer: 1,
  },
  {
    question: "What planet are currently on?",
    choices: ["Mars", "The Sun", "Venus", "Earth"],
    correctAnswer: 3,
  },
];


// Start the quiz when the user clicks the "Start Quiz" button

function startQuiz() {
  startButton.style.display = "none";
  renderQuestion();
  startTimer();
}

function startTimer() {
  timer = setInterval(function () {
    timeLeft--;
    timerContainer.textContent = "Time: " + timeLeft;
    if (timeLeft <= 0) {
      endQuiz();
    }
  }, 1000);
}


// Render a question and its choices on the screen
function renderQuestion() {
  if (currentQuestion >= questions.length) {
    endQuiz();
    return;
  }
  const question = questions[currentQuestion];
  quizContainer.textContent = question.question;
  choiceContainer.innerHTML = "";
  for (let i = 0; i < question.choices.length; i++) {
    var label = document.createElement("label");
    var input = document.createElement("input");
    var text = document.createTextNode(question.choices[i]);
    input.setAttribute("type", "radio");
    input.setAttribute("name", "choice");
    input.setAttribute("value", i);
    label.appendChild(input);
    label.appendChild(text);
    choiceContainer.appendChild(label);
  }
  var submitButton = document.createElement("button");
  submitButton.textContent = "Submit";
  submitButton.addEventListener("click", function () {
    var selectedChoice = document.querySelector(
      'input[name="choice"]:checked'
    );
    if (selectedChoice) {
      var selectedIndex = parseInt(selectedChoice.value);
      var isCorrect = checkAnswer(selectedIndex, question.correctAnswer);
      if (isCorrect) {
        score++;
        scoreContainer.textContent = "Score: " + score;
      } else {
        timeLeft -= 10;
        if (timeLeft < 0) {
          timeLeft = 0;
        }
      }
      currentQuestion++;
      renderQuestion();
    }
  });
  choiceContainer.appendChild(submitButton);
}

function checkAnswer(selectedIndex, correctIndex) {
  return selectedIndex === correctIndex;
}

// End the quiz and display the user's score

function endQuiz() {
  clearInterval(timer);
  quizContainer.style.display = "none";
  choiceContainer.style.display = "none";
  scoreContainer.style.display = "";
  scoreContainer.textContent = "Final score: " + score;
  

  saveButton.style.display = "";
  saveButton.addEventListener("click", function () {
    var initials = prompt("Enter your initials:");
    if (initials) {
      var highScores = JSON.parse(localStorage.getItem("highScores")) || [];
      var newScore = { initials: initials, score: score };
      highScores.push(newScore);
      highScores.sort(function(a, b) {
        return b.score - a.score;
      });
      highScores.splice(5);
      localStorage.setItem("highScores", JSON.stringify(highScores));
      showTopScores();
    }
  });
  function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    timeLeft = 60;
    quizContainer.style.display = "";
    choiceContainer.style.display = "";
    scoreContainer.style.display = "none";
    saveButton.style.display = "none";
    startQuiz();
  }
}

// Shows top scores

function showTopScores() {
  var topScoresList = document.getElementById("top-scores");
  topScoresList.innerHTML = "";
  var highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  highScores.forEach(function(score) {
    var scoreItem = document.createElement("li");
    scoreItem.textContent = score.initials + " - " + score.score;
    topScoresList.appendChild(scoreItem);
  });
}

startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);
