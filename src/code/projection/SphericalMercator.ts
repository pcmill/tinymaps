import { LatLon } from "../LatLon";
import { Point } from "../Point";
import { Projection } from "./Projection";

export class SphericalMercatorProjection extends Projection {
    project(latlon: LatLon): Point | null {
        if (!latlon) return null;

        const R = 6378137;
        const D = Math.PI / 180;
        const MAX_LATITUDE = 85.0511287798;
    
        // Clamp latitude to the min and max latitudes
        const latitude = Math.max(Math.min(latlon.latitude, MAX_LATITUDE), -MAX_LATITUDE);
    
        const sin = Math.sin(latitude * D);
        const worldX = R * latlon.longitude * D;
        const worldY = R * Math.log((1 + sin) / (1 - sin)) / 2;
    
        // Return the pixel coordinates as TXY
        return new Point(worldX, worldY);
    }

    unproject(point: Point): LatLon | null {
        if (!point) return null;

        const R = 6378137;
        const D = 180 / Math.PI;
    
        const longitude = point.x * D / R;
        const latitude = (2 * Math.atan(Math.exp(point.y / R)) - (Math.PI / 2)) * D;
    
        return new LatLon(latitude, longitude);
    }
}