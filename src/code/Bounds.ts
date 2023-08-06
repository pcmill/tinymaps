import { Point } from "./Point";

export class Bounds {
    topLeft: Point;
    bottomRight: Point;

    constructor(topLeft: Point, bottomRight: Point) {
        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }
}