import { Layer } from "./Layer";
export declare class LayerGroup {
    layers: Layer[];
    constructor();
    addLayer(layer: Layer): void;
    removeLayer(layer: Layer): void;
    removeLayers(): void;
}
