export default function initTimer() {
  const minutes = Number(localStorage.getItem("Timer"));
  // console.log(minutes);
  let duration = 1000 * minutes * 60;

  let startTime = localStorage.getItem("startTime");
  if (!startTime) {
    startTime = new Date().getTime();
    localStorage.setItem("startTime", startTime);
  }

  var timer = setInterval(function () {
    var now = new Date().getTime();

    var elapsedTime = now - startTime;

    var percent = (elapsedTime / duration) * 100;

    var progressBar = document.getElementsByClassName("progress-bar")[0];
    progressBar.style.width = Math.min(100, percent) + "%";

    if (percent >= 70) {
      progressBar.classList.add("bg-danger", "blink");
    }
    if (elapsedTime >= duration) {
      clearInterval(timer);
      localStorage.setItem("scorePage", "RunTimeOut");
      location.replace("../View/score.html");
    }
  }, 1000);
}
