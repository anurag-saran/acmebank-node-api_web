var express = require('express');


var app = express();
var PORT = process.env.PORT || 8080;


//app.all("/api/*", function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
//  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
//  return next();
//});


app.get('/', function(req, res) {
	res.send('Webpage API Root');
});

app.get('/test', function(req, res) {
	res.send('Webpage API Root test');
});

app.use(express.static(__dirname + '/public'));

app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});

