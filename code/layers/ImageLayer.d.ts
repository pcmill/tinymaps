import { ImageLayerOptions } from '../../models/ImageLayerOptions';
import { BoundingBox } from '../BoundingBox';
import { Map } from '../Map';
import { Projection } from '../projection/Projection';
import { Layer } from './Layer';

export declare class ImageLayer extends Layer {
    _imageUrl: string;
    _imageData: HTMLImageElement | null;
    _projection: Projection | null;
    _bounds: BoundingBox | null;
    _opacity: number;
    constructor(options: ImageLayerOptions);
    addLayer(map: Map): void;
    update(): void;
    setUrl(url: string): void;
    private drawImage;
}
