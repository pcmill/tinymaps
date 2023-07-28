import { BaseMap } from "./code/BaseMap";
import { LatLon } from "./code/LatLon";
import { TileLayer } from "./code/TileLayer";
import './style.css';

const map = new BaseMap({
  elementId: 'map',
  center: new LatLon(52.08, 5.12),
  zoom: 11,
});

const tilelayer = new TileLayer({
  id: 'tiles',
  tileUrl: 'https://api.maptiler.com/maps/streets-v2/256/{z}/{x}/{y}.png?key=4hSS0cBAZ5TFqAIlqlBU',
});

map.add(tilelayer);

export {
  LatLon
}