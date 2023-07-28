import { BaseMap } from "./BaseMap";

/**
 * Responsible for maintaining the canvas
 */
export class Layer {
    id: string;
    canvas: HTMLCanvasElement | null;
    canvasContext: CanvasRenderingContext2D | null;
    zoom: number;
    map: BaseMap | null;

    constructor(id: string) {
        this.map = null;
        this.id = id;
        this.zoom = 1;
        this.canvas = null;
        this.canvasContext = null;
    }

    setMap(map: BaseMap) {
        this.map = map;

        this.canvas = document.createElement('canvas');
        this.canvas.id = this.id;
        this.map.element.appendChild(this.canvas);

        this.canvas.width = map.width;
        this.canvas.height = map.height;
        this.canvasContext = this.canvas.getContext('2d');
        this.zoom = map.zoom;
    }
}