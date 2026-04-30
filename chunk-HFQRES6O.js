import{Ha as u,Ka as v,Na as I,Oa as w,Pa as i,Qa as D}from"./chunk-UEDOXAPN.js";import{$a as g,Kb as m,L as d,Lb as b,M as a,O as s,Q as e,Wa as l,Wb as M,Xa as c,Xb as h,_a as f,gc as y,ka as r}from"./chunk-4THFKMV7.js";var N=`
    .p-inputgroup,
    .p-inputgroup .p-iconfield,
    .p-inputgroup .p-floatlabel,
    .p-inputgroup .p-iftalabel {
        display: flex;
        align-items: stretch;
        width: 100%;
    }

    .p-inputgroup .p-inputtext,
    .p-inputgroup .p-inputwrapper {
        flex: 1 1 auto;
        width: 1%;
    }

    .p-inputgroupaddon {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: dt('inputgroup.addon.padding');
        background: dt('inputgroup.addon.background');
        color: dt('inputgroup.addon.color');
        border-block-start: 1px solid dt('inputgroup.addon.border.color');
        border-block-end: 1px solid dt('inputgroup.addon.border.color');
        min-width: dt('inputgroup.addon.min.width');
    }

    .p-inputgroupaddon:first-child,
    .p-inputgroupaddon + .p-inputgroupaddon {
        border-inline-start: 1px solid dt('inputgroup.addon.border.color');
    }

    .p-inputgroupaddon:last-child {
        border-inline-end: 1px solid dt('inputgroup.addon.border.color');
    }

    .p-inputgroupaddon:has(.p-button) {
        padding: 0;
        overflow: hidden;
    }

    .p-inputgroupaddon .p-button {
        border-radius: 0;
    }

    .p-inputgroup > .p-component,
    .p-inputgroup > .p-inputwrapper > .p-component,
    .p-inputgroup > .p-iconfield > .p-component,
    .p-inputgroup > .p-floatlabel > .p-component,
    .p-inputgroup > .p-floatlabel > .p-inputwrapper > .p-component,
    .p-inputgroup > .p-iftalabel > .p-component,
    .p-inputgroup > .p-iftalabel > .p-inputwrapper > .p-component {
        border-radius: 0;
        margin: 0;
    }

    .p-inputgroupaddon:first-child,
    .p-inputgroup > .p-component:first-child,
    .p-inputgroup > .p-inputwrapper:first-child > .p-component,
    .p-inputgroup > .p-iconfield:first-child > .p-component,
    .p-inputgroup > .p-floatlabel:first-child > .p-component,
    .p-inputgroup > .p-floatlabel:first-child > .p-inputwrapper > .p-component,
    .p-inputgroup > .p-iftalabel:first-child > .p-component,
    .p-inputgroup > .p-iftalabel:first-child > .p-inputwrapper > .p-component {
        border-start-start-radius: dt('inputgroup.addon.border.radius');
        border-end-start-radius: dt('inputgroup.addon.border.radius');
    }

    .p-inputgroupaddon:last-child,
    .p-inputgroup > .p-component:last-child,
    .p-inputgroup > .p-inputwrapper:last-child > .p-component,
    .p-inputgroup > .p-iconfield:last-child > .p-component,
    .p-inputgroup > .p-floatlabel:last-child > .p-component,
    .p-inputgroup > .p-floatlabel:last-child > .p-inputwrapper > .p-component,
    .p-inputgroup > .p-iftalabel:last-child > .p-component,
    .p-inputgroup > .p-iftalabel:last-child > .p-inputwrapper > .p-component {
        border-start-end-radius: dt('inputgroup.addon.border.radius');
        border-end-end-radius: dt('inputgroup.addon.border.radius');
    }

    .p-inputgroup .p-component:focus,
    .p-inputgroup .p-component.p-focus,
    .p-inputgroup .p-inputwrapper-focus,
    .p-inputgroup .p-component:focus ~ label,
    .p-inputgroup .p-component.p-focus ~ label,
    .p-inputgroup .p-inputwrapper-focus ~ label {
        z-index: 1;
    }

    .p-inputgroup > .p-button:not(.p-button-icon-only) {
        width: auto;
    }

    .p-inputgroup .p-iconfield + .p-iconfield .p-inputtext {
        border-inline-start: 0;
    }
`;var j=["*"],T=`
    ${N}

    /*For PrimeNG*/

    .p-inputgroup > .p-component,
    .p-inputgroup > .p-inputwrapper > .p-component,
    .p-inputgroup:first-child > p-button > .p-button,
    .p-inputgroup > .p-floatlabel > .p-component,
    .p-inputgroup > .p-floatlabel > .p-inputwrapper > .p-component,
    .p-inputgroup > .p-iftalabel > .p-component,
    .p-inputgroup > .p-iftalabel > .p-inputwrapper > .p-component {
        border-radius: 0;
        margin: 0;
    }

    .p-inputgroup p-button:first-child,
    .p-inputgroup p-button:last-child {
        display: inline-flex;
    }

    .p-inputgroup:has(> p-button:first-child) .p-button {
        border-start-start-radius: dt('inputgroup.addon.border.radius');
        border-end-start-radius: dt('inputgroup.addon.border.radius');
    }

    .p-inputgroup:has(> p-button:last-child) .p-button {
        border-start-end-radius: dt('inputgroup.addon.border.radius');
        border-end-end-radius: dt('inputgroup.addon.border.radius');
    }

    .p-inputgroup > p-inputmask > .p-inputtext {
        width: 100%;
    }
`,k={root:({instance:n})=>["p-inputgroup",{"p-inputgroup-fluid":n.fluid}]},C=(()=>{class n extends v{name="inputgroup";style=T;classes=k;static \u0275fac=(()=>{let p;return function(t){return(p||(p=r(n)))(t||n)}})();static \u0275prov=d({token:n,factory:n.\u0275fac})}return n})();var x=new s("INPUTGROUP_INSTANCE"),G=(()=>{class n extends w{_componentStyle=e(C);$pcInputGroup=e(x,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=e(i,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}styleClass;static \u0275fac=(()=>{let p;return function(t){return(p||(p=r(n)))(t||n)}})();static \u0275cmp=l({type:n,selectors:[["p-inputgroup"],["p-inputGroup"],["p-input-group"]],hostVars:2,hostBindings:function(o,t){o&2&&h(t.cn(t.cx("root"),t.styleClass))},inputs:{styleClass:"styleClass"},features:[y([C,{provide:x,useExisting:n},{provide:I,useExisting:n}]),f([i]),g],ngContentSelectors:j,decls:1,vars:0,template:function(o,t){o&1&&(m(),b(0))},dependencies:[D],encapsulation:2})}return n})(),Q=(()=>{class n{static \u0275fac=function(o){return new(o||n)};static \u0275mod=c({type:n});static \u0275inj=a({imports:[G,u,u]})}return n})();var P=["*"],E={root:"p-inputgroupaddon"},F=(()=>{class n extends v{name="inputgroupaddon";classes=E;static \u0275fac=(()=>{let p;return function(t){return(p||(p=r(n)))(t||n)}})();static \u0275prov=d({token:n,factory:n.\u0275fac})}return n})(),B=new s("INPUTGROUPADDON_INSTANCE"),U=(()=>{class n extends w{_componentStyle=e(F);$pcInputGroupAddon=e(B,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=e(i,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}style;styleClass;get hostStyle(){return this.style}static \u0275fac=(()=>{let p;return function(t){return(p||(p=r(n)))(t||n)}})();static \u0275cmp=l({type:n,selectors:[["p-inputgroup-addon"],["p-inputGroupAddon"]],hostVars:4,hostBindings:function(o,t){o&2&&(M(t.hostStyle),h(t.cn(t.cx("root"),t.styleClass)))},inputs:{style:"style",styleClass:"styleClass"},features:[y([F,{provide:B,useExisting:n},{provide:I,useExisting:n}]),f([i]),g],ngContentSelectors:P,decls:1,vars:0,template:function(o,t){o&1&&(m(),b(0))},dependencies:[D],encapsulation:2})}return n})(),dn=(()=>{class n{static \u0275fac=function(o){return new(o||n)};static \u0275mod=c({type:n});static \u0275inj=a({imports:[U,u,u]})}return n})();export{G as a,Q as b,U as c,dn as d};
