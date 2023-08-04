import { TMapOptions } from "../models/MapOptions";
import { Bounds } from "./Bounds";
import { Layer } from "./Layer";
import { LatLon } from "./LatLon";
import { Point } from "./Point";
import { Projection } from "./projection/Projection";
import { SphericalMercatorProjection } from "./projection/sphericalMercator";

/**
 * Responsible for translating latlon to pixel values.
 * Maintains the list of layers.
 */
export class BaseMap {
    _center: LatLon;
    _zoom: number;
    _mapBounds: Bounds;
    _element: HTMLElement;
    _projection: Projection;

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
        this._projection = new SphericalMercatorProjection();

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
        console.log(halfWidth, halfHeight);
        

        const topLeft = new LatLon(this._center.latitude + halfHeight, this._center.longitude - halfWidth);
        const bottomRight = new LatLon(this._center.latitude - halfHeight, this._center.longitude + halfWidth);

        return new Bounds(topLeft, bottomRight);
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

    worldCoordinatesToPixelCoordinates(worldCoordinates: Point): Point | null {
        // Convert the map bounds to world coordinates
        const topLeftWorld = this._projection.project(this._mapBounds.topLeft);
        const bottomRightWorld = this._projection.project(this._mapBounds.bottomRight);

        if (topLeftWorld && bottomRightWorld) {
            // Calculate the scales based on the map canvas size and the converted world bounds
            const scaleX = this._width / (bottomRightWorld.x - topLeftWorld.x);
            const scaleY = this._height / (topLeftWorld.y - bottomRightWorld.y);
    
            // Convert the world coordinates to pixel coordinates
            const pixelX = (worldCoordinates.x - topLeftWorld.x) * scaleX;
            const pixelY = (topLeftWorld.y - worldCoordinates.y) * scaleY;
    
            console.log(pixelX, pixelY);
    
            return new Point(pixelX, pixelY);
        }

        return null;
    }

    latlonToPixelCoordinates(latlon: LatLon): Point | null {
        const worldCoordinates = this._projection.project(latlon);
        if (!worldCoordinates) return null;

        const pixelCoordinates = this.worldCoordinatesToPixelCoordinates(worldCoordinates);
        if (!pixelCoordinates) return null;
        
        return new Point(pixelCoordinates.x, pixelCoordinates.y);
    }
}