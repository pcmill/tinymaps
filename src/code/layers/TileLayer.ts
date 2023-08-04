import { TileLayerOptions } from "../../models/TileLayerOptions";
import { Map } from "../Map";
import { Layer } from "./Layer";
import { LatLon } from "../LatLon";

export class TileLayer extends Layer {
    tileUrl: string;
    attribution: string;
    
    constructor(tileLayerOptions: TileLayerOptions) {
        super(tileLayerOptions.id);

        this.tileUrl = tileLayerOptions.tileUrl;
        this.attribution = tileLayerOptions.attribution || "";
    }
    
    setMap(map: Map) {
        super.setMap(map);
        
        if (this.map) {
            this.drawTiles();

            if (this.attribution) {
                this.map.addAttribution(this.attribution);
            }
        }
    }

    private drawTiles() {
        const tileSize = 256;
        const tileBounds = this.getTileBounds();

        for (let x = tileBounds.left; x <= tileBounds.right; x++) {
            for (let y = tileBounds.top; y <= tileBounds.bottom; y++) {
                const tileUrl = this.getTileUrl(x, y, this.zoom);
                this.drawTile(tileUrl, x, y, tileSize);
            }
        }
    }

    // Gets the bounds of the tiles that should be loaded based on the bounds of the map and the zoom level
    private getTileBounds(): any {
        if (!this.map) return;

        const totalTiles = Math.pow(2, this.zoom);

        const left = Math.floor((this.map.bounds.topLeft.x + 20037508.34) / (2 * 20037508.34) * totalTiles);
        const right = Math.floor((this.map.bounds.bottomRight.x + 20037508.34) / (2 * 20037508.34) * totalTiles);
        
        // Convert projected y-coordinates to latitude
        const topLeftLat = (Math.PI / 2 - 2 * Math.atan(Math.exp(-this.map.bounds.topLeft.y / 6378137))) * (180 / Math.PI);
        const bottomRightLat = (Math.PI / 2 - 2 * Math.atan(Math.exp(-this.map.bounds.bottomRight.y / 6378137))) * (180 / Math.PI);

        const top = Math.floor((1 - Math.log(Math.tan(topLeftLat * Math.PI / 180) + 1 / Math.cos(topLeftLat * Math.PI / 180)) / Math.PI) / 2 * totalTiles);
        const bottom = Math.floor((1 - Math.log(Math.tan(bottomRightLat * Math.PI / 180) + 1 / Math.cos(bottomRightLat * Math.PI / 180)) / Math.PI) / 2 * totalTiles);

        return { left, right, top, bottom };
    }

    private getTileUrl(x: number, y: number, zoom: number): string {
        return this.tileUrl
            .replace('{x}', x.toString())
            .replace('{y}', y.toString())
            .replace('{z}', zoom.toString());
    }

    private tileToLon(x: number): number {
        return (x / Math.pow(2, this.zoom) * 360 - 180);
    }

    private tileToLat(y: number): number {
        const n = Math.PI - 2 * Math.PI * y / Math.pow(2, this.zoom);
        return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
    }

    private drawTile(tileUrl: string, x: number, y: number, tileSize: number) {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Use this if the tile server requires CORS
        img.src = tileUrl;

        img.onload = () => {
            if (!this.map || !this.canvasContext) return;

            const tileLon = this.tileToLon(x);
            const tileLat = this.tileToLat(y);
            const latlon = new LatLon(tileLat, tileLon);

            const coordinates = this.map.pointToPixel(this.map._projection.project(latlon));

            this.canvasContext.drawImage(img, coordinates.x, coordinates.y, tileSize, tileSize);
        };
    }
}