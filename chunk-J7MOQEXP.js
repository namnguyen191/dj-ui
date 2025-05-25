import{e as E}from"./chunk-DXVI33PE.js";import{k as F}from"./chunk-2HFDSWQC.js";import{e as w,j as D}from"./chunk-HU7F4ICW.js";import{ga as h,ia as f,ka as d}from"./chunk-CHX6FGWD.js";import{$ as s,Ac as M,Ob as $,Qb as z,Rb as S,Xc as I,_ as r,db as b,ea as o,hc as u,kb as x,lb as p,mb as v,oa as l,ob as c,ua as m,yc as g,zb as y}from"./chunk-CELOEL42.js";var T=["*"],B=({dt:e})=>`
.p-iftalabel {
    display: block;
    position: relative;
}

.p-iftalabel label {
    position: absolute;
    pointer-events: none;
    top: ${e("iftalabel.top")};
    transition-property: all;
    transition-timing-function: ease;
    line-height: 1;
    font-size: ${e("iftalabel.font.size")};
    font-weight: ${e("iftalabel.font.weight")};
    inset-inline-start: ${e("iftalabel.position.x")};
    color: ${e("iftalabel.color")};
    transition-duration: ${e("iftalabel.transition.duration")};
}

.p-iftalabel > .p-inputtext,
.p-iftalabel .p-textarea,
.p-iftalabel .p-select-label,
.p-iftalabel .p-multiselect-label-container,
.p-iftalabel .p-autocomplete-input-multiple,
.p-iftalabel .p-cascadeselect-label,
.p-iftalabel .p-treeselect-label,
.p-iftalabel .p-datepicker-input,
.p-iftalabel .p-inputmask,
.p-iftalabel .p-autocomplete .p-inputtext,
.p-iftalabel .p-inputnumber .p-inputtext,
.p-iftalabel .p-password .p-inputtext,
.p-iftalabel > .p-iconfield .p-inputtext {
    padding-top: ${e("iftalabel.input.padding.top")};
}

.p-iftalabel:has(.ng-invalid.ng-dirty) label {
    color: ${e("iftalabel.invalid.color")};
}

.p-iftalabel:has(input:focus) label,
.p-iftalabel:has(input:-webkit-autofill) label,
.p-iftalabel:has(textarea:focus) label,
.p-iftalabel:has(.p-inputwrapper-focus) label {
    color: ${e("iftalabel.focus.color")};
}

.p-iftalabel > .p-iconfield .p-inputicon {
    top: ${e("iftalabel.input.padding.top")};
    transform: translateY(25%);
    margin-top: 0;
}

/*.p-iftalabel .p-placeholder,
.p-iftalabel input::placeholder,
.p-iftalabel .p-inputtext::placeholder {
    opacity: 0;
    transition-property: all;
    transition-timing-function: ease;
}

.p-iftalabel .p-focus .p-placeholder,
.p-iftalabel input:focus::placeholder,
.p-iftalabel .p-inputtext:focus::placeholder {
    opacity: 1;
    transition-property: all;
    transition-timing-function: ease;
}*/
`,N={root:"p-iftalabel"},k=(()=>{class e extends f{name="iftalabel";theme=B;classes=N;static \u0275fac=(()=>{let t;return function(a){return(t||(t=l(e)))(a||e)}})();static \u0275prov=r({token:e,factory:e.\u0275fac})}return e})();var W=(()=>{class e extends d{_componentStyle=o(k);static \u0275fac=(()=>{let t;return function(a){return(t||(t=l(e)))(a||e)}})();static \u0275cmp=x({type:e,selectors:[["p-iftalabel"],["p-iftaLabel"],["p-ifta-label"]],hostAttrs:[1,"p-iftalabel"],features:[u([k]),c],ngContentSelectors:T,decls:1,vars:0,template:function(i,a){i&1&&(z(),S(0))},encapsulation:2,changeDetection:0})}return e})(),X=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=p({type:e});static \u0275inj=s({imports:[I,h,F,h]})}return e})();var A=({dt:e})=>`
.p-textarea {
    font-family: inherit;
    font-feature-settings: inherit;
    font-size: 1rem;
    color: ${e("textarea.color")};
    background: ${e("textarea.background")};
    padding: ${e("textarea.padding.y")} ${e("textarea.padding.x")};
    border: 1px solid ${e("textarea.border.color")};
    transition: background ${e("textarea.transition.duration")}, color ${e("textarea.transition.duration")}, border-color ${e("textarea.transition.duration")}, outline-color ${e("textarea.transition.duration")}, box-shadow ${e("textarea.transition.duration")};
    appearance: none;
    border-radius: ${e("textarea.border.radius")};
    outline-color: transparent;
    box-shadow: ${e("textarea.shadow")};
}

.p-textarea.ng-invalid.ng-dirty {
    border-color: ${e("textarea.invalid.border.color")};
}

.p-textarea:enabled:hover {
    border-color: ${e("textarea.hover.border.color")};
}

.p-textarea:enabled:focus {
    border-color: ${e("textarea.focus.border.color")};
    box-shadow: ${e("textarea.focus.ring.shadow")};
    outline: ${e("textarea.focus.ring.width")} ${e("textarea.focus.ring.style")} ${e("textarea.focus.ring.color")};
    outline-offset: ${e("textarea.focus.ring.offset")};
}

.p-textarea.p-invalid {
    border-color: ${e("textarea.invalid.border.color")};
}

.p-textarea.p-variant-filled {
    background: ${e("textarea.filled.background")};
}

.p-textarea.p-variant-filled:enabled:focus {
    background: ${e("textarea.filled.focus.background")};
}

.p-textarea:disabled {
    opacity: 1;
    background: ${e("textarea.disabled.background")};
    color: ${e("textarea.disabled.color")};
}

.p-textarea::placeholder {
    color: ${e("textarea.placeholder.color")};
}

.p-textarea.ng-invalid.ng-dirty::placeholder {
    color: ${e("textarea.invalid.placeholder.color")};
}

.p-textarea-fluid {
    width: 100%;
}

.p-textarea-resizable {
    overflow: hidden;
    resize: none;
}

.p-textarea-sm {
    font-size: ${e("textarea.sm.font.size")};
    padding-block: ${e("textarea.sm.padding.y")};
    padding-inline: ${e("textarea.sm.padding.x")};
}

.p-textarea-lg {
    font-size: ${e("textarea.lg.font.size")};
    padding-block: ${e("textarea.lg.padding.y")};
    padding-inline: ${e("textarea.lg.padding.x")};
}
`,H={root:({instance:e,props:n})=>["p-textarea p-component",{"p-filled":e.filled,"p-textarea-resizable ":n.autoResize,"p-invalid":n.invalid,"p-variant-filled":n.variant?n.variant==="filled":e.config.inputStyle==="filled"||e.config.inputVariant==="filled","p-textarea-fluid":n.fluid}]},C=(()=>{class e extends f{name="textarea";theme=A;classes=H;static \u0275fac=(()=>{let t;return function(a){return(t||(t=l(e)))(a||e)}})();static \u0275prov=r({token:e,factory:e.\u0275fac})}return e})();var ue=(()=>{class e extends d{ngModel;control;autoResize;variant;fluid=!1;pSize;onResize=new m;filled;cachedScrollHeight;ngModelSubscription;ngControlSubscription;_componentStyle=o(C);constructor(t,i){super(),this.ngModel=t,this.control=i}ngOnInit(){super.ngOnInit(),this.ngModel&&(this.ngModelSubscription=this.ngModel.valueChanges.subscribe(()=>{this.updateState()})),this.control&&(this.ngControlSubscription=this.control.valueChanges.subscribe(()=>{this.updateState()}))}get hasFluid(){let i=this.el.nativeElement.closest("p-fluid");return this.fluid||!!i}ngAfterViewInit(){super.ngAfterViewInit(),this.autoResize&&this.resize(),this.updateFilledState(),this.cd.detectChanges()}onInput(t){this.updateState()}updateFilledState(){this.filled=this.el.nativeElement.value&&this.el.nativeElement.value.length}resize(t){this.el.nativeElement.style.height="auto",this.el.nativeElement.style.height=this.el.nativeElement.scrollHeight+"px",parseFloat(this.el.nativeElement.style.height)>=parseFloat(this.el.nativeElement.style.maxHeight)?(this.el.nativeElement.style.overflowY="scroll",this.el.nativeElement.style.height=this.el.nativeElement.style.maxHeight):this.el.nativeElement.style.overflow="hidden",this.onResize.emit(t||{})}updateState(){this.updateFilledState(),this.autoResize&&this.resize()}ngOnDestroy(){this.ngModelSubscription&&this.ngModelSubscription.unsubscribe(),this.ngControlSubscription&&this.ngControlSubscription.unsubscribe(),super.ngOnDestroy()}static \u0275fac=function(i){return new(i||e)(b(D,8),b(w,8))};static \u0275dir=v({type:e,selectors:[["","pTextarea",""]],hostAttrs:[1,"p-textarea","p-component"],hostVars:16,hostBindings:function(i,a){i&1&&$("input",function(j){return a.onInput(j)}),i&2&&y("p-filled",a.filled)("p-textarea-resizable",a.autoResize)("p-variant-filled",a.variant==="filled"||a.config.inputStyle()==="filled"||a.config.inputVariant()==="filled")("p-textarea-fluid",a.hasFluid)("p-textarea-sm",a.pSize==="small")("p-inputfield-sm",a.pSize==="small")("p-textarea-lg",a.pSize==="large")("p-inputfield-lg",a.pSize==="large")},inputs:{autoResize:[2,"autoResize","autoResize",g],variant:"variant",fluid:[2,"fluid","fluid",g],pSize:"pSize"},outputs:{onResize:"onResize"},features:[u([C]),c]})}return e})(),fe=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=p({type:e});static \u0275inj=s({})}return e})();var he=()=>{let e=/^[a-zA-Z0-9]*$/;return n=>{let t=n.value;return t&&!e.test(t)?{isAlphaNumeric:!0}:null}},me=()=>{let e=o(E);return n=>M(e.allUIElementTemplatesInfo).find(a=>a.id===n.value)?{idNotUnique:!0}:null};export{W as a,X as b,ue as c,fe as d,he as e,me as f};
