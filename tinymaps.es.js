var x = Object.defineProperty;
var g = (r, t, e) => t in r ? x(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var o = (r, t, e) => (g(r, typeof t != "symbol" ? t + "" : t, e), e);
class b {
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
function d(r) {
  return r == null;
}
function p(r) {
  return typeof r != "number" || isNaN(r);
}
class l {
  constructor(t, e) {
    o(this, "x");
    o(this, "y");
    if (p(t) || p(e))
      throw new Error("Invalid point coordinates");
    this.x = t, this.y = e;
  }
}
class f {
  constructor(t, e) {
    o(this, "latitude");
    o(this, "longitude");
    if (d(t) || d(e))
      throw new Error("Latitude and longitude must be provided");
    if (p(t) || p(e))
      throw new Error("Latitude and longitude must be numbers");
    if (t < -90 || t > 90)
      throw new Error("Latitude must be between -90 and 90");
    if (e < -180 || e > 180)
      throw new Error("Longitude must be between -180 and 180");
    this.latitude = t, this.longitude = e;
  }
}
class y {
  project(t) {
    if (!t)
      throw new Error("LatLon is required in projection");
    return new l(0, 0);
  }
  unproject(t) {
    if (!t)
      throw new Error("Point is required in projection");
    return new f(0, 0);
  }
}
class M extends y {
  /**
   * Projects a latitude and longitude to a point on a 2D plane
   * @param {LatLon} latlon
   * @returns {Point} Point
   */
  project(t) {
    if (!t)
      throw new Error("LatLon is required in projection");
    const e = 6378137, i = Math.PI / 180, s = 85.0511287798, n = Math.max(Math.min(t.latitude, s), -s), a = Math.sin(n * i), h = e * t.longitude * i, c = e * Math.log((1 + a) / (1 - a)) / 2;
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
    return new f(n, s);
  }
}
class L {
  constructor(t) {
    o(this, "_center");
    o(this, "_zoom");
    o(this, "_tileSize");
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
    this._projection = new M(), this._center = this._projection.project(t.center), this._zoom = t.zoom, this._mapBounds = null, this._tileSize = 256;
    const e = document.getElementById(t.elementId);
    if (!e)
      throw new Error("Element not found");
    e.style.position = "relative", this._width = e.clientWidth, this._height = e.clientHeight, this.calculateBounds(), this._element = e;
  }
  get projection() {
    return this._projection;
  }
  get zoom() {
    return this._zoom;
  }
  set zoom(t) {
    this._zoom = t, this.calculateBounds();
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
    if (!this._mapBounds)
      throw new Error("Map bounds not set");
    return this._mapBounds;
  }
  set centerWorld(t) {
    this._center = t, this.calculateBounds();
    for (const e of this.layers)
      e.update();
  }
  set center(t) {
    this._center = this._projection.project(t), this.calculateBounds();
    for (const e of this.layers)
      e.update();
  }
  set tileSize(t) {
    this._tileSize = t;
  }
  calculateResolution() {
    const t = 2 * Math.PI * this._radius, i = Math.pow(2, this._zoom) * this._tileSize;
    return t / i;
  }
  // Calculate bounds based on center and zoom and on size of element
  calculateBounds() {
    const t = this.calculateResolution(), e = this._width / 2 * t, i = this._height / 2 * t, s = this._center.x - e, n = this._center.y - i, a = this._center.x + e, h = this._center.y + i;
    this._mapBounds = new b(new l(s, h), new l(a, n));
  }
  // Adding a layer to the map
  add(t) {
    t.addLayer(this), this.layers.push(t);
  }
  remove(t) {
    const e = this.layers.findIndex((i) => i.id === t.id);
    e > -1 && this.layers.splice(e, 1);
  }
  attach(t) {
    t.setMap(this), this.interactives.push(t);
  }
  degreesToRadians(t) {
    return t * Math.PI / 180;
  }
  pixelToPoint(t) {
    if (!this._mapBounds)
      throw new Error("Map bounds not set");
    const e = this._mapBounds.topLeft, i = this._mapBounds.bottomRight, s = (i.x - e.x) / this._width, n = (e.y - i.y) / this._height, a = t.x * s + e.x, h = e.y - t.y * n;
    return new l(a, h);
  }
  pointToPixel(t) {
    if (!this._mapBounds)
      throw new Error("Map bounds not set");
    const e = this._mapBounds.topLeft, i = this._mapBounds.bottomRight, s = this._width / (i.x - e.x), n = this._height / (e.y - i.y), a = (t.x - e.x) * s, h = (e.y - t.y) * n;
    return new l(Math.round(a), Math.round(h));
  }
}
class E {
  constructor(t, e) {
    o(this, "_topLeft");
    o(this, "_bottomRight");
    this._topLeft = t, this._bottomRight = e;
  }
  get topLeft() {
    return this._topLeft;
  }
  get bottomRight() {
    return this._bottomRight;
  }
}
class z {
  constructor() {
    o(this, "layers");
    this.layers = [];
  }
  addLayer(t) {
    this.layers.push(t);
  }
  removeLayer(t) {
    const e = this.layers.findIndex((i) => i.id === t.id);
    e > -1 && (this.layers.splice(e, 1), t.removeLayer());
  }
  removeLayers() {
    this.layers.forEach((t) => t.removeLayer()), this.layers = [];
  }
}
class w {
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
    this.map = t, this.canvas = document.createElement("canvas"), this.canvas.id = this.id, this.map.element.appendChild(this.canvas), this.canvas.style.position = "absolute", this.canvas.style.top = "0", this.canvas.style.left = "0", this.canvas.width = t.width, this.canvas.height = t.height, this.canvasContext = this.canvas.getContext("2d"), this.zoom = t.zoom;
  }
  removeLayer() {
    if (!this.map)
      throw new Error("Map is not set");
    this.map.remove(this), this.map.element.removeChild(this.canvas), this.map = null, this.canvas = null, this.canvasContext = null;
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
class I extends w {
  constructor(e) {
    super(e.id);
    o(this, "_tileUrl");
    o(this, "_tileSize");
    o(this, "_tileBuffer", new P());
    this._tileSize = e.tileSize || 256, this._tileUrl = e.tileUrl;
  }
  addLayer(e) {
    super.addLayer(e), this.map && (this.map.tileSize = this._tileSize, this.map.calculateBounds(), this.drawTiles());
  }
  removeLayer() {
    super.removeLayer(), this._tileBuffer.clear();
  }
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
    const e = Math.pow(2, this.zoom), i = Math.floor((this.map.bounds.topLeft.x + 2003750834e-2) / (2 * 2003750834e-2) * e), s = Math.floor((this.map.bounds.bottomRight.x + 2003750834e-2) / (2 * 2003750834e-2) * e), n = (Math.PI / 2 - 2 * Math.atan(Math.exp(-this.map.bounds.topLeft.y / 6378137))) * (180 / Math.PI), a = (Math.PI / 2 - 2 * Math.atan(Math.exp(-this.map.bounds.bottomRight.y / 6378137))) * (180 / Math.PI), h = Math.floor((1 - Math.log(Math.tan(n * Math.PI / 180) + 1 / Math.cos(n * Math.PI / 180)) / Math.PI) / 2 * e), c = Math.floor((1 - Math.log(Math.tan(a * Math.PI / 180) + 1 / Math.cos(a * Math.PI / 180)) / Math.PI) / 2 * e);
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
    const n = this.tileExtend(i, s), a = new l(n[0], n[1]), h = new l(n[2], n[3]), c = this.map.pointToPixel(a), u = this.map.pointToPixel(h);
    this.canvasContext.drawImage(e, c.x, c.y, u.x - c.x, u.y - c.y);
  }
  drawTile(e, i, s) {
    const n = this._tileBuffer.get(`${this.zoom}-${i}-${s}`);
    if (n) {
      this.drawTileOnCanvas(n.image, i, s);
      return;
    } else {
      const a = new Image();
      a.crossOrigin = "anonymous", a.src = e, a.onload = () => {
        this._tileBuffer.add({
          id: `${this.zoom}-${i}-${s}`,
          image: a
        }), this.drawTileOnCanvas(a, i, s);
      };
    }
  }
}
class C extends w {
  constructor(e) {
    super(e.id);
    o(this, "_center", null);
    o(this, "_options", null);
    e.center && (this._center = e.center), e.options && (this._options = e.options);
  }
  addLayer(e) {
    super.addLayer(e), this.drawMarker();
  }
  update() {
    super.update(), this.drawMarker();
  }
  getRadiusPixels(e) {
    if (e.endsWith("px"))
      return e = e.slice(0, -2), parseInt(e, 10);
    if (e.endsWith("m"))
      return e = e.slice(0, -1), parseInt(e, 10);
    throw new Error("Radius should end with 'px' or 'm'");
  }
  drawMarker() {
    var n, a, h;
    const e = ((n = this._options) == null ? void 0 : n.radius) || "10px", i = ((a = this._options) == null ? void 0 : a.fillColor) || "darkblue", s = ((h = this._options) == null ? void 0 : h.borderColor) || "white";
    if (this._center) {
      const c = this.map.projection.project(this._center), u = this.map.pointToPixel(c), _ = this.getRadiusPixels(e), m = this.canvasContext;
      m.beginPath(), m.arc(u.x, u.y, _, 0, 2 * Math.PI, !1), m.fillStyle = i, m.fill(), m.lineWidth = 5, m.strokeStyle = s, m.stroke();
    }
  }
}
class R extends w {
  constructor(e) {
    super(e.id);
    o(this, "_imageUrl");
    o(this, "_imageData", null);
    o(this, "_projection", null);
    o(this, "_bounds", null);
    o(this, "_opacity", 1);
    this._imageUrl = e.imageUrl, this._bounds = e.bounds, this._opacity = e.opacity || 1;
  }
  addLayer(e) {
    super.addLayer(e), this._projection = e.projection, this._imageData = new Image(), this._imageData.src = this._imageUrl, this._imageData.onload = () => {
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
      const e = this._projection.project(this._bounds.topLeft), i = this.map.pointToPixel(e), s = this._projection.project(this._bounds.bottomRight), n = this.map.pointToPixel(s);
      this.canvasContext.globalAlpha = this._opacity, this.canvasContext.drawImage(this._imageData, i.x, i.y, n.x - i.x, n.y - i.y), this.canvasContext.globalAlpha = 1;
    }
  }
}
class T extends w {
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
      const n = this.map.projection.project(s.center), a = this.map.pointToPixel(n);
      i.lineTo(a.x, a.y);
    }
    i.stroke();
  }
}
class j {
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
class B {
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
class Z {
  constructor(t) {
    o(this, "map");
    o(this, "attribution");
    this.attribution = document.createElement("div"), this.attribution.className = "attribution", this.attribution.innerHTML = t, this.attribution.style.position = "absolute", this.attribution.style.bottom = "0", this.attribution.style.right = "0", this.attribution.style.zIndex = "1000", this.map = null;
  }
  setMap(t) {
    this.map = t, this.map && this.attribution && t.element.appendChild(this.attribution);
  }
  removeAttribution(t) {
    this.map && this.attribution && t.element.removeChild(this.attribution), this.map = null, this.attribution = null;
  }
  updateAttribution(t) {
    this.attribution && (this.attribution.innerHTML = t);
  }
}
export {
  Z as Attribution,
  E as BoundingBox,
  R as ImageLayer,
  f as LatLon,
  z as LayerGroup,
  T as LineLayer,
  L as Map,
  C as MarkerLayer,
  j as Pan,
  l as Point,
  I as TileLayer,
  B as Zoom
};
