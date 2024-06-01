import { LatLon } from '../LatLon';
import { Point } from '../Point';

export declare abstract class Projection {
    project(latlon: LatLon): Point;
    unproject(point: Point): LatLon;
}
