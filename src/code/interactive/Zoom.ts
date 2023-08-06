import { Map } from "../Map";
import { Interactive } from "./Interactive";

export class Zoom extends Interactive {
    map: Map | null;

    constructor() {
        super();
        this.map = null;

        // Bind the event handlers
        this.scroll = this.scroll.bind(this);
    }

    setMap(map: Map) {
        this.map = map;

        if (this.map) {
            this.map!.element.addEventListener("wheel", this.scroll);
        }
    }

    private scroll(event: WheelEvent) {
        event.preventDefault();

        if (event.deltaY > 0) {
            this.map!.zoom = this.map!.zoom - 1;
        } else {
            this.map!.zoom = this.map!.zoom + 1;
        }
    }
}