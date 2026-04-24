import{a as j,b as w}from"./chunk-LKVVDLQW.js";import{Ca as n,Ka as I,Na as A,Oa as N,Pa as s}from"./chunk-5QZSDTXI.js";import{u as E}from"./chunk-PM5SR23A.js";import{$a as m,Ia as g,Kb as S,L as d,Lb as z,Lc as M,M as l,O as p,Q as a,Wa as u,Wb as h,Xa as y,Xb as C,_a as v,fc as B,ka as c,tb as r,ub as f,vb as b,wb as D}from"./chunk-M7JBURX2.js";var k=["*"],O=`
.p-overlaybadge {
    position: relative;
}

.p-overlaybadge .p-badge {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    transform-origin: 100% 0;
    margin: 0;
    outline-width: dt('overlaybadge.outline.width');
    outline-style: solid;
    outline-color: dt('overlaybadge.outline.color');
}
`,V={root:"p-overlaybadge"},F=(()=>{class e extends I{name="overlaybadge";style=O;classes=V;static \u0275fac=(()=>{let i;return function(t){return(i||(i=c(e)))(t||e)}})();static \u0275prov=d({token:e,factory:e.\u0275fac})}return e})(),T=new p("OVERLAYBADGE_INSTANCE"),R=(()=>{class e extends N{$pcOverlayBadge=a(T,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=a(s,{self:!0});styleClass;style;badgeSize;severity;value;badgeDisabled=!1;set size(i){this._size=i,!this.badgeSize&&this.size&&console.log("size property is deprecated and will removed in v18, use badgeSize instead.")}get size(){return this._size}_size;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host"))}_componentStyle=a(F);constructor(){super()}static \u0275fac=function(o){return new(o||e)};static \u0275cmp=u({type:e,selectors:[["p-overlayBadge"],["p-overlay-badge"],["p-overlaybadge"]],inputs:{styleClass:"styleClass",style:"style",badgeSize:"badgeSize",severity:"severity",value:"value",badgeDisabled:[2,"badgeDisabled","badgeDisabled",M],size:"size"},features:[B([F,{provide:T,useExisting:e},{provide:A,useExisting:e}]),v([s]),m],ngContentSelectors:k,decls:3,vars:11,consts:[[3,"pBind"],[3,"pt","styleClass","badgeSize","severity","value","badgeDisabled"]],template:function(o,t){o&1&&(S(),f(0,"div",0),z(1),D(2,"p-badge",1),b()),o&2&&(C(t.cx("root")),r("pBind",t.ptm("root")),g(2),h(t.style),r("pt",t.ptm("pcBadge"))("styleClass",t.styleClass)("badgeSize",t.badgeSize)("severity",t.severity)("value",t.value)("badgeDisabled",t.badgeDisabled))},dependencies:[E,w,j,n,s],encapsulation:2,changeDetection:0})}return e})(),ee=(()=>{class e{static \u0275fac=function(o){return new(o||e)};static \u0275mod=y({type:e});static \u0275inj=l({imports:[R,n,n]})}return e})();export{R as a,ee as b};
