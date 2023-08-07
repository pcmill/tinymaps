import { Map, LatLon, TileLayer, Pan, Zoom } from './main.ts';

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