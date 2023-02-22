const video = document.getElementById("webcam");
const label = document.getElementById("label");

const waterBtl = document.querySelector("#waterBtl");
// const phone = document.querySelector("#phone");
// const sharpie = document.querySelector("#sharpie");
const trainbtn = document.querySelector("#train");
// const speakBtn = document.getElementById('speak');

const image = document.getElementById('output')
const fileButton = document.querySelector("#file")

const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded)


fileButton.addEventListener("change", (event) => {
  image.src = URL.createObjectURL(event.target.files[0])
})

waterBtl.addEventListener("click", () => addWaterBtl());
// phone.addEventListener("click", () => addPhone());
// sharpie.addEventListener("click", () => addSharpie());
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
function addWaterBtl() {
  classifier.addImage(video, 'this is a water bottle', () => {
    console.log("added waterbottle to model!");
  })
}
function addPhone() {
  classifier.addImage(video, 'this is a phone', () => {
    console.log("added phone to model!");
  })
}

function addSharpie() {
  classifier.addImage(video, 'this is a sharpie', () => {
    console.log("added sharpie to model!");
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