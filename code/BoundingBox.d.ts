import { LatLon } from "./LatLon";
export declare class BoundingBox {
    _topLeft: LatLon;
    _bottomRight: LatLon;
    constructor(topLeft: LatLon, bottomRight: LatLon);
    get topLeft(): LatLon;
    get bottomRight(): LatLon;
}
