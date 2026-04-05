
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

const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'OSM' });
const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: 'Esri' });
const seaMap = L.tileLayer('https://t2.openseamap.org/tile/{z}/{x}/{y}.png', { attribution: 'Open Sea Map'})
const seaMark = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', { attribution: 'Open Sea Map - Marks'})

const baseMaps = {
    "Street Map": osm,
    "Satellite": satellite
};

const layerMaps = {
    "Sea Map": seaMap,
    "Sea Mark": seaMark
}

L.control.layers(baseMaps, layerMaps).addTo(map);


const marker = L.marker();

function onMapClick(e){
    marker.setLatLng(e.latlng).addTo(map);
}

map.on('click', onMapClick);