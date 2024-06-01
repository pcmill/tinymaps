import { Map } from "../Map";
import { Point } from "../Point";
import { Interactive } from "./Interactive";

export class Pan implements Interactive {
    map: Map | null;
    mapRect: DOMRect | null;
    resolution: number;
    isPanning: boolean;
    lastPointerPos: Point | null;

    constructor() {
        this.map = null;
        this.mapRect = null;
        this.resolution = 0;
        this.isPanning = false;
        this.lastPointerPos = null;

        // Bind the event handlers
        this.pointerDown = this.pointerDown.bind(this);
        this.pointerMove = this.pointerMove.bind(this);
        this.pointerUp = this.pointerUp.bind(this);
        this.touchStart = this.touchStart.bind(this);
        this.touchMove = this.touchMove.bind(this);
        this.touchEnd = this.touchEnd.bind(this);
    }

    setMap(map: Map) {
        this.map = map;
        this.mapRect = this.map!.element.getBoundingClientRect();

        if (this.map) {
            this.map!.element.addEventListener("pointerdown", this.pointerDown);
            this.map!.element.addEventListener("touchstart", this.touchStart);
        }
    }

    private pointerDown(event: PointerEvent) {
        event.preventDefault();

        this.resolution = this.map!.calculateResolution();
        this.isPanning = true;
        this.lastPointerPos = new Point(event.clientX - this.mapRect!.left, event.clientY - this.mapRect!.top);

        this.map!.element.setPointerCapture(event.pointerId);
        this.map!.element.addEventListener("pointermove", this.pointerMove);
        this.map!.element.addEventListener("pointerup", this.pointerUp);
    }

    private pointerMove(event: PointerEvent) {
        if (!this.isPanning || !this.lastPointerPos) {
            return;
        }

        event.preventDefault();

        const currentPointerPos = new Point(event.clientX - this.mapRect!.left, event.clientY - this.mapRect!.top);
        this.handlePan(currentPointerPos);
    }

    private handlePan(currentPos: Point) {
        const delta = new Point(
            (this.lastPointerPos!.x - currentPos.x) * this.resolution,
            (this.lastPointerPos!.y - currentPos.y) * this.resolution
        );

        this.map!.centerWorld = new Point(
            this.map!.centerWorld.x + delta.x,
            this.map!.centerWorld.y - delta.y
        );

        this.lastPointerPos = currentPos;
    }

    private pointerUp(event: PointerEvent) {
        if (!this.isPanning) {
            return;
        }

        this.isPanning = false;

        this.map!.element.releasePointerCapture(event.pointerId);
        this.map!.element.removeEventListener("pointerup", this.pointerUp);
        this.map!.element.removeEventListener("pointermove", this.pointerMove);
    }

    private touchStart(event: TouchEvent) {
        event.preventDefault();

        if (event.touches.length === 1) {
            this.resolution = this.map!.calculateResolution();
            this.isPanning = true;
            const touch = event.touches[0];
            this.lastPointerPos = new Point(touch.clientX - this.mapRect!.left, touch.clientY - this.mapRect!.top);

            this.map!.element.addEventListener("touchmove", this.touchMove);
            this.map!.element.addEventListener("touchend", this.touchEnd);
            this.map!.element.addEventListener("touchcancel", this.touchEnd);
        }
    }

    private touchMove(event: TouchEvent) {
        if (!this.isPanning || !this.lastPointerPos || event.touches.length > 1) {
            return;
        }

        event.preventDefault();

        const touch = event.touches[0];
        const currentPointerPos = new Point(touch.clientX - this.mapRect!.left, touch.clientY - this.mapRect!.top);
        this.handlePan(currentPointerPos);
    }

    private touchEnd(event: TouchEvent) {
        if (!this.isPanning) {
            return;
        }

        this.isPanning = false;

        this.map!.element.removeEventListener("touchend", this.touchEnd);
        this.map!.element.removeEventListener("touchmove", this.touchMove);
        this.map!.element.removeEventListener("touchcancel", this.touchEnd);
    }
}
