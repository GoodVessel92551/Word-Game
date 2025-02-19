const greenFlipMeter = document.getElementById("greenFlipMeter");
const word = document.getElementById("word");
const startGameButton = document.getElementById("startGameButton");
let turnComplete = false;
let wordsList = [];
let canChangeWord = true; // Cooldown flag
let gameStarted = false;

const params = new URLSearchParams(window.location.search);
const topic = params.get("topic");
const subtopic = params.get("subtopic");


fetch("/static/words.json")
  .then(response => response.json())
  .then(data => {
    wordsList = data[topic][subtopic].words;
  });

const startGame = () => {
  goFullScreen();
  startGameButton.style.display = "none";
  nextWord();
  gameStarted = true;
  window.addEventListener("deviceorientation", handleOrientation, true);
}

const nextWord = () => {
  if (!canChangeWord) return; // Prevent function execution if cooldown is active
  canChangeWord = false; // Set cooldown flag to false
  setTimeout(() => canChangeWord = true, 1000); // Reset cooldown flag after 1 second

  let randomWord = wordsList[Math.floor(Math.random() * wordsList.length)];
  word.innerHTML = randomWord;
  wordsList = wordsList.filter(word => word !== randomWord);
  if (wordsList.length === 0) {
    window.removeEventListener("deviceorientation", handleOrientation, true);
    word.innerHTML = "Game Over!";
  }
}

const isLandscapeWithCameraLeft = () => {
  if (screen.orientation) {
    return screen.orientation.angle
  }
  return 0
}

function goFullScreen() {
  let elem = document.documentElement; // Fullscreen for the entire page
  if (elem.requestFullscreen) {
      elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { // Firefox
      elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { // Chrome, Safari, Opera
      elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { // IE/Edge
      elem.msRequestFullscreen();
  }
}


let gamma_value = 0;
const handleOrientation = (event) => {
    const angle = isLandscapeWithCameraLeft()
    if (angle === 0 || angle === 180) {
      return
    }


    gamma_value = event.gamma;

    let gammaPercent = (50/gamma_value)*100;
    if (gammaPercent > 100){
      gammaPercent = 100;
    }else if (gammaPercent < -100){
      gammaPercent = -100;
    }
    if(gammaPercent < 0){
      if(angle === 270){
        greenFlipMeter.style.bottom = ((100-Math.abs(gammaPercent))) + "%";
      }else{
        greenFlipMeter.style.bottom = (Math.abs(gammaPercent)) + "%";
      }

    }else if(gammaPercent > 0){
      if(angle === 90){
        greenFlipMeter.style.bottom = ((100-Math.abs(gammaPercent))) + "%";
      }else{
        greenFlipMeter.style.bottom = (Math.abs(gammaPercent)) + "%";
      }
    }
    let gamma = event.gamma;
    if (gamma > 50 || gamma <-50){
      turnComplete = false;
      document.body.style.background = "linear-gradient(296deg, rgba(0, 0, 0, 0.00) 34.23%, rgba(133, 93, 53, 0.20) 63%), linear-gradient(128deg, #242424 11.44%, #3F3021 74.65%)";
      word.style.color = "#FFFFFF"
    }else if (gamma > 0 && gamma < 50){
      if (!turnComplete){
        nextWord();
        navigator.vibrate(400);
      }
      turnComplete = true;
      if (angle === 90){
        document.body.style.background = "#FFA9A9";
        word.style.color = "#5A2E2E"
      }else{
        document.body.style.background = "#CAFFA9";
        word.style.color = "#283A1D"
      }
    }
    else if (gamma < 0 && gamma > -50){
      if (!turnComplete){
        nextWord();
        navigator.vibrate(200);
      }
      turnComplete = true;
      if (angle === 90){
        document.body.style.background = "#CAFFA9";
        word.style.color = "#283A1D"
      }else{
        document.body.style.background = "#FFA9A9";
        word.style.color = "#5A2E2E"
      }
    }
    else{
      document.body.style.background = "linear-gradient(296deg, rgba(0, 0, 0, 0.00) 34.23%, rgba(133, 93, 53, 0.20) 63%), linear-gradient(128deg, #242424 11.44%, #3F3021 74.65%)";
    }
  }
