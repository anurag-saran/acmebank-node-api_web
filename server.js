var express = require('express');


var app = express();
var PORT = process.env.PORT || 3000;




app.get('/', function(req, res) {
	res.send('Webpage API Root');
});


app.use(express.static(__dirname + '/public'));

app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});

