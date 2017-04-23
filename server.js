var express = require('express');
var infinispan = require('infinispan');

var app = express();
var PORT = process.env.PORT || 8080;

var infinispan = require('infinispan');
var util = require('util');
var bodyParser = require('body-parser');
var jdgHost = process.env.DATAGRID_HOTROD_SERVICE_HOST || "127.0.0.1";
var jdgPort = process.env.DATAGRID_HOTROD_SERVICE_PORT || 11222;

//app.use(bodyParser.json);

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
    var connected = infinispan.client({port: jdgPort, host: jdgHost}, {version: '2.2'});
    //connected.log("connected:"+connected);
    //connected.log("connected:"+JSON.stringify(connected));
    var resFlag=0;
    var cust = {
        
	"firstName": "Anurag",
	"lastName": "Saran",
	"faceBookId": "anurag.saran",
	"cellPhone": "+17326628053",
	"email": "anurag.saran@gmail.com",
	"password": "pass@123"
        };
    
    //requestDataUpdated["commands"][1]["insert"]["object"]["com.redhat.gpte.policyquote.model.Policy"]["vehicleYear"] = vehicleYear;
    
	connected.then(function (client) {
        connected.log("*** Connected:");
        client.put(custID, cust);
        client.get(custID).then(
            function(value) {
                if(value == undefined)  {
                    console.log("*****Record Not Found.");
                    client.put(custID, "abc");
                    //res.json(util.format('Customer Not Found %s!', custID));
                    resFlag=1;
                    res.status(404).send();
                } else {
                    console.log("*****Record Found.");
                    resFlag=1;
                    res.json(value);
                    
                }
            });
        });
    if(resFlag===0) {
    res.send('Webpage API Root test');}
});


 // POST /customer
//app.post('/customer', function(req, res) {
//    var body = reg.body;
//    var custID = body.custID;
//    console.log("****body:"+body);
//    var connected = infinispan.client({port: jdgPort, host: jdgHost}, {version: '2.2'});
//	connected.then(function (client) {
//        client.get(custID).then(
//            function(value) {
//                if(value == undefined)  {
//                    client.put(custID, body)
//                    res.json(util.format('Customer Not Found %s! but inserted into cache now', custID));
//                }
//            })
//        })
//})


app.use(express.static(__dirname + '/public'));

app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});

