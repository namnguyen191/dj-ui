import{b as s}from"./chunk-JY2GTDED.js";import{p as m}from"./chunk-4RBRHGVV.js";import{D as n,V as p,Z as l,da as i,l as a}from"./chunk-AGCFPB43.js";var r="http://localhost:8080/ui-element-templates",c=t=>({id:t,name:"UI Element error template",createdAt:new Date().toUTCString(),description:"Use this template to display an error for when we failed to fetch the actual template",type:"CARBON_SIMPLE_TEXT",options:{textBlocks:[{text:"Something went wrong",type:"title"},{text:"We could not fetch this UI right now. Please refresh your browser or try again later",type:"paragraph"}]}}),g=(()=>{class t{constructor(){this.#t=i(s),this.#e=i(m),this.getAllUIElementTemplates=()=>this.#t.get(`${r}`),this.createUIElementTemplate=e=>this.#t.post(r,e),this.updateUIElementTemplate=e=>this.#t.put(r,e).pipe(p({next:o=>{this.#e.updateOrRegisterTemplate(o)}}))}#t;#e;fetchUIElementTemplate(e){return this.#t.get(`${r}/${e}`).pipe(n(()=>a(c(e))))}static{this.\u0275fac=function(o){return new(o||t)}}static{this.\u0275prov=l({token:t,factory:t.\u0275fac,providedIn:"root"})}}return t})();export{g as a};
