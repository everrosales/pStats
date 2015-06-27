var controllerOptions = { enableGestures: true };

var controller = Leap.loop(controllerOptions, function(frame) {
  //handle data. maybe define new gestures.
});

controller.on("gesture", function(gesture) {
  switch (gesture.type){
    case "circle":
      console.log("Circle Gesture");
      break;
    case "keyTap":
      console.log("Key Tap Gesture");
      break;
    case "screenTap":
      console.log("Screen Tap Gesture");
      break;
    case "swipe":
      console.log("Swipe Gesture");
      break;
  }
});
