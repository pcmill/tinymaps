import { MarkerLayerOptions, MarkerOptions } from '../../models/MarkerLayerOptions';
import { LatLon } from '../LatLon';
import { Map } from '../Map';
import { Layer } from './Layer';

export declare class MarkerLayer extends Layer {
    _center: LatLon | null;
    _options: MarkerOptions | null;
    constructor(markerLayerOptions: MarkerLayerOptions);
    addLayer(map: Map): void;
    update(): void;
    private getRadiusPixels;
    private drawMarker;
}
