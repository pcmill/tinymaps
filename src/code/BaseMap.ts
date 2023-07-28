import { TMapOptions } from "../models/MapOptions";
import { Bounds } from "./Bounds";
import { Layer } from "./Layer";
import { LatLon } from "./LatLon";
import { XY } from "./XY";

/**
 * Responsible for translating latlon to pixel values.
 * Maintains the list of layers.
 */
export class BaseMap {
    _center: LatLon;
    _zoom: number;
    _mapBounds: Bounds;
    _element: HTMLElement;

    layers: Layer[] = [];
    _width: number;
    _height: number;
    _radius = 6378137;

    constructor(mapOptions: TMapOptions) {
        if (!mapOptions.elementId) {
            throw new Error("Element ID is required");
        }

        if (!mapOptions.center) {
            throw new Error("Center is required");
        }

        if (!mapOptions.zoom) {
            throw new Error("Zoom is required");
        }

        this._center = mapOptions.center;
        this._zoom = mapOptions.zoom;

        const element = document.getElementById(mapOptions.elementId);

        if (!element) {
            throw new Error("Element not found");
        }

        this._width = element.clientWidth;
        this._height = element.clientHeight;

        this._mapBounds = this.calculateBounds();
        this._element = element;
    }

    // Calculate bounds based on center and zoom and on size of element
    private calculateBounds() {
        const degreePerPixelX = 360 / (256 * Math.pow(2, this._zoom));
        const degreePerPixelY = 180 / (256 * Math.pow(2, this._zoom));

        const halfWidth = this._width / 2 * degreePerPixelX;
        const halfHeight = this._height / 2 * degreePerPixelY;

        const topLeft = new LatLon(this._center.latitude + halfHeight, this._center.longitude - halfWidth);
        const bottomRight = new LatLon(this._center.latitude - halfHeight, this._center.longitude + halfWidth);
        const bounds = new Bounds(topLeft, bottomRight);

        return bounds;
    }

    get zoom(): number {
        return this._zoom;
    }

    get center(): LatLon {
        return this._center;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get element(): HTMLElement {
        return this._element;
    }

    get bounds(): Bounds {
        return this._mapBounds;
    }

    // Adding a layer to the map
    add(layer: Layer) {
        layer.setMap(this);

        this.layers.push(layer);
    }

    degreesToRadians(degrees: number) {
        return (degrees * Math.PI) / 180;
    }

    latlonToWorldCoordinates(latlon: LatLon): Array<number> {
        const D = Math.PI / 180;
        const MAX_LATITUDE = 85.0511287798;

        let latitude = latlon.latitude;
        let longitude = latlon.longitude;

        // Clamp latitude to the range [-85.0511, 85.0511]
        latitude = Math.max(Math.min(latitude, MAX_LATITUDE), -MAX_LATITUDE);
        const sin = Math.sin(latitude * D);

        const worldX = this._radius * longitude * D;
        const worldY = this._radius * Math.log((1 + sin) / (1 - sin)) / 2;

        // Return the pixel coordinates as TXY
        return [worldX, worldY];
    }

    worldCoordinatesToPixelCoordinates(worldCoordinates: Array<number>): Array<number> {
        // Convert the map bounds to world coordinates
        const topLeftWorld = this.latlonToWorldCoordinates(this._mapBounds.topLeft);
        const bottomRightWorld = this.latlonToWorldCoordinates(this._mapBounds.bottomRight);

        // Calculate the scales based on the map canvas size and the converted world bounds
        const scaleX = this._width / (bottomRightWorld[0] - topLeftWorld[0]);
        const scaleY = this._height / (bottomRightWorld[1] - topLeftWorld[1]);

        // Convert the world coordinates to pixel coordinates
        const pixelX = (worldCoordinates[0] - topLeftWorld[0]) * scaleX;
        const pixelY = (topLeftWorld[1] - worldCoordinates[1]) * scaleY;

        console.log(pixelX, pixelY);

        return [pixelX, pixelY];
    }

    latlonToPixelCoordinates(latlon: LatLon): XY {
        const worldCoordinates = this.latlonToWorldCoordinates(latlon);
        const pixelCoordinates = this.worldCoordinatesToPixelCoordinates(worldCoordinates);

        return new XY(pixelCoordinates[0], pixelCoordinates[1]);
    }
}