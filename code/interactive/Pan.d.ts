import { Map } from '../Map';
import { Point } from '../Point';
import { Interactive } from './Interactive';

export declare class Pan implements Interactive {
    map: Map | null;
    mapRect: DOMRect | null;
    resolution: number;
    isPanning: boolean;
    lastPointerPos: Point | null;
    constructor();
    setMap(map: Map): void;
    private pointerDown;
    private pointerMove;
    private handlePan;
    private pointerUp;
    private touchStart;
    private touchMove;
    private touchEnd;
}
