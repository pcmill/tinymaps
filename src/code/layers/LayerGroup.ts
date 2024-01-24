import { Layer } from "./Layer";

export class LayerGroup {
    layers: Layer[];

    constructor() {
        this.layers = [];
    }

    addLayer(layer: Layer) {
        this.layers.push(layer);
    }

    removeLayer(layer: Layer) {
        const index = this.layers.findIndex(l => l.id === layer.id);

        if (index > -1) {
            this.layers.splice(index, 1);
            layer.removeLayer();
        }
    }

    removeLayers() {
        this.layers.forEach(layer => layer.removeLayer());

        this.layers = [];
    }
}