var express = require('express');
var infinispan = require('infinispan');

var app = express();
var PORT = process.env.PORT || 8080;

var infinispan = require('infinispan');
var util = require('util');
var bodyParser = require('body-parser');
var jdgHost = process.env.DATAGRID_HOTROD_SERVICE_HOST || "127.0.0.1";
var jdgPort = process.env.DATAGRID_HOTROD_SERVICE_PORT || 11222;

app.use(bodyParser.json);

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




// GET /customer/:id
app.get('/customer/:id', function(req, res) {
    console.log("*****// GET /customer/:id.");
    var custID = req.params.id;
    console.log("*****// GET /customer/:id.custID:"+custID);
   // var connected = infinispan.client({port: jdgPort, host: jdgHost}, {version: '2.2'});
    
//	connected.then(function (client) {
//        client.get(custID).then(
//            function(value) {
//                if(value == undefined)  {
//                    console.log("*****Record Not Found.");
//                    client.put(custID, "abc");
//                    //res.json(util.format('Customer Not Found %s!', custID));
//                    res.status(404).send();
//                } else {
//                    console.log("*****Record Found.");
//                    res.json(value);
//                    
//                }
//            });
//        });
});

app.use(express.static(__dirname + '/public'));

app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});

