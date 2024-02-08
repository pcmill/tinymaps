import { ImageLayerOptions } from "../../models/ImageLayerOptions";
import { BoundingBox } from "../BoundingBox";
import { Map } from "../Map";
import { Projection } from "../projection/Projection";
import { Layer } from "./Layer";

export class ImageLayer extends Layer {
    _imageUrl: string;
    _imageData: HTMLImageElement | null = null;
    _projection: Projection | null = null;
    _bounds: BoundingBox | null = null;
    _opacity: number = 1;

    constructor(options: ImageLayerOptions) {
        super(options.id);

        this._imageUrl = options.imageUrl;
        this._bounds = options.bounds;
        this._opacity = options.opacity || 1;
    }

    addLayer(map: Map): void {
        super.addLayer(map);

        this._projection = map.projection;

        this._imageData = new Image();
        this._imageData.src = this._imageUrl;

        this._imageData.onload = () => {
            this.update();
        };
    }

    update(): void {
        super.update();

        this.drawImage();
    }

    setUrl(url: string): void {
        this._imageUrl = url;
        this._imageData = new Image();
        this._imageData.src = this._imageUrl;

        this._imageData.onload = () => {
            this.update();
        };
    }

    private drawImage() {
        if (!this.map) throw new Error("Map is not set");

        if (this._imageData) {
            const topLeftPoint = this._projection!.project(this._bounds!.topLeft);
            const topLeft = this.map.pointToPixel(topLeftPoint);

            const bottomRightPoint = this._projection!.project(this._bounds!.bottomRight);
            const bottomRight = this.map.pointToPixel(bottomRightPoint);

            // Set the opacity
            this.canvasContext!.globalAlpha = this._opacity;

            // Draw the image
            this.canvasContext!.drawImage(this._imageData, topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);

            // Reset the opacity
            this.canvasContext!.globalAlpha = 1;
        }
    }
}