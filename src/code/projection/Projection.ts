import { LatLon } from "../LatLon";
import { Point } from "../Point";

export abstract class Projection {
    project(latlon: LatLon): Point {
        if (!latlon) throw new Error("LatLon is required in projection");

        return new Point(0, 0);
    }

    unproject(point: Point): LatLon {
        if (!point) throw new Error("Point is required in projection");

        return new LatLon(0, 0);
    }
}