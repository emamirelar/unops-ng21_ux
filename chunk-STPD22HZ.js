import{a as wt}from"./chunk-KFOT6DZL.js";import{a as Dt}from"./chunk-RLDC5XH3.js";import{b as ot,c as Ct}from"./chunk-PVZIFOTE.js";import{C as nt,F as yt,Ga as Bt,Ha as at,Ka as E,Na as F,Oa as A,Pa as l,Q as Tt,Qa as m,R as _t,S as R,_ as it,ca as z,f as et,ra as xt}from"./chunk-UEDOXAPN.js";import{p as J,u as O,y as X}from"./chunk-BHCYPOM7.js";import{$a as D,Ac as r,Cb as W,Db as U,Dc as g,Eb as dt,Fc as gt,Hb as V,Hc as G,Ia as v,Jb as h,K as L,Kb as I,L as _,Lb as M,M as st,Mb as ut,Mc as T,Nb as bt,Nc as mt,O as x,Ob as p,Pb as f,Q as o,Qb as pt,Sb as ft,Tb as vt,V as H,W as K,Wa as B,X as tt,Xa as ct,Xb as c,_a as w,ab as S,fa as Q,gc as k,ha as rt,ib as y,ka as u,ma as lt,nb as C,ob as N,tb as b,ub as P,vb as $,vc as ht,wb as q}from"./chunk-4THFKMV7.js";var Nt=`
    .p-tabs {
        display: flex;
        flex-direction: column;
    }

    .p-tablist {
        display: flex;
        position: relative;
        overflow: hidden;
        background: dt('tabs.tablist.background');
    }

    .p-tablist-viewport {
        overflow-x: auto;
        overflow-y: hidden;
        scroll-behavior: smooth;
        scrollbar-width: none;
        overscroll-behavior: contain auto;
    }

    .p-tablist-viewport::-webkit-scrollbar {
        display: none;
    }

    .p-tablist-tab-list {
        position: relative;
        display: flex;
        border-style: solid;
        border-color: dt('tabs.tablist.border.color');
        border-width: dt('tabs.tablist.border.width');
    }

    .p-tablist-content {
        flex-grow: 1;
    }

    .p-tablist-nav-button {
        all: unset;
        position: absolute !important;
        flex-shrink: 0;
        inset-block-start: 0;
        z-index: 2;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: dt('tabs.nav.button.background');
        color: dt('tabs.nav.button.color');
        width: dt('tabs.nav.button.width');
        transition:
            color dt('tabs.transition.duration'),
            outline-color dt('tabs.transition.duration'),
            box-shadow dt('tabs.transition.duration');
        box-shadow: dt('tabs.nav.button.shadow');
        outline-color: transparent;
        cursor: pointer;
    }

    .p-tablist-nav-button:focus-visible {
        z-index: 1;
        box-shadow: dt('tabs.nav.button.focus.ring.shadow');
        outline: dt('tabs.nav.button.focus.ring.width') dt('tabs.nav.button.focus.ring.style') dt('tabs.nav.button.focus.ring.color');
        outline-offset: dt('tabs.nav.button.focus.ring.offset');
    }

    .p-tablist-nav-button:hover {
        color: dt('tabs.nav.button.hover.color');
    }

    .p-tablist-prev-button {
        inset-inline-start: 0;
    }

    .p-tablist-next-button {
        inset-inline-end: 0;
    }

    .p-tablist-prev-button:dir(rtl),
    .p-tablist-next-button:dir(rtl) {
        transform: rotate(180deg);
    }

    .p-tab {
        flex-shrink: 0;
        cursor: pointer;
        user-select: none;
        position: relative;
        border-style: solid;
        white-space: nowrap;
        gap: dt('tabs.tab.gap');
        background: dt('tabs.tab.background');
        border-width: dt('tabs.tab.border.width');
        border-color: dt('tabs.tab.border.color');
        color: dt('tabs.tab.color');
        padding: dt('tabs.tab.padding');
        font-weight: dt('tabs.tab.font.weight');
        transition:
            background dt('tabs.transition.duration'),
            border-color dt('tabs.transition.duration'),
            color dt('tabs.transition.duration'),
            outline-color dt('tabs.transition.duration'),
            box-shadow dt('tabs.transition.duration');
        margin: dt('tabs.tab.margin');
        outline-color: transparent;
    }

    .p-tab:not(.p-disabled):focus-visible {
        z-index: 1;
        box-shadow: dt('tabs.tab.focus.ring.shadow');
        outline: dt('tabs.tab.focus.ring.width') dt('tabs.tab.focus.ring.style') dt('tabs.tab.focus.ring.color');
        outline-offset: dt('tabs.tab.focus.ring.offset');
    }

    .p-tab:not(.p-tab-active):not(.p-disabled):hover {
        background: dt('tabs.tab.hover.background');
        border-color: dt('tabs.tab.hover.border.color');
        color: dt('tabs.tab.hover.color');
    }

    .p-tab-active {
        background: dt('tabs.tab.active.background');
        border-color: dt('tabs.tab.active.border.color');
        color: dt('tabs.tab.active.color');
    }

    .p-tabpanels {
        background: dt('tabs.tabpanel.background');
        color: dt('tabs.tabpanel.color');
        padding: dt('tabs.tabpanel.padding');
        outline: 0 none;
    }

    .p-tabpanel:focus-visible {
        box-shadow: dt('tabs.tabpanel.focus.ring.shadow');
        outline: dt('tabs.tabpanel.focus.ring.width') dt('tabs.tabpanel.focus.ring.style') dt('tabs.tabpanel.focus.ring.color');
        outline-offset: dt('tabs.tabpanel.focus.ring.offset');
    }

    .p-tablist-active-bar {
        z-index: 1;
        display: block;
        position: absolute;
        inset-block-end: dt('tabs.active.bar.bottom');
        height: dt('tabs.active.bar.height');
        background: dt('tabs.active.bar.background');
        transition: 250ms cubic-bezier(0.35, 0, 0.25, 1);
    }
`;var j=["*"],zt=["previcon"],jt=["nexticon"],Ot=["content"],Ht=["prevButton"],Kt=["nextButton"],Qt=["inkbar"],$t=["tabs"];function qt(e,d){e&1&&W(0)}function Wt(e,d){if(e&1&&S(0,qt,1,0,"ng-container",11),e&2){let t=h(2);b("ngTemplateOutlet",t.prevIconTemplate||t._prevIconTemplate)}}function Ut(e,d){e&1&&(tt(),q(0,"svg",10))}function Gt(e,d){if(e&1){let t=U();P(0,"button",9,3),V("click",function(){H(t);let n=h();return K(n.onPrevButtonClick())}),C(2,Wt,1,1,"ng-container")(3,Ut,1,0,":svg:svg",10),$()}if(e&2){let t=h();c(t.cx("prevButton")),b("pBind",t.ptm("prevButton")),y("aria-label",t.prevButtonAriaLabel)("tabindex",t.tabindex())("data-pc-group-section","navigator"),v(2),N(t.prevIconTemplate||t._prevIconTemplate?2:3)}}function Jt(e,d){e&1&&W(0)}function Xt(e,d){if(e&1&&S(0,Jt,1,0,"ng-container",11),e&2){let t=h(2);b("ngTemplateOutlet",t.nextIconTemplate||t._nextIconTemplate)}}function Yt(e,d){e&1&&(tt(),q(0,"svg",12))}function Zt(e,d){if(e&1){let t=U();P(0,"button",9,4),V("click",function(){H(t);let n=h();return K(n.onNextButtonClick())}),C(2,Xt,1,1,"ng-container")(3,Yt,1,0,":svg:svg",12),$()}if(e&2){let t=h();c(t.cx("nextButton")),b("pBind",t.ptm("nextButton")),y("aria-label",t.nextButtonAriaLabel)("tabindex",t.tabindex())("data-pc-group-section","navigator"),v(2),N(t.nextIconTemplate||t._nextIconTemplate?2:3)}}function te(e,d){e&1&&M(0)}function ee(e,d){e&1&&W(0)}function ne(e,d){if(e&1&&S(0,ee,1,0,"ng-container",1),e&2){let t=h(),i=vt(1);b("ngTemplateOutlet",t.content()?t.content():i)}}var ie={root:({instance:e})=>["p-tabs p-component",{"p-tabs-scrollable":e.scrollable()}]},It=(()=>{class e extends E{name="tabs";style=Nt;classes=ie;static \u0275fac=(()=>{let t;return function(n){return(t||(t=u(e)))(n||e)}})();static \u0275prov=_({token:e,factory:e.\u0275fac})}return e})();var Mt=new x("TABS_INSTANCE"),Y=(()=>{class e extends A{$pcTabs=o(Mt,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=o(l,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}value=G(void 0);scrollable=g(!1,{transform:T});lazy=g(!1,{transform:T});selectOnFocus=g(!1,{transform:T});showNavigators=g(!0,{transform:T});tabindex=g(0,{transform:mt});id=Q(xt("pn_id_"));_componentStyle=o(It);updateValue(t){this.value.update(()=>t)}static \u0275fac=(()=>{let t;return function(n){return(t||(t=u(e)))(n||e)}})();static \u0275cmp=B({type:e,selectors:[["p-tabs"]],hostVars:3,hostBindings:function(i,n){i&2&&(y("id",n.id()),c(n.cx("root")))},inputs:{value:[1,"value"],scrollable:[1,"scrollable"],lazy:[1,"lazy"],selectOnFocus:[1,"selectOnFocus"],showNavigators:[1,"showNavigators"],tabindex:[1,"tabindex"]},outputs:{value:"valueChange"},features:[k([It,{provide:Mt,useExisting:e},{provide:F,useExisting:e}]),w([l]),D],ngContentSelectors:j,decls:1,vars:0,template:function(i,n){i&1&&(I(),M(0))},dependencies:[O,m],encapsulation:2,changeDetection:0})}return e})(),ae={root:({instance:e})=>["p-tab",{"p-tab-active":e.active(),"p-disabled":e.disabled()}]},kt=(()=>{class e extends E{name="tab";classes=ae;static \u0275fac=(()=>{let t;return function(n){return(t||(t=u(e)))(n||e)}})();static \u0275prov=_({token:e,factory:e.\u0275fac})}return e})();var oe={root:"p-tablist",content:"p-tablist-content p-tablist-viewport",tabList:"p-tablist-tab-list",activeBar:"p-tablist-active-bar",prevButton:"p-tablist-prev-button p-tablist-nav-button",nextButton:"p-tablist-next-button p-tablist-nav-button"},Et=(()=>{class e extends E{name="tablist";classes=oe;static \u0275fac=(()=>{let t;return function(n){return(t||(t=u(e)))(n||e)}})();static \u0275prov=_({token:e,factory:e.\u0275fac})}return e})();var Ft=new x("TABLIST_INSTANCE"),Rt=(()=>{class e extends A{$pcTabList=o(Ft,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=o(l,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}prevIconTemplate;nextIconTemplate;templates;content;prevButton;nextButton;inkbar;tabs;pcTabs=o(L(()=>Y));isPrevButtonEnabled=Q(!1);isNextButtonEnabled=Q(!1);resizeObserver;showNavigators=r(()=>this.pcTabs.showNavigators());tabindex=r(()=>this.pcTabs.tabindex());scrollable=r(()=>this.pcTabs.scrollable());_componentStyle=o(Et);constructor(){super(),rt(()=>{this.pcTabs.value(),X(this.platformId)&&setTimeout(()=>{this.updateInkBar()})})}get prevButtonAriaLabel(){return this.config?.translation?.aria?.previous}get nextButtonAriaLabel(){return this.config?.translation?.aria?.next}onAfterViewInit(){this.showNavigators()&&X(this.platformId)&&(this.updateButtonState(),this.bindResizeObserver())}_prevIconTemplate;_nextIconTemplate;onAfterContentInit(){this.templates?.forEach(t=>{switch(t.getType()){case"previcon":this._prevIconTemplate=t.template;break;case"nexticon":this._nextIconTemplate=t.template;break}})}onDestroy(){this.unbindResizeObserver()}onScroll(t){this.showNavigators()&&this.updateButtonState(),t.preventDefault()}onPrevButtonClick(){let t=this.content.nativeElement,i=z(t),n=Math.abs(t.scrollLeft)-i,a=n<=0?0:n;t.scrollLeft=nt(t)?-1*a:a}onNextButtonClick(){let t=this.content.nativeElement,i=z(t)-this.getVisibleButtonWidths(),n=t.scrollLeft+i,a=t.scrollWidth-i,s=n>=a?a:n;t.scrollLeft=nt(t)?-1*s:s}updateButtonState(){let t=this.content?.nativeElement,i=this.el?.nativeElement,{scrollWidth:n,offsetWidth:a}=t,s=Math.abs(t.scrollLeft),Z=z(t);this.isPrevButtonEnabled.set(s!==0),this.isNextButtonEnabled.set(i.offsetWidth>=a&&Math.abs(s-n+Z)>1)}updateInkBar(){let t=this.content?.nativeElement,i=this.inkbar?.nativeElement,n=this.tabs?.nativeElement,a=Tt(t,'[data-pc-name="tab"][data-p-active="true"]');i&&(i.style.width=yt(a)+"px",i.style.left=it(a).left-it(n).left+"px")}getVisibleButtonWidths(){let t=this.prevButton?.nativeElement,i=this.nextButton?.nativeElement;return[t,i].reduce((n,a)=>a?n+z(a):n,0)}bindResizeObserver(){this.resizeObserver=new ResizeObserver(()=>this.updateButtonState()),this.resizeObserver.observe(this.el.nativeElement)}unbindResizeObserver(){this.resizeObserver&&(this.resizeObserver.unobserve(this.el.nativeElement),this.resizeObserver=null)}static \u0275fac=function(i){return new(i||e)};static \u0275cmp=B({type:e,selectors:[["p-tablist"]],contentQueries:function(i,n,a){if(i&1&&ut(a,zt,4)(a,jt,4)(a,Bt,4),i&2){let s;p(s=f())&&(n.prevIconTemplate=s.first),p(s=f())&&(n.nextIconTemplate=s.first),p(s=f())&&(n.templates=s)}},viewQuery:function(i,n){if(i&1&&bt(Ot,5)(Ht,5)(Kt,5)(Qt,5)($t,5),i&2){let a;p(a=f())&&(n.content=a.first),p(a=f())&&(n.prevButton=a.first),p(a=f())&&(n.nextButton=a.first),p(a=f())&&(n.inkbar=a.first),p(a=f())&&(n.tabs=a.first)}},hostVars:2,hostBindings:function(i,n){i&2&&c(n.cx("root"))},features:[k([Et,{provide:Ft,useExisting:e},{provide:F,useExisting:e}]),w([l]),D],ngContentSelectors:j,decls:9,vars:11,consts:[["content",""],["tabs",""],["inkbar",""],["prevButton",""],["nextButton",""],["type","button","pRipple","",3,"pBind","class"],[3,"scroll","pBind"],["role","tablist",3,"pBind"],["role","presentation",3,"pBind"],["type","button","pRipple","",3,"click","pBind"],["data-p-icon","chevron-left"],[4,"ngTemplateOutlet"],["data-p-icon","chevron-right"]],template:function(i,n){if(i&1){let a=U();I(),C(0,Gt,4,7,"button",5),P(1,"div",6,0),V("scroll",function(Z){return H(a),K(n.onScroll(Z))}),P(3,"div",7,1),M(5),q(6,"span",8,2),$()(),C(8,Zt,4,7,"button",5)}i&2&&(N(n.showNavigators()&&n.isPrevButtonEnabled()?0:-1),v(),c(n.cx("content")),b("pBind",n.ptm("content")),v(2),c(n.cx("tabList")),b("pBind",n.ptm("tabList")),v(3),c(n.cx("activeBar")),b("pBind",n.ptm("activeBar")),v(2),N(n.showNavigators()&&n.isNextButtonEnabled()?8:-1))},dependencies:[O,J,wt,Dt,Ct,ot,at,m,l],encapsulation:2,changeDetection:0})}return e})(),At=new x("TAB_INSTANCE"),se=(()=>{class e extends A{$pcTab=o(At,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=o(l,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}value=G();disabled=g(!1,{transform:T});pcTabs=o(L(()=>Y));pcTabList=o(L(()=>Rt));el=o(lt);_componentStyle=o(kt);ripple=r(()=>this.config.ripple());id=r(()=>`${this.pcTabs.id()}_tab_${this.value()}`);ariaControls=r(()=>`${this.pcTabs.id()}_tabpanel_${this.value()}`);active=r(()=>et(this.pcTabs.value(),this.value()));tabindex=r(()=>this.disabled()?-1:this.active()?this.pcTabs.tabindex():-1);mutationObserver;onFocus(t){this.disabled()||this.pcTabs.selectOnFocus()&&this.changeActiveValue()}onClick(t){this.disabled()||this.changeActiveValue()}onKeyDown(t){switch(t.code){case"ArrowRight":this.onArrowRightKey(t);break;case"ArrowLeft":this.onArrowLeftKey(t);break;case"Home":this.onHomeKey(t);break;case"End":this.onEndKey(t);break;case"PageDown":this.onPageDownKey(t);break;case"PageUp":this.onPageUpKey(t);break;case"Enter":case"NumpadEnter":case"Space":this.onEnterKey(t);break;default:break}t.stopPropagation()}onAfterViewInit(){this.bindMutationObserver()}onArrowRightKey(t){let i=this.findNextTab(t.currentTarget);i?this.changeFocusedTab(t,i):this.onHomeKey(t),t.preventDefault()}onArrowLeftKey(t){let i=this.findPrevTab(t.currentTarget);i?this.changeFocusedTab(t,i):this.onEndKey(t),t.preventDefault()}onHomeKey(t){let i=this.findFirstTab();this.changeFocusedTab(t,i),t.preventDefault()}onEndKey(t){let i=this.findLastTab();this.changeFocusedTab(t,i),t.preventDefault()}onPageDownKey(t){this.scrollInView(this.findLastTab()),t.preventDefault()}onPageUpKey(t){this.scrollInView(this.findFirstTab()),t.preventDefault()}onEnterKey(t){this.disabled()||this.changeActiveValue(),t.preventDefault()}findNextTab(t,i=!1){let n=i?t:t.nextElementSibling;return n?R(n,"data-p-disabled")||R(n,"data-pc-section")==="activebar"?this.findNextTab(n):n:null}findPrevTab(t,i=!1){let n=i?t:t.previousElementSibling;return n?R(n,"data-p-disabled")||R(n,"data-pc-section")==="activebar"?this.findPrevTab(n):n:null}findFirstTab(){return this.findNextTab(this.pcTabList?.tabs?.nativeElement?.firstElementChild,!0)}findLastTab(){return this.findPrevTab(this.pcTabList?.tabs?.nativeElement?.lastElementChild,!0)}changeActiveValue(){this.pcTabs.updateValue(this.value())}changeFocusedTab(t,i){_t(i),this.scrollInView(i)}scrollInView(t){t?.scrollIntoView?.({block:"nearest"})}bindMutationObserver(){X(this.platformId)&&(this.mutationObserver=new MutationObserver(t=>{t.forEach(()=>{this.active()&&this.pcTabList?.updateInkBar()})}),this.mutationObserver.observe(this.el.nativeElement,{childList:!0,characterData:!0,subtree:!0}))}unbindMutationObserver(){this.mutationObserver?.disconnect()}onDestroy(){this.mutationObserver&&this.unbindMutationObserver()}static \u0275fac=(()=>{let t;return function(n){return(t||(t=u(e)))(n||e)}})();static \u0275cmp=B({type:e,selectors:[["p-tab"]],hostVars:10,hostBindings:function(i,n){i&1&&V("focus",function(s){return n.onFocus(s)})("click",function(s){return n.onClick(s)})("keydown",function(s){return n.onKeyDown(s)}),i&2&&(y("id",n.id())("aria-controls",n.ariaControls())("role","tab")("aria-selected",n.active())("aria-disabled",n.disabled())("data-p-disabled",n.disabled())("data-p-active",n.active())("tabindex",n.tabindex()),c(n.cx("root")))},inputs:{value:[1,"value"],disabled:[1,"disabled"]},outputs:{value:"valueChange"},features:[k([kt,{provide:At,useExisting:e},{provide:F,useExisting:e}]),w([ot,l]),D],ngContentSelectors:j,decls:1,vars:0,template:function(i,n){i&1&&(I(),M(0))},dependencies:[O,at,m],encapsulation:2,changeDetection:0})}return e})(),re={root:({instance:e})=>["p-tabpanel",{"p-tabpanel-active":e.active()}]},Lt=(()=>{class e extends E{name="tabpanel";classes=re;static \u0275fac=(()=>{let t;return function(n){return(t||(t=u(e)))(n||e)}})();static \u0275prov=_({token:e,factory:e.\u0275fac})}return e})();var St=new x("TABPANEL_INSTANCE"),le=(()=>{class e extends A{$pcTabPanel=o(St,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=o(l,{self:!0});pcTabs=o(L(()=>Y));onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}lazy=g(!1,{transform:T});value=G(void 0);content=gt("content");id=r(()=>`${this.pcTabs.id()}_tabpanel_${this.value()}`);ariaLabelledby=r(()=>`${this.pcTabs.id()}_tab_${this.value()}`);active=r(()=>et(this.pcTabs.value(),this.value()));isLazyEnabled=r(()=>this.pcTabs.lazy()||this.lazy());hasBeenRendered=!1;shouldRender=r(()=>!this.isLazyEnabled()||this.hasBeenRendered?!0:this.active()?(this.hasBeenRendered=!0,!0):!1);_componentStyle=o(Lt);static \u0275fac=(()=>{let t;return function(n){return(t||(t=u(e)))(n||e)}})();static \u0275cmp=B({type:e,selectors:[["p-tabpanel"]],contentQueries:function(i,n,a){i&1&&pt(a,n.content,Ot,5),i&2&&ft()},hostVars:7,hostBindings:function(i,n){i&2&&(dt("hidden",!n.active()),y("id",n.id())("role","tabpanel")("aria-labelledby",n.ariaLabelledby())("data-p-active",n.active()),c(n.cx("root")))},inputs:{lazy:[1,"lazy"],value:[1,"value"]},outputs:{value:"valueChange"},features:[k([Lt,{provide:St,useExisting:e},{provide:F,useExisting:e}]),w([l]),D],ngContentSelectors:j,decls:3,vars:1,consts:[["defaultContent",""],[4,"ngTemplateOutlet"]],template:function(i,n){i&1&&(I(),S(0,te,1,0,"ng-template",null,0,ht),C(2,ne,1,1,"ng-container")),i&2&&(v(2),N(n.shouldRender()?2:-1))},dependencies:[J,m],encapsulation:2,changeDetection:0})}return e})(),ce={root:"p-tabpanels"},Pt=(()=>{class e extends E{name="tabpanels";classes=ce;static \u0275fac=(()=>{let t;return function(n){return(t||(t=u(e)))(n||e)}})();static \u0275prov=_({token:e,factory:e.\u0275fac})}return e})();var Vt=new x("TABPANELS_INSTANCE"),de=(()=>{class e extends A{$pcTabPanels=o(Vt,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=o(l,{self:!0});_componentStyle=o(Pt);onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}static \u0275fac=(()=>{let t;return function(n){return(t||(t=u(e)))(n||e)}})();static \u0275cmp=B({type:e,selectors:[["p-tabpanels"]],hostVars:3,hostBindings:function(i,n){i&2&&(y("role","presentation"),c(n.cx("root")))},features:[k([Pt,{provide:Vt,useExisting:e},{provide:F,useExisting:e}]),w([l]),D],ngContentSelectors:j,decls:1,vars:0,template:function(i,n){i&1&&(I(),M(0))},dependencies:[O,m],encapsulation:2,changeDetection:0})}return e})(),Pe=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=ct({type:e});static \u0275inj=st({imports:[Y,de,le,Rt,se,m,m]})}return e})();export{Y as a,Rt as b,se as c,le as d,de as e,Pe as f};
