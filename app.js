var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// MongoDB setup
var mongoose = require('mongoose'),
	Admin = mongoose.mongo.Admin;
var connection = mongoose.createConnection('mongodb://localhost:27017/lightMongo');


app.set('views', __dirname + '/app/views');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.render('angular-layout', {});
});

app.get('/api/get-databases', function(req, res) {
	new Admin(connection.db).listDatabases(function(err, result) {
		if(err)  {
			res.status(500);
			res.json({
				status: false,
				error: err
			});
		} else {
			res.json({
				status: true,
				data: result.databases
			});
		}		
	});
});


app.post('/api/get-collection', function(req, res) {


	if(!req.body.dbName) {
		res.json({
			status: false,
			error: 'database name is not founded'
		});
	}


	// --

	var mongoose = require('mongoose'), 
	MONGO_DB = 'mongodb://localhost:27017/pingtree';

	mongoose.connect(MONGO_DB);

	mongoose.connection.on('open', function(){

		console.log(" opened > ");
		mongoose.connection.db.listCollections(function(error, collections) {
		if (error) {
			console.log('error> ',error);
		} else {
			console.log(' > ', collections);
		}
		});
	});

	mongoose.connection.on('error', function(error){
	  throw new Error(error);
	});
	// new Admin(connection.db).listDatabases(function(err, result) {
	// 	if(err)  {	
	// 		res.status(500);
	// 		res.json({
	// 			status: false,
	// 			error: err
	// 		});
	// 	} else {
	// 		res.json({
	// 			status: true,
	// 			data: result.databases
	// 		});
	// 	}		
	// });


	
	// var conn = mongoose.createConnection(MONGO_DB);

	
 //  conn.db.collectionNames(function(error, collections) {
 //    if (error) {
 //      throw new Error(error);
 //    } else {
 //      collections.map(function(collection) {
 //        console.log('found collection %s', collection.name);
 //      });
 //    }
 //  });



	// 	conn.db.collectionNames(function(error, collections) {
	// 		if (error) {
	// 			res.json({
	// 				status: false,
	// 				error: 'database name is not founded'
	// 			});
	// 		} else {
	// 			res.json({
	// 				status: true,
	// 				collections: collections
	// 			});
	// 		}
	// 	});
	// });

	// mongoose.connection.on('error', function(error){
	//   throw new Error(error);
	// });
});








app.listen(3000);