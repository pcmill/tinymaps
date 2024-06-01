# Tinymaps

A mapping library made with a focus on small size and extensibility. Tinymaps has no dependecies and is written in Typescript.

## API

The class everything revolves around is the `Map`. `Map` gives you no interactivity though, it is as light as possible. If you just need a static map the code will be around 8.5kb (not gzipped).

The interactivity you need can be attached to the `Map` like so:

```javascript
import { Map, LatLon, Zoom, Pan, Attribution } from 'tinymaps';

try {
    const map = new Map({
        element: 'map',
        center: new LatLon(5.623, 44.34),
        zoom: 8
    });

    const tilelayer = new TileLayer({
        id: 'tiles',
        tileUrl: 'https://tile.openstreetmap.org/{xyz}.png'
    });

    map.add(tilelayer);

    const attribution = new Attribution('© OpenStreetMap contributors');

    map.attach(attribution);

    const zoom = new Zoom({
        maxZoom: 12,
        minZoom: 1
    });

    map.attach(zoom);

    const pan = new Pan();

    map.attach(pan);
} catch(e) {
    console.log(e);
}
```

As you can see you `add` layers and `attach` interactivities.

### Styling

Currently a minimal amount of CSS is needed:

```css
#map {
    width: 500px;
    height: 500px;
}

#map > .attribution {
    padding: 0.4rem 0.6rem;
    opacity: 0.85;
    font-family: system-ui;
    font-size: 0.8rem;
    background-color: white;
}

#map > .attribution > a {
    color: #333;
}
```

Ofcourse the size of the map should be adjusted to your needs. The attribution is easy to style to your needs.

### Status

This library is still in development.

Next goals:

- Mobile zooming (pinch to zoom)
- Zooming should take cursor placement in mind
- Layer position (up, down, to top)
- SVG Marker
- BindHTML, a way to add HTML elements to things like Markers
- GeoJSON layer
