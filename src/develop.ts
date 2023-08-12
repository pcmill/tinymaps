import { Map, LatLon, TileLayer, Pan, Zoom, MarkerLayer } from './main.ts';

const map = new Map({
    elementId: 'map',
    center: new LatLon(52.08, 5.12),
    zoom: 11,
});

const tilelayer = new TileLayer({
    id: 'tiles',
    tileSize: 256,
    tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
});

map.add(tilelayer);

const pan = new Pan();
map.attach(pan);

const zoom = new Zoom();
map.attach(zoom);

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

map.add(markers);