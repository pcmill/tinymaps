import { Map } from "../Map";
import { Interactive } from "./Interactive";
export declare class Attribution implements Interactive {
    map: Map | null;
    attribution: HTMLElement | null;
    constructor(attribution: string);
    setMap(map: Map): void;
    removeAttribution(map: Map): void;
    updateAttribution(attribution: string): void;
}
