import{c as Ee,d as Ne,e as Ae,f as Me,g as Le,h as De,i as ke,j as Fe,k as Ve}from"./chunk-JZWFIAWU.js";import"./chunk-VIZDSAUF.js";import"./chunk-ODVR7ZJH.js";import{a as ue,b as fe}from"./chunk-W55HETMF.js";import{A as ye,B as we,C as Oe,D as Se,c as ge,j as de,k as _e,l as me,n as xe,p as Pe,t as Ie,v as be,y as Te,z as Ce}from"./chunk-KMDEKQMR.js";import{b as he,e as ve}from"./chunk-YFNKZN5I.js";import{b as le,c as pe}from"./chunk-JPM3QN3O.js";import{b as ce}from"./chunk-OWN4CUHW.js";import"./chunk-EWUWNZZG.js";import"./chunk-CB73VGS7.js";import"./chunk-HAEKH4MG.js";import{a as W,c as w}from"./chunk-PGWQLFOQ.js";import{b as Be,c as Ge,d as ze}from"./chunk-P7QEISYO.js";import{a as u,b as oe,c as re,o as se}from"./chunk-RNE5JESU.js";import"./chunk-SPYAYC6H.js";import{$a as i,Aa as T,Ab as n,Ac as ee,Bc as V,Cb as U,Fb as Q,Kb as c,Lb as s,Mb as v,Nb as O,Ob as S,Pc as te,Qb as y,Rb as A,Rc as ie,Sb as l,Sc as B,Vc as ne,Xc as ae,Yc as G,Z,bc as g,cc as I,dc as f,eb as j,ec as L,fc as D,gc as k,la as x,lb as M,ma as P,mb as X,mc as h,na as N,nc as F,oa as K,oc as R,pa as Y,pb as J,rb as _,rc as d,sc as m,tc as E,va as q,za as $,zb as C}from"./chunk-J33AFEAQ.js";import"./chunk-VKRCUX5N.js";var qe=t=>({"cds--skeleton":t}),H=t=>({"margin-left":t}),Ue=(t,o,e)=>({start:t,end:o,total:e}),$e=(t,o)=>({start:t,end:o}),je=t=>({"cds--pagination__button--no-index":t}),Re=t=>({last:t});function Xe(t,o){t&1&&(c(0,"div",3),v(1,"p",4)(2,"p",5)(3,"p",6),s())}function Je(t,o){if(t&1&&(c(0,"option",14),g(1),s()),t&2){let e=o.$implicit;n("value",e),i(),f(" ",e," ")}}function Qe(t,o){if(t&1){let e=y();O(0),c(1,"label",9),g(2),d(3,"async"),s(),c(4,"div",10)(5,"select",11),k("ngModelChange",function(r){x(e);let p=l(2);return D(p.itemsPerPage,r)||(p.itemsPerPage=r),P(r)}),_(6,Je,2,2,"option",12),s(),N(),v(7,"svg",13),d(8,"async"),s(),S()}if(t&2){let e=l(2);i(),n("for",e.itemsPerPageSelectId),i(),f(" ",m(3,9,e.itemsPerPageText.subject)," "),i(2),U("cds--select--disabled",e.pageInputDisabled),i(),n("id",e.itemsPerPageSelectId),L("ngModel",e.itemsPerPage),n("disabled",e.pageInputDisabled),i(),n("ngForOf",e.itemsPerPageOptions),i(),C("ariaLabel",m(8,11,e.optionsListText.subject))}}function et(t,o){if(t&1&&(c(0,"span",15),g(1),d(2,"i18nReplace"),d(3,"async"),s()),t&2){let e=l(2);n("ngStyle",h(7,H,e.showPageInput?null:0)),i(),f(" ",m(3,5,E(2,2,e.totalItemText.subject,R(9,Ue,e.startItemIndex,e.endItemIndex,e.totalDataLength)))," ")}}function tt(t,o){if(t&1&&(c(0,"span",15),g(1),d(2,"i18nReplace"),d(3,"async"),s()),t&2){let e=l(2);n("ngStyle",h(7,H,e.showPageInput?null:0)),i(),f(" ",m(3,5,E(2,2,e.totalItemsText.subject,R(9,Ue,e.startItemIndex,e.endItemIndex,e.totalDataLength)))," ")}}function it(t,o){if(t&1&&(c(0,"span",15),g(1),d(2,"i18nReplace"),d(3,"async"),s()),t&2){let e=l(2);n("ngStyle",h(7,H,e.showPageInput?null:0)),i(),f(" ",m(3,5,E(2,2,e.totalItemsUnknownText.subject,F(9,$e,e.startItemIndex,e.endItemIndex)))," ")}}function nt(t,o){if(t&1&&(c(0,"div",3),_(1,Qe,9,13,"ng-container",7)(2,et,4,13,"span",8)(3,tt,4,13,"span",8)(4,it,4,12,"span",8),s()),t&2){let e=l();i(),n("ngIf",e.showPageInput),i(),n("ngIf",!e.pagesUnknown&&e.totalDataLength<=1),i(),n("ngIf",!e.pagesUnknown&&e.totalDataLength>1),i(),n("ngIf",e.pagesUnknown)}}function at(t,o){t&1&&(c(0,"div",16),v(1,"p",4),s())}function ot(t,o){if(t&1&&(O(0),g(1),S()),t&2){let e=l(3);i(),I(e.currentPage)}}function rt(t,o){if(t&1&&(c(0,"span",24),_(1,ot,2,1,"ng-container",7),g(2),d(3,"async"),s()),t&2){let e=l(2);i(),n("ngIf",!e.showPageInput),i(),f(" ",m(3,2,e.pageText.subject)," ")}}function st(t,o){if(t&1){let e=y();c(0,"input",30),k("ngModelChange",function(r){x(e);let p=l(3);return D(p.currentPage,r)||(p.currentPage=r),P(r)}),s()}if(t&2){let e=l(3);n("id",e.currentPageSelectId)("max",e.pageOptions.length),L("ngModel",e.currentPage)}}function ct(t,o){if(t&1&&(c(0,"option",14),g(1),s()),t&2){let e=o.index;n("value",e+1),i(),I(e+1)}}function lt(t,o){if(t&1){let e=y();c(0,"select",31),k("ngModelChange",function(r){x(e);let p=l(3);return D(p.currentPage,r)||(p.currentPage=r),P(r)}),_(1,ct,2,2,"option",12),s()}if(t&2){let e=l(3);n("id",e.currentPageSelectId)("disabled",e.pageInputDisabled),L("ngModel",e.currentPage),i(),n("ngForOf",e.pageOptions)}}function pt(t,o){if(t&1&&(N(),v(0,"svg",32),d(1,"async")),t&2){let e=l(3);C("ariaLabel",m(1,1,e.optionsListText.subject))}}function gt(t,o){if(t&1&&(O(0),c(1,"div",25)(2,"label",26),g(3),d(4,"async"),s(),_(5,st,1,3,"input",27)(6,lt,2,4,"select",28)(7,pt,2,3,"svg",29),s(),S()),t&2){let e=l(2);i(),U("cds--select--disabled",e.pageInputDisabled),i(),n("for",e.currentPageSelectId),i(),I(m(4,7,e.pageText.subject)),i(2),n("ngIf",e.pageOptions.length>e.pageSelectThreshold),i(),n("ngIf",e.pageOptions.length<=e.pageSelectThreshold),i(),n("ngIf",e.pageOptions.length<=e.pageSelectThreshold)}}function dt(t,o){if(t&1&&(O(0),g(1),S()),t&2){let e=l(3);i(),I(e.currentPage)}}function _t(t,o){if(t&1&&(c(0,"span",33),_(1,dt,2,1,"ng-container",7),g(2),d(3,"i18nReplace"),d(4,"async"),s()),t&2){let e=l(2);i(),n("ngIf",!e.showPageInput),i(),f(" ",m(4,5,E(3,2,e.ofLastPageText.subject,h(7,Re,e.lastPage)))," ")}}function mt(t,o){if(t&1&&(O(0),g(1),S()),t&2){let e=l(3);i(),I(e.currentPage)}}function ut(t,o){if(t&1&&(c(0,"span",33),_(1,mt,2,1,"ng-container",7),g(2),d(3,"i18nReplace"),d(4,"async"),s()),t&2){let e=l(2);i(),n("ngIf",!e.showPageInput),i(),f(" ",m(4,5,E(3,2,e.ofLastPagesText.subject,h(7,Re,e.lastPage)))," ")}}function ft(t,o){if(t&1){let e=y();c(0,"div",16),_(1,rt,4,4,"span",17)(2,gt,8,9,"ng-container",7)(3,_t,5,9,"span",18)(4,ut,5,9,"span",18),c(5,"div",19)(6,"button",20),d(7,"async"),A("click",function(){x(e);let r=l();return P(r.selectPage.emit(r.previousPage))}),N(),v(8,"svg",21),s(),K(),c(9,"button",22),d(10,"async"),A("click",function(){x(e);let r=l();return P(r.selectPage.emit(r.nextPage))}),N(),v(11,"svg",23),s()()()}if(t&2){let e=l();i(),n("ngIf",e.pagesUnknown),i(),n("ngIf",e.showPageInput),i(),n("ngIf",!e.pagesUnknown&&e.lastPage<=1),i(),n("ngIf",!e.pagesUnknown&&e.lastPage>1),i(2),n("ngClass",h(14,je,e.currentPage<=1||e.disabled))("disabled",e.currentPage<=1||e.disabled?!0:null),C("aria-label",m(7,10,e.backwardText.subject)),i(3),n("ngClass",h(16,je,e.currentPage>=e.lastPage||e.disabled))("disabled",e.currentPage>=e.lastPage||e.disabled?!0:null),C("aria-label",m(10,12,e.forwardText.subject))}}var z=class{constructor(){this.currentPage=1,this.pageLength=10,this.totalDataLength=0}},We=(()=>{class t{constructor(e,a){this.i18n=e,this.experimental=a,this.skeleton=!1,this.disabled=!1,this.pageInputDisabled=!1,this.showPageInput=!0,this.pagesUnknown=!1,this.pageSelectThreshold=1e3,this.itemsPerPageOptions=[10,20,30,40,50],this.selectPage=new q,this.itemsPerPageSelectId=`pagination-select-items-per-page-${t.paginationCounter}`,this.currentPageSelectId=`pagination-select-current-page-${t.paginationCounter}`,this.itemsPerPageText=this.i18n.getOverridable("PAGINATION.ITEMS_PER_PAGE"),this.optionsListText=this.i18n.getOverridable("PAGINATION.OPEN_LIST_OF_OPTIONS"),this.backwardText=this.i18n.getOverridable("PAGINATION.BACKWARD"),this.forwardText=this.i18n.getOverridable("PAGINATION.FORWARD"),this.totalItemsText=this.i18n.getOverridable("PAGINATION.TOTAL_ITEMS"),this.totalItemText=this.i18n.getOverridable("PAGINATION.TOTAL_ITEM"),this.totalItemsUnknownText=this.i18n.getOverridable("PAGINATION.TOTAL_ITEMS_UNKNOWN"),this.pageText=this.i18n.getOverridable("PAGINATION.PAGE"),this.ofLastPagesText=this.i18n.getOverridable("PAGINATION.OF_LAST_PAGES"),this.ofLastPageText=this.i18n.getOverridable("PAGINATION.OF_LAST_PAGE"),this._pageOptions=[],t.paginationCounter++}set translations(e){let a=ge(this.i18n.getMultiple("PAGINATION"),e);this.itemsPerPageText.override(a.ITEMS_PER_PAGE),this.optionsListText.override(a.OPEN_LIST_OF_OPTIONS),this.backwardText.override(a.BACKWARD),this.forwardText.override(a.FORWARD),this.totalItemsText.override(a.TOTAL_ITEMS),this.totalItemText.override(a.TOTAL_ITEM),this.totalItemsUnknownText.override(a.TOTAL_ITEMS_UNKNOWN),this.pageText.override(a.PAGE),this.ofLastPagesText.override(a.OF_LAST_PAGES),this.ofLastPageText.override(a.OF_LAST_PAGE)}get itemsPerPage(){return this.model.pageLength}set itemsPerPage(e){this.model.pageLength=Number(e),this.currentPage=1}get currentPage(){return this.model.currentPage}set currentPage(e){e=Number(e),this.selectPage.emit(e)}get totalDataLength(){return this.model.totalDataLength}get lastPage(){let e=Math.ceil(this.totalDataLength/this.itemsPerPage);return e>0?e:1}get startItemIndex(){return this.endItemIndex>0?(this.currentPage-1)*this.itemsPerPage+1:0}get endItemIndex(){let e=this.currentPage*this.itemsPerPage;return e<this.totalDataLength?e:this.totalDataLength}get previousPage(){return this.currentPage<=1?1:this.currentPage-1}get nextPage(){let e=this.lastPage;return this.currentPage>=e?e:this.currentPage+1}get pageOptions(){let e=Math.max(Math.ceil(this.totalDataLength/this.itemsPerPage),1);return this._pageOptions.length!==e&&(this._pageOptions=Array(e)),this._pageOptions}}return t.paginationCounter=0,t.\u0275fac=function(e){return new(e||t)(j(de),j(ue))},t.\u0275cmp=M({type:t,selectors:[["cds-pagination"],["ibm-pagination"]],inputs:{skeleton:"skeleton",model:"model",disabled:"disabled",pageInputDisabled:"pageInputDisabled",showPageInput:"showPageInput",pagesUnknown:"pagesUnknown",pageSelectThreshold:"pageSelectThreshold",translations:"translations",itemsPerPageOptions:"itemsPerPageOptions"},outputs:{selectPage:"selectPage"},standalone:!1,decls:5,vars:7,consts:[[1,"cds--pagination",3,"ngClass"],["class","cds--pagination__left",4,"ngIf"],["class","cds--pagination__right",4,"ngIf"],[1,"cds--pagination__left"],[1,"cds--skeleton__text",2,"width","70px"],[1,"cds--skeleton__text",2,"width","35px"],[1,"cds--skeleton__text",2,"width","105px"],[4,"ngIf"],["class","cds--pagination__text cds--pagination__items-count",3,"ngStyle",4,"ngIf"],[1,"cds--pagination__text",3,"for"],[1,"cds--select","cds--select--inline","cds--select__item-count"],[1,"cds--select-input",3,"ngModelChange","id","ngModel","disabled"],["class","cds--select-option",3,"value",4,"ngFor","ngForOf"],["cdsIcon","chevron--down","size","16","aria-hidden","true",1,"cds--select__arrow",2,"display","inherit"],[1,"cds--select-option",3,"value"],[1,"cds--pagination__text","cds--pagination__items-count",3,"ngStyle"],[1,"cds--pagination__right"],["class","cds--pagination__text cds--pagination__page-text",4,"ngIf"],["class","cds--pagination__text",4,"ngIf"],[1,"cds--pagination__control-buttons"],["cdsButton","ghost","iconOnly","true","tabindex","0",1,"cds--pagination__button","cds--pagination__button--backward",3,"click","ngClass","disabled"],["cdsIcon","caret--left","size","16",1,"cds--btn__icon"],["cdsButton","ghost","iconOnly","true","tabindex","0",1,"cds--pagination__button","cds--pagination__button--forward",3,"click","ngClass","disabled"],["cdsIcon","caret--right","size","16",1,"cds--btn__icon"],[1,"cds--pagination__text","cds--pagination__page-text"],[1,"cds--select","cds--select--inline","cds--select__page-number"],[1,"cds--label","cds--visually-hidden",3,"for"],["style","padding-right: 1rem; margin-right: 1rem;","type","number","min","1","class","cds--select-input",3,"id","max","ngModel","ngModelChange",4,"ngIf"],["class","cds--select-input",3,"id","disabled","ngModel","ngModelChange",4,"ngIf"],["cdsIcon","chevron--down","size","16","style","display: inherit;","class","cds--select__arrow",4,"ngIf"],["type","number","min","1",1,"cds--select-input",2,"padding-right","1rem","margin-right","1rem",3,"ngModelChange","id","max","ngModel"],[1,"cds--select-input",3,"ngModelChange","id","disabled","ngModel"],["cdsIcon","chevron--down","size","16",1,"cds--select__arrow",2,"display","inherit"],[1,"cds--pagination__text"]],template:function(e,a){e&1&&(c(0,"div",0),_(1,Xe,4,0,"div",1)(2,nt,5,4,"div",1)(3,at,2,0,"div",2)(4,ft,12,18,"div",2),s()),e&2&&(n("ngClass",h(5,qe,a.skeleton)),i(),n("ngIf",a.skeleton),i(),n("ngIf",!a.skeleton),i(),n("ngIf",a.skeleton),i(),n("ngIf",!a.skeleton))},dependencies:[te,ie,B,ne,Ce,ye,xe,be,Te,Pe,Oe,we,Ie,le,he,ae,_e],encapsulation:2}),t})();var He=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=X({type:t}),t.\u0275inj=Z({imports:[G,Se,me,fe,pe,ve]}),t})();var ht=u.array(W),vt=u.array(ht),xt=u.array(W),Pt=u.string({errorMap:()=>({message:"Table description must be a string"})}),It=u.object({pageSizes:u.array(u.number()).optional(),pageInputDisabled:u.boolean().optional(),totalDataLength:u.number().optional()}),b=u.object({title:u.string(),headers:xt,rows:vt,description:Pt,pagination:It,primaryButtonId:u.string()}),Qt=se(b,["paginationChanged"]);var bt=t=>[t],Tt=(t,o)=>({id:t,uiElementTemplateId:o});function Ct(t,o){if(t&1&&v(0,"dj-ui-element-wrapper",3),t&2){let e=o.ngIf,a=l();n("requiredComponentSymbols",h(2,bt,a.carbonButtonSymbol))("uiElementInstance",F(4,Tt,e,e))}}function yt(t,o){if(t&1&&(c(0,"p",4),g(1),s()),t&2){let e=o.ngIf;i(),f(" ",e," ")}}function wt(t,o){t&1&&(c(0,"span"),g(1,"Something went wrong fetching data"),s())}function Ot(t,o){if(t&1&&(c(0,"tbody")(1,"tr")(2,"td",8)(3,"div"),g(4),s()()()()),t&2){let e=l(2);i(2),C("colspan",e.headersConfigOption().length),i(2),f(" ",e.isErrorConfigOption()?"Something went wrong fetching data":"No data"," ")}}function St(t,o){if(t&1){let e=y();c(0,"cds-pagination",9),A("selectPage",function(r){x(e);let p=l(2);return P(p.selectPage(r))}),s()}if(t&2){let e,a,r=l(2);n("itemsPerPageOptions",(e=r.paginationConfigOption().pageSizes)!==null&&e!==void 0?e:r.DEFAULT_PAGINATION_PAGE_SIZES)("model",r.paginationModel())("pageInputDisabled",(a=r.paginationConfigOption().pageInputDisabled)!==null&&a!==void 0?a:!1)}}function Et(t,o){if(t&1&&(c(0,"cds-table",5),_(1,Ot,5,2,"tbody",6),s(),_(2,St,1,3,"cds-pagination",7)),t&2){let e=l();n("model",e.tableModel())("showSelectionColumn",!1)("skeleton",e.isLoadingConfigOption()),i(),n("ngIf",!e.isLoadingConfigOption()),i(),n("ngIf",e.shouldDisplayPagination())}}var di=(()=>{class t extends oe{constructor(){super(...arguments),this.defaultTitle="Default title",this.titleConfigOption=T(this.defaultTitle,{alias:"title",transform:e=>w(b.shape.title,e,this.defaultTitle)}),this.primaryButtonIdConfigOption=T("",{alias:"primaryButtonId",transform:e=>w(b.shape.primaryButtonId,e,"")}),this.headersConfigOption=T([],{alias:"headers",transform:e=>w(b.shape.headers,e,[])}),this.descriptionConfigOption=T("",{alias:"description",transform:e=>w(b.shape.description,e,"")}),this.rowsConfigOption=T([],{alias:"rows",transform:e=>w(b.shape.rows,e,[])}),this.tableModel=V(()=>{let e=this.headersConfigOption(),a=this.rowsConfigOption(),r=new Le;return r.header=e.map(p=>new Ae({data:p})),r.data=a.map(p=>p.map(Ze=>new Me({data:Ze}))),r}),this.DEFAULT_PAGINATION_PAGE_SIZES=[5,10,20],this.paginationConfigOption=T({},{alias:"pagination",transform:e=>w(b.shape.pagination,e,{pageSizes:this.DEFAULT_PAGINATION_PAGE_SIZES})}),this.shouldDisplayPagination=V(()=>!re(this.paginationConfigOption())),this.paginationModel=V(()=>{let e=this.paginationConfigOption(),a=e.pageSizes?.[0]??this.DEFAULT_PAGINATION_PAGE_SIZES[0],r=e.totalDataLength,p=new z;return p.currentPage=1,p.pageLength=a,p.totalDataLength=r??0,p}),this.paginationChanged=$(),this.carbonButtonSymbol=Be}static{this.ELEMENT_TYPE=Ge}static{this.ELEMENT_SYMBOL=ze}getElementType(){return t.ELEMENT_TYPE}getSymbol(){return t.ELEMENT_SYMBOL}selectPage(e){let a=ee(this.paginationModel);a.currentPage=e;let r=a.pageLength??0;this.paginationChanged.emit({pageLength:r,selectedPage:e})}static{this.\u0275fac=(()=>{let e;return function(r){return(e||(e=Y(t)))(r||t)}})()}static{this.\u0275cmp=M({type:t,selectors:[["dj-ui-carbon-table"]],inputs:{titleConfigOption:[1,"title","titleConfigOption"],primaryButtonIdConfigOption:[1,"primaryButtonId","primaryButtonIdConfigOption"],headersConfigOption:[1,"headers","headersConfigOption"],descriptionConfigOption:[1,"description","descriptionConfigOption"],rowsConfigOption:[1,"rows","rowsConfigOption"],paginationConfigOption:[1,"pagination","paginationConfigOption"]},outputs:{paginationChanged:"paginationChanged"},features:[J],decls:8,vars:4,consts:[[3,"requiredComponentSymbols","uiElementInstance",4,"ngIf"],["cdsTableHeaderTitle","","id","table-header"],["cdsTableHeaderDescription","","id","table-description",4,"ngIf"],[3,"requiredComponentSymbols","uiElementInstance"],["cdsTableHeaderDescription","","id","table-description"],["ariaDescribedby","table-description","ariaLabelledby","table-header",3,"model","showSelectionColumn","skeleton"],[4,"ngIf"],[3,"itemsPerPageOptions","model","pageInputDisabled","selectPage",4,"ngIf"],[1,"no-data"],[3,"selectPage","itemsPerPageOptions","model","pageInputDisabled"]],template:function(a,r){a&1&&(c(0,"cds-table-container"),_(1,Ct,1,7,"dj-ui-element-wrapper",0),c(2,"cds-table-header")(3,"h4",1),g(4),s(),_(5,yt,2,1,"p",2),s(),_(6,wt,2,0,"span")(7,Et,3,5),s()),a&2&&(i(),n("ngIf",r.primaryButtonIdConfigOption()),i(3),I(r.titleConfigOption()),i(),n("ngIf",r.descriptionConfigOption()),i(),Q(r.isErrorConfigOption()?6:7))},dependencies:[G,B,Ve,ke,Fe,Ne,Ee,De,He,We,ce],styles:["[_nghost-%COMP%]{display:block;height:100%;overflow:scroll}[_nghost-%COMP%]   .no-data[_ngcontent-%COMP%]{width:100%;height:150px;text-align:center}"],changeDetection:0})}}return t})();export{di as CarbonTableComponent,Qt as ZCarbonTableForJsonSchema,b as ZodCarbonTableUIElementComponentConfigs,Pt as ZodTableDescriptionConfig,xt as ZodTableHeadersConfig,It as ZodTablePaginationConfigs,ht as ZodTableRowObject,vt as ZodTableRowsConfig};
