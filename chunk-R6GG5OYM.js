import{ga as D,ia as S,ka as M}from"./chunk-CHX6FGWD.js";import{Hb as a,Ib as u,Jb as y,Rc as k,Uc as v,Xc as b,_ as p,_a as o,ea as l,hc as h,kb as d,na as c,oa as i,ob as g,wb as n,xb as f,yb as m}from"./chunk-CELOEL42.js";var F=({dt:e})=>`
.p-progressspinner {
    position: relative;
    margin: 0 auto;
    width: 100px;
    height: 100px;
    display: inline-block;
}

.p-progressspinner::before {
    content: "";
    display: block;
    padding-top: 100%;
}

.p-progressspinner-spin {
    height: 100%;
    transform-origin: center center;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    animation: p-progressspinner-rotate 2s linear infinite;
}

.p-progressspinner-circle {
    stroke-dasharray: 89, 200;
    stroke-dashoffset: 0;
    stroke: ${e("progressspinner.color.1")};
    animation: p-progressspinner-dash 1.5s ease-in-out infinite, p-progressspinner-color 6s ease-in-out infinite;
    stroke-linecap: round;
}

@keyframes p-progressspinner-rotate {
    100% {
        transform: rotate(360deg);
    }
}
@keyframes p-progressspinner-dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35px;
    }
    100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124px;
    }
}
@keyframes p-progressspinner-color {
    100%,
    0% {
        stroke: ${e("progressspinner.color.1")};
    }
    40% {
        stroke: ${e("progressspinner.color.2")};
    }
    66% {
        stroke: ${e("progressspinner.color.3")};
    }
    80%,
    90% {
        stroke: ${e("progressspinner.color.4")};
    }
}
`,I={root:"p-progressspinner",spin:"p-progressspinner-spin",circle:"p-progressspinner-circle"},C=(()=>{class e extends S{name="progressspinner";theme=F;classes=I;static \u0275fac=(()=>{let s;return function(r){return(s||(s=i(e)))(r||e)}})();static \u0275prov=p({token:e,factory:e.\u0275fac})}return e})();var A=(()=>{class e extends M{styleClass;style;strokeWidth="2";fill="none";animationDuration="2s";ariaLabel;_componentStyle=l(C);static \u0275fac=(()=>{let s;return function(r){return(s||(s=i(e)))(r||e)}})();static \u0275cmp=d({type:e,selectors:[["p-progressSpinner"],["p-progress-spinner"],["p-progressspinner"]],inputs:{styleClass:"styleClass",style:"style",strokeWidth:"strokeWidth",fill:"fill",animationDuration:"animationDuration",ariaLabel:"ariaLabel"},features:[h([C]),g],decls:3,vars:11,consts:[["role","progressbar",1,"p-progressspinner",3,"ngStyle","ngClass"],["viewBox","25 25 50 50",1,"p-progressspinner-spin"],["cx","50","cy","50","r","20","stroke-miterlimit","10",1,"p-progressspinner-circle"]],template:function(t,r){t&1&&(a(0,"div",0),c(),a(1,"svg",1),y(2,"circle",2),u()()),t&2&&(f("ngStyle",r.style)("ngClass",r.styleClass),n("aria-label",r.ariaLabel)("aria-busy",!0)("data-pc-name","progressspinner")("data-pc-section","root"),o(),m("animation-duration",r.animationDuration),n("data-pc-section","root"),o(),n("fill",r.fill)("stroke-width",r.strokeWidth))},dependencies:[b,k,v,D],encapsulation:2,changeDetection:0})}return e})();export{A as a};
