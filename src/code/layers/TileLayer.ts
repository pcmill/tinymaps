import { TileLayerOptions } from "../../models/TileLayerOptions";
import { Map } from "../Map";
import { Layer } from "./Layer";
import { Point } from "../Point";
import { isEmpty } from "../../helpers/util";
import { TileBuffer } from "./TileBuffer";

export class TileLayer extends Layer {
    _tileUrl: string;
    _tileSize: number;
    _attribution: string;
    _tileBuffer = new TileBuffer();

    constructor(tileLayerOptions: TileLayerOptions) {
        super(tileLayerOptions.id);

        this._tileSize = tileLayerOptions.tileSize || 256;
        this._tileUrl = tileLayerOptions.tileUrl;
        this._attribution = tileLayerOptions.attribution || "";
    }
    
    addLayer(map: Map) {
        super.addLayer(map);

        if (this.map) {
            this.drawTiles();

            if (this._attribution) {
                this.map.addAttribution(this._attribution);
            }
        }
    }

    removeLayer() {
        super.removeLayer();

        this._tileBuffer.clear();
    }

    // TODO: purge the tileBuffer when the map is panned or zoomed
    // so the tileBuffer does not grow indefinitely
    update() {
        super.update();
        this.drawTiles();
    }

    private drawTiles() {
        const tileBounds = this.getTileBounds();

        for (let x = tileBounds[0]; x <= tileBounds[1]; x++) {
            for (let y = tileBounds[2]; y <= tileBounds[3]; y++) {
                const tileUrl = this.getTileUrl(x, y, this.zoom);
                this.drawTile(tileUrl, x, y);
            }
        }
    }

    // Gets the bounds of the tiles that should be loaded based on the bounds of the map and the zoom level
    private getTileBounds(): number[] {
        if (!this.map) throw new Error("Map is not set");

        const totalTiles = Math.pow(2, this.zoom);

        const left = Math.floor((this.map.bounds.topLeft.x + 20037508.34) / (2 * 20037508.34) * totalTiles);
        const right = Math.floor((this.map.bounds.bottomRight.x + 20037508.34) / (2 * 20037508.34) * totalTiles);
        
        // Convert projected y-coordinates to latitude
        const topLeftLat = (Math.PI / 2 - 2 * Math.atan(Math.exp(-this.map.bounds.topLeft.y / 6378137))) * (180 / Math.PI);
        const bottomRightLat = (Math.PI / 2 - 2 * Math.atan(Math.exp(-this.map.bounds.bottomRight.y / 6378137))) * (180 / Math.PI);

        const top = Math.floor((1 - Math.log(Math.tan(topLeftLat * Math.PI / 180) + 1 / Math.cos(topLeftLat * Math.PI / 180)) / Math.PI) / 2 * totalTiles);
        const bottom = Math.floor((1 - Math.log(Math.tan(bottomRightLat * Math.PI / 180) + 1 / Math.cos(bottomRightLat * Math.PI / 180)) / Math.PI) / 2 * totalTiles);

        return [ 
            Math.max(0, left),
            Math.max(0, right),
            Math.max(0, top),
            Math.max(0, bottom)
        ];
    }

    private getTileUrl(x: number, y: number, zoom: number): string {
        if (isEmpty(x) || isEmpty(y) || isEmpty(zoom)) throw new Error("Invalid tile coordinates");

        return this._tileUrl
            .replace('{x}', x.toString())
            .replace('{y}', y.toString())
            .replace('{z}', zoom.toString());
    }

    private tileExtend(x: number, y: number): number[] {
        // Calculate the resolution for the given zoom level
        const resolution = 156543.03392804097 / Math.pow(2, this.zoom);

        // Calculate the extent of the tile in Web Mercator coordinates
        const extent = [
          x * this._tileSize * resolution - 20037508.34,
          20037508.34 - y * this._tileSize * resolution,
          (x + 1) * this._tileSize * resolution - 20037508.34,
          20037508.34 - (y + 1) * this._tileSize * resolution,
        ];

        return extent;
    }

    private drawTileOnCanvas(image: any, x: number, y: number) {
        if (!this.map || !this.canvasContext) return;

        const extent = this.tileExtend(x, y);

        const topLeft = new Point(extent[0], extent[1]);
        const bottomRight = new Point(extent[2], extent[3]);

        const topLeftCoordinates = this.map.pointToPixel(topLeft);
        const bottomRightCoordinates = this.map.pointToPixel(bottomRight);

        this.canvasContext.drawImage(image, topLeftCoordinates.x, topLeftCoordinates.y, bottomRightCoordinates.x - topLeftCoordinates.x, bottomRightCoordinates.y - topLeftCoordinates.y);
    }

    private drawTile(tileUrl: string, x: number, y: number) {
        const tile = this._tileBuffer.get(`${this.zoom}-${x}-${y}`);

        if (tile) {
            this.drawTileOnCanvas(tile.image, x, y);
            return;
        } else {
            const img = new Image();
            img.crossOrigin = 'anonymous'; // Use this if the tile server requires CORS
            img.src = tileUrl;

            img.onload = () => {
                this._tileBuffer.add({
                    id: `${this.zoom}-${x}-${y}`,
                    image: img
                });
    
                this.drawTileOnCanvas(img, x, y);
            };
        }
    }
}