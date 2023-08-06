import { TMapOptions } from "../models/MapOptions";
import { Bounds } from "./Bounds";
import { Layer } from "./layers/Layer";
import { LatLon } from "./LatLon";
import { Point } from "./Point";
import { Projection } from "./projection/Projection";
import { SphericalMercatorProjection } from "./projection/SphericalMercator";
import { Interactive } from "./interactive/Interactive";

/**
 * Responsible for translating latlon to pixel values.
 * Maintains the list of layers.
 */
export class Map {
    _center: Point;
    _zoom: number;
    _mapBounds: Bounds;
    _element: HTMLElement;
    _projection: Projection;

    layers: Layer[] = [];
    interactives: Interactive[] = [];
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

        if (!mapOptions.zoom || mapOptions.zoom < 0 || mapOptions.zoom > 20) {
            throw new Error("Zoom is required and should be between 0 and 20");
        }

        // TODO: Make this configurable
        this._projection = new SphericalMercatorProjection();

        this._center = this._projection.project(mapOptions.center);
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

    get projection(): Projection {
        return this._projection;
    }

    get zoom(): number {
        return this._zoom;
    }

    get center(): LatLon {
        return this._projection.unproject(this._center);
    }

    get centerWorld(): Point {
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

    set centerWorld(center: Point) {
        this._center = center;
        this._mapBounds = this.calculateBounds();

        for (const layer of this.layers) {
            layer.update();
        }
    }

    set center(center: LatLon) {
        this._center = this._projection.project(center);
        this._mapBounds = this.calculateBounds();

        for (const layer of this.layers) {
            layer.update();
        }
    }

    addAttribution(html: string) {
        const attribution = document.createElement("div");
        attribution.classList.add("attribution");
        attribution.innerHTML = html;

        this._element.appendChild(attribution);
    }

    calculateResolution(): number {
        // Define constants
        const earthRadius = 6378137; // in meters
        const mapWidth = this._width; // in pixels
        const mapHeight = this._height; // in pixels
        
        // Calculate resolution based on zoom level, map width, and map height
        const resolution = (2 * Math.PI * earthRadius) / (Math.pow(2, this._zoom) * Math.max(mapWidth, mapHeight));
        
        return resolution * 2;
    }

    // Calculate bounds based on center and zoom and on size of element
    private calculateBounds() {
        const resolution = this.calculateResolution();
        
        // Calculate half extents of the map in projected coordinates
        const halfWidth = (this._width / 2) * resolution;
        const halfHeight = (this._height / 2) * resolution;

        // Calculate bounds in projected coordinates
        const minX = this._center.x - halfWidth;
        const minY = this._center.y - halfHeight;
        const maxX = this._center.x + halfWidth;
        const maxY = this._center.y + halfHeight;

        return new Bounds(new Point(minX, maxY), new Point(maxX, minY));
    }

    // Adding a layer to the map
    add(layer: Layer) {
        layer.setMap(this);

        this.layers.push(layer);
    }

    attach(interactive: Interactive) {
        interactive.setMap(this);

        this.interactives.push(interactive);
    }

    degreesToRadians(degrees: number) {
        return (degrees * Math.PI) / 180;
    }

    pixelToPoint(pixelCoordinates: Point): Point {
        // Convert the map bounds to world coordinates
        const topLeftWorld = this._mapBounds.topLeft;
        const bottomRightWorld = this._mapBounds.bottomRight;

        // Calculate the scales based on the map canvas size and the converted world bounds
        const scaleX = (bottomRightWorld.x - topLeftWorld.x) / this._width;
        const scaleY = (topLeftWorld.y - bottomRightWorld.y) / this._height;

        // Convert the pixel coordinates to world coordinates
        const worldX = (pixelCoordinates.x * scaleX) + topLeftWorld.x;
        const worldY = topLeftWorld.y - (pixelCoordinates.y * scaleY);

        return new Point(worldX, worldY);
    }

    pointToPixel(worldCoordinates: Point): Point {
        // Convert the map bounds to world coordinates
        const topLeftWorld = this._mapBounds.topLeft;
        const bottomRightWorld = this._mapBounds.bottomRight;

        // Calculate the scales based on the map canvas size and the converted world bounds
        const scaleX = this._width / (bottomRightWorld.x - topLeftWorld.x);
        const scaleY = this._height / (topLeftWorld.y - bottomRightWorld.y);

        // Convert the world coordinates to pixel coordinates
        const pixelX = (worldCoordinates.x - topLeftWorld.x) * scaleX;
        const pixelY = (topLeftWorld.y - worldCoordinates.y) * scaleY;

        return new Point(Math.round(pixelX), Math.round(pixelY));
    }
}