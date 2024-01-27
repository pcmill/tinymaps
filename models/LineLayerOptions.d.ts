import { LatLon } from "../main";
export type LineLayerOptions = {
    id: string;
    fillColor?: string;
    width?: number;
    coordinates?: LineCoordinate[];
};
export type LineCoordinate = {
    center: LatLon;
};
