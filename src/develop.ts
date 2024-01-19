import { LineLayer } from './code/layers/LineLayer.ts';
import { Map, LatLon, TileLayer, Pan, Zoom, MarkerLayer } from './main.ts';

const mapInteractive = new Map({
    elementId: 'mapInteractive',
    center: new LatLon(52.08, 5.12),
    zoom: 11,
});

const tilelayer = new TileLayer({
    id: 'tiles',
    tileSize: 256,
    tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
});

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

const markers = new MarkerLayer({
    id: 'markers',
    markers: [
        {
            center: new LatLon(52.0906, 5.1213),
        },
        {
            center: new LatLon(48.858, 2.294),
        },
        {
            center: new LatLon(50.8478, 4.3601),
        }
    ]
});

mapInteractive.add(markers);

const mapStatic = new Map({
    elementId: 'mapStatic',
    center: new LatLon(-34.5473761, 146.565348),
    zoom: 10,
});

const satelliteLayer = new TileLayer({
    id: 'satellite',
    tileSize: 512,
    tileUrl: 'https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=4hSS0cBAZ5TFqAIlqlBU',
    attribution: '© Maptiler',
});

mapStatic.add(satelliteLayer);