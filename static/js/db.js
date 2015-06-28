var SERVER = "http://politistats.herokuapp.com";

var db = {
  getCandidateInfo: function(cid, cb) {
      $.ajax(SERVER + '/data/candidate/info/' + cid).done(cb);
    },

  getCandidateContributions: function(cid, cb) {
      $.ajax(SERVER + '/data/candidate/contributions/' + cid).done(cb);
    },

  getCandidateExpenditures: function(cid, cb) {
      $.ajax(SERVER + '/data/candidate/expenditures/' + cid).done(cb);
    },

  getCandidateId: function(cname, cb) {
      $.ajax(SERVER + '/data/candidate/getid/' + cname).done(cb);
    }
}
