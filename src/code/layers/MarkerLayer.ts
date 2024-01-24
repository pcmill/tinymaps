import { MarkerLayerOptions, MarkerOptions } from "../../models/MarkerLayerOptions";
import { LatLon } from "../LatLon";
import { Map } from "../Map";
import { Layer } from "./Layer";

export class MarkerLayer extends Layer {
    _center: LatLon | null = null;
    _options: MarkerOptions | null = null;

    constructor(markerLayerOptions: MarkerLayerOptions) {
        super(markerLayerOptions.id);

        if (markerLayerOptions.center) {
            this._center = markerLayerOptions.center;
        }

        if (markerLayerOptions.options) {
            this._options = markerLayerOptions.options;
        }
    }

    addLayer(map: Map) {
        super.addLayer(map);
        this.drawMarker();
    }

    update() {
        super.update();
        this.drawMarker();
    }

    private getRadiusPixels(radius: string): number {
        if (radius.endsWith('px')) {
            radius = radius.slice(0, -2);

            return parseInt(radius, 10);
        }

        // TODO translate meters to pixels based on zoom level
        if (radius.endsWith('m')) {
            radius = radius.slice(0, -1);

            const radiusMeters = parseInt(radius, 10);

            return radiusMeters;
        }

        throw new Error("Radius should end with 'px' or 'm'");
    }

    private drawMarker() {
        const radius = this._options?.radius || '10px';
        const fillColor = this._options?.fillColor || 'darkblue';
        const borderColor = this._options?.borderColor || 'white';

        if (this._center) {
            const center = this.map!.projection.project(this._center);
            const pixelCoordinates = this.map!.pointToPixel(center);
            const radiusPixels = this.getRadiusPixels(radius);

            const ctx = this.canvasContext!;
            ctx.beginPath();
            ctx.arc(pixelCoordinates.x, pixelCoordinates.y, radiusPixels, 0, 2 * Math.PI, false);

            ctx.fillStyle = fillColor;
            ctx.fill();

            ctx.lineWidth = 5;
            ctx.strokeStyle = borderColor;
            ctx.stroke();
        }
    }
}