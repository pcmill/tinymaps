import { BaseMap } from "./code/BaseMap";
import { LatLon } from "./code/LatLon";
import { Point } from "./code/Point";
import { TileLayer } from "./code/layers/TileLayer";
import './style.css';

const map = new BaseMap({
  elementId: 'map',
  center: new LatLon(52.08, 5.12),
  zoom: 11,
});

const tilelayer = new TileLayer({
  id: 'tiles',
  tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
});

map.add(tilelayer);

export {
  Point
}