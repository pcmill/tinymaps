import { Map } from "../Map";
import { Interactive } from "./Interactive";

export class Attribution implements Interactive {
    map: Map | null;
    attribution: HTMLElement | null;

    constructor(attribution: string) {
        this.attribution = document.createElement("div");
        this.attribution.className = "attribution";
        this.attribution.innerHTML = attribution;

        this.attribution.style.position = "absolute";
        this.attribution.style.bottom = "0";
        this.attribution.style.right = "0";
        this.attribution.style.zIndex = "1000";

        this.map = null;
    }

    setMap(map: Map) {
        this.map = map;

        if (this.map && this.attribution) {
            map.element.appendChild(this.attribution);
        }
    }

    removeAttribution(map: Map) {
        if (this.map && this.attribution) {
            map.element.removeChild(this.attribution!);
        }

        this.map = null;
        this.attribution = null;
    }

    updateAttribution(attribution: string) {
        if (!this.attribution) {
            return;
        }

        this.attribution.innerHTML = attribution;
    }
}