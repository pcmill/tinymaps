import { isInvalidNumber } from "../helpers/util";

export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        if (isInvalidNumber(x) || isInvalidNumber(y)) {
            throw new Error("Invalid point coordinates");
        }

        this.x = x;
        this.y = y;
    }
}