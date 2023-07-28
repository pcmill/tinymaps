# Tiny Maps

A mapping library made with a focus on small size and extensibility.

## API

The class everything revolves around is the `BaseMap`. This is responsible for setting up the map. `BaseMap` gives you no interactivity though, it is as light as possible. The interactivity you need can be attached to the `BaseMap` like so:

```
import { BaseMap, Zoom, Point } from 'tinymaps';

try {
    const map = new BaseMap({
        element: 'map',
        center: new Point(5.623, 44.34),
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
} catch(e) {
    console.log(e);
}
```