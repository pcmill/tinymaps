import { ZoomOptions } from "../../models/ZoomOptions";
import { Map } from "../Map";
import { Interactive } from "./Interactive";

export class Zoom implements Interactive {
    map: Map | null;
    minZoom: number;
    maxZoom: number;

    constructor(options?: ZoomOptions) {
        this.map = null;

        if (options) {
            if (options.minZoom && (options.minZoom < 0 || options.minZoom > 20)) {
                throw new Error("minZoom must be between 0 and 20");
            }
    
            if (options.maxZoom && (options.maxZoom < 0 || options.maxZoom > 20)) {
                throw new Error("maxZoom must be between 0 and 20");
            }
    
            if (options.minZoom && options.maxZoom && options.minZoom > options.maxZoom) {
                throw new Error("minZoom must be less than maxZoom");
            }
    
            if (options.minZoom && options.maxZoom && options.minZoom === options.maxZoom) {
                throw new Error("minZoom and maxZoom cannot be equal");
            }
        }

        this.minZoom = options && options.minZoom || 0;
        this.maxZoom = options && options.maxZoom || 20;

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

        if (event.deltaY > 0 && this.map!.zoom - 1 > this.minZoom) {
            this.map!.zoom = this.map!.zoom - 1;
        } else if (event.deltaY < 0 && this.map!.zoom + 1 < this.maxZoom) {
            this.map!.zoom = this.map!.zoom + 1;
        }
    }
}