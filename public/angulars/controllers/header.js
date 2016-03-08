light.controller("headerController", function($scope, $rootScope, $http) {
	
	if(!$rootScope.databases) {
		$rootScope.databases = [];
	}

	/**
	 * Fetch All databases
	 */
	
	$scope.getDatabases = function() {

		if($rootScope.databases.length) {
			return;
		}

		// --

		$http.get('/api/get-databases').success(function(res) {
			$rootScope.databases = res.data;

			console.log('$rootScope.databases > ', $rootScope.databases);
		}).error(function(err) {
			// @Todo write error mgmt stuff
		});

	};

	
	$scope.lightDataSelect = function(dbName) {
		$http.post('/api/get-collection', {
			dbName: dbName,	
		}).success(function(res) {
			$rootScope.collection = dbName;
		}).error(function() {

		})
		console.log('helllo', dbName);
	};
	
	// --


	$scope.getDatabases();

});