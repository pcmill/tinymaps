import { LineCoordinate, LineLayerOptions } from "../../models/LineLayerOptions";
import { Map } from "../Map";
import { Layer } from "./Layer";

export class LineLayer extends Layer {
    _coordinates: LineCoordinate[] = [];
    _width: number = 2;
    _fillColor: string = 'black';

    constructor(lineLayerOptions: LineLayerOptions) {
        super(lineLayerOptions.id);

        if (lineLayerOptions.coordinates) {
            this._coordinates = lineLayerOptions.coordinates;
            this._width = lineLayerOptions.width || 2;
            this._fillColor = lineLayerOptions.fillColor || 'black';
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
        if (this._coordinates) {
            this.drawLine(this._coordinates);
        }
    }

    private drawLine(coordinates: LineCoordinate[]) {
        const ctx = this.canvasContext!;
        ctx.strokeStyle = this._fillColor;
        ctx.lineWidth = this._width;

        ctx.beginPath();

        for (const coordinate of coordinates) {
            const center = this.map!.projection.project(coordinate.center);
            const pixelCoordinates = this.map!.pointToPixel(center);

            ctx.lineTo(pixelCoordinates.x, pixelCoordinates.y);
        }

        ctx.stroke();
    }
}