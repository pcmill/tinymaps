import { Map, LatLon, TileLayer, Pan, Zoom, MarkerLayer, ImageLayer, BoundingBox, LineLayer, LayerGroup, Attribution } from './main.ts';

const mapInteractive = new Map({
    elementId: 'mapInteractive',
    center: new LatLon(52.08, 5.12),
    zoom: 11,
});

const tilelayer = new TileLayer({
    id: 'tiles',
    tileSize: 256,
    tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
});

const interactiveAttribution = new Attribution('© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors');
mapInteractive.attach(interactiveAttribution);

mapInteractive.add(tilelayer);

const pan = new Pan();
mapInteractive.attach(pan);

const zoom = new Zoom();
mapInteractive.attach(zoom);

const coordinates = new LineLayer({
    id: 'coordinates',
    width: 3,
    fillColor: 'darkblue',
    coordinates: [
        {
            center: new LatLon(52.0906, 5.1213),
        },
        {
            center: new LatLon(50.8478, 4.3601),
        },
        {
            center: new LatLon(48.858, 2.294),
        }
    ]
});

mapInteractive.add(coordinates);

const utrechtMarker = new MarkerLayer({
    id: 'marker1',
    center: new LatLon(52.0906, 5.1213),
    options: {
        radius: '12px',
        fillColor: 'darkblue',
        borderColor: 'lightblue',
    }
});

const brusselsMarker = new MarkerLayer({
    id: 'marker2',
    center: new LatLon(50.8478, 4.3601),
    options: {
        fillColor: 'red',
    }
});

const parisMarker = new MarkerLayer({
    id: 'marker3',
    center: new LatLon(48.858, 2.294),
});

const markerGroup = new LayerGroup();

markerGroup.addLayer(utrechtMarker);
mapInteractive.add(utrechtMarker);
markerGroup.addLayer(brusselsMarker);
mapInteractive.add(brusselsMarker);
markerGroup.addLayer(parisMarker);
mapInteractive.add(parisMarker);

// Remove the markers after 5 seconds
setTimeout(() => {
    markerGroup.removeLayers();
}, 5000);

const mapStatic = new Map({
    elementId: 'mapStatic',
    center: new LatLon(52.08, 5.12),
    zoom: 10,
});

const satelliteLayer = new TileLayer({
    id: 'satellite',
    tileSize: 512,
    tileUrl: 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=4hSS0cBAZ5TFqAIlqlBU',
});

const staticAttribution = new Attribution('© Maptiler');
mapStatic.attach(staticAttribution);

mapStatic.add(satelliteLayer);

const mapImage = new Map({
    elementId: 'mapImage',
    center: new LatLon(52.09, 5.111),
    zoom: 12,
});

const imageTilelayer = new TileLayer({
    id: 'tiles',
    tileSize: 256,
    tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
});

const imageAttribution = new Attribution('© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors');
mapImage.attach(imageAttribution);

mapImage.add(imageTilelayer);

const imageLayer = new ImageLayer({
    id: 'image',
    opacity: 0.65,
    imageUrl: 'https://pub-e3800c93ea204b7d96232b54c15f1b11.r2.dev/map-utrecht.jpg',
    bounds: new BoundingBox(
        new LatLon(52.1294, 5.0279839),
        new LatLon(52.05064, 5.1834883)
    )
});

mapImage.add(imageLayer);

const imagePan = new Pan();
mapImage.attach(imagePan);

const imageZoom = new Zoom();
mapImage.attach(imageZoom);