import { TMapOptions } from "../models/MapOptions";
import { Bounds } from "./Bounds";
import { Layer } from "./layers/Layer";
import { LatLon } from "./LatLon";
import { Point } from "./Point";
import { Projection } from "./projection/Projection";
import { Interactive } from "./interactive/Interactive";
/**
 * Responsible for translating latlon to pixel values.
 * Maintains the list of layers.
 */
export declare class Map {
    _center: Point;
    _zoom: number;
    _tileSize: number;
    _mapBounds: Bounds | null;
    _element: HTMLElement;
    _projection: Projection;
    layers: Layer[];
    interactives: Interactive[];
    _width: number;
    _height: number;
    _radius: number;
    constructor(mapOptions: TMapOptions);
    get projection(): Projection;
    get zoom(): number;
    set zoom(zoom: number);
    get center(): LatLon;
    get centerWorld(): Point;
    get width(): number;
    get height(): number;
    get element(): HTMLElement;
    get bounds(): Bounds;
    set centerWorld(center: Point);
    set center(center: LatLon);
    set tileSize(tileSize: number);
    addAttribution(html: string): void;
    calculateResolution(): number;
    calculateBounds(): void;
    add(layer: Layer): void;
    remove(layer: Layer): void;
    attach(interactive: Interactive): void;
    degreesToRadians(degrees: number): number;
    pixelToPoint(pixelCoordinates: Point): Point;
    pointToPixel(worldCoordinates: Point): Point;
}
