import { LatLon } from "../LatLon";
import { Point } from "../Point";

export class Projection {
    project(latlon: LatLon): Point | null {
        if (!latlon) return null;

        return new Point(0, 0);
    }

    unproject(point: Point): LatLon | null {
        if (!point) return null;

        return new LatLon(0, 0);
    }
}