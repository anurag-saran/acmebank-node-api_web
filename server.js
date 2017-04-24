var express = require('express');
var infinispan = require('infinispan');
var _ = require('underscore');
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 8080;

var infinispan = require('infinispan');
var util = require('util');

var jdgHost = process.env.DATAGRID_HOTROD_SERVICE_HOST || "127.0.0.1";
var jdgPort = process.env.DATAGRID_HOTROD_SERVICE_PORT || 11222;

//app.use(bodyParser.json);
//app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

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
    console.log("*** About To Connected:");
    var connected = infinispan.client({port: jdgPort, host: jdgHost}, {version: '2.2'});
    console.log("***  Connected:");

    var resFlag=0;
//    var cust = {
//        
//	"firstName": "Anurag",
//	"lastName": "Saran",
//	"faceBookId": "anurag.saran",
//	"cellPhone": "+17326628053",
//	"email": "anurag.saran@gmail.com",
//	"password": "pass@123"
//        };
    //var cust = "abc";
    //requestDataUpdated["commands"][1]["insert"]["object"]["com.redhat.gpte.policyquote.model.Policy"]["vehicleYear"] = vehicleYear;
     console.log("***  Object Set:");
	connected.then(function (client) {
        console.log("*** after connect:");
        
        client.get(custID).then(
            function(value) {
                console.log("*****Record IF.value:"+JSON.stringify(value));
                if(value == undefined)  {
                    console.log("*****Record Not Found.");
                    //client.put(custID, JSON.stringify(cust));
                     console.log("*****Record Not Found After PUT.");
                    //client.put(custID, "abc");
                    //res.json(util.format('Customer Not Found %s!', custID));
                    resFlag=1;
                    res.status(404).send();
                } else {
                    console.log("*****Record Found.");
                    console.log("***** value:"+value);
                    resFlag=1;
                    //res.json(util.format('Welcome back %s! Your first visit here was on %s', name, value))
                    res.json(value);
                    
                }
                console.log("*****Record out of if else");
            });
        });
     console.log("*** Before Flag Last:");
//    if(resFlag===0) {
//    res.send('Webpage API Root test');}
});


app.post('/customer', function (req, res) {
    console.log("*** Request:"+req.body);
    console.log("*** Request:"+req);
    console.log(JSON.stringify(req.body));
	console.log(JSON.stringify(req.body, null, 5));
	var body = _.pick(req.body, 'firstName', 'lastName', 'faceBookId', 'cellPhone', 'email','age','faceBookIdInternal');
    var cellPhone = body.cellPhone;
    var firstandlastName = body.firstName + body.lastName;
    randomcode = 
    console.log("*** ssn:"+ Math.floor(100000000 + Math.random() * 900000000));
    console.log("*** tickets:"+  Math.floor(1 + Math.random() * 9));
    console.log("*** accidents:"+  Math.floor(1 + Math.random() * 9));
    
    body.ssn = Math.floor(100000000 + Math.random() * 900000000);
    body.tickets = Math.floor(1 + Math.random() * 9);
    body.accidents = Math.floor(1 + Math.random() * 9);
    
	console.log(JSON.stringify(body, null, 4));
    
    console.log("*****Record before connected");
    var connected = infinispan.client({port: jdgPort, host: jdgHost}, {version: '2.2'});
    console.log("*****Record connected");
    console.log("*****Record connected cellPhone:"+cellPhone);
	connected.then(function (client) {
        console.log("*****Record then");
        client.get(cellPhone).then(
            function(value) {
                console.log("*****Record get");
                if(value == undefined)  {
                    console.log("*****Record undefined");
                    client.put(cellPhone, JSON.stringify(body));
                    console.log("*****Record second insert");
                    client.put(firstandlastName, JSON.stringify(body));
                    res.json(util.format('Customer Not Found %s! but inserted into cache now', custID));
                    
                } else {
                     console.log("*****Record exists");
                    res.json(util.format('Customer Exists', cellPhone));
                }
            })
        })

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

