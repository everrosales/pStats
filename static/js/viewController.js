function _getParty(party_identifier) {
  switch(party_identifier) {
    case 'L':
      return 'Libertarian'
    case 'D':
      return 'Democrat';
    case '3':
      return 'Third-Party';
    case 'R':
      return 'Republican';
    case 'I':
      return 'Independent'
    default:
      return 'Unknown';
  }
}

function getWikipediaIntro(cname, cb) {
  $.getJSON("http://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exchars=500&exintro=&explaintext=&callback=?",
    { titles: cname }, cb);
}

function getWikipediaImages(cname, cb) {
  $.getJSON("http://en.wikipedia.org/w/api.php?action=query&format=json&pithumbsize=300&callback=?",
    { titles: cname, prop: "pageimages"}, cb);
}

function openInfoPanel(cid) {
  // TODO(amanda): move info panel to first slide.

  // TODO(rapha): display a loading gif on the whole panel.

  // get candidate data.
  db.getCandidateInfo(cid, function(data) {
    fields = JSON.parse(data)[0].fields;

    cname = fields.FirstLastP.substring(0, fields.FirstLastP.length - 4);

    // populate panel data.
    $('#search_box').val(cname);
    $('#party_label').text(_getParty(fields.Party));

    if (fields.DistIDCurr && fields.DistIDCurr.trim() != "") {
      $('#current_office').show();
      $('#current_office_label').text(fields.DistIDCurr);
    } else {
      $('#current_office').hide();
    }

    if (fields.CurrCand == 'Y') {
      $('#running_for').show();
      $('#running_for_label').text(fields.DistIDRunFor);
    } else {
      $('#running_for').hide();
    }

    // get wiki intro info for this candidate.
    getWikipediaIntro(cname, function(data) {
      var pageid = Object.keys(data.query.pages)[0];
      var intro = data.query.pages[pageid].extract;
      $('#wiki_info_label').text(intro)
      $('#wiki_info_link_href').attr('href', "http://wikipedia.org/wiki/" + cname);
    });

    getWikipediaImages(cname, function(data) {
      var pageid = Object.keys(data.query.pages)[0];
      var page = data.query.pages[pageid]
      if (page.thumbnail != undefined) {
        $('#headshot').show();
        $('#headshot_img').attr('src', page.thumbnail.source);
      } else {
        $('#headshot').hide();
      }
    });

    // TODO(rapha): remove loading gif.
  });

  // slide info panel in.
  $('#info').css('right', '454px');
  $('#info_inner').css('right', '0px');

  // remove shadow from search bar.
  $('#search').css('box-shadow', 'none');
}

function closeInfoPanel() {
  // slide info panel out.
  $('#info').css('right', '-35px');
  $('#info_inner').css('right', '-600px');

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

function searchCanditateExactName(cname) {
  db.getCandidateId(cname, function(data) {
    // TODO(ever): with data.id, update graph

    // TODO(rapha): if ID not found, notify user.

    removeSearchBarFromFocus();
    // openInfoPanel to this candidate.
    openInfoPanel(data.id);
  })
}

$(document).ready(function(){
  // needed to set actual height of body
  $('body').css('height', $(document).height() + 'px');

  // TODO(rapha): suggest cadidate names as user types it.

  // make search bar work.
  function searchEvent(event) {
    event.preventDefault();
    removeSearchBarFromFocus();
    var query = $('#search_box').val();
    searchCanditateExactName(query);
  }
  $('#search_form').submit(searchEvent);
  $('#search-exit-logo').on('click', searchEvent);

  // brings search bar to focus.
  $('#search_box').focus(bringSearchBarToFocus);
  $('#search_box').blur(removeSearchBarFromFocus);

  // initializes scrolling object
  $('#info_inner').fullpage();

  // add arrow hover event listeners
  $('.arrow').hover(function(){
    $(this).css('color', '#00BCD4'); //feel free to change this color
    $(this).siblings('.arrowLabel').css('color', '#00BCD4');
  }, function(){
    $(this).css('color', 'rgb(130, 130, 130)');
    $(this).siblings('.arrowLabel').css('color', 'rgb(130, 130, 130)');
  });

  // add arrow click event listeners
  $('.scrollDownArrow').click(function(){
    $.fn.fullpage.moveSectionDown();
  })
  $('.scrollUpArrow').click(function(){
    $.fn.fullpage.moveSectionUp();
  })

  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };
});
