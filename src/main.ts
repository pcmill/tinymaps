import { Map } from "./code/Map";
import { LatLon } from "./code/LatLon";
import { Point } from "./code/Point";
import { TileLayer } from "./code/layers/TileLayer";
import './style.css';

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

export {
  Point
}