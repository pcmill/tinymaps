export class LatLon {
    latitude: number;
    longitude: number;

    constructor(latitude: number, longitude: number) {
        if (latitude < -90 || latitude > 90) {
            throw new Error("Latitude must be between -90 and 90");
        }

        if (longitude < -180 || longitude > 180) {
            throw new Error("Longitude must be between -180 and 180");
        }

        this.latitude = latitude;
        this.longitude = longitude;
    }
}