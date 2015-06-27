var controllerOptions = { enableGestures: true };

Leap.loop(controllerOptions, function(frame) {
  var frameString = "frame:" + frame.id + 
                    "gestures: " + frame.gestures.lenght +
                    "\n" + frame.gestures;
  $("body").text = frameString;
});
