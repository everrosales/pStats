function openInfoPanel() {
  $('#info').css('right', '454');
  $('#info_inner').css('right', '0');

  // remove shadow from search bar.
  $('#search').css('box-shadow', 'none');
}

function closeInfoPanel() {
  // slide info panel out.
  $('#info').css('right', '-35');
  $('#info_inner').css('right', '-600');

  // add shadow to search bar.
  $('#search').css('box-shadow', '0px 2px 5px 0px rgba(0,0,0,0.75)');
}

$(document).ready(function(){
  openInfoPanel();
})
