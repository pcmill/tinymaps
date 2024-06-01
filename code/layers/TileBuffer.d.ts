import { TileBufferCollection } from '../../models/TileBufferCollection';

export declare class TileBuffer {
    _collection: TileBufferCollection[];
    _maxAmount: number;
    constructor(maxAmount?: number);
    get(id: string): TileBufferCollection | undefined;
    add(tile: TileBufferCollection): void;
    clear(): void;
}
