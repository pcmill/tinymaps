import { isEmpty } from "../../helpers/util";
import { Map } from "../Map";

/**
 * Responsible for maintaining the canvas
 */
export class Layer {
    id: string;
    canvas: HTMLCanvasElement | null;
    canvasContext: CanvasRenderingContext2D | null;
    zoom: number;
    map: Map | null;

    constructor(id: string) {
        if (isEmpty(id)) {
            throw new Error('Layer id cannot be empty');
        }

        this.id = id;
        this.zoom = 1;
        this.map = null;
        this.canvas = null;
        this.canvasContext = null;
    }

    update(): void {
        this.zoom = this.map!.zoom;
        this.canvasContext!.clearRect(0, 0, this.map!.width, this.map!.height);
    }

    addLayer(map: Map) {
        if (!map) throw new Error('Map is required');

        this.map = map;

        this.canvas = document.createElement('canvas');
        this.canvas.id = this.id;
        this.map.element.appendChild(this.canvas);

        this.canvas.width = map.width;
        this.canvas.height = map.height;
        this.canvasContext = this.canvas.getContext('2d');
        this.zoom = map.zoom;
    }

    removeLayer() {
        if (!this.map) throw new Error('Map is not set');

        this.map.element.removeChild(this.canvas!);
        this.map = null;
        this.canvas = null;
        this.canvasContext = null;
    }
}