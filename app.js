// Quiz data
const quizQuestions = [
  {
    question: "What usually happens when someone falls in love?",
    options: [
      "They feel sleepy all the time",
      "They keep thinking about them",
      "They forget what day it is",
      "They eat a lot",
    ],
    answer: "They keep thinking about them",
  },
  {
    question: "What’s sweeter than chocolate?",
    options: ["Sugar", "Honey", "Their smile", "Ice cream"],
    answer: "Their smile",
  },
  {
    question: "If love were food, what would it be?",
    options: [
      "Pizza, because everyone loves it",
      "Candy, because it’s super sweet",
      "Spicy noodles, because it’s fiery and fun",
      "BBQ, because it’s irresistible",
    ],
    answer: "Candy, because it’s super sweet",
  },
  {
    question: "What makes your heart suddenly race?",
    options: [
      "Too much coffee",
      "Seeing them",
      "Riding a roller coaster",
      "Running a marathon",
    ],
    answer: "Seeing them",
  },
  {
    question: "Why do stars shine brighter when you’re in love?",
    options: [
      "Because you see magic everywhere",
      "Because your heart lights up",
      "Because the universe is happy for you",
      "Because of imagination",
    ],
    answer: "Because you see magic everywhere",
  },
  {
    question: "What’s the best way to describe love?",
    options: [
      "A warm hug",
      "A roller coaster",
      "A beautiful melody",
      "All of the above",
    ],
    answer: "All of the above",
  },
  {
    question: "Why do people write love letters?",
    options: [
      "To impress someone",
      "To express feelings they can't say",
      "To look romantic",
      "Because it's an old tradition",
    ],
    answer: "To express feelings they can't say",
  },
  {
    question: "What does it mean when your heart skips a beat?",
    options: [
      "You’re nervous",
      "You’re in love",
      "You’re surprised",
      "You’re exercising too hard",
    ],
    answer: "You’re in love",
  },
  {
    question: "What’s the best thing about falling in love?",
    options: [
      "You smile more",
      "Everything feels magical",
      "You feel inspired",
      "All of the above",
    ],
    answer: "All of the above",
  },
  {
    question: "What’s the best gift for someone you love?",
    options: [
      "A handwritten letter",
      "A heartfelt hug",
      "A meaningful memory",
      "All of the above",
    ],
    answer: "All of the above",
  },
];

let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let timerInterval;
let timeRemaining = 180; // Set timeRemaining to 3 minutes (180 seconds)
const timeData = {}; // Stores remaining time per question

// Function to show the welcome message
function showWelcomeMessage() {
  const welcomeBox = document.getElementById("welcome-message");
  welcomeBox.style.display = "block"; // Show the welcome box
}

// Call the function to display the message after a short delay
setTimeout(showWelcomeMessage, 1000); // Show message after 1 second

// Login Function
function loginForm() {
  const email = document.getElementById("uEmail").value.trim();
  const password = document.getElementById("uPass").value.trim();

  const users = JSON.parse(localStorage.getItem("quiz-app")) || [];
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    Swal.fire({
      icon: "success",
      title: "Login Successful",
      text: "Welcome to the Quiz!",
    }).then(() => {
      const welcomeBox = document.getElementById("welcome-message");
      if (welcomeBox) welcomeBox.style.display = "none";

      document.querySelector(".login_form").style.display = "none";
      document.querySelector(".info_box").style.display = "block";
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Login Failed",
      text: "Invalid email or password.",
    });
  }
}

// Start Quiz
function enterQuiz() {
  document.querySelector(".info_box").style.display = "none";
  document.querySelector(".quiz_container").style.display = "block";
  renderQuestion();
}

// Render Question
function renderQuestion() {
  clearInterval(timerInterval); // Stop any previous timer
  const questionData = quizQuestions[currentQuestionIndex];
  const questionContainer = document.getElementById("qustionsContainer");

  questionContainer.innerHTML = `
    <h2>${questionData.question}</h2>
    ${questionData.options
      .map(
        (option, index) =>
          `<div>
            <input type="radio" name="quizOption" id="option${index}" value="${option}" />
            <label for="option${index}">${option}</label>
          </div>`
      )
      .join("")}
  `;

  document.getElementById("qustionNo").innerText = currentQuestionIndex + 1;

  // Timer management
  timeRemaining = timeData[currentQuestionIndex] || 180; // Default to 180 seconds if no data
  updateTimer();
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimer();
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      handleNextQuestion(false); // Auto move to next question when time runs out
    }
  }, 1000);
}

// Update Timer Display
function updateTimer() {
  const timerDisplay = document.getElementById("timer");
  if (timerDisplay) timerDisplay.innerText = formatTime(timeRemaining);
}

// Format time into MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

// Handle Next Question
function handleNextQuestion(auto = false) {
  const selectedOption = document.querySelector(
    'input[name="quizOption"]:checked'
  );
  const correctAnswer = quizQuestions[currentQuestionIndex].answer;

  if (!auto) {
    if (selectedOption) {
      const answer = selectedOption.value;
      userAnswers[currentQuestionIndex] = answer;
      if (answer === correctAnswer) score++;
    } else {
      Swal.fire({
        icon: "warning",
        title: "No Option Selected",
        text: "Please select an option to proceed.",
      });
      return;
    }
  }

  // Save remaining time
  timeData[currentQuestionIndex] = timeRemaining;

  currentQuestionIndex++;
  if (currentQuestionIndex < quizQuestions.length) {
    renderQuestion();
  } else {
    calculateResult();
  }
}

// Handle Previous Question
function handlePreviousQuestion() {
  if (currentQuestionIndex > 0) {
    // Save the current question's time
    timeData[currentQuestionIndex] = timeRemaining;

    currentQuestionIndex--; // Go back to the previous question
    timeRemaining = timeData[currentQuestionIndex] || 180; // Restore saved time or default
    renderQuestion();
  }
}

// Calculate Result
function calculateResult() {
  clearInterval(timerInterval); // Stop the timer

  const totalQuestions = quizQuestions.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  document.querySelector(".quiz_container").style.display = "none";
  document.querySelector(".result_box").style.display = "block";

  document.querySelector(".progress-value").innerText = `${percentage}%`;
  document.querySelector(
    ".score_text"
  ).innerHTML = `You answered ${score} out of ${totalQuestions} questions correctly.`;
}

// Quit Quiz
function quit() {
  location.reload(); // Reload the page to reset the quiz
}

// Attach Event Listeners
document
  .getElementById("next-question")
  .addEventListener("click", () => handleNextQuestion());
document
  .getElementById("prev-question")
  .addEventListener("click", handlePreviousQuestion);
