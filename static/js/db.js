var SERVER = "http://politistats.herokuapp.com";

//DEBUG USE ONLY
var cid = "N00009960";

var db = {
  function getCandidateInfo(cid) {
    $.ajax(SERVER + '/data/candidate/info/' + cid)
      .done(function(data) {
        return data;
      });
  }

  function getCandidateContributions(cid) {
    $.ajax(SERVER + '/data/candidate/contributions/' + cid)
      .done(function(data) {
        return data;
      });
  }

  function getCandidateExpenditures(cid) {
    $.ajax(SERVER + '/data/candidate/expenditures/' + cid)
      .done(function(data) {
        return data;
      });
  }
}
