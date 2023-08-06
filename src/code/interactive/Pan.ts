import { Map } from "../Map";
import { Point } from "../Point";
import { Interactive } from "./Interactive";

export class Pan extends Interactive {
    map: Map | null;
    mapRect: DOMRect | null;
    resolution: number;
    isPanning: boolean;
    lastMousePos: Point | null;

    constructor() {
        super();
        this.map = null;
        this.mapRect = null;
        this.resolution = 0;
        this.isPanning = false;
        this.lastMousePos = null;

        // Bind the event handlers
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.handleOutside = this.handleOutside.bind(this);
    }

    setMap(map: Map) {
        this.map = map;
        this.mapRect = this.map!.element.getBoundingClientRect();
        this.resolution = this.map!.calculateResolution();

        if (this.map) {
            this.map!.element.addEventListener("mousedown", this.mouseDown);
        }
    }

    /**
     * Makes sure that if the mousedown event extends to outside the 
     * map element, the mouseup event is still captured.
     * @param event 
     */
    private handleOutside(event: MouseEvent) {
        if (this.isPanning) {
            this.mouseUp(event);
        }

        document.removeEventListener("mouseup", this.handleOutside);
    }

    private mouseDown(event: MouseEvent) {
        event.preventDefault();

        this.isPanning = true;
        this.lastMousePos = new Point(event.clientX - this.mapRect!.left, event.clientY - this.mapRect!.top);

        this.map!.element.addEventListener("mousemove", this.mouseMove);
        this.map!.element.addEventListener("mouseup", this.mouseUp);
        document.addEventListener("mouseup", this.handleOutside);
    }

    private mouseMove(event: MouseEvent) {
        event.preventDefault();

        if (this.isPanning && this.lastMousePos) {
            const currentMousePos = new Point(event.clientX - this.mapRect!.left, event.clientY - this.mapRect!.top);
            const delta = new Point(
                (this.lastMousePos.x - currentMousePos.x) * this.resolution,
                (this.lastMousePos.y - currentMousePos.y) * this.resolution
            );

            this.map!.centerWorld = new Point(
                this.map!.centerWorld.x + delta.x,
                this.map!.centerWorld.y - delta.y
            );

            this.lastMousePos = currentMousePos;
        }
    }

    private mouseUp(event: MouseEvent) {
        event.preventDefault();
        this.isPanning = false;

        this.map!.element.removeEventListener("mouseup", this.mouseUp);
        this.map!.element.removeEventListener("mousemove", this.mouseMove);
    }
}