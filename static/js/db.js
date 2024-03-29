var SERVER = "http://politistats.herokuapp.com";

var db = {
  getCandidateInfo: function(cid, cb) {
      $.ajax(SERVER + '/data/candidate/info/' + cid).done(cb);
    },

  getCommitteeInfo: function(cid, cb) {
      $.ajax(SERVER + '/data/committee/info/' + cid).done(cb);
    },

  getCandidateContributions: function(cid, cb) {
      $.ajax(SERVER + '/data/candidate/contributions/' + cid).done(cb);
    },

  getCandidateExpenditures: function(cid, cb) {
      $.ajax(SERVER + '/data/candidate/expenditures/' + cid).done(cb);
    },

  getCandidateId: function(cname, cb, errcb) {
      $.ajax(SERVER + '/data/candidate/getid/' + cname, { "error": errcb }).done(cb);
    },

  getAllCandidates: function(cb) {
    $.ajax(SERVER + '/data/all').done(cb);
    },

  getCommitteeContributions: function(cid, cb) {
    $.ajax(SERVER + '/data/committee/contributions/' + cid).done(cb);
    }
}
