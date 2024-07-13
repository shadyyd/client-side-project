import { isLoggedIn, getLogInUser } from "./setGetUser.js";
import { loadExam } from "./Exams.js";
import { logoutUser } from "./setGetUser.js";

function loadTests() {
  const testsDiv = document.querySelector(".testss");
  let testsArr = JSON.parse(localStorage.getItem("tests")) || [];

  // Clear existing content in the testsDiv to prevent duplication
  testsDiv.innerHTML = "";

  testsArr.forEach((test) => {
    const testDiv = document.createElement("div");
    testDiv.className = "col-md-4";
    const innerDiv = document.createElement("div");
    innerDiv.className = "card mb-4";
    const img = document.createElement("img");
    img.className = "card-img-top";

    img.src = test.img;

    const card = document.createElement("div");
    card.className = "card-body";
    card.innerHTML = `
      <h5 class="card-title">${test.name}</h5>
      <p class="card-text"><strong>Type:</strong> ${test.type}</p>
      <p class="card-text"><strong>Duration:</strong> ${test.timer} minutes</p>
      <p class="card-text"><strong>Questions:</strong> ${test.numOfQuestions}</p>
      <p class="card-text"><strong>Difficulty:</strong> ${test.difficulty}</p>`;
    const a = document.createElement("a");
    a.className = "btn btn-custom btn-custom-hover";
    a.href = "#";
    a.textContent = "Start Test";
    a.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.setItem("QuestionList", JSON.stringify(test.questions));
      localStorage.setItem("TestId", test.id);
      localStorage.setItem("Timer", test.timer);
      const startTime = new Date().getTime();
      localStorage.setItem("startTime", startTime);
      window.location.href = "test.html";
    });
    card.appendChild(a);
    innerDiv.appendChild(img);
    innerDiv.appendChild(card);
    testDiv.appendChild(innerDiv);
    testsDiv.appendChild(testDiv);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  if (!isLoggedIn("student")) {
    window.location.href = "login.html";
  }
  await loadExam();
  const user = getLogInUser();
  const h1 = document.querySelector("#welcome-heading");
  if (user && h1) {
    h1.textContent = `Welcome, ${user.firstName}!`;
  }
  loadTests();
  document.getElementById("logoutButton").addEventListener("click", logoutUser);
});
