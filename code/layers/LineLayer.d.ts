import { LineCoordinate, LineLayerOptions } from '../../models/LineLayerOptions';
import { Map } from '../Map';
import { Layer } from './Layer';

export declare class LineLayer extends Layer {
    _coordinates: LineCoordinate[];
    _width: number;
    _fillColor: string;
    constructor(lineLayerOptions: LineLayerOptions);
    addLayer(map: Map): void;
    update(): void;
    private drawLayers;
    private drawLine;
}
