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

		collection.find({}).limit(10).toArray(function(err, docs) {
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

		var collection = db.collection(req.body.collectionName);

		collection.deleteOne({
			_id: new ObjectID(req.params.id)
		}, function(err, docs) {
			console.log(">>>>>>>", err, docs);
			res.json(docs || []);
		});

	});
}


