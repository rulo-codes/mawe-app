
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

const key = 'B5DZprXVurPYHQYpjYGc';
const maweMap = '019d9359-9c57-7522-b4dc-7a10a029169f';

const map = L.map('map').setView([51.505, -0.09], 13);

const seaTile = L.maptilerLayer({
    apiKey: `${key}`,
    style: `${maweMap}`
}).addTo(map);

//const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: 'Esri' });

