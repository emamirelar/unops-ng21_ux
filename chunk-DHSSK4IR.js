import{a as Y}from"./chunk-RRHWWQMF.js";import{a as x}from"./chunk-BFYAFXJ5.js";import{e as X}from"./chunk-O22HT2F3.js";import{Ga as W,Ha as p,Ka as U,Na as J,Pa as a,Qa as K}from"./chunk-MY7VEI5E.js";import{p as R,u as q}from"./chunk-PM5SR23A.js";import{$a as I,Cb as D,Cc as G,Db as N,Hb as y,Ia as g,Jb as H,K as C,L as T,Lc as v,M as _,Mb as O,Mc as P,Nb as z,O as S,Ob as h,Pb as u,Q as c,V as w,W as b,Wa as E,Wb as Q,Xa as B,Xb as r,_a as M,ab as F,ba as V,fc as $,hc as j,ib as d,ka as f,nb as A,ob as L,tb as s,ub as m,vb as k}from"./chunk-M7JBURX2.js";var Z=`
    .p-toggleswitch {
        display: inline-block;
        width: dt('toggleswitch.width');
        height: dt('toggleswitch.height');
    }

    .p-toggleswitch-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border-radius: dt('toggleswitch.border.radius');
    }

    .p-toggleswitch-slider {
        cursor: pointer;
        width: 100%;
        height: 100%;
        border-width: dt('toggleswitch.border.width');
        border-style: solid;
        border-color: dt('toggleswitch.border.color');
        background: dt('toggleswitch.background');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            border-color dt('toggleswitch.transition.duration'),
            outline-color dt('toggleswitch.transition.duration'),
            box-shadow dt('toggleswitch.transition.duration');
        border-radius: dt('toggleswitch.border.radius');
        outline-color: transparent;
        box-shadow: dt('toggleswitch.shadow');
    }

    .p-toggleswitch-handle {
        position: absolute;
        top: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: dt('toggleswitch.handle.background');
        color: dt('toggleswitch.handle.color');
        width: dt('toggleswitch.handle.size');
        height: dt('toggleswitch.handle.size');
        inset-inline-start: dt('toggleswitch.gap');
        margin-block-start: calc(-1 * calc(dt('toggleswitch.handle.size') / 2));
        border-radius: dt('toggleswitch.handle.border.radius');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            inset-inline-start dt('toggleswitch.slide.duration'),
            box-shadow dt('toggleswitch.slide.duration');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.background');
        border-color: dt('toggleswitch.checked.border.color');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.background');
        color: dt('toggleswitch.handle.checked.color');
        inset-inline-start: calc(dt('toggleswitch.width') - calc(dt('toggleswitch.handle.size') + dt('toggleswitch.gap')));
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-slider {
        background: dt('toggleswitch.hover.background');
        border-color: dt('toggleswitch.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.hover.background');
        color: dt('toggleswitch.handle.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.hover.background');
        border-color: dt('toggleswitch.checked.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.hover.background');
        color: dt('toggleswitch.handle.checked.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:focus-visible) .p-toggleswitch-slider {
        box-shadow: dt('toggleswitch.focus.ring.shadow');
        outline: dt('toggleswitch.focus.ring.width') dt('toggleswitch.focus.ring.style') dt('toggleswitch.focus.ring.color');
        outline-offset: dt('toggleswitch.focus.ring.offset');
    }

    .p-toggleswitch.p-invalid > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }

    .p-toggleswitch.p-disabled {
        opacity: 1;
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-slider {
        background: dt('toggleswitch.disabled.background');
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.disabled.background');
    }
`;var oe=["handle"],le=["input"],de=t=>({checked:t});function se(t,ne){t&1&&D(0)}function re(t,ne){if(t&1&&F(0,se,1,0,"ng-container",3),t&2){let i=H();s("ngTemplateOutlet",i.handleTemplate||i._handleTemplate)("ngTemplateOutletContext",j(2,de,i.checked()))}}var ae=`
    ${Z}

    p-toggleswitch.ng-invalid.ng-dirty > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }
`,ce={root:{position:"relative"}},ge={root:({instance:t})=>["p-toggleswitch p-component",{"p-toggleswitch p-component":!0,"p-toggleswitch-checked":t.checked(),"p-disabled":t.$disabled(),"p-invalid":t.invalid()}],input:"p-toggleswitch-input",slider:"p-toggleswitch-slider",handle:"p-toggleswitch-handle"},ee=(()=>{class t extends U{name="toggleswitch";style=ae;classes=ge;inlineStyles=ce;static \u0275fac=(()=>{let i;return function(e){return(i||(i=f(t)))(e||t)}})();static \u0275prov=T({token:t,factory:t.\u0275fac})}return t})();var te=new S("TOGGLESWITCH_INSTANCE"),he={provide:x,useExisting:C(()=>ie),multi:!0},ie=(()=>{class t extends Y{$pcToggleSwitch=c(te,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=c(a,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}styleClass;tabindex;inputId;readonly;trueValue=!0;falseValue=!1;ariaLabel;size=G();ariaLabelledBy;autofocus;onChange=new V;input;handleTemplate;_handleTemplate;focused=!1;_componentStyle=c(ee);templates;onHostClick(i){this.onClick(i)}onAfterContentInit(){this.templates.forEach(i=>{switch(i.getType()){case"handle":this._handleTemplate=i.template;break;default:this._handleTemplate=i.template;break}})}onClick(i){!this.$disabled()&&!this.readonly&&(this.writeModelValue(this.checked()?this.falseValue:this.trueValue),this.onModelChange(this.modelValue()),this.onChange.emit({originalEvent:i,checked:this.modelValue()}),this.input.nativeElement.focus())}onFocus(){this.focused=!0}onBlur(){this.focused=!1,this.onModelTouched()}checked(){return this.modelValue()===this.trueValue}writeControlValue(i,n){n(i),this.cd.markForCheck()}get dataP(){return this.cn({checked:this.checked(),disabled:this.$disabled(),invalid:this.invalid()})}static \u0275fac=(()=>{let i;return function(e){return(i||(i=f(t)))(e||t)}})();static \u0275cmp=E({type:t,selectors:[["p-toggleswitch"],["p-toggleSwitch"],["p-toggle-switch"]],contentQueries:function(n,e,o){if(n&1&&O(o,oe,4)(o,W,4),n&2){let l;h(l=u())&&(e.handleTemplate=l.first),h(l=u())&&(e.templates=l)}},viewQuery:function(n,e){if(n&1&&z(le,5),n&2){let o;h(o=u())&&(e.input=o.first)}},hostVars:7,hostBindings:function(n,e){n&1&&y("click",function(l){return e.onHostClick(l)}),n&2&&(d("data-p-checked",e.checked())("data-p-disabled",e.$disabled())("data-p",e.dataP),Q(e.sx("root")),r(e.cn(e.cx("root"),e.styleClass)))},inputs:{styleClass:"styleClass",tabindex:[2,"tabindex","tabindex",P],inputId:"inputId",readonly:[2,"readonly","readonly",v],trueValue:"trueValue",falseValue:"falseValue",ariaLabel:"ariaLabel",size:[1,"size"],ariaLabelledBy:"ariaLabelledBy",autofocus:[2,"autofocus","autofocus",v]},outputs:{onChange:"onChange"},features:[$([he,ee,{provide:te,useExisting:t},{provide:J,useExisting:t}]),M([a]),I],decls:5,vars:22,consts:[["input",""],["type","checkbox","role","switch",3,"focus","blur","checked","pAutoFocus","pBind"],[3,"pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(n,e){if(n&1){let o=N();m(0,"input",1,0),y("focus",function(){return w(o),b(e.onFocus())})("blur",function(){return w(o),b(e.onBlur())}),k(),m(2,"div",2)(3,"div",2),A(4,re,1,4,"ng-container"),k()()}n&2&&(r(e.cx("input")),s("checked",e.checked())("pAutoFocus",e.autofocus)("pBind",e.ptm("input")),d("id",e.inputId)("required",e.required()?"":void 0)("disabled",e.$disabled()?"":void 0)("aria-checked",e.checked())("aria-labelledby",e.ariaLabelledBy)("aria-label",e.ariaLabel)("name",e.name())("tabindex",e.tabindex),g(2),r(e.cx("slider")),s("pBind",e.ptm("slider")),d("data-p",e.dataP),g(),r(e.cx("handle")),s("pBind",e.ptm("handle")),d("data-p",e.dataP),g(),L(e.handleTemplate||e._handleTemplate?4:-1))},dependencies:[q,R,X,p,K,a],encapsulation:2,changeDetection:0})}return t})(),ze=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=B({type:t});static \u0275inj=_({imports:[ie,p,p]})}return t})();export{ie as a,ze as b};
