var controllerOptions = { enableGestures: true };

Leap.loop(controllerOptions, function(frame) {
  var frameString = "frame:" + frame.id +
                    "\ngestures: " + frame.gestures.length +
                    "\n" + frame.gestures;
  $("body").text(frameString);
});
