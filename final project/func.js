var lat;
var lon;
var lat1;
var lon1;
var tableLat = [];
var tableLon = [];
var count = 0;

function getLocation(){
	var URL = 'https://api.tomtom.com/routing/1/calculateRoute';
	var start = document.getElementById('starting').value;
	var end = document.getElementById('ending').value;
	var route = document.getElementById('route').value;
	var mode = document.getElementById('mode').value;
	var hill = null;
	if (route == 'thrilling'){
		hill = document.getElementById('hill').value;
	}
	
	getLatLon(start);
	lat = document.getElementById('lat').value;
	lon = document.getElementById('lon').value;
	
	
	getLatLon(end);
	lat1 = document.getElementById('lat').value;
	lon1 = document.getElementById('lon').value;
	

	var test;
	if(hill != null){
		
		test = URL + '/'+ lat + '%2C' + lon + '%3A' + lat1 + '%2C' + lon1 + '/json?routeType=' +route+ '&travelMode=' + mode + '&hilliness=' + '&key=BwY5opfMcAhRUXyqGGpnnN9HBHBO7W1N';
		
	}else{
	test = URL + '/'+ lat + '%2C' + lon + '%3A' + lat1 + '%2C' + lon1 + '/json?routeType=' +route+ '&travelMode=' + mode +'&key=BwY5opfMcAhRUXyqGGpnnN9HBHBO7W1N'
	}
	

	a=$.ajax({
                url: test,
				method: "GET",
				async: false
        }).done(function(data) {
			
			
			const len3 = data.routes[0].sections[0].endPointIndex;
			
			for(let i =0; i <=len3; i++){
				
				var lat = data.routes[0].legs[0].points[i].latitude;
				var lon = data.routes[0].legs[0].points[i].longitude;
				
				getAddress(lat, lon);
				
				
			}
			$("#routeDetail").append('<tr><td>Amount of time in seconds:</td><td>' + data.routes[0].legs[0].summary.travelTimeInSeconds + '</td>/tr>');
			$("#routeDetail").append('<tr><td>Traffic delay in seconds:</td><td>'+data.routes[0].legs[0].summary.trafficDelayInSeconds +'</td></tr>');
			$("#routeDetail").append('<tr><td>Length in meters:</td><td>'+data.routes[0].legs[0].summary.lengthInMeters +'</td></tr>');
			
			
			}).fail(function(error) {
				alert('Make sure the values are correct and or not the same');
				
			});
			$(".map").css("visibility", "visible");
}




function getLatLon(address){
	

	var newThing = address.replaceAll(' ', '%20');
	newThing = newThing.replaceAll(',', '%2C');
	
	

	var tmp = 'https://api.tomtom.com/search/2/geocode/'+ newThing + '.json?storeResult=false&view=Unified&key=BwY5opfMcAhRUXyqGGpnnN9HBHBO7W1N'
	
	
a=$.ajax({
            url: tmp,
			method: "GET",
			async: false //I'm going insane
}).done(function(data){
	var length= (data.summary.numResults);
	
	for(let i = 0; i <=length; i++){
		const check = data.results[i].matchConfidence.score;
		if(check > .75) {
			lat = data.results[i].position.lat;
			$("#lat").val(lat)
			$("#lon").val(data.results[i].position.lon);
			return;
			
		}
		
	}
}).fail(function(error){
	alert(error);
	
});


}

function getAddress(lat2, lon2){
	
	
	
	var here = 'https://api.tomtom.com/search/2/reverseGeocode/crossStreet/'+ lat2 + '%2C'+ lon2 + '.json?limit=1&spatialKeys=false&radius=5&allowFreeformNewLine=false&view=Unified&key=BwY5opfMcAhRUXyqGGpnnN9HBHBO7W1N';
	
	a=$.ajax({
            url: here,
			method: "GET",
			async: false
}).done(function(data){
	
	if(data.summary.numResults == 0){
		
		
	}else{
	var tmp = data.addresses[0].address.streetName;
	
	var pic = 'https://api.tomtom.com/map/1/staticimage?layer=basic&style=main&format=png&zoom=12&center='+lon2 + '%2C%20' + lat2 + '&width=512&height=512&view=Unified&key=BwY5opfMcAhRUXyqGGpnnN9HBHBO7W1N'
	console.log(pic);
	$("#tableTime").append('<tr><td><img src='+ pic +'></td><td>' + tmp + '</td></tr>');
	
	tableLat.push(lat2);
	tableLon.push(lon2);
	count++;
	}
}).fail(function(error){
	
	
});
	
	sleep(200);
	
	
	




	
	
	
	
	
}
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
	
