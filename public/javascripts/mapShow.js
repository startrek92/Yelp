mapboxgl.accessToken = mapBoxToken;
console.log(campgrounds);
const camp = (campgrounds);
console.log(camp);
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/light-v10', // style URL
    center: camp.campDetails.geometry.coordinates, // starting position [lng, lat]
    zoom: 8, // starting zoom
});

const marker1 = new mapboxgl.Marker()
    .setLngLat(camp.campDetails.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${camp.campDetails.title}</h3>`)
    )
    .addTo(map);

map.addControl(new mapboxgl.NavigationControl());