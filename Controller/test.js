export default function initTest() {
  const cashedAnswerList = JSON.parse(localStorage.getItem("answerList"));
  // console.log(cashedAnswerList);
  let questionList = JSON.parse(localStorage.getItem("QuestionList"));

  let isShuffled = localStorage.getItem("shuffled") || false;
  shuffleArray(questionList);

  let curQuest = 0;
  const markedQuestions = [];
  const answerList = cashedAnswerList
    ? cashedAnswerList
    : Array.from({ length: questionList.length }, () => null);
  console.log(answerList);

  // Array.from({ length: questionList.length }, () => null);
  function shuffleArray(array) {
    if (!isShuffled) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
    localStorage.setItem("shuffled", true);
  }
  function renderQuestion() {
    const question = questionList[curQuest];
    document.getElementById("question-title").innerText = `Question ${
      curQuest + 1
    }:`;
    document.getElementById("question-text").innerText = question.text;

    const answersForm = document.getElementById("answers-form");

    answersForm.innerHTML = "";

    question.options.forEach((answer, index) => {
      const optionId = `option-${index}`;
      const div = document.createElement("div");
      div.className = "form-check mb-2";

      if (question.type === "single") {
        div.innerHTML = `
      <input class="form-check-input" type="radio" name="answer-${
        answer.questionNumber
      }" id="${optionId}"
      ${
        answerList[answer.questionNumber - 1]?.arrAnswer.includes(String(index))
          ? "checked"
          : ""
      }/>
      <label class="form-check-label" for="${optionId}">${answer.text}</label>
      `;
      } else if (question.type === "multiple") {
        console.log(
          answerList[answer.questionNumber - 1]?.arrAnswer,
          String(index)
        );
        div.innerHTML = `
      <input class="form-check-input" type="checkbox" name="answer-${
        answer.questionNumber
      }" id="${optionId}" 
      ${
        answerList[answer.questionNumber - 1]?.arrAnswer.includes(String(index))
          ? "checked"
          : ""
      }
      />
      <label class="form-check-label" for="${optionId}">${answer.text}</label>
      `;
      }
      answersForm.appendChild(div);
    });
    updateMarkedButton();
    updatePagination();
  }

  function updateMarkedButton() {
    if (markedQuestions.includes(curQuest)) {
      document.getElementById("mark").checked = true;
    } else {
      document.getElementById("mark").checked = false;
    }
  }

  function updatePagination() {
    document
      .getElementById("prev-page")
      .classList.toggle("diabled-btn", curQuest === 0);

    document.getElementById("currentPage").textContent = curQuest + 1;

    document
      .getElementById("next-page")
      .classList.toggle("diabled-btn", curQuest === questionList.length - 1);
  }

  function prevPage(e) {
    e.preventDefault();

    if (curQuest > 0) {
      curQuest--;
      renderQuestion();
    }
  }

  function nextPage(e) {
    // console.log(curQuest + 1);
    e.preventDefault();

    if (curQuest < questionList.length - 1) {
      curQuest++;
      renderQuestion();
    }
  }

  function markQuestion() {
    if (!markedQuestions.includes(curQuest)) {
      markedQuestions.push(curQuest);
      updateMarkedQuestions();
    } else {
      markedQuestions.splice(markedQuestions.indexOf(curQuest), 1);
      updateMarkedQuestions();
    }
  }

  function updateMarkedQuestions() {
    const markedQuestionsList = document.getElementById("marked-questions");
    markedQuestionsList.innerHTML = "";
    markedQuestions.forEach((questionIndex) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.classList.add("btn");
      a.textContent = `Question ${questionIndex + 1}`;
      a.addEventListener("click", function () {
        curQuest = questionIndex;
        renderQuestion();
      });
      li.appendChild(a);
      markedQuestionsList.appendChild(li);
    });
  }

  function updateSelectedAnswers(e) {
    // console.log(e.target);
    const questId = e.target.name.split("-")[1] - 1;
    const answerId = e.target.id.split("-")[1];
    if (e.target.type === "radio") {
      answerList[questId] = { questionNum: questId, arrAnswer: [answerId] };
    } else if (e.target.type === "checkbox") {
      if (answerList[questId] === null) {
        const arrAnswer = [];
        arrAnswer.push(answerId);
        answerList[questId] = { questionNum: questId, arrAnswer };
      } else {
        if (!answerList[questId].arrAnswer.includes(answerId)) {
          answerList[questId].arrAnswer.push(answerId);
        } else {
          answerList[questId].arrAnswer.splice(
            answerList[questId].arrAnswer.indexOf(answerId),
            1
          );
        }
      }
    }
    // updateUserAnswerList(answerList);
    localStorage.setItem("answerList", JSON.stringify(answerList));
  }

  renderQuestion();
  document.getElementById("prev-page").addEventListener("click", prevPage);
  document.getElementById("next-page").addEventListener("click", nextPage);

  document.getElementById("mark").addEventListener("click", markQuestion);
  document
    .getElementById("answers-form")
    .addEventListener("change", updateSelectedAnswers);

  document.getElementById("submitBtn").addEventListener("click", () => {
    localStorage.setItem("scorePage", "submit");
    location.replace("../View/score.html");
  });
}
