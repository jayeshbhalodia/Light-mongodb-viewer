// MongoDB setup
var mongoose = require('mongoose'),
	Admin = mongoose.mongo.Admin;
var connection = mongoose.createConnection('mongodb://localhost:27017/lightMongo');



/**
 * Game Starter route '/'
 */
exports.index = function(req, res) {
	res.render('layout', {
		env: process.env.NODE_ENV || 'development'
	});
}



/**
 *
 * 
 */
exports.getAllDatabase = function(req, res) {
	new Admin(connection.db).listDatabases(function(err, result) {
		if (err) {
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

}



/**
 * 
 */
exports.getCollections = function(req, res) {

	if (!req.body.dbName) {
		res.json({
			status: false,
			error: 'database name is not founded'
		});
	}


	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect('mongodb://localhost:27017/' + req.body.dbName, function(err, db) {
		db.listCollections().toArray(function(err, collInfos) {
			res.json(collInfos);
		});
	});

}







/**
 * 
 */
exports.getCollectionRecords = function(req, res) {

	if (!req.body.dbName) {
		res.json({
			status: false,
			error: 'database name is not founded'
		});
	}


	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect('mongodb://localhost:27017/' + req.body.dbName, function(err, db) {

		var collection = db.collection(req.body.collectionName);

		collection.find({}).limit(100).toArray(function(err, docs) {
			res.json(docs || []);
		});

	});

}










/**
 * 
 */
exports.removeRecord = function(req, res) {

	var MongoClient = require('mongodb').MongoClient;

	var ObjectID = require('mongodb').ObjectID;

	MongoClient.connect('mongodb://localhost:27017/' + req.body.dbName, function(err, db) {

		var collection = db.collection(req.body.collectionName);

		collection.deleteOne({
			_id: new ObjectID(req.params.id)
		}, function(err, docs) {
			console.log(">>>>>>>", err, docs);
			res.json(docs || []);
		});

	});
}











/**
 * 
 */
exports.editRecord = function(req, res) {

	var MongoClient = require('mongodb').MongoClient;

	var ObjectID = require('mongodb').ObjectID;

	MongoClient.connect('mongodb://localhost:27017/' + req.body.dbName, function(err, db) {

		//
		console.log('req.body >>>>>' , req.body);

		var collection = db.collection(req.body.collectionName);


		// var properData = {};
		// 
		// 
		// if(req.body.fields && req.body.fields.length) {
		// 	for(var f in req.body.fields) {
		// 
		// 		if(req.body.fields[f].key != '_id') {
		// 
		// 			switch(req.body.fields[f].type) {
		// 				case 'input':
		// 					properData[req.body.fields[f].key] = req.body.fields[f].model;
		// 					break;
		// 				case 'textarea':
		// 
		// 					if(typeof req.body.fields[f].value == 'object') {
		// 						try {
		// 							properData[req.body.fields[f].key] = JSON.parse(req.body.fields[f].model);
		// 						} catch(x1) {
		// 
		// 						}
		// 					}
		// 
		// 					console.log('>>>>>', typeof req.body.fields[f].value);
		// 					// properData[req.body.fields[f].key] = req.body.fields[f].model;
		// 					break;
		// 			}
		// 		}
		// 	}
		// }

		console.log('properData > ', req.body.fields);
		delete req.body.fields._id;

		collection.updateOne({
			_id: new ObjectID(req.params.id)
		}, {
			$set: req.body.fields
		}, function(err, docs) {
			if(err) {
				res.json({
					status: false,
					err: err
				});
			} else {
				res.json({
					status: true
				});
			}

		});

	});
}















/**
 * 
 */
exports.deleteAll = function(req, res) {

	var MongoClient = require('mongodb').MongoClient;

	var ObjectID = require('mongodb').ObjectID;

	MongoClient.connect('mongodb://localhost:27017/' + req.body.dbName, function(err, db) {

		var collection = db.collection(req.body.collectionName);

		collection.deleteMany({
			_id: {
				$ne: '1'
			}
		}, function(err, docs) {
			res.json(docs || []);
		});

	});
}
