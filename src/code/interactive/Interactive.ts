import { Map } from "../Map";

export abstract class Interactive {
    abstract setMap(map: Map): void;
}