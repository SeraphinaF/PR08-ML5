const video = document.getElementById("webcam");
const label = document.getElementById("label");

const rose = document.querySelector("#rose");
const cat = document.querySelector("#cat");
const piano = document.querySelector("#piano");
const trainbtn = document.querySelector("#train");
// const speakBtn = document.getElementById('speak');

const image = document.getElementById('output')
const fileButton = document.querySelector("#file")

const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded)


fileButton.addEventListener("change", (event) => {
  image.src = URL.createObjectURL(event.target.files[0])
})

rose.addEventListener("click", () => addRose());
cat.addEventListener("click", () => addCat());
piano.addEventListener("click", () => addPiano());
// speakBtn.addEventListener("click", () => { speak(`I want to go home!`) });
trainbtn.addEventListener("click", () => train());

trainbtn.addEventListener("click", () => console.log("train"));

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => {
      console.log("Something went wrong!");
    });
}

label.innerText = "Ready when you are!";

function modelLoaded() {
  console.log('Model Loaded!')
  classifier = featureExtractor.classification(video, videoReady)
}

function videoReady() {
  console.log("the webcam is ready")
}

//functions to take pictures
function addRose() {
  classifier.addImage(video, 'this is a rose', () => {
    console.log("added rose to model!");
  })
}
function addCat() {
  classifier.addImage(video, 'this is a cat', () => {
    console.log("added cat to model!");
  })
}

function addPiano() {
  classifier.addImage(video, 'this is a piano', () => {
    console.log("added piano to model!");
  })
}

//training model
function train() {
  classifier.train((lossValue) => {
    console.log('Loss is', lossValue)

    if (lossValue == null) {
      console.log("Finished training")
      featureExtractor.save(() => console.log('Model saved!'), 'myModel')
      classify();
    }
  })
}

//classifying 
function classify() {
  setInterval(() => {
    classifier.classify(video, (err, result) => {
      if (err) console.log(err)
      console.log(result)
      label.innerHTML = result[0].label
      speak(`${result[0].label}.`);
    })
  }, 3000)
}

let synth = window.speechSynthesis

function speak(text) {
  if (synth.speaking) {
    // console.log('still speaking...')
    return
  }
  if (text !== '') {
    let utterThis = new SpeechSynthesisUtterance(text)
    synth.speak(utterThis)
  }
}

if (navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream
    })
    .catch((err) => {
      console.log("Something went wrong!");
    });
}