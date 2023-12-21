import { LatLon } from "../LatLon";
import { Point } from "../Point";
import { Projection } from "./Projection";

export class SphericalMercatorProjection extends Projection {
    /**
     * Projects a latitude and longitude to a point on a 2D plane
     * @param {LatLon} latlon
     * @returns {Point} Point
     */
    project(latlon: LatLon): Point {
        if (!latlon) throw new Error("LatLon is required in projection");

        const R = 6378137;
        const D = Math.PI / 180;
        const MAX_LATITUDE = 85.0511287798;

        // Clamp latitude to the min and max latitudes
        const latitude = Math.max(Math.min(latlon.latitude, MAX_LATITUDE), -MAX_LATITUDE);

        const sin = Math.sin(latitude * D);
        const worldX = R * latlon.longitude * D;
        const worldY = R * Math.log((1 + sin) / (1 - sin)) / 2;

        return new Point(worldX, worldY);
    }

    /**
     * Unprojects a point on a 2D plane to a latitude and longitude
     * @param {Point} point
     * @returns {LatLon} LatLon
     */
    unproject(point: Point): LatLon {
        if (!point) throw new Error("Point is required in unprojection");

        const R = 6378137;
        const D = 180 / Math.PI;

        const longitude = point.x * D / R;
        const latitude = (2 * Math.atan(Math.exp(point.y / R)) - (Math.PI / 2)) * D;

        return new LatLon(latitude, longitude);
    }
}