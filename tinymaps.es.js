var f = Object.defineProperty;
var x = (a, t, e) => t in a ? f(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var s = (a, t, e) => (x(a, typeof t != "symbol" ? t + "" : t, e), e);
class _ {
  constructor(t, e) {
    s(this, "topLeft");
    s(this, "bottomRight");
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
    s(this, "x");
    s(this, "y");
    if (u(t) || u(e))
      throw new Error("Invalid point coordinates");
    this.x = t, this.y = e;
  }
}
class p {
  constructor(t, e) {
    s(this, "latitude");
    s(this, "longitude");
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
    return new p(0, 0);
  }
}
class M extends g {
  project(t) {
    if (!t)
      throw new Error("LatLon is required in projection");
    const e = 6378137, i = Math.PI / 180, o = 85.0511287798, n = Math.max(Math.min(t.latitude, o), -o), r = Math.sin(n * i), h = e * t.longitude * i, c = e * Math.log((1 + r) / (1 - r)) / 2;
    return new l(h, c);
  }
  unproject(t) {
    if (!t)
      throw new Error("Point is required in unprojection");
    const e = 6378137, i = 180 / Math.PI, o = t.x * i / e, n = (2 * Math.atan(Math.exp(t.y / e)) - Math.PI / 2) * i;
    return new p(n, o);
  }
}
class b {
  constructor(t) {
    s(this, "_center");
    s(this, "_zoom");
    s(this, "_mapBounds");
    s(this, "_element");
    s(this, "_projection");
    s(this, "layers", []);
    s(this, "interactives", []);
    s(this, "_width");
    s(this, "_height");
    s(this, "_radius", 6378137);
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
    const t = this.calculateResolution(), e = this._width / 2 * t, i = this._height / 2 * t, o = this._center.x - e, n = this._center.y - i, r = this._center.x + e, h = this._center.y + i;
    return new _(new l(o, h), new l(r, n));
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
    const e = this._mapBounds.topLeft, i = this._mapBounds.bottomRight, o = (i.x - e.x) / this._width, n = (e.y - i.y) / this._height, r = t.x * o + e.x, h = e.y - t.y * n;
    return new l(r, h);
  }
  pointToPixel(t) {
    const e = this._mapBounds.topLeft, i = this._mapBounds.bottomRight, o = this._width / (i.x - e.x), n = this._height / (e.y - i.y), r = (t.x - e.x) * o, h = (e.y - t.y) * n;
    return new l(Math.round(r), Math.round(h));
  }
}
class w {
  constructor(t) {
    s(this, "id");
    s(this, "canvas");
    s(this, "canvasContext");
    s(this, "zoom");
    s(this, "map");
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
class y extends w {
  constructor(e) {
    super(e.id);
    s(this, "_tileUrl");
    s(this, "_tileSize");
    s(this, "_attribution");
    s(this, "_tileBuffer", []);
    this._tileSize = e.tileSize || 256, this._tileUrl = e.tileUrl, this._attribution = e.attribution || "";
  }
  addLayer(e) {
    super.addLayer(e), this.map && (this.drawTiles(), this._attribution && this.map.addAttribution(this._attribution));
  }
  removeLayer() {
    super.removeLayer(), this._tileBuffer = [];
  }
  // TODO: purge the tileBuffer when the map is panned or zoomed
  // so the tileBuffer does not grow indefinitely
  update() {
    super.update(), this.drawTiles();
  }
  drawTiles() {
    const e = this.getTileBounds();
    for (let i = e[0]; i <= e[1]; i++)
      for (let o = e[2]; o <= e[3]; o++) {
        const n = this.getTileUrl(i, o, this.zoom);
        this.drawTile(n, i, o);
      }
  }
  // Gets the bounds of the tiles that should be loaded based on the bounds of the map and the zoom level
  getTileBounds() {
    if (!this.map)
      throw new Error("Map is not set");
    const e = Math.pow(2, this.zoom), i = Math.floor((this.map.bounds.topLeft.x + 2003750834e-2) / (2 * 2003750834e-2) * e), o = Math.floor((this.map.bounds.bottomRight.x + 2003750834e-2) / (2 * 2003750834e-2) * e), n = (Math.PI / 2 - 2 * Math.atan(Math.exp(-this.map.bounds.topLeft.y / 6378137))) * (180 / Math.PI), r = (Math.PI / 2 - 2 * Math.atan(Math.exp(-this.map.bounds.bottomRight.y / 6378137))) * (180 / Math.PI), h = Math.floor((1 - Math.log(Math.tan(n * Math.PI / 180) + 1 / Math.cos(n * Math.PI / 180)) / Math.PI) / 2 * e), c = Math.floor((1 - Math.log(Math.tan(r * Math.PI / 180) + 1 / Math.cos(r * Math.PI / 180)) / Math.PI) / 2 * e);
    return [
      Math.max(0, i),
      Math.max(0, o),
      Math.max(0, h),
      Math.max(0, c)
    ];
  }
  getTileUrl(e, i, o) {
    if (d(e) || d(i) || d(o))
      throw new Error("Invalid tile coordinates");
    return this._tileUrl.replace("{x}", e.toString()).replace("{y}", i.toString()).replace("{z}", o.toString());
  }
  tileExtend(e, i) {
    const o = 156543.03392804097 / Math.pow(2, this.zoom);
    return [
      e * this._tileSize * o - 2003750834e-2,
      2003750834e-2 - i * this._tileSize * o,
      (e + 1) * this._tileSize * o - 2003750834e-2,
      2003750834e-2 - (i + 1) * this._tileSize * o
    ];
  }
  drawTileOnCanvas(e, i, o) {
    if (!this.map || !this.canvasContext)
      return;
    const n = this.tileExtend(i, o), r = new l(n[0], n[1]), h = new l(n[2], n[3]), c = this.map.pointToPixel(r), m = this.map.pointToPixel(h);
    this.canvasContext.drawImage(e, c.x, c.y, m.x - c.x, m.y - c.y);
  }
  drawTile(e, i, o) {
    const n = this._tileBuffer.find((r) => r.id === `${this.zoom}-${i}-${o}`);
    if (n) {
      this.drawTileOnCanvas(n.image, i, o);
      return;
    } else {
      const r = new Image();
      r.crossOrigin = "anonymous", r.src = e, r.onload = () => {
        this._tileBuffer.push({
          id: `${this.zoom}-${i}-${o}`,
          image: r
        }), this.drawTileOnCanvas(r, i, o);
      };
    }
  }
}
class v extends w {
  constructor(e) {
    super(e.id);
    s(this, "_markers", []);
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
    const i = e.radius || "10px", o = e.fillColor || "darkblue", n = e.borderColor || "white", r = this.map.projection.project(e.center), h = this.map.pointToPixel(r), c = this.getRadiusPixels(i), m = this.canvasContext;
    m.beginPath(), m.arc(h.x, h.y, c, 0, 2 * Math.PI, !1), m.fillStyle = o, m.fill(), m.lineWidth = 5, m.strokeStyle = n, m.stroke();
  }
}
class L {
  constructor() {
    s(this, "map");
    s(this, "mapRect");
    s(this, "resolution");
    s(this, "isPanning");
    s(this, "lastPointerPos");
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
class E {
  constructor(t) {
    s(this, "map");
    s(this, "minZoom");
    s(this, "maxZoom");
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
  p as LatLon,
  b as Map,
  v as MarkerLayer,
  L as Pan,
  l as Point,
  y as TileLayer,
  E as Zoom
};
