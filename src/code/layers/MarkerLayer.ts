import { Marker, MarkerLayerOptions } from "../../models/MarkerLayerOptions";
import { Map } from "../Map";
import { Layer } from "./Layer";

export class MarkerLayer extends Layer {
    _markers: Marker[] = [];

    constructor(markerLayerOptions: MarkerLayerOptions) {
        super(markerLayerOptions.id);

        if (markerLayerOptions.markers) {
            this._markers = markerLayerOptions.markers;
        }
    }

    addLayer(map: Map) {
        super.addLayer(map);
        this.drawLayers();
    }

    update() {
        super.update();
        this.drawLayers();
    }

    private drawLayers() {
        if (this._markers) {
            for (const marker of this._markers) {
                this.drawMarker(marker);
            }
        }
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

    private drawMarker(marker: Marker) {
        const center = this.map!.projection.project(marker.center);
        const pixelCoordinates = this.map!.pointToPixel(center);
        const radius = marker.radius;
        const radiusPixels = this.getRadiusPixels(radius);

        const ctx = this.canvasContext!;
        ctx.beginPath();
        ctx.arc(pixelCoordinates.x, pixelCoordinates.y, radiusPixels, 0, 2 * Math.PI, false);
        ctx.fillStyle = marker.fillColor;
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = marker.borderColor;
        ctx.stroke();
    }
}