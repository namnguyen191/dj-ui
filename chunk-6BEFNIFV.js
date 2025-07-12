import{i as $}from"./chunk-PZF2HUG4.js";import{N as h,ia as b,ka as m}from"./chunk-PAE2UDOJ.js";import{Ba as u,Tb as f,Vc as v,da as r,db as a,dc as g,ea as l,ia as p,kb as d,lb as s,nb as c,qc as x}from"./chunk-UJ7YJEPZ.js";var I=({dt:t})=>`
.p-inputtext {
    font-family: inherit;
    font-feature-settings: inherit;
    font-size: 1rem;
    color: ${t("inputtext.color")};
    background: ${t("inputtext.background")};
    padding-block: ${t("inputtext.padding.y")};
    padding-inline: ${t("inputtext.padding.x")};
    border: 1px solid ${t("inputtext.border.color")};
    transition: background ${t("inputtext.transition.duration")}, color ${t("inputtext.transition.duration")}, border-color ${t("inputtext.transition.duration")}, outline-color ${t("inputtext.transition.duration")}, box-shadow ${t("inputtext.transition.duration")};
    appearance: none;
    border-radius: ${t("inputtext.border.radius")};
    outline-color: transparent;
    box-shadow: ${t("inputtext.shadow")};
}

.p-inputtext.ng-invalid.ng-dirty {
    border-color: ${t("inputtext.invalid.border.color")};
}

.p-inputtext:enabled:hover {
    border-color: ${t("inputtext.hover.border.color")};
}

.p-inputtext:enabled:focus {
    border-color: ${t("inputtext.focus.border.color")};
    box-shadow: ${t("inputtext.focus.ring.shadow")};
    outline: ${t("inputtext.focus.ring.width")} ${t("inputtext.focus.ring.style")} ${t("inputtext.focus.ring.color")};
    outline-offset: ${t("inputtext.focus.ring.offset")};
}

.p-inputtext.p-invalid {
    border-color: ${t("inputtext.invalid.border.color")};
}

.p-inputtext.p-variant-filled {
    background: ${t("inputtext.filled.background")};
}
    
.p-inputtext.p-variant-filled:enabled:hover {
    background: ${t("inputtext.filled.hover.background")};
}

.p-inputtext.p-variant-filled:enabled:focus {
    background: ${t("inputtext.filled.focus.background")};
}

.p-inputtext:disabled {
    opacity: 1;
    background: ${t("inputtext.disabled.background")};
    color: ${t("inputtext.disabled.color")};
}

.p-inputtext::placeholder {
    color: ${t("inputtext.placeholder.color")};
}

.p-inputtext.ng-invalid.ng-dirty::placeholder {
    color: ${t("inputtext.invalid.placeholder.color")};
}

.p-inputtext-sm {
    font-size: ${t("inputtext.sm.font.size")};
    padding-block: ${t("inputtext.sm.padding.y")};
    padding-inline: ${t("inputtext.sm.padding.x")};
}

.p-inputtext-lg {
    font-size: ${t("inputtext.lg.font.size")};
    padding-block: ${t("inputtext.lg.padding.y")};
    padding-inline: ${t("inputtext.lg.padding.x")};
}

.p-inputtext-fluid {
    width: 100%;
}
`,z={root:({instance:t,props:o})=>["p-inputtext p-component",{"p-filled":t.filled,"p-inputtext-sm":o.size==="small","p-inputtext-lg":o.size==="large","p-invalid":o.invalid,"p-variant-filled":o.variant==="filled","p-inputtext-fluid":o.fluid}]},y=(()=>{class t extends b{name="inputtext";theme=I;classes=z;static \u0275fac=(()=>{let n;return function(e){return(n||(n=u(t)))(e||t)}})();static \u0275prov=r({token:t,factory:t.\u0275fac})}return t})();var N=(()=>{class t extends m{ngModel;variant;fluid;pSize;filled;_componentStyle=p(y);get hasFluid(){let i=this.el.nativeElement.closest("p-fluid");return h(this.fluid)?!!i:this.fluid}constructor(n){super(),this.ngModel=n}ngAfterViewInit(){super.ngAfterViewInit(),this.updateFilledState(),this.cd.detectChanges()}ngDoCheck(){this.updateFilledState()}onInput(){this.updateFilledState()}updateFilledState(){this.filled=this.el.nativeElement.value&&this.el.nativeElement.value.length||this.ngModel&&this.ngModel.model}static \u0275fac=function(i){return new(i||t)(a($,8))};static \u0275dir=s({type:t,selectors:[["","pInputText",""]],hostAttrs:[1,"p-inputtext","p-component"],hostVars:14,hostBindings:function(i,e){i&1&&f("input",function(k){return e.onInput(k)}),i&2&&g("p-filled",e.filled)("p-variant-filled",(e.variant??(e.config.inputStyle()||e.config.inputVariant()))==="filled")("p-inputtext-fluid",e.hasFluid)("p-inputtext-sm",e.pSize==="small")("p-inputfield-sm",e.pSize==="small")("p-inputtext-lg",e.pSize==="large")("p-inputfield-lg",e.pSize==="large")},inputs:{variant:"variant",fluid:[2,"fluid","fluid",v],pSize:"pSize"},features:[x([y]),c]})}return t})(),P=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=d({type:t});static \u0275inj=l({})}return t})();export{N as a,P as b};
