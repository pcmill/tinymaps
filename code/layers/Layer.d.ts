import { Map } from "../Map";
/**
 * Responsible for maintaining the canvas
 */
export declare class Layer {
    id: string;
    canvas: HTMLCanvasElement | null;
    canvasContext: CanvasRenderingContext2D | null;
    zoom: number;
    map: Map | null;
    constructor(id: string);
    update(): void;
    addLayer(map: Map): void;
    removeLayer(): void;
}
