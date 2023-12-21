import { LatLon } from "../main";

export type LineLayerOptions = {
    // The id of the layer
    id: string;
    fillColor?: string;
    width?: number;
    coordinates?: LineCoordinate[];
}

export type LineCoordinate = {
    center: LatLon;
}