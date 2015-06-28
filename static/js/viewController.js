CAND_ID = "";

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

var states = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
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
  CAND_ID=cid;
  // make icon on search bar be "clear"
  $('#search-exit-logo-icon').text('clear');

  // move info panel to first slide.
  $.fn.fullpage.moveTo(1);

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
      var result;
      if (fields.DistIDCurr === 'PRES') {
        result = "President of the Unites States"
      } else if (fields.DistIDCurr.slice(2, 4) == 'S1' || fields.DistIDCurr.slice(2, 4) == 'S2') {
        result = states[fields.DistIDCurr.slice(0, 2)] + " Senator";
      } else {
        result = states[fields.DistIDCurr.slice(0, 2)] + " " + fields.DistIDCurr.slice(2, 4) + "th District";
      }
      $('#current_office_label').text(result);
    } else {
      $('#current_office').hide();
    }

    if (fields.CurrCand == 'Y') {
      $('#running_for').show();
      var result;
      if (fields.DistIDRunFor === 'PRES') {
        result = "President of the Unites States"
      } else if (fields.DistIDRunFor.slice(2, 4) == 'S1' || fields.DistIDRunFor.slice(2, 4) == 'S2') {
        result = states[fields.DistIDRunFor.slice(0, 2)] + " Senator";
      } else {
        result = states[fields.DistIDRunFor.slice(0, 2)] + " " + fields.DistIDRunFor.slice(2, 4) + "th District";
      }
      $('#running_for_label').text(result);
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
  // make icon on search bar be "search"
  $('#search-exit-logo-icon').text('search');

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

function searchCandidateById(cid) {
  // TODO(ever): with data.id, update graph

  removeSearchBarFromFocus();
  // openInfoPanel to this candidate.
  openInfoPanel(cid);
}

function searchCandidateNameOnServer(cname, cb, errcb) {
  db.getCandidateId(cname, cb, errcb);
}

searchInFocus = false;

$(document).ready(function(){
  // needed to set actual height of body
  $('body').css('height', $(document).height() + 'px');


  // initializes scrolling object
  $('#info_inner').fullpage();

  // suggest cadidate names as user types it.
  db.getAllCandidates(function(data) {
    candidateIds = data.records;
    var availableTags = candidateIds.map(function(e) { return e.name });
    $('#search_box').autocomplete({ source: availableTags });
  });

  function getCandidateFromDict(cname) {
    return $.grep(candidateIds, function(e){ return e.name == cname; });
  }

  // handles when user clicks on the search-or-exit button
  // (which could mean starting a search, or exiting info panel)
  function handleSearchExitEvent(event) {
    if (searchInFocus) {
      searchInFocus = true;
      searchEvent(event);
    } else {
      $('#search_box').val('');
      closeInfoPanel();
    }
  }

  // starts a search for a candidate.
  function searchEvent(event) {
    event.preventDefault();
    $('#search_box').blur();
    var query = $('#search_box').val();

    // get candidate id, either from dict or from server.
    candidateRes = getCandidateFromDict(query);
    if (candidateRes.length == 0) {
      // Candidate not in dict. Check server.
      searchCandidateNameOnServer(query, function(data) {
        searchCandidateById(data.id);
      }, function (errordata) {
        // id not on server. notify user.
        $('#search_box').focus();
        $('#search_box').val('Oops! Candidate Not Found.');
      });
    } else {
      // Candidate in dict.
      searchCandidateById(candidateRes[0].id);
    }
  }

  $('#search_form').submit(searchEvent); // on enter
  $('#search-exit-logo').click(handleSearchExitEvent); // on press button

  // brings search bar to focus.
  $('#search_box').focus(function(event) {
    searchInFocus = true;
    bringSearchBarToFocus();
  });

  // remove search bar from focus.
  $('#search_box').blur(function(event) {
    setTimeout(function(event) {
      searchInFocus = false;
      removeSearchBarFromFocus(event);
    }, 400);
  });

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

  // useful string functionality.
  String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
  };

  $('.toContrib').click(function(){
    pacPie.destroy();
    pacPie2.destroy();
    pacPie3.destroy();
    console.log(cname);
    console.log(CAND_ID);
    var PAC_sum = 0;
    var individ_sum = 0;
    var PACs = [];
    var individs = [];
    db.getCandidateContributions(CAND_ID, function(data) {
      var records = data.records;
      if(data.records.length == 0){
        $('#contPie').text("No contributions data available.")
      }else{
        for(var i=0; i<records.length; i++){
          if (records[i].pac_id){ //this is a PAC
            PACs.push({'label':records[i].pac_name, 'value':records[i].amount});
            PAC_sum += records[i].amount;
          }else if(records[i].individual_name){ //this is an individual
            individs.push({'label':records[i].individual_name, 'value':records[i].amount});
            individ_sum += records[i].amount;

          }
        }

        ind_vs_PAC = [{'label':'Individuals', 'value':individ_sum}, {'label':'PACs', 'value':PAC_sum}];
        var pacPie = new d3pie("contPie2", {
          header: {
            title: {
              text: "PAC Contributions",
              fontSize: 10,
            },
            location: "pie-center"
          },
          size: {
            pieInnerRadius: "70%",
            canvasWidth: 270
          },
          data: {
            content: PACs,
            smallSegmentGrouping:{
              enabled:true,
              value:5
            }
          },
          tooltips: {
            enabled:true,
            string:"{label}: ${value}"
          },
          labels:{
            "outer": {
      			"pieDistance": 15
      		  },
      		"inner": {
      			"hideWhenLessThanPercentage": 3
      		  },
      		"percentage": {
      			"color": "#ffffff",
      			"decimalPlaces": 0
      		  },
      		"value": {
      			"color": "#adadad"
          },
          "truncation": {
            "enabled":true,
            "truncateLength":20
          }

          }
        });
        var pacPie2 = new d3pie("contPie3", {
          header: {
            title: {
              text: "Individual Contributions",
              fontSize: 10
            },
            location: "pie-center"
          },
          tooltips: {
            enabled:true,
            string:"{label}: ${value}"
          },
          size: {
            pieInnerRadius: "70%",
            canvasWidth: 270
          },
          data: {
            content: individs,
            smallSegmentGrouping:{
              enabled:true,
              value:5
            }
          },
          tooltips: {
            enabled:true,
            string:"{label}: ${value}"
          },
          labels:{
            "outer": {
      			"pieDistance": 15
      		  },
      		"inner": {
      			"hideWhenLessThanPercentage": 3
      		  },
      		"percentage": {
      			"color": "#ffffff",
      			"decimalPlaces": 0
      		  },
      		"value": {
      			"color": "#adadad"
            }

          }
        });
        var pacPie3 = new d3pie("contPie", {
          header: {
            title: {
              text: "Individual vs PAC Contributions",
              fontSize: 10
            },
            location: "pie-center"
          },
          size: {
            pieInnerRadius: "70%",
            canvasWidth: 270
          },
          data: {
            content: ind_vs_PAC
          },
          tooltips: {
            enabled:true,
            string:"{label}: ${value}"
          },
          labels:{
            "outer": {
      			"pieDistance": 15
      		  },
      		"inner": {
      			"hideWhenLessThanPercentage": 3
      		  },
      		"percentage": {
      			"color": "#ffffff",
      			"decimalPlaces": 0
      		  },
      		"value": {
      			"color": "#adadad"
            }

          }
        });

      };
    });


  })

  $('.toExpend').click(function(){
    expPie.destroy();
    expPie2.destroy();
    expPie3.destroy();
    var PAC_sum = 0;
    var individ_sum = 0;
    var PACs = [];
    var individs = [];
    db.getCandidateExpenditures(CAND_ID, function(data) {
      var records = data.records;
      if(data.records.length == 0){
        $('#expPie').text("No expenditures data available.")
      }else{
        for(var i=0; i<records.length; i++){
          if (records[i].pac_id){ //this is a PAC
            PACs.push({'label':records[i].pac_name, 'value':records[i].amount});
            PAC_sum += records[i].amount;
          }else if(records[i].individual_name){ //this is an individual
            individs.push({'label':records[i].individual_name, 'value':records[i].amount});
            individ_sum += records[i].amount;

          }
        }

      ind_vs_PAC = [{'label':'Individuals', 'value':individ_sum}, {'label':'PACs', 'value':PAC_sum}];
      var pacPie = new d3pie("expPie2", {
        header: {
          title: {
            text: "PAC Expenditures",
            fontSize: 10,
          },
          location: "pie-center"
        },
        size: {
          pieInnerRadius: "70%",
          canvasWidth: 270
        },
        data: {
          content: PACs,
          smallSegmentGrouping:{
            enabled:true,
            value:5
          }
        },
        tooltips: {
          enabled:true,
          string:"{label}: ${value}"
        },
        labels:{
          "outer": {
          "pieDistance": 15
          },
        "inner": {
          "hideWhenLessThanPercentage": 3
          },
        "percentage": {
          "color": "#ffffff",
          "decimalPlaces": 0
          },
        "value": {
          "color": "#adadad"
        },
        "truncation": {
          "enabled":true,
          "truncateLength":20
        }

        }
      });
      var expPie2 = new d3pie("expPie3", {
        header: {
          title: {
            text: "Individual Expenditures",
            fontSize: 10
          },
          location: "pie-center"
        },
        tooltips: {
          enabled:true,
          string:"{label}: ${value}"
        },
        size: {
          pieInnerRadius: "70%",
          canvasWidth: 270
        },
        data: {
          content: individs,
          smallSegmentGrouping:{
            enabled:true,
            value:5
          }
        },
        tooltips: {
          enabled:true,
          string:"{label}: ${value}"
        },
        labels:{
          "outer": {
          "pieDistance": 15
          },
        "inner": {
          "hideWhenLessThanPercentage": 3
          },
        "percentage": {
          "color": "#ffffff",
          "decimalPlaces": 0
          },
        "value": {
          "color": "#adadad"
          }

        }
      });
      var expPie3 = new d3pie("expPie", {
        header: {
          title: {
            text: "Individual vs PAC Expenditures",
            fontSize: 10
          },
          location: "pie-center"
        },
        size: {
          pieInnerRadius: "70%",
          canvasWidth: 270
        },
        data: {
          content: ind_vs_PAC
        },
        tooltips: {
          enabled:true,
          string:"{label}: ${value}"
        },
        labels:{
          "outer": {
          "pieDistance": 15
          },
        "inner": {
          "hideWhenLessThanPercentage": 3
          },
        "percentage": {
          "color": "#ffffff",
          "decimalPlaces": 0
          },
        "value": {
          "color": "#adadad"
          }

        }
      });

    }
  });

});

  //dummy initialization
  var pacPie = new d3pie("contPie", {
    header: {
      title: {
        text: "",
        fontSize: 10
      },
      location: "pie-center"
    },
    size: {
      pieInnerRadius: "70%",
      canvasWidth: 300
    },
    data: {
      content: [{'label':'hi','value':40}]
    }
  });
  var pacPie2 = new d3pie("contPie2", {
    header: {
      title: {
        text: "",
        fontSize: 10
      },
      location: "pie-center"
    },
    size: {
      pieInnerRadius: "70%",
      canvasWidth: 300
    },
    data: {
      content: [{'label':'hi','value':40}]
    }
  });
  var pacPie3 = new d3pie("contPie3", {
    header: {
      title: {
        text: "",
        fontSize: 10
      },
      location: "pie-center"
    },
    size: {
      pieInnerRadius: "70%",
      canvasWidth: 300
    },
    data: {
      content: [{'label':'hi','value':40}]
    }
  });
  var expPie = new d3pie("expPie", {
    header: {
      title: {
        text: "",
        fontSize: 10
      },
      location: "pie-center"
    },
    size: {
      pieInnerRadius: "70%",
      canvasWidth: 300
    },
    data: {
      content: [{'label':'hi','value':40}]
    }
  });
  var expPie2 = new d3pie("expPie2", {
    header: {
      title: {
        text: "",
        fontSize: 10
      },
      location: "pie-center"
    },
    size: {
      pieInnerRadius: "70%",
      canvasWidth: 300
    },
    data: {
      content: [{'label':'hi','value':40}]
    }
  });
  var expPie3 = new d3pie("expPie3", {
    header: {
      title: {
        text: "",
        fontSize: 10
      },
      location: "pie-center"
    },
    size: {
      pieInnerRadius: "70%",
      canvasWidth: 300
    },
    data: {
      content: [{'label':'hi','value':40}]
    }
  });



});
