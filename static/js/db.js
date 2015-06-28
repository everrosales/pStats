var SERVER = "http://politistats.herokuapp.com";

//DEBUG USE ONLY
var cid = "N00009960";
//var SERVER = "127.0.0.1:800";

$.ajax(SERVER + '/data/detail/', { data: cid })
  .done(function(data) {
    console.log(data);
  });
