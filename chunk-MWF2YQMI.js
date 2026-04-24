import{a as He,b as Oe}from"./chunk-MTOKV7AT.js";import{a as Fe,b as Qe}from"./chunk-WUKHJRB7.js";import{a as Ue,b as Ge,c as Je,d as Ye,e as Ke}from"./chunk-HWQFUGTO.js";import{a as Te,b as Be}from"./chunk-ANRFJ3ND.js";import"./chunk-VCG466CX.js";import{a as Re,b as je}from"./chunk-ZZQM5KXN.js";import{a as ze,b as Ne}from"./chunk-YE2GTS4B.js";import"./chunk-7UXNMH4B.js";import"./chunk-E5ZMHN2D.js";import"./chunk-YG2IFFAT.js";import"./chunk-AZVC6LIE.js";import{e as Le,f as Ae}from"./chunk-36A4CYMM.js";import"./chunk-SGMKNKRZ.js";import"./chunk-2ONCGL4V.js";import"./chunk-QM2IZRLJ.js";import{a as De,b as We}from"./chunk-IYSK5JV2.js";import{a as Ve,b as Ie}from"./chunk-ERKBAJAO.js";import{a as Pe}from"./chunk-YT4MBDER.js";import"./chunk-PGFXWWVX.js";import{a as we,b as ke,d as ye,i as _e,q as xe}from"./chunk-BFYAFXJ5.js";import"./chunk-2K7L2A6Y.js";import"./chunk-6JGVEGLE.js";import"./chunk-4US35IH6.js";import"./chunk-3BOSGQAH.js";import"./chunk-HXKXZZWV.js";import"./chunk-EFWIGB5R.js";import{c as Se,d as Me}from"./chunk-PLMLBB3F.js";import"./chunk-LKVVDLQW.js";import"./chunk-BXD7WEG6.js";import"./chunk-WJY3TNJU.js";import"./chunk-3U7KZLAF.js";import{Ba as he,Ca as j,Ka as ve,Na as Ce,Pa as P,Qa as Ee,z as R,za as ge}from"./chunk-5QZSDTXI.js";import{l as qe,o as ue,p as me,u as be,z as fe}from"./chunk-PM5SR23A.js";import{$a as ne,Cb as ie,Db as k,Fa as Z,Gc as w,Hb as x,Ia as n,Jb as h,K as G,Kb as le,L as J,Lb as oe,M as Y,Mb as re,Na as $,Nb as ae,O as K,Ob as C,Pb as E,Q as W,V as q,W as u,Wa as L,Wb as se,Xa as ee,Xb as B,Yb as d,Zb as v,_a as te,ab as _,ba as y,bc as b,cc as f,dc as g,fa as H,fc as de,gc as pe,ka as X,nb as A,ob as z,qb as O,rb as M,sb as T,tb as r,ub as i,uc as N,vb as l,wb as m,zc as ce}from"./chunk-M7JBURX2.js";import{a as Q}from"./chunk-DAQOROHW.js";var Xe=`
    /*!
* Quill Editor v1.3.3
* https://quilljs.com/
* Copyright (c) 2014, Jason Chen
* Copyright (c) 2013, salesforce.com
*/
    .ql-container {
        box-sizing: border-box;
        font-family: Helvetica, Arial, sans-serif;
        font-size: 13px;
        height: 100%;
        margin: 0;
        position: relative;
    }
    .ql-container.ql-disabled .ql-tooltip {
        visibility: hidden;
    }
    .ql-container.ql-disabled .ql-editor ul[data-checked] > li::before {
        pointer-events: none;
    }
    .ql-clipboard {
        inset-inline-start: -100000px;
        height: 1px;
        overflow-y: hidden;
        position: absolute;
        top: 50%;
    }
    .ql-clipboard p {
        margin: 0;
        padding: 0;
    }
    .ql-editor {
        box-sizing: border-box;
        line-height: 1.42;
        height: 100%;
        outline: none;
        overflow-y: auto;
        padding: 12px 15px;
        tab-size: 4;
        -moz-tab-size: 4;
        text-align: left;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
    .ql-editor > * {
        cursor: text;
    }
    .ql-editor p,
    .ql-editor ol,
    .ql-editor ul,
    .ql-editor pre,
    .ql-editor blockquote,
    .ql-editor h1,
    .ql-editor h2,
    .ql-editor h3,
    .ql-editor h4,
    .ql-editor h5,
    .ql-editor h6 {
        margin: 0;
        padding: 0;
        counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
    }
    .ql-editor ol,
    .ql-editor ul {
        padding-inline-start: 1.5rem;
    }
    .ql-editor ol > li,
    .ql-editor ul > li {
        list-style-type: none;
    }
    .ql-editor ul > li::before {
        content: '\\2022';
    }
    .ql-editor ul[data-checked='true'],
    .ql-editor ul[data-checked='false'] {
        pointer-events: none;
    }
    .ql-editor ul[data-checked='true'] > li *,
    .ql-editor ul[data-checked='false'] > li * {
        pointer-events: all;
    }
    .ql-editor ul[data-checked='true'] > li::before,
    .ql-editor ul[data-checked='false'] > li::before {
        color: #777;
        cursor: pointer;
        pointer-events: all;
    }
    .ql-editor ul[data-checked='true'] > li::before {
        content: '\\2611';
    }
    .ql-editor ul[data-checked='false'] > li::before {
        content: '\\2610';
    }
    .ql-editor li::before {
        display: inline-block;
        white-space: nowrap;
        width: 1.2rem;
    }
    .ql-editor li:not(.ql-direction-rtl)::before {
        margin-inline-start: -1.5rem;
        margin-inline-end: 0.3rem;
        text-align: right;
    }
    .ql-editor li.ql-direction-rtl::before {
        margin-inline-start: 0.3rem;
        margin-inline-end: -1.5rem;
    }
    .ql-editor ol li:not(.ql-direction-rtl),
    .ql-editor ul li:not(.ql-direction-rtl) {
        padding-inline-start: 1.5rem;
    }
    .ql-editor ol li.ql-direction-rtl,
    .ql-editor ul li.ql-direction-rtl {
        padding-inline-end: 1.5rem;
    }
    .ql-editor ol li {
        counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
        counter-increment: list-0;
    }
    .ql-editor ol li:before {
        content: counter(list-0, decimal) '. ';
    }
    .ql-editor ol li.ql-indent-1 {
        counter-increment: list-1;
    }
    .ql-editor ol li.ql-indent-1:before {
        content: counter(list-1, lower-alpha) '. ';
    }
    .ql-editor ol li.ql-indent-1 {
        counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
    }
    .ql-editor ol li.ql-indent-2 {
        counter-increment: list-2;
    }
    .ql-editor ol li.ql-indent-2:before {
        content: counter(list-2, lower-roman) '. ';
    }
    .ql-editor ol li.ql-indent-2 {
        counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
    }
    .ql-editor ol li.ql-indent-3 {
        counter-increment: list-3;
    }
    .ql-editor ol li.ql-indent-3:before {
        content: counter(list-3, decimal) '. ';
    }
    .ql-editor ol li.ql-indent-3 {
        counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;
    }
    .ql-editor ol li.ql-indent-4 {
        counter-increment: list-4;
    }
    .ql-editor ol li.ql-indent-4:before {
        content: counter(list-4, lower-alpha) '. ';
    }
    .ql-editor ol li.ql-indent-4 {
        counter-reset: list-5 list-6 list-7 list-8 list-9;
    }
    .ql-editor ol li.ql-indent-5 {
        counter-increment: list-5;
    }
    .ql-editor ol li.ql-indent-5:before {
        content: counter(list-5, lower-roman) '. ';
    }
    .ql-editor ol li.ql-indent-5 {
        counter-reset: list-6 list-7 list-8 list-9;
    }
    .ql-editor ol li.ql-indent-6 {
        counter-increment: list-6;
    }
    .ql-editor ol li.ql-indent-6:before {
        content: counter(list-6, decimal) '. ';
    }
    .ql-editor ol li.ql-indent-6 {
        counter-reset: list-7 list-8 list-9;
    }
    .ql-editor ol li.ql-indent-7 {
        counter-increment: list-7;
    }
    .ql-editor ol li.ql-indent-7:before {
        content: counter(list-7, lower-alpha) '. ';
    }
    .ql-editor ol li.ql-indent-7 {
        counter-reset: list-8 list-9;
    }
    .ql-editor ol li.ql-indent-8 {
        counter-increment: list-8;
    }
    .ql-editor ol li.ql-indent-8:before {
        content: counter(list-8, lower-roman) '. ';
    }
    .ql-editor ol li.ql-indent-8 {
        counter-reset: list-9;
    }
    .ql-editor ol li.ql-indent-9 {
        counter-increment: list-9;
    }
    .ql-editor ol li.ql-indent-9:before {
        content: counter(list-9, decimal) '. ';
    }
    .ql-editor .ql-video {
        display: block;
        max-width: 100%;
    }
    .ql-editor .ql-video.ql-align-center {
        margin: 0 auto;
    }
    .ql-editor .ql-video.ql-align-right {
        margin: 0 0 0 auto;
    }
    .ql-editor .ql-bg-black {
        background: #000;
    }
    .ql-editor .ql-bg-red {
        background: #e60000;
    }
    .ql-editor .ql-bg-orange {
        background: #f90;
    }
    .ql-editor .ql-bg-yellow {
        background: #ff0;
    }
    .ql-editor .ql-bg-green {
        background: #008a00;
    }
    .ql-editor .ql-bg-blue {
        background: #06c;
    }
    .ql-editor .ql-bg-purple {
        background: #93f;
    }
    .ql-editor .ql-color-white {
        color: #fff;
    }
    .ql-editor .ql-color-red {
        color: #e60000;
    }
    .ql-editor .ql-color-orange {
        color: #f90;
    }
    .ql-editor .ql-color-yellow {
        color: #ff0;
    }
    .ql-editor .ql-color-green {
        color: #008a00;
    }
    .ql-editor .ql-color-blue {
        color: #06c;
    }
    .ql-editor .ql-color-purple {
        color: #93f;
    }
    .ql-editor .ql-font-serif {
        font-family:
            Georgia,
            Times New Roman,
            serif;
    }
    .ql-editor .ql-font-monospace {
        font-family:
            Monaco,
            Courier New,
            monospace;
    }
    .ql-editor .ql-size-small {
        font-size: 0.75rem;
    }
    .ql-editor .ql-size-large {
        font-size: 1.5rem;
    }
    .ql-editor .ql-size-huge {
        font-size: 2.5rem;
    }
    .ql-editor .ql-direction-rtl {
        direction: rtl;
        text-align: inherit;
    }
    .ql-editor .ql-align-center {
        text-align: center;
    }
    .ql-editor .ql-align-justify {
        text-align: justify;
    }
    .ql-editor .ql-align-right {
        text-align: right;
    }
    .ql-editor.ql-blank::before {
        color: dt('form.field.placeholder.color');
        content: attr(data-placeholder);
        font-style: italic;
        inset-inline-start: 15px;
        pointer-events: none;
        position: absolute;
        inset-inline-end: 15px;
    }
    .ql-snow.ql-toolbar:after,
    .ql-snow .ql-toolbar:after {
        clear: both;
        content: '';
        display: table;
    }
    .ql-snow.ql-toolbar button,
    .ql-snow .ql-toolbar button {
        background: none;
        border: none;
        cursor: pointer;
        display: inline-block;
        float: left;
        height: 24px;
        padding-block: 3px;
        padding-inline: 5px;
        width: 28px;
    }
    .ql-snow.ql-toolbar button svg,
    .ql-snow .ql-toolbar button svg {
        float: left;
        height: 100%;
    }
    .ql-snow.ql-toolbar button:active:hover,
    .ql-snow .ql-toolbar button:active:hover {
        outline: none;
    }
    .ql-snow.ql-toolbar input.ql-image[type='file'],
    .ql-snow .ql-toolbar input.ql-image[type='file'] {
        display: none;
    }
    .ql-snow.ql-toolbar button:hover,
    .ql-snow .ql-toolbar button:hover,
    .ql-snow.ql-toolbar button:focus,
    .ql-snow .ql-toolbar button:focus,
    .ql-snow.ql-toolbar button.ql-active,
    .ql-snow .ql-toolbar button.ql-active,
    .ql-snow.ql-toolbar .ql-picker-label:hover,
    .ql-snow .ql-toolbar .ql-picker-label:hover,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active,
    .ql-snow.ql-toolbar .ql-picker-item:hover,
    .ql-snow .ql-toolbar .ql-picker-item:hover,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
        color: #06c;
    }
    .ql-snow.ql-toolbar button:hover .ql-fill,
    .ql-snow .ql-toolbar button:hover .ql-fill,
    .ql-snow.ql-toolbar button:focus .ql-fill,
    .ql-snow .ql-toolbar button:focus .ql-fill,
    .ql-snow.ql-toolbar button.ql-active .ql-fill,
    .ql-snow .ql-toolbar button.ql-active .ql-fill,
    .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
    .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill,
    .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill,
    .ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill,
    .ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar button:focus .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar button:focus .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
        fill: #06c;
    }
    .ql-snow.ql-toolbar button:hover .ql-stroke,
    .ql-snow .ql-toolbar button:hover .ql-stroke,
    .ql-snow.ql-toolbar button:focus .ql-stroke,
    .ql-snow .ql-toolbar button:focus .ql-stroke,
    .ql-snow.ql-toolbar button.ql-active .ql-stroke,
    .ql-snow .ql-toolbar button.ql-active .ql-stroke,
    .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
    .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
    .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,
    .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
    .ql-snow.ql-toolbar button:hover .ql-stroke-miter,
    .ql-snow .ql-toolbar button:hover .ql-stroke-miter,
    .ql-snow.ql-toolbar button:focus .ql-stroke-miter,
    .ql-snow .ql-toolbar button:focus .ql-stroke-miter,
    .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,
    .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,
    .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
    .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
    .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
    .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
    .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
    .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
    .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
    .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
        stroke: #06c;
    }
    @media (pointer: coarse) {
        .ql-snow.ql-toolbar button:hover:not(.ql-active),
        .ql-snow .ql-toolbar button:hover:not(.ql-active) {
            color: #444;
        }
        .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-fill,
        .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-fill,
        .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill,
        .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke.ql-fill {
            fill: #444;
        }
        .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke,
        .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke,
        .ql-snow.ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter,
        .ql-snow .ql-toolbar button:hover:not(.ql-active) .ql-stroke-miter {
            stroke: #444;
        }
    }
    .ql-snow {
        box-sizing: border-box;
    }
    .ql-snow * {
        box-sizing: border-box;
    }
    .ql-snow .ql-hidden {
        display: none;
    }
    .ql-snow .ql-out-bottom,
    .ql-snow .ql-out-top {
        visibility: hidden;
    }
    .ql-snow .ql-tooltip {
        position: absolute;
        transform: translateY(10px);
    }
    .ql-snow .ql-tooltip a {
        cursor: pointer;
        text-decoration: none;
    }
    .ql-snow .ql-tooltip.ql-flip {
        transform: translateY(-10px);
    }
    .ql-snow .ql-formats {
        display: inline-block;
        vertical-align: middle;
    }
    .ql-snow .ql-formats:after {
        clear: both;
        content: '';
        display: table;
    }
    .ql-snow .ql-stroke {
        fill: none;
        stroke: #444;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2;
    }
    .ql-snow .ql-stroke-miter {
        fill: none;
        stroke: #444;
        stroke-miterlimit: 10;
        stroke-width: 2;
    }
    .ql-snow .ql-fill,
    .ql-snow .ql-stroke.ql-fill {
        fill: #444;
    }
    .ql-snow .ql-empty {
        fill: none;
    }
    .ql-snow .ql-even {
        fill-rule: evenodd;
    }
    .ql-snow .ql-thin,
    .ql-snow .ql-stroke.ql-thin {
        stroke-width: 1;
    }
    .ql-snow .ql-transparent {
        opacity: 0.4;
    }
    .ql-snow .ql-direction svg:last-child {
        display: none;
    }
    .ql-snow .ql-direction.ql-active svg:last-child {
        display: inline;
    }
    .ql-snow .ql-direction.ql-active svg:first-child {
        display: none;
    }
    .ql-snow .ql-editor h1 {
        font-size: 2rem;
    }
    .ql-snow .ql-editor h2 {
        font-size: 1.5rem;
    }
    .ql-snow .ql-editor h3 {
        font-size: 1.17rem;
    }
    .ql-snow .ql-editor h4 {
        font-size: 1rem;
    }
    .ql-snow .ql-editor h5 {
        font-size: 0.83rem;
    }
    .ql-snow .ql-editor h6 {
        font-size: 0.67rem;
    }
    .ql-snow .ql-editor a {
        text-decoration: underline;
    }
    .ql-snow .ql-editor blockquote {
        border-inline-start: 4px solid #ccc;
        margin-block-end: 5px;
        margin-block-start: 5px;
        padding-inline-start: 16px;
    }
    .ql-snow .ql-editor code,
    .ql-snow .ql-editor pre {
        background: #f0f0f0;
        border-radius: 3px;
    }
    .ql-snow .ql-editor pre {
        white-space: pre-wrap;
        margin-block-end: 5px;
        margin-block-start: 5px;
        padding: 5px 10px;
    }
    .ql-snow .ql-editor code {
        font-size: 85%;
        padding: 2px 4px;
    }
    .ql-snow .ql-editor pre.ql-syntax {
        background: #23241f;
        color: #f8f8f2;
        overflow: visible;
    }
    .ql-snow .ql-editor img {
        max-width: 100%;
    }
    .ql-snow .ql-picker {
        color: #444;
        display: inline-block;
        float: left;
        inset-inline-start: 0;
        font-size: 14px;
        font-weight: 500;
        height: 24px;
        position: relative;
        vertical-align: middle;
    }
    .ql-snow .ql-picker-label {
        cursor: pointer;
        display: inline-block;
        height: 100%;
        padding-inline-start: 8px;
        padding-inline-end: 2px;
        position: relative;
        width: 100%;
    }
    .ql-snow .ql-picker-label::before {
        display: inline-block;
        line-height: 22px;
    }
    .ql-snow .ql-picker-options {
        background: #fff;
        display: none;
        min-width: 100%;
        padding: 4px 8px;
        position: absolute;
        white-space: nowrap;
    }
    .ql-snow .ql-picker-options .ql-picker-item {
        cursor: pointer;
        display: block;
        padding-block-end: 5px;
        padding-block-start: 5px;
    }
    .ql-snow .ql-picker.ql-expanded .ql-picker-label {
        color: #ccc;
        z-index: 2;
    }
    .ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-fill {
        fill: #ccc;
    }
    .ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-stroke {
        stroke: #ccc;
    }
    .ql-snow .ql-picker.ql-expanded .ql-picker-options {
        display: block;
        margin-block-start: -1px;
        top: 100%;
        z-index: 1;
    }
    .ql-snow .ql-color-picker,
    .ql-snow .ql-icon-picker {
        width: 28px;
    }
    .ql-snow .ql-color-picker .ql-picker-label,
    .ql-snow .ql-icon-picker .ql-picker-label {
        padding: 2px 4px;
    }
    .ql-snow .ql-color-picker .ql-picker-label svg,
    .ql-snow .ql-icon-picker .ql-picker-label svg {
        inset-inline-end: 4px;
    }
    .ql-snow .ql-icon-picker .ql-picker-options {
        padding: 4px 0;
    }
    .ql-snow .ql-icon-picker .ql-picker-item {
        height: 24px;
        width: 24px;
        padding: 2px 4px;
    }
    .ql-snow .ql-color-picker .ql-picker-options {
        padding: 3px 5px;
        width: 152px;
    }
    .ql-snow .ql-color-picker .ql-picker-item {
        border: 1px solid transparent;
        float: left;
        height: 16px;
        margin: 2px;
        padding: 0;
        width: 16px;
    }
    .ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {
        position: absolute;
        margin-block-start: -9px;
        inset-inline-end: 0;
        top: 50%;
        width: 18px;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-label]:not([data-label=''])::before,
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-label]:not([data-label=''])::before,
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-label]:not([data-label=''])::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-label]:not([data-label=''])::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-label]:not([data-label=''])::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-label]:not([data-label=''])::before {
        content: attr(data-label);
    }
    .ql-snow .ql-picker.ql-header {
        width: 98px;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item::before {
        content: 'Normal';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
        content: 'Heading 1';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
        content: 'Heading 2';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
        content: 'Heading 3';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
        content: 'Heading 4';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
        content: 'Heading 5';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
        content: 'Heading 6';
    }
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
        font-size: 2rem;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
        font-size: 1.5rem;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
        font-size: 1.17rem;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
        font-size: 1rem;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
        font-size: 0.83rem;
    }
    .ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
        font-size: 0.67rem;
    }
    .ql-snow .ql-picker.ql-font {
        width: 108px;
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item::before {
        content: 'Sans Serif';
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='serif']::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='serif']::before {
        content: 'Serif';
    }
    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value='monospace']::before,
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before {
        content: 'Monospace';
    }
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='serif']::before {
        font-family:
            Georgia,
            Times New Roman,
            serif;
    }
    .ql-snow .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before {
        font-family:
            Monaco,
            Courier New,
            monospace;
    }
    .ql-snow .ql-picker.ql-size {
        width: 98px;
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item::before {
        content: 'Normal';
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='small']::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
        content: 'Small';
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='large']::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
        content: 'Large';
    }
    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value='huge']::before,
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
        content: 'Huge';
    }
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
        font-size: 10px;
    }
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
        font-size: 18px;
    }
    .ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
        font-size: 32px;
    }
    .ql-snow .ql-color-picker.ql-background .ql-picker-item {
        background: #fff;
    }
    .ql-snow .ql-color-picker.ql-color .ql-picker-item {
        background: #000;
    }
    .ql-toolbar.ql-snow {
        border: 1px solid #ccc;
        box-sizing: border-box;
        font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
        padding: 8px;
    }
    .ql-toolbar.ql-snow .ql-formats {
        margin-inline-end: 15px;
    }
    .ql-toolbar.ql-snow .ql-picker-label {
        border: 1px solid transparent;
    }
    .ql-toolbar.ql-snow .ql-picker-options {
        border: 1px solid transparent;
        box-shadow: rgba(0, 0, 0, 0.2) 0 2px 8px;
    }
    .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label {
        border-color: #ccc;
    }
    .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
        border-color: #ccc;
    }
    .ql-toolbar.ql-snow .ql-color-picker .ql-picker-item.ql-selected,
    .ql-toolbar.ql-snow .ql-color-picker .ql-picker-item:hover {
        border-color: #000;
    }
    .ql-toolbar.ql-snow + .ql-container.ql-snow {
        border-block-start: 0;
    }
    .ql-snow .ql-tooltip {
        background: #fff;
        border: 1px solid #ccc;
        box-shadow: 0 0 5px #ddd;
        color: #444;
        padding: 5px 12px;
        white-space: nowrap;
    }
    .ql-snow .ql-tooltip::before {
        content: 'Visit URL:';
        line-height: 26px;
        margin-inline-end: 8px;
    }
    .ql-snow .ql-tooltip input[type='text'] {
        display: none;
        border: 1px solid #ccc;
        font-size: 13px;
        height: 26px;
        margin: 0;
        padding: 3px 5px;
        width: 170px;
    }
    .ql-snow .ql-tooltip a.ql-preview {
        display: inline-block;
        max-width: 200px;
        overflow-x: hidden;
        text-overflow: ellipsis;
        vertical-align: top;
    }
    .ql-snow .ql-tooltip a.ql-action::after {
        border-inline-end: 1px solid #ccc;
        content: 'Edit';
        margin-inline-start: 16px;
        padding-inline-end: 8px;
    }
    .ql-snow .ql-tooltip a.ql-remove::before {
        content: 'Remove';
        margin-inline-start: 8px;
    }
    .ql-snow .ql-tooltip a {
        line-height: 26px;
    }
    .ql-snow .ql-tooltip.ql-editing a.ql-preview,
    .ql-snow .ql-tooltip.ql-editing a.ql-remove {
        display: none;
    }
    .ql-snow .ql-tooltip.ql-editing input[type='text'] {
        display: inline-block;
    }
    .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
        border-inline-end: 0;
        content: 'Save';
        padding-inline-end: 0;
    }
    .ql-snow .ql-tooltip[data-mode='link']::before {
        content: 'Enter link:';
    }
    .ql-snow .ql-tooltip[data-mode='formula']::before {
        content: 'Enter formula:';
    }
    .ql-snow .ql-tooltip[data-mode='video']::before {
        content: 'Enter video:';
    }
    .ql-snow a {
        color: #06c;
    }
    .ql-container.ql-snow {
        border: 1px solid #ccc;
    }

    .p-editor {
        display: block;
    }

    .p-editor .p-editor-toolbar {
        background: dt('editor.toolbar.background');
        border-start-end-radius: dt('editor.toolbar.border.radius');
        border-start-start-radius: dt('editor.toolbar.border.radius');
    }

    .p-editor .p-editor-toolbar.ql-snow {
        border: 1px solid dt('editor.toolbar.border.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-stroke {
        stroke: dt('editor.toolbar.item.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-fill {
        fill: dt('editor.toolbar.item.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker .ql-picker-label {
        border: 0 none;
        color: dt('editor.toolbar.item.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker .ql-picker-label:hover {
        color: dt('editor.toolbar.item.hover.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker .ql-picker-label:hover .ql-stroke {
        stroke: dt('editor.toolbar.item.hover.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker .ql-picker-label:hover .ql-fill {
        fill: dt('editor.toolbar.item.hover.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label {
        color: dt('editor.toolbar.item.active.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-stroke {
        stroke: dt('editor.toolbar.item.active.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-label .ql-fill {
        fill: dt('editor.toolbar.item.active.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
        background: dt('editor.overlay.background');
        border: 1px solid dt('editor.overlay.border.color');
        box-shadow: dt('editor.overlay.shadow');
        border-radius: dt('editor.overlay.border.radius');
        padding: dt('editor.overlay.padding');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options .ql-picker-item {
        color: dt('editor.overlay.option.color');
        border-radius: dt('editor.overlay.option.border.radius');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options .ql-picker-item:hover {
        background: dt('editor.overlay.option.focus.background');
        color: dt('editor.overlay.option.focus.color');
    }

    .p-editor .p-editor-toolbar.ql-snow .ql-picker.ql-expanded:not(.ql-color-picker, .ql-icon-picker) .ql-picker-item {
        padding: dt('editor.overlay.option.padding');
    }

    .p-editor .p-editor-content {
        border-end-end-radius: dt('editor.content.border.radius');
        border-end-start-radius: dt('editor.content.border.radius');
    }

    .p-editor .p-editor-content.ql-snow {
        border: 1px solid dt('editor.content.border.color');
    }

    .p-editor .p-editor-content .ql-editor {
        background: dt('editor.content.background');
        color: dt('editor.content.color');
        border-end-end-radius: dt('editor.content.border.radius');
        border-end-start-radius: dt('editor.content.border.radius');
    }

    .p-editor .ql-snow.ql-toolbar button:hover,
    .p-editor .ql-snow.ql-toolbar button:focus {
        color: dt('editor.toolbar.item.hover.color');
    }

    .p-editor .ql-snow.ql-toolbar button:hover .ql-stroke,
    .p-editor .ql-snow.ql-toolbar button:focus .ql-stroke {
        stroke: dt('editor.toolbar.item.hover.color');
    }

    .p-editor .ql-snow.ql-toolbar button:hover .ql-fill,
    .p-editor .ql-snow.ql-toolbar button:focus .ql-fill {
        fill: dt('editor.toolbar.item.hover.color');
    }

    .p-editor .ql-snow.ql-toolbar button.ql-active,
    .p-editor .ql-snow.ql-toolbar .ql-picker-label.ql-active,
    .p-editor .ql-snow.ql-toolbar .ql-picker-item.ql-selected {
        color: dt('editor.toolbar.item.active.color');
    }

    .p-editor .ql-snow.ql-toolbar button.ql-active .ql-stroke,
    .p-editor .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
    .p-editor .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke {
        stroke: dt('editor.toolbar.item.active.color');
    }

    .p-editor .ql-snow.ql-toolbar button.ql-active .ql-fill,
    .p-editor .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,
    .p-editor .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill {
        fill: dt('editor.toolbar.item.active.color');
    }

    .p-editor .ql-snow.ql-toolbar button.ql-active .ql-picker-label,
    .p-editor .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-picker-label,
    .p-editor .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-picker-label {
        color: dt('editor.toolbar.item.active.color');
    }
`;var ot=["header"],rt=[[["p-header"]]],at=["p-header"];function st(s,c){s&1&&ie(0)}function dt(s,c){if(s&1&&(i(0,"div",2),oe(1),_(2,st,1,0,"ng-container",3),l()),s&2){let t=h();B(t.cx("toolbar")),r("pBind",t.ptm("toolbar")),n(2),r("ngTemplateOutlet",t.headerTemplate||t._headerTemplate)}}function pt(s,c){if(s&1&&(i(0,"div",2)(1,"span",4)(2,"select",5)(3,"option",6),d(4,"Heading"),l(),i(5,"option",7),d(6,"Subheading"),l(),i(7,"option",8),d(8,"Normal"),l()(),i(9,"select",9)(10,"option",8),d(11,"Sans Serif"),l(),i(12,"option",10),d(13,"Serif"),l(),i(14,"option",11),d(15,"Monospace"),l()()(),i(16,"span",4),m(17,"button",12)(18,"button",13)(19,"button",14),l(),i(20,"span",4),m(21,"select",15)(22,"select",16),l(),i(23,"span",4),m(24,"button",17)(25,"button",18),i(26,"select",19),m(27,"option",8),i(28,"option",20),d(29,"center"),l(),i(30,"option",21),d(31,"right"),l(),i(32,"option",22),d(33,"justify"),l()()(),i(34,"span",4),m(35,"button",23)(36,"button",24)(37,"button",25),l(),i(38,"span",4),m(39,"button",26),l()()),s&2){let t=h();B(t.cx("toolbar")),r("pBind",t.ptm("toolbar")),n(),r("pBind",t.ptm("formats")),n(),r("pBind",t.ptm("header")),n(),r("pBind",t.ptm("option")),n(2),r("pBind",t.ptm("option")),n(2),r("pBind",t.ptm("option")),n(2),r("pBind",t.ptm("select")),n(),r("pBind",t.ptm("option")),n(2),r("pBind",t.ptm("option")),n(2),r("pBind",t.ptm("option")),n(2),r("pBind",t.ptm("formats")),n(),r("pBind",t.ptm("bold")),n(),r("pBind",t.ptm("italic")),n(),r("pBind",t.ptm("underline")),n(),r("pBind",t.ptm("formats")),n(),r("pBind",t.ptm("color")),n(),r("pBind",t.ptm("background")),n(),r("pBind",t.ptm("formats")),n(),r("pBind",t.ptm("list")),n(),r("pBind",t.ptm("list")),n(),r("pBind",t.ptm("select")),n(),r("pBind",t.ptm("option")),n(),r("pBind",t.ptm("option")),n(2),r("pBind",t.ptm("option")),n(2),r("pBind",t.ptm("option")),n(2),r("pBind",t.ptm("formats")),n(),r("pBind",t.ptm("link")),n(),r("pBind",t.ptm("image")),n(),r("pBind",t.ptm("codeBlock")),n(),r("pBind",t.ptm("formats")),n(),r("pBind",t.ptm("clean"))}}var ct={root:({instance:s})=>["p-editor",{"p-invalid":s.invalid()}],toolbar:"p-editor-toolbar",content:"p-editor-content"},Ze=(()=>{class s extends ve{name="editor";style=Xe;classes=ct;static \u0275fac=(()=>{let t;return function(a){return(t||(t=X(s)))(a||s)}})();static \u0275prov=J({token:s,factory:s.\u0275fac})}return s})();var $e=new K("EDITOR_INSTANCE"),qt={provide:we,useExisting:G(()=>F),multi:!0},F=(()=>{class s extends Pe{$pcEditor=W($e,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=W(P,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}style;styleClass;placeholder;formats;modules;bounds;scrollingContainer;debug;get readonly(){return this._readonly}set readonly(t){this._readonly=t,this.quill&&(this._readonly?this.quill.disable():this.quill.enable())}onEditorInit=new y;onTextChange=new y;onSelectionChange=new y;onEditorChange=new y;onFocus=new y;onBlur=new y;toolbar;value;delayedCommand=null;_readonly=!1;quill;dynamicQuill;headerTemplate;templates;_headerTemplate;get isAttachedQuillEditorToDOM(){return this.quillElements?.editorElement?.isConnected}quillElements;focusListener=null;blurListener=null;_componentStyle=W(Ze);constructor(){super(),$(()=>{this.initQuillElements(),this.initQuillEditor()})}onAfterContentInit(){this.templates.forEach(t=>{switch(t.getType()){case"header":this.headerTemplate=t.template;break}})}writeControlValue(t){if(this.value=t,this.quill)if(t){let e=()=>{this.quill.setContents(this.quill.clipboard.convert(this.dynamicQuill.version.startsWith("2")?{html:this.value}:this.value))};this.isAttachedQuillEditorToDOM?e():this.delayedCommand=e}else{let e=()=>{this.quill.setText("")};this.isAttachedQuillEditorToDOM?e():this.delayedCommand=e}}getQuill(){return this.quill}initQuillEditor(){fe(this.platformId)||(this.dynamicQuill?this.createQuillEditor():import("./chunk-BSCL5A2K.js").then(t=>{this.dynamicQuill=t.default,this.createQuillEditor()}).catch(t=>console.error(t.message)))}createQuillEditor(){this.initQuillElements();let{toolbarElement:t,editorElement:e}=this.quillElements,a={toolbar:t},p=this.modules?Q(Q({},a),this.modules):a;this.quill=new this.dynamicQuill(e,{modules:p,placeholder:this.placeholder,readOnly:this.readonly,theme:"snow",formats:this.formats,bounds:this.bounds,debug:this.debug,scrollingContainer:this.scrollingContainer});let o=this.dynamicQuill.version.startsWith("2");this.value&&this.quill.setContents(this.quill.clipboard.convert(o?{html:this.value}:this.value)),this.quill.on("text-change",(S,V,I)=>{if(I==="user"){let D=o?this.quill.getSemanticHTML():R(e,".ql-editor")?.innerHTML,it=this.quill.getText().trim();D==="<p><br></p>"&&(D=null),this.onTextChange.emit({htmlValue:D,textValue:it,delta:S,source:I}),this.onModelChange(D),this.onModelTouched()}}),this.quill.on("selection-change",(S,V,I)=>{this.onSelectionChange.emit({range:S,oldRange:V,source:I})}),this.quill.on("editor-change",(S,...V)=>{this.onEditorChange.emit({eventName:S,args:V})});let U=this.quill.root;this.focusListener=()=>{this.onFocus.emit({source:"user"})},this.blurListener=()=>{this.onBlur.emit({source:"user"})},U.addEventListener("focus",this.focusListener),U.addEventListener("blur",this.blurListener),this.onEditorInit.emit({editor:this.quill})}onDestroy(){if(this.quill&&this.quill.root){let t=this.quill.root;this.focusListener&&(t.removeEventListener("focus",this.focusListener),this.focusListener=null),this.blurListener&&(t.removeEventListener("blur",this.blurListener),this.blurListener=null)}}initQuillElements(){this.quillElements||(this.quillElements={editorElement:R(this.el.nativeElement,'div[data-pc-section="content"]'),toolbarElement:R(this.el.nativeElement,'div[data-pc-section="toolbar"]')})}static \u0275fac=function(e){return new(e||s)};static \u0275cmp=L({type:s,selectors:[["p-editor"]],contentQueries:function(e,a,p){if(e&1&&re(p,ge,5)(p,ot,4)(p,he,4),e&2){let o;C(o=E())&&(a.toolbar=o.first),C(o=E())&&(a.headerTemplate=o.first),C(o=E())&&(a.templates=o)}},hostVars:2,hostBindings:function(e,a){e&2&&B(a.cn(a.cx("root"),a.styleClass))},inputs:{style:"style",styleClass:"styleClass",placeholder:"placeholder",formats:"formats",modules:"modules",bounds:"bounds",scrollingContainer:"scrollingContainer",debug:"debug",readonly:"readonly"},outputs:{onEditorInit:"onInit",onTextChange:"onTextChange",onSelectionChange:"onSelectionChange",onEditorChange:"onEditorChange",onFocus:"onFocus",onBlur:"onBlur"},features:[de([qt,Ze,{provide:$e,useExisting:s},{provide:Ce,useExisting:s}]),te([P]),ne],ngContentSelectors:at,decls:3,vars:6,consts:[[3,"class","pBind",4,"ngIf"],[3,"ngStyle","pBind"],[3,"pBind"],[4,"ngTemplateOutlet"],[1,"ql-formats",3,"pBind"],[1,"ql-header",3,"pBind"],["value","1",3,"pBind"],["value","2",3,"pBind"],["selected","",3,"pBind"],[1,"ql-font",3,"pBind"],["value","serif",3,"pBind"],["value","monospace",3,"pBind"],["aria-label","Bold","type","button",1,"ql-bold",3,"pBind"],["aria-label","Italic","type","button",1,"ql-italic",3,"pBind"],["aria-label","Underline","type","button",1,"ql-underline",3,"pBind"],[1,"ql-color",3,"pBind"],[1,"ql-background",3,"pBind"],["value","ordered","aria-label","Ordered List","type","button",1,"ql-list",3,"pBind"],["value","bullet","aria-label","Unordered List","type","button",1,"ql-list",3,"pBind"],[1,"ql-align",3,"pBind"],["value","center",3,"pBind"],["value","right",3,"pBind"],["value","justify",3,"pBind"],["aria-label","Insert Link","type","button",1,"ql-link",3,"pBind"],["aria-label","Insert Image","type","button",1,"ql-image",3,"pBind"],["aria-label","Insert Code Block","type","button",1,"ql-code-block",3,"pBind"],["aria-label","Remove Styles","type","button",1,"ql-clean",3,"pBind"]],template:function(e,a){e&1&&(le(rt),_(0,dt,3,4,"div",0)(1,pt,40,33,"div",0),m(2,"div",1)),e&2&&(r("ngIf",a.toolbar||a.headerTemplate||a._headerTemplate),n(),r("ngIf",!a.toolbar&&!a.headerTemplate&&!a._headerTemplate),n(),B(a.cx("content")),r("ngStyle",a.style)("pBind",a.ptm("content")))},dependencies:[be,qe,me,ue,j,Ee,P],encapsulation:2,changeDetection:0})}return s})(),et=(()=>{class s{static \u0275fac=function(e){return new(e||s)};static \u0275mod=ee({type:s});static \u0275inj=Y({imports:[F,j,j]})}return s})();var mt=["fileInput"],bt=()=>({"min-height":"320px","padding-top":"0","overflow-wrap":"break-word","word-break":"break-word"}),nt=(s,c)=>c.name;function ft(s,c){if(s&1){let t=k();m(0,"img",57)(1,"div",58),i(2,"div",59)(3,"p-button",60),x("onClick",function(){q(t);let a=h();return u(a.removeCoverImage())}),l()()}if(s&2){let t=h();r("src",t.coverImage(),Z)}}function gt(s,c){if(s&1){let t=k();i(0,"div",61),x("click",function(){q(t);let a=h();return u(a.triggerFileUpload())}),i(1,"div",62),m(2,"i",63),l(),i(3,"div",64)(4,"div",65),d(5,"Click to upload cover image"),l(),i(6,"div",66),d(7,"PNG, JPG or WebP (max 5MB)"),l()()()}}function ht(s,c){if(s&1){let t=k();i(0,"p-chip",69),x("onRemove",function(a){let p=q(t).$implicit,o=h(3);return u(o.removeAuthor(a,p))}),l()}if(s&2){let t=c.$implicit;r("label",t.name)("image",t.image)("removable",!0)}}function vt(s,c){if(s&1&&(i(0,"div",67),M(1,ht,1,3,"p-chip",68,nt),l()),s&2){let t=h().$implicit;n(),T(t)}}function wt(s,c){if(s&1&&A(0,vt,3,0,"div",67),s&2){let t=c.$implicit;z(t&&t.length>0?0:-1)}}function kt(s,c){if(s&1){let t=k();i(0,"div",35)(1,"p-checkbox",70),g("ngModelChange",function(a){q(t);let p=h();return f(p.selectedCategories,a)||(p.selectedCategories=a),u(a)}),l(),i(2,"label",71),d(3),l()()}if(s&2){let t=c.$implicit,e=h();n(),b("ngModel",e.selectedCategories),r("inputId",t)("value",t),n(),r("for",t),n(),v(t)}}function yt(s,c){s&1&&(i(0,"h4",72),d(1,"Publishing Settings"),l())}function _t(s,c){if(s&1){let t=k();i(0,"p-chip",69),x("onRemove",function(a){let p=q(t).$implicit,o=h(3);return u(o.removeAuthor(a,p))}),l()}if(s&2){let t=c.$implicit;r("label",t.name)("image",t.image)("removable",!0)}}function xt(s,c){if(s&1&&(i(0,"div",67),M(1,_t,1,3,"p-chip",68,nt),l()),s&2){let t=h().$implicit;n(),T(t)}}function Ct(s,c){if(s&1&&A(0,xt,3,0,"div",67),s&2){let t=c.$implicit;z(t&&t.length>0?0:-1)}}function Et(s,c){if(s&1){let t=k();i(0,"div",35)(1,"p-checkbox",70),g("ngModelChange",function(a){q(t);let p=h();return f(p.selectedCategories,a)||(p.selectedCategories=a),u(a)}),l(),i(2,"label",71),d(3),l()()}if(s&2){let t=c.$implicit,e=h();n(),b("ngModel",e.selectedCategories),r("inputId","mobile-"+t)("value",t),n(),r("for","mobile-"+t),n(),v(t)}}var tt=class s{fileInput;accordionPanelPT={root:{class:"!px-0"}};accordionPT={root:{class:"border-0! shadow-none!"}};accordionHeaderPT={root:{class:"bg-transparent! border-0! p-0! py-4! shadow-none!"},content:{class:"justify-start items-center w-full px-0"}};accordionContentPT={content:{class:"bg-transparent! border-0! p-0! pb-4!"}};sidebarVisible=H(!1);coverImage=H("/demo/images/cms/cms-hero-1.jpg");title=w("The Smartest Ways to Earn Airline Miles");content=w("Your credit score plays a crucial role in your financial well-being, influencing your ability to secure loans, mortgages, and even rental agreements. A higher score can unlock better interest rates and financial flexibility. Understanding how to improve and maintain a strong credit score is essential for achieving financial stability. Here are five golden rules to help you boost your score effectively.");status=w("Draft");visibility=w("Public");publishDate=w(new Date);selectedAuthors=w([{name:"Dianne Russell",image:"/demo/images/cms/avatars/avatar-dianne.jpg"}]);selectedCategories=w(["Lifestyle","Art","Banking"]);selectedTags=w(["World","Space"]);accordionValue=["status","visibility","publish-date"];tagOptions=["World","Space","Technology","Science","Nature","Travel","Art","Music","Food","Sports"];statusOptions=[{label:"Draft",value:"Draft"},{label:"Published",value:"Published"},{label:"Scheduled",value:"Scheduled"}];authorOptions=[{name:"Dianne Russell",image:"/demo/images/cms/avatars/avatar-dianne.jpg"},{name:"Jane Smith",image:"/demo/images/cms/avatars/avatar-jane.jpg"},{name:"Darrell Steward",image:"/demo/images/cms/avatars/avatar-darrell.jpg"},{name:"Emma Wilson",image:"/demo/images/cms/avatars/avatar-emma.jpg"},{name:"Ethan Hunt",image:"/demo/images/cms/avatars/avatar-ethan.jpg"},{name:"Sophia Chen",image:"/demo/images/cms/avatars/avatar-sophia.jpg"}];categories=["Lifestyle","Sustainability","Culture","Art","Banking","Technology"];formattedPublishDate=ce(()=>{if(!this.publishDate())return"Immediately";let c=new Date(this.publishDate()),t={month:"short",day:"numeric",year:"numeric"};return c.toLocaleDateString("en-US",t)});removeCoverImage(){this.coverImage.set(null)}triggerFileUpload(){this.fileInput?.nativeElement.click()}handleFileUpload(c){let e=c.target.files?.[0];if(e&&e.type.startsWith("image/")){let a=new FileReader;a.onload=p=>{this.coverImage.set(p.target?.result)},a.readAsDataURL(e)}}removeAuthor(c,t){c.stopPropagation(),this.selectedAuthors.set(this.selectedAuthors().filter(e=>e.name!==t.name))}static \u0275fac=function(t){return new(t||s)};static \u0275cmp=L({type:s,selectors:[["app-edit"]],viewQuery:function(t,e){if(t&1&&ae(mt,5),t&2){let a;C(a=E())&&(e.fileInput=a.first)}},inputs:{title:[1,"title"],content:[1,"content"],status:[1,"status"],visibility:[1,"visibility"],publishDate:[1,"publishDate"],selectedAuthors:[1,"selectedAuthors"],selectedCategories:[1,"selectedCategories"],selectedTags:[1,"selectedTags"]},outputs:{title:"titleChange",content:"contentChange",status:"statusChange",visibility:"visibilityChange",publishDate:"publishDateChange",selectedAuthors:"selectedAuthorsChange",selectedCategories:"selectedCategoriesChange",selectedTags:"selectedTagsChange"},decls:169,vars:63,consts:[["fileInput",""],["selecteditems",""],["header",""],[1,"flex","flex-col","min-h-screen","overflow-hidden","card"],[1,"p-6","border-b","border-surface-200","dark:border-surface-700","flex","justify-between","items-center","gap-4"],[1,"flex-1","text-surface-900","dark:text-surface-0","text-lg","font-medium"],["icon","pi pi-bars","severity","secondary","styleClass","!flex xl:!hidden",3,"onClick"],[1,"flex","flex-1","overflow-hidden"],[1,"flex-1","p-6","flex","flex-col","gap-6","min-w-0","overflow-auto"],[1,"flex","flex-col","gap-2"],[1,"text-surface-900","dark:text-surface-0","text-base","font-medium"],[1,"relative","h-[19rem]","rounded-2xl","border","border-surface-200","dark:border-surface-700","overflow-hidden"],[1,"w-full","h-full","bg-surface-100","dark:bg-surface-800","flex","flex-col","items-center","justify-center","gap-4","cursor-pointer","hover:bg-surface-200","dark:hover:bg-surface-700","transition-colors"],["type","file","accept","image/*",1,"hidden",3,"change"],["type","text","pInputText","","placeholder","The Smartest Ways to Earn Airline Miles",3,"ngModelChange","ngModel"],[1,"flex-1","flex","flex-col","gap-2","min-w-0"],["styleClass","!min-w-0",3,"ngModelChange","ngModel"],[1,"hidden","xl:block","w-[309px]","p-6","bg-surface-0","dark:bg-surface-900","border-l","border-surface-200","dark:border-surface-700"],[1,"flex","flex-col","gap-6"],[1,"flex","gap-4"],["label","Save Draft","severity","secondary","styleClass","w-full",1,"flex-1",3,"outlined"],["label","Publish","severity","primary","styleClass","w-full",1,"flex-1"],[1,"w-full","border-t","border-dashed","border-surface-200","dark:border-surface-700"],[1,"flex","flex-col","gap-4"],[1,"flex","justify-start","items-start","gap-2"],[1,"flex-1","text-surface-900","dark:text-surface-0","text-base","font-medium"],[1,"text-primary-600","dark:text-primary-400","text-base","font-medium","underline"],["expandIcon","pi pi-chevron-down !text-primary","collapseIcon","pi pi-chevron-up !text-primary",3,"multiple","value","pt"],["value","status",3,"pt"],[3,"pt"],[1,"flex","justify-start","items-center","gap-2","w-full"],[1,"flex-1","text-primary-600","dark:text-primary-400","text-base","font-medium"],["optionLabel","label","optionValue","value",1,"w-full",3,"ngModelChange","ngModel","options"],["value","visibility",3,"pt"],[1,"flex","flex-col","gap-3"],[1,"flex","items-center","gap-2"],["inputId","public","value","Public",3,"ngModelChange","ngModel"],["for","public",1,"text-surface-900","dark:text-surface-0","text-base"],["inputId","password","value","Password protected",3,"ngModelChange","ngModel"],["for","password",1,"text-surface-900","dark:text-surface-0","text-base"],["inputId","private","value","Private",3,"ngModelChange","ngModel"],["for","private",1,"text-surface-900","dark:text-surface-0","text-base"],["value","publish-date",3,"pt"],["styleClass","!w-full","inputStyleClass","w-full",3,"ngModelChange","ngModel","showIcon"],["optionLabel","name","placeholder","Select authors",3,"ngModelChange","ngModel","options"],["placeholder","Select tags","display","chip","styleClass","!w-full",3,"ngModelChange","ngModel","options"],["label","Move to trash","icon","pi pi-trash","severity","danger","styleClass","w-full",1,"flex-1",3,"outlined"],["position","right","styleClass","!w-full !max-w-md","appendTo","body",3,"visibleChange","visible"],[1,"flex","flex-col","gap-6","p-4","px-2"],["optionLabel","label","optionValue","value","styleClass","!w-full",3,"ngModelChange","ngModel","options"],["inputId","mobile-public","value","Public",3,"ngModelChange","ngModel"],["for","mobile-public",1,"text-surface-900","dark:text-surface-0","text-base"],["inputId","mobile-password","value","Password protected",3,"ngModelChange","ngModel"],["for","mobile-password",1,"text-surface-900","dark:text-surface-0","text-base"],["inputId","mobile-private","value","Private",3,"ngModelChange","ngModel"],["for","mobile-private",1,"text-surface-900","dark:text-surface-0","text-base"],["label","Move to trash","icon","pi pi-trash","severity","danger",3,"outlined"],["alt","Cover image",1,"w-full","h-full","object-cover",3,"src"],[1,"absolute","inset-0","bg-linear-to-b","from-transparent","to-black/30"],[1,"absolute","top-[18px]","right-[18px]"],["icon","pi pi-trash","severity","secondary","size","small","styleClass","!text-red-500 dark:!text-red-400",3,"onClick"],[1,"w-full","h-full","bg-surface-100","dark:bg-surface-800","flex","flex-col","items-center","justify-center","gap-4","cursor-pointer","hover:bg-surface-200","dark:hover:bg-surface-700","transition-colors",3,"click"],[1,"w-12","h-12","rounded-full","bg-surface-200","dark:bg-surface-600","flex","items-center","justify-center"],[1,"pi","pi-cloud-upload","text-surface-600","dark:text-surface-300","text-xl"],[1,"text-center"],[1,"text-surface-900","dark:text-surface-0","text-base","font-medium","mb-1"],[1,"text-surface-500","dark:text-surface-400","text-sm"],[1,"flex","gap-1","overflow-hidden","min-h-8"],["styleClass","!shrink-0",3,"label","image","removable"],["styleClass","!shrink-0",3,"onRemove","label","image","removable"],[3,"ngModelChange","ngModel","inputId","value"],[1,"text-surface-900","dark:text-surface-0","text-base",3,"for"],[1,"title-h4","text-left!"]],template:function(t,e){if(t&1){let a=k();i(0,"div",3)(1,"div",4)(2,"h1",5),d(3,"Create a new post"),l(),i(4,"p-button",6),x("onClick",function(){return q(a),u(e.sidebarVisible.set(!0))}),l()(),i(5,"div",7)(6,"div",8)(7,"div",9)(8,"label",10),d(9,"Cover"),l(),i(10,"div",11),A(11,ft,4,1)(12,gt,8,0,"div",12),i(13,"input",13,0),x("change",function(o){return q(a),u(e.handleFileUpload(o))}),l()()(),i(15,"div",9)(16,"label",10),d(17,"Title"),l(),i(18,"input",14),g("ngModelChange",function(o){return q(a),f(e.title,o)||(e.title=o),u(o)}),l()(),i(19,"div",15)(20,"label",10),d(21,"Content"),l(),i(22,"p-editor",16),g("ngModelChange",function(o){return q(a),f(e.content,o)||(e.content=o),u(o)}),l()()(),i(23,"div",17)(24,"div",18)(25,"div",19),m(26,"p-button",20)(27,"p-button",21),l(),m(28,"div",22),i(29,"div",23)(30,"div",24)(31,"span",25),d(32,"Publish"),l(),i(33,"a",26),d(34,"Preview"),l()()(),i(35,"p-accordion",27)(36,"p-accordion-panel",28)(37,"p-accordion-header",29)(38,"div",30)(39,"span",10),d(40,"Status:"),l(),i(41,"span",31),d(42),l()()(),i(43,"p-accordion-content",29)(44,"p-select",32),g("ngModelChange",function(o){return q(a),f(e.status,o)||(e.status=o),u(o)}),l()()(),i(45,"p-accordion-panel",33)(46,"p-accordion-header",29)(47,"div",30)(48,"span",10),d(49,"Visibility:"),l(),i(50,"span",31),d(51),l()()(),i(52,"p-accordion-content",29)(53,"div",34)(54,"div",35)(55,"p-radioButton",36),g("ngModelChange",function(o){return q(a),f(e.visibility,o)||(e.visibility=o),u(o)}),l(),i(56,"label",37),d(57,"Public"),l()(),i(58,"div",35)(59,"p-radioButton",38),g("ngModelChange",function(o){return q(a),f(e.visibility,o)||(e.visibility=o),u(o)}),l(),i(60,"label",39),d(61,"Password protected"),l()(),i(62,"div",35)(63,"p-radioButton",40),g("ngModelChange",function(o){return q(a),f(e.visibility,o)||(e.visibility=o),u(o)}),l(),i(64,"label",41),d(65,"Private"),l()()()()(),i(66,"p-accordion-panel",42)(67,"p-accordion-header",29)(68,"div",30)(69,"span",10),d(70,"Publish:"),l(),i(71,"span",31),d(72),l()()(),i(73,"p-accordion-content",29)(74,"p-datepicker",43),g("ngModelChange",function(o){return q(a),f(e.publishDate,o)||(e.publishDate=o),u(o)}),l()()()(),i(75,"div",9)(76,"label",10),d(77,"Author"),l(),i(78,"p-multiselect",44),g("ngModelChange",function(o){return q(a),f(e.selectedAuthors,o)||(e.selectedAuthors=o),u(o)}),_(79,wt,1,1,"ng-template",null,1,N),l()(),m(81,"div",22),i(82,"div",23)(83,"label",10),d(84,"Category"),l(),i(85,"div",34),M(86,kt,4,5,"div",35,O),l()(),m(88,"div",22),i(89,"div",9)(90,"label",10),d(91,"Tag"),l(),i(92,"p-multiselect",45),g("ngModelChange",function(o){return q(a),f(e.selectedTags,o)||(e.selectedTags=o),u(o)}),l()(),m(93,"div",22)(94,"p-button",46),l()()(),i(95,"p-drawer",47),g("visibleChange",function(o){return q(a),f(e.sidebarVisible,o)||(e.sidebarVisible=o),u(o)}),_(96,yt,2,0,"ng-template",null,2,N),i(98,"div",48)(99,"div",19),m(100,"p-button",20)(101,"p-button",21),l(),m(102,"div",22),i(103,"div",23)(104,"div",24)(105,"span",25),d(106,"Publish"),l(),i(107,"a",26),d(108,"Preview"),l()()(),i(109,"p-accordion",27)(110,"p-accordion-panel",28)(111,"p-accordion-header",29)(112,"div",30)(113,"span",10),d(114,"Status:"),l(),i(115,"span",31),d(116),l()()(),i(117,"p-accordion-content",29)(118,"p-select",49),g("ngModelChange",function(o){return q(a),f(e.status,o)||(e.status=o),u(o)}),l()()(),i(119,"p-accordion-panel",33)(120,"p-accordion-header",29)(121,"div",30)(122,"span",10),d(123,"Visibility:"),l(),i(124,"span",31),d(125),l()()(),i(126,"p-accordion-content",29)(127,"div",34)(128,"div",35)(129,"p-radioButton",50),g("ngModelChange",function(o){return q(a),f(e.visibility,o)||(e.visibility=o),u(o)}),l(),i(130,"label",51),d(131,"Public"),l()(),i(132,"div",35)(133,"p-radioButton",52),g("ngModelChange",function(o){return q(a),f(e.visibility,o)||(e.visibility=o),u(o)}),l(),i(134,"label",53),d(135,"Password protected"),l()(),i(136,"div",35)(137,"p-radioButton",54),g("ngModelChange",function(o){return q(a),f(e.visibility,o)||(e.visibility=o),u(o)}),l(),i(138,"label",55),d(139,"Private"),l()()()()(),i(140,"p-accordion-panel",42)(141,"p-accordion-header",29)(142,"div",30)(143,"span",10),d(144,"Publish:"),l(),i(145,"span",31),d(146),l()()(),i(147,"p-accordion-content",29)(148,"p-datepicker",43),g("ngModelChange",function(o){return q(a),f(e.publishDate,o)||(e.publishDate=o),u(o)}),l()()()(),i(149,"div",9)(150,"label",10),d(151,"Author"),l(),i(152,"p-multiselect",44),g("ngModelChange",function(o){return q(a),f(e.selectedAuthors,o)||(e.selectedAuthors=o),u(o)}),_(153,Ct,1,1,"ng-template",null,1,N),l()(),m(155,"div",22),i(156,"div",23)(157,"label",10),d(158,"Category"),l(),i(159,"div",34),M(160,Et,4,5,"div",35,O),l()(),m(162,"div",22),i(163,"div",9)(164,"label",10),d(165,"Tag"),l(),i(166,"p-multiselect",45),g("ngModelChange",function(o){return q(a),f(e.selectedTags,o)||(e.selectedTags=o),u(o)}),l()(),m(167,"div",22)(168,"p-button",56),l()()()}t&2&&(n(11),z(e.coverImage()?11:12),n(7),b("ngModel",e.title),n(4),se(pe(62,bt)),b("ngModel",e.content),n(4),r("outlined",!0),n(9),r("multiple",!0)("value",e.accordionValue)("pt",e.accordionPT),n(),r("pt",e.accordionPanelPT),n(),r("pt",e.accordionHeaderPT),n(5),v(e.status()),n(),r("pt",e.accordionContentPT),n(),b("ngModel",e.status),r("options",e.statusOptions),n(),r("pt",e.accordionPanelPT),n(),r("pt",e.accordionHeaderPT),n(5),v(e.visibility()),n(),r("pt",e.accordionContentPT),n(3),b("ngModel",e.visibility),n(4),b("ngModel",e.visibility),n(4),b("ngModel",e.visibility),n(3),r("pt",e.accordionPanelPT),n(),r("pt",e.accordionHeaderPT),n(5),v(e.formattedPublishDate()),n(),r("pt",e.accordionContentPT),n(),b("ngModel",e.publishDate),r("showIcon",!0),n(4),b("ngModel",e.selectedAuthors),r("options",e.authorOptions),n(8),T(e.categories),n(6),b("ngModel",e.selectedTags),r("options",e.tagOptions),n(2),r("outlined",!0),n(),b("visible",e.sidebarVisible),n(5),r("outlined",!0),n(9),r("multiple",!0)("value",e.accordionValue)("pt",e.accordionPT),n(),r("pt",e.accordionPanelPT),n(),r("pt",e.accordionHeaderPT),n(5),v(e.status()),n(),r("pt",e.accordionContentPT),n(),b("ngModel",e.status),r("options",e.statusOptions),n(),r("pt",e.accordionPanelPT),n(),r("pt",e.accordionHeaderPT),n(5),v(e.visibility()),n(),r("pt",e.accordionContentPT),n(3),b("ngModel",e.visibility),n(4),b("ngModel",e.visibility),n(4),b("ngModel",e.visibility),n(3),r("pt",e.accordionPanelPT),n(),r("pt",e.accordionHeaderPT),n(5),v(e.formattedPublishDate()),n(),r("pt",e.accordionContentPT),n(),b("ngModel",e.publishDate),r("showIcon",!0),n(4),b("ngModel",e.selectedAuthors),r("options",e.authorOptions),n(8),T(e.categories),n(6),b("ngModel",e.selectedTags),r("options",e.tagOptions),n(2),r("outlined",!0))},dependencies:[xe,ke,ye,_e,Ke,Ye,Ue,Ge,Je,Me,Se,Ne,ze,Qe,Fe,je,Re,Be,Te,et,F,We,De,Oe,He,Ie,Ve,Ae,Le],encapsulation:2})};export{tt as Edit};
