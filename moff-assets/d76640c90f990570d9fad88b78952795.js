!function t(e,n,o){function i(a,s){if(!n[a]){if(!e[a]){var d="function"==typeof require&&require;if(!s&&d)return d(a,!0);if(r)return r(a,!0);var f=new Error("Cannot find module '"+a+"'");throw f.code="MODULE_NOT_FOUND",f}var c=n[a]={exports:{}};e[a][0].call(c.exports,function(t){var n=e[a][1][t];return i(n?n:t)},c,c.exports,t,e,n,o)}return n[a].exports}for(var r="function"==typeof require&&require,a=0;a<o.length;a++)i(o[a]);return i}({1:[function(t,e,n){"use strict";function o(){function t(){f=!0,Moff.each(d,function(t,e){o.include(e.id,e.callback)})}function e(){r.addEventListener("load",t,!1)}function n(){Moff.each(s,function(t,e){e.loadOnScreen.length&&e.loadOnScreen.indexOf(Moff.getMode())!==-1&&!a.querySelectorAll('[data-load-module="'+t+'"]').length&&o.include(t)})}var o=this,r=window,a=r.document,s={},d=[],f=!1;this.register=function(t){s[t.id]={loaded:!1,depend:{js:t.depend&&t.depend.js||[],css:t.depend&&t.depend.css||[]},file:{js:t.file&&t.file.js||[],css:t.file&&t.file.css||[]},loadOnScreen:t.loadOnScreen||[],beforeInclude:t.beforeInclude||void 0,afterInclude:t.afterInclude||void 0,onWindowLoad:t.onWindowLoad||!1}},this.include=function(t,e){function n(){Moff.loadAssets(a.file,o,r)}function o(){"function"==typeof a.afterInclude&&a.afterInclude(),c&&e()}var r=arguments.length<=2||void 0===arguments[2]?{}:arguments[2],a=s[t];if(!a)return void Moff.debug(t+" AMD module is not registered.");"object"===("undefined"==typeof e?"undefined":i(e))&&(r=e,e=void 0);var c="function"==typeof e;return!r.reload&&a.loaded?void(c&&e()):a.onWindowLoad&&!f?void d.push({id:t,callback:e}):(a.loaded=!0,"function"==typeof a.beforeInclude&&a.beforeInclude(),void Moff.loadAssets(a.depend,n,r))},Moff.$(function(){e(),n()}),this._testonly={_deferredObjects:d,_registeredFiles:s}}Object.defineProperty(n,"__esModule",{value:!0});var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t};n.default=o},{}],2:[function(t,e,n){"use strict";function o(){function t(){O?(E(j).addListener(o),E(P).addListener(o),E(L).addListener(o)):S.addEventListener("resize",o,!1),S.addEventListener("scroll",c,!1),S.addEventListener("popstate",v,!1),_.handleDataEvents()}function e(){var t=document.createElement("style");t.appendChild(document.createTextNode('\n\t\t\t.moff-loader {\n\t\t\t\tdisplay: none;\n\t\t\t\tposition: absolute;\n\t\t\t\twidth: 50px;\n\t\t\t\theight: 50px;\n\t\t\t\tleft: 0;\n\t\t\t\ttop: 0;\n\t\t\t\tz-index: 9999;\n\t\t\t\t-webkit-transition: 0s ease-in;\n\t\t\t\t-moz-transition: 0s ease-in;\n\t\t\t\t-o-transition: 0s ease-in;\n\t\t\t\ttransition: 0s ease-in;\n\t\t\t}\n\t\t\t.moff-loader.__default {\n\t\t\t\ttop: 12px;\n\t\t\t\tleft: 50%;\n\t\t\t\tmargin-left: -25px;\n\t\t\t\tposition: fixed;\n\t\t\t}\n\t\t\t.moff-loader.__ie9-preloader {\n\t\t\t\tbackground: url(\'http://moffjs.com/images/ie9-preloader.gif\');\n\t\t\t}\n\t\t\t.moff-loader.__ie9-preloader .moff-loader_box {\n\t\t\t\tdisplay: none;\n\n\t\t\t}\n\t\t\t.moff-loader.__visible {\n\t\t\t\tdisplay: block;\n\t\t\t}\n\t\t\t.moff-loader_box {\n\t\t\t\tposition: absolute;\n\t\t\t\twidth: 100%;\n\t\t\t\theight: 100%;\n\t\t\t\tborder-radius: 50%;\n\t\t\t\tborder: 1px solid transparent;\n\t\t\t\tborder-top-color: #3498db;\n\t\t\t\t-webkit-animation: spin 2s linear infinite;\n\t\t\t\tanimation: spin 2s linear infinite;\n\t\t\t}\n\t\t\t.moff-loader_box:before {\n\t\t\t\tcontent: "";\n\t\t\t\tposition: absolute;\n\t\t\t\ttop: 2px;\n\t\t\t\tleft: 2px;\n\t\t\t\tright: 2px;\n\t\t\t\tbottom: 2px;\n\t\t\t\tborder-radius: 50%;\n\t\t\t\tborder: 1px solid transparent;\n\t\t\t\tborder-top-color: #e74c3c;\n\t\t\t\t-webkit-animation: spin 3s linear infinite;\n\t\t\t\tanimation: spin 3s linear infinite;\n\t\t\t}\n\t\t\t.moff-loader_box:after {\n\t\t\t\tcontent: "";\n\t\t\t\tposition: absolute;\n\t\t\t\ttop: 5px;\n\t\t\t\tleft: 5px;\n\t\t\t\tright: 5px;\n\t\t\t\tbottom: 5px;\n\t\t\t\tborder-radius: 50%;\n\t\t\t\tborder: 1px solid transparent;\n\t\t\t\tborder-top-color: #f9c922;\n\t\t\t\t-webkit-animation: spin 1.5s linear infinite;\n\t\t\t\tanimation: spin 1.5s linear infinite;\n\t\t\t}\n\t\t\t.moff-hidden {\n\t\t\t\tdisplay: none;\n\t\t\t}\n\t\t\t@-webkit-keyframes spin {\n\t\t\t\t0% {\n\t\t\t\t\t-webkit-transform: rotate(0deg);\n\t\t\t\t\t-ms-transform: rotate(0deg);\n\t\t\t\t\ttransform: rotate(0deg);\n\t\t\t\t}\n\t\t\t\t100% {\n\t\t\t\t\t-webkit-transform: rotate(360deg);\n\t\t\t\t\t-ms-transform: rotate(360deg);\n\t\t\t\t\ttransform: rotate(360deg);\n\t\t\t\t}\n\t\t\t}\n\t\t\t@keyframes spin {\n\t\t\t\t0% {\n\t\t\t\t\t-webkit-transform: rotate(0deg);\n\t\t\t\t\t-ms-transform: rotate(0deg);\n\t\t\t\t\ttransform: rotate(0deg);\n\t\t\t\t}\n\t\t\t\t100% {\n\t\t\t\t\t-webkit-transform: rotate(360deg);\n\t\t\t\t\t-ms-transform: rotate(360deg);\n\t\t\t\t\ttransform: rotate(360deg);\n\t\t\t\t}\n\t\t\t}\n\t\t')),document.querySelector("head").appendChild(t)}function n(){A=C.createElement("div"),k=C.createElement("div"),A.setAttribute("class","moff-loader"),k.setAttribute("class","moff-loader_box"),C.body.appendChild(A),A.appendChild(k)}function o(t){(O&&t.matches||d())&&(f(),_.runCallbacks(T,_,[_.getMode()]),_.handleDataEvents())}function r(t){var e=t.getAttribute("data-load-screen"),n=e.split(" ");return!e||n.length&&n.indexOf(_.getMode())!==-1}function a(){var t=w();_.each(t,function(t,e){H[t]=e})}function s(){if(H.breakpoints&&O){var t=H.breakpoints;L=L.replace("%d",t.sm),P=P.replace("%d",t.md),j=j.replace("%d",t.lg)}}function d(){return M!==_.getMode()}function f(){M=_.getMode()}function c(){if(W.length)for(var t=0,e=W.slice(0),n=e.length;t<n;t++){var o=e[t];_.inViewport(o)&&(W.splice(t,1),p(o))}}function u(t,e){_.ajax({url:t,type:"GET",crossDomain:l(t),success:function(t){"function"==typeof e&&e(t)}})}function l(t){var e=document.createElement("a");return e.href=t,C.domain!==e.hostname}function p(t){var e=t.title||"",n=t.href||t.getAttribute("data-load-url"),o=t.getAttribute("data-load-target"),i=t.getAttribute("data-push-url"),r=t.getAttribute("data-load-module");if(n){if(_.showPreloader(),n=h(t,n),t.removeAttribute("data-load-event"),_.runCallbacks(q,t),_.detect.history&&null!==i){var a=Date.now();S.history.pushState({elemId:a,url:n},e,n),R[a]=t}m(t,n,o,function(){var e=document.querySelector(o);r?_.amd.include(r,function(){_.hidePreloader(),_.removeClass(e,"moff-hidden"),_.runCallbacks(N,t)}):(_.hidePreloader(),_.removeClass(e,"moff-hidden"),_.runCallbacks(N,t))})}else r&&(_.showPreloader(),_.amd.include(r,function(){_.hidePreloader()}))}function h(t,e){return e.replace(/\{\{(.*?)\}\}/g,function(){var e=arguments[1];return e.indexOf("-")!==-1?t.getAttribute(e):t[e]})}function m(t,e,n,o){function i(e){var i=t.getAttribute("data-page-title"),r=C.querySelector(n);null!==r&&(_.addClass(r,"moff-hidden"),r.innerHTML=e),i&&(C.title=i),o(),_.handleDataEvents()}e=b(e),$[e]?i($[e]):u(e,i)}function v(t){var e=t.state;if(e){var n=R[e.elemId];if(n){if(!r(n))return;var o=e.url,i=n.getAttribute("data-load-target");_.runCallbacks(q,n),m(n,o,i,function(){_.runCallbacks(N,n)})}}}function b(t){var e=t.indexOf("#");return e===-1?t:t.substr(0,e)}function y(){var t="data-load-screen";_.each(C.querySelectorAll("["+t+"]"),function(){var e=this;r(e)&&(e.removeAttribute(t),e.handled=!0,p(e))})}function g(t){var e=Object.prototype.toString.call(t);return i(/^\[object (HTMLCollection|NodeList)\]$/.test(e))&&t.hasOwnProperty("length")&&(0===t.length||"object"===i(t[0])&&t[0].nodeType>0)}function w(){return window.moffConfig||{}}function x(){D=!0,e(),n(),t(),_.runCallbacks(I,this)}var M,S=window,_=this,C=S.document,A=null,k=null,O=!(!S.matchMedia||!S.matchMedia("screen").addListener),E=O&&S.matchMedia,L="(min-width: %dpx)",P=L,j=L,T=[],I=[],D=!1,q=[],N=[],$={},W=[],H={breakpoints:{sm:768,md:992,lg:1200},loadOnHover:!0,cacheLiveTime:2e3},z=["[data-load-target]","[data-load-module]","[data-load-event]","[data-load-url]","[data-load-screen]","[data-push-url]","[data-page-title]"],R={};this.showPreloader=function(){var t=arguments.length<=0||void 0===arguments[0]||arguments[0];this.hidePreloader(),this.addClass(A,"__visible"),t&&this.addClass(A,"__default"),_.detect.supportCSS3("transition")||this.addClass(A,"__ie9-preloader")},this.hidePreloader=function(){this.removeClass(A,"__visible __default __ie9-preloader"),A.removeAttribute("style")},this.positionPreloader=function(t,e){if(this.showPreloader(!1),"number"==typeof t&&"number"==typeof e){var n="";if(_.detect.supportCSS3("transition")){var o=t+"px, "+e+"px";n="-webkit-transform: translate("+o+");\n\t\t\t\t-moz-transform: translate("+o+");\n\t\t\t\t-o-transform: translate("+o+");\n\t\t\t\ttransform: translate("+o+");"}else n="left: "+t+"px; top: "+e+"px",this.addClass(A,"__ie9-preloader");A.setAttribute("style",n)}},this.addClass=function(t,e){if(t){var n,o,e=e.split(/\s/),i=e.length,r=0;for(o=" "+t.className+" ";r<i;r++)n=e[r],o.indexOf(" "+n+" ")<0&&(o+=n+" ");t.className=o.trim()}},this.removeClass=function(t,e){if(t){for(var e=e?e.split(/\s/):[],n=e.length,o=t.className||"",i=0;i<n;i++){var r=new RegExp("(^| )"+e[i]+"( |$)");o=o.replace(r," ")}return t.className!=o||n||(o=""),t.className=o.trim(),t}},this.handleDataEvents=function(){y(),_.each(C.querySelectorAll(z.join(", ")),function(){var t=this,e=this;if(!e.handled){var n=(e.getAttribute("data-load-event")||"click").toLowerCase();Moff.detect.isMobile&&"click"===n&&(n="touchstart"),"dom"===n?(_.$(function(){p(e)}),n="click"):"scroll"===n?_.inViewport(e)?p(e):W.push(e):"click"!==n&&"touchstart"!==n||H.loadOnHover&&!_.detect.isMobile&&e.addEventListener("mouseenter",function(){e=t;var n=e.href||e.getAttribute("data-load-url");n&&(n=b(n),n&&(n=h(e,n),u(n,function(t){$[n]=t,setTimeout(function(){delete $[n]},H.cacheLiveTime)})))},!1),e.addEventListener(n,function(t){p(this),t.preventDefault()},!1),e.handled=!0}})},this.inViewport=function(t){for(var e=t.offsetTop,n=t.offsetLeft,o=t.offsetWidth,i=t.offsetHeight;t.offsetParent;)t=t.offsetParent,e+=t.offsetTop,n+=t.offsetLeft;return e<S.pageYOffset+S.innerHeight&&n<S.pageXOffset+S.innerWidth&&e+i>S.pageYOffset&&n+o>S.pageXOffset},this.ajax=function(t){var e,n=[];t.type=t.type.toUpperCase(),"object"===i(t.data)&&(e=t.data,this.each(e,function(t,e){n.push(encodeURIComponent(t)+"="+encodeURIComponent(e))}),t.data=n.join("&")),"GET"===t.type&&t.data&&(t.url+=(t.url.indexOf("?")!==-1?"&":"?")+t.data.replace(/%20/g,"+"),t.data=null);var o=new XMLHttpRequest;o.open(t.type,t.url,!0),o.setRequestHeader("Content-Type",t.contentType||"application/x-www-form-urlencoded; charset=UTF-8"),t.crossDomain||o.setRequestHeader("X-Requested-With","XMLHttpRequest"),o.onload=function(){var e=this.status;e>=200&&e<300||304===e?t.success(this.responseText,this):t.error(this)},o.send(t.data)},this.runCallbacks=function(t,e,n){Array.isArray(t)||(t=[]),_.each(t,function(t,o){"function"==typeof o&&o.apply(e,n)})},this.onViewChange=function(t){return"function"!=typeof t?void this.debug("Moff.onViewChange callback must be a function"):void T.push(t)},this.beforeLoad=function(t){return"function"!=typeof t?void this.debug("Moff.beforeLoad callback must be a function"):void q.push(t)},this.afterLoad=function(t){return"function"!=typeof t?void this.debug("Moff.afterLoad callback must be a function"):void N.push(t)},this.getMode=function(){var t="xs";if(O)E(j).matches?t="lg":E(P).matches?t="md":E(L).matches&&(t="sm");else{var e=C.documentElement.clientWidth,n=H.breakpoints;e>=n.lg?t="lg":e>=n.md?t="md":e>=n.sm&&(t="sm")}return t},this.loadAssets=function(t,e){function n(){var o=t.js[s];o&&_.loadJS(o,function(){s++,r++,r===a?c&&e():n()},i)}function o(){r++,r===a&&c&&e()}var i=arguments.length<=2||void 0===arguments[2]?{}:arguments[2],r=0,a=0,s=0,d=Array.isArray(t.css),f=Array.isArray(t.js),c="function"==typeof e;return f&&(a+=t.js.length),d&&(a+=t.css.length),a?(n(),void(d&&t.css.length&&this.each(t.css,function(t,e){_.loadCSS(e,o,i)}))):(Moff.debug("You must pass minimum one assets or css file"),void(c&&e()))},this.loadJS=function(t,e){function n(){var n=C.createElement("script");n.setAttribute("src",t),a&&n.addEventListener("load",e,!1),C.querySelector("body").appendChild(n)}var o=arguments.length<=2||void 0===arguments[2]?{}:arguments[2];if("string"!=typeof t)return void this.debug("Moff.loadJS source must be a string");"object"===("undefined"==typeof e?"undefined":i(e))&&(o=e,e=void 0);var r=C.querySelector('script[src="'+t+'"]'),a="function"==typeof e;o.reload?(r&&r.parentNode.removeChild(r),n()):r?a&&e():n()},this.loadCSS=function(t,e){function n(){var n=C.createElement("link");a&&n.addEventListener("load",e,!1),n.setAttribute("href",t),n.setAttribute("rel","stylesheet"),C.querySelector("head").appendChild(n),n.onreadystatechange=function(){var t=n.readyState;"loaded"!==t&&"complete"!==t||(n.onreadystatechange=null,a&&e())}}var o=arguments.length<=2||void 0===arguments[2]?{}:arguments[2];if("string"!=typeof t)return void this.debug("Moff.loadCSS source must be a string");"object"===("undefined"==typeof e?"undefined":i(e))&&(o=e,e=void 0);var r=C.querySelector('link[href="'+t+'"]'),a="function"==typeof e;o.reload?(r&&r.parentNode.removeChild(r),n()):r?a&&e():n()},this.settings=function(t,e){return"undefined"==typeof e?H[t]:void(H[t]=e)},this.each=function(t,e){var n,o=0,i=t.length,r=Array.isArray(t)||g(t);if(r)for(;o<i&&(n=e.call(t[o],o,t[o]),n!==!1);o++);else for(o in t)if(t.hasOwnProperty(o)&&(n=e.call(t[o],o,t[o]),n===!1))break},this.$=function(t){return"function"!=typeof t?void this.debug("Moff.$ argument must be a function"):void(D?t():I.push(t))},this.debug=function(t){window.console&&window.console.debug&&window.console.debug("Moff DEBUG: "+t)},this.error=function(t){throw t},this.version="1.11.1",a(),s(),f(),C.addEventListener("DOMContentLoaded",x,!1),this._testonly={_cache:$,_loader:function(){return A}}}Object.defineProperty(n,"__esModule",{value:!0});var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t};n.default=o},{}],3:[function(t,e,n){"use strict";function o(){function t(){r.touch=!!("ontouchstart"in i||i.DocumentTouch&&s instanceof i.DocumentTouch),r.applicationCache=!!i.applicationCache,r.canvas=function(){var t=s.createElement("canvas");return!(!t.getContext||!t.getContext("2d"))}(),r.canvasText=!(!r.canvas||"function"!=typeof s.createElement("canvas").getContext("2d").fillText),r.dragAndDrop=function(){var t=s.createElement("div");return"draggable"in t||"ondragstart"in t&&"ondrop"in t}(),r.hashChange=!!("onhashchange"in i&&("undefined"==typeof s.documentMode||s.documentMode>7)),r.history=!(!i.history||!history.pushState),r.postMessage=!!i.postMessage,r.webSockets=!!("WebSocket"in i||"MozWebSocket"in i),r.webWorkers=!!i.Worker,r.audio=function(){var t=s.createElement("audio"),e=!1;try{t.canPlayType&&(e={},e.ogg=t.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),e.mp3=t.canPlayType("audio/mpeg;").replace(/^no$/,""),e.wav=t.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),e.m4a=(t.canPlayType("audio/x-m4a;")||t.canPlayType("audio/aac;")).replace(/^no$/,""))}catch(t){}return e}(),r.video=function(){var t=s.createElement("video"),e=!1;try{t.canPlayType&&(e={},e.ogg=t.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),e.h264=t.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),e.webm=t.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,""))}catch(t){}return e}(),r.indexedDB=function(){var t=["indexedDB","webkitIndexedDB","mozIndexedDB","OIndexedDB","msIndexedDB"];for(var e in t)if(t.hasOwnProperty(e)){var n=i[t[e]];if(void 0!==n)return n===!1?t[e]:"function"==typeof n?n.bind(i):n}return!1}(),r.localStorage=function(){try{return localStorage.setItem(r.mode,r.mode),localStorage.removeItem(r.mode),!0}catch(t){return!1}}(),r.sessionStorage=function(){try{return sessionStorage.setItem(r.mode,r.mode),sessionStorage.removeItem(r.mode),!0}catch(t){return!1}}()}function e(){var t=/(edge)[\/]([0-9\.]+)/.exec(a)||/(chrome)[ \/]([\w.]+)/.exec(a)||/(webkit)[ \/]([\w.]+)/.exec(a)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||a.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a)||[];t[1]&&(r.browser[t[1]]=!0),t[2]&&(r.browser.version=t[2]),r.browser.chrome&&(r.browser.webkit=!0)}function n(){var t=r.OS,e=/(ipad|iphone|ipod)/g.test(a),n=a.indexOf("mac")>-1,o=a.indexOf("win")>-1,i=a.indexOf("android")>-1,s=a.indexOf("windows phone")>-1;e?t.iOS=e:n?t.macOS=n:o?t.windows=o:i?t.android=i:s&&(t.windowsPhone=s)}function o(){r.isMobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)}var i=window,r=this,a=window.navigator.userAgent.toLowerCase(),s=document;this.browser={},this.OS={},this.supportCSS3=function(t){for(var e=t.charAt(0).toUpperCase()+t.slice(1),n=(t+" "+"Webkit Moz O ms".split(" ").join(e+" ")+e).split(" "),o=n.length,i=0;i<o;i++)if(t=n[i],t.indexOf("-")===-1&&void 0!==document.createElement("div").style[t])return!0;return!1},t(),e(),n(),o()}Object.defineProperty(n,"__esModule",{value:!0}),n.default=o},{}],4:[function(t,e,n){"use strict";function o(){var t={};this.add=function(e){"undefined"==typeof t[e]&&(t[e]=[])},this.on=function(e,n){this.add(e),"function"==typeof n&&t[e].push(n)},this.once=function(t,e){e._onceExecuted=!0,this.on(t,e)},this.trigger=function(e){var n=this,o=Array.prototype.slice.call(arguments,1),i=[];"undefined"!=typeof t[e]&&(Moff.runCallbacks(t[e],this,o),Moff.each(t[e],function(t,e){e._onceExecuted&&i.push(t)}),Moff.each(i,function(o,i){n.off(e,t[e][i])}))},this.get=function(e){var n=t[e];if(Array.isArray(n)&&n.length)return n},this.off=function(e,n){return n?void Moff.each(t[e],function(o,i){if(i===n)return t[e].splice(o,1),!1}):void(t[e]=[])},this._testonly={_eventStore:t}}Object.defineProperty(n,"__esModule",{value:!0}),n.default=o},{}],5:[function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}var i=t("../../amd/src/amd.e6"),r=o(i),a=t("../../core/src/core.e6"),s=o(a),d=t("../../event/src/event.e6"),f=o(d),c=t("../../detect/src/detect.e6"),u=o(c),l=t("../../modules/src/base.es6"),p=o(l),h=t("../../modules/src/api.e6"),m=o(h);window.Moff=new s.default,window.Moff.amd=new r.default,window.Moff.event=new f.default,window.Moff.Module=new p.default,window.Moff.detect=new u.default,window.Moff.modules=new m.default},{"../../amd/src/amd.e6":1,"../../core/src/core.e6":2,"../../detect/src/detect.e6":3,"../../event/src/event.e6":4,"../../modules/src/api.e6":6,"../../modules/src/base.es6":7}],6:[function(t,e,n){"use strict";function o(){function t(t){Array.isArray(t)&&Moff.each(t,function(t,e){Moff.event.add(e)})}var e={},n={};this.create=function(t,e,o){"undefined"==typeof o&&(o=e,e=void 0),o.prototype=Moff.Module,o.prototype.constructor=o,"undefined"==typeof n[t]&&(n[t]={constructor:o,depend:e})},this.initClass=function(o,i){function r(){var n=new a.constructor,r=e[o];Array.isArray(r)?r.push(n):"undefined"!=typeof r?e[o]=[r,n]:e[o]=n,"function"==typeof n.beforeInit&&n.beforeInit(),i&&Moff.each(i,function(t,e){n[t]=e}),n.moduleName=o,Array.isArray(n.events)&&n.events.length&&t(n.events),n.setScope(),"function"==typeof n.init&&n.init(),"function"==typeof n.afterInit&&n.afterInit()}var a=n[o];if(!a)return void Moff.debug(o+" Class is not registered");try{a.depend?Moff.loadAssets(a.depend,r):r()}catch(t){Moff.error(t)}},this.get=function(t){return e.hasOwnProperty(t)&&e[t]||void 0},this.getAll=function(){return e},this.getBy=function(t,e){var n=this.getAll(),o=[];return"class"===t&&(t="moduleName"),Moff.each(n,function(n,i){Array.isArray(i)?Moff.each(i,function(n,i){i[t]&&i[t]===e&&o.push(i)}):i[t]&&i[t]===e&&o.push(i)}),o},this.remove=function(t){var n=0,o="string"!=typeof t,i=o?t.moduleName:t,r=e[i];if(Array.isArray(r)){for(var a=r.length;n<a;n++){var s=r[n];(o&&s===t||!o&&s.moduleName===i)&&(r.splice(n,1),a=r.length,--n)}1===r.length?e[i]=e[i][0]:e[i].length||delete e[i]}else delete e[i]},this._testonly={_moduleClassStorage:n,_moduleObjectStorage:e}}Object.defineProperty(n,"__esModule",{value:!0}),n.default=o},{}],7:[function(t,e,n){"use strict";function o(){this.scopeSelector=null,this.scope=null,this.events=[],this.beforeInit=function(){},this.init=function(){},this.afterInit=function(){},this.setScope=function(){this.scopeSelector&&(this.scope=document.querySelector(this.scopeSelector))},this.find=function(t){return this.scope.querySelectorAll(t)},this.reopen=function(t){var e=this;return"object"!==("undefined"==typeof t?"undefined":i(t))?void Moff.debug("Reopen method argument must be an object"):void Moff.each(t,function(t,n){e[t]=n})}}Object.defineProperty(n,"__esModule",{value:!0});var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t};n.default=o},{}]},{},[5]);