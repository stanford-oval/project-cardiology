const port = process.env.PORT || 3000;

var express = require('express');
var app = express();
var router = express.Router();

// Lets us easily parse POST requests
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Sets up CORS support
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/', require('./routes'));

app.listen(port, function () {
  console.log("Server is running on port " + port);
});
