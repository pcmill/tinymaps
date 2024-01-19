import { TileBufferCollection } from "../../models/TileBufferCollection";

export class TileBuffer {
    _collection: TileBufferCollection[] = [];
    _maxAmount = 30;

    constructor(maxAmount = 30) {
        this._maxAmount = maxAmount;
    }

    get(id: string) {
        return this._collection.find(tile => tile.id === id);
    }

    add(tile: TileBufferCollection) {
        if (this._collection.length >= this._maxAmount) {
            this._collection.shift();
        }

        this._collection.push(tile);
    }

    clear() {
        this._collection = [];
    }
}