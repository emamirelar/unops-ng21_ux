import{a as ee,b as te}from"./chunk-KJRMHP45.js";import{c as Y,d as Z}from"./chunk-XMJLW44U.js";import"./chunk-CTLPI5ZD.js";import"./chunk-KI6GTOOW.js";import"./chunk-MN4CNCZH.js";import"./chunk-WZU4XFFL.js";import{Ga as J,Ha as D,Ka as K,Na as W,Oa as X,Pa as E}from"./chunk-6TB5R24A.js";import{k as U,l as S,p as G,u as I}from"./chunk-BHCYPOM7.js";import{$a as $,Ab as P,Bb as q,Cb as C,Fa as R,Ia as m,Jb as g,L as z,M as F,Mb as j,O,Ob as T,Pb as y,Q as b,Tb as Q,Wa as k,Wb as L,Xa as A,Xb as v,Yb as p,Zb as H,_a as N,_b as _,ab as s,gc as V,ib as f,ic as x,ka as M,tb as i,ub as l,vb as a,vc as d,wb as h}from"./chunk-4THFKMV7.js";import"./chunk-DAQOROHW.js";var ne=`
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
`;var pe=["content"],ce=["opposite"],se=["marker"],w=e=>({$implicit:e});function de(e,n){e&1&&C(0)}function ve(e,n){e&1&&C(0)}function ue(e,n){if(e&1&&(P(0),s(1,ve,1,0,"ng-container",3),q()),e&2){let t=g().$implicit,o=g();m(),i("ngTemplateOutlet",o.markerTemplate||o._markerTemplate)("ngTemplateOutletContext",x(2,w,t))}}function fe(e,n){if(e&1&&h(0,"div",2),e&2){let t=g(2);v(t.cx("eventMarker")),i("pBind",t.ptm("eventMarker")),f("data-p",t.dataP)}}function ge(e,n){if(e&1&&h(0,"div",2),e&2){let t=g(2);v(t.cx("eventConnector")),i("pBind",t.ptm("eventConnector")),f("data-p",t.dataP)}}function _e(e,n){e&1&&C(0)}function he(e,n){if(e&1&&(l(0,"div",2)(1,"div",2),s(2,de,1,0,"ng-container",3),a(),l(3,"div",2),s(4,ue,2,4,"ng-container",4)(5,fe,1,4,"ng-template",null,0,d)(7,ge,1,4,"div",5),a(),l(8,"div",2),s(9,_e,1,0,"ng-container",3),a()()),e&2){let t=n.$implicit,o=n.last,c=Q(6),r=g();v(r.cx("event")),i("pBind",r.ptm("event")),f("data-p",r.dataP),m(),v(r.cx("eventOpposite")),i("pBind",r.ptm("eventOpposite")),f("data-p",r.dataP),m(),i("ngTemplateOutlet",r.oppositeTemplate||r._oppositeTemplate)("ngTemplateOutletContext",x(23,w,t)),m(),v(r.cx("eventSeparator")),i("pBind",r.ptm("eventSeparator")),f("data-p",r.dataP),m(),i("ngIf",r.markerTemplate||r._markerTemplate)("ngIfElse",c),m(3),i("ngIf",!o),m(),v(r.cx("eventContent")),i("pBind",r.ptm("eventContent")),f("data-p",r.dataP),m(),i("ngTemplateOutlet",r.contentTemplate||r._contentTemplate)("ngTemplateOutletContext",x(25,w,t))}}var xe={root:({instance:e})=>["p-timeline p-component","p-timeline-"+e.align,"p-timeline-"+e.layout],event:"p-timeline-event",eventOpposite:"p-timeline-event-opposite",eventSeparator:"p-timeline-event-separator",eventMarker:"p-timeline-event-marker",eventConnector:"p-timeline-event-connector",eventContent:"p-timeline-event-content"},ie=(()=>{class e extends K{name="timeline";style=ne;classes=xe;static \u0275fac=(()=>{let t;return function(c){return(t||(t=M(e)))(c||e)}})();static \u0275prov=z({token:e,factory:e.\u0275fac})}return e})();var le=new O("TIMELINE_INSTANCE"),B=(()=>{class e extends X{bindDirectiveInstance=b(E,{self:!0});$pcTimeline=b(le,{optional:!0,skipSelf:!0})??void 0;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}value;styleClass;align="left";layout="vertical";contentTemplate;oppositeTemplate;markerTemplate;templates;_contentTemplate;_oppositeTemplate;_markerTemplate;_componentStyle=b(ie);getBlockableElement(){return this.el.nativeElement.children[0]}onAfterContentInit(){this.templates.forEach(t=>{switch(t.getType()){case"content":this._contentTemplate=t.template;break;case"opposite":this._oppositeTemplate=t.template;break;case"marker":this._markerTemplate=t.template;break}})}get dataP(){return this.cn({[this.layout]:this.layout,[this.align]:this.align})}static \u0275fac=(()=>{let t;return function(c){return(t||(t=M(e)))(c||e)}})();static \u0275cmp=k({type:e,selectors:[["p-timeline"]],contentQueries:function(o,c,r){if(o&1&&j(r,pe,4)(r,ce,4)(r,se,4)(r,J,4),o&2){let u;T(u=y())&&(c.contentTemplate=u.first),T(u=y())&&(c.oppositeTemplate=u.first),T(u=y())&&(c.markerTemplate=u.first),T(u=y())&&(c.templates=u)}},hostVars:3,hostBindings:function(o,c){o&2&&(f("data-p",c.dataP),v(c.cn(c.cx("root"),c.styleClass)))},inputs:{value:"value",styleClass:"styleClass",align:"align",layout:"layout"},features:[V([ie,{provide:le,useExisting:e},{provide:W,useExisting:e}]),N([E]),$],decls:1,vars:1,consts:[["marker",""],[3,"pBind","class",4,"ngFor","ngForOf"],[3,"pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[4,"ngIf","ngIfElse"],[3,"pBind","class",4,"ngIf"]],template:function(o,c){o&1&&s(0,he,10,27,"div",1),o&2&&i("ngForOf",c.value)},dependencies:[I,U,S,G,D,E],encapsulation:2,changeDetection:0})}return e})(),ae=(()=>{class e{static \u0275fac=function(o){return new(o||e)};static \u0275mod=A({type:e});static \u0275inj=F({imports:[B,D,D]})}return e})();var ye=e=>({"background-color":e});function Ee(e,n){if(e&1&&p(0),e&2){let t=n.$implicit;_(" ",t.status," ")}}function be(e,n){if(e&1&&p(0),e&2){let t=n.$implicit;_(" ",t.status," ")}}function ke(e,n){if(e&1&&p(0),e&2){let t=n.$implicit;_(" ",t.status," ")}}function Ce(e,n){if(e&1&&(l(0,"small",17),p(1),a()),e&2){let t=n.$implicit;m(),H(t.date)}}function Se(e,n){if(e&1&&p(0),e&2){let t=n.$implicit;_(" ",t.status," ")}}function Ie(e,n){if(e&1&&(l(0,"span",18),h(1,"i"),a()),e&2){let t=n.$implicit;L(x(4,ye,t.color)),m(),v(t.icon)}}function De(e,n){if(e&1&&h(0,"img",22),e&2){let t=g().$implicit;i("src","demo/images/product/"+t.image,R)("alt",t.name)}}function Me(e,n){if(e&1&&(l(0,"p-card",19),s(1,De,1,2,"img",20),l(2,"p"),p(3," Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas! "),a(),h(4,"p-button",21),a()),e&2){let t=n.$implicit;i("header",t.status)("subheader",t.date),m(),i("ngIf",t.image),m(3),i("text",!0)}}function we(e,n){if(e&1&&p(0),e&2){let t=n.$implicit;_(" ",t," ")}}function Be(e,n){if(e&1&&p(0),e&2){let t=n.$implicit;_(" ",t," ")}}function ze(e,n){if(e&1&&p(0),e&2){let t=n.$implicit;_(" ",t," ")}}function Fe(e,n){e&1&&p(0," \xA0")}var oe=class e{events1=[];events2=[];ngOnInit(){this.events1=[{status:"Ordered",date:"15/10/2020 10:30",icon:"pi pi-shopping-cart",color:"#9C27B0",image:"game-controller.jpg"},{status:"Processing",date:"15/10/2020 14:00",icon:"pi pi-cog",color:"#673AB7"},{status:"Shipped",date:"15/10/2020 16:15",icon:"pi pi-envelope",color:"#FF9800"},{status:"Delivered",date:"16/10/2020 10:00",icon:"pi pi-check",color:"#607D8B"}],this.events2=["2020","2021","2022","2023"]}static \u0275fac=function(t){return new(t||e)};static \u0275cmp=k({type:e,selectors:[["app-timeline-demo"]],decls:61,vars:8,consts:[["content",""],["opposite",""],["marker",""],[1,"grid","grid-cols-12","gap-8"],[1,"col-span-12","sm:col-span-6"],[1,"card"],[1,"font-semibold","text-xl","mb-4"],[3,"value"],["align","right",3,"value"],["align","alternate",3,"value"],[1,"col-span-full"],["align","alternate","styleClass","customized-timeline",3,"value"],[1,"font-semibold","mb-2"],["layout","horizontal","align","top",3,"value"],[1,"font-semibold","mt-4","mb-2"],["layout","horizontal","align","bottom",3,"value"],["layout","horizontal","align","alternate",3,"value"],[1,"p-text-secondary"],[1,"flex","w-8","h-8","items-center","justify-center","text-white","rounded-full","z-10","shadow-sm"],[3,"header","subheader"],["width","200","class","shadow",3,"src","alt",4,"ngIf"],["label","Read more",3,"text"],["width","200",1,"shadow",3,"src","alt"]],template:function(t,o){t&1&&(l(0,"div",3)(1,"div",4)(2,"div",5)(3,"div",6),p(4,"Left Align"),a(),l(5,"p-timeline",7),s(6,Ee,1,1,"ng-template",null,0,d),a()()(),l(8,"div",4)(9,"div",5)(10,"div",6),p(11,"Right Align"),a(),l(12,"p-timeline",8),s(13,be,1,1,"ng-template",null,0,d),a()()(),l(15,"div",4)(16,"div",5)(17,"div",6),p(18,"Alternate Align"),a(),l(19,"p-timeline",9),s(20,ke,1,1,"ng-template",null,0,d),a()()(),l(22,"div",4)(23,"div",5)(24,"div",6),p(25,"Opposite Content"),a(),l(26,"p-timeline",7),s(27,Ce,2,1,"ng-template",null,0,d)(29,Se,1,1,"ng-template",null,1,d),a()()(),l(31,"div",10)(32,"div",5)(33,"div",6),p(34,"Templating"),a(),l(35,"p-timeline",11),s(36,Ie,2,6,"ng-template",null,2,d)(38,Me,5,4,"ng-template",null,0,d),a()()(),l(40,"div",10)(41,"div",5)(42,"div",6),p(43,"Horizontal"),a(),l(44,"div",12),p(45,"Top Align"),a(),l(46,"p-timeline",13),s(47,we,1,1,"ng-template",null,0,d),a(),l(49,"div",14),p(50,"Bottom Align"),a(),l(51,"p-timeline",15),s(52,Be,1,1,"ng-template",null,0,d),a(),l(54,"div",14),p(55,"Alternate Align"),a(),l(56,"p-timeline",16),s(57,ze,1,1,"ng-template",null,0,d)(59,Fe,1,0,"ng-template",null,1,d),a()()()()),t&2&&(m(5),i("value",o.events1),m(7),i("value",o.events1),m(7),i("value",o.events1),m(7),i("value",o.events1),m(9),i("value",o.events1),m(11),i("value",o.events2),m(5),i("value",o.events2),m(5),i("value",o.events2))},dependencies:[I,S,ae,B,Z,Y,te,ee],encapsulation:2})};export{oe as TimelineDemo};
