import {
  getLogInUser,
  updateLastRating,
  logoutUser,
  isLoggedIn,
} from "./setGetUser.js";
document.addEventListener("DOMContentLoaded", function () {
  if (!isLoggedIn("student")) {
    window.location.href = "login.html";
  }
  let question = JSON.parse(localStorage.getItem("QuestionList"));
  let user = getLogInUser();
  const correctAnswers = ((q) => {
    return q.map((question) => {
      return question.options
        .map((answer, index) => (answer.isCorrect ? index : null))
        .filter((index) => index !== null);
    });
  })(question);
  let userAnswerList = JSON.parse(localStorage.getItem("answerList")) || [];

  function getScore(correctAnswers, userAnswerList) {
    let score = 0;

    userAnswerList.forEach((answer) => {
      if (answer !== null) {
        const { questionNum, arrAnswer } = answer;
        const correctAnswer = correctAnswers[questionNum];

        console.log(arrAnswer, correctAnswer);
        if (
          correctAnswer !== null &&
          arraysEqual(arrAnswer.sort(), correctAnswer.sort())
        ) {
          score++;
        }
      }
    });

    return score;
  }

  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] != b[i]) return false;
    }
    return true;
  }

  const header = localStorage.getItem("scorePage");
  if (header === "RunTimeOut") {
    document.getElementsByClassName("result-header")[0].innerText =
      "Run Time Out";
  } else {
    document.getElementsByClassName("result-header")[0].innerText =
      "Your Result";
  }
  let testId = localStorage.getItem("TestId");
  console.log(testId);
  const score = getScore(correctAnswers, userAnswerList);
  console.log(user.lastRating);
  const lastScore =
    user.lastRating.find((ls) => {
      console.log(ls, "hi");
      if (ls.Id == testId) {
        console.log("hi");
        return true;
      }
    })?.LastScore || 0;
  console.log(lastScore);
  const percentage = (score / question.length) * 100;
  let passingScore = question.length / 2;

  document.getElementById("your-points").innerText = score;
  document.getElementById("last-points").innerText = lastScore;
  document.getElementById("your-score").innerText = percentage.toFixed(2) + "%";

  if (score >= passingScore) {
    document.getElementById("result-icon").classList.add("text-success");
    document.getElementById("result-icon").innerHTML =
      '<i class="fas fa-thumbs-up"></i>';
    document.getElementById(
      "result-message"
    ).innerText = `Congratulations, ${user.firstName} ${user.lastName} passed the quiz. `;
  } else {
    document.getElementById("result-icon").classList.add("text-danger");
    document.getElementById("result-icon").innerHTML =
      '<i class="fas fa-thumbs-down"></i>';
    document.getElementById(
      "result-message"
    ).innerText = `${user.firstName} ${user.lastName} did not pass the quiz. `;
  }
  document.getElementById("logoutButton").addEventListener("click", logoutUser);
  document.getElementById("toTest").addEventListener("click", function () {
    updateLastRating(user, score, testId); //
    localStorage.removeItem("answerList");
    localStorage.removeItem("Timer");
    localStorage.removeItem("startTime");
    localStorage.removeItem("shuffled");
    localStorage.removeItem("QuestionList");
    localStorage.removeItem("TestId");
    localStorage.removeItem("scorePage");
    window.location.href = "homeUser.html";
  });
});
