var w = Object.defineProperty;
var f = (r, t, e) => t in r ? w(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var s = (r, t, e) => (f(r, typeof t != "symbol" ? t + "" : t, e), e);
class M {
  constructor(t, e) {
    s(this, "topLeft");
    s(this, "bottomRight");
    this.topLeft = t, this.bottomRight = e;
  }
}
function c(r) {
  return r == null;
}
function u(r) {
  return typeof r != "number" || isNaN(r);
}
class a {
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
class _ {
  project(t) {
    if (!t)
      throw new Error("LatLon is required in projection");
    return new a(0, 0);
  }
  unproject(t) {
    if (!t)
      throw new Error("Point is required in projection");
    return new p(0, 0);
  }
}
class g extends _ {
  project(t) {
    if (!t)
      throw new Error("LatLon is required in projection");
    const e = 6378137, o = Math.PI / 180, i = 85.0511287798, n = Math.max(Math.min(t.latitude, i), -i), h = Math.sin(n * o), m = e * t.longitude * o, l = e * Math.log((1 + h) / (1 - h)) / 2;
    return new a(m, l);
  }
  unproject(t) {
    if (!t)
      throw new Error("Point is required in unprojection");
    const e = 6378137, o = 180 / Math.PI, i = t.x * o / e, n = (2 * Math.atan(Math.exp(t.y / e)) - Math.PI / 2) * o;
    return new p(n, i);
  }
}
class P {
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
    this._projection = new g(), this._center = this._projection.project(t.center), this._zoom = t.zoom;
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
    const e = this._width, o = this._height;
    return 2 * Math.PI * 6378137 / (Math.pow(2, this._zoom) * Math.max(e, o)) * 2;
  }
  // Calculate bounds based on center and zoom and on size of element
  calculateBounds() {
    const t = this.calculateResolution(), e = this._width / 2 * t, o = this._height / 2 * t, i = this._center.x - e, n = this._center.y - o, h = this._center.x + e, m = this._center.y + o;
    return new M(new a(i, m), new a(h, n));
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
    const e = this._mapBounds.topLeft, o = this._mapBounds.bottomRight, i = (o.x - e.x) / this._width, n = (e.y - o.y) / this._height, h = t.x * i + e.x, m = e.y - t.y * n;
    return new a(h, m);
  }
  pointToPixel(t) {
    const e = this._mapBounds.topLeft, o = this._mapBounds.bottomRight, i = this._width / (o.x - e.x), n = this._height / (e.y - o.y), h = (t.x - e.x) * i, m = (e.y - t.y) * n;
    return new a(Math.round(h), Math.round(m));
  }
}
class x {
  constructor(t) {
    s(this, "id");
    s(this, "canvas");
    s(this, "canvasContext");
    s(this, "zoom");
    s(this, "map");
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
class v extends x {
  constructor(e) {
    super(e.id);
    s(this, "_tileUrl");
    s(this, "_tileSize");
    s(this, "_attribution");
    s(this, "_tileBuffer", []);
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
    for (let o = e[0]; o <= e[1]; o++)
      for (let i = e[2]; i <= e[3]; i++) {
        const n = this.getTileUrl(o, i, this.zoom);
        this.drawTile(n, o, i);
      }
  }
  // Gets the bounds of the tiles that should be loaded based on the bounds of the map and the zoom level
  getTileBounds() {
    if (!this.map)
      throw new Error("Map is not set");
    const e = Math.pow(2, this.zoom), o = Math.floor((this.map.bounds.topLeft.x + 2003750834e-2) / (2 * 2003750834e-2) * e), i = Math.floor((this.map.bounds.bottomRight.x + 2003750834e-2) / (2 * 2003750834e-2) * e), n = (Math.PI / 2 - 2 * Math.atan(Math.exp(-this.map.bounds.topLeft.y / 6378137))) * (180 / Math.PI), h = (Math.PI / 2 - 2 * Math.atan(Math.exp(-this.map.bounds.bottomRight.y / 6378137))) * (180 / Math.PI), m = Math.floor((1 - Math.log(Math.tan(n * Math.PI / 180) + 1 / Math.cos(n * Math.PI / 180)) / Math.PI) / 2 * e), l = Math.floor((1 - Math.log(Math.tan(h * Math.PI / 180) + 1 / Math.cos(h * Math.PI / 180)) / Math.PI) / 2 * e);
    return [
      Math.max(0, o),
      Math.max(0, i),
      Math.max(0, m),
      Math.max(0, l)
    ];
  }
  getTileUrl(e, o, i) {
    if (c(e) || c(o) || c(i))
      throw new Error("Invalid tile coordinates");
    return this._tileUrl.replace("{x}", e.toString()).replace("{y}", o.toString()).replace("{z}", i.toString());
  }
  tileExtend(e, o) {
    const i = 156543.03392804097 / Math.pow(2, this.zoom);
    return [
      e * this._tileSize * i - 2003750834e-2,
      2003750834e-2 - o * this._tileSize * i,
      (e + 1) * this._tileSize * i - 2003750834e-2,
      2003750834e-2 - (o + 1) * this._tileSize * i
    ];
  }
  drawTileOnCanvas(e, o, i) {
    if (!this.map || !this.canvasContext)
      return;
    const n = this.tileExtend(o, i), h = new a(n[0], n[1]), m = new a(n[2], n[3]), l = this.map.pointToPixel(h), d = this.map.pointToPixel(m);
    this.canvasContext.drawImage(e, l.x, l.y, d.x - l.x, d.y - l.y);
  }
  drawTile(e, o, i) {
    const n = this._tileBuffer.find((h) => h.id === `${this.zoom}-${o}-${i}`);
    if (n) {
      this.drawTileOnCanvas(n.image, o, i);
      return;
    } else {
      const h = new Image();
      h.crossOrigin = "anonymous", h.src = e, h.onload = () => {
        this._tileBuffer.push({
          id: `${this.zoom}-${o}-${i}`,
          image: h
        }), this.drawTileOnCanvas(h, o, i);
      };
    }
  }
}
class E {
  constructor() {
    s(this, "map");
    s(this, "mapRect");
    s(this, "resolution");
    s(this, "isPanning");
    s(this, "lastMousePos");
    this.map = null, this.mapRect = null, this.resolution = 0, this.isPanning = !1, this.lastMousePos = null, this.mouseDown = this.mouseDown.bind(this), this.mouseMove = this.mouseMove.bind(this), this.mouseUp = this.mouseUp.bind(this), this.handleOutside = this.handleOutside.bind(this);
  }
  setMap(t) {
    this.map = t, this.mapRect = this.map.element.getBoundingClientRect(), this.map && this.map.element.addEventListener("mousedown", this.mouseDown);
  }
  /**
   * Makes sure that if the mousedown event extends to outside the 
   * map element, the mouseup event is still captured.
   * @param event 
   */
  handleOutside(t) {
    this.isPanning && this.mouseUp(t), document.removeEventListener("mouseup", this.handleOutside);
  }
  mouseDown(t) {
    t.preventDefault(), this.resolution = this.map.calculateResolution(), this.isPanning = !0, this.lastMousePos = new a(t.clientX - this.mapRect.left, t.clientY - this.mapRect.top), this.map.element.addEventListener("mousemove", this.mouseMove), this.map.element.addEventListener("mouseup", this.mouseUp), document.addEventListener("mouseup", this.handleOutside);
  }
  mouseMove(t) {
    if (t.preventDefault(), this.isPanning && this.lastMousePos) {
      const e = new a(t.clientX - this.mapRect.left, t.clientY - this.mapRect.top), o = new a(
        (this.lastMousePos.x - e.x) * this.resolution,
        (this.lastMousePos.y - e.y) * this.resolution
      );
      this.map.centerWorld = new a(
        this.map.centerWorld.x + o.x,
        this.map.centerWorld.y - o.y
      ), this.lastMousePos = e;
    }
  }
  mouseUp(t) {
    t.preventDefault(), this.isPanning = !1, this.map.element.removeEventListener("mouseup", this.mouseUp), this.map.element.removeEventListener("mousemove", this.mouseMove);
  }
}
class z {
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
    t.preventDefault(), t.deltaY > 0 && this.map.zoom - 1 > this.minZoom ? this.map.zoom = this.map.zoom - 1 : t.deltaY < 0 && this.map.zoom + 1 < this.maxZoom && (this.map.zoom = this.map.zoom + 1);
  }
}
export {
  p as LatLon,
  P as Map,
  E as Pan,
  a as Point,
  v as TileLayer,
  z as Zoom
};
