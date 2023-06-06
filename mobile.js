const video = document.getElementById("webcam");
const resultDiv = document.getElementById("result");
const takePicBtn = document.getElementById('takePicBtn');
const checkBtn = document.getElementById("classifyBtn");
const imageContainer = document.getElementById("imageContainer");

let classifier;

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

ml5.featureExtractor("MobileNet", { model: "myModel.json" }, function() {
    console.log("Model Loaded!");
    // create a new classifier from the loaded model
    classifier = ml5.imageClassifier("myModel.json", video, videoReady)
});

function videoReady() {
    console.log("the webcam is ready");
}

takePicBtn.addEventListener('click', () => takePic()); 

function takePic() {
    console.log('Taking a picture!');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');
    console.log('Captured image data:', imageData);
    displayImage(imageData);
    checkIfRose(imageData);
}

function displayImage(imageData) {
    const imageElement = document.createElement('img');
    imageElement.src = imageData;
    imageContainer.innerHTML = ''; // Clear previous images
    imageContainer.appendChild(imageElement);
}

function checkIfRose(imageData) {
    classifier.classify(imageData, function(err, results) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(results);
        const result = results[0];
        const predictedLabel = result.label;
        const confidence = result.confidence;
        
        if (predictedLabel === 'rose' && confidence <= 9) {
            resultDiv.textContent = 'It is a rose!';
        } else {
            resultDiv.textContent = 'It is not a rose.';
        }
    });
}

checkBtn.addEventListener("click", () => {
    console.log('Checking!');
    const imageData = imageContainer.firstChild.src;
    checkIfRose(imageData);
});
