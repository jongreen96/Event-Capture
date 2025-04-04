import{r as n}from"./index-CQuzofQK.js";/**
 * @license lucide-react v0.483.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),s=(...r)=>r.filter((e,t,o)=>!!e&&e.trim()!==""&&o.indexOf(e)===t).join(" ").trim();/**
 * @license lucide-react v0.483.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var f={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.483.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=n.forwardRef(({color:r="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:o,className:c="",children:a,iconNode:i,...m},l)=>n.createElement("svg",{ref:l,...f,width:e,height:e,stroke:r,strokeWidth:o?Number(t)*24/Number(e):t,className:s("lucide",c),...m},[...i.map(([d,u])=>n.createElement(d,u)),...Array.isArray(a)?a:[a]]));/**
 * @license lucide-react v0.483.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=(r,e)=>{const t=n.forwardRef(({className:o,...c},a)=>n.createElement(w,{ref:a,iconNode:e,className:s(`lucide-${g(r)}`,o),...c}));return t.displayName=`${r}`,t};/**
 * @license lucide-react v0.483.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]],y=h("Image",p);export{y as I,h as c};
