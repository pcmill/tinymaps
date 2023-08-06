import { Map } from "../Map";
import { Point } from "../Point";
import { Interactive } from "./Interactive";

export class Pan extends Interactive {
    map: Map | null;
    mapRect: DOMRect | null;
    clickOrigin: Point | null;
    panOffset: Point | null;
    resolution: number | null;

    constructor() {
        super();
        this.map = null;
        this.mapRect = null;
        this.clickOrigin = null;
        this.resolution = null;
        this.panOffset = null;

        // Bind the event handlers
        this.mouseDown = this.mouseDown.bind(this);
        this.mouseMove = this.mouseMove.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
    }

    setMap(map: Map) {
        this.map = map;
        this.mapRect = this.map!.element.getBoundingClientRect();
        this.resolution = this.map!.calculateResolution();

        if (this.map) {
            this.map!.element.addEventListener("mousedown", this.mouseDown);
        }
    }

    private mouseDown(event: MouseEvent) {
        event.preventDefault();

        this.map!.element.addEventListener("mousemove", this.mouseMove);
        this.map!.element.addEventListener("mouseup", this.mouseUp);

        // Set a point to compare against when the mouse is moved
        const point = new Point(event.clientX - this.mapRect!.left, event.clientY - this.mapRect!.top);
        this.clickOrigin = this.map!.pixelToPoint(point);
        console.log(this.clickOrigin);
        
    }

    private mouseMove(event: MouseEvent) {
        event.preventDefault();

        requestAnimationFrame(() => {
            const point = new Point(event.clientX - this.mapRect!.left, event.clientY - this.mapRect!.top);

            // Calculate the difference between the click origin and the current mouse position
            const difference = new Point(
                this.clickOrigin!.x - point.x * this.resolution!,
                this.clickOrigin!.y + point.y * this.resolution!);

            // Calculate the new center of the map
            this.map!.centerWorld = difference;
        });
    }

    private mouseUp(event: MouseEvent) {
        event.preventDefault();

        this.map!.element.removeEventListener("mouseup", this.mouseUp);
        this.map!.element.removeEventListener("mousemove", this.mouseMove);
    }
}