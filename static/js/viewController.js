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

function getWikipediaInformation(cname, cb) {
  $.getJSON("http://en.wikipedia.org/w/api.php?action=parse&format=json&callback=?",
    { page: cname, prop: "text" }, cb);
}

function getWikipediaImages(cname, cb) {
  $.getJSON("http://en.wikipedia.org/w/api.php?action=query&format=json&callback=?",
    { titles: cname, prop: "images"}, cb);
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

    // get wiki info for this candidate.
    getWikipediaInformation(cname, function(data) {
      console.log("hey");
      console.log(data);
    });

    getWikipediaImages(cname, function(data) {
      console.log("hey2");
      console.log(data);
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
  $('#search_form').submit(function (event) {
    event.preventDefault();
    var query = $('#search_box').val();
    searchCanditateExactName(query);
  });
})
