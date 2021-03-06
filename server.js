var express = require('express');
var infinispan = require('infinispan');
var _ = require('underscore');
var bodyParser = require('body-parser');
var cors = require('cors')

var app = express();
var PORT = process.env.PORT || 8080;

var infinispan = require('infinispan');
var util = require('util');

var jdgHost = process.env.DATAGRID_HOTROD_SERVICE_HOST || "127.0.0.1";
var jdgPort = process.env.DATAGRID_HOTROD_SERVICE_PORT || 11222;

//app.use(bodyParser.json);
//app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors());

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
    var custID = req.params.id;
    var connected = infinispan.client({port: jdgPort, host: jdgHost}, {version: '2.2'});
    custID = custID.toLowerCase();
    var resFlag=0;
    connected.then(function (client) {
        client.get(custID).then(
            function(value) {
                if(value == undefined)  {
                    res.status(404).send();
                } else {
                    res.json(value);
                }
            });
        });
     
});


app.post('/customer', function (req, res) {
	var body = _.pick(req.body, 'firstName', 'lastName', 'faceBookId', 'cellPhone', 'email','age','faceBookIdInternal','facebookSenderID');
    //console.log("req:"+JSON.stringify(req));
    console.log("body:"+JSON.stringify(body));
    
    var cellPhone = body.cellPhone;
    var firstandlastName = body.firstName + body.lastName;
    var faceBookIdInternal =   body.faceBookIdInternal;
    var facebookSenderID = body.facebookSenderID;
    console.log("facebookSenderID:"+facebookSenderID);
    body.ssn = Math.floor(100000000 + Math.random() * 900000000);
    body.tickets = Math.floor(1 + Math.random() * 9);
    body.accidents = Math.floor(1 + Math.random() * 9);
    body.timeReport = Math.floor(Math.random() * 2);
    body.salaryCredited = Math.floor(Math.random() * 2);
    body.employeeNo = Math.floor(1000 + Math.random() * 9000);
    
    console.log("cellPhone:"+cellPhone);
    console.log("firstandlastName:"+firstandlastName);
    
    var connected = infinispan.client({port: jdgPort, host: jdgHost}, {version: '2.2'});
    console.log("connected:");
	connected.then(function (client) {
        client.get(cellPhone).then(
            function(value) {
                if(value == undefined)  {
                    console.log("Not Found:");
                    client.put(cellPhone, JSON.stringify(body));
                    client.put(firstandlastName.toLowerCase(), JSON.stringify(body));
                    console.log("Inserted:"+cellPhone);
                    //client.put(faceBookIdInternal.toLowerCase(), JSON.stringify(body));
                    //client.put(facebookSenderID.toLowerCase(), JSON.stringify(body));
                    res.json(util.format('Customer Not Found %s! but inserted into cache now with keys:cellPhone', cellPhone+faceBookIdInternal+facebookSenderID));
                    
                } else {
                    console.log("Exists:"+cellPhone);
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

