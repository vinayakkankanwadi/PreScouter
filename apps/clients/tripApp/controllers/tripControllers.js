tripModule.controller('tripController',function($scope, tripService, tripServicesHelper){
	console.log('Trip Controller created!');
	// Get deals
	$scope.vm = {}
	$scope.vm.deals = tripService.getDeals();
	//console.log($scope.model);
	$scope.type ="Cheapest";
	
	initTripDeals($scope.vm.deals);
	$scope.vm.departures = getCityList();
	$scope.vm.arrivals = getCityList();
	$scope.trip ={}
	$scope.result = false;
	
	$scope.updateResult = function (type) {
		console.log(type);
		if( type == "Cheapest" && $scope.result)
		{
			$scope.trip = $scope.searchResult.cheap;
			$scope.totalCost = $scope.searchResult.cheap.cost;
			$scope.totalTime = $scope.searchResult.cheap.time;
			$scope.trip.total = $scope.searchResult.total;
		}
		else
		if( type == "Fastest" && $scope.result)
		{
			$scope.trip = $scope.searchResult.fast;
			$scope.totalCost = $scope.searchResult.fast.cost;
			$scope.totalTime = $scope.searchResult.fast.time;
			$scope.trip.total = $scope.searchResult.total;
		}
	}
	
    $scope.search = function (source,destination,type) {
		console.log(source,destination);
		$scope.reset(false);
		$scope.searchResult = search(source,destination); 
		$scope.result = true;
	
		console.log("Controller Search",$scope.searchResult,type)
		$scope.updateResult(type);
	}
	
	$scope.reset = function (all) 
	{
		$scope.result =false;
		$scope.trip = {};
		if( all )
		{
			$scope.source="";
			$scope.destination="";
		}
	}
});