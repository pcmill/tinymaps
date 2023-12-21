import { Point } from "./Point";

export class Bounds {
    topLeft: Point;
    bottomRight: Point;

    constructor(topLeft: Point, bottomRight: Point) {
        if (!topLeft) throw new Error("Top left point is required in bounds");
        if (!bottomRight) throw new Error("Bottom right point is required in bounds");

        if (topLeft.x > bottomRight.x) throw new Error("Top left x must be less than bottom right x");

        this.topLeft = topLeft;
        this.bottomRight = bottomRight;
    }
}