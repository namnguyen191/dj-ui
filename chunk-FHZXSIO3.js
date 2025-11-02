import{c as D,e as E}from"./chunk-FLT6BDNU.js";import{k as w}from"./chunk-UV6WKCAY.js";import{d as F,i as k}from"./chunk-PZF2HUG4.js";import{ga as m,ia as d,ka as f}from"./chunk-PAE2UDOJ.js";import{p as M}from"./chunk-6O3Z2ZPM.js";import{Ba as l,Hc as g,Tb as $,Vb as z,Vc as h,Wb as S,da as r,db as b,dc as I,ea as s,ia as o,jb as x,kb as p,lb as v,nb as c,qc as u,rb as y}from"./chunk-UJ7YJEPZ.js";var B=["*"],N=({dt:e})=>`
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

.p-iftalabel .p-inputtext,
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

.p-iftalabel .p-inputicon {
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
`,V={root:"p-iftalabel"},R=(()=>{class e extends d{name="iftalabel";theme=N;classes=V;static \u0275fac=(()=>{let t;return function(a){return(t||(t=l(e)))(a||e)}})();static \u0275prov=r({token:e,factory:e.\u0275fac})}return e})();var X=(()=>{class e extends f{_componentStyle=o(R);static \u0275fac=(()=>{let t;return function(a){return(t||(t=l(e)))(a||e)}})();static \u0275cmp=x({type:e,selectors:[["p-iftalabel"],["p-iftaLabel"],["p-ifta-label"]],hostAttrs:[1,"p-iftalabel"],features:[u([R]),c],ngContentSelectors:B,decls:1,vars:0,template:function(i,a){i&1&&(z(),S(0))},encapsulation:2,changeDetection:0})}return e})(),_=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=p({type:e});static \u0275inj=s({imports:[M,m,w,m]})}return e})();var A=({dt:e})=>`
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

.p-textarea.p-variant-filled:enabled:hover {
    background: ${e("textarea.filled.hover.background")};
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
`,H={root:({instance:e,props:n})=>["p-textarea p-component",{"p-filled":e.filled,"p-textarea-resizable ":n.autoResize,"p-invalid":n.invalid,"p-variant-filled":n.variant?n.variant==="filled":e.config.inputStyle==="filled"||e.config.inputVariant==="filled","p-textarea-fluid":n.fluid}]},T=(()=>{class e extends d{name="textarea";theme=A;classes=H;static \u0275fac=(()=>{let t;return function(a){return(t||(t=l(e)))(a||e)}})();static \u0275prov=r({token:e,factory:e.\u0275fac})}return e})();var de=(()=>{class e extends f{ngModel;control;autoResize;variant;fluid=!1;pSize;onResize=new y;filled;cachedScrollHeight;ngModelSubscription;ngControlSubscription;_componentStyle=o(T);constructor(t,i){super(),this.ngModel=t,this.control=i}ngOnInit(){super.ngOnInit(),this.ngModel&&(this.ngModelSubscription=this.ngModel.valueChanges.subscribe(()=>{this.updateState()})),this.control&&(this.ngControlSubscription=this.control.valueChanges.subscribe(()=>{this.updateState()}))}get hasFluid(){let i=this.el.nativeElement.closest("p-fluid");return this.fluid||!!i}ngAfterViewInit(){super.ngAfterViewInit(),this.autoResize&&this.resize(),this.updateFilledState(),this.cd.detectChanges()}ngAfterViewChecked(){this.autoResize&&this.resize()}onInput(t){this.updateState()}updateFilledState(){this.filled=this.el.nativeElement.value&&this.el.nativeElement.value.length}resize(t){this.el.nativeElement.style.height="auto",this.el.nativeElement.style.height=this.el.nativeElement.scrollHeight+"px",parseFloat(this.el.nativeElement.style.height)>=parseFloat(this.el.nativeElement.style.maxHeight)?(this.el.nativeElement.style.overflowY="scroll",this.el.nativeElement.style.height=this.el.nativeElement.style.maxHeight):this.el.nativeElement.style.overflow="hidden",this.onResize.emit(t||{})}updateState(){this.updateFilledState(),this.autoResize&&this.resize()}ngOnDestroy(){this.ngModelSubscription&&this.ngModelSubscription.unsubscribe(),this.ngControlSubscription&&this.ngControlSubscription.unsubscribe(),super.ngOnDestroy()}static \u0275fac=function(i){return new(i||e)(b(k,8),b(F,8))};static \u0275dir=v({type:e,selectors:[["","pTextarea",""],["","pInputTextarea",""]],hostAttrs:[1,"p-textarea","p-component"],hostVars:16,hostBindings:function(i,a){i&1&&$("input",function(C){return a.onInput(C)}),i&2&&I("p-filled",a.filled)("p-textarea-resizable",a.autoResize)("p-variant-filled",a.variant==="filled"||a.config.inputStyle()==="filled"||a.config.inputVariant()==="filled")("p-textarea-fluid",a.hasFluid)("p-textarea-sm",a.pSize==="small")("p-inputfield-sm",a.pSize==="small")("p-textarea-lg",a.pSize==="large")("p-inputfield-lg",a.pSize==="large")},inputs:{autoResize:[2,"autoResize","autoResize",h],variant:"variant",fluid:[2,"fluid","fluid",h],pSize:"pSize"},outputs:{onResize:"onResize"},features:[u([T]),c]})}return e})(),fe=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=p({type:e});static \u0275inj=s({})}return e})();var me=()=>{let e=/^[a-zA-Z0-9]*$/;return n=>{let t=n.value;return t&&!e.test(t)?{isAlphaNumeric:!0}:null}},xe=()=>{let e=o(E);return n=>g(e.allUIElementTemplatesInfo).find(a=>a.id===n.value)?{idNotUnique:!0}:null},ve=()=>{let e=o(D);return n=>g(e.allRemoteResourceTemplatesInfo).find(a=>a.id===n.value)?{idNotUnique:!0}:null};export{X as a,_ as b,de as c,fe as d,me as e,xe as f,ve as g};
