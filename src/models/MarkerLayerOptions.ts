import { LatLon } from "../main";

export type MarkerLayerOptions = {
    // The id of the layer
    id: string;
    markers?: Marker[];
}

export type Marker = {
    center: LatLon;
    borderColor?: string;
    fillColor?: string;
    radius?: string;
}