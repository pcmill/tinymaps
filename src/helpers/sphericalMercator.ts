const R = 6378137;
const MAX_LATITUDE = 85.0511287798;
const D = Math.PI / 180;

export function projectLatitude(latitude: number): number {
    const
        lat = Math.max(Math.min(MAX_LATITUDE, latitude), -MAX_LATITUDE),
        sin = Math.sin(lat * D);

    return R * Math.log((1 + sin) / (1 - sin)) / 2;
}

export function projectLongitude(longitude: number): number {
    return R * longitude * D
}