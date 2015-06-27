$(document).ready(function(){
  $("#title").hover(function(){
    $("#info").css('right', '600');
    $("#info_inner").css('right', '0');
  }, function(){
    $("#info").css('right', '-35');
    $("#info_inner").css('right', '-600');
  })
})
