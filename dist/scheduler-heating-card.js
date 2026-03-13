function t(t,e,i,s){var o,r=arguments.length,n=r<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,s);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(r<3?o(n):r>3?o(e,i,n):o(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let r=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(i,t,s)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:l,defineProperty:h,getOwnPropertyDescriptor:d,getOwnPropertyNames:c,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,g=_.trustedTypes,f=g?g.emptyScript:"",v=_.reactiveElementPolyfillSupport,m=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!l(t,e),x={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&h(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);o?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const t=this.properties,e=[...c(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const r=o.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,o){if(void 0!==t){const r=this.constructor;if(!1===s&&(o=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??$)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[m("elementProperties")]=new Map,b[m("finalized")]=new Map,v?.({ReactiveElement:b}),(_.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,A=t=>t,S=w.trustedTypes,E=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,P="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+k,T=`<${C}>`,M=document,O=()=>M.createComment(""),R=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,z="[ \t\n\f\r]",D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,H=/>/g,V=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,j=/"/g,L=/^(?:script|style|textarea|title)$/i,W=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),B=W(1),q=W(2),Y=Symbol.for("lit-noChange"),X=Symbol.for("lit-nothing"),F=new WeakMap,G=M.createTreeWalker(M,129);function J(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const K=(t,e)=>{const i=t.length-1,s=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=D;for(let e=0;e<i;e++){const i=t[e];let a,l,h=-1,d=0;for(;d<i.length&&(n.lastIndex=d,l=n.exec(i),null!==l);)d=n.lastIndex,n===D?"!--"===l[1]?n=N:void 0!==l[1]?n=H:void 0!==l[2]?(L.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=V):void 0!==l[3]&&(n=V):n===V?">"===l[0]?(n=o??D,h=-1):void 0===l[1]?h=-2:(h=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?V:'"'===l[3]?j:I):n===j||n===I?n=V:n===N||n===H?n=D:(n=V,o=void 0);const c=n===V&&t[e+1].startsWith("/>")?" ":"";r+=n===D?i+T:h>=0?(s.push(a),i.slice(0,h)+P+i.slice(h)+k+c):i+k+(-2===h?e:c)}return[J(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Z{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[l,h]=K(t,e);if(this.el=Z.createElement(l,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=G.nextNode())&&a.length<n;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(P)){const e=h[r++],i=s.getAttribute(t).split(k),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:i,ctor:"."===n[1]?st:"?"===n[1]?ot:"@"===n[1]?rt:it}),s.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:o}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(k),e=t.length-1;if(e>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],O()),G.nextNode(),a.push({type:2,index:++o});s.append(t[e],O())}}}else if(8===s.nodeType)if(s.data===C)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(k,t+1));)a.push({type:7,index:o}),t+=k.length-1}o++}}static createElement(t,e){const i=M.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,s){if(e===Y)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const r=R(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=Q(t,o._$AS(t,e.values),o,s)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??M).importNode(e,!0);G.currentNode=s;let o=G.nextNode(),r=0,n=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new et(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new nt(o,this,t)),this._$AV.push(e),a=i[++n]}r!==a?.index&&(o=G.nextNode(),r++)}return G.currentNode=M,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=X,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),R(t)?t===X||null==t||""===t?(this._$AH!==X&&this._$AR(),this._$AH=X):t!==this._$AH&&t!==Y&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==X&&R(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(J(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new tt(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new Z(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new et(this.O(O()),this.O(O()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=X,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=X}_$AI(t,e=this,i,s){const o=this.strings;let r=!1;if(void 0===o)t=Q(this,t,e,0),r=!R(t)||t!==this._$AH&&t!==Y,r&&(this._$AH=t);else{const s=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=Q(this,s[i+n],e,n),a===Y&&(a=this._$AH[n]),r||=!R(a)||a!==this._$AH[n],a===X?t=X:t!==X&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!s&&this.j(t)}j(t){t===X?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===X?void 0:t}}class ot extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==X)}}class rt extends it{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??X)===Y)return;const i=this._$AH,s=t===X&&i!==X||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==X&&(i===X||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(Z,et),(w.litHtmlVersions??=[]).push("3.3.2");const lt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ht extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new et(e.insertBefore(O(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Y}}ht._$litElement$=!0,ht.finalized=!0,lt.litElementHydrateSupport?.({LitElement:ht});const dt=lt.litElementPolyfillSupport;dt?.({LitElement:ht}),(lt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ct=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},pt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:$},ut=(t=pt,e,i)=>{const{kind:s,metadata:o}=i;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),r.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,o,t,!0,i)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];e.call(this,i),this.requestUpdate(s,o,t,!0,i)}}throw Error("Unsupported decorator location: "+s)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function _t(t){return(e,i)=>"object"==typeof i?ut(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function gt(t){return _t({...t,state:!0,attribute:!1})}const ft=20,vt=20,mt=40,yt=48,$t=1440;function xt(t){const[e,i]=t.split(":").map(Number);return 60*e+i}function bt(t){const e=Math.floor(t/60),i=t%60;return`${String(e).padStart(2,"0")}:${String(i).padStart(2,"0")}`}function wt(t,e){return Math.round(t/e)*e}let At=class extends ht{constructor(){super(...arguments),this.points=[],this.minValue=5,this.maxValue=30,this.valueStep=.5,this.unit="°C",this._width=600,this._height=300,this._dragging=null,this._hovering=null,this._editingIdx=null,this._svgRef=null,this._resizeObserver=null,this._tapTimers=new Map}connectedCallback(){super.connectedCallback(),this._resizeObserver=new ResizeObserver(()=>this._measureSize()),this._resizeObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect()}_measureSize(){const t=this.offsetWidth||600;this._width=t,this._height=Math.max(200,Math.min(320,.45*t))}get _iw(){return this._width-yt-vt}get _ih(){return this._height-ft-mt}_xToMinutes(t){return wt(0+t/this._iw*$t,15)}_minutesToX(t){return(t-0)/$t*this._iw}_yToValue(t){return wt(this.maxValue-t/this._ih*(this.maxValue-this.minValue),this.valueStep)}_valueToY(t){return(this.maxValue-t)/(this.maxValue-this.minValue)*this._ih}_eventToSVGPoint(t){if(!this._svgRef)return null;const e=this._svgRef.getBoundingClientRect();let i,s;if(t instanceof TouchEvent){const e=t.touches[0]??t.changedTouches[0];if(!e)return null;i=e.clientX,s=e.clientY}else i=t.clientX,s=t.clientY;return{x:i-e.left-yt,y:s-e.top-ft}}_sorted(){return[...this.points].sort((t,e)=>xt(t.time)-xt(e.time))}_emit(){this.dispatchEvent(new CustomEvent("points-changed",{detail:[...this.points],bubbles:!0,composed:!0}))}_onCanvasPointerDown(t){if(null!==this._dragging)return;const e=this._eventToSVGPoint(t);if(!e)return;if(e.x<0||e.x>this._iw||e.y<0||e.y>this._ih)return;const i=this._xToMinutes(e.x),s=Math.max(this.minValue,Math.min(this.maxValue,this._yToValue(e.y))),o=bt(i);this.points.some(t=>t.time===o)||(this.points=[...this.points,{time:o,value:s}],this._emit())}_onDotPointerDown(t,e){t.stopPropagation(),t.preventDefault(),this._dragging=e,t.currentTarget.setPointerCapture(t.pointerId)}_onDotPointerMove(t,e){if(this._dragging!==e)return;const i=this._eventToSVGPoint(t);if(!i)return;const s=Math.max(0,Math.min(1425,this._xToMinutes(i.x))),o=Math.max(this.minValue,Math.min(this.maxValue,this._yToValue(Math.max(0,Math.min(this._ih,i.y))))),r=bt(s),n=[...this.points];n[e]={time:r,value:o},this.points=n,this._emit()}_onDotPointerUp(t,e){this._dragging===e&&(this._dragging=null)}_onDotClick(t,e){if(t.stopPropagation(),this._tapTimers.has(e))clearTimeout(this._tapTimers.get(e)),this._tapTimers.delete(e),this._editingIdx=e;else{const t=setTimeout(()=>{this._tapTimers.delete(e)},300);this._tapTimers.set(e,t)}}_deleteDot(t){const e=[...this.points];e.splice(t,1),this.points=e,this._editingIdx=null,this._emit()}_updateDotFromEditor(t,e,i){const s=[...this.points];if("time"===e)s[t]={...s[t],time:i};else{const e=Math.max(this.minValue,Math.min(this.maxValue,parseFloat(i)));s[t]={...s[t],value:isNaN(e)?s[t].value:e}}this.points=s,this._emit()}_renderGrid(){const t=[],e=this.valueStep<=.5?5:2*this.valueStep;for(let i=this.minValue;i<=this.maxValue;i+=e){const e=this._valueToY(i);t.push(q`
        <line x1="0" y1="${e}" x2="${this._iw}" y2="${e}" class="grid-line" />
        <text x="-6" y="${e+4}" class="axis-label" text-anchor="end">${i}</text>
      `)}for(let e=0;e<=24;e+=2){const i=this._minutesToX(60*e);t.push(q`
        <line x1="${i}" y1="0" x2="${i}" y2="${this._ih}" class="grid-line" />
        <text x="${i}" y="${this._ih+18}" class="axis-label" text-anchor="middle">${String(e).padStart(2,"0")}:00</text>
      `)}return t}_renderStepLine(t){if(0===t.length)return q``;let e="";t.forEach((i,s)=>{const o=this._minutesToX(xt(i.time)),r=this._valueToY(i.value);if(0===s)e+=`M 0 ${r} H ${o}`;else{const i=this._valueToY(t[s-1].value);e+=` V ${i} H ${o}`}});const i=this._valueToY(t[t.length-1].value);return e+=` V ${i} H ${this._iw}`,q`<path d="${e}" class="step-line" />`}_renderDots(t){return t.map((t,e)=>{const i=this._minutesToX(xt(t.time)),s=this._valueToY(t.value),o=this.points.indexOf(t),r=this._hovering===o,n=this._dragging===o;return q`
        <g class="dot-group"
          @pointerdown="${t=>this._onDotPointerDown(t,o)}"
          @pointermove="${t=>this._onDotPointerMove(t,o)}"
          @pointerup="${t=>this._onDotPointerUp(t,o)}"
          @click="${t=>this._onDotClick(t,o)}"
          @pointerenter="${()=>this._hovering=o}"
          @pointerleave="${()=>this._hovering=null}"
        >
          <circle cx="${i}" cy="${s}" r="${n?14:r?12:10}"
            class="dot ${n?"dot--drag":""}" />
          <text x="${i}" y="${s-15}" class="dot-label" text-anchor="middle">
            ${t.time} ${t.value}${this.unit}
          </text>
        </g>
      `})}_renderEditPopover(t){const e=this.points[t];if(!e)return B``;const i=yt+this._minutesToX(xt(e.time)),s=ft+this._valueToY(e.value),o=Math.min(i,this._width-200);return B`
      <div class="popover" style="left:${o}px;top:${s<100?s+20:s-110}px">
        <div class="popover-row">
          <label>Time</label>
          <input type="time" .value="${e.time}"
            @change="${e=>this._updateDotFromEditor(t,"time",e.target.value)}" />
        </div>
        <div class="popover-row">
          <label>Value</label>
          <input type="number" .value="${String(e.value)}"
            min="${this.minValue}" max="${this.maxValue}" step="${this.valueStep}"
            @change="${e=>this._updateDotFromEditor(t,"value",e.target.value)}" />
        </div>
        <div class="popover-actions">
          <button class="btn-delete" @click="${()=>this._deleteDot(t)}">Delete</button>
          <button class="btn-close" @click="${()=>this._editingIdx=null}">Done</button>
        </div>
      </div>
    `}firstUpdated(t){this._svgRef=this.shadowRoot?.querySelector("svg")??null,this._measureSize()}render(){const t=this._sorted();return B`
      <div class="container">
        <svg
          width="${this._width}"
          height="${this._height}"
          @pointerdown="${this._onCanvasPointerDown}"
          style="touch-action:none;cursor:crosshair"
        >
          <g transform="translate(${yt},${ft})">
            ${this._renderGrid()}
            ${this._renderStepLine(t)}
            ${this._renderDots(t)}
          </g>
          <!-- Unit label -->
          <text x="10" y="${this._height/2}" class="axis-unit"
            transform="rotate(-90,10,${this._height/2})">${this.unit}</text>
        </svg>
        ${null!==this._editingIdx?this._renderEditPopover(this._editingIdx):""}
        <p class="hint">Tap to add a point • Drag to move • Double-tap to edit/delete</p>
      </div>
    `}};At.styles=n`
    :host {
      display: block;
      position: relative;
      font-family: var(--primary-font-family, sans-serif);
    }
    .container {
      position: relative;
      user-select: none;
      -webkit-user-select: none;
    }
    svg { display: block; overflow: visible; }

    .grid-line { stroke: var(--divider-color, #e0e0e0); stroke-width: 1; }
    .axis-label { font-size: 11px; fill: var(--secondary-text-color, #888); }
    .axis-unit {
      font-size: 11px;
      fill: var(--secondary-text-color, #888);
      text-anchor: middle;
    }

    .step-line {
      fill: none;
      stroke: var(--primary-color, #03a9f4);
      stroke-width: 2.5;
      stroke-linejoin: round;
    }

    .dot {
      fill: var(--primary-color, #03a9f4);
      stroke: white;
      stroke-width: 2.5;
      cursor: grab;
      transition: r 0.1s;
    }
    .dot--drag { cursor: grabbing; }

    .dot-label {
      font-size: 11px;
      fill: var(--primary-text-color, #212121);
      pointer-events: none;
      paint-order: stroke;
      stroke: white;
      stroke-width: 3px;
    }

    .popover {
      position: absolute;
      background: var(--card-background-color, #fff);
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 12px;
      padding: 12px 14px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.18);
      z-index: 10;
      min-width: 180px;
    }
    .popover-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    .popover-row label {
      font-size: 13px;
      color: var(--secondary-text-color, #888);
      min-width: 44px;
    }
    .popover-row input {
      flex: 1;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      padding: 6px 8px;
      font-size: 15px;
      min-height: 36px;
      background: var(--input-fill-color, #f5f5f5);
      color: var(--primary-text-color, #212121);
      width: 100%;
      box-sizing: border-box;
    }
    .popover-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      margin-top: 4px;
    }
    .btn-delete {
      background: var(--error-color, #f44336);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 14px;
      cursor: pointer;
      min-height: 36px;
    }
    .btn-close {
      background: var(--primary-color, #03a9f4);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 14px;
      cursor: pointer;
      min-height: 36px;
    }
    .hint {
      font-size: 11px;
      color: var(--secondary-text-color, #aaa);
      text-align: center;
      margin: 4px 0 0;
    }
  `,t([_t({type:Array})],At.prototype,"points",void 0),t([_t({type:Number})],At.prototype,"minValue",void 0),t([_t({type:Number})],At.prototype,"maxValue",void 0),t([_t({type:Number})],At.prototype,"valueStep",void 0),t([_t({type:String})],At.prototype,"unit",void 0),t([gt()],At.prototype,"_width",void 0),t([gt()],At.prototype,"_height",void 0),t([gt()],At.prototype,"_dragging",void 0),t([gt()],At.prototype,"_hovering",void 0),t([gt()],At.prototype,"_editingIdx",void 0),At=t([ct("graph-editor")],At);const St={workday:"Workday",weekend:"Weekend",holiday:"Holiday",monday:"Monday",tuesday:"Tuesday",wednesday:"Wednesday",thursday:"Thursday",friday:"Friday",saturday:"Saturday",sunday:"Sunday"},Et=["workday","weekend","holiday"];let Pt=class extends ht{constructor(){super(...arguments),this.profiles=[...Et],this.active="workday"}_select(t){this.dispatchEvent(new CustomEvent("profile-selected",{detail:t,bubbles:!0,composed:!0}))}render(){return B`
      <div class="tabs" role="tablist">
        ${this.profiles.map(t=>B`
            <button
              role="tab"
              aria-selected="${this.active===t}"
              class="tab ${this.active===t?"tab--active":""}"
              @click="${()=>this._select(t)}"
            >
              ${St[t]??t}
            </button>
          `)}
      </div>
    `}};Pt.styles=n`
    :host { display: block; }
    .tabs {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      padding: 4px 0;
    }
    .tab {
      flex: 1;
      min-width: 72px;
      padding: 10px 6px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 10px;
      background: var(--secondary-background-color, #f5f5f5);
      color: var(--secondary-text-color, #666);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      min-height: 44px;
    }
    .tab--active {
      background: var(--primary-color, #03a9f4);
      color: white;
      border-color: var(--primary-color, #03a9f4);
    }
  `,t([_t({type:Array})],Pt.prototype,"profiles",void 0),t([_t({type:String})],Pt.prototype,"active",void 0),Pt=t([ct("day-selector")],Pt);let kt=class extends ht{constructor(){super(...arguments),this.rooms=[],this.activeIndex=0}_select(t){this.dispatchEvent(new CustomEvent("room-selected",{detail:t,bubbles:!0,composed:!0}))}render(){return this.rooms.length<=1?B``:B`
      <div class="rooms" role="tablist">
        ${this.rooms.map((t,e)=>B`
            <button
              role="tab"
              aria-selected="${this.activeIndex===e}"
              class="room-tab ${this.activeIndex===e?"room-tab--active":""}"
              @click="${()=>this._select(e)}"
            >
              ${t.name||t.entity_id.split(".")[1]||t.entity_id}
            </button>
          `)}
      </div>
    `}};kt.styles=n`
    :host { display: block; }
    .rooms {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      padding: 4px 0 8px;
    }
    .room-tab {
      padding: 8px 14px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 20px;
      background: var(--secondary-background-color, #f5f5f5);
      color: var(--secondary-text-color, #666);
      font-size: 13px;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      min-height: 36px;
    }
    .room-tab--active {
      background: var(--accent-color, #ff9800);
      color: white;
      border-color: var(--accent-color, #ff9800);
    }
  `,t([_t({type:Array})],kt.prototype,"rooms",void 0),t([_t({type:Number})],kt.prototype,"activeIndex",void 0),kt=t([ct("room-selector")],kt);let Ct=class extends ht{constructor(){super(...arguments),this._activeProfile="workday",this._activeRoomIdx=0,this._saving=!1,this._saveError="",this._dirty=!1,this._toastTimer=null,this._toastMsg=""}setConfig(t){if(!t.schedule_id)throw new Error("schedule_id is required");if(!t.rooms||0===t.rooms.length)throw new Error("At least one room must be configured");this._config={min_value:5,max_value:30,value_step:.5,unit:"°C",profiles:[...Et],...t},this._schedule=this._buildEmptySchedule()}_buildEmptySchedule(){const t={};for(const e of this._config.profiles??Et)t[e]=[];return{schedule_id:this._config.schedule_id,name:this._config.schedule_name??this._config.schedule_id,rooms:this._config.rooms,workday_entity:this._config.workday_entity??"",profiles:t}}get _currentPoints(){return this._schedule.profiles[this._activeProfile]??[]}_setCurrentPoints(t){this._schedule={...this._schedule,profiles:{...this._schedule.profiles,[this._activeProfile]:t}},this._dirty=!0}_onProfileSelected(t){this._activeProfile=t.detail}_onRoomSelected(t){this._activeRoomIdx=t.detail}_onPointsChanged(t){this._setCurrentPoints(t.detail)}async _onSave(){this._saving=!0,this._saveError="";try{await async function(t,e){await t.callService("heating_scheduler","save_schedule",{schedule_id:e.schedule_id,name:e.name,rooms:e.rooms,workday_entity:e.workday_entity,profiles:e.profiles})}(this.hass,this._schedule),this._dirty=!1}catch(t){this._saveError=String(t)}finally{this._saving=!1}}_onCopyProfile(){const t=this._currentPoints;0!==t.length&&(this._toast("Profile copied to clipboard"),navigator.clipboard?.writeText(JSON.stringify(t,null,2)).catch(()=>{}))}_toast(t){this._toastMsg=t,this._toastTimer&&clearTimeout(this._toastTimer),this._toastTimer=setTimeout(()=>{this._toastMsg=""},2500)}get _roomLabel(){const t=this._config.rooms[this._activeRoomIdx];return t?t.name||t.entity_id.split(".")[1]||t.entity_id:""}get _currentEntityState(){const t=this._config.rooms[this._activeRoomIdx];if(!t||!this.hass)return"";const e=this.hass.states[t.entity_id];return e?`${e.state} ${this._config.unit}`:"unavailable"}get _workdayLabel(){if(!this._config.workday_entity||!this.hass)return"";const t=this.hass.states[this._config.workday_entity];if(!t)return"";return t.attributes.is_holiday?"Holiday":"on"===t.state?"Workday":"Weekend"}render(){if(!this._config)return B``;const t=this._config.profiles??Et;return B`
      <ha-card>
        <div class="card-header">
          <div class="title">${this._config.title??this._schedule.name}</div>
          <div class="meta">
            ${this._workdayLabel?B`<span class="badge badge--day">${this._workdayLabel}</span>`:""}
            ${this._currentEntityState?B`<span class="badge badge--value">${this._roomLabel}: ${this._currentEntityState}</span>`:""}
          </div>
        </div>

        <div class="card-content">
          <!-- Room tabs (only shown if >1 room) -->
          <room-selector
            .rooms="${this._config.rooms}"
            .activeIndex="${this._activeRoomIdx}"
            @room-selected="${this._onRoomSelected}"
          ></room-selector>

          <!-- Day profile tabs -->
          <day-selector
            .profiles="${t}"
            .active="${this._activeProfile}"
            @profile-selected="${this._onProfileSelected}"
          ></day-selector>

          <!-- Graph -->
          <graph-editor
            .points="${this._currentPoints}"
            .minValue="${this._config.min_value??5}"
            .maxValue="${this._config.max_value??30}"
            .valueStep="${this._config.value_step??.5}"
            .unit="${this._config.unit??"°C"}"
            @points-changed="${this._onPointsChanged}"
          ></graph-editor>

          <!-- Actions -->
          <div class="actions">
            <button
              class="btn btn--save ${this._saving?"btn--loading":""}"
              ?disabled="${this._saving||!this._dirty}"
              @click="${this._onSave}"
            >
              ${this._saving?"Saving…":"Save Schedule"}
            </button>
            <button class="btn btn--copy" @click="${this._onCopyProfile}">
              Copy JSON
            </button>
          </div>

          ${this._saveError?B`<p class="error">${this._saveError}</p>`:""}

          <!-- Point list (mobile-friendly alternative to graph) -->
          ${this._currentPoints.length>0?B`
                <div class="point-list">
                  <div class="point-list-header">
                    <span>Time</span>
                    <span>Value</span>
                    <span></span>
                  </div>
                  ${[...this._currentPoints].sort((t,e)=>t.time.localeCompare(e.time)).map((t,e)=>this._renderPointRow(t,this._currentPoints.indexOf(t)))}
                </div>
              `:B`<p class="empty-hint">No points yet. Tap the graph to add one.</p>`}
        </div>

        ${this._toastMsg?B`<div class="toast">${this._toastMsg}</div>`:""}
      </ha-card>
    `}_renderPointRow(t,e){return B`
      <div class="point-row">
        <input
          type="time"
          .value="${t.time}"
          @change="${t=>{const i=[...this._currentPoints];i[e]={...i[e],time:t.target.value},this._setCurrentPoints(i)}}"
        />
        <input
          type="number"
          .value="${String(t.value)}"
          min="${this._config.min_value??5}"
          max="${this._config.max_value??30}"
          step="${this._config.value_step??.5}"
          @change="${t=>{const i=[...this._currentPoints];i[e]={...i[e],value:parseFloat(t.target.value)},this._setCurrentPoints(i)}}"
        />
        <button
          class="btn-icon btn-icon--delete"
          aria-label="Delete point"
          @click="${()=>{const t=[...this._currentPoints];t.splice(e,1),this._setCurrentPoints(t)}}"
        >✕</button>
      </div>
    `}getCardSize(){return 6}};Ct.styles=n`
    :host {
      display: block;
      font-family: var(--primary-font-family, sans-serif);
    }
    ha-card {
      position: relative;
      overflow: hidden;
    }
    .card-header {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 16px 16px 0;
    }
    .title {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-text-color, #212121);
    }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .badge {
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 10px;
      font-weight: 500;
    }
    .badge--day {
      background: var(--primary-color, #03a9f4);
      color: white;
    }
    .badge--value {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--secondary-text-color, #888);
    }
    .card-content {
      padding: 12px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* Actions */
    .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .btn {
      flex: 1;
      min-width: 100px;
      padding: 12px 16px;
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      min-height: 44px;
      transition: opacity 0.15s;
    }
    .btn:disabled { opacity: 0.45; cursor: default; }
    .btn--save {
      background: var(--primary-color, #03a9f4);
      color: white;
    }
    .btn--loading { opacity: 0.7; }
    .btn--copy {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--secondary-text-color, #666);
    }

    .error {
      color: var(--error-color, #f44336);
      font-size: 13px;
      margin: 0;
    }

    /* Point list */
    .point-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .point-list-header {
      display: grid;
      grid-template-columns: 1fr 1fr 40px;
      gap: 8px;
      font-size: 11px;
      color: var(--secondary-text-color, #888);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0 4px;
    }
    .point-row {
      display: grid;
      grid-template-columns: 1fr 1fr 40px;
      gap: 8px;
      align-items: center;
    }
    .point-row input {
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 15px;
      min-height: 44px;
      background: var(--input-fill-color, #f5f5f5);
      color: var(--primary-text-color, #212121);
      width: 100%;
      box-sizing: border-box;
    }
    .btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 44px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 16px;
    }
    .btn-icon--delete {
      background: transparent;
      color: var(--error-color, #f44336);
    }
    .btn-icon--delete:hover { background: rgba(244,67,54,0.08); }

    .empty-hint {
      font-size: 13px;
      color: var(--secondary-text-color, #aaa);
      text-align: center;
      margin: 8px 0;
    }

    /* Toast */
    .toast {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.75);
      color: white;
      border-radius: 20px;
      padding: 8px 18px;
      font-size: 13px;
      pointer-events: none;
      white-space: nowrap;
    }
  `,t([_t({attribute:!1})],Ct.prototype,"hass",void 0),t([gt()],Ct.prototype,"_config",void 0),t([gt()],Ct.prototype,"_schedule",void 0),t([gt()],Ct.prototype,"_activeProfile",void 0),t([gt()],Ct.prototype,"_activeRoomIdx",void 0),t([gt()],Ct.prototype,"_saving",void 0),t([gt()],Ct.prototype,"_saveError",void 0),t([gt()],Ct.prototype,"_dirty",void 0),t([gt()],Ct.prototype,"_toastMsg",void 0),Ct=t([ct("scheduler-heating-card")],Ct);let Tt=class extends ht{constructor(){super(...arguments),this._config={}}setConfig(t){this._config=t}_valueChanged(t){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:{...this._config,...t.detail?.value??{}}},bubbles:!0,composed:!0}))}render(){return B`
      <div class="editor">
        <p style="font-size:13px;color:var(--secondary-text-color,#888)">
          Configure via YAML. Required: <code>schedule_id</code>, <code>rooms</code>.
        </p>
      </div>
    `}};Tt.styles=n`
    :host { display: block; padding: 8px; }
    code { background: var(--code-editor-background-color,#f5f5f5); padding: 2px 4px; border-radius: 4px; }
  `,t([_t({attribute:!1})],Tt.prototype,"hass",void 0),t([gt()],Tt.prototype,"_config",void 0),Tt=t([ct("scheduler-heating-card-editor")],Tt),window.customCards=window.customCards??[],window.customCards.push({type:"scheduler-heating-card",name:"Scheduler Heating Card",description:"Mobile-friendly heating schedule with interactive graph",preview:!1,documentationURL:"https://github.com/xcojonny/hassio-scheduler-heating-card"});export{Ct as SchedulerHeatingCard,Tt as SchedulerHeatingCardEditor};
