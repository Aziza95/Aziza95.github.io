// ***************
//Code based on Tim Holmans work: https://codepen.io/pen?&editable=true&editors=0010
//Edited ;-) by Aziza Bahaviddinova, Sara Hjertonsson Sandén and Therese Casio Persson
// ***************

// get canvas element and context
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

// sets canvas size
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

// create an array of circles, set min & max circle size (Holman)
var circles = [];
var minRadius = 2;
var maxRadius = 100;
var totalCircles = 0;
//We add a variable for maximum total circles to prevent lag. Removed var createCircleAttempts
var maxTotalCircles = 450;

//Function to create, grow, and draw circles (Holman). 
//Builds on Holmans code with some small changes (canvas.width + height instead of size, totalCircles instead of createCircleAttempts)
function createAndDrawCircle() {
  var newCircle;
  var circleSafeToDraw = false;
  // loop through totalCircles trying to create a circle
  for (var tries = 0; tries < totalCircles; tries++) {
    // this is where we create a circle, with x, y & radius
    newCircle = {
      x: Math.floor(Math.random() * canvas.width),
      y: Math.floor(Math.random() * canvas.height),
      radius: minRadius
    }

    // conditional to prevent circles from being drawn inside of another circle
    if (doesCircleHaveACollision(newCircle)) {
      //continue statement jumps over one iteration in the loop
      continue;
    } else {
      circleSafeToDraw = true;
      //break statement jumps out of a loop
      break;
    }
  }
  // if the circle doesn't find a safe place to draw, the attempt is abandoned 
  if (!circleSafeToDraw) {
    return;
  }
  // loop that grows the circles one unit at a time
  // when they collide we'll make the circle one unit smaller(--) and break out of the loop. 
  for (var radiusSize = minRadius; radiusSize < maxRadius; radiusSize++) {
    newCircle.radius = radiusSize;
    if (doesCircleHaveACollision(newCircle)) {
      newCircle.radius--;
      break;
    }
  }
  // circle is added to our list of circles and is being drawn. 
  circles.push(newCircle);
  context.beginPath();
  context.arc(newCircle.x, newCircle.y, newCircle.radius, 0, 2 * Math.PI);
  context.stroke();
  context.fill();
}

//This function builds on Holmans version, only change is the canvas.width/height variable instead of var size.
function doesCircleHaveACollision(circle) {
  // loop through each of the circles that are drawn, compare to the current circle
  // if their radius combined is greater than the distance between each of their
  // centers then we know there's a collision
  for (var i = 0; i < circles.length; i++) {
    var otherCircle = circles[i];
    var a = circle.radius + otherCircle.radius;
    var x = circle.x - otherCircle.x;
    var y = circle.y - otherCircle.y;
    // to get distance between the two center point we use pythagoras theorem
    if (a >= Math.sqrt((x * x) + (y * y))) {
      return true;
    }
  }
  // trigger a collision when they hit the wall, as well as each other
  // one if statement checking the top and bottom
  if (circle.x + circle.radius >= canvas.width ||
    circle.x - circle.radius <= 0) {
    return true;
  }
  // and one if statement checking the left and right
  if (circle.y + circle.radius >= canvas.height ||
    circle.y - circle.radius <= 0) {
    return true;
  }
  return false;
}

// WE MADE THIS!!!:
//function that calls the createAndDrawCircle function same amount of times as the totalCircle variable is currently at.
function drawCircles() {
  for (var i = 0; i < totalCircles; i++) {
    createAndDrawCircle();
    // but if we reached the maxTotalCircles, break out of the loop and draw one circle at a time
    if (totalCircles >= maxTotalCircles) {
      console.log("take it easy")
      break;
    }
  }
}
// mouse-click variable 
let isMouseClick = false;

// handle mouse-click, increases the totalCircles variable and calls the drawCircles function when triggered. 
function handleMouseClick(event) {
  isMouseClick = true;
  totalCircles = totalCircles + 10;
  console.log(totalCircles);
  drawCircles();
}

// add mouse-click listener 
canvas.addEventListener("click", handleMouseClick, false);


// randomize the color of the circles
function handleColorChange(event) {
  context.fillStyle = "#" + ((Math.random() * 0xaaaaaa + 0xaaaaaa) | 0).toString(16);
}

// set a black background
function handleBgChange(event) {
  context.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

// draw white circles 
function handleWhiteCircles(event) {
  context.fillStyle = "white";
}

// get reference to a sliders
let lineSlider = document.getElementById("line-slider");
let radiusSlider = document.getElementById("radius-slider");

// handle change on the sliders
// line slider
function handleLineSlider(event) {
  context.lineWidth = lineSlider.value;
}
// radius slider
function handleRadiusSlider(event) {
  maxRadius = radiusSlider.value;
}

// add slider listeners
lineSlider.addEventListener("change", handleLineSlider, false);
radiusSlider.addEventListener("change", handleRadiusSlider, false);

