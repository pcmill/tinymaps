# Tinymaps

A mapping library made with a focus on small size and extensibility. Tinymaps has no dependecies and is written in Typescript.

## API

The class everything revolves around is the `Map`. `Map` gives you no interactivity though, it is as light as possible. If you just need a static map the code will be around 7 to 8kb (not gzipped).

The interactivity you need can be attached to the `Map` like so:

```
import { Map, LatLon, Zoom, Pan } from 'tinymaps';

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

### Status

This library is still in development.

Next goals:

- Mobile zooming (pinch to zoom)
- Zooming should take cursor placement in mind
- Better handling of the map edges
- Tile buffer purging