(function(t){function e(e){for(var n,o,i=e[0],c=e[1],l=e[2],d=0,f=[];d<i.length;d++)o=i[d],s[o]&&f.push(s[o][0]),s[o]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(t[n]=c[n]);u&&u(e);while(f.length)f.shift()();return r.push.apply(r,l||[]),a()}function a(){for(var t,e=0;e<r.length;e++){for(var a=r[e],n=!0,o=1;o<a.length;o++){var c=a[o];0!==s[c]&&(n=!1)}n&&(r.splice(e--,1),t=i(i.s=a[0]))}return t}var n={},s={app:0},r=[];function o(t){return i.p+"js/"+({about:"about"}[t]||t)+"."+{about:"49c4b669"}[t]+".js"}function i(e){if(n[e])return n[e].exports;var a=n[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,i),a.l=!0,a.exports}i.e=function(t){var e=[],a=s[t];if(0!==a)if(a)e.push(a[2]);else{var n=new Promise(function(e,n){a=s[t]=[e,n]});e.push(a[2]=n);var r,c=document.createElement("script");c.charset="utf-8",c.timeout=120,i.nc&&c.setAttribute("nonce",i.nc),c.src=o(t),r=function(e){c.onerror=c.onload=null,clearTimeout(l);var a=s[t];if(0!==a){if(a){var n=e&&("load"===e.type?"missing":e.type),r=e&&e.target&&e.target.src,o=new Error("Loading chunk "+t+" failed.\n("+n+": "+r+")");o.type=n,o.request=r,a[1](o)}s[t]=void 0}};var l=setTimeout(function(){r({type:"timeout",target:c})},12e4);c.onerror=c.onload=r,document.head.appendChild(c)}return Promise.all(e)},i.m=t,i.c=n,i.d=function(t,e,a){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(i.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)i.d(a,n,function(e){return t[e]}.bind(null,n));return a},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="/",i.oe=function(t){throw console.error(t),t};var c=window["webpackJsonp"]=window["webpackJsonp"]||[],l=c.push.bind(c);c.push=e,c=c.slice();for(var d=0;d<c.length;d++)e(c[d]);var u=l;r.push([0,"chunk-vendors"]),a()})({0:function(t,e,a){t.exports=a("56d7")},4678:function(t,e,a){var n={"./af":"2bfb","./af.js":"2bfb","./ar":"8e73","./ar-dz":"a356","./ar-dz.js":"a356","./ar-kw":"423e","./ar-kw.js":"423e","./ar-ly":"1cfd","./ar-ly.js":"1cfd","./ar-ma":"0a84","./ar-ma.js":"0a84","./ar-sa":"8230","./ar-sa.js":"8230","./ar-tn":"6d83","./ar-tn.js":"6d83","./ar.js":"8e73","./az":"485c","./az.js":"485c","./be":"1fc1","./be.js":"1fc1","./bg":"84aa","./bg.js":"84aa","./bm":"a7fa","./bm.js":"a7fa","./bn":"9043","./bn.js":"9043","./bo":"d26a","./bo.js":"d26a","./br":"6887","./br.js":"6887","./bs":"2554","./bs.js":"2554","./ca":"d716","./ca.js":"d716","./cs":"3c0d","./cs.js":"3c0d","./cv":"03ec","./cv.js":"03ec","./cy":"9797","./cy.js":"9797","./da":"0f14","./da.js":"0f14","./de":"b469","./de-at":"b3eb","./de-at.js":"b3eb","./de-ch":"bb71","./de-ch.js":"bb71","./de.js":"b469","./dv":"598a","./dv.js":"598a","./el":"8d47","./el.js":"8d47","./en-SG":"cdab","./en-SG.js":"cdab","./en-au":"0e6b","./en-au.js":"0e6b","./en-ca":"3886","./en-ca.js":"3886","./en-gb":"39a6","./en-gb.js":"39a6","./en-ie":"e1d3","./en-ie.js":"e1d3","./en-il":"7333","./en-il.js":"7333","./en-nz":"6f50","./en-nz.js":"6f50","./eo":"65db","./eo.js":"65db","./es":"898b","./es-do":"0a3c","./es-do.js":"0a3c","./es-us":"55c9","./es-us.js":"55c9","./es.js":"898b","./et":"ec18","./et.js":"ec18","./eu":"0ff2","./eu.js":"0ff2","./fa":"8df4","./fa.js":"8df4","./fi":"81e9","./fi.js":"81e9","./fo":"0721","./fo.js":"0721","./fr":"9f26","./fr-ca":"d9f8","./fr-ca.js":"d9f8","./fr-ch":"0e49","./fr-ch.js":"0e49","./fr.js":"9f26","./fy":"7118","./fy.js":"7118","./ga":"5120","./ga.js":"5120","./gd":"f6b4","./gd.js":"f6b4","./gl":"8840","./gl.js":"8840","./gom-latn":"0caa","./gom-latn.js":"0caa","./gu":"e0c5","./gu.js":"e0c5","./he":"c7aa","./he.js":"c7aa","./hi":"dc4d","./hi.js":"dc4d","./hr":"4ba9","./hr.js":"4ba9","./hu":"5b14","./hu.js":"5b14","./hy-am":"d6b6","./hy-am.js":"d6b6","./id":"5038","./id.js":"5038","./is":"0558","./is.js":"0558","./it":"6e98","./it-ch":"6f12","./it-ch.js":"6f12","./it.js":"6e98","./ja":"079e","./ja.js":"079e","./jv":"b540","./jv.js":"b540","./ka":"201b","./ka.js":"201b","./kk":"6d79","./kk.js":"6d79","./km":"e81d","./km.js":"e81d","./kn":"3e92","./kn.js":"3e92","./ko":"22f8","./ko.js":"22f8","./ku":"2421","./ku.js":"2421","./ky":"9609","./ky.js":"9609","./lb":"440c","./lb.js":"440c","./lo":"b29d","./lo.js":"b29d","./lt":"26f9","./lt.js":"26f9","./lv":"b97c","./lv.js":"b97c","./me":"293c","./me.js":"293c","./mi":"688b","./mi.js":"688b","./mk":"6909","./mk.js":"6909","./ml":"02fb","./ml.js":"02fb","./mn":"958b","./mn.js":"958b","./mr":"39bd","./mr.js":"39bd","./ms":"ebe4","./ms-my":"6403","./ms-my.js":"6403","./ms.js":"ebe4","./mt":"1b45","./mt.js":"1b45","./my":"8689","./my.js":"8689","./nb":"6ce3","./nb.js":"6ce3","./ne":"3a39","./ne.js":"3a39","./nl":"facd","./nl-be":"db29","./nl-be.js":"db29","./nl.js":"facd","./nn":"b84c","./nn.js":"b84c","./pa-in":"f3ff","./pa-in.js":"f3ff","./pl":"8d57","./pl.js":"8d57","./pt":"f260","./pt-br":"d2d4","./pt-br.js":"d2d4","./pt.js":"f260","./ro":"972c","./ro.js":"972c","./ru":"957c","./ru.js":"957c","./sd":"6784","./sd.js":"6784","./se":"ffff","./se.js":"ffff","./si":"eda5","./si.js":"eda5","./sk":"7be6","./sk.js":"7be6","./sl":"8155","./sl.js":"8155","./sq":"c8f3","./sq.js":"c8f3","./sr":"cf1e","./sr-cyrl":"13e9","./sr-cyrl.js":"13e9","./sr.js":"cf1e","./ss":"52bd","./ss.js":"52bd","./sv":"5fbd","./sv.js":"5fbd","./sw":"74dc","./sw.js":"74dc","./ta":"3de5","./ta.js":"3de5","./te":"5cbb","./te.js":"5cbb","./tet":"576c","./tet.js":"576c","./tg":"3b1b","./tg.js":"3b1b","./th":"10e8","./th.js":"10e8","./tl-ph":"0f38","./tl-ph.js":"0f38","./tlh":"cf75","./tlh.js":"cf75","./tr":"0e81","./tr.js":"0e81","./tzl":"cf51","./tzl.js":"cf51","./tzm":"c109","./tzm-latn":"b53d","./tzm-latn.js":"b53d","./tzm.js":"c109","./ug-cn":"6117","./ug-cn.js":"6117","./uk":"ada2","./uk.js":"ada2","./ur":"5294","./ur.js":"5294","./uz":"2e8c","./uz-latn":"010e","./uz-latn.js":"010e","./uz.js":"2e8c","./vi":"2921","./vi.js":"2921","./x-pseudo":"fd7e","./x-pseudo.js":"fd7e","./yo":"7f33","./yo.js":"7f33","./zh-cn":"5c3a","./zh-cn.js":"5c3a","./zh-hk":"49ab","./zh-hk.js":"49ab","./zh-tw":"90ea","./zh-tw.js":"90ea"};function s(t){var e=r(t);return a(e)}function r(t){var e=n[t];if(!(e+1)){var a=new Error("Cannot find module '"+t+"'");throw a.code="MODULE_NOT_FOUND",a}return e}s.keys=function(){return Object.keys(n)},s.resolve=r,t.exports=s,s.id="4678"},"56d7":function(t,e,a){"use strict";a.r(e);a("cadf"),a("551c"),a("f751"),a("097d");var n,s,r,o,i,c,l=a("2b0e"),d=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"container-fluid",attrs:{id:"app"}},[a("header",{staticClass:"row justify-content-center"},[a("nav",{staticClass:"navbar navbar-expand-sm col-md-8 navbar-light bg-light"},[a("ul",{staticClass:"navbar-nav"},[a("li",{staticClass:"nav-item"},[a("router-link",{staticClass:"nav-link",attrs:{to:"/"}},[t._v("Home")])],1),a("li",{staticClass:"nav-item"},[a("router-link",{staticClass:"nav-link",attrs:{to:"/about"}},[t._v("About")])],1)])])]),a("main",{staticClass:"row justify-content-center"},[a("div",{staticClass:"col-md-8"},[a("router-view")],1)])])},u=[],f=a("2877"),m={},p=Object(f["a"])(m,d,u,!1,null,null,null),b=p.exports,h=a("8c4f"),j=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"row justify-content-center"},[a("h1",{staticClass:"col-md-12"},[t._v("Indego History")]),a("Analytic",{staticClass:"col-sm-8 col-md-10 col-lg-12"}),a("Analytic",{staticClass:"col-sm-8 col-md-10 col-lg-12"})],1)},v=[],g=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("section",[a("div",{staticClass:"card mb-3"},[a("div",{staticClass:"card-header"},[a("strong",[t._v("Date/Time:")]),t._v(" "+t._s(t.toDate||"Date not set")+", "+t._s(t.toTime||"Time not set")),a("br"),"getAllSnap"!==t.mode&&t.stationAddress?a("span",[a("strong",[t._v("Station:")]),t._v(" "+t._s(t.stationAddress)+" (ID: "+t._s(t.stationId)+")\n    ")]):t._e()]),a("div",{staticClass:"card-body row"},[a("form",{staticClass:"col-lg-6 form-row"},[a("div",{staticClass:"form-group col-12"},[a("label",{attrs:{for:"mode"}},[t._v("Query mode")]),a("select",{directives:[{name:"model",rawName:"v-model",value:t.mode,expression:"mode"}],staticClass:"form-control",attrs:{id:"mode"},on:{change:[function(e){var a=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){var e="_value"in t?t._value:t.value;return e});t.mode=e.target.multiple?a:a[0]},t.resetInfo]}},t._l(t.modes,function(e){return a("option",{key:e.name,domProps:{value:e.name}},[t._v("\n            "+t._s(e.label)+"\n          ")])}),0)]),"getOneSeries"===t.mode?a("div",{staticClass:"form-group col"},[a("label",{attrs:{for:"startDate"}},[t._v("Start date")]),a("input",{directives:[{name:"model",rawName:"v-model",value:t.fromDate,expression:"fromDate"}],staticClass:"form-control",attrs:{type:"date",name:"startDate",min:t.minDate},domProps:{value:t.fromDate},on:{change:t.resetInfo,input:function(e){e.target.composing||(t.fromDate=e.target.value)}}})]):t._e(),"getOneSeries"===t.mode?a("div",{staticClass:"form-group col"},[a("label",{attrs:{for:"startTime"}},[t._v("Start time")]),a("input",{directives:[{name:"model",rawName:"v-model",value:t.fromTime,expression:"fromTime"}],staticClass:"form-control",attrs:{type:"time",name:"startTime"},domProps:{value:t.fromTime},on:{change:t.resetInfo,input:function(e){e.target.composing||(t.fromTime=e.target.value)}}})]):t._e(),a("div",{staticClass:"form-group col"},[a("label",{attrs:{for:"endDate"}},[t._v("\n          "+t._s("getOneSeries"===t.mode?"End Date":"Snapshot date")+"\n        ")]),a("input",{directives:[{name:"model",rawName:"v-model",value:t.toDate,expression:"toDate"}],staticClass:"form-control",attrs:{type:"date",name:"endDate",min:t.minDate},domProps:{value:t.toDate},on:{change:t.resetInfo,input:function(e){e.target.composing||(t.toDate=e.target.value)}}})]),a("div",{staticClass:"form-group col"},[a("label",{attrs:{for:"endTime"}},[t._v("\n          "+t._s("getOneSeries"===t.mode?"End Time":"Snapshot time")+"\n        ")]),a("input",{directives:[{name:"model",rawName:"v-model",value:t.toTime,expression:"toTime"}],staticClass:"form-control",attrs:{type:"time",name:"endTime"},domProps:{value:t.toTime},on:{change:t.resetInfo,input:function(e){e.target.composing||(t.toTime=e.target.value)}}})]),"getAllSnap"!==t.mode&&t.stationIds[0].address?a("div",{staticClass:"form-group col-12"},[a("label",{attrs:{for:"stationId"}},[t._v("Select station")]),a("select",{directives:[{name:"model",rawName:"v-model",value:t.stationId,expression:"stationId"}],staticClass:"form-control",attrs:{id:"stationId"},on:{change:function(e){var a=Array.prototype.filter.call(e.target.options,function(t){return t.selected}).map(function(t){var e="_value"in t?t._value:t.value;return e});t.stationId=e.target.multiple?a:a[0]}}},t._l(t.stationIds,function(e){return e.id?a("option",{key:e.id,domProps:{value:e.id}},[t._v("\n            "+t._s(e.address)+"\n          ")]):t._e()}),0)]):t._e()]),t.loading?a("p",{staticClass:"col-lg-6"},[a("strong",[t._v("👩🏿‍🔬 Reticulating splines... 👨🏽‍💻")])]):t._e(),t.error||"getAllSnap"!==t.mode&&!t.stationAddress?a("p",{staticClass:"col-lg-6"},[a("strong",[t._v("No data returned for this request.")])]):"getOneSnap"===t.mode&&t.info?a("PieChart",{staticClass:"col-lg-6",attrs:{info:t.info}}):"getAllSnap"===t.mode&&t.info?a("BarChart",{staticClass:"col-lg-12",attrs:{info:t.info}}):"getOneSeries"===t.mode&&t.info?a("LineChart",{staticClass:"col-lg-12",attrs:{info:t.info}}):t._e()],1)])])},y=[],k=a("5d73"),C=a.n(k),w=(a("55dd"),a("96cf"),a("3b8d")),T=a("bc3a"),_=a.n(T),D=_.a.create({baseURL:"https://indego-history.herokuapp.com",withCredentials:!1,headers:{Accept:"application/json","Content-Type":"application/json"}}),S="/api/v1/stations",O={getOneSnap:function(t){return D.get("".concat(S,"/").concat(t.id,"?at=").concat(t.toTime))},getOneSeries:function(t){return D.get("".concat(S,"/").concat(t.id,"?from=").concat(t.fromTime,"&to=").concat(t.toTime))},getAllSnap:function(t){return D.get("".concat(S,"?at=").concat(t.toTime))}},x=a("1fca"),I={extends:x["c"],name:"PieChart",props:{info:{type:Object,required:!0}},methods:{render:function(){this.renderChart({labels:["Empty Docks","Available Bikes"],datasets:[{label:"GitHub Commits",backgroundColor:["#17a2b8","#28a745"],data:[this.info.docksAvailable,this.info.bikesAvailable]}]},{})}},watch:{info:function(){this.render()}},mounted:function(){this.render()}},A=I,z=Object(f["a"])(A,n,s,!1,null,null,null),P=z.exports,E=(a("ac6a"),{extends:x["a"],name:"BarChart",props:{info:{type:Array,required:!0}},methods:{render:function(){var t=[],e=[],a=[];this.info.forEach(function(n){n.properties.kioskId&&(t.push(n.properties.kioskId),e.push("hsl(".concat(360*Math.random(),", 100%, 35%)")),a.push(n.properties.bikesAvailable))}),this.renderChart({labels:t,datasets:[{label:"# of available bikes",backgroundColor:e,borderWidth:0,data:a}]},{})}},watch:{info:function(){this.render()}},mounted:function(){this.render()}}),M=E,Y=Object(f["a"])(M,r,o,!1,null,null,null),R=Y.exports,L=a("c1df"),N=a.n(L),q={extends:x["b"],name:"LineChart",props:{info:{required:!0}},methods:{render:function(){var t=[],e=[];this.info.forEach(function(a){a.station&&a.station.properties.kioskId&&(t.push(N()(a.at).format("YYYY-MM-DD")),e.push(a.station.properties.bikesAvailable))}),this.renderChart({labels:t,datasets:[{label:"# of available bikes",backgroundColor:["#17a2b8"],borderWidth:0,data:e}]},{})}},watch:{info:function(){this.render()}},mounted:function(){this.render()}},H=q,$=Object(f["a"])(H,i,c,!1,null,null,null),B=$.exports,G=N()().subtract({hours:1}),U=G.format("YYYY-MM-DD"),J=G.format("HH:00"),W=G.subtract({hours:72}),F=W.format("YYYY-MM-DD"),Q=W.format("HH:00"),Z={name:"Analytic",components:{PieChart:P,BarChart:R,LineChart:B},data:function(){return{stationId:3069,toDate:U,toTime:J,fromDate:F,fromTime:Q,minDate:"2019-02-10",info:{},mode:"getOneSnap",stationIds:[3069],modes:[{name:"getOneSnap",label:"One station at one time"},{name:"getAllSnap",label:"All stations at one time"},{name:"getOneSeries",label:"One station over time"}],error:null,loading:!0}},computed:{stationAddress:function(){var t;if(this.info&&this.info.addressStreet)t=this.info;else{if(!(this.info&&this.info.length>0&&this.info[0].station.properties))return null;t=this.info[0].station.properties}return"".concat(t.addressStreet,", ").concat(t.addressCity," ").concat(t.addressState," ").concat(t.addressZipCode)}},methods:{resetInfo:function(){this.info=null},getInfo:function(){var t=Object(w["a"])(regeneratorRuntime.mark(function t(e){var a,n=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,O[this.mode]({id:e.id,toTime:"".concat(e.toDate,"T").concat(e.toTime),fromTime:"".concat(e.fromDate,"T").concat(e.fromTime)}).then(function(t){var e;switch(n.mode){case"getOneSnap":if(!t.data.station){n.error=!0;break}n.error=null,e=t.data.station.properties;break;case"getAllSnap":if(!t.data.stations){n.error=!0;break}n.error=null,e=t.data.stations;break;case"getOneSeries":e=t.data.data;break;default:console.error("Request mode not recognized.")}return n.loading=!1,e}).catch(function(t){return console.error("getInfo 🚨",t),{}});case 2:return a=t.sent,t.abrupt("return",a);case 4:case"end":return t.stop()}},t,this)}));function e(e){return t.apply(this,arguments)}return e}(),getStationList:function(){var t=Object(w["a"])(regeneratorRuntime.mark(function t(e){var a=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,O.getAllSnap({toTime:"".concat(e.toDate,"T").concat(e.toTime)}).then(function(t){if(a.stationIds=[],t.data&&t.data.stations&&t.data.stations.length>0){var e=!0,n=!1,s=void 0;try{for(var r,o=C()(t.data.stations);!(e=(r=o.next()).done);e=!0){var i=r.value;a.stationIds.push({id:i.properties.kioskId,address:i.properties.addressStreet})}}catch(c){n=!0,s=c}finally{try{e||null==o.return||o.return()}finally{if(n)throw s}}a.stationIds.sort(function(t,e){return t.id-e.id}),a.error=null}else a.error=!0}).catch(function(t){console.error("getStationList 🚨",t)});case 2:case"end":return t.stop()}},t,this)}));function e(e){return t.apply(this,arguments)}return e}()},mounted:function(){var t=Object(w["a"])(regeneratorRuntime.mark(function t(){var e=this;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return this.$watch(function(){return{mode:e.mode,stationId:e.stationId,toDate:e.toDate,toTime:e.toTime}},function(){var t=Object(w["a"])(regeneratorRuntime.mark(function t(e){return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return this.loading=!0,t.next=3,this.getInfo({mode:e.mode,id:e.stationId,toDate:e.toDate?e.toDate:U,toTime:e.toTime?e.toTime:J,fromDate:"getOneSeries"===this.mode?this.fromDate:null,fromTime:"getOneSeries"===this.mode?this.fromTime:null});case 3:return this.info=t.sent,t.next=6,this.getStationList({toDate:e.toDate?e.toDate:U,toTime:e.toTime?e.toTime:J});case 6:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}()),t.next=3,this.getInfo({mode:this.mode,id:this.stationId,toDate:this.toDate,toTime:this.toTime});case 3:return this.info=t.sent,t.next=6,this.getStationList({toDate:this.toDate,toTime:this.toTime});case 6:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}()},K=Z,V=Object(f["a"])(K,g,y,!1,null,null,null),X=V.exports,tt={name:"home",components:{Analytic:X}},et=tt,at=Object(f["a"])(et,j,v,!1,null,null,null),nt=at.exports;l["a"].use(h["a"]);var st=new h["a"]({routes:[{path:"/",name:"home",component:nt},{path:"/about",name:"about",component:function(){return a.e("about").then(a.bind(null,"f820"))}}]});l["a"].config.productionTip=!1,new l["a"]({router:st,render:function(t){return t(b)}}).$mount("#app")}});
//# sourceMappingURL=app.942146fc.js.map