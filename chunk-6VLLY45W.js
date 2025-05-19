import{a as se}from"./chunk-R6GG5OYM.js";import{e as O,g as le}from"./chunk-QSHARNJL.js";import"./chunk-4XPXTYOG.js";import{f as V,k as B}from"./chunk-2HFDSWQC.js";import"./chunk-XHLVS7FU.js";import"./chunk-JOWTQUES.js";import{b as ie,c as ne,f as ae}from"./chunk-HOC3QDGA.js";import{c as G,d as s,e as K,f as Y,g as X,h as Z,i as m,j as J,k as Q,l as W,m as ee,o as te}from"./chunk-HU7F4ICW.js";import{a as H}from"./chunk-66RYNZRF.js";import"./chunk-EFTWTZWY.js";import{d as oe}from"./chunk-OZ6ZUZY7.js";import"./chunk-RSTVJZ7U.js";import"./chunk-JVM3WL52.js";import"./chunk-PJHEGPYG.js";import{a as re}from"./chunk-MQ74QUYZ.js";import"./chunk-J2UA6UJD.js";import"./chunk-6GF7UK45.js";import{ga as w,ia as S,ka as E}from"./chunk-CHX6FGWD.js";import"./chunk-4BVSUIFK.js";import"./chunk-PUECT5W6.js";import{c as q}from"./chunk-POJFSOR5.js";import{$ as h,Ac as R,Cb as j,Hb as a,Ib as d,Jb as c,Ob as C,Qb as N,Rb as L,Xc as A,Zb as f,_ as g,_a as p,_b as M,a as z,b as _,db as T,ea as l,hc as I,kb as b,lb as v,mb as k,oa as u,ob as x,pb as D,ua as P,xb as y,yc as F,zb as U}from"./chunk-CELOEL42.js";var he=["*"],be=({dt:e})=>`
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
`,ve={root:"p-iftalabel"},pe=(()=>{class e extends S{name="iftalabel";theme=be;classes=ve;static \u0275fac=(()=>{let n;return function(t){return(n||(n=u(e)))(t||e)}})();static \u0275prov=g({token:e,factory:e.\u0275fac})}return e})();var de=(()=>{class e extends E{_componentStyle=l(pe);static \u0275fac=(()=>{let n;return function(t){return(n||(n=u(e)))(t||e)}})();static \u0275cmp=b({type:e,selectors:[["p-iftalabel"],["p-iftaLabel"],["p-ifta-label"]],hostAttrs:[1,"p-iftalabel"],features:[I([pe]),x],ngContentSelectors:he,decls:1,vars:0,template:function(i,t){i&1&&(N(),L(0))},encapsulation:2,changeDetection:0})}return e})(),ue=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=v({type:e});static \u0275inj=h({imports:[A,w,B,w]})}return e})();var Ce=({dt:e})=>`
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
`,Me={root:({instance:e,props:o})=>["p-textarea p-component",{"p-filled":e.filled,"p-textarea-resizable ":o.autoResize,"p-invalid":o.invalid,"p-variant-filled":o.variant?o.variant==="filled":e.config.inputStyle==="filled"||e.config.inputVariant==="filled","p-textarea-fluid":o.fluid}]},fe=(()=>{class e extends S{name="textarea";theme=Ce;classes=Me;static \u0275fac=(()=>{let n;return function(t){return(n||(n=u(e)))(t||e)}})();static \u0275prov=g({token:e,factory:e.\u0275fac})}return e})();var me=(()=>{class e extends E{ngModel;control;autoResize;variant;fluid=!1;pSize;onResize=new P;filled;cachedScrollHeight;ngModelSubscription;ngControlSubscription;_componentStyle=l(fe);constructor(n,i){super(),this.ngModel=n,this.control=i}ngOnInit(){super.ngOnInit(),this.ngModel&&(this.ngModelSubscription=this.ngModel.valueChanges.subscribe(()=>{this.updateState()})),this.control&&(this.ngControlSubscription=this.control.valueChanges.subscribe(()=>{this.updateState()}))}get hasFluid(){let i=this.el.nativeElement.closest("p-fluid");return this.fluid||!!i}ngAfterViewInit(){super.ngAfterViewInit(),this.autoResize&&this.resize(),this.updateFilledState(),this.cd.detectChanges()}onInput(n){this.updateState()}updateFilledState(){this.filled=this.el.nativeElement.value&&this.el.nativeElement.value.length}resize(n){this.el.nativeElement.style.height="auto",this.el.nativeElement.style.height=this.el.nativeElement.scrollHeight+"px",parseFloat(this.el.nativeElement.style.height)>=parseFloat(this.el.nativeElement.style.maxHeight)?(this.el.nativeElement.style.overflowY="scroll",this.el.nativeElement.style.height=this.el.nativeElement.style.maxHeight):this.el.nativeElement.style.overflow="hidden",this.onResize.emit(n||{})}updateState(){this.updateFilledState(),this.autoResize&&this.resize()}ngOnDestroy(){this.ngModelSubscription&&this.ngModelSubscription.unsubscribe(),this.ngControlSubscription&&this.ngControlSubscription.unsubscribe(),super.ngOnDestroy()}static \u0275fac=function(i){return new(i||e)(T(J,8),T(K,8))};static \u0275dir=k({type:e,selectors:[["","pTextarea",""]],hostAttrs:[1,"p-textarea","p-component"],hostVars:16,hostBindings:function(i,t){i&1&&C("input",function($){return t.onInput($)}),i&2&&U("p-filled",t.filled)("p-textarea-resizable",t.autoResize)("p-variant-filled",t.variant==="filled"||t.config.inputStyle()==="filled"||t.config.inputVariant()==="filled")("p-textarea-fluid",t.hasFluid)("p-textarea-sm",t.pSize==="small")("p-inputfield-sm",t.pSize==="small")("p-textarea-lg",t.pSize==="large")("p-inputfield-lg",t.pSize==="large")},inputs:{autoResize:[2,"autoResize","autoResize",F],variant:"variant",fluid:[2,"fluid","fluid",F],pSize:"pSize"},outputs:{onResize:"onResize"},features:[I([fe]),x]})}return e})(),ge=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=v({type:e});static \u0275inj=h({})}return e})();function Se(e,o){e&1&&c(0,"p-progress-spinner",0)}var Ee=()=>{let e=l(O);return o=>R(e.allUIElementTemplatesInfo).find(t=>t.id===o.value)?{idNotUnique:!0}:null};function $e(){let e=/^[a-zA-Z0-9]*$/;return o=>{let n=o.value;return n&&!e.test(n)?{isAlphaNumeric:!0}:null}}var dt=(()=>{class e{constructor(){this.uiElementTemplatesStore=l(O),this.#e=l(V),this.createUIElementForm=new Z({id:new m("",{nonNullable:!0,validators:[s.required,Ee(),$e(),s.minLength(5),s.maxLength(50)]}),type:new m("SIMPLE_TEXT",{nonNullable:!0}),name:new m("",{nonNullable:!0,validators:[s.required,s.minLength(5),s.maxLength(50)]}),description:new m("",{nonNullable:!0,validators:[s.maxLength(150)]})}),this.uiElementTypes=Object.entries(le).map(([n,i])=>({key:n,label:i}))}#e;async createUIElementTemplate(){if(this.createUIElementForm.invalid)return;let n=await this.uiElementTemplatesStore.add(_(z({},this.createUIElementForm.getRawValue()),{options:{}}));await this.#e.navigate(["builder","ui-element",n.id])}getFieldLabel(n){let i=q(n),t=this.createUIElementForm.controls[n],r=t.errors;if(t.untouched&&t.pristine||!r)return i;t.pristine&&t.markAsDirty();let $=this.#t(r);return`${i}: Errors: ${$.join(", ")}`}getFormSubmitButtonTooltip(){if(!this.createUIElementForm.invalid)return"";let n=[];for(let[i,t]of Object.entries(this.createUIElementForm.controls)){if(!t.errors)continue;let r=this.#t(t.errors);n.push(`Field ${i} has the following errors:
 ${r.join(`
`)}`)}return n.join(`
`)}#t(n){let i=[];for(let[t,r]of Object.entries(n))switch(t){case"required":{i.push("This field is required");break}case"minlength":{i.push(`This field needs to be at least ${r.requiredLength} characters long`);break}case"maxlength":{i.push(`This field cannot exceed ${r.requiredLength} characters long`);break}case"idNotUnique":{i.push("This ID has already been taken");break}case"isAlphaNumeric":{i.push("This field must be alphanumeric");break}default:i.push("Unknown validation errors. Please try again later"),console.warn(`${t} is an unknown validation error that does not have any handler`)}return i}static{this.\u0275fac=function(i){return new(i||e)}}static{this.\u0275cmp=b({type:e,selectors:[["prime-ng-playground-builder-feat-create-ui-element-template"]],decls:22,vars:8,consts:[["ariaLabel","loading",1,"progress-spinner"],["header","Create UI Element"],[1,"form-container",3,"ngSubmit","formGroup"],[1,"id-input-field"],["autocomplete","off","formControlName","id","id","id","pInputText",""],["for","id"],[1,"name-input-field"],["autocomplete","off","formControlName","name","id","name","pInputText",""],["for","name"],[1,"type-input-field"],["formControlName","type","inputId","type","optionValue","key","placeholder","Select the UI type",3,"options"],["for","type"],[1,"description-input-field"],["cols","30","formControlName","description","name","description","pTextarea","","rows","5"],["for","description"],[1,"btn-container"],["label","Create","type","submit",3,"disabled","pTooltip"],["label","Cancel","severity","danger"]],template:function(i,t){i&1&&(D(0,Se,1,0,"p-progress-spinner",0),a(1,"p-card",1)(2,"form",2),C("ngSubmit",function(){return t.createUIElementTemplate()}),a(3,"p-iftalabel",3),c(4,"input",4),a(5,"label",5),f(6),d()(),a(7,"p-iftalabel",6),c(8,"input",7),a(9,"label",8),f(10),d()(),a(11,"p-iftalabel",9),c(12,"p-select",10),a(13,"label",11),f(14,"UI Element Type"),d()(),a(15,"p-iftalabel",12),c(16,"textarea",13),a(17,"label",14),f(18),d()(),a(19,"div",15),c(20,"p-button",16)(21,"p-button",17),d()()()),i&2&&(j(t.uiElementTemplatesStore.isPending()?0:-1),p(2),y("formGroup",t.createUIElementForm),p(4),M(t.getFieldLabel("id")),p(4),M(t.getFieldLabel("name")),p(2),y("options",t.uiElementTypes),p(6),M(t.getFieldLabel("description")),p(2),y("disabled",t.createUIElementForm.invalid)("pTooltip",t.getFormSubmitButtonTooltip()))},dependencies:[ue,de,ne,ie,te,Q,G,Y,X,W,ee,ae,re,oe,ge,me,se,H],styles:["[_nghost-%COMP%]{height:calc(100vh - 50px);width:100vw;display:flex;justify-content:center;position:relative;align-items:center}[_nghost-%COMP%]   .progress-spinner[_ngcontent-%COMP%]{position:absolute;display:flex;align-items:center;justify-content:center;background-color:#00000080;width:100%;height:100%;z-index:2}[_nghost-%COMP%]   .form-container[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}[_nghost-%COMP%]   .form-container[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], [_nghost-%COMP%]   .form-container[_ngcontent-%COMP%]   p-select[_ngcontent-%COMP%]{width:100%}[_nghost-%COMP%]   .form-container[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]{width:100%;resize:none}[_nghost-%COMP%]   .form-container[_ngcontent-%COMP%]   .id-input-field[_ngcontent-%COMP%], [_nghost-%COMP%]   .form-container[_ngcontent-%COMP%]   .name-input-field[_ngcontent-%COMP%], [_nghost-%COMP%]   .form-container[_ngcontent-%COMP%]   .type-input-field[_ngcontent-%COMP%], [_nghost-%COMP%]   .form-container[_ngcontent-%COMP%]   .description-input-field[_ngcontent-%COMP%]{grid-column:span 2}[_nghost-%COMP%]   .form-container[_ngcontent-%COMP%]   .btn-container[_ngcontent-%COMP%]{grid-column:span 4;display:flex;gap:1rem}"],changeDetection:0})}}return e})();export{dt as CreateUIElementTemplateComponent,$e as isAlphaNumericValidator};
