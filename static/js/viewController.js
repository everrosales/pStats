function openInfoPanel() {
  $('#info').css('right', '454');
  $('#info_inner').css('right', '0');
}

function closeInfoPanel() {
  $('#info').css('right', '-35');
  $('#info_inner').css('right', '-600');
}

$(document).ready(function(){
  openInfoPanel();
})
