import{c as le,d as re}from"./chunk-SW633CZY.js";import"./chunk-IH4RR6H5.js";import"./chunk-WL4OSVTG.js";import"./chunk-DT4BZ3FJ.js";import"./chunk-O22HT2F3.js";import{Ea as ae,Fa as oe,Ga as V,Ha as C,Ka as L,Na as U,Oa as G,Pa as y,Qa as J,f as ie}from"./chunk-MY7VEI5E.js";import{k as ne,l as M,p as H,u as D}from"./chunk-PM5SR23A.js";import{$a as j,Ab as B,Bb as F,Cb as h,Fa as Z,Ia as l,Jb as f,Kb as ee,L as R,Lb as q,M as N,Mb as Q,O,Ob as v,Pb as _,Q as T,Tb as te,Wa as S,Wb as $,Xa as A,Xb as u,Yb as s,Zb as w,_a as z,_b as b,ab as d,fa as Y,fc as P,hc as I,ib as x,ka as k,tb as i,ub as r,uc as g,vb as p,wb as E}from"./chunk-M7JBURX2.js";import"./chunk-DAQOROHW.js";var pe=`
    .p-timeline {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        direction: ltr;
    }

    .p-timeline-left .p-timeline-event-opposite {
        text-align: right;
    }

    .p-timeline-left .p-timeline-event-content {
        text-align: left;
    }

    .p-timeline-right .p-timeline-event {
        flex-direction: row-reverse;
    }

    .p-timeline-right .p-timeline-event-opposite {
        text-align: left;
    }

    .p-timeline-right .p-timeline-event-content {
        text-align: right;
    }

    .p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) {
        flex-direction: row-reverse;
    }

    .p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-opposite {
        text-align: right;
    }

    .p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-content {
        text-align: left;
    }

    .p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-opposite {
        text-align: left;
    }

    .p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-content {
        text-align: right;
    }

    .p-timeline-vertical .p-timeline-event-opposite,
    .p-timeline-vertical .p-timeline-event-content {
        padding: dt('timeline.vertical.event.content.padding');
    }

    .p-timeline-vertical .p-timeline-event-connector {
        width: dt('timeline.event.connector.size');
    }

    .p-timeline-event {
        display: flex;
        position: relative;
        min-height: dt('timeline.event.min.height');
    }

    .p-timeline-event:last-child {
        min-height: 0;
    }

    .p-timeline-event-opposite {
        flex: 1;
    }

    .p-timeline-event-content {
        flex: 1;
    }

    .p-timeline-event-separator {
        flex: 0;
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .p-timeline-event-marker {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        align-self: baseline;
        border-width: dt('timeline.event.marker.border.width');
        border-style: solid;
        border-color: dt('timeline.event.marker.border.color');
        border-radius: dt('timeline.event.marker.border.radius');
        width: dt('timeline.event.marker.size');
        height: dt('timeline.event.marker.size');
        background: dt('timeline.event.marker.background');
    }

    .p-timeline-event-marker::before {
        content: ' ';
        border-radius: dt('timeline.event.marker.content.border.radius');
        width: dt('timeline.event.marker.content.size');
        height: dt('timeline.event.marker.content.size');
        background: dt('timeline.event.marker.content.background');
    }

    .p-timeline-event-marker::after {
        content: ' ';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: dt('timeline.event.marker.border.radius');
        box-shadow: dt('timeline.event.marker.content.inset.shadow');
    }

    .p-timeline-event-connector {
        flex-grow: 1;
        background: dt('timeline.event.connector.color');
    }

    .p-timeline-horizontal {
        flex-direction: row;
    }

    .p-timeline-horizontal .p-timeline-event {
        flex-direction: column;
        flex: 1;
    }

    .p-timeline-horizontal .p-timeline-event:last-child {
        flex: 0;
    }

    .p-timeline-horizontal .p-timeline-event-separator {
        flex-direction: row;
    }

    .p-timeline-horizontal .p-timeline-event-connector {
        width: 100%;
        height: dt('timeline.event.connector.size');
    }

    .p-timeline-horizontal .p-timeline-event-opposite,
    .p-timeline-horizontal .p-timeline-event-content {
        padding: dt('timeline.horizontal.event.content.padding');
    }

    .p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(even) {
        flex-direction: column-reverse;
    }

    .p-timeline-bottom .p-timeline-event {
        flex-direction: column-reverse;
    }
`;var Te=["content"],xe=["opposite"],be=["marker"],K=e=>({$implicit:e});function Ce(e,a){e&1&&h(0)}function Ee(e,a){e&1&&h(0)}function ke(e,a){if(e&1&&(B(0),d(1,Ee,1,0,"ng-container",3),F()),e&2){let t=f().$implicit,o=f();l(),i("ngTemplateOutlet",o.markerTemplate||o._markerTemplate)("ngTemplateOutletContext",I(2,K,t))}}function Se(e,a){if(e&1&&E(0,"div",2),e&2){let t=f(2);u(t.cx("eventMarker")),i("pBind",t.ptm("eventMarker")),x("data-p",t.dataP)}}function Ie(e,a){if(e&1&&E(0,"div",2),e&2){let t=f(2);u(t.cx("eventConnector")),i("pBind",t.ptm("eventConnector")),x("data-p",t.dataP)}}function Me(e,a){e&1&&h(0)}function De(e,a){if(e&1&&(r(0,"div",2)(1,"div",2),d(2,Ce,1,0,"ng-container",3),p(),r(3,"div",2),d(4,ke,2,4,"ng-container",4)(5,Se,1,4,"ng-template",null,0,g)(7,Ie,1,4,"div",5),p(),r(8,"div",2),d(9,Me,1,0,"ng-container",3),p()()),e&2){let t=a.$implicit,o=a.last,n=te(6),m=f();u(m.cx("event")),i("pBind",m.ptm("event")),x("data-p",m.dataP),l(),u(m.cx("eventOpposite")),i("pBind",m.ptm("eventOpposite")),x("data-p",m.dataP),l(),i("ngTemplateOutlet",m.oppositeTemplate||m._oppositeTemplate)("ngTemplateOutletContext",I(23,K,t)),l(),u(m.cx("eventSeparator")),i("pBind",m.ptm("eventSeparator")),x("data-p",m.dataP),l(),i("ngIf",m.markerTemplate||m._markerTemplate)("ngIfElse",n),l(3),i("ngIf",!o),l(),u(m.cx("eventContent")),i("pBind",m.ptm("eventContent")),x("data-p",m.dataP),l(),i("ngTemplateOutlet",m.contentTemplate||m._contentTemplate)("ngTemplateOutletContext",I(25,K,t))}}var Be={root:({instance:e})=>["p-timeline p-component","p-timeline-"+e.align,"p-timeline-"+e.layout],event:"p-timeline-event",eventOpposite:"p-timeline-event-opposite",eventSeparator:"p-timeline-event-separator",eventMarker:"p-timeline-event-marker",eventConnector:"p-timeline-event-connector",eventContent:"p-timeline-event-content"},me=(()=>{class e extends L{name="timeline";style=pe;classes=Be;static \u0275fac=(()=>{let t;return function(n){return(t||(t=k(e)))(n||e)}})();static \u0275prov=R({token:e,factory:e.\u0275fac})}return e})();var ce=new O("TIMELINE_INSTANCE"),W=(()=>{class e extends G{bindDirectiveInstance=T(y,{self:!0});$pcTimeline=T(ce,{optional:!0,skipSelf:!0})??void 0;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}value;styleClass;align="left";layout="vertical";contentTemplate;oppositeTemplate;markerTemplate;templates;_contentTemplate;_oppositeTemplate;_markerTemplate;_componentStyle=T(me);getBlockableElement(){return this.el.nativeElement.children[0]}onAfterContentInit(){this.templates.forEach(t=>{switch(t.getType()){case"content":this._contentTemplate=t.template;break;case"opposite":this._oppositeTemplate=t.template;break;case"marker":this._markerTemplate=t.template;break}})}get dataP(){return this.cn({[this.layout]:this.layout,[this.align]:this.align})}static \u0275fac=(()=>{let t;return function(n){return(t||(t=k(e)))(n||e)}})();static \u0275cmp=S({type:e,selectors:[["p-timeline"]],contentQueries:function(o,n,m){if(o&1&&Q(m,Te,4)(m,xe,4)(m,be,4)(m,V,4),o&2){let c;v(c=_())&&(n.contentTemplate=c.first),v(c=_())&&(n.oppositeTemplate=c.first),v(c=_())&&(n.markerTemplate=c.first),v(c=_())&&(n.templates=c)}},hostVars:3,hostBindings:function(o,n){o&2&&(x("data-p",n.dataP),u(n.cn(n.cx("root"),n.styleClass)))},inputs:{value:"value",styleClass:"styleClass",align:"align",layout:"layout"},features:[P([me,{provide:ce,useExisting:e},{provide:U,useExisting:e}]),z([y]),j],decls:1,vars:1,consts:[["marker",""],[3,"pBind","class",4,"ngFor","ngForOf"],[3,"pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[4,"ngIf","ngIfElse"],[3,"pBind","class",4,"ngIf"]],template:function(o,n){o&1&&d(0,De,10,27,"div",1),o&2&&i("ngForOf",n.value)},dependencies:[D,ne,M,H,C,y],encapsulation:2,changeDetection:0})}return e})(),ue=(()=>{class e{static \u0275fac=function(o){return new(o||e)};static \u0275mod=A({type:e});static \u0275inj=N({imports:[W,C,C]})}return e})();var fe=`
    .p-card {
        background: dt('card.background');
        color: dt('card.color');
        box-shadow: dt('card.shadow');
        border-radius: dt('card.border.radius');
        display: flex;
        flex-direction: column;
    }

    .p-card-caption {
        display: flex;
        flex-direction: column;
        gap: dt('card.caption.gap');
    }

    .p-card-body {
        padding: dt('card.body.padding');
        display: flex;
        flex-direction: column;
        gap: dt('card.body.gap');
    }

    .p-card-title {
        font-size: dt('card.title.font.size');
        font-weight: dt('card.title.font.weight');
    }

    .p-card-subtitle {
        color: dt('card.subtitle.color');
    }
`;var we=["header"],Re=["title"],Ne=["subtitle"],Oe=["content"],Ae=["footer"],ze=["*",[["p-header"]],[["p-footer"]]],je=["*","p-header","p-footer"];function qe(e,a){e&1&&h(0)}function Qe(e,a){if(e&1&&(r(0,"div",1),q(1,1),d(2,qe,1,0,"ng-container",2),p()),e&2){let t=f();u(t.cx("header")),i("pBind",t.ptm("header")),l(2),i("ngTemplateOutlet",t.headerTemplate||t._headerTemplate)}}function $e(e,a){if(e&1&&(B(0),s(1),F()),e&2){let t=f(2);l(),w(t.header)}}function Pe(e,a){e&1&&h(0)}function He(e,a){if(e&1&&(r(0,"div",1),d(1,$e,2,1,"ng-container",3)(2,Pe,1,0,"ng-container",2),p()),e&2){let t=f();u(t.cx("title")),i("pBind",t.ptm("title")),l(),i("ngIf",t.header&&!t._titleTemplate&&!t.titleTemplate),l(),i("ngTemplateOutlet",t.titleTemplate||t._titleTemplate)}}function Ve(e,a){if(e&1&&(B(0),s(1),F()),e&2){let t=f(2);l(),w(t.subheader)}}function Le(e,a){e&1&&h(0)}function Ue(e,a){if(e&1&&(r(0,"div",1),d(1,Ve,2,1,"ng-container",3)(2,Le,1,0,"ng-container",2),p()),e&2){let t=f();u(t.cx("subtitle")),i("pBind",t.ptm("subtitle")),l(),i("ngIf",t.subheader&&!t._subtitleTemplate&&!t.subtitleTemplate),l(),i("ngTemplateOutlet",t.subtitleTemplate||t._subtitleTemplate)}}function Ge(e,a){e&1&&h(0)}function Je(e,a){e&1&&h(0)}function Ke(e,a){if(e&1&&(r(0,"div",1),q(1,2),d(2,Je,1,0,"ng-container",2),p()),e&2){let t=f();u(t.cx("footer")),i("pBind",t.ptm("footer")),l(2),i("ngTemplateOutlet",t.footerTemplate||t._footerTemplate)}}var We=`
    ${fe}

    .p-card {
        display: block;
    }
`,Xe={root:"p-card p-component",header:"p-card-header",body:"p-card-body",caption:"p-card-caption",title:"p-card-title",subtitle:"p-card-subtitle",content:"p-card-content",footer:"p-card-footer"},ve=(()=>{class e extends L{name="card";style=We;classes=Xe;static \u0275fac=(()=>{let t;return function(n){return(t||(t=k(e)))(n||e)}})();static \u0275prov=R({token:e,factory:e.\u0275fac})}return e})();var _e=new O("CARD_INSTANCE"),X=(()=>{class e extends G{$pcCard=T(_e,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=T(y,{self:!0});_componentStyle=T(ve);onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}header;subheader;set style(t){ie(this._style(),t)||(this._style.set(t),this.el?.nativeElement&&t&&Object.keys(t).forEach(o=>{this.el.nativeElement.style[o]=t[o]}))}get style(){return this._style()}styleClass;headerFacet;footerFacet;headerTemplate;titleTemplate;subtitleTemplate;contentTemplate;footerTemplate;_headerTemplate;_titleTemplate;_subtitleTemplate;_contentTemplate;_footerTemplate;_style=Y(null);getBlockableElement(){return this.el.nativeElement.children[0]}templates;onAfterContentInit(){this.templates.forEach(t=>{switch(t.getType()){case"header":this._headerTemplate=t.template;break;case"title":this._titleTemplate=t.template;break;case"subtitle":this._subtitleTemplate=t.template;break;case"content":this._contentTemplate=t.template;break;case"footer":this._footerTemplate=t.template;break;default:this._contentTemplate=t.template;break}})}static \u0275fac=(()=>{let t;return function(n){return(t||(t=k(e)))(n||e)}})();static \u0275cmp=S({type:e,selectors:[["p-card"]],contentQueries:function(o,n,m){if(o&1&&Q(m,ae,5)(m,oe,5)(m,we,4)(m,Re,4)(m,Ne,4)(m,Oe,4)(m,Ae,4)(m,V,4),o&2){let c;v(c=_())&&(n.headerFacet=c.first),v(c=_())&&(n.footerFacet=c.first),v(c=_())&&(n.headerTemplate=c.first),v(c=_())&&(n.titleTemplate=c.first),v(c=_())&&(n.subtitleTemplate=c.first),v(c=_())&&(n.contentTemplate=c.first),v(c=_())&&(n.footerTemplate=c.first),v(c=_())&&(n.templates=c)}},hostVars:4,hostBindings:function(o,n){o&2&&($(n._style()),u(n.cn(n.cx("root"),n.styleClass)))},inputs:{header:"header",subheader:"subheader",style:"style",styleClass:"styleClass"},features:[P([ve,{provide:_e,useExisting:e},{provide:U,useExisting:e}]),z([y]),j],ngContentSelectors:je,decls:8,vars:11,consts:[[3,"pBind","class",4,"ngIf"],[3,"pBind"],[4,"ngTemplateOutlet"],[4,"ngIf"]],template:function(o,n){o&1&&(ee(ze),d(0,Qe,3,4,"div",0),r(1,"div",1),d(2,He,3,5,"div",0)(3,Ue,3,5,"div",0),r(4,"div",1),q(5),d(6,Ge,1,0,"ng-container",2),p(),d(7,Ke,3,4,"div",0),p()),o&2&&(i("ngIf",n.headerFacet||n.headerTemplate||n._headerTemplate),l(),u(n.cx("body")),i("pBind",n.ptm("body")),l(),i("ngIf",n.header||n.titleTemplate||n._titleTemplate),l(),i("ngIf",n.subheader||n.subtitleTemplate||n._subtitleTemplate),l(),u(n.cx("content")),i("pBind",n.ptm("content")),l(2),i("ngTemplateOutlet",n.contentTemplate||n._contentTemplate),l(),i("ngIf",n.footerFacet||n.footerTemplate||n._footerTemplate))},dependencies:[D,M,H,C,J,y],encapsulation:2,changeDetection:0})}return e})(),ge=(()=>{class e{static \u0275fac=function(o){return new(o||e)};static \u0275mod=A({type:e});static \u0275inj=N({imports:[X,C,J,C,J]})}return e})();var Ze=e=>({"background-color":e});function et(e,a){if(e&1&&s(0),e&2){let t=a.$implicit;b(" ",t.status," ")}}function tt(e,a){if(e&1&&s(0),e&2){let t=a.$implicit;b(" ",t.status," ")}}function nt(e,a){if(e&1&&s(0),e&2){let t=a.$implicit;b(" ",t.status," ")}}function it(e,a){if(e&1&&(r(0,"small",17),s(1),p()),e&2){let t=a.$implicit;l(),w(t.date)}}function at(e,a){if(e&1&&s(0),e&2){let t=a.$implicit;b(" ",t.status," ")}}function ot(e,a){if(e&1&&(r(0,"span",18),E(1,"i"),p()),e&2){let t=a.$implicit;$(I(4,Ze,t.color)),l(),u(t.icon)}}function lt(e,a){if(e&1&&E(0,"img",22),e&2){let t=f().$implicit;i("src","demo/images/product/"+t.image,Z)("alt",t.name)}}function rt(e,a){if(e&1&&(r(0,"p-card",19),d(1,lt,1,2,"img",20),r(2,"p"),s(3," Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas! "),p(),E(4,"p-button",21),p()),e&2){let t=a.$implicit;i("header",t.status)("subheader",t.date),l(),i("ngIf",t.image),l(3),i("text",!0)}}function pt(e,a){if(e&1&&s(0),e&2){let t=a.$implicit;b(" ",t," ")}}function mt(e,a){if(e&1&&s(0),e&2){let t=a.$implicit;b(" ",t," ")}}function ct(e,a){if(e&1&&s(0),e&2){let t=a.$implicit;b(" ",t," ")}}function dt(e,a){e&1&&s(0," \xA0")}var he=class e{events1=[];events2=[];ngOnInit(){this.events1=[{status:"Ordered",date:"15/10/2020 10:30",icon:"pi pi-shopping-cart",color:"#9C27B0",image:"game-controller.jpg"},{status:"Processing",date:"15/10/2020 14:00",icon:"pi pi-cog",color:"#673AB7"},{status:"Shipped",date:"15/10/2020 16:15",icon:"pi pi-envelope",color:"#FF9800"},{status:"Delivered",date:"16/10/2020 10:00",icon:"pi pi-check",color:"#607D8B"}],this.events2=["2020","2021","2022","2023"]}static \u0275fac=function(t){return new(t||e)};static \u0275cmp=S({type:e,selectors:[["app-timeline-demo"]],decls:61,vars:8,consts:[["content",""],["opposite",""],["marker",""],[1,"grid","grid-cols-12","gap-8"],[1,"col-span-12","sm:col-span-6"],[1,"card"],[1,"font-semibold","text-xl","mb-4"],[3,"value"],["align","right",3,"value"],["align","alternate",3,"value"],[1,"col-span-full"],["align","alternate","styleClass","customized-timeline",3,"value"],[1,"font-semibold","mb-2"],["layout","horizontal","align","top",3,"value"],[1,"font-semibold","mt-4","mb-2"],["layout","horizontal","align","bottom",3,"value"],["layout","horizontal","align","alternate",3,"value"],[1,"p-text-secondary"],[1,"flex","w-8","h-8","items-center","justify-center","text-white","rounded-full","z-10","shadow-sm"],[3,"header","subheader"],["width","200","class","shadow",3,"src","alt",4,"ngIf"],["label","Read more",3,"text"],["width","200",1,"shadow",3,"src","alt"]],template:function(t,o){t&1&&(r(0,"div",3)(1,"div",4)(2,"div",5)(3,"div",6),s(4,"Left Align"),p(),r(5,"p-timeline",7),d(6,et,1,1,"ng-template",null,0,g),p()()(),r(8,"div",4)(9,"div",5)(10,"div",6),s(11,"Right Align"),p(),r(12,"p-timeline",8),d(13,tt,1,1,"ng-template",null,0,g),p()()(),r(15,"div",4)(16,"div",5)(17,"div",6),s(18,"Alternate Align"),p(),r(19,"p-timeline",9),d(20,nt,1,1,"ng-template",null,0,g),p()()(),r(22,"div",4)(23,"div",5)(24,"div",6),s(25,"Opposite Content"),p(),r(26,"p-timeline",7),d(27,it,2,1,"ng-template",null,0,g)(29,at,1,1,"ng-template",null,1,g),p()()(),r(31,"div",10)(32,"div",5)(33,"div",6),s(34,"Templating"),p(),r(35,"p-timeline",11),d(36,ot,2,6,"ng-template",null,2,g)(38,rt,5,4,"ng-template",null,0,g),p()()(),r(40,"div",10)(41,"div",5)(42,"div",6),s(43,"Horizontal"),p(),r(44,"div",12),s(45,"Top Align"),p(),r(46,"p-timeline",13),d(47,pt,1,1,"ng-template",null,0,g),p(),r(49,"div",14),s(50,"Bottom Align"),p(),r(51,"p-timeline",15),d(52,mt,1,1,"ng-template",null,0,g),p(),r(54,"div",14),s(55,"Alternate Align"),p(),r(56,"p-timeline",16),d(57,ct,1,1,"ng-template",null,0,g)(59,dt,1,0,"ng-template",null,1,g),p()()()()),t&2&&(l(5),i("value",o.events1),l(7),i("value",o.events1),l(7),i("value",o.events1),l(7),i("value",o.events1),l(9),i("value",o.events1),l(11),i("value",o.events2),l(5),i("value",o.events2),l(5),i("value",o.events2))},dependencies:[D,M,ue,W,re,le,ge,X],encapsulation:2})};export{he as TimelineDemo};
