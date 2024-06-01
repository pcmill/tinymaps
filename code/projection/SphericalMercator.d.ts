import { LatLon } from '../LatLon';
import { Point } from '../Point';
import { Projection } from './Projection';

export declare class SphericalMercatorProjection extends Projection {
    /**
     * Projects a latitude and longitude to a point on a 2D plane
     * @param {LatLon} latlon
     * @returns {Point} Point
     */
    project(latlon: LatLon): Point;
    /**
     * Unprojects a point on a 2D plane to a latitude and longitude
     * @param {Point} point
     * @returns {LatLon} LatLon
     */
    unproject(point: Point): LatLon;
}
