import { LatLon } from "./LatLon";

export class BoundingBox {
    _topLeft: LatLon;
    _bottomRight: LatLon;

    constructor(topLeft: LatLon, bottomRight: LatLon) {
        this._topLeft = topLeft;
        this._bottomRight = bottomRight;
    }

    get topLeft(): LatLon {
        return this._topLeft;
    }

    get bottomRight(): LatLon {
        return this._bottomRight;
    }
}