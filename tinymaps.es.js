var _ = Object.defineProperty;
var f = (r, e, t) => e in r ? _(r, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : r[e] = t;
var o = (r, e, t) => (f(r, typeof e != "symbol" ? e + "" : e, t), t);
class g {
  constructor(e, t) {
    o(this, "topLeft");
    o(this, "bottomRight");
    if (!e)
      throw new Error("Top left point is required in bounds");
    if (!t)
      throw new Error("Bottom right point is required in bounds");
    if (e.x > t.x)
      throw new Error("Top left x must be less than bottom right x");
    this.topLeft = e, this.bottomRight = t;
  }
}
function d(r) {
  return r == null;
}
function u(r) {
  return typeof r != "number" || isNaN(r);
}
class l {
  constructor(e, t) {
    o(this, "x");
    o(this, "y");
    if (u(e) || u(t))
      throw new Error("Invalid point coordinates");
    this.x = e, this.y = t;
  }
}
class w {
  constructor(e, t) {
    o(this, "latitude");
    o(this, "longitude");
    if (d(e) || d(t))
      throw new Error("Latitude and longitude must be provided");
    if (u(e) || u(t))
      throw new Error("Latitude and longitude must be numbers");
    if (e < -90 || e > 90)
      throw new Error("Latitude must be between -90 and 90");
    if (t < -180 || t > 180)
      throw new Error("Longitude must be between -180 and 180");
    this.latitude = e, this.longitude = t;
  }
}
class x {
  project(e) {
    if (!e)
      throw new Error("LatLon is required in projection");
    return new l(0, 0);
  }
  unproject(e) {
    if (!e)
      throw new Error("Point is required in projection");
    return new w(0, 0);
  }
}
class b extends x {
  /**
   * Projects a latitude and longitude to a point on a 2D plane
   * @param {LatLon} latlon
   * @returns {Point} Point
   */
  project(e) {
    if (!e)
      throw new Error("LatLon is required in projection");
    const t = 6378137, i = Math.PI / 180, s = 85.0511287798, n = Math.max(Math.min(e.latitude, s), -s), a = Math.sin(n * i), h = t * e.longitude * i, c = t * Math.log((1 + a) / (1 - a)) / 2;
    return new l(h, c);
  }
  /**
   * Unprojects a point on a 2D plane to a latitude and longitude
   * @param {Point} point
   * @returns {LatLon} LatLon
   */
  unproject(e) {
    if (!e)
      throw new Error("Point is required in unprojection");
    const t = 6378137, i = 180 / Math.PI, s = e.x * i / t, n = (2 * Math.atan(Math.exp(e.y / t)) - Math.PI / 2) * i;
    return new w(n, s);
  }
}
class y {
  constructor(e) {
    o(this, "_center");
    o(this, "_zoom");
    o(this, "_mapBounds");
    o(this, "_element");
    o(this, "_projection");
    o(this, "layers", []);
    o(this, "interactives", []);
    o(this, "_width");
    o(this, "_height");
    o(this, "_radius", 6378137);
    if (!e.elementId)
      throw new Error("Element ID is required");
    if (!e.center)
      throw new Error("Center is required");
    if (!e.zoom || e.zoom < 0 || e.zoom > 20)
      throw new Error("Zoom is required and should be between 0 and 20");
    this._projection = new b(), this._center = this._projection.project(e.center), this._zoom = e.zoom;
    const t = document.getElementById(e.elementId);
    if (!t)
      throw new Error("Element not found");
    this._width = t.clientWidth, this._height = t.clientHeight, this._mapBounds = this.calculateBounds(), this._element = t;
  }
  get projection() {
    return this._projection;
  }
  get zoom() {
    return this._zoom;
  }
  set zoom(e) {
    this._zoom = e, this._mapBounds = this.calculateBounds();
    for (const t of this.layers)
      t.update();
  }
  get center() {
    return this._projection.unproject(this._center);
  }
  get centerWorld() {
    return this._center;
  }
  get width() {
    return this._width;
  }
  get height() {
    return this._height;
  }
  get element() {
    return this._element;
  }
  get bounds() {
    return this._mapBounds;
  }
  set centerWorld(e) {
    this._center = e, this._mapBounds = this.calculateBounds();
    for (const t of this.layers)
      t.update();
  }
  set center(e) {
    this._center = this._projection.project(e), this._mapBounds = this.calculateBounds();
    for (const t of this.layers)
      t.update();
  }
  addAttribution(e) {
    const t = document.createElement("div");
    t.classList.add("attribution"), t.innerHTML = e, this._element.appendChild(t);
  }
  calculateResolution() {
    const t = this._width, i = this._height;
    return 2 * Math.PI * 6378137 / (Math.pow(2, this._zoom) * Math.max(t, i)) * 2;
  }
  // Calculate bounds based on center and zoom and on size of element
  calculateBounds() {
    const e = this.calculateResolution(), t = this._width / 2 * e, i = this._height / 2 * e, s = this._center.x - t, n = this._center.y - i, a = this._center.x + t, h = this._center.y + i;
    return new g(new l(s, h), new l(a, n));
  }
  // Adding a layer to the map
  add(e) {
    e.addLayer(this), this.layers.push(e);
  }
  attach(e) {
    e.setMap(this), this.interactives.push(e);
  }
  degreesToRadians(e) {
    return e * Math.PI / 180;
  }
  pixelToPoint(e) {
    const t = this._mapBounds.topLeft, i = this._mapBounds.bottomRight, s = (i.x - t.x) / this._width, n = (t.y - i.y) / this._height, a = e.x * s + t.x, h = t.y - e.y * n;
    return new l(a, h);
  }
  pointToPixel(e) {
    const t = this._mapBounds.topLeft, i = this._mapBounds.bottomRight, s = this._width / (i.x - t.x), n = this._height / (t.y - i.y), a = (e.x - t.x) * s, h = (t.y - e.y) * n;
    return new l(Math.round(a), Math.round(h));
  }
}
class L {
  constructor(e, t) {
    o(this, "_topLeft");
    o(this, "_bottomRight");
    this._topLeft = e, this._bottomRight = t;
  }
  get topLeft() {
    return this._topLeft;
  }
  get bottomRight() {
    return this._bottomRight;
  }
}
class p {
  constructor(e) {
    o(this, "id");
    o(this, "canvas");
    o(this, "canvasContext");
    o(this, "zoom");
    o(this, "map");
    if (d(e))
      throw new Error("Layer id cannot be empty");
    this.id = e, this.zoom = 1, this.map = null, this.canvas = null, this.canvasContext = null;
  }
  update() {
    this.zoom = this.map.zoom, this.canvasContext.clearRect(0, 0, this.map.width, this.map.height);
  }
  addLayer(e) {
    if (!e)
      throw new Error("Map is required");
    this.map = e, this.canvas = document.createElement("canvas"), this.canvas.id = this.id, this.map.element.appendChild(this.canvas), this.canvas.width = e.width, this.canvas.height = e.height, this.canvasContext = this.canvas.getContext("2d"), this.zoom = e.zoom;
  }
  removeLayer() {
    if (!this.map)
      throw new Error("Map is not set");
    this.map.element.removeChild(this.canvas), this.map = null, this.canvas = null, this.canvasContext = null;
  }
}
class M {
  constructor(e = 30) {
    o(this, "_collection", []);
    o(this, "_maxAmount", 30);
    this._maxAmount = e;
  }
  get(e) {
    return this._collection.find((t) => t.id === e);
  }
  add(e) {
    this._collection.length >= this._maxAmount && this._collection.shift(), this._collection.push(e);
  }
  clear() {
    this._collection = [];
  }
}
class v extends p {
  constructor(t) {
    super(t.id);
    o(this, "_tileUrl");
    o(this, "_tileSize");
    o(this, "_attribution");
    o(this, "_tileBuffer", new M());
    this._tileSize = t.tileSize || 256, this._tileUrl = t.tileUrl, this._attribution = t.attribution || "";
  }
  addLayer(t) {
    super.addLayer(t), this.map && (this.drawTiles(), this._attribution && this.map.addAttribution(this._attribution));
  }
  removeLayer() {
    super.removeLayer(), this._tileBuffer.clear();
  }
  // TODO: purge the tileBuffer when the map is panned or zoomed
  // so the tileBuffer does not grow indefinitely
  update() {
    super.update(), this.drawTiles();
  }
  drawTiles() {
    const t = this.getTileBounds();
    for (let i = t[0]; i <= t[1]; i++)
      for (let s = t[2]; s <= t[3]; s++) {
        const n = this.getTileUrl(i, s, this.zoom);
        this.drawTile(n, i, s);
      }
  }
  // Gets the bounds of the tiles that should be loaded based on the bounds of the map and the zoom level
  getTileBounds() {
    if (!this.map)
      throw new Error("Map is not set");
    const t = Math.pow(2, this.zoom), i = Math.floor((this.map.bounds.topLeft.x + 2003750834e-2) / (2 * 2003750834e-2) * t), s = Math.floor((this.map.bounds.bottomRight.x + 2003750834e-2) / (2 * 2003750834e-2) * t), n = (Math.PI / 2 - 2 * Math.atan(Math.exp(-this.map.bounds.topLeft.y / 6378137))) * (180 / Math.PI), a = (Math.PI / 2 - 2 * Math.atan(Math.exp(-this.map.bounds.bottomRight.y / 6378137))) * (180 / Math.PI), h = Math.floor((1 - Math.log(Math.tan(n * Math.PI / 180) + 1 / Math.cos(n * Math.PI / 180)) / Math.PI) / 2 * t), c = Math.floor((1 - Math.log(Math.tan(a * Math.PI / 180) + 1 / Math.cos(a * Math.PI / 180)) / Math.PI) / 2 * t);
    return [
      Math.max(0, i),
      Math.max(0, s),
      Math.max(0, h),
      Math.max(0, c)
    ];
  }
  getTileUrl(t, i, s) {
    if (d(t) || d(i) || d(s))
      throw new Error("Invalid tile coordinates");
    return this._tileUrl.replace("{x}", t.toString()).replace("{y}", i.toString()).replace("{z}", s.toString());
  }
  tileExtend(t, i) {
    const s = 2003750834e-2, n = s / this._tileSize / 0.5 / Math.pow(2, this.zoom);
    return [
      t * this._tileSize * n - s,
      s - i * this._tileSize * n,
      (t + 1) * this._tileSize * n - s,
      s - (i + 1) * this._tileSize * n
    ];
  }
  drawTileOnCanvas(t, i, s) {
    if (!this.map || !this.canvasContext)
      return;
    const n = this.tileExtend(i, s), a = new l(n[0], n[1]), h = new l(n[2], n[3]), c = this.map.pointToPixel(a), m = this.map.pointToPixel(h);
    this.canvasContext.drawImage(t, c.x, c.y, m.x - c.x, m.y - c.y);
  }
  drawTile(t, i, s) {
    const n = this._tileBuffer.get(`${this.zoom}-${i}-${s}`);
    if (n) {
      this.drawTileOnCanvas(n.image, i, s);
      return;
    } else {
      const a = new Image();
      a.crossOrigin = "anonymous", a.src = t, a.onload = () => {
        this._tileBuffer.add({
          id: `${this.zoom}-${i}-${s}`,
          image: a
        }), this.drawTileOnCanvas(a, i, s);
      };
    }
  }
}
class E extends p {
  constructor(t) {
    super(t.id);
    o(this, "_markers", []);
    t.markers && (this._markers = t.markers);
  }
  addLayer(t) {
    super.addLayer(t), this.drawLayers();
  }
  update() {
    super.update(), this.drawLayers();
  }
  drawLayers() {
    if (this._markers)
      for (const t of this._markers)
        this.drawMarker(t);
  }
  getRadiusPixels(t) {
    if (t.endsWith("px"))
      return t = t.slice(0, -2), parseInt(t, 10);
    if (t.endsWith("m"))
      return t = t.slice(0, -1), parseInt(t, 10);
    throw new Error("Radius should end with 'px' or 'm'");
  }
  drawMarker(t) {
    const i = t.radius || "10px", s = t.fillColor || "darkblue", n = t.borderColor || "white", a = this.map.projection.project(t.center), h = this.map.pointToPixel(a), c = this.getRadiusPixels(i), m = this.canvasContext;
    m.beginPath(), m.arc(h.x, h.y, c, 0, 2 * Math.PI, !1), m.fillStyle = s, m.fill(), m.lineWidth = 5, m.strokeStyle = n, m.stroke();
  }
}
class R extends p {
  constructor(t) {
    super(t.id);
    o(this, "_imageUrl");
    o(this, "_imageData", null);
    o(this, "_projection", null);
    o(this, "_bounds", null);
    o(this, "_opacity", 1);
    this._imageUrl = t.imageUrl, this._bounds = t.bounds, this._opacity = t.opacity || 1;
  }
  addLayer(t) {
    super.addLayer(t), this._projection = t.projection, this._imageData = new Image(), this._imageData.src = this._imageUrl, this._imageData.onload = () => {
      this.update();
    };
  }
  update() {
    super.update(), this.drawImage();
  }
  drawImage() {
    if (!this.map)
      throw new Error("Map is not set");
    if (this._imageData) {
      const t = this._projection.project(this._bounds.topLeft), i = this.map.pointToPixel(t), s = this._projection.project(this._bounds.bottomRight), n = this.map.pointToPixel(s);
      this.canvasContext.globalAlpha = this._opacity, this.canvasContext.drawImage(this._imageData, i.x, i.y, n.x - i.x, n.y - i.y), this.canvasContext.globalAlpha = 1;
    }
  }
}
class C extends p {
  constructor(t) {
    super(t.id);
    o(this, "_coordinates", []);
    o(this, "_width", 2);
    o(this, "_fillColor", "black");
    t.coordinates && (this._coordinates = t.coordinates, this._width = t.width || 2, this._fillColor = t.fillColor || "black");
  }
  addLayer(t) {
    super.addLayer(t), this.drawLayers();
  }
  update() {
    super.update(), this.drawLayers();
  }
  drawLayers() {
    this._coordinates && this.drawLine(this._coordinates);
  }
  drawLine(t) {
    const i = this.canvasContext;
    i.strokeStyle = this._fillColor, i.lineWidth = this._width, i.beginPath();
    for (const s of t) {
      const n = this.map.projection.project(s.center), a = this.map.pointToPixel(n);
      i.lineTo(a.x, a.y);
    }
    i.stroke();
  }
}
class I {
  constructor() {
    o(this, "map");
    o(this, "mapRect");
    o(this, "resolution");
    o(this, "isPanning");
    o(this, "lastPointerPos");
    this.map = null, this.mapRect = null, this.resolution = 0, this.isPanning = !1, this.lastPointerPos = null, this.pointerDown = this.pointerDown.bind(this), this.pointerMove = this.pointerMove.bind(this), this.pointerUp = this.pointerUp.bind(this);
  }
  setMap(e) {
    this.map = e, this.mapRect = this.map.element.getBoundingClientRect(), this.map && this.map.element.addEventListener("pointerdown", this.pointerDown);
  }
  pointerDown(e) {
    e.preventDefault(), this.resolution = this.map.calculateResolution(), this.isPanning = !0, this.lastPointerPos = new l(e.clientX - this.mapRect.left, e.clientY - this.mapRect.top), this.map.element.setPointerCapture(e.pointerId), this.map.element.addEventListener("pointermove", this.pointerMove), this.map.element.addEventListener("pointerup", this.pointerUp);
  }
  pointerMove(e) {
    if (!this.isPanning || !this.lastPointerPos)
      return;
    e.preventDefault();
    const t = new l(e.clientX - this.mapRect.left, e.clientY - this.mapRect.top);
    this.handlePan(t);
  }
  handlePan(e) {
    const t = new l(
      (this.lastPointerPos.x - e.x) * this.resolution,
      (this.lastPointerPos.y - e.y) * this.resolution
    );
    this.map.centerWorld = new l(
      this.map.centerWorld.x + t.x,
      this.map.centerWorld.y - t.y
    ), this.lastPointerPos = e;
  }
  pointerUp(e) {
    this.isPanning && (this.isPanning = !1, this.map.element.releasePointerCapture(e.pointerId), this.map.element.removeEventListener("pointerup", this.pointerUp), this.map.element.removeEventListener("pointermove", this.pointerMove));
  }
}
class z {
  constructor(e) {
    o(this, "map");
    o(this, "minZoom");
    o(this, "maxZoom");
    if (this.map = null, e) {
      if (e.minZoom && (e.minZoom < 0 || e.minZoom > 20))
        throw new Error("minZoom must be between 0 and 20");
      if (e.maxZoom && (e.maxZoom < 0 || e.maxZoom > 20))
        throw new Error("maxZoom must be between 0 and 20");
      if (e.minZoom && e.maxZoom && e.minZoom > e.maxZoom)
        throw new Error("minZoom must be less than maxZoom");
      if (e.minZoom && e.maxZoom && e.minZoom === e.maxZoom)
        throw new Error("minZoom and maxZoom cannot be equal");
    }
    this.minZoom = e && e.minZoom || 0, this.maxZoom = e && e.maxZoom || 20, this.scroll = this.scroll.bind(this);
  }
  setMap(e) {
    this.map = e, this.map && this.map.element.addEventListener("wheel", this.scroll);
  }
  scroll(e) {
    e.preventDefault();
    const t = e.deltaY > 0 ? -1 : 1, i = this.map.zoom + t;
    i >= this.minZoom && i <= this.maxZoom && (this.map.zoom = i);
  }
}
export {
  L as BoundingBox,
  R as ImageLayer,
  w as LatLon,
  C as LineLayer,
  y as Map,
  E as MarkerLayer,
  I as Pan,
  l as Point,
  v as TileLayer,
  z as Zoom
};
