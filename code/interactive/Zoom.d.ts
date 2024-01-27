import { ZoomOptions } from "../../models/ZoomOptions";
import { Map } from "../Map";
import { Interactive } from "./Interactive";
export declare class Zoom implements Interactive {
    map: Map | null;
    minZoom: number;
    maxZoom: number;
    constructor(options?: ZoomOptions);
    setMap(map: Map): void;
    private scroll;
}
