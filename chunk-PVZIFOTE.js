import{a as T}from"./chunk-LL27XNUZ.js";import{$ as L,F as x,Ka as B,Oa as N,V as m,_ as F,ca as u,ma as S,ra as $,t as A,v as s}from"./chunk-UEDOXAPN.js";import{y as M}from"./chunk-BHCYPOM7.js";import{$a as a,Eb as w,Ia as C,L as f,M as h,Q as l,Wa as k,X as y,Xa as I,Ya as b,ca as v,gc as E,ha as g,ib as D,ka as o,xb as d,yb as p,zb as c}from"./chunk-4THFKMV7.js";var j=`
    .p-ink {
        display: block;
        position: absolute;
        background: dt('ripple.background');
        border-radius: 100%;
        transform: scale(0);
        pointer-events: none;
    }

    .p-ink-active {
        animation: ripple 0.4s linear;
    }

    @keyframes ripple {
        100% {
            opacity: 0;
            transform: scale(2.5);
        }
    }
`;var z=`
    ${j}

    /* For PrimeNG */
    .p-ripple {
        overflow: hidden;
        position: relative;
    }

    .p-ripple-disabled .p-ink {
        display: none !important;
    }

    @keyframes ripple {
        100% {
            opacity: 0;
            transform: scale(2.5);
        }
    }
`,G={root:"p-ink"},O=(()=>{class i extends B{name="ripple";style=z;classes=G;static \u0275fac=(()=>{let e;return function(n){return(e||(e=o(i)))(n||i)}})();static \u0275prov=f({token:i,factory:i.\u0275fac})}return i})();var ee=(()=>{class i extends N{zone=l(v);_componentStyle=l(O);animationListener;mouseDownListener;timeout;constructor(){super(),g(()=>{M(this.platformId)&&(this.config.ripple()?this.zone.runOutsideAngular(()=>{this.create(),this.mouseDownListener=this.renderer.listen(this.el.nativeElement,"mousedown",this.onMouseDown.bind(this))}):this.remove())})}onAfterViewInit(){}onMouseDown(e){let t=this.getInk();if(!t||this.document.defaultView?.getComputedStyle(t,null).display==="none")return;if(!this.$unstyled()&&s(t,"p-ink-active"),t.setAttribute("data-p-ink-active","false"),!m(t)&&!u(t)){let r=Math.max(x(this.el.nativeElement),L(this.el.nativeElement));t.style.height=r+"px",t.style.width=r+"px"}let n=F(this.el.nativeElement),P=e.pageX-n.left+this.document.body.scrollTop-u(t)/2,R=e.pageY-n.top+this.document.body.scrollLeft-m(t)/2;this.renderer.setStyle(t,"top",R+"px"),this.renderer.setStyle(t,"left",P+"px"),!this.$unstyled()&&A(t,"p-ink-active"),t.setAttribute("data-p-ink-active","true"),this.timeout=setTimeout(()=>{let r=this.getInk();r&&(!this.$unstyled()&&s(r,"p-ink-active"),r.setAttribute("data-p-ink-active","false"))},401)}getInk(){let e=this.el.nativeElement.children;for(let t=0;t<e.length;t++)if(typeof e[t].className=="string"&&e[t].className.indexOf("p-ink")!==-1)return e[t];return null}resetInk(){let e=this.getInk();e&&(!this.$unstyled()&&s(e,"p-ink-active"),e.setAttribute("data-p-ink-active","false"))}onAnimationEnd(e){this.timeout&&clearTimeout(this.timeout),!this.$unstyled()&&s(e.currentTarget,"p-ink-active"),e.currentTarget.setAttribute("data-p-ink-active","false")}create(){let e=this.renderer.createElement("span");this.renderer.addClass(e,"p-ink"),this.renderer.appendChild(this.el.nativeElement,e),this.renderer.setAttribute(e,"data-p-ink","true"),this.renderer.setAttribute(e,"data-p-ink-active","false"),this.renderer.setAttribute(e,"aria-hidden","true"),this.renderer.setAttribute(e,"role","presentation"),this.animationListener||(this.animationListener=this.renderer.listen(e,"animationend",this.onAnimationEnd.bind(this)))}remove(){let e=this.getInk();e&&(this.mouseDownListener&&this.mouseDownListener(),this.animationListener&&this.animationListener(),this.mouseDownListener=null,this.animationListener=null,S(e))}onDestroy(){this.config&&this.config.ripple()&&this.remove()}static \u0275fac=function(t){return new(t||i)};static \u0275dir=b({type:i,selectors:[["","pRipple",""]],hostAttrs:[1,"p-ripple"],features:[E([O]),a]})}return i})(),te=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=I({type:i});static \u0275inj=h({})}return i})();var H=["data-p-icon","spinner"],se=(()=>{class i extends T{pathId;onInit(){this.pathId="url(#"+$()+")"}static \u0275fac=(()=>{let e;return function(n){return(e||(e=o(i)))(n||i)}})();static \u0275cmp=k({type:i,selectors:[["","data-p-icon","spinner"]],features:[a],attrs:H,decls:5,vars:2,consts:[["d","M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z","fill","currentColor"],[3,"id"],["width","14","height","14","fill","white"]],template:function(t,n){t&1&&(y(),d(0,"g"),c(1,"path",0),p(),d(2,"defs")(3,"clipPath",1),c(4,"rect",2),p()()),t&2&&(D("clip-path",n.pathId),C(3),w("id",n.pathId))},encapsulation:2})}return i})();export{se as a,ee as b,te as c};
