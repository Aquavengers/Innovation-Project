const map = L.map('map').setView([0, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);


const locations = [
    { coords: [3.9008, 73.4665], name: 'Manta Divers - Maldives', url: 'https://www.manta-divers.com/' },
    { coords: [17.3099, -87.5549], name: 'BELIZE | Scuba Diving Lighthouse Reef Atoll', url: 'https://www.youtube.com/watch?v=e0Dswnxaaho' }
];

const markers = [];

locations.forEach(location => {
    const marker = L.marker(location.coords)
        .addTo(map)
        .bindPopup(`<a href="${location.url}" target="_blank">${location.name}</a>`);
    markers.push(marker); // Store marker for distance calculation

    // Add double-click event listener for distance calculation
    marker.on('dblclick', function() {
        alert("Click another location to calculate the distance between them!");
        setTimeout(() => {
            lastClickedMarker = marker; // sets the current marker as the marker the user last clicked
        }, 300);
    });
});

let lastClickedMarker = null; // store the last clicked marker
let userMarker = null; // store user's location marker


document.getElementById('getLocationBtn').addEventListener('click', getUserLocation);

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    if (userMarker) {
        userMarker.setLatLng([latitude, longitude]); 
    } else {
        userMarker = L.marker([latitude, longitude]).addTo(map)
            .bindPopup(`Your Location:<br>Latitude: ${latitude}<br>Longitude: ${longitude}`)
            .openPopup();
        
       
        userMarker.on('dblclick', function() {
            alert("Click another location to calculate the distance between them!");
            setTimeout(() => {
                lastClickedMarker = userMarker; 
            }, 300);
        });
    }

  
    map.setView([0, 0], 2);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("permission was denied");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("couldn't attain information.");
            break;
        case error.TIMEOUT:
            alert("eeee");
            break;
        case error.UNKNOWN_ERROR:
            alert("error");
            break;
    }
}


markers.forEach(marker => {
    marker.on('click', function() {
        if (lastClickedMarker && lastClickedMarker !== marker) {
            calculateDistance(lastClickedMarker.getLatLng(), marker.getLatLng());
            lastClickedMarker = null; 
        } else {
            lastClickedMarker = marker; 
        }
    });
});

if (userMarker) {
    userMarker.on('click', function() {
        if (lastClickedMarker) {
            calculateDistance(lastClickedMarker.getLatLng(), userMarker.getLatLng());
            lastClickedMarker = null; // Reset last clicked marker
        }
    });
}

// distance between two locations 
function calculateDistance(latLng1, latLng2) {
    const distanceInMeters = latLng1.distanceTo(latLng2); 

    const distanceInKilometers = distanceInMeters / 1000; 
    const distanceInMiles = distanceInMeters / 1609.34; 

    // this will show the estimated time of flight from one location to another
    const averageFlightSpeed = 800; // Average speed in km/h
    const estimatedFlightTimeHours = distanceInKilometers / averageFlightSpeed; 
    const estimatedFlightTimeMinutes = estimatedFlightTimeHours * 60; 

    // prepares message to send
    let distanceMessage = '';
    if (distanceInMeters < 1000) {
        distanceMessage = `${Math.round(distanceInMeters)} meters`;
    } else {
        distanceMessage = `${distanceInKilometers.toFixed(2)} km (${distanceInMiles.toFixed(2)} miles)`;
    }

    let flightTimeMessage = '';
    if (estimatedFlightTimeMinutes > 60) {
        const hours = Math.floor(estimatedFlightTimeHours);
        const minutes = Math.round((estimatedFlightTimeMinutes % 60));
        flightTimeMessage = `Estimated flight time: ${hours} hour(s) ${minutes} minute(s)`;
    } else {
        flightTimeMessage = `Estimated flight time: ${Math.round(estimatedFlightTimeMinutes)} minute(s)`;
    }

    // shows it on the screen in a popup
    alert(`Distance between the selected locations: ${distanceMessage}<br>${flightTimeMessage}`);
}

function submitReview() {
    const t1 = document.getElementById('text1').value;
    const t2 = document.getElementById('text2').value;

    if (t1 && t2) {
        const date = new Date();
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        
        const review = `<strong>${t1}</strong><br> - ${formattedDate}<br><hr>Diving location: ${t2}`;
        document.getElementById('d').innerHTML += review + '<br>';
    
        document.getElementById('text1').value = '';
        document.getElementById('text2').value = '';
    } else {
        alert("Please fill in both fields.");
    }
}
