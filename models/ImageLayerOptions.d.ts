import { BoundingBox } from '../code/BoundingBox';

export type ImageLayerOptions = {
    id: string;
    imageUrl: string;
    bounds: BoundingBox;
    opacity?: number;
};
