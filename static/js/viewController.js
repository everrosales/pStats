function openInfoPanel() {
  // slide info panel in.
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

function bringSearchBarToFocus() {
  closeInfoPanel();
  // blur everything else.
  $('#searchBlur').css('filter', 'blur(7px)');
  $('#searchBlur').css('-webkit-filter', 'blur(7px)');

  // move search bar to center
  var halfWindow = $(window).width()/2 - $('#search').width()/2;
  var topThird = $(window).height()/3;
  $('#search').css('right', halfWindow);
  $('#search').css('top', topThird);
}

function removeSearchBarFromFocus() {
  // unblur everything else.
  $('#searchBlur').css('filter', '');
  $('#searchBlur').css('-webkit-filter', '');

  // move search bar to its place.
  $('#search').css('right', '20px');
  $('#search').css('top', '20px');
}

$(document).ready(function(){
  $('body').css('height', $(document).height() + 'px');
  openInfoPanel();
  $('#info_inner').fullpage();

  $('.arrow').hover(function(){
    $(this).css('color', '#00BCD4'); //feel free to change this color
    $(this).siblings('.arrowLabel').css('color', '#00BCD4');
  }, function(){
    $(this).css('color', 'rgb(130, 130, 130)');
    $(this).siblings('.arrowLabel').css('color', 'rgb(130, 130, 130)');
  });

  $('.scrollDownArrow').click(function(){
    $.fn.fullpage.moveSectionDown();
  })
  $('.scrollUpArrow').click(function(){
    $.fn.fullpage.moveSectionUp();
  })

})
