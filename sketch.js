const cam_w = 1280;
const cam_h = 720;


let handpose;
let video;
let predictions = [];
let images = [];
let imageTitles = [
  "exercise_1.jpeg",
  "exercise_2.jpeg",
  "exercise_3.jpeg",
  "exercise_4.jpeg",
];



// let song;


// let mySound;
// function preload() {
//   soundFormats('mp3', 'ogg');
//   mySound = loadSound('assets/Mario.mp3');
// }

let exerciseNames = ["Open Hand", "Fist", "Peace Sign", "Thumbs Up"]; // Add more exercises as needed

function preload() {
  for (let i = 0; i < imageTitles.length; i++) {
    images.push(loadImage(imageTitles[i]));
  
  }
  
  

}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  const options = {
    flipHorizontal: true, // boolean value for if the video should be flipped, defaults to false
    maxContinuousChecks: Infinity, // How many frames to go without running the bounding box detector. Defaults to infinity, but try a lower value if the detector is consistently producing bad predictions.
    detectionConfidence: 0.8, // Threshold for discarding a prediction. Defaults to 0.8.
    scoreThreshold: 0.75, // A threshold for removing multiple (likely duplicate) detections based on a "non-maximum suppression" algorithm. Defaults to 0.75
    iouThreshold: 0.3, // A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3.
  };

  handpose = ml5.handpose(video, options, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected

  handpose.on("predict", (results) => {
    predictions = results;
  });

  // Hide the video element, and just show the canvas
  // video.hide();

  
}

function modelReady() {
  console.log("Model ready!");
}

// adding the detection part

function gotPredictions(results) {
  predictions = results;
}

function draw() {
  clear();
  //image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons

  if (predictions.length > 0) {
    displayReward();
    //detectExercise2();
    drawKeypoints();
    //console.log(predictions);
  }
}

function displayReward() {
  let rewardNum = detectExercise();

  // if(rewardNum == 0) {
  //   // fill(255, 0, 0);
  //   image(images[0], width/2, height/2);
  // }

  let rewardImage;
  // console.log(rewardNum);

  switch (rewardNum) {
    case 0:
      // image(images[0], width/2, height/2);
      rewardImage = images[0];
      // mySound.play();
      break;
    case 1:
      //image(images[1], width/2, height/2);
      rewardImage = images[1];
      // mySound.play();
      break;
    case 2:
      //image(images[2], width/2, height/2);
      rewardImage = images[2];
      // mySound.play();
      break;
    case 3:
      //image(images[3], width/2, height/2);
      rewardImage = images[3];
      // mySound.play();
      break;
    case -1:
      //ellipse(width/2, height/2, 10, 10);
      rewardImage = images[0];
      // mySound.play();
      break;
  }

  imageMode(CENTER)
  image(rewardImage, width / 2, height / 2);

  //ellipse(width / 2, height / 2, 20, 20);
}

function detectExercise2() {
  if (predictions.length > 0) {
    let keypoints = predictions[0].landmarks;
    console.log(keypoints);
  }
}

function detectExercise() {
  if (predictions.length > 0) {
    let keypoints = predictions[0].landmarks;
    //console.log(keypoints);

    // Define finger points
    let thumbTip = keypoints[4];
    let indexTip = keypoints[8];
    let middleTip = keypoints[12];
    let ringTip = keypoints[16];
    let pinkyTip = keypoints[20];

    // Check for hand gestures based on finger positions
    if (
      thumbTip[1] < indexTip[1] &&
      middleTip[1] < indexTip[1] &&
      ringTip[1] < indexTip[1] &&
      pinkyTip[1] < indexTip[1]
    ) {
      // Open hand gesture
      return 0;
    } else if (
      thumbTip[1] > indexTip[1] &&
      middleTip[1] > indexTip[1] &&
      ringTip[1] > indexTip[1] &&
      pinkyTip[1] > indexTip[1]
    ) {
      // Fist gesture
      return 1;
    } else if (
      thumbTip[0] < indexTip[0] &&
      middleTip[0] > indexTip[0] &&
      ringTip[0] > middleTip[0] &&
      pinkyTip[0] > ringTip[0]
    ) {
      // Peace sign gesture
      return 2;
    } else if (
      thumbTip[0] > indexTip[0] &&
      middleTip[0] > indexTip[0] &&
      ringTip[0] < middleTip[0] &&
      pinkyTip[0] < middleTip[0]
    ) {
      // Thumbs up gesture
      return 3;
    }
  }
  return -1; // No gesture detected
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
  }
}
