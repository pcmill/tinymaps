import { LatLon } from "../main";

export type MarkerLayerOptions = {
    // The id of the layer
    id: string;
    center: LatLon;
    options?: MarkerOptions;
}

export type MarkerOptions = {
    borderColor?: string;
    fillColor?: string;
    radius?: string;
}