import{G as d,aa as m,ca as u}from"./chunk-SKCUKUHL.js";import{Pb as c,Qb as l,_ as a,gc as p,jb as s,nb as r,oa as o,xc as f}from"./chunk-Z6JASTJQ.js";var g=["*"],b=`
.p-icon {
    display: inline-block;
    vertical-align: baseline;
}

.p-icon-spin {
    -webkit-animation: p-icon-spin 2s infinite linear;
    animation: p-icon-spin 2s infinite linear;
}

@-webkit-keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}

@keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}
`,y=(()=>{class e extends m{name="baseicon";inlineStyles=b;static \u0275fac=(()=>{let t;return function(n){return(t||(t=o(e)))(n||e)}})();static \u0275prov=a({token:e,factory:e.\u0275fac})}return e})();var x=(()=>{class e extends u{label;spin=!1;styleClass;role;ariaLabel;ariaHidden;ngOnInit(){super.ngOnInit(),this.getAttributes()}getAttributes(){let t=d(this.label);this.role=t?void 0:"img",this.ariaLabel=t?void 0:this.label,this.ariaHidden=t}getClassNames(){return`p-icon ${this.styleClass?this.styleClass+" ":""}${this.spin?"p-icon-spin":""}`}static \u0275fac=(()=>{let t;return function(n){return(t||(t=o(e)))(n||e)}})();static \u0275cmp=s({type:e,selectors:[["ng-component"]],hostAttrs:[1,"p-component","p-iconwrapper"],inputs:{label:"label",spin:[2,"spin","spin",f],styleClass:"styleClass"},features:[p([y]),r],ngContentSelectors:g,decls:1,vars:0,template:function(i,n){i&1&&(c(),l(0))},encapsulation:2,changeDetection:0})}return e})();export{x as a};
