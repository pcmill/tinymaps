import { LatLon } from "./LatLon";

export class Bounds {
    topLeft: LatLon;
    bottomRight: LatLon;

    constructor(topLeft: LatLon, bottomRight: LatLon) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }
}