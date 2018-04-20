'use strict';

lightMongo.controller('DashboardController', ['$scope', 'Global', '$http', '$location', '$uibModal', '$stateParams', '$rootScope', 'alertService', '$timeout', '$sce',
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


        //
        $scope.light.selectedCollection.showSpinner = true;

        /**
         * 
         */
        $scope.light.selectCollection = function(collection) {

            if (collection == undefined || collection == 'undefined') {
                return;
            }



            $timeout(function() {

                $scope.light.selectedCollection = collection;
                $scope.light.selectedCollection.records = [];
                localStorage.selectedCollection = JSON.stringify(collection);

                //
                $scope.light.selectedCollection.showSpinner = true;

                //
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

                });

            }, 200);
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


            if (!record.isConfirmed) {
                record.isConfirmed = true;
                return;
            }

            $scope.light.selectedCollection.records.splice($index, 1);


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

        $scope.light.editObj.aceOptions = {
			useWrapMode : true,
		    showGutter: false,
		    theme:'twilight',
		    mode: 'json',
		    firstLineNumber: 5,
			fontSize: "18pt",			
			onLoad: function(editor) {
				editor.setFontSize(15);
				editor.setOptions({
				    maxLines: Infinity
				});
			}
        };

        $scope.light.editObj.openModal = function(record, $index) {

            //
            $scope.light.editObj.rec = record;
            $scope.light.editObj.recStr = JSON.stringify(record, null, '\t')
			



            //
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
        $scope.light.editObj.isJSONValid = true;
        $scope.light.editObj.editAction = function() {
			
			var ttParse = {};
			try {
				ttParse = JSON.parse($scope.light.editObj.recStr);
			} catch(es) {
				if(es) {
					$scope.light.editObj.isJSONValid = false;
					return;
				}
			}
			
			$scope.light.editObj.isJSONValid = true;

            //
            $("#record-edit-modal").modal('hide');

            //
            var properFields = {};

            //
            for (var r in $scope.light.editObj.record) {
                if (typeof $scope.light.editObj.record[r].value == 'object') {

                }
            }

            //
            $http.post('/api/collection/edit-record/' + $scope.light.editObj.rec._id, {
                dbName: $rootScope.d.selectedDB,
                collectionName: $scope.light.selectedCollection.name,
                fields: ttParse
            }).success(function(res) {
                $scope.light.reloadData();
            });
        }


        /**
         * 
         */
        $scope.light.reloadData = function() {
            $scope.light.selectCollection($scope.light.selectedCollection);
        }

		/**
         * 
         */
        $scope.light.deleteAllConfirmation = function() {
            $("#delete-all-confirmation").modal('show');
        }

        /**
         * 
         */
        $scope.light.deleteAll = function() {
			$("#delete-all-confirmation").modal('hide');
            $http.post('/api/collection/delete-all', {
                dbName: $rootScope.d.selectedDB,
                collectionName: $scope.light.selectedCollection.name
            }).success(function(res) {
                $scope.light.selectCollection($scope.light.selectedCollection);
            });
        }




    }
]);
