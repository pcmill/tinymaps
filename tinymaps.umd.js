(function(a,c){typeof exports=="object"&&typeof module<"u"?c(exports):typeof define=="function"&&define.amd?define(["exports"],c):(a=typeof globalThis<"u"?globalThis:a||self,c(a.tinymaps={}))})(this,function(a){"use strict";var v=Object.defineProperty;var E=(a,c,d)=>c in a?v(a,c,{enumerable:!0,configurable:!0,writable:!0,value:d}):a[c]=d;var n=(a,c,d)=>(E(a,typeof c!="symbol"?c+"":c,d),d);class c{constructor(t,e){n(this,"topLeft");n(this,"bottomRight");this.topLeft=t,this.bottomRight=e}}function d(h){return h==null}function w(h){return typeof h!="number"||isNaN(h)}class m{constructor(t,e){n(this,"x");n(this,"y");if(w(t)||w(e))throw new Error("Invalid point coordinates");this.x=t,this.y=e}}class f{constructor(t,e){n(this,"latitude");n(this,"longitude");if(d(t)||d(e))throw new Error("Latitude and longitude must be provided");if(w(t)||w(e))throw new Error("Latitude and longitude must be numbers");if(t<-90||t>90)throw new Error("Latitude must be between -90 and 90");if(e<-180||e>180)throw new Error("Longitude must be between -180 and 180");this.latitude=t,this.longitude=e}}class x{project(t){if(!t)throw new Error("LatLon is required in projection");return new m(0,0)}unproject(t){if(!t)throw new Error("Point is required in projection");return new f(0,0)}}class g extends x{project(t){if(!t)throw new Error("LatLon is required in projection");const e=6378137,i=Math.PI/180,o=85.0511287798,s=Math.max(Math.min(t.latitude,o),-o),r=Math.sin(s*i),l=e*t.longitude*i,u=e*Math.log((1+r)/(1-r))/2;return new m(l,u)}unproject(t){if(!t)throw new Error("Point is required in unprojection");const e=6378137,i=180/Math.PI,o=t.x*i/e,s=(2*Math.atan(Math.exp(t.y/e))-Math.PI/2)*i;return new f(s,o)}}class M{constructor(t){n(this,"_center");n(this,"_zoom");n(this,"_mapBounds");n(this,"_element");n(this,"_projection");n(this,"layers",[]);n(this,"interactives",[]);n(this,"_width");n(this,"_height");n(this,"_radius",6378137);if(!t.elementId)throw new Error("Element ID is required");if(!t.center)throw new Error("Center is required");if(!t.zoom||t.zoom<0||t.zoom>20)throw new Error("Zoom is required and should be between 0 and 20");this._projection=new g,this._center=this._projection.project(t.center),this._zoom=t.zoom;const e=document.getElementById(t.elementId);if(!e)throw new Error("Element not found");this._width=e.clientWidth,this._height=e.clientHeight,this._mapBounds=this.calculateBounds(),this._element=e}get projection(){return this._projection}get zoom(){return this._zoom}set zoom(t){this._zoom=t,this._mapBounds=this.calculateBounds();for(const e of this.layers)e.update()}get center(){return this._projection.unproject(this._center)}get centerWorld(){return this._center}get width(){return this._width}get height(){return this._height}get element(){return this._element}get bounds(){return this._mapBounds}set centerWorld(t){this._center=t,this._mapBounds=this.calculateBounds();for(const e of this.layers)e.update()}set center(t){this._center=this._projection.project(t),this._mapBounds=this.calculateBounds();for(const e of this.layers)e.update()}addAttribution(t){const e=document.createElement("div");e.classList.add("attribution"),e.innerHTML=t,this._element.appendChild(e)}calculateResolution(){const e=this._width,i=this._height;return 2*Math.PI*6378137/(Math.pow(2,this._zoom)*Math.max(e,i))*2}calculateBounds(){const t=this.calculateResolution(),e=this._width/2*t,i=this._height/2*t,o=this._center.x-e,s=this._center.y-i,r=this._center.x+e,l=this._center.y+i;return new c(new m(o,l),new m(r,s))}add(t){t.addLayer(this),this.layers.push(t)}attach(t){t.setMap(this),this.interactives.push(t)}degreesToRadians(t){return t*Math.PI/180}pixelToPoint(t){const e=this._mapBounds.topLeft,i=this._mapBounds.bottomRight,o=(i.x-e.x)/this._width,s=(e.y-i.y)/this._height,r=t.x*o+e.x,l=e.y-t.y*s;return new m(r,l)}pointToPixel(t){const e=this._mapBounds.topLeft,i=this._mapBounds.bottomRight,o=this._width/(i.x-e.x),s=this._height/(e.y-i.y),r=(t.x-e.x)*o,l=(e.y-t.y)*s;return new m(Math.round(r),Math.round(l))}}class _{constructor(t){n(this,"id");n(this,"canvas");n(this,"canvasContext");n(this,"zoom");n(this,"map");if(d(t))throw new Error("Layer id cannot be empty");this.id=t,this.zoom=1,this.map=null,this.canvas=null,this.canvasContext=null}update(){this.zoom=this.map.zoom,this.canvasContext.clearRect(0,0,this.map.width,this.map.height)}addLayer(t){if(!t)throw new Error("Map is required");this.map=t,this.canvas=document.createElement("canvas"),this.canvas.id=this.id,this.map.element.appendChild(this.canvas),this.canvas.width=t.width,this.canvas.height=t.height,this.canvasContext=this.canvas.getContext("2d"),this.zoom=t.zoom}removeLayer(){if(!this.map)throw new Error("Map is not set");this.map.element.removeChild(this.canvas),this.map=null,this.canvas=null,this.canvasContext=null}}class P extends _{constructor(e){super(e.id);n(this,"_tileUrl");n(this,"_tileSize");n(this,"_attribution");n(this,"_tileBuffer",[]);this._tileSize=e.tileSize||256,this._tileUrl=e.tileUrl,this._attribution=e.attribution||""}addLayer(e){super.addLayer(e),this.map&&(this.drawTiles(),this._attribution&&this.map.addAttribution(this._attribution))}removeLayer(){super.removeLayer(),this._tileBuffer=[]}update(){super.update(),this.drawTiles()}drawTiles(){const e=this.getTileBounds();for(let i=e[0];i<=e[1];i++)for(let o=e[2];o<=e[3];o++){const s=this.getTileUrl(i,o,this.zoom);this.drawTile(s,i,o)}}getTileBounds(){if(!this.map)throw new Error("Map is not set");const e=Math.pow(2,this.zoom),i=Math.floor((this.map.bounds.topLeft.x+2003750834e-2)/(2*2003750834e-2)*e),o=Math.floor((this.map.bounds.bottomRight.x+2003750834e-2)/(2*2003750834e-2)*e),s=(Math.PI/2-2*Math.atan(Math.exp(-this.map.bounds.topLeft.y/6378137)))*(180/Math.PI),r=(Math.PI/2-2*Math.atan(Math.exp(-this.map.bounds.bottomRight.y/6378137)))*(180/Math.PI),l=Math.floor((1-Math.log(Math.tan(s*Math.PI/180)+1/Math.cos(s*Math.PI/180))/Math.PI)/2*e),u=Math.floor((1-Math.log(Math.tan(r*Math.PI/180)+1/Math.cos(r*Math.PI/180))/Math.PI)/2*e);return[Math.max(0,i),Math.max(0,o),Math.max(0,l),Math.max(0,u)]}getTileUrl(e,i,o){if(d(e)||d(i)||d(o))throw new Error("Invalid tile coordinates");return this._tileUrl.replace("{x}",e.toString()).replace("{y}",i.toString()).replace("{z}",o.toString())}tileExtend(e,i){const o=156543.03392804097/Math.pow(2,this.zoom);return[e*this._tileSize*o-2003750834e-2,2003750834e-2-i*this._tileSize*o,(e+1)*this._tileSize*o-2003750834e-2,2003750834e-2-(i+1)*this._tileSize*o]}drawTileOnCanvas(e,i,o){if(!this.map||!this.canvasContext)return;const s=this.tileExtend(i,o),r=new m(s[0],s[1]),l=new m(s[2],s[3]),u=this.map.pointToPixel(r),p=this.map.pointToPixel(l);this.canvasContext.drawImage(e,u.x,u.y,p.x-u.x,p.y-u.y)}drawTile(e,i,o){const s=this._tileBuffer.find(r=>r.id===`${this.zoom}-${i}-${o}`);if(s){this.drawTileOnCanvas(s.image,i,o);return}else{const r=new Image;r.crossOrigin="anonymous",r.src=e,r.onload=()=>{this._tileBuffer.push({id:`${this.zoom}-${i}-${o}`,image:r}),this.drawTileOnCanvas(r,i,o)}}}}class b extends _{constructor(e){super(e.id);n(this,"_markers",[]);e.markers&&(this._markers=e.markers)}addLayer(e){super.addLayer(e),this.drawLayers()}update(){super.update(),this.drawLayers()}drawLayers(){if(this._markers)for(const e of this._markers)this.drawMarker(e)}getRadiusPixels(e){if(e.endsWith("px"))return e=e.slice(0,-2),parseInt(e,10);if(e.endsWith("m"))return e=e.slice(0,-1),parseInt(e,10);throw new Error("Radius should end with 'px' or 'm'")}drawMarker(e){const i=e.radius||"10px",o=e.fillColor||"darkblue",s=e.borderColor||"white",r=this.map.projection.project(e.center),l=this.map.pointToPixel(r),u=this.getRadiusPixels(i),p=this.canvasContext;p.beginPath(),p.arc(l.x,l.y,u,0,2*Math.PI,!1),p.fillStyle=o,p.fill(),p.lineWidth=5,p.strokeStyle=s,p.stroke()}}class y{constructor(){n(this,"map");n(this,"mapRect");n(this,"resolution");n(this,"isPanning");n(this,"lastPointerPos");this.map=null,this.mapRect=null,this.resolution=0,this.isPanning=!1,this.lastPointerPos=null,this.pointerDown=this.pointerDown.bind(this),this.pointerMove=this.pointerMove.bind(this),this.pointerUp=this.pointerUp.bind(this)}setMap(t){this.map=t,this.mapRect=this.map.element.getBoundingClientRect(),this.map&&this.map.element.addEventListener("pointerdown",this.pointerDown)}pointerDown(t){t.preventDefault(),this.resolution=this.map.calculateResolution(),this.isPanning=!0,this.lastPointerPos=new m(t.clientX-this.mapRect.left,t.clientY-this.mapRect.top),this.map.element.setPointerCapture(t.pointerId),this.map.element.addEventListener("pointermove",this.pointerMove),this.map.element.addEventListener("pointerup",this.pointerUp)}pointerMove(t){if(!this.isPanning||!this.lastPointerPos)return;t.preventDefault();const e=new m(t.clientX-this.mapRect.left,t.clientY-this.mapRect.top);this.handlePan(e)}handlePan(t){const e=new m((this.lastPointerPos.x-t.x)*this.resolution,(this.lastPointerPos.y-t.y)*this.resolution);this.map.centerWorld=new m(this.map.centerWorld.x+e.x,this.map.centerWorld.y-e.y),this.lastPointerPos=t}pointerUp(t){this.isPanning&&(this.isPanning=!1,this.map.element.releasePointerCapture(t.pointerId),this.map.element.removeEventListener("pointerup",this.pointerUp),this.map.element.removeEventListener("pointermove",this.pointerMove))}}class L{constructor(t){n(this,"map");n(this,"minZoom");n(this,"maxZoom");if(this.map=null,t){if(t.minZoom&&(t.minZoom<0||t.minZoom>20))throw new Error("minZoom must be between 0 and 20");if(t.maxZoom&&(t.maxZoom<0||t.maxZoom>20))throw new Error("maxZoom must be between 0 and 20");if(t.minZoom&&t.maxZoom&&t.minZoom>t.maxZoom)throw new Error("minZoom must be less than maxZoom");if(t.minZoom&&t.maxZoom&&t.minZoom===t.maxZoom)throw new Error("minZoom and maxZoom cannot be equal")}this.minZoom=t&&t.minZoom||0,this.maxZoom=t&&t.maxZoom||20,this.scroll=this.scroll.bind(this)}setMap(t){this.map=t,this.map&&this.map.element.addEventListener("wheel",this.scroll)}scroll(t){t.preventDefault();const e=t.deltaY>0?-1:1,i=this.map.zoom+e;i>=this.minZoom&&i<=this.maxZoom&&(this.map.zoom=i)}}const z="";a.LatLon=f,a.Map=M,a.MarkerLayer=b,a.Pan=y,a.Point=m,a.TileLayer=P,a.Zoom=L,Object.defineProperty(a,Symbol.toStringTag,{value:"Module"})});