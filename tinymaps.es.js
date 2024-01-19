var f = Object.defineProperty;
var _ = (a, t, e) => t in a ? f(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var o = (a, t, e) => (_(a, typeof t != "symbol" ? t + "" : t, e), e);
class x {
  constructor(t, e) {
    o(this, "topLeft");
    o(this, "bottomRight");
    if (!t)
      throw new Error("Top left point is required in bounds");
    if (!e)
      throw new Error("Bottom right point is required in bounds");
    if (t.x > e.x)
      throw new Error("Top left x must be less than bottom right x");
    this.topLeft = t, this.bottomRight = e;
  }
}
function d(a) {
  return a == null;
}
function u(a) {
  return typeof a != "number" || isNaN(a);
}
class l {
  constructor(t, e) {
    o(this, "x");
    o(this, "y");
    if (u(t) || u(e))
      throw new Error("Invalid point coordinates");
    this.x = t, this.y = e;
  }
}
class w {
  constructor(t, e) {
    o(this, "latitude");
    o(this, "longitude");
    if (d(t) || d(e))
      throw new Error("Latitude and longitude must be provided");
    if (u(t) || u(e))
      throw new Error("Latitude and longitude must be numbers");
    if (t < -90 || t > 90)
      throw new Error("Latitude must be between -90 and 90");
    if (e < -180 || e > 180)
      throw new Error("Longitude must be between -180 and 180");
    this.latitude = t, this.longitude = e;
  }
}
class g {
  project(t) {
    if (!t)
      throw new Error("LatLon is required in projection");
    return new l(0, 0);
  }
  unproject(t) {
    if (!t)
      throw new Error("Point is required in projection");
    return new w(0, 0);
  }
}
class M extends g {
  /**
   * Projects a latitude and longitude to a point on a 2D plane
   * @param {LatLon} latlon
   * @returns {Point} Point
   */
  project(t) {
    if (!t)
      throw new Error("LatLon is required in projection");
    const e = 6378137, i = Math.PI / 180, s = 85.0511287798, n = Math.max(Math.min(t.latitude, s), -s), r = Math.sin(n * i), h = e * t.longitude * i, c = e * Math.log((1 + r) / (1 - r)) / 2;
    return new l(h, c);
  }
  /**
   * Unprojects a point on a 2D plane to a latitude and longitude
   * @param {Point} point
   * @returns {LatLon} LatLon
   */
  unproject(t) {
    if (!t)
      throw new Error("Point is required in unprojection");
    const e = 6378137, i = 180 / Math.PI, s = t.x * i / e, n = (2 * Math.atan(Math.exp(t.y / e)) - Math.PI / 2) * i;
    return new w(n, s);
  }
}
class y {
  constructor(t) {
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
    if (!t.elementId)
      throw new Error("Element ID is required");
    if (!t.center)
      throw new Error("Center is required");
    if (!t.zoom || t.zoom < 0 || t.zoom > 20)
      throw new Error("Zoom is required and should be between 0 and 20");
    this._projection = new M(), this._center = this._projection.project(t.center), this._zoom = t.zoom;
    const e = document.getElementById(t.elementId);
    if (!e)
      throw new Error("Element not found");
    this._width = e.clientWidth, this._height = e.clientHeight, this._mapBounds = this.calculateBounds(), this._element = e;
  }
  get projection() {
    return this._projection;
  }
  get zoom() {
    return this._zoom;
  }
  set zoom(t) {
    this._zoom = t, this._mapBounds = this.calculateBounds();
    for (const e of this.layers)
      e.update();
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
  set centerWorld(t) {
    this._center = t, this._mapBounds = this.calculateBounds();
    for (const e of this.layers)
      e.update();
  }
  set center(t) {
    this._center = this._projection.project(t), this._mapBounds = this.calculateBounds();
    for (const e of this.layers)
      e.update();
  }
  addAttribution(t) {
    const e = document.createElement("div");
    e.classList.add("attribution"), e.innerHTML = t, this._element.appendChild(e);
  }
  calculateResolution() {
    const e = this._width, i = this._height;
    return 2 * Math.PI * 6378137 / (Math.pow(2, this._zoom) * Math.max(e, i)) * 2;
  }
  // Calculate bounds based on center and zoom and on size of element
  calculateBounds() {
    const t = this.calculateResolution(), e = this._width / 2 * t, i = this._height / 2 * t, s = this._center.x - e, n = this._center.y - i, r = this._center.x + e, h = this._center.y + i;
    return new x(new l(s, h), new l(r, n));
  }
  // Adding a layer to the map
  add(t) {
    t.addLayer(this), this.layers.push(t);
  }
  attach(t) {
    t.setMap(this), this.interactives.push(t);
  }
  degreesToRadians(t) {
    return t * Math.PI / 180;
  }
  pixelToPoint(t) {
    const e = this._mapBounds.topLeft, i = this._mapBounds.bottomRight, s = (i.x - e.x) / this._width, n = (e.y - i.y) / this._height, r = t.x * s + e.x, h = e.y - t.y * n;
    return new l(r, h);
  }
  pointToPixel(t) {
    const e = this._mapBounds.topLeft, i = this._mapBounds.bottomRight, s = this._width / (i.x - e.x), n = this._height / (e.y - i.y), r = (t.x - e.x) * s, h = (e.y - t.y) * n;
    return new l(Math.round(r), Math.round(h));
  }
}
class p {
  constructor(t) {
    o(this, "id");
    o(this, "canvas");
    o(this, "canvasContext");
    o(this, "zoom");
    o(this, "map");
    if (d(t))
      throw new Error("Layer id cannot be empty");
    this.id = t, this.zoom = 1, this.map = null, this.canvas = null, this.canvasContext = null;
  }
  update() {
    this.zoom = this.map.zoom, this.canvasContext.clearRect(0, 0, this.map.width, this.map.height);
  }
  addLayer(t) {
    if (!t)
      throw new Error("Map is required");
    this.map = t, this.canvas = document.createElement("canvas"), this.canvas.id = this.id, this.map.element.appendChild(this.canvas), this.canvas.width = t.width, this.canvas.height = t.height, this.canvasContext = this.canvas.getContext("2d"), this.zoom = t.zoom;
  }
  removeLayer() {
    if (!this.map)
      throw new Error("Map is not set");
    this.map.element.removeChild(this.canvas), this.map = null, this.canvas = null, this.canvasContext = null;
  }
}
class P {
  constructor(t = 30) {
    o(this, "_collection", []);
    o(this, "_maxAmount", 30);
    this._maxAmount = t;
  }
  get(t) {
    return this._collection.find((e) => e.id === t);
  }
  add(t) {
    this._collection.length >= this._maxAmount && this._collection.shift(), this._collection.push(t);
  }
  clear() {
    this._collection = [];
  }
}
class L extends p {
  constructor(e) {
    super(e.id);
    o(this, "_tileUrl");
    o(this, "_tileSize");
    o(this, "_attribution");
    o(this, "_tileBuffer", new P());
    this._tileSize = e.tileSize || 256, this._tileUrl = e.tileUrl, this._attribution = e.attribution || "";
  }
  addLayer(e) {
    super.addLayer(e), this.map && (this.drawTiles(), this._attribution && this.map.addAttribution(this._attribution));
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
    const e = this.getTileBounds();
    for (let i = e[0]; i <= e[1]; i++)
      for (let s = e[2]; s <= e[3]; s++) {
        const n = this.getTileUrl(i, s, this.zoom);
        this.drawTile(n, i, s);
      }
  }
  // Gets the bounds of the tiles that should be loaded based on the bounds of the map and the zoom level
  getTileBounds() {
    if (!this.map)
      throw new Error("Map is not set");
    const e = Math.pow(2, this.zoom), i = Math.floor((this.map.bounds.topLeft.x + 2003750834e-2) / (2 * 2003750834e-2) * e), s = Math.floor((this.map.bounds.bottomRight.x + 2003750834e-2) / (2 * 2003750834e-2) * e), n = (Math.PI / 2 - 2 * Math.atan(Math.exp(-this.map.bounds.topLeft.y / 6378137))) * (180 / Math.PI), r = (Math.PI / 2 - 2 * Math.atan(Math.exp(-this.map.bounds.bottomRight.y / 6378137))) * (180 / Math.PI), h = Math.floor((1 - Math.log(Math.tan(n * Math.PI / 180) + 1 / Math.cos(n * Math.PI / 180)) / Math.PI) / 2 * e), c = Math.floor((1 - Math.log(Math.tan(r * Math.PI / 180) + 1 / Math.cos(r * Math.PI / 180)) / Math.PI) / 2 * e);
    return [
      Math.max(0, i),
      Math.max(0, s),
      Math.max(0, h),
      Math.max(0, c)
    ];
  }
  getTileUrl(e, i, s) {
    if (d(e) || d(i) || d(s))
      throw new Error("Invalid tile coordinates");
    return this._tileUrl.replace("{x}", e.toString()).replace("{y}", i.toString()).replace("{z}", s.toString());
  }
  tileExtend(e, i) {
    const s = 2003750834e-2, n = s / this._tileSize / 0.5 / Math.pow(2, this.zoom);
    return [
      e * this._tileSize * n - s,
      s - i * this._tileSize * n,
      (e + 1) * this._tileSize * n - s,
      s - (i + 1) * this._tileSize * n
    ];
  }
  drawTileOnCanvas(e, i, s) {
    if (!this.map || !this.canvasContext)
      return;
    const n = this.tileExtend(i, s), r = new l(n[0], n[1]), h = new l(n[2], n[3]), c = this.map.pointToPixel(r), m = this.map.pointToPixel(h);
    this.canvasContext.drawImage(e, c.x, c.y, m.x - c.x, m.y - c.y);
  }
  drawTile(e, i, s) {
    const n = this._tileBuffer.get(`${this.zoom}-${i}-${s}`);
    if (n) {
      this.drawTileOnCanvas(n.image, i, s);
      return;
    } else {
      const r = new Image();
      r.crossOrigin = "anonymous", r.src = e, r.onload = () => {
        this._tileBuffer.add({
          id: `${this.zoom}-${i}-${s}`,
          image: r
        }), this.drawTileOnCanvas(r, i, s);
      };
    }
  }
}
class v extends p {
  constructor(e) {
    super(e.id);
    o(this, "_markers", []);
    e.markers && (this._markers = e.markers);
  }
  addLayer(e) {
    super.addLayer(e), this.drawLayers();
  }
  update() {
    super.update(), this.drawLayers();
  }
  drawLayers() {
    if (this._markers)
      for (const e of this._markers)
        this.drawMarker(e);
  }
  getRadiusPixels(e) {
    if (e.endsWith("px"))
      return e = e.slice(0, -2), parseInt(e, 10);
    if (e.endsWith("m"))
      return e = e.slice(0, -1), parseInt(e, 10);
    throw new Error("Radius should end with 'px' or 'm'");
  }
  drawMarker(e) {
    const i = e.radius || "10px", s = e.fillColor || "darkblue", n = e.borderColor || "white", r = this.map.projection.project(e.center), h = this.map.pointToPixel(r), c = this.getRadiusPixels(i), m = this.canvasContext;
    m.beginPath(), m.arc(h.x, h.y, c, 0, 2 * Math.PI, !1), m.fillStyle = s, m.fill(), m.lineWidth = 5, m.strokeStyle = n, m.stroke();
  }
}
class E extends p {
  constructor(e) {
    super(e.id);
    o(this, "_coordinates", []);
    o(this, "_width", 2);
    o(this, "_fillColor", "black");
    e.coordinates && (this._coordinates = e.coordinates, this._width = e.width || 2, this._fillColor = e.fillColor || "black");
  }
  addLayer(e) {
    super.addLayer(e), this.drawLayers();
  }
  update() {
    super.update(), this.drawLayers();
  }
  drawLayers() {
    this._coordinates && this.drawLine(this._coordinates);
  }
  drawLine(e) {
    const i = this.canvasContext;
    i.strokeStyle = this._fillColor, i.lineWidth = this._width, i.beginPath();
    for (const s of e) {
      const n = this.map.projection.project(s.center), r = this.map.pointToPixel(n);
      i.lineTo(r.x, r.y);
    }
    i.stroke();
  }
}
class z {
  constructor() {
    o(this, "map");
    o(this, "mapRect");
    o(this, "resolution");
    o(this, "isPanning");
    o(this, "lastPointerPos");
    this.map = null, this.mapRect = null, this.resolution = 0, this.isPanning = !1, this.lastPointerPos = null, this.pointerDown = this.pointerDown.bind(this), this.pointerMove = this.pointerMove.bind(this), this.pointerUp = this.pointerUp.bind(this);
  }
  setMap(t) {
    this.map = t, this.mapRect = this.map.element.getBoundingClientRect(), this.map && this.map.element.addEventListener("pointerdown", this.pointerDown);
  }
  pointerDown(t) {
    t.preventDefault(), this.resolution = this.map.calculateResolution(), this.isPanning = !0, this.lastPointerPos = new l(t.clientX - this.mapRect.left, t.clientY - this.mapRect.top), this.map.element.setPointerCapture(t.pointerId), this.map.element.addEventListener("pointermove", this.pointerMove), this.map.element.addEventListener("pointerup", this.pointerUp);
  }
  pointerMove(t) {
    if (!this.isPanning || !this.lastPointerPos)
      return;
    t.preventDefault();
    const e = new l(t.clientX - this.mapRect.left, t.clientY - this.mapRect.top);
    this.handlePan(e);
  }
  handlePan(t) {
    const e = new l(
      (this.lastPointerPos.x - t.x) * this.resolution,
      (this.lastPointerPos.y - t.y) * this.resolution
    );
    this.map.centerWorld = new l(
      this.map.centerWorld.x + e.x,
      this.map.centerWorld.y - e.y
    ), this.lastPointerPos = t;
  }
  pointerUp(t) {
    this.isPanning && (this.isPanning = !1, this.map.element.releasePointerCapture(t.pointerId), this.map.element.removeEventListener("pointerup", this.pointerUp), this.map.element.removeEventListener("pointermove", this.pointerMove));
  }
}
class C {
  constructor(t) {
    o(this, "map");
    o(this, "minZoom");
    o(this, "maxZoom");
    if (this.map = null, t) {
      if (t.minZoom && (t.minZoom < 0 || t.minZoom > 20))
        throw new Error("minZoom must be between 0 and 20");
      if (t.maxZoom && (t.maxZoom < 0 || t.maxZoom > 20))
        throw new Error("maxZoom must be between 0 and 20");
      if (t.minZoom && t.maxZoom && t.minZoom > t.maxZoom)
        throw new Error("minZoom must be less than maxZoom");
      if (t.minZoom && t.maxZoom && t.minZoom === t.maxZoom)
        throw new Error("minZoom and maxZoom cannot be equal");
    }
    this.minZoom = t && t.minZoom || 0, this.maxZoom = t && t.maxZoom || 20, this.scroll = this.scroll.bind(this);
  }
  setMap(t) {
    this.map = t, this.map && this.map.element.addEventListener("wheel", this.scroll);
  }
  scroll(t) {
    t.preventDefault();
    const e = t.deltaY > 0 ? -1 : 1, i = this.map.zoom + e;
    i >= this.minZoom && i <= this.maxZoom && (this.map.zoom = i);
  }
}
export {
  w as LatLon,
  E as LineLayer,
  y as Map,
  v as MarkerLayer,
  z as Pan,
  l as Point,
  L as TileLayer,
  C as Zoom
};
