const fileInput = document.getElementById("mobileFile");
const outputImage = document.getElementById("output");
const resultDiv = document.getElementById("result");
const checkBtn = document.getElementById("classifyBtn")

let classifier;

ml5.featureExtractor("MobileNet", { model: "myModel.json" }, function() {
    console.log("Model Loaded!");
    // create a new classifier from the loaded model
    classifier = ml5.imageClassifier("myModel.json", function() {
        console.log("Classifier Ready!");
      });
  });
  
  // display the uploaded image
  fileInput.addEventListener("change", event => {
    console.log("uploading")
    outputImage.src = URL.createObjectURL(event.target.files[0]);
  });
  
  // classify the uploaded image when the user clicks the button
  checkBtn.addEventListener("click", () => {
    classifier.classify(outputImage, function(err, results) {
      if (err) {
        console.error(err);
        console.log("checking!")
        return;
      }
      console.log(results);
      const result = results[0];
      resultDiv.textContent = `The uploaded image is a ${result.label} with a confidence score of ${result.confidence.toFixed(2)}.`;
    });
  });

  
  
  
  