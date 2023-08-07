var w = Object.defineProperty;
var f = (r, t, e) => t in r ? w(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var o = (r, t, e) => (f(r, typeof t != "symbol" ? t + "" : t, e), e);
class _ {
  constructor(t, e) {
    o(this, "topLeft");
    o(this, "bottomRight");
    this.topLeft = t, this.bottomRight = e;
  }
}
function c(r) {
  return r == null;
}
function u(r) {
  return typeof r != "number" || isNaN(r);
}
class h {
  constructor(t, e) {
    o(this, "x");
    o(this, "y");
    if (u(t) || u(e))
      throw new Error("Invalid point coordinates");
    this.x = t, this.y = e;
  }
}
class p {
  constructor(t, e) {
    o(this, "latitude");
    o(this, "longitude");
    if (c(t) || c(e))
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
    return new h(0, 0);
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
    const e = 6378137, i = Math.PI / 180, n = 85.0511287798, s = Math.max(Math.min(t.latitude, n), -n), a = Math.sin(s * i), l = e * t.longitude * i, m = e * Math.log((1 + a) / (1 - a)) / 2;
    return new h(l, m);
  }
  unproject(t) {
    if (!t)
      throw new Error("Point is required in unprojection");
    const e = 6378137, i = 180 / Math.PI, n = t.x * i / e, s = (2 * Math.atan(Math.exp(t.y / e)) - Math.PI / 2) * i;
    return new p(s, n);
  }
}
class b {
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
    const t = this.calculateResolution(), e = this._width / 2 * t, i = this._height / 2 * t, n = this._center.x - e, s = this._center.y - i, a = this._center.x + e, l = this._center.y + i;
    return new _(new h(n, l), new h(a, s));
  }
  // Adding a layer to the map
  add(t) {
    t.setMap(this), this.layers.push(t);
  }
  attach(t) {
    t.setMap(this), this.interactives.push(t);
  }
  degreesToRadians(t) {
    return t * Math.PI / 180;
  }
  pixelToPoint(t) {
    const e = this._mapBounds.topLeft, i = this._mapBounds.bottomRight, n = (i.x - e.x) / this._width, s = (e.y - i.y) / this._height, a = t.x * n + e.x, l = e.y - t.y * s;
    return new h(a, l);
  }
  pointToPixel(t) {
    const e = this._mapBounds.topLeft, i = this._mapBounds.bottomRight, n = this._width / (i.x - e.x), s = this._height / (e.y - i.y), a = (t.x - e.x) * n, l = (e.y - t.y) * s;
    return new h(Math.round(a), Math.round(l));
  }
}
class x {
  constructor(t) {
    o(this, "id");
    o(this, "canvas");
    o(this, "canvasContext");
    o(this, "zoom");
    o(this, "map");
    if (c(t))
      throw new Error("Layer id cannot be empty");
    this.id = t, this.zoom = 1, this.map = null, this.canvas = null, this.canvasContext = null;
  }
  update() {
    this.zoom = this.map.zoom;
  }
  setMap(t) {
    if (!t)
      throw new Error("Map is required");
    this.map = t, this.canvas = document.createElement("canvas"), this.canvas.id = this.id, this.map.element.appendChild(this.canvas), this.canvas.width = t.width, this.canvas.height = t.height, this.canvasContext = this.canvas.getContext("2d"), this.zoom = t.zoom;
  }
}
class E extends x {
  constructor(e) {
    super(e.id);
    o(this, "_tileUrl");
    o(this, "_tileSize");
    o(this, "_attribution");
    o(this, "_tileBuffer", []);
    this._tileSize = e.tileSize || 256, this._tileUrl = e.tileUrl, this._attribution = e.attribution || "";
  }
  setMap(e) {
    super.setMap(e), this.map && (this.drawTiles(), this._attribution && this.map.addAttribution(this._attribution));
  }
  // TODO: purge the tileBuffer when the map is panned or zoomed
  // so the tileBuffer does not grow indefinitely
  update() {
    super.update(), this.drawTiles();
  }
  drawTiles() {
    const e = this.getTileBounds();
    for (let i = e[0]; i <= e[1]; i++)
      for (let n = e[2]; n <= e[3]; n++) {
        const s = this.getTileUrl(i, n, this.zoom);
        this.drawTile(s, i, n);
      }
  }
  // Gets the bounds of the tiles that should be loaded based on the bounds of the map and the zoom level
  getTileBounds() {
    if (!this.map)
      throw new Error("Map is not set");
    const e = Math.pow(2, this.zoom), i = Math.floor((this.map.bounds.topLeft.x + 2003750834e-2) / (2 * 2003750834e-2) * e), n = Math.floor((this.map.bounds.bottomRight.x + 2003750834e-2) / (2 * 2003750834e-2) * e), s = (Math.PI / 2 - 2 * Math.atan(Math.exp(-this.map.bounds.topLeft.y / 6378137))) * (180 / Math.PI), a = (Math.PI / 2 - 2 * Math.atan(Math.exp(-this.map.bounds.bottomRight.y / 6378137))) * (180 / Math.PI), l = Math.floor((1 - Math.log(Math.tan(s * Math.PI / 180) + 1 / Math.cos(s * Math.PI / 180)) / Math.PI) / 2 * e), m = Math.floor((1 - Math.log(Math.tan(a * Math.PI / 180) + 1 / Math.cos(a * Math.PI / 180)) / Math.PI) / 2 * e);
    return [
      Math.max(0, i),
      Math.max(0, n),
      Math.max(0, l),
      Math.max(0, m)
    ];
  }
  getTileUrl(e, i, n) {
    if (c(e) || c(i) || c(n))
      throw new Error("Invalid tile coordinates");
    return this._tileUrl.replace("{x}", e.toString()).replace("{y}", i.toString()).replace("{z}", n.toString());
  }
  tileExtend(e, i) {
    const n = 156543.03392804097 / Math.pow(2, this.zoom);
    return [
      e * this._tileSize * n - 2003750834e-2,
      2003750834e-2 - i * this._tileSize * n,
      (e + 1) * this._tileSize * n - 2003750834e-2,
      2003750834e-2 - (i + 1) * this._tileSize * n
    ];
  }
  drawTileOnCanvas(e, i, n) {
    if (!this.map || !this.canvasContext)
      return;
    const s = this.tileExtend(i, n), a = new h(s[0], s[1]), l = new h(s[2], s[3]), m = this.map.pointToPixel(a), d = this.map.pointToPixel(l);
    this.canvasContext.drawImage(e, m.x, m.y, d.x - m.x, d.y - m.y);
  }
  drawTile(e, i, n) {
    const s = this._tileBuffer.find((a) => a.id === `${this.zoom}-${i}-${n}`);
    if (s) {
      this.drawTileOnCanvas(s.image, i, n);
      return;
    } else {
      const a = new Image();
      a.crossOrigin = "anonymous", a.src = e, a.onload = () => {
        this._tileBuffer.push({
          id: `${this.zoom}-${i}-${n}`,
          image: a
        }), this.drawTileOnCanvas(a, i, n);
      };
    }
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
    t.preventDefault(), this.resolution = this.map.calculateResolution(), this.isPanning = !0, this.lastPointerPos = new h(t.clientX - this.mapRect.left, t.clientY - this.mapRect.top), this.map.element.setPointerCapture(t.pointerId), this.map.element.addEventListener("pointermove", this.pointerMove), this.map.element.addEventListener("pointerup", this.pointerUp);
  }
  pointerMove(t) {
    if (!this.isPanning || !this.lastPointerPos)
      return;
    t.preventDefault();
    const e = new h(t.clientX - this.mapRect.left, t.clientY - this.mapRect.top);
    this.handlePan(e);
  }
  handlePan(t) {
    const e = new h(
      (this.lastPointerPos.x - t.x) * this.resolution,
      (this.lastPointerPos.y - t.y) * this.resolution
    );
    this.map.centerWorld = new h(
      this.map.centerWorld.x + e.x,
      this.map.centerWorld.y - e.y
    ), this.lastPointerPos = t;
  }
  pointerUp(t) {
    this.isPanning && (this.isPanning = !1, this.map.element.releasePointerCapture(t.pointerId), this.map.element.removeEventListener("pointerup", this.pointerUp), this.map.element.removeEventListener("pointermove", this.pointerMove));
  }
}
class v {
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
    t.preventDefault(), t.deltaY > 0 && this.map.zoom - 1 > this.minZoom ? this.map.zoom = this.map.zoom - 1 : t.deltaY < 0 && this.map.zoom + 1 < this.maxZoom && (this.map.zoom = this.map.zoom + 1);
  }
}
export {
  p as LatLon,
  b as Map,
  z as Pan,
  h as Point,
  E as TileLayer,
  v as Zoom
};
