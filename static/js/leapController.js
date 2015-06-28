var controllerOptions = { enableGestures: true };

var isPinned = false;

var controller = Leap.loop(controllerOptions, function(frame) {
  //handle data. maybe define new gestures.

  console.log(frame);
  for (var i = 0; i < frame.hands.length; i++) {

  }
});

function handleSwipe(gesture) {
  console.log(gesture);
}

controller.on("gesture", function(gesture) {
  if (gesture.type == 'circle') {
      console.log("Circle Gesture");
  }
  if (gesture.type == 'keyTap') {
      console.log("Key Tap Gesture");
  }
  if (gesture.type == 'screenTap') {
      console.log("Screen Tap Gesture");
  }
  if (gesture.type == 'swipe') {
    handleSwipe(gesture);
  }
});
