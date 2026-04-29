import{Ha as s,Ka as N,Na as w,Oa as I,Pa as r,Qa as M,a as E,d as x}from"./chunk-MY7VEI5E.js";import{u as C}from"./chunk-PM5SR23A.js";import{$a as f,Cc as n,L as l,Lc as B,M as b,O as c,Q as a,Ub as v,Wa as p,Xa as u,Xb as m,Yb as S,Zb as z,_a as h,fc as D,ib as y,ka as g}from"./chunk-M7JBURX2.js";var k=`
    .p-badge {
        display: inline-flex;
        border-radius: dt('badge.border.radius');
        align-items: center;
        justify-content: center;
        padding: dt('badge.padding');
        background: dt('badge.primary.background');
        color: dt('badge.primary.color');
        font-size: dt('badge.font.size');
        font-weight: dt('badge.font.weight');
        min-width: dt('badge.min.width');
        height: dt('badge.height');
    }

    .p-badge-dot {
        width: dt('badge.dot.size');
        min-width: dt('badge.dot.size');
        height: dt('badge.dot.size');
        border-radius: 50%;
        padding: 0;
    }

    .p-badge-circle {
        padding: 0;
        border-radius: 50%;
    }

    .p-badge-secondary {
        background: dt('badge.secondary.background');
        color: dt('badge.secondary.color');
    }

    .p-badge-success {
        background: dt('badge.success.background');
        color: dt('badge.success.color');
    }

    .p-badge-info {
        background: dt('badge.info.background');
        color: dt('badge.info.color');
    }

    .p-badge-warn {
        background: dt('badge.warn.background');
        color: dt('badge.warn.color');
    }

    .p-badge-danger {
        background: dt('badge.danger.background');
        color: dt('badge.danger.color');
    }

    .p-badge-contrast {
        background: dt('badge.contrast.background');
        color: dt('badge.contrast.color');
    }

    .p-badge-sm {
        font-size: dt('badge.sm.font.size');
        min-width: dt('badge.sm.min.width');
        height: dt('badge.sm.height');
    }

    .p-badge-lg {
        font-size: dt('badge.lg.font.size');
        min-width: dt('badge.lg.min.width');
        height: dt('badge.lg.height');
    }

    .p-badge-xl {
        font-size: dt('badge.xl.font.size');
        min-width: dt('badge.xl.min.width');
        height: dt('badge.xl.height');
    }
`;var F=`
    ${k}

    /* For PrimeNG (directive)*/
    .p-overlay-badge {
        position: relative;
    }

    .p-overlay-badge > .p-badge {
        position: absolute;
        top: 0;
        inset-inline-end: 0;
        transform: translate(50%, -50%);
        transform-origin: 100% 0;
        margin: 0;
    }
`,P={root:({instance:e})=>{let o=typeof e.value=="function"?e.value():e.value,i=typeof e.size=="function"?e.size():e.size,d=typeof e.badgeSize=="function"?e.badgeSize():e.badgeSize,t=typeof e.severity=="function"?e.severity():e.severity;return["p-badge p-component",{"p-badge-circle":x(o)&&String(o).length===1,"p-badge-dot":E(o),"p-badge-sm":i==="small"||d==="small","p-badge-lg":i==="large"||d==="large","p-badge-xl":i==="xlarge"||d==="xlarge","p-badge-info":t==="info","p-badge-success":t==="success","p-badge-warn":t==="warn","p-badge-danger":t==="danger","p-badge-secondary":t==="secondary","p-badge-contrast":t==="contrast"}]}},T=(()=>{class e extends N{name="badge";style=F;classes=P;static \u0275fac=(()=>{let i;return function(t){return(i||(i=g(e)))(t||e)}})();static \u0275prov=l({token:e,factory:e.\u0275fac})}return e})();var A=new c("BADGE_INSTANCE");var V=(()=>{class e extends I{$pcBadge=a(A,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=a(r,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}styleClass=n();badgeSize=n();size=n();severity=n();value=n();badgeDisabled=n(!1,{transform:B});_componentStyle=a(T);get dataP(){return this.cn({circle:this.value()!=null&&String(this.value()).length===1,empty:this.value()==null,disabled:this.badgeDisabled(),[this.severity()]:this.severity(),[this.size()]:this.size()})}static \u0275fac=(()=>{let i;return function(t){return(i||(i=g(e)))(t||e)}})();static \u0275cmp=p({type:e,selectors:[["p-badge"]],hostVars:5,hostBindings:function(d,t){d&2&&(y("data-p",t.dataP),m(t.cn(t.cx("root"),t.styleClass())),v("display",t.badgeDisabled()?"none":null))},inputs:{styleClass:[1,"styleClass"],badgeSize:[1,"badgeSize"],size:[1,"size"],severity:[1,"severity"],value:[1,"value"],badgeDisabled:[1,"badgeDisabled"]},features:[D([T,{provide:A,useExisting:e},{provide:w,useExisting:e}]),h([r]),f],decls:1,vars:1,template:function(d,t){d&1&&S(0),d&2&&z(t.value())},dependencies:[C,s,M],encapsulation:2,changeDetection:0})}return e})(),oe=(()=>{class e{static \u0275fac=function(d){return new(d||e)};static \u0275mod=u({type:e});static \u0275inj=b({imports:[V,s,s]})}return e})();export{V as a,oe as b};
