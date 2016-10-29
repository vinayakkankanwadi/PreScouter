
tripModule.service('tripServicesHelper',function(){
    console.log('Trip Services Helper created!');
	
	var trip = {}
	var adjNodes = new Map();
	var cityList = new Set();

	var matrix = [];
	var cityEdges = new Map();
	var cityVertices = new Map();
	
	
	var pathCount = 0;
	var color =[];
	var size = 0;
	var al = [];
	var edges = [];

	traversePathList = new Map();
	
	
	// Initialize Trip`
	initTripDeals = function(deals)
	{
		trip.deals = deals;
		adjNodes = createAdjNodes();
	}
	
	// get trips`
	getTripDeals = function()
	{
		return trip.deals;
	}

	// get cities
	getCityList = function(){
		return Array.from(cityList);
	}
	
	// update city list
	updateCityList = function (source,destination)
	{
		cityList.add(destination);
		//cityList.add(source);
	}
	
	// update city edges
	updateCityEdges = function (cityEdge,currentCity)
	{
		if (cityEdges.get(cityEdge) == undefined)
		{
			cityEdges.set(cityEdge,[currentCity]);
		}
		else
		{
			var tempEdges = cityEdges.get(cityEdge);
			tempEdges.push(currentCity);				
			cityEdges.set(cityEdge,tempEdges);
		}
	}
	
	// update city vertices
	updateCityVertices = function (city,currentCity)
	{
		currentCity.calcCost = (currentCity.cost - ((currentCity.cost*currentCity.discount)/100) )	;
		currentCity.formatedTime = parseInt(currentCity.duration.h)+"h"+parseInt(currentCity.duration.m);
		currentCity.calcTime = parseInt(currentCity.duration.h)*60+parseInt(currentCity.duration.m)
				
		if (cityVertices.get(city) == undefined)
		{
			cityVertices.set(city,[currentCity]);
		}
		else
		{
			var tempVertices = cityVertices.get(city);
			tempVertices.push(currentCity);
			cityVertices.set(city,tempVertices);
		}
	}
	
	getUpdatedTime = function (time, current)
	{
		var arr = time.split('h')
		var tempTotal = parseInt(arr[0]) * 60 +  parseInt(arr[1]) +  parseInt(current.duration.h) * 60 +  parseInt(current.duration.m);
		var div = Math.floor(tempTotal/60);
		var rem = tempTotal % 60;
		return div+"h"+rem;
	}
	
	// creat adjacent nodes
	createAdjNodes = function () 
	{
		console.log("createAdjNodes");
		for (var i =0 ;i < trip.deals.length;i++)
		{
			var currentCity = trip.deals[i];
			index =currentCity.arrival+currentCity.departure ;
			updateCityList(currentCity.arrival,currentCity.departure);
			matrix[index] = 1;
			var city = currentCity.departure;
			updateCityVertices(city,currentCity);
			updateCityEdges(index,currentCity);
		}
		return cityVertices;
	}
	
	
	allPaths = function(source,destination,cityVertices) {
		color[source] = true;
		al.push(source);
		size++;
		if( source == destination )
		{
			traversePathList[pathCount++] = edges.join();
			return;
		}
		for (var [key, value] of cityVertices) {
			var cI = key+source;
			if(matrix[cI] ==  1 && color[key] == false)
			{
				edges.push(cI);
				allPaths(key,destination,cityVertices);
				color[key] = false;
				size--;
				al.splice(al.length-1, 1);
				edges.splice(edges.length-1,1);
			}
		}
	}
   
	dfs = function(source,destination,adjNodes){
		for (var [key, value] of adjNodes) {
			color[key] = false;
		}
		allPaths(source,destination,adjNodes);
	}

	search = function(source,destination){
		pathCount=0;
		dfs(source,destination,adjNodes);
		console.log(cityEdges,color);
		var ret = new Object();
		ret.cheap = [];
		ret.cheap.cost = 99999; // some long number
		ret.cheap.time = "99999h00"; // some long number
		ret.fast = [];
		ret.fast.cost  = 99999; // some long number
		ret.fast.time  = "99999h00"; // some long number
		ret.fast.timeMin  = 9999999; // some long number
		ret.total =pathCount;
		
		for (i = 0 ;i< pathCount;i++)
		{
			var tempCheapCost = 0;
			var tempCheapTime = "0h0";
			var tempCheapEdge = [] ;
			var tempFastCost = 0;
			var tempFastTime = "0h0";
			var tempFastEdge = [] ;
			var tempFastTimeMin = 9999999; // some long number
			var edges = (traversePathList[i]).split(",") ;
			//console.log(edges.length);
			for (edge=0;edge<edges.length;edge++)
			{
				var options = cityEdges.get(edges[edge]);
				var cost = options[0];
				var time = options[0];
				for(op=1; op<options.length;op++)
				{
					if(  options[op].calcCost < cost.calcCost )
					{
						cost = options[op];
					}
					if(  options[op].calcTime < cost.calcTime )
					{
						time = options[op];
					}
				}
				tempCheapEdge.push(cost);
				tempFastEdge.push(time);
				
				tempCheapCost = tempCheapCost + cost.calcCost;
				tempFastCost = tempFastCost + time.calcCost;
				
				tempCheapTime = getUpdatedTime(tempCheapTime,cost);
				tempFastTime = getUpdatedTime(tempFastTime,time);
				var arr = tempFastTime.split('h')
				tempFastTimeMin = parseInt(arr[0]) * 60 +  parseInt(arr[1])
				
			}
			if( tempCheapCost < ret.cheap.cost)
			{
				ret.cheap = tempCheapEdge;
				ret.cheap.cost = tempCheapCost;
				ret.cheap.time = tempCheapTime;
			}
				
			if( tempFastTimeMin < ret.fast.timeMin)
			{
				ret.fast = tempFastEdge;
				ret.fast.cost = tempFastCost;
				ret.fast.time = tempFastTime;
			}
		}
		console.log(ret);
		return ret;
	}
	
});
