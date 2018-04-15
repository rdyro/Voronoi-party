var express = require("express");
var app = express();
app.use(express.static(process.cwd()));

/*
app.get(/^(.+)$/, function(req, res){ 
  console.log('static file request : ' + req.params);
  res.sendfile( __dirname + req.params[0]); 
});
*/
app.listen(8888, function() {});
