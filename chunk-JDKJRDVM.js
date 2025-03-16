import{f as J,h as V,j as d}from"./chunk-IABOC2ZU.js";import{b as W,c as G,d as N,e as Y}from"./chunk-TV56DAVP.js";import{B as v,D as p,Fc as B,J as O,L,N as y,P as H,R as q,S as P,T as l,U as M,V as D,Z as m,aa as A,da as g,f as T,g as $,hb as z,i as j,ia as U,ja as f,l as u,qa as F,r as I,s as S,x as w}from"./chunk-RVPXDSFJ.js";import{a as x,b}from"./chunk-Q7L6LLAK.js";var re=new A("CORE_LAYOUT_CONFIG");var ce=n=>{let a=z(void 0);return B(e=>{let r=n().subscribe(o=>a.set(o));e(()=>{r.unsubscribe()})}),a};var ae=n=>(e,t)=>t(e).pipe(O(n));var K=(()=>{class n{#e={};registerFetcher(e,t){this.#e[e]&&G(`Fetcher with id ${e} already exists. Registering it again will override it`),this.#e[e]=t}registerFetchers(e){for(let[t,r]of Object.entries(e))this.registerFetcher(t,r)}getFetcher(e){let t=this.#e[e];if(!t){let r=`Fetcher with id ${e} does not exists. Please register it first`;throw W(r),new Error(r)}return t}fetchData(e,t){return this.getFetcher(e)(t)}static{this.\u0275fac=function(t){return new(t||n)}}static{this.\u0275prov=m({token:n,factory:n.\u0275fac,providedIn:"root"})}}return n})();var Q=(()=>{class n extends Y{constructor(){super(...arguments),this.missingTemplateEvent="MISSING_REMOTE_RESOURCE_TEMPLATE"}static{this.\u0275fac=(()=>{let e;return function(r){return(e||(e=F(n)))(r||n)}})()}static{this.\u0275prov=m({token:n,factory:n.\u0275fac,providedIn:"root"})}}return n})();var E=class{constructor(){this.environmentInjector=g(U),this.interpolationService=g(V)}setLoadingState(a){let e=a.getValue();a.next(b(x({},e),{isLoading:!0}))}setErrorState(a){a.next({status:"error",isLoading:!1,isError:!0,result:null})}setCompleteState(a,e){a.next({status:"completed",isLoading:!1,isError:!1,result:e})}interpolateResourceHooks(a){let{onSuccessHooks:e,resourceResult:t,stateSubscription:r}=a;return this.getResourceRequestHooksInterpolationContext(t,r).pipe(l(s=>this.interpolationService.interpolate({value:e,context:s})),p(()=>(console.warn("Failed to interpolate resource hooks"),u([]))))}getResourceRequestConfigInterpolationContext(a,e){let t=e?f(this.environmentInjector,()=>d(e)):u(null),r=u(a);return S({$requests:r,state:t}).pipe(q({refCount:!0,bufferSize:1}))}getResourceRequestTransformationInterpolationContext(a){let{accumulatedRequestsResults:e,currentRequestResult:t,stateSubscriptionConfig:r}=a,o=r?f(this.environmentInjector,()=>d(r)):u(null),c=u(e),s=u(t);return S({$requests:c,state:o,$current:s}).pipe(q({refCount:!0,bufferSize:1}))}getResourceRequestHooksInterpolationContext(a,e){let t=e?f(this.environmentInjector,()=>d(e)):u(null),r=u(a);return S({$result:r,state:t}).pipe(q({refCount:!0,bufferSize:1}))}};var X="[Resource did not run]",_=Symbol("Complete"),Z=u(_),ye=n=>{let a=g(ee),e=n.reduce((t,r)=>b(x({},t),{[r]:a.getRemoteResourceState(r)}),{});return S(e).pipe(I(t=>{let r=Object.entries(t).every(([,i])=>i.isLoading),o=Object.entries(t).reduce((i,[R,h])=>h.isLoading?[...i,R]:i,[]),c=Object.entries(t).every(([,i])=>i.isError),s=Object.entries(t).reduce((i,[R,h])=>h.isError?[...i,R]:i,[]);return{results:t,isAllLoading:r,isPartialLoading:o,isAllError:c,isPartialError:s}}))},ee=(()=>{class n extends E{#e={};#t=new T;#n=new $(null);#r=g(K);#s=g(Q);#i=g(J);getRemoteResourceState(e){let t=this.#e[e];return t?t.asObservable():this.#o(e)}triggerResource(e){this.#e[e]?this.reloadResource(e):this.#o(e)}reloadResource(e){this.#t.next(e)}#c(e,t){let r=0;return u([]).pipe(L(o=>{if(r>=e.length)return j;let c=e[r];return r++,this.#p({req:c,accumulatedRequestsResults:o,stateSubscriptionConfig:t}).pipe(l(s=>this.#r.fetchData(c.fetcherId,s)),l(s=>this.#h(c,s,o)),I(s=>[...o,s]))}),H(),I(o=>o[e.length-1]))}#a(e,t){return this.#f(e,t).pipe(l(r=>w(r.map(({fetcherId:o,configs:c})=>this.#r.fetchData(o,c)))),l(r=>this.#m({reqs:e,responses:r,stateSubscriptionConfig:t})))}#u(e){let t=this.#e[e];if(!t){console.warn(`Remote resource ${e} has not been registered or is not associated with any widget yet`);return}let r=this.#s.getTemplate(e),o=this.#l(r,t),c=this.#t.pipe(v(i=>i===e)),s=r.pipe(v(i=>i.status==="loaded"),l(i=>{let R=i.config.stateSubscription,h=u(j);return R&&(h=f(this.environmentInjector,()=>d(R))),h}));S([c.pipe(P(!0)),s]).pipe(l(()=>o),M(this.#n.pipe(v(i=>i===e)))).subscribe(()=>{N(`Remote resource ${e} triggered`)})}#l(e,t){return e.pipe(v(r=>r.status==="loaded"),D({next:()=>this.setLoadingState(t)}),l(r=>this.#R(r.config).pipe(I(o=>({result:o,rrt:r})))),l(({result:r,rrt:o})=>(this.setCompleteState(t,r),this.#g({resourceResult:r,remoteResourceTemplate:o}))),p(()=>(this.setErrorState(t),Z)))}#p(e){let{req:t,accumulatedRequestsResults:r,stateSubscriptionConfig:o}=e;return this.getResourceRequestConfigInterpolationContext(r,o).pipe(l(i=>this.interpolationService.interpolate({value:t.configs,context:i})),p(i=>(console.warn(`Fail to interpolate request options: ${i}`),i)),y())}#f(e,t){let r=t?f(this.environmentInjector,()=>d(t)):u(null),o=e.map(s=>({fetcherId:s.fetcherId,configs:s.configs}));return r.pipe(l(s=>this.interpolationService.interpolate({value:o,context:s??{}})),p(s=>(console.warn("Fail to interpolate parallel requests options"),s)))}#h(e,t,r){let{interpolation:o}=e;return o?this.getResourceRequestTransformationInterpolationContext({accumulatedRequestsResults:r,currentRequestResult:t}).pipe(l(i=>this.interpolationService.interpolate({value:o,context:i})),p(i=>(console.warn("Failed to interpolate sequenced request result: ",i),i))):u(t)}#m(e){let{reqs:t,responses:r,stateSubscriptionConfig:o}=e,c=[];for(let s=0;s<t.length;s++){let{interpolation:i}=t[s];if(i){let h=this.getResourceRequestTransformationInterpolationContext({currentRequestResult:r[s],stateSubscriptionConfig:o}).pipe(l(C=>this.interpolationService.interpolate({value:i,context:C})),p(C=>(console.warn("Failed to interpolate parallel request result",C),C)),y());c.push(h)}}return w(c)}#o(e){let t=new $({status:"init",isLoading:!0,isError:!1,result:null});return this.#e[e]=t,this.#u(e),t.asObservable()}#g(e){let{resourceResult:t,remoteResourceTemplate:r}=e,{config:{options:{onSuccess:o},stateSubscription:c}}=r;return!o?.length||t===X?Z:this.interpolateResourceHooks({onSuccessHooks:o,resourceResult:t,stateSubscription:c}).pipe(I(s=>(f(this.environmentInjector,()=>{this.#i.triggerActionHooks(s)}),_)))}#d(e){let{stateSubscription:t,runCondition:r}=e;return(t?f(this.environmentInjector,()=>d(t)):u({})).pipe(l(c=>this.interpolationService.interpolate({value:r,context:{state:c}})),p(c=>(console.warn("Failed to interpolate resource run condition: ",c),u(!1))))}#R(e){let{stateSubscription:t,options:{runCondition:r=!0,requests:o,parallel:c}}=e;return this.#d({stateSubscription:t,runCondition:r}).pipe(l(s=>s?c?this.#a(o,t):this.#c(o,t):u(X)))}static{this.\u0275fac=(()=>{let e;return function(r){return(e||(e=F(n)))(r||n)}})()}static{this.\u0275prov=m({token:n,factory:n.\u0275fac,providedIn:"root"})}}return n})();var Oe=(()=>{class n{#e={};#t={};registerUIElement(e){let{type:t,component:r}=e;this.#e[t]=r}registerUIElementLoader(e){let{type:t,loader:r}=e;this.#t[t]=r}getUIElement(e){let t=this.#e[e];if(!t){let r=this.#t[e];if(r)return r();throw new Error(`${e} has not been registered as a UI Element yet!`)}return Promise.resolve(t)}static{this.\u0275fac=function(t){return new(t||n)}}static{this.\u0275prov=m({token:n,factory:n.\u0275fac,providedIn:"root"})}}return n})();export{ce as a,ae as b,re as c,K as d,Q as e,ye as f,ee as g,Oe as h};
