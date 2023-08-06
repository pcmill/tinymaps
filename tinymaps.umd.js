(function(h,m){typeof exports=="object"&&typeof module<"u"?m(exports):typeof define=="function"&&define.amd?define(["exports"],m):(h=typeof globalThis<"u"?globalThis:h||self,m(h.tinymaps={}))})(this,function(h){"use strict";var E=Object.defineProperty;var y=(h,m,u)=>m in h?E(h,m,{enumerable:!0,configurable:!0,writable:!0,value:u}):h[m]=u;var i=(h,m,u)=>(y(h,typeof m!="symbol"?m+"":m,u),u);class m{constructor(t,e){i(this,"topLeft");i(this,"bottomRight");this.topLeft=t,this.bottomRight=e}}function u(a){return a==null}function p(a){return typeof a!="number"||isNaN(a)}class l{constructor(t,e){i(this,"x");i(this,"y");if(p(t)||p(e))throw new Error("Invalid point coordinates");this.x=t,this.y=e}}class w{constructor(t,e){i(this,"latitude");i(this,"longitude");if(u(t)||u(e))throw new Error("Latitude and longitude must be provided");if(p(t)||p(e))throw new Error("Latitude and longitude must be numbers");if(t<-90||t>90)throw new Error("Latitude must be between -90 and 90");if(e<-180||e>180)throw new Error("Longitude must be between -180 and 180");this.latitude=t,this.longitude=e}}class M{project(t){if(!t)throw new Error("LatLon is required in projection");return new l(0,0)}unproject(t){if(!t)throw new Error("Point is required in projection");return new w(0,0)}}class _ extends M{project(t){if(!t)throw new Error("LatLon is required in projection");const e=6378137,o=Math.PI/180,s=85.0511287798,n=Math.max(Math.min(t.latitude,s),-s),r=Math.sin(n*o),c=e*t.longitude*o,d=e*Math.log((1+r)/(1-r))/2;return new l(c,d)}unproject(t){if(!t)throw new Error("Point is required in unprojection");const e=6378137,o=180/Math.PI,s=t.x*o/e,n=(2*Math.atan(Math.exp(t.y/e))-Math.PI/2)*o;return new w(n,s)}}class g{constructor(t){i(this,"_center");i(this,"_zoom");i(this,"_mapBounds");i(this,"_element");i(this,"_projection");i(this,"layers",[]);i(this,"interactives",[]);i(this,"_width");i(this,"_height");i(this,"_radius",6378137);if(!t.elementId)throw new Error("Element ID is required");if(!t.center)throw new Error("Center is required");if(!t.zoom||t.zoom<0||t.zoom>20)throw new Error("Zoom is required and should be between 0 and 20");this._projection=new _,this._center=this._projection.project(t.center),this._zoom=t.zoom;const e=document.getElementById(t.elementId);if(!e)throw new Error("Element not found");this._width=e.clientWidth,this._height=e.clientHeight,this._mapBounds=this.calculateBounds(),this._element=e}get projection(){return this._projection}get zoom(){return this._zoom}set zoom(t){this._zoom=t,this._mapBounds=this.calculateBounds();for(const e of this.layers)e.update()}get center(){return this._projection.unproject(this._center)}get centerWorld(){return this._center}get width(){return this._width}get height(){return this._height}get element(){return this._element}get bounds(){return this._mapBounds}set centerWorld(t){this._center=t,this._mapBounds=this.calculateBounds();for(const e of this.layers)e.update()}set center(t){this._center=this._projection.project(t),this._mapBounds=this.calculateBounds();for(const e of this.layers)e.update()}addAttribution(t){const e=document.createElement("div");e.classList.add("attribution"),e.innerHTML=t,this._element.appendChild(e)}calculateResolution(){const e=this._width,o=this._height;return 2*Math.PI*6378137/(Math.pow(2,this._zoom)*Math.max(e,o))*2}calculateBounds(){const t=this.calculateResolution(),e=this._width/2*t,o=this._height/2*t,s=this._center.x-e,n=this._center.y-o,r=this._center.x+e,c=this._center.y+o;return new m(new l(s,c),new l(r,n))}add(t){t.setMap(this),this.layers.push(t)}attach(t){t.setMap(this),this.interactives.push(t)}degreesToRadians(t){return t*Math.PI/180}pixelToPoint(t){const e=this._mapBounds.topLeft,o=this._mapBounds.bottomRight,s=(o.x-e.x)/this._width,n=(e.y-o.y)/this._height,r=t.x*s+e.x,c=e.y-t.y*n;return new l(r,c)}pointToPixel(t){const e=this._mapBounds.topLeft,o=this._mapBounds.bottomRight,s=this._width/(o.x-e.x),n=this._height/(e.y-o.y),r=(t.x-e.x)*s,c=(e.y-t.y)*n;return new l(Math.round(r),Math.round(c))}}class x{constructor(t){i(this,"id");i(this,"canvas");i(this,"canvasContext");i(this,"zoom");i(this,"map");if(u(t))throw new Error("Layer id cannot be empty");this.id=t,this.zoom=1,this.map=null,this.canvas=null,this.canvasContext=null}update(){this.zoom=this.map.zoom}setMap(t){if(!t)throw new Error("Map is required");this.map=t,this.canvas=document.createElement("canvas"),this.canvas.id=this.id,this.map.element.appendChild(this.canvas),this.canvas.width=t.width,this.canvas.height=t.height,this.canvasContext=this.canvas.getContext("2d"),this.zoom=t.zoom}}class b extends x{constructor(e){super(e.id);i(this,"_tileUrl");i(this,"_tileSize");i(this,"_attribution");i(this,"_tileBuffer",[]);this._tileSize=e.tileSize||256,this._tileUrl=e.tileUrl,this._attribution=e.attribution||""}setMap(e){super.setMap(e),this.map&&(this.drawTiles(),this._attribution&&this.map.addAttribution(this._attribution))}update(){super.update(),this.drawTiles()}drawTiles(){const e=this.getTileBounds();for(let o=e[0];o<=e[1];o++)for(let s=e[2];s<=e[3];s++){const n=this.getTileUrl(o,s,this.zoom);this.drawTile(n,o,s)}}getTileBounds(){if(!this.map)throw new Error("Map is not set");const e=Math.pow(2,this.zoom),o=Math.floor((this.map.bounds.topLeft.x+2003750834e-2)/(2*2003750834e-2)*e),s=Math.floor((this.map.bounds.bottomRight.x+2003750834e-2)/(2*2003750834e-2)*e),n=(Math.PI/2-2*Math.atan(Math.exp(-this.map.bounds.topLeft.y/6378137)))*(180/Math.PI),r=(Math.PI/2-2*Math.atan(Math.exp(-this.map.bounds.bottomRight.y/6378137)))*(180/Math.PI),c=Math.floor((1-Math.log(Math.tan(n*Math.PI/180)+1/Math.cos(n*Math.PI/180))/Math.PI)/2*e),d=Math.floor((1-Math.log(Math.tan(r*Math.PI/180)+1/Math.cos(r*Math.PI/180))/Math.PI)/2*e);return[Math.max(0,o),Math.max(0,s),Math.max(0,c),Math.max(0,d)]}getTileUrl(e,o,s){if(u(e)||u(o)||u(s))throw new Error("Invalid tile coordinates");return this._tileUrl.replace("{x}",e.toString()).replace("{y}",o.toString()).replace("{z}",s.toString())}tileExtend(e,o){const s=156543.03392804097/Math.pow(2,this.zoom);return[e*this._tileSize*s-2003750834e-2,2003750834e-2-o*this._tileSize*s,(e+1)*this._tileSize*s-2003750834e-2,2003750834e-2-(o+1)*this._tileSize*s]}drawTileOnCanvas(e,o,s){if(!this.map||!this.canvasContext)return;const n=this.tileExtend(o,s),r=new l(n[0],n[1]),c=new l(n[2],n[3]),d=this.map.pointToPixel(r),f=this.map.pointToPixel(c);this.canvasContext.drawImage(e,d.x,d.y,f.x-d.x,f.y-d.y)}drawTile(e,o,s){const n=this._tileBuffer.find(r=>r.id===`${this.zoom}-${o}-${s}`);if(n){this.drawTileOnCanvas(n.image,o,s);return}else{const r=new Image;r.crossOrigin="anonymous",r.src=e,r.onload=()=>{this._tileBuffer.push({id:`${this.zoom}-${o}-${s}`,image:r}),this.drawTileOnCanvas(r,o,s)}}}}class P{constructor(){i(this,"map");i(this,"mapRect");i(this,"resolution");i(this,"isPanning");i(this,"lastMousePos");this.map=null,this.mapRect=null,this.resolution=0,this.isPanning=!1,this.lastMousePos=null,this.mouseDown=this.mouseDown.bind(this),this.mouseMove=this.mouseMove.bind(this),this.mouseUp=this.mouseUp.bind(this),this.handleOutside=this.handleOutside.bind(this)}setMap(t){this.map=t,this.mapRect=this.map.element.getBoundingClientRect(),this.map&&this.map.element.addEventListener("mousedown",this.mouseDown)}handleOutside(t){this.isPanning&&this.mouseUp(t),document.removeEventListener("mouseup",this.handleOutside)}mouseDown(t){t.preventDefault(),this.resolution=this.map.calculateResolution(),this.isPanning=!0,this.lastMousePos=new l(t.clientX-this.mapRect.left,t.clientY-this.mapRect.top),this.map.element.addEventListener("mousemove",this.mouseMove),this.map.element.addEventListener("mouseup",this.mouseUp),document.addEventListener("mouseup",this.handleOutside)}mouseMove(t){if(t.preventDefault(),this.isPanning&&this.lastMousePos){const e=new l(t.clientX-this.mapRect.left,t.clientY-this.mapRect.top),o=new l((this.lastMousePos.x-e.x)*this.resolution,(this.lastMousePos.y-e.y)*this.resolution);this.map.centerWorld=new l(this.map.centerWorld.x+o.x,this.map.centerWorld.y-o.y),this.lastMousePos=e}}mouseUp(t){t.preventDefault(),this.isPanning=!1,this.map.element.removeEventListener("mouseup",this.mouseUp),this.map.element.removeEventListener("mousemove",this.mouseMove)}}class v{constructor(t){i(this,"map");i(this,"minZoom");i(this,"maxZoom");if(this.map=null,t){if(t.minZoom&&(t.minZoom<0||t.minZoom>20))throw new Error("minZoom must be between 0 and 20");if(t.maxZoom&&(t.maxZoom<0||t.maxZoom>20))throw new Error("maxZoom must be between 0 and 20");if(t.minZoom&&t.maxZoom&&t.minZoom>t.maxZoom)throw new Error("minZoom must be less than maxZoom");if(t.minZoom&&t.maxZoom&&t.minZoom===t.maxZoom)throw new Error("minZoom and maxZoom cannot be equal")}this.minZoom=t&&t.minZoom||0,this.maxZoom=t&&t.maxZoom||20,this.scroll=this.scroll.bind(this)}setMap(t){this.map=t,this.map&&this.map.element.addEventListener("wheel",this.scroll)}scroll(t){t.preventDefault(),t.deltaY>0&&this.map.zoom-1>this.minZoom?this.map.zoom=this.map.zoom-1:t.deltaY<0&&this.map.zoom+1<this.maxZoom&&(this.map.zoom=this.map.zoom+1)}}const L="";h.LatLon=w,h.Map=g,h.Pan=P,h.Point=l,h.TileLayer=b,h.Zoom=v,Object.defineProperty(h,Symbol.toStringTag,{value:"Module"})});