const bodyparser = require('body-parser');
var urlencodedParser = bodyparser.urlencoded({
  extended: false
}, function(err, client) {
  if (err) {
    console.log("err");
  }
  console.log('client!');
});

module.exports =urlencodedParser;
