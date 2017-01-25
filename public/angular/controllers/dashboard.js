'use strict';

dbMfgModule.controller('DashboardController', ['$scope', 'Global', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', 'alertService', '$timeout', '$sce',
	function($scope, Global, $http, $location, $uibModal, $stateParams, $rootScope, alertService, $timeout, $sce) {


		//
		$scope.global = Global;

		// Big Boy!
		$scope.light = {};

		//
		$rootScope.d = {

		};


		$scope.light.selectedCollection = {};


		if (localStorage.selectedDB) {
			$rootScope.d.selectedDB = localStorage.selectedDB;
		}





		//
		$scope.d = {
			showSpinner: true,
			collections: []
		};



		/**
		 * Fetch All databases
		 */

		$rootScope.databases = [];


		$scope.getDatabases = function() {

			if ($rootScope.databases.length) {
				return;
			}

			$scope.d.showSpinner = true;

			// --

			$http.get('/api/get-databases').success(function(res) {

				$rootScope.databases = res.data;

				if (res.data) {
					if (localStorage.selectedDB) {
						$scope.selectDB(localStorage.selectedDB);
					} else {
						$scope.selectDB(res.data[0].name);
					}
				}

				$timeout(function() {
					$scope.d.showSpinner = false;
				}, 1000);

			}).error(function(err) {
				// @Todo write error mgmt stuff
			});

		};








		//
		$scope.getDatabases();



		/**
		 *
		 * 
		 */
		$scope.selectDB = function(db) {

			$rootScope.d.selectedDB = db;

			localStorage.selectedDB = db;

			if (localStorage.selectedDB != db) {
				localStorage.selectedCollection = JSON.stringify({});
			}


			$http.post('/api/get-collections', {
				dbName: db,
			}).success(function(res) {

				$scope.d.collections = res;

				// default select first collection
				// 
				if ($scope.d.collections && $scope.d.collections.length) {


					var tm = JSON.parse(localStorage.selectedCollection);

					console.log('tm >', tm);

					if (tm && tm.name) {
						$scope.light.selectCollection(tm);
					} else {
						localStorage.selectedCollection = JSON.stringify($scope.d.collections[0]);
						$scope.light.selectCollection($scope.d.collections[0]);
					}

				}



			}).error(function() {

			})
		}



		/**
		 * 
		 */
		$rootScope.d.changeDB = function(db) {
			$scope.selectDB(db);
		}














		//
		$scope.light.selectedCollectionName = '';
		$scope.light.selectedCollectionData = [];
		$scope.light.selectedCollection = {};

		$scope.light.selectedCollection.records = [];

		function syntaxHighlight(json) {

			if (typeof json != 'string') {
				json = JSON.stringify(json, undefined, 2);
			}

			json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

			return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
				var cls = 'number';
				if (/^"/.test(match)) {
					if (/:$/.test(match)) {
						cls = 'key';
					} else {
						cls = 'string';
					}
				} else if (/true|false/.test(match)) {
					cls = 'boolean';
				} else if (/null/.test(match)) {
					cls = 'null';
				}
				return '<span class="' + cls + '">' + match + '</span>';
			});
		}



		$scope.light.selectedCollection.showSpinner = true;

		/**
		 * 
		 */
		$scope.light.selectCollection = function(collection) {

			if (collection == undefined || collection == 'undefined') {
				return;
			}

			$scope.light.selectedCollection = collection;

			localStorage.selectedCollection = JSON.stringify(collection);

			$scope.light.selectedCollection.showSpinner = true;

			$http.post('/api/get-collection-records', {
				dbName: $rootScope.d.selectedDB,
				collectionName: collection.name
			}).success(function(res) {

				$scope.light.selectedCollection.records = [];

				if (res && res.length) {
					for (var r in res) {



						$scope.light.selectedCollection.records.push(res[r]);
					}
				}

				$timeout(function() {
					$scope.light.selectedCollection.showSpinner = false;
				}, 500);

			}).error(function() {

			})
		}


		$scope.light.loadRecordJsonUI = function(obj) {


			// var node = new PrettyJSON.view.Node({
			// 			  el: $('#record-box-' + obj._id),
			// 			  data:obj
			// 			});
		}


		/**
		 * 
		 */
		$scope.light.removeRecord = function(record, $index) {

			$scope.light.selectedCollection.records.splice($index, 1);

			console.log('record > ', record);

			$http.post('/api/collection/remove-record/' + record._id, {
				dbName: $rootScope.d.selectedDB,
				collectionName: $scope.light.selectedCollection.name
			}).success(function(res) {

			});

		}









		/**
		 * 
		 */
		$scope.light.editObj = {};
		$scope.light.editedRecord = {};
		$scope.light.editObj.openModal = function(record, $index) {

			$scope.light.editObj.index = $index;

			$scope.light.editObj.record = [];

			if (record && record._id) {
				for (var k in record) {

					var type = 'input';
					var tmValue = record[k];
					if (k == '$$hashKey' || k == '__v' || k == '$$hashKey') {
						continue;
					}

					if (typeof record[k] == 'object') {
						type = 'textarea';
						tmValue = JSON.stringify(record[k]);
					}

					$scope.light.editObj.record.push({
						type: type,
						key: k,
						value: record[k],
						model: tmValue
					});
				}
			}

			$("#record-edit-modal").modal('show');
		}







		/**
		 * 
		 */
		$scope.light.editObj.editAction = function() {

			//
			var properFields = {};

			//
			for (var r in $scope.light.editObj.record) {
				if (typeof $scope.light.editObj.record[r].value == 'object') {

				}
			}

			$http.post('/api/collection/edit-record/' + record._id, {
				dbName: $rootScope.d.selectedDB,
				collectionName: $scope.light.selectedCollection.name,
				fields: {}
			}).success(function(res) {

			});

		}


	}
]);