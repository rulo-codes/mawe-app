
/*

GET LOCATION WITH GEOLOCATION

const button = document.querySelector("button");

button.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        fetch(url).then(res => res.json()).then(data => {
            console.table(data.address);
        }).catch(() => {
            console.log("Error Fetching data from API");
        });
    })
});

*/

const map = L.map('map', {
    center: [51.505, -0.09],
    zoom: 13
});

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const marker = L.marker();

function onMapClick(e){
    marker.setLatLng(e.latlng).addTo(map);
}

map.on('click', onMapClick);