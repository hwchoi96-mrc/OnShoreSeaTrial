(()=>{"use strict";function t(t,e){e[0]<t[0]&&(t[0]=e[0]),e[0]>t[2]&&(t[2]=e[0]),e[1]<t[1]&&(t[1]=e[1]),e[1]>t[3]&&(t[3]=e[1])}var e="cosh"in Math?Math.cosh:function(t){var e=Math.exp(t);return(e+1/e)/2},n={DEGREES:"degrees",FEET:"ft",METERS:"m",PIXELS:"pixels",TILE_PIXELS:"tile-pixels",USFEET:"us-ft"},r={};r[n.DEGREES]=2*Math.PI*6370997/360,r[n.FEET]=.3048,r[n.METERS]=1,r[n.USFEET]=1200/3937;const o=n;var i=function(t){this.code_=t.code,this.units_=t.units,this.extent_=void 0!==t.extent?t.extent:null,this.worldExtent_=void 0!==t.worldExtent?t.worldExtent:null,this.axisOrientation_=void 0!==t.axisOrientation?t.axisOrientation:"enu",this.global_=void 0!==t.global&&t.global,this.canWrapX_=!(!this.global_||!this.extent_),this.getPointResolutionFunc_=t.getPointResolution,this.defaultTileGrid_=null,this.metersPerUnit_=t.metersPerUnit};i.prototype.canWrapX=function(){return this.canWrapX_},i.prototype.getCode=function(){return this.code_},i.prototype.getExtent=function(){return this.extent_},i.prototype.getUnits=function(){return this.units_},i.prototype.getMetersPerUnit=function(){return this.metersPerUnit_||r[this.units_]},i.prototype.getWorldExtent=function(){return this.worldExtent_},i.prototype.getAxisOrientation=function(){return this.axisOrientation_},i.prototype.isGlobal=function(){return this.global_},i.prototype.setGlobal=function(t){this.global_=t,this.canWrapX_=!(!t||!this.extent_)},i.prototype.getDefaultTileGrid=function(){return this.defaultTileGrid_},i.prototype.setDefaultTileGrid=function(t){this.defaultTileGrid_=t},i.prototype.setExtent=function(t){this.extent_=t,this.canWrapX_=!(!this.global_||!t)},i.prototype.setWorldExtent=function(t){this.worldExtent_=t},i.prototype.setGetPointResolution=function(t){this.getPointResolutionFunc_=t},i.prototype.getPointResolutionFunc=function(){return this.getPointResolutionFunc_};const a=i;var s=6378137,c=Math.PI*s,l=[-c,-c,c,c],u=[-180,-85,180,85],p=function(t){function n(n){t.call(this,{code:n,units:o.METERS,extent:l,global:!0,worldExtent:u,getPointResolution:function(t,n){return t/e(n[1]/s)}})}return t&&(n.__proto__=t),n.prototype=Object.create(t&&t.prototype),n.prototype.constructor=n,n}(a),h=[new p("EPSG:3857"),new p("EPSG:102100"),new p("EPSG:102113"),new p("EPSG:900913"),new p("urn:ogc:def:crs:EPSG:6.18:3:3857"),new p("urn:ogc:def:crs:EPSG::3857"),new p("http://www.opengis.net/gml/srs/epsg.xml#3857")];var d,g,f,m=[-180,-90,180,90],y=6378137*Math.PI/180,v=function(t){function e(e,n){t.call(this,{code:e,units:o.DEGREES,extent:m,axisOrientation:n,global:!0,metersPerUnit:y,worldExtent:m})}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e}(a),_=[new v("CRS:84"),new v("EPSG:4326","neu"),new v("urn:ogc:def:crs:EPSG::4326","neu"),new v("urn:ogc:def:crs:EPSG:6.6:4326","neu"),new v("urn:ogc:def:crs:OGC:1.3:CRS84"),new v("urn:ogc:def:crs:OGC:2:84"),new v("http://www.opengis.net/gml/srs/epsg.xml#4326","neu"),new v("urn:x-ogc:def:crs:EPSG:4326","neu")],w={},E={};function S(t,e,n){var r=t.getCode(),o=e.getCode();r in E||(E[r]={}),E[r][o]=n}function L(t,e,n){var r;if(void 0!==e){for(var o=0,i=t.length;o<i;++o)e[o]=t[o];r=e}else r=t.slice();return r}function x(t,e,n){if(void 0!==e&&t!==e){for(var r=0,o=t.length;r<o;++r)e[r]=t[r];t=e}return t}function b(t){!function(t,e){w[t]=e}(t.getCode(),t),S(t,t,L)}function P(t){return"string"==typeof t?w[t]||null:t||null}function M(t){!function(t){t.forEach(b)}(t),t.forEach((function(e){t.forEach((function(t){e!==t&&S(e,t,L)}))}))}function R(t,e){return function(t,e,n){return function(t,e){return n=P(t),r=P(e),o=function(t,e){var n;return t in E&&e in E[t]&&(n=E[t][e]),n}(n.getCode(),r.getCode()),o||(o=x),o;var n,r,o}(e,n)(t,void 0,t.length)}(t,"EPSG:4326",void 0!==e?e:"EPSG:3857")}function I(t,e,n){const[r,o]=e,i=Math.floor(r),a=Math.floor(o),s=Math.ceil(r),c=Math.ceil(o),l=r-i,u=o-a,p=n[s+t*a],h=n[i+t*a],d=n[i+t*c];return(p-h)*l+(d-h)*u+(h+n[s+t*c]-p-d)*l*u+h}M(h),M(_),d=h,g=function(t,e,n){var r=t.length,o=n>1?n:2,i=e;void 0===i&&(i=o>2?t.slice():new Array(r));for(var a=c,l=0;l<r;l+=o){i[l]=a*t[l]/180;var u=s*Math.log(Math.tan(Math.PI*(t[l+1]+90)/360));u>a?u=a:u<-a&&(u=-a),i[l+1]=u}return i},f=function(t,e,n){var r=t.length,o=n>1?n:2,i=e;void 0===i&&(i=o>2?t.slice():new Array(r));for(var a=0;a<r;a+=o)i[a]=180*t[a]/c,i[a+1]=360*Math.atan(Math.exp(t[a+1]/s))/Math.PI-90;return i},_.forEach((function(t){d.forEach((function(e){S(t,e,g),S(e,t,f)}))}));class F{constructor(t,e,n,r,o){this.extent=function(t,e){return t.slice()}(o),this.dataWidth_=n,this.dataHeight_=r,this.speedBuffer_=new Float32Array(t.length),this.simpleSpeedBuffer=new Uint8Array(t.length),this.rotationBuffer_=new Float32Array(t.length),this.uBuffer_=t,this.vBuffer_=e;for(let n=0;n<t.length;++n){const r=t[n],o=e[n],i=Math.sqrt(r*r+o*o),a=Math.atan2(o,r);this.speedBuffer_[n]=i,this.simpleSpeedBuffer[n]=Math.ceil(i),this.rotationBuffer_[n]=a}}getUVSpeed(t){const e=this.dataWidth_,n=this.dataHeight_,r=function(t,e,n,r){return[(r[0]-t[0])/(t[2]-t[0])*(e-1),(Math.atan(Math.sinh(r[1]/6378137))*(180/Math.PI)+90)/180*(n-1)]}(this.extent,e,n,t);return[I(e,r,this.uBuffer_),I(e,r,this.vBuffer_)]}getRotation(t){return this.rotationBuffer_[t]}getSpeed(t){return this.speedBuffer_[t]}}var T="function"==typeof Object.assign?Object.assign:function(t,e){var n=arguments;if(null==t)throw new TypeError("Cannot convert undefined or null to object");for(var r=Object(t),o=1,i=arguments.length;o<i;++o){var a=n[o];if(null!=a)for(var s in a)a.hasOwnProperty(s)&&(r[s]=a[s])}return r};function O(t){for(var e in t)delete t[e]}function B(t,e,n,r){for(var o,i=0,a=t.length;i<a;++i)if((o=t[i]).listener===e&&o.bindTo===n)return r&&(o.deleteIndex=i),o}function k(t,e){var n=A(t);return n?n[e]:void 0}function A(t,e){var n=t.ol_lm;return!n&&e&&(n=t.ol_lm={}),n}function C(t,e){var n=k(t,e);if(n){for(var r=0,o=n.length;r<o;++r)t.removeEventListener(e,n[r].boundListener),O(n[r]);n.length=0;var i=A(t);i&&(delete i[e],0===Object.keys(i).length&&function(t){delete t.ol_lm}(t))}}function G(t,e,n,r,o){var i=A(t,!0),a=i[e];a||(a=i[e]=[]);var s=B(a,n,r,!1);return s?o||(s.callOnce=!1):(s={bindTo:r,callOnce:!!o,listener:n,target:t,type:e},t.addEventListener(e,function(t){var e=function(e){var n=t.listener,r=t.bindTo||t.target;return t.callOnce&&W(t),n.call(r,e)};return t.boundListener=e,e}(s)),a.push(s)),s}function z(t,e,n,r){return G(t,e,n,r,!0)}function $(t,e,n,r){var o=k(t,e);if(o){var i=B(o,n,r,!0);i&&W(i)}}function W(t){if(t&&t.target){t.target.removeEventListener(t.type,t.boundListener);var e=k(t.target,t.type);if(e){var n="deleteIndex"in t?t.deleteIndex:e.indexOf(t);-1!==n&&e.splice(n,1),0===e.length&&C(t.target,t.type)}O(t)}}const D="change";function U(){return function(){throw new Error("Unimplemented abstract method.")}()}var j=0;function K(t){return t.ol_uid||(t.ol_uid=String(++j))}var H=function(){this.disposed_=!1};H.prototype.dispose=function(){this.disposed_||(this.disposed_=!0,this.disposeInternal())},H.prototype.disposeInternal=function(){};const X=H;function V(){}var N=function(t){this.propagationStopped,this.type=t,this.target=null};N.prototype.preventDefault=function(){this.propagationStopped=!0},N.prototype.stopPropagation=function(){this.propagationStopped=!0};const q=N;var Y=function(t){function e(){t.call(this),this.pendingRemovals_={},this.dispatching_={},this.listeners_={}}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.addEventListener=function(t,e){var n=this.listeners_[t];n||(n=this.listeners_[t]=[]),-1===n.indexOf(e)&&n.push(e)},e.prototype.dispatchEvent=function(t){var e="string"==typeof t?new q(t):t,n=e.type;e.target=this;var r,o=this.listeners_[n];if(o){n in this.dispatching_||(this.dispatching_[n]=0,this.pendingRemovals_[n]=0),++this.dispatching_[n];for(var i=0,a=o.length;i<a;++i)if(!1===o[i].call(this,e)||e.propagationStopped){r=!1;break}if(--this.dispatching_[n],0===this.dispatching_[n]){var s=this.pendingRemovals_[n];for(delete this.pendingRemovals_[n];s--;)this.removeEventListener(n,V);delete this.dispatching_[n]}return r}},e.prototype.disposeInternal=function(){!function(t){var e=A(t);if(e)for(var n in e)C(t,n)}(this)},e.prototype.getListeners=function(t){return this.listeners_[t]},e.prototype.hasListener=function(t){return t?t in this.listeners_:Object.keys(this.listeners_).length>0},e.prototype.removeEventListener=function(t,e){var n=this.listeners_[t];if(n){var r=n.indexOf(e);t in this.pendingRemovals_?(n[r]=V,++this.pendingRemovals_[t]):(n.splice(r,1),0===n.length&&delete this.listeners_[t])}},e}(X);const Z=function(t){function e(){t.call(this),this.revision_=0}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.changed=function(){++this.revision_,this.dispatchEvent(D)},e.prototype.getRevision=function(){return this.revision_},e.prototype.on=function(t,e){if(Array.isArray(t)){for(var n=t.length,r=new Array(n),o=0;o<n;++o)r[o]=G(this,t[o],e);return r}return G(this,t,e)},e.prototype.once=function(t,e){if(Array.isArray(t)){for(var n=t.length,r=new Array(n),o=0;o<n;++o)r[o]=z(this,t[o],e);return r}return z(this,t,e)},e.prototype.un=function(t,e){if(Array.isArray(t))for(var n=0,r=t.length;n<r;++n)$(this,t[n],e);else $(this,t,e)},e}(Y);var J=function(t){function e(e,n,r){t.call(this,e),this.key=n,this.oldValue=r}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e}(q),Q={};function tt(t){return Q.hasOwnProperty(t)?Q[t]:Q[t]="change:"+t}const et="opacity",nt="visible",rt="extent",ot="zIndex",it="maxResolution",at="minResolution",st="source";var ct=function(t){function e(e){t.call(this);var n=T({},e);n[et]=void 0!==e.opacity?e.opacity:1,n[nt]=void 0===e.visible||e.visible,n[ot]=e.zIndex,n[it]=void 0!==e.maxResolution?e.maxResolution:1/0,n[at]=void 0!==e.minResolution?e.minResolution:0,this.setProperties(n),this.state_=null,this.type}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.getType=function(){return this.type},e.prototype.getLayerState=function(){var t,e=this.state_||{layer:this,managed:!0};return e.opacity=(t=this.getOpacity(),0,1,Math.min(Math.max(t,0),1)),e.sourceState=this.getSourceState(),e.visible=this.getVisible(),e.extent=this.getExtent(),e.zIndex=this.getZIndex()||0,e.maxResolution=this.getMaxResolution(),e.minResolution=Math.max(this.getMinResolution(),0),this.state_=e,e},e.prototype.getLayersArray=function(t){return U()},e.prototype.getLayerStatesArray=function(t){return U()},e.prototype.getExtent=function(){return this.get(rt)},e.prototype.getMaxResolution=function(){return this.get(it)},e.prototype.getMinResolution=function(){return this.get(at)},e.prototype.getOpacity=function(){return this.get(et)},e.prototype.getSourceState=function(){return U()},e.prototype.getVisible=function(){return this.get(nt)},e.prototype.getZIndex=function(){return this.get(ot)},e.prototype.setExtent=function(t){this.set(rt,t)},e.prototype.setMaxResolution=function(t){this.set(it,t)},e.prototype.setMinResolution=function(t){this.set(at,t)},e.prototype.setOpacity=function(t){this.set(et,t)},e.prototype.setVisible=function(t){this.set(nt,t)},e.prototype.setZIndex=function(t){this.set(ot,t)},e}(function(t){function e(e){t.call(this),K(this),this.values_={},void 0!==e&&this.setProperties(e)}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.get=function(t){var e;return this.values_.hasOwnProperty(t)&&(e=this.values_[t]),e},e.prototype.getKeys=function(){return Object.keys(this.values_)},e.prototype.getProperties=function(){return T({},this.values_)},e.prototype.notify=function(t,e){var n;n=tt(t),this.dispatchEvent(new J(n,t,e)),n="propertychange",this.dispatchEvent(new J(n,t,e))},e.prototype.set=function(t,e,n){if(n)this.values_[t]=e;else{var r=this.values_[t];this.values_[t]=e,r!==e&&this.notify(t,r)}},e.prototype.setProperties=function(t,e){for(var n in t)this.set(n,t[n],e)},e.prototype.unset=function(t,e){if(t in this.values_){var n=this.values_[t];delete this.values_[t],e||this.notify(t,n)}},e}(Z));var lt=function(t){function e(e){var n=T({},e);delete n.source,t.call(this,n),this.mapPrecomposeKey_=null,this.mapRenderKey_=null,this.sourceChangeKey_=null,e.map&&this.setMap(e.map),G(this,tt(st),this.handleSourcePropertyChange_,this);var r=e.source?e.source:null;this.setSource(r)}return t&&(e.__proto__=t),e.prototype=Object.create(t&&t.prototype),e.prototype.constructor=e,e.prototype.getLayersArray=function(t){var e=t||[];return e.push(this),e},e.prototype.getLayerStatesArray=function(t){var e=t||[];return e.push(this.getLayerState()),e},e.prototype.getSource=function(){return this.get(st)||null},e.prototype.getSourceState=function(){var t=this.getSource();return t?t.getState():"undefined"},e.prototype.handleSourceChange_=function(){this.changed()},e.prototype.handleSourcePropertyChange_=function(){this.sourceChangeKey_&&(W(this.sourceChangeKey_),this.sourceChangeKey_=null);var t=this.getSource();t&&(this.sourceChangeKey_=G(t,D,this.handleSourceChange_,this)),this.changed()},e.prototype.setMap=function(t){this.mapPrecomposeKey_&&(W(this.mapPrecomposeKey_),this.mapPrecomposeKey_=null),t||this.changed(),this.mapRenderKey_&&(W(this.mapRenderKey_),this.mapRenderKey_=null),t&&(this.mapPrecomposeKey_=G(t,"precompose",(function(t){var e=t,n=this.getLayerState();n.managed=!1,void 0===this.getZIndex()&&(n.zIndex=1/0),e.frameState.layerStatesArray.push(n),e.frameState.layerStates[K(this)]=n}),this),this.mapRenderKey_=G(this,D,t.render,t),this.changed())},e.prototype.setSource=function(t){this.set(st,t)},e}(ct);const ut=lt;function pt(t,e){let[n,r]=t.size;if(n*=t.pixelRatio,r*=t.pixelRatio,e.width!==n||e.height!==r)return e.width=n,e.height=r,!0}function ht(t,e){var n=e[0],r=e[1];return e[0]=t[0]*n+t[2]*r+t[4],e[1]=t[1]*n+t[3]*r+t[5],e}new Array(6);const dt=[];class gt extends Z{constructor(t){super(),this.layer=t,this.canvases_=[document.createElement("canvas"),document.createElement("canvas")],this.previousFrame_={canvasId:0,centerX:0,centerY:0,resolution:1/0}}static handles(t){return t instanceof ft}static create(t,e){return new gt(e)}prepareFrame(t){const e=this.layer,n=this.canvases_[this.previousFrame_.canvasId];let r=n;const o=pt(t,n);let i=this.previousFrame_.canvasId;const[a,s]=t.viewState.center,c=t.viewState.resolution;if(!o&&this.previousFrame_.resolution===c){dt[0]=this.previousFrame_.centerX,dt[1]=this.previousFrame_.centerY,ht(t.coordinateToPixelTransform,dt);const e=dt[0]-t.size[0]/2,o=dt[1]-t.size[1]/2;if(0!==e||0!==o){i=(i+1)%2,r=this.canvases_[i],pt(t,r);const a=r.getContext("2d");a.clearRect(0,0,r.width,r.height),a.drawImage(n,e,o)}}this.previousFrame_.canvasId=i,this.previousFrame_.centerX=a,this.previousFrame_.centerY=s,this.previousFrame_.resolution=c;const l=r.getContext("2d");return e.doRender_(t,l),t.animate=!0,!0}composeFrame(t,e,n){const r=this.canvases_[this.previousFrame_.canvasId],o=r.width,i=r.height;n.drawImage(r,0,0,o,i)}}class ft extends ut{constructor(t){super({}),this.doRender_=t.renderFunction}getSourceState(){return"ready"}}function mt(t,e){var n,r;e[0]=Math.random()*function(t){return t[2]-t[0]}(t)+t[0],e[1]=(n=Math.random(),r=Math.PI*(n-.5),Math.log(Math.tan(Math.PI/4+r/2))/Math.PI*20037508.34)}class yt extends ft{constructor(t){super({renderFunction:(e,n)=>{let r;return r=t.uvBuffer1?"dimgray":4==t.brightMode?"#777777":"white",this.render(e,n,r)}}),this.fading=t.fading||.8,console.assert(t.ttl),this.ttl=t.ttl,console.assert(t.map),this.map=t.map,console.assert(t.particleSize1),console.assert(t.particleSize2),this.particleSize1=t.particleSize1,this.particleSize2=t.particleSize2;const e=[t.uvBuffer1,t.uvBuffer2,t.uvBuffer3];for(const t of e)if(t){console.assert(t),this.uvBuffer=t;break}console.assert(t.particles),this.particles=new Array(t.particles);for(let e=0;e<t.particles;++e)this.particles[e]={ttl:Math.random()*this.ttl,coordinates:[]};this.pixel=[],this.viewportWithDataExtent=[1/0,1/0,-1/0,-1/0],this.map.getRenderer().registerLayerRenderers([gt])}render(t,e,n){const r=e.canvas;e.fillStyle=n,this.advanceParticles(t,e),e.globalAlpha=this.fading,e.globalCompositeOperation="destination-in",e.fillRect(0,0,r.width,r.height),e.globalAlpha=1,e.globalCompositeOperation="source-over"}advanceParticles(t,e){if(r=this.uvBuffer.extent,o=t.extent,i=this.viewportWithDataExtent,a=i||[1/0,1/0,-1/0,-1/0],function(t,e){return t[0]<=e[2]&&t[2]>=e[0]&&t[1]<=e[3]&&t[3]>=e[1]}(r,o)?(r[0]>o[0]?a[0]=r[0]:a[0]=o[0],r[1]>o[1]?a[1]=r[1]:a[1]=o[1],r[2]<o[2]?a[2]=r[2]:a[2]=o[2],r[3]<o[3]?a[3]=r[3]:a[3]=o[3]):function(t){!function(t,e,n,r,o){o&&(o[0]=t,o[1]=e,o[2]=n,o[3]=r)}(1/0,1/0,-1/0,-1/0,t)}(a),(n=this.viewportWithDataExtent)[2]<n[0]||n[3]<n[1])return;var n,r,o,i,a;const s=this.pixel,c=t.viewState.resolution,l=t.pixelRatio;this.particles.forEach((n=>{var r;0!==n.coordinates.length&&function(t,e,n){return t[0]<=e&&e<=t[2]&&t[1]<=n&&n<=t[3]}(this.viewportWithDataExtent,(r=n.coordinates)[0],r[1])||mt(this.viewportWithDataExtent,n.coordinates),s[0]=n.coordinates[0],s[1]=n.coordinates[1];const[o,i]=this.uvBuffer.getUVSpeed(n.coordinates);if(0!==o&&0!==i){ht(t.coordinateToPixelTransform,s);const r=function(t,e){return Math.atan2(t,e)*(180/Math.PI)}(o,i);e.save(),e.translate(s[0]*l,s[1]*l),e.rotate(r*Math.PI/180),n.ttl>this.ttl/2?e.globalAlpha=2*(1-n.ttl/this.ttl):e.globalAlpha=n.ttl/this.ttl*2,e.fillRect(-this.particleSize1*l/2,-this.particleSize2*l/2,this.particleSize1*l,this.particleSize2*l),e.restore()}--n.ttl,n.ttl<0&&(mt(this.viewportWithDataExtent,n.coordinates),n.ttl=this.ttl),n.coordinates[0]+=o*c,n.coordinates[1]+=i*c}))}}let vt,_t,wt,Et,St,Lt,xt,bt,Pt,Mt,Rt=.5,It=4,Ft=null,Tt=null,Ot=1,Bt=new Date;var kt,At,Ct,Gt,zt;function $t(){Wt(!0),document.getElementById("weatherTime").innerText=Xt(Bt),Lt||xt||bt?qt(!1):(Pt||Mt)&&qt(!0)}function Wt(t){if(4!=Ot&&(map.removeLayer(vt),vt=null),Lt)t||(Lt=!1),map.removeLayer(wt),wt=null;else if(xt)t||(xt=!1),map.removeLayer(Et),Et=null;else if(bt)t||(bt=!1),map.removeLayer(St),St=null;else if((Pt||Mt)&&(Pt?(t||(Pt=!1),map.removeLayer(Ft),Ft=null):Mt&&(t||(Mt=!1),map.removeLayer(Tt),Tt=null),!t)){const t=document.querySelector("#tempLegend");t&&t.remove()}}kt=document.getElementById("checkWind"),At=document.getElementById("checkFlow"),Ct=document.getElementById("checkWave"),Gt=document.getElementById("checkTempair"),zt=document.getElementById("checkTempwater"),kt.addEventListener("change",(function(){kt.checked&&(Wt(!1),Lt=!0,qt(!1))})),At.addEventListener("change",(function(){At.checked&&(Wt(!1),xt=!0,qt(!1))})),Ct.addEventListener("change",(function(){Ct.checked&&(Wt(!1),bt=!0,qt(!1))})),Gt.addEventListener("change",(function(){Gt.checked&&(Wt(!1),Pt=!0,qt(!0),Ut())})),zt.addEventListener("change",(function(){zt.checked&&(Wt(!1),Mt=!0,qt(!0),Ut())})),map.on("movestart",(function(){4!=Ot&&(map.removeLayer(vt),vt=null),Lt?(map.removeLayer(wt),wt=null):xt?(map.removeLayer(Et),Et=null):bt&&(map.removeLayer(St),St=null)})),map.on("moveend",(function(){jt(),(Lt||xt||bt)&&(Lt?(map.removeLayer(wt),wt=null):xt?(map.removeLayer(Et),Et=null):bt&&(map.removeLayer(St),St=null),qt(!1))})),map.getView().on("change:resolution",(function(){It=map.getView().getZoom(),clearTimeout(Kt),Kt=setTimeout((function(){Number.isInteger(It)&&jt()}),250)})),function(){let t=null;document.querySelectorAll(".customRadio").forEach((function(e){e.addEventListener("click",(function(){this===t?(this.checked=!1,t=null,Wt(!1),4!=Ot&&map.removeLayer(vt),Lt?(Lt=!1,map.removeLayer(wt)):xt?(xt=!1,map.removeLayer(Et)):bt?(bt=!1,map.removeLayer(St)):(Pt||Mt)&&(Pt?(Pt=!1,map.removeLayer(Ft)):Mt&&(Mt=!1,map.removeLayer(Tt)),document.querySelector("#tempLegend").remove())):t=this}))}))}(),document.getElementById("weatherTime").innerText=Xt(Bt),document.getElementById("timeMinus12").addEventListener("click",(function(){Vt(-12),$t()})),document.getElementById("timeMinus3").addEventListener("click",(function(){Vt(-3),$t()})),document.getElementById("timeNow").addEventListener("click",(function(){Bt=new Date,$t()})),document.getElementById("timePlus3").addEventListener("click",(function(){Vt(3),$t()})),document.getElementById("timePlus12").addEventListener("click",(function(){Vt(12),$t()})),document.getElementById("selectDate").addEventListener("change",(function(t){let e=new Date(t.target.value);Bt=e,$t()})),window.navigation.addEventListener("navigate",(t=>{const e=document.querySelector("#tempLegend");null!=e&&e.remove()}));const Dt=document.createElement("div");function Ut(){Dt.id="tempLegend",Dt.style.position="absolute",Dt.style.top="105px",Dt.style.right="0px",Dt.style.width="45px",Dt.style.height="162px",Dt.style.backgroundImage="url(images/emap/legend_temp.png)",Dt.style.opacity="1",document.body.appendChild(Dt)}function jt(){Rt=0===It?1:.5}let Kt;function Ht(){switch(console.log("lev : "+It),It){case 5:_t=400;break;case 6:_t=600;break;case 7:_t=1100;break;case 8:_t=2200;break;case 9:_t=3900;break;case 10:_t=7800;break;case 11:case 12:_t=16e3;break;case 13:_t=32e3;break;case 14:_t=64e3;break;case 15:_t=128e3;break;default:_t=300}console.log("radius : "+_t)}function Xt(t){let e=t.getFullYear(),n=t.getMonth()+1,r=t.getDate();n=n<10?"0"+n:n,r=r<10?"0"+r:r;let o=t.getHours();return o=3*parseInt(o/3)+"시",o=o<10?"0"+o:o,e+"-"+n+"-"+r+" "+o}function Vt(t){Bt.setHours(Bt.getHours()+t)}let Nt=null;function qt(e){let n=Xt(Bt);let r=[1/0,1/0,-1/0,-1/0];!async function(n){Nt&&Nt.abort(),Nt=new AbortController;const{signal:a}=Nt;let s=map.getView().calculateExtent(map.getSize()),c=ol.proj.transform(ol.extent.getBottomLeft(s),"EPSG:3857","EPSG:4326"),l=ol.proj.transform(ol.extent.getTopRight(s),"EPSG:3857","EPSG:4326"),u=90,p=c[0],h=l[0];e&&(u=l[1]+Rt,p-=Rt);let d,g=n.slice(0,10).replace(/-/g,""),f=n.slice(11,13);f.endsWith("시")&&(f=f.charAt(0)),Lt?d=baseUrl+`/api/weather/wind?date=${g}&time=${f}&lat1=-90&lat2=${u}&lon1=${p}&lon2=${h}&degree=${Rt}&data=0`:xt||bt?d=baseUrl+`/api/weather/all?date=${g}&time=${f}&lat1=-90&lat2=${u}&lon1=${p}&lon2=${h}&degree=${Rt}&data=0`:Pt?d=baseUrl+`/api/weather/tempair?date=${g}&time=${f}&lat1=-90&lat2=${u}&lon1=${p}&lon2=${h}&degree=${Rt}&data=0`:Mt&&(d=baseUrl+`/api/weather/tempwater?date=${g}&time=${f}&lat1=-90&lat2=${u}&lon1=${p}&lon2=${h}&degree=${Rt}&data=0`);let m=document.getElementById("weatherStatus");m.innerHTML="기상 데이터 다운로드 중입니다.";try{await async function(t,e,n){let r=0;let a=document.getElementById("weatherStatus");for(r=0;r<3;r++){const n=new AbortController,s=n.signal,c=fetch(t,{...e,signal:s}),l=setTimeout((()=>n.abort()),3e4);try{const t=await c;return clearTimeout(l),t.ok||(a.innerHTML="서버 응답이 없습니다."),o=await t.json(),a.innerHTML="",i=!0,void console.log("tempOK",i)}catch(t){clearTimeout(l),r<2?(t.name,a.innerHTML=`데이터 다운로드 재시도 (${r+1})`):a.innerHTML="잠시 후에 다시 시도해 주세요."}}}(d,{signal:a});let n=0,s=0;if(!e){var y=new Set,v=new Set;o.forEach((function(t){t.hasOwnProperty("lat")&&y.add(t.lat),t.hasOwnProperty("lon")&&v.add(t.lon)})),n=v.size,s=y.size}i&&(function(e,n,i){if(Lt?(map.removeLayer(wt),wt=null):xt?(map.removeLayer(Et),Et=null):bt&&(map.removeLayer(St),St=null),!e){const a=[],s=[];function c(t,e){return t.map((t=>t[e]))}const l=c(o,"lat"),u=c(o,"lon");let p,h,d,g,f,m,y;Lt?(p=c(o,"ugrd10m"),h=c(o,"vgrd10m"),o=null):xt?(p=c(o,"u_current"),h=c(o,"v_current"),o=null):bt&&(p=c(o,"fwaveu"),h=c(o,"fwavev"),o=null);for(let v=0;v<l.length;v++){const _=R([parseFloat(u[v]),parseFloat(l[v])]);let w,E;Lt?(w=p[v]/5,E=h[v]/5,a.push(w),s.push(E)):xt?(w=p[v],E=h[v],a.push(w),s.push(E)):bt&&(w=p[v]/70,E=h[v]/70,a.push(w),s.push(E)),t(r,_)}(Lt||xt||bt)&&(d=new Float32Array(a),g=new Float32Array(s),Lt?f=new F(d,g,n,i,r):xt?m=new F(d,g,n,i,r):y=new F(d,g,n,i,r)),Lt?wt=new yt({map,uvBuffer1:f,particles:1e4,fading:.98,ttl:400,particleSize1:1.5,particleSize2:1.5,brightMode:Ot}):xt?Et=new yt({map,uvBuffer2:m,particles:2e4,fading:.95,ttl:400,particleSize1:1.5,particleSize2:1.5,brightMode:Ot}):bt&&(St=new yt({map,uvBuffer3:y,particles:1e4,fading:.45,ttl:150,particleSize1:6,particleSize2:3,brightMode:Ot}))}Lt?map.addLayer(wt):xt?map.addLayer(Et):bt?(map.addLayer(St),Yt()):Pt?(null!=Ft&&(map.removeLayer(Ft),Ft=null),Ft=new ol.layer.Image({id:"tb_tempair",title:"tb_tempair",opacity:.5,source:new ol.source.ImageWMS({url:geoserverWmsUrl,serverType:"geoserver",crossOrigin:"anonymous",params:{VERSION:"1.3.0",LAYERS:"emap:tb_tempair",CRS:"EPSG:4326"}})}),map.addLayer(Ft),Ht(),Zt("tb_tempair",_t),4==Ot&&vt.setZIndex(-1)):Mt&&(null!=Tt&&(map.removeLayer(Tt),Tt=null),Tt=new ol.layer.Image({id:"tb_tempwater",title:"tb_tempwater",opacity:1,source:new ol.source.ImageWMS({url:geoserverWmsUrl,serverType:"geoserver",crossOrigin:"anonymous",params:{VERSION:"1.3.0",LAYERS:"emap:tb_tempwater",CRS:"EPSG:4326"}})}),map.addLayer(Tt),Ht(),Zt("tb_tempwater",_t),Yt())}(e,n,s),m.innerHTML="")}catch(t){return}}(n);let o,i=!1}function Yt(){4==Ot&&vt.setZIndex(1)}function Zt(t,e){var n="\t\t\t\t<?xml version='1.0' encoding='ISO-8859-1'?>\t\t\t\t<StyledLayerDescriptor version='1.0.0'\t\t\t\t\txsi:schemaLocation='http://www.opengis.net/sld StyledLayerDescriptor.xsd'\t\t\t\t\txmlns='http://www.opengis.net/sld' \t\t\t\t\txmlns:ogc='http://www.opengis.net/ogc'\t\t\t\t\txmlns:xlink='http://www.w3.org/1999/xlink'\t\t\t\t\txmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>\t\t\t\t<NamedLayer>\t\t\t\t\t<Name>emap:"+t+"</Name>\t\t\t\t\t<UserStyle>\t\t\t\t\t<Title>Heatmap</Title>\t\t\t\t\t<Abstract>A heatmap surface showing population density</Abstract>\t\t\t\t\t<FeatureTypeStyle>\t\t\t\t\t\t<Transformation>\t\t\t\t\t\t<ogc:Function name='vec:Heatmap'>\t\t\t\t\t\t\t<ogc:Function name='parameter'>\t\t\t\t\t\t\t<ogc:Literal>data</ogc:Literal>\t\t\t\t\t\t\t</ogc:Function>\t\t\t\t\t\t\t<ogc:Function name='parameter'>\t\t\t\t\t\t\t<ogc:Literal>weightAttr</ogc:Literal>\t\t\t\t\t\t\t<ogc:Literal>temp</ogc:Literal>\t\t\t\t\t\t\t</ogc:Function>\t\t\t\t\t\t\t<ogc:Function name='parameter'>\t\t\t\t\t\t\t<ogc:Literal>radiusPixels</ogc:Literal>\t\t\t\t\t\t\t<ogc:Function name='env'>\t\t\t\t\t\t\t\t<ogc:Literal>radius</ogc:Literal>\t\t\t\t\t\t\t\t<ogc:Literal>"+e+"</ogc:Literal>\t\t\t\t\t\t\t</ogc:Function>\t\t\t\t\t\t\t</ogc:Function>\t\t\t\t\t\t\t<ogc:Function name='parameter'>\t\t\t\t\t\t\t<ogc:Literal>pixelsPerCell</ogc:Literal>\t\t\t\t\t\t\t<ogc:Literal>20</ogc:Literal>\t\t\t\t\t\t\t</ogc:Function>\t\t\t\t\t\t\t<ogc:Function name='parameter'>\t\t\t\t\t\t\t<ogc:Literal>outputBBOX</ogc:Literal>\t\t\t\t\t\t\t<ogc:Function name='env'>\t\t\t\t\t\t\t\t<ogc:Literal>wms_bbox</ogc:Literal>\t\t\t\t\t\t\t</ogc:Function>\t\t\t\t\t\t\t</ogc:Function>\t\t\t\t\t\t\t<ogc:Function name='parameter'>\t\t\t\t\t\t\t<ogc:Literal>outputWidth</ogc:Literal>\t\t\t\t\t\t\t<ogc:Function name='env'>\t\t\t\t\t\t\t\t<ogc:Literal>wms_width</ogc:Literal>\t\t\t\t\t\t\t</ogc:Function>\t\t\t\t\t\t\t</ogc:Function>\t\t\t\t\t\t\t<ogc:Function name='parameter'>\t\t\t\t\t\t\t<ogc:Literal>outputHeight</ogc:Literal>\t\t\t\t\t\t\t<ogc:Function name='env'>\t\t\t\t\t\t\t\t<ogc:Literal>wms_height</ogc:Literal>\t\t\t\t\t\t\t</ogc:Function>\t\t\t\t\t\t\t</ogc:Function>\t\t\t\t\t\t</ogc:Function>\t\t\t\t\t\t</Transformation>\t\t\t\t\t<Rule>\t\t\t\t\t\t<RasterSymbolizer>\t\t\t\t\t\t<Geometry>\t\t\t\t\t\t\t<ogc:PropertyName>the_geom</ogc:PropertyName></Geometry>\t\t\t\t\t\t<Opacity>0.3</Opacity>\t\t\t\t\t\t<ColorMap type='ramp'>\t\t\t\t\t\t\t<ColorMapEntry color='#bbebf4' quantity='0'/>\t\t\t\t\t\t\t<ColorMapEntry color='#9fefb7' quantity='0.33'/>\t\t\t\t\t\t\t<ColorMapEntry color='#e4ef97' quantity='0.66'/>\t\t\t\t\t\t\t<ColorMapEntry color='#ec6767' quantity='1'/>\t\t\t\t\t\t</ColorMap>\t\t\t\t\t\t</RasterSymbolizer>\t\t\t\t\t\t</Rule>\t\t\t\t\t</FeatureTypeStyle>\t\t\t\t\t</UserStyle>\t\t\t\t</NamedLayer>\t\t\t\t</StyledLayerDescriptor>\t\t\t\t";getLayer(t).getSource().updateParams({STYLES:"",SLD_BODY:n})}})();