import{a as we,b as Ie,c as ve,d as Pe,e as Oe}from"./chunk-5FX74NIL.js";import{a as ee}from"./chunk-2AXIN3SY.js";import"./chunk-5P3WC3WX.js";import"./chunk-XSHXIKD3.js";import{a as he}from"./chunk-GFXNHRWD.js";import{a as K,b as X}from"./chunk-AUPDVPWC.js";import{a as ae,b as le}from"./chunk-VT3L4ATN.js";import{a as I}from"./chunk-HSTFUNQM.js";import{a as _e,b as Te,c as Se,d as Me,e as Ce,f as ye}from"./chunk-O2IUUI6A.js";import{a as se,b as me,c as pe,d as ce,e as ue,f as ge,g as Ee,h as fe}from"./chunk-PPSOSOLW.js";import{a as Z}from"./chunk-FI4W5XJG.js";import"./chunk-63KTETU3.js";import{c as de}from"./chunk-QGTZ7D3Z.js";import"./chunk-VIZDSAUF.js";import"./chunk-ODVR7ZJH.js";import"./chunk-W55HETMF.js";import{D as w,p as ne,t as re}from"./chunk-KMDEKQMR.js";import{b as C,e as y}from"./chunk-YFNKZN5I.js";import{d as G,f as Q}from"./chunk-XJT726ZN.js";import{a as te,b as ie,c as oe}from"./chunk-JPM3QN3O.js";import"./chunk-OWN4CUHW.js";import"./chunk-EWUWNZZG.js";import"./chunk-CB73VGS7.js";import"./chunk-HAEKH4MG.js";import{p as $}from"./chunk-RNE5JESU.js";import"./chunk-SPYAYC6H.js";import{$a as d,Ab as s,Ac as f,Bc as V,Cc as M,Da as b,F as j,Fb as x,Kb as l,Lb as m,Mb as E,Qb as U,Rb as p,Sb as L,Sc as z,U as O,Yc as q,bc as u,ca as a,f as F,hc as J,ic as W,jc as Y,la as h,lb as S,ma as _,na as B,oa as k,pb as H,r as N,rb as R}from"./chunk-J33AFEAQ.js";import{a as g,b as T,c as D}from"./chunk-VKRCUX5N.js";var A="UI_ELEMENT_TEMPLATE_FOR_PREVIEW_ONLY",v={id:"preview-layout",uiElementInstances:[]},Re={currentEditingTemplate:null},P=Te({providedIn:"root"},ye(Re),Se(({currentEditingTemplate:t})=>({currentEditableFields:V(()=>{let r=t();if(!r)return null;let c=r,{id:e,createdAt:i,updatedAt:o}=c;return D(c,["id","createdAt","updatedAt"])}),currentUnEditableFields:V(()=>{let r=t();if(!r)return null;let{id:e,createdAt:i,updatedAt:o}=r;return{id:e,createdAt:i,updatedAt:o}})})),Ce((t,r=a($),e=a(Z))=>({setCurrentEditingTemplate:i=>{r.updateOrRegisterTemplate(T(g({},i),{id:A})),e.updateTemplate(T(g({},v),{uiElementInstances:[{id:"instance-1",uiElementTemplateId:A}]})),_e(t,{currentEditingTemplate:i})},updateCurrentEditingTemplate:i=>{r.updateTemplate(T(g({},i),{id:A})),Ie(t,o=>{let n=f(t.currentUnEditableFields);!o.currentEditingTemplate||!n||(o.currentEditingTemplate=g(g({},n),i))})},initPreviewLayout:()=>{e.registerTemplate(v)}})),Me({onInit:({initPreviewLayout:t})=>{t()}}));function Le(t,r){t&1&&E(0,"cds-loading",5),t&2&&s("isActive",!0)}function Ve(t,r){if(t&1){let e=U();l(0,"ngx-monaco-editor",9),p("ngModelChange",function(o){h(e);let n=L();return _(n.codeChangeSubject.next(o))}),m()}if(t&2){let e=L(),i=Y(1);s("ngModel",i)("options",e.editorOptions)}}function Ae(t,r){t&1&&u(0," Error in JSON ")}function De(t,r){t&1&&u(0," Save your changes ")}function Fe(t,r){t&1&&E(0,"cds-loading",10)}var be=(()=>{class t extends se{#e;#t;#i;constructor(){super(),this.#e=a(I),this.#t=a(P),this.loadingSig=this.#e.isPending,this.codeChangeSubject=new F,this.editorOptions={theme:"vs-dark",language:"json",wordWrap:"on"},this.codeSig=b(""),this.errorStateSig=b("noError"),this.#i="",this.codeChangeSubject.pipe(O({next:()=>{this.errorStateSig.set("isPending")}}),j(500),O({next:e=>{this.codeSig.set(e),this.#r(e)?this.errorStateSig.set("noError"):this.errorStateSig.set("isError")}}),K()).subscribe(),this.#o()}async updateUIElementTemplate(){let e=JSON.parse(f(this.codeSig));this.#t.updateCurrentEditingTemplate(e);let i=f(this.#t.currentEditingTemplate);if(!i){console.error("Edited template is missing from store");return}await this.#e.change(i),f(this.#e.error)||this.closeModal()}#o(){M(async()=>{let e=this.#t.currentEditableFields();if(!e)return;let i=JSON.stringify(e),o=await this.#n(i);this.#i=o,this.codeSig.set(o)})}async#n(e){return await Oe(e,{parser:"json",plugins:[ve,Pe]})}#r(e){try{return JSON.parse(e),!0}catch(i){return console.log("Something went wrong:",i),!1}}closeModal(){this.codeSig.set(this.#i),super.closeModal()}static{this.\u0275fac=function(i){return new(i||t)}}static{this.\u0275cmp=S({type:t,selectors:[["namnguyen191-raw-template-editor-modal"]],features:[H],decls:16,vars:7,consts:[["size","lg",3,"overlaySelected","open"],[3,"closeSelect","showCloseButton"],["cdsModalHeaderLabel",""],["cdsModalHeaderHeading",""],["cdsModalContent","",1,"modal-body"],[3,"isActive"],[1,"editor-container",3,"ngModel","options"],["cdsButton","primary",3,"click","disabled"],["size","sm",4,"ngIf"],[1,"editor-container",3,"ngModelChange","ngModel","options"],["size","sm"]],template:function(i,o){if(i&1){let n=U();J(0)(1),l(2,"cds-modal",0),p("overlaySelected",function(){return h(n),_(o.closeModal())}),l(3,"cds-modal-header",1),p("closeSelect",function(){return h(n),_(o.closeModal())}),l(4,"h2",2),u(5,"Editor"),m(),l(6,"h3",3),u(7,"Edit your template in JSON"),m()(),l(8,"section",4),R(9,Le,1,1,"cds-loading",5)(10,Ve,1,2,"ngx-monaco-editor",6),m(),l(11,"cds-modal-footer")(12,"button",7),p("click",function(){return h(n),_(o.updateUIElementTemplate())}),R(13,Ae,1,0)(14,De,1,0)(15,Fe,1,0,"cds-loading",8),m()()()}if(i&2){let n=o.errorStateSig();d();let c=W(o.codeSig());d(),s("open",o.open),d(),s("showCloseButton",!0),d(6),x(o.loadingSig()||!c?9:10),d(3),s("disabled",n==="isError"||n==="isPending"),d(),x(n==="isError"?13:14),d(2),s("ngIf",n==="isPending")}},dependencies:[q,z,fe,me,pe,ce,ue,ge,Ee,he,w,ne,re,le,ae,y,C,de],styles:["[_nghost-%COMP%]{display:contents}[_nghost-%COMP%]   .modal-body[_ngcontent-%COMP%]{height:70vh;display:flex;justify-content:center;align-items:center}[_nghost-%COMP%]   .modal-body[_ngcontent-%COMP%]   .editor-container[_ngcontent-%COMP%]{height:100%;flex:1}"],changeDetection:0})}}return t})();var Mt=(()=>{class t{#e;#t;#i;#o;#n;#r;#a;constructor(){this.#e=a(G),this.#t=a(Q),this.#i=a(I),this.#o=a(P),this.#n=a(te),this.#r=this.#e.snapshot.params.id,this.#a="editRawTemplate",this.isRawTemplateEditorModalOpenSig=X(this.#e.queryParams.pipe(N(e=>e[this.#a]==="true")),{initialValue:!1}),this.PREVIEW_LAYOUT_ID=v.id,this.#n.registerAll([we]),this.#i.updateQuery({id:this.#r}),this.#l()}toggleModal(e){this.#t.navigate([],{relativeTo:this.#e,queryParams:{[this.#a]:e?!0:null},queryParamsHandling:"merge"})}#l(){M(()=>{let e=this.#i.filteredUIElementTemplates()[0];e&&this.#o.setCurrentEditingTemplate(e)})}static{this.\u0275fac=function(i){return new(i||t)}}static{this.\u0275cmp=S({type:t,selectors:[["namnguyen191-edit-ui-element-template-page"]],decls:6,vars:2,consts:[[3,"layoutId"],[1,"edit-controls-container"],["cdsButton","primary",3,"click"],["cdsIcon","edit","size","16",1,"cds--btn__icon"],[3,"close","open"]],template:function(i,o){i&1&&(E(0,"djui",0),l(1,"div",1)(2,"button",2),p("click",function(){return o.toggleModal(!0)}),u(3," Open template editor "),B(),E(4,"svg",3),m()(),k(),l(5,"namnguyen191-raw-template-editor-modal",4),p("close",function(){return o.toggleModal(!1)}),m()),i&2&&(s("layoutId",o.PREVIEW_LAYOUT_ID),d(5),s("open",o.isRawTemplateEditorModalOpenSig()))},dependencies:[ee,w,y,C,oe,ie,be],styles:["[_nghost-%COMP%]{height:calc(100vh - 3rem);display:grid;grid-template-columns:minmax(0,1fr) 20rem}[_nghost-%COMP%]   .edit-controls-container[_ngcontent-%COMP%]{display:flex;align-items:baseline}[_nghost-%COMP%]   .edit-controls-container[_ngcontent-%COMP%] > *[_ngcontent-%COMP%]{flex-grow:1}"],changeDetection:0})}}return t})();export{Mt as EditUIElementTemplatePageComponent};
