import{Bc as y,Da as a,T as v,W as u,c as f,ca as c,ja as i,sa as s}from"./chunk-J33AFEAQ.js";function m(r){r||(i(m),r=c(s));let e=new f(t=>r.onDestroy(t.next.bind(t)));return t=>t.pipe(v(e))}function g(r,e){let t=!e?.manualCleanup;t&&!e?.injector&&i(g);let d=t?e?.injector?.get(s)??c(s):null,l=p(e?.equal),o;e?.requireSync?o=a({kind:0},{equal:l}):o=a({kind:1,value:e?.initialValue},{equal:l});let b=r.subscribe({next:n=>o.set({kind:1,value:n}),error:n=>{if(e?.rejectErrors)throw n;o.set({kind:2,error:n})}});if(e?.requireSync&&o().kind===0)throw new u(601,!1);return d?.onDestroy(b.unsubscribe.bind(b)),y(()=>{let n=o();switch(n.kind){case 1:return n.value;case 2:throw n.error;case 0:throw new u(601,!1)}},{equal:e?.equal})}function p(r=Object.is){return(e,t)=>e.kind===1&&t.kind===1&&r(e.value,t.value)}export{m as a,g as b};
