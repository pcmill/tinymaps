import { TileLayerOptions } from '../../models/TileLayerOptions';
import { Map } from '../Map';
import { Layer } from './Layer';
import { TileBuffer } from './TileBuffer';

export declare class TileLayer extends Layer {
    _tileUrl: string;
    _tileSize: number;
    _tileBuffer: TileBuffer;
    constructor(tileLayerOptions: TileLayerOptions);
    addLayer(map: Map): void;
    removeLayer(): void;
    update(): void;
    private drawTiles;
    private getTileBounds;
    private getTileUrl;
    private tileExtend;
    private drawTileOnCanvas;
    private drawTile;
}
