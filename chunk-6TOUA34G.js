import{a as de}from"./chunk-XE7AVLJP.js";import{a as le}from"./chunk-2ICPHVAI.js";import{a as ne,c as te}from"./chunk-FTQUBBO6.js";import{a as re}from"./chunk-P4PGZFDV.js";import{Ga as oe,Ha as C,Ka as ie,Na as ce,Pa as k,Qa as ae,f as Z,g as ee}from"./chunk-UEDOXAPN.js";import{j as U,l as J,p as W,u as Y}from"./chunk-BHCYPOM7.js";import{$a as $,Ab as M,Ac as K,Bb as T,Db as L,Dc as E,Hb as Q,Ia as d,Jb as h,K as S,L as N,M as z,Mb as j,Mc as u,Nb as R,Nc as X,O as F,Ob as v,Pb as y,Q as x,V as f,W as m,Wa as A,Wb as q,X as I,Xa as P,Xb as s,_a as O,ab as b,ba as g,fa as D,gc as H,ib as l,ka as w,kc as G,tb as c,ub as V,vb as B,wb as _}from"./chunk-4THFKMV7.js";var se=`
    .p-checkbox {
        position: relative;
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        width: dt('checkbox.width');
        height: dt('checkbox.height');
    }

    .p-checkbox-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border: 1px solid transparent;
        border-radius: dt('checkbox.border.radius');
    }

    .p-checkbox-box {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: dt('checkbox.border.radius');
        border: 1px solid dt('checkbox.border.color');
        background: dt('checkbox.background');
        width: dt('checkbox.width');
        height: dt('checkbox.height');
        transition:
            background dt('checkbox.transition.duration'),
            color dt('checkbox.transition.duration'),
            border-color dt('checkbox.transition.duration'),
            box-shadow dt('checkbox.transition.duration'),
            outline-color dt('checkbox.transition.duration');
        outline-color: transparent;
        box-shadow: dt('checkbox.shadow');
    }

    .p-checkbox-icon {
        transition-duration: dt('checkbox.transition.duration');
        color: dt('checkbox.icon.color');
        font-size: dt('checkbox.icon.size');
        width: dt('checkbox.icon.size');
        height: dt('checkbox.icon.size');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        border-color: dt('checkbox.hover.border.color');
    }

    .p-checkbox-checked .p-checkbox-box {
        border-color: dt('checkbox.checked.border.color');
        background: dt('checkbox.checked.background');
    }

    .p-checkbox-checked .p-checkbox-icon {
        color: dt('checkbox.icon.checked.color');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
        border-color: dt('checkbox.checked.hover.border.color');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-icon {
        color: dt('checkbox.icon.checked.hover.color');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.focus.border.color');
        box-shadow: dt('checkbox.focus.ring.shadow');
        outline: dt('checkbox.focus.ring.width') dt('checkbox.focus.ring.style') dt('checkbox.focus.ring.color');
        outline-offset: dt('checkbox.focus.ring.offset');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.checked.focus.border.color');
    }

    .p-checkbox.p-invalid > .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }

    .p-checkbox.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.filled.background');
    }

    .p-checkbox-checked.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.checked.background');
    }

    .p-checkbox-checked.p-variant-filled:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
    }

    .p-checkbox.p-disabled {
        opacity: 1;
    }

    .p-checkbox.p-disabled .p-checkbox-box {
        background: dt('checkbox.disabled.background');
        border-color: dt('checkbox.checked.disabled.border.color');
    }

    .p-checkbox.p-disabled .p-checkbox-box .p-checkbox-icon {
        color: dt('checkbox.icon.disabled.color');
    }

    .p-checkbox-sm,
    .p-checkbox-sm .p-checkbox-box {
        width: dt('checkbox.sm.width');
        height: dt('checkbox.sm.height');
    }

    .p-checkbox-sm .p-checkbox-icon {
        font-size: dt('checkbox.icon.sm.size');
        width: dt('checkbox.icon.sm.size');
        height: dt('checkbox.icon.sm.size');
    }

    .p-checkbox-lg,
    .p-checkbox-lg .p-checkbox-box {
        width: dt('checkbox.lg.width');
        height: dt('checkbox.lg.height');
    }

    .p-checkbox-lg .p-checkbox-icon {
        font-size: dt('checkbox.icon.lg.size');
        width: dt('checkbox.icon.lg.size');
        height: dt('checkbox.icon.lg.size');
    }
`;var ue=["icon"],ke=["input"],xe=(t,r,e)=>({checked:t,class:r,dataP:e});function fe(t,r){if(t&1&&_(0,"span",8),t&2){let e=h(3);s(e.cx("icon")),c("ngClass",e.checkboxIcon)("pBind",e.ptm("icon")),l("data-p",e.dataP)}}function me(t,r){if(t&1&&(I(),_(0,"svg",9)),t&2){let e=h(3);s(e.cx("icon")),c("pBind",e.ptm("icon")),l("data-p",e.dataP)}}function ge(t,r){if(t&1&&(M(0),b(1,fe,1,5,"span",6)(2,me,1,4,"svg",7),T()),t&2){let e=h(2);d(),c("ngIf",e.checkboxIcon),d(),c("ngIf",!e.checkboxIcon)}}function _e(t,r){if(t&1&&(I(),_(0,"svg",10)),t&2){let e=h(2);s(e.cx("icon")),c("pBind",e.ptm("icon")),l("data-p",e.dataP)}}function ve(t,r){if(t&1&&(M(0),b(1,ge,3,2,"ng-container",3)(2,_e,1,4,"svg",5),T()),t&2){let e=h();d(),c("ngIf",e.checked),d(),c("ngIf",e._indeterminate())}}function ye(t,r){}function Ce(t,r){t&1&&b(0,ye,0,0,"ng-template")}var Ie=`
    ${se}

    /* For PrimeNG */
    p-checkBox.ng-invalid.ng-dirty .p-checkbox-box,
    p-check-box.ng-invalid.ng-dirty .p-checkbox-box,
    p-checkbox.ng-invalid.ng-dirty .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }
`,we={root:({instance:t})=>["p-checkbox p-component",{"p-checkbox-checked p-highlight":t.checked,"p-disabled":t.$disabled(),"p-invalid":t.invalid(),"p-variant-filled":t.$variant()==="filled","p-checkbox-sm p-inputfield-sm":t.size()==="small","p-checkbox-lg p-inputfield-lg":t.size()==="large"}],box:"p-checkbox-box",input:"p-checkbox-input",icon:"p-checkbox-icon"},he=(()=>{class t extends ie{name="checkbox";style=Ie;classes=we;static \u0275fac=(()=>{let e;return function(n){return(e||(e=w(t)))(n||t)}})();static \u0275prov=N({token:t,factory:t.\u0275fac})}return t})();var pe=new F("CHECKBOX_INSTANCE"),Ve={provide:ne,useExisting:S(()=>be),multi:!0},be=(()=>{class t extends le{hostName="";value;binary;ariaLabelledBy;ariaLabel;tabindex;inputId;inputStyle;styleClass;inputClass;indeterminate=!1;formControl;checkboxIcon;readonly;autofocus;trueValue=!0;falseValue=!1;variant=E();size=E();onChange=new g;onFocus=new g;onBlur=new g;inputViewChild;get checked(){return this._indeterminate()?!1:this.binary?this.modelValue()===this.trueValue:ee(this.value,this.modelValue())}_indeterminate=D(void 0);checkboxIconTemplate;templates;_checkboxIconTemplate;focused=!1;_componentStyle=x(he);bindDirectiveInstance=x(k,{self:!0});$pcCheckbox=x(pe,{optional:!0,skipSelf:!0})??void 0;$variant=K(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());onAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"icon":this._checkboxIconTemplate=e.template;break;case"checkboxicon":this._checkboxIconTemplate=e.template;break}})}onChanges(e){e.indeterminate&&this._indeterminate.set(e.indeterminate.currentValue)}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}updateModel(e){let o,n=this.injector.get(te,null,{optional:!0,self:!0}),i=n&&!this.formControl?n.value:this.modelValue();this.binary?(o=this._indeterminate()?this.trueValue:this.checked?this.falseValue:this.trueValue,this.writeModelValue(o),this.onModelChange(o)):(this.checked||this._indeterminate()?o=i.filter(a=>!Z(a,this.value)):o=i?[...i,this.value]:[this.value],this.onModelChange(o),this.writeModelValue(o),this.formControl&&this.formControl.setValue(o)),this._indeterminate()&&this._indeterminate.set(!1),this.onChange.emit({checked:o,originalEvent:e})}handleChange(e){this.readonly||this.updateModel(e)}onInputFocus(e){this.focused=!0,this.onFocus.emit(e)}onInputBlur(e){this.focused=!1,this.onBlur.emit(e),this.onModelTouched()}focus(){this.inputViewChild?.nativeElement.focus()}writeControlValue(e,o){o(e),this.cd.markForCheck()}get dataP(){return this.cn({invalid:this.invalid(),checked:this.checked,disabled:this.$disabled(),filled:this.$variant()==="filled",[this.size()]:this.size()})}static \u0275fac=(()=>{let e;return function(n){return(e||(e=w(t)))(n||t)}})();static \u0275cmp=A({type:t,selectors:[["p-checkbox"],["p-checkBox"],["p-check-box"]],contentQueries:function(o,n,i){if(o&1&&j(i,ue,4)(i,oe,4),o&2){let a;v(a=y())&&(n.checkboxIconTemplate=a.first),v(a=y())&&(n.templates=a)}},viewQuery:function(o,n){if(o&1&&R(ke,5),o&2){let i;v(i=y())&&(n.inputViewChild=i.first)}},hostVars:6,hostBindings:function(o,n){o&2&&(l("data-p-highlight",n.checked)("data-p-checked",n.checked)("data-p-disabled",n.$disabled())("data-p",n.dataP),s(n.cn(n.cx("root"),n.styleClass)))},inputs:{hostName:"hostName",value:"value",binary:[2,"binary","binary",u],ariaLabelledBy:"ariaLabelledBy",ariaLabel:"ariaLabel",tabindex:[2,"tabindex","tabindex",X],inputId:"inputId",inputStyle:"inputStyle",styleClass:"styleClass",inputClass:"inputClass",indeterminate:[2,"indeterminate","indeterminate",u],formControl:"formControl",checkboxIcon:"checkboxIcon",readonly:[2,"readonly","readonly",u],autofocus:[2,"autofocus","autofocus",u],trueValue:"trueValue",falseValue:"falseValue",variant:[1,"variant"],size:[1,"size"]},outputs:{onChange:"onChange",onFocus:"onFocus",onBlur:"onBlur"},features:[H([Ve,he,{provide:pe,useExisting:t},{provide:ce,useExisting:t}]),O([k]),$],decls:5,vars:26,consts:[["input",""],["type","checkbox",3,"focus","blur","change","checked","pBind"],[3,"pBind"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","minus",3,"class","pBind",4,"ngIf"],[3,"class","ngClass","pBind",4,"ngIf"],["data-p-icon","check",3,"class","pBind",4,"ngIf"],[3,"ngClass","pBind"],["data-p-icon","check",3,"pBind"],["data-p-icon","minus",3,"pBind"]],template:function(o,n){if(o&1){let i=L();V(0,"input",1,0),Q("focus",function(p){return f(i),m(n.onInputFocus(p))})("blur",function(p){return f(i),m(n.onInputBlur(p))})("change",function(p){return f(i),m(n.handleChange(p))}),B(),V(2,"div",2),b(3,ve,3,2,"ng-container",3)(4,Ce,1,0,null,4),B()}o&2&&(q(n.inputStyle),s(n.cn(n.cx("input"),n.inputClass)),c("checked",n.checked)("pBind",n.ptm("input")),l("id",n.inputId)("value",n.value)("name",n.name())("tabindex",n.tabindex)("required",n.required()?"":void 0)("readonly",n.readonly?"":void 0)("disabled",n.$disabled()?"":void 0)("aria-labelledby",n.ariaLabelledBy)("aria-label",n.ariaLabel),d(2),s(n.cx("box")),c("pBind",n.ptm("box")),l("data-p",n.dataP),d(),c("ngIf",!n.checkboxIconTemplate&&!n._checkboxIconTemplate),d(),c("ngTemplateOutlet",n.checkboxIconTemplate||n._checkboxIconTemplate)("ngTemplateOutletContext",G(22,xe,n.checked,n.cx("icon"),n.dataP)))},dependencies:[Y,U,J,W,C,re,de,ae,k],encapsulation:2,changeDetection:0})}return t})(),Ze=(()=>{class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=P({type:t});static \u0275inj=z({imports:[be,C,C]})}return t})();export{be as a,Ze as b};
