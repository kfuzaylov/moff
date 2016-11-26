var _self="undefined"!=typeof window?window:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{},Prism=function(){var t=/\blang(?:uage)?-(?!\*)(\w+)\b/i,e=_self.Prism={util:{encode:function(t){return t instanceof n?new n(t.type,e.util.encode(t.content),t.alias):"Array"===e.util.type(t)?t.map(e.util.encode):t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(t){return Object.prototype.toString.call(t).match(/\[object (\w+)\]/)[1]},clone:function(t){var n=e.util.type(t);switch(n){case"Object":var o={};for(var r in t)t.hasOwnProperty(r)&&(o[r]=e.util.clone(t[r]));return o;case"Array":return t.map&&t.map(function(t){return e.util.clone(t)})}return t}},languages:{extend:function(t,n){var o=e.util.clone(e.languages[t]);for(var r in n)o[r]=n[r];return o},insertBefore:function(t,n,o,r){r=r||e.languages;var a=r[t];if(2==arguments.length){o=arguments[1];for(var i in o)o.hasOwnProperty(i)&&(a[i]=o[i]);return a}var s={};for(var l in a)if(a.hasOwnProperty(l)){if(l==n)for(var i in o)o.hasOwnProperty(i)&&(s[i]=o[i]);s[l]=a[l]}return e.languages.DFS(e.languages,function(e,n){n===r[t]&&e!=t&&(this[e]=s)}),r[t]=s},DFS:function(t,n,o){for(var r in t)t.hasOwnProperty(r)&&(n.call(t,r,t[r],o||r),"Object"===e.util.type(t[r])?e.languages.DFS(t[r],n):"Array"===e.util.type(t[r])&&e.languages.DFS(t[r],n,r))}},plugins:{},highlightAll:function(t,n){for(var o,r=document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'),a=0;o=r[a++];)e.highlightElement(o,t===!0,n)},highlightElement:function(n,o,r){for(var a,i,s=n;s&&!t.test(s.className);)s=s.parentNode;s&&(a=(s.className.match(t)||[,""])[1],i=e.languages[a]),n.className=n.className.replace(t,"").replace(/\s+/g," ")+" language-"+a,s=n.parentNode,/pre/i.test(s.nodeName)&&(s.className=s.className.replace(t,"").replace(/\s+/g," ")+" language-"+a);var l=n.textContent,c={element:n,language:a,grammar:i,code:l};if(!l||!i)return void e.hooks.run("complete",c);if(e.hooks.run("before-highlight",c),o&&_self.Worker){var u=new Worker(e.filename);u.onmessage=function(t){c.highlightedCode=t.data,e.hooks.run("before-insert",c),c.element.innerHTML=c.highlightedCode,r&&r.call(c.element),e.hooks.run("after-highlight",c),e.hooks.run("complete",c)},u.postMessage(JSON.stringify({language:c.language,code:c.code,immediateClose:!0}))}else c.highlightedCode=e.highlight(c.code,c.grammar,c.language),e.hooks.run("before-insert",c),c.element.innerHTML=c.highlightedCode,r&&r.call(n),e.hooks.run("after-highlight",c),e.hooks.run("complete",c)},highlight:function(t,o,r){var a=e.tokenize(t,o);return n.stringify(e.util.encode(a),r)},tokenize:function(t,n,o){var r=e.Token,a=[t],i=n.rest;if(i){for(var s in i)n[s]=i[s];delete n.rest}t:for(var s in n)if(n.hasOwnProperty(s)&&n[s]){var l=n[s];l="Array"===e.util.type(l)?l:[l];for(var c=0;c<l.length;++c){var u=l[c],d=u.inside,f=!!u.lookbehind,p=0,m=u.alias;u=u.pattern||u;for(var h=0;h<a.length;h++){var g=a[h];if(a.length>t.length)break t;if(!(g instanceof r)){u.lastIndex=0;var v=u.exec(g);if(v){f&&(p=v[1].length);var y=v.index-1+p,v=v[0].slice(p),b=v.length,w=y+b,k=g.slice(0,y+1),x=g.slice(w+1),P=[h,1];k&&P.push(k);var S=new r(s,d?e.tokenize(v,d):v,m);P.push(S),x&&P.push(x),Array.prototype.splice.apply(a,P)}}}}}return a},hooks:{all:{},add:function(t,n){var o=e.hooks.all;o[t]=o[t]||[],o[t].push(n)},run:function(t,n){var o=e.hooks.all[t];if(o&&o.length)for(var r,a=0;r=o[a++];)r(n)}}},n=e.Token=function(t,e,n){this.type=t,this.content=e,this.alias=n};if(n.stringify=function(t,o,r){if("string"==typeof t)return t;if("Array"===e.util.type(t))return t.map(function(e){return n.stringify(e,o,t)}).join("");var a={type:t.type,content:n.stringify(t.content,o,r),tag:"span",classes:["token",t.type],attributes:{},language:o,parent:r};if("comment"==a.type&&(a.attributes.spellcheck="true"),t.alias){var i="Array"===e.util.type(t.alias)?t.alias:[t.alias];Array.prototype.push.apply(a.classes,i)}e.hooks.run("wrap",a);var s="";for(var l in a.attributes)s+=(s?" ":"")+l+'="'+(a.attributes[l]||"")+'"';return"<"+a.tag+' class="'+a.classes.join(" ")+'" '+s+">"+a.content+"</"+a.tag+">"},!_self.document)return _self.addEventListener?(_self.addEventListener("message",function(t){var n=JSON.parse(t.data),o=n.language,r=n.code,a=n.immediateClose;_self.postMessage(e.highlight(r,e.languages[o],o)),a&&_self.close()},!1),_self.Prism):_self.Prism;var o=document.getElementsByTagName("script");return o=o[o.length-1],o&&(e.filename=o.src,document.addEventListener&&!o.hasAttribute("data-manual")&&document.addEventListener("DOMContentLoaded",e.highlightAll)),_self.Prism}();"undefined"!=typeof module&&module.exports&&(module.exports=Prism),"undefined"!=typeof global&&(global.Prism=Prism),Prism.languages.markup={comment:/<!--[\w\W]*?-->/,prolog:/<\?[\w\W]+?\?>/,doctype:/<!DOCTYPE[\w\W]+?>/,cdata:/<!\[CDATA\[[\w\W]*?]]>/i,tag:{pattern:/<\/?[^\s>\/=.]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,inside:{tag:{pattern:/^<\/?[^\s>\/]+/i,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"attr-value":{pattern:/=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,inside:{punctuation:/[=>"']/}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:/&#?[\da-z]{1,8};/i},Prism.hooks.add("wrap",function(t){"entity"===t.type&&(t.attributes.title=t.content.replace(/&amp;/,"&"))}),Prism.languages.xml=Prism.languages.markup,Prism.languages.html=Prism.languages.markup,Prism.languages.mathml=Prism.languages.markup,Prism.languages.svg=Prism.languages.markup,Prism.languages.css={comment:/\/\*[\w\W]*?\*\//,atrule:{pattern:/@[\w-]+?.*?(;|(?=\s*\{))/i,inside:{rule:/@[\w-]+/}},url:/url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,selector:/[^\{\}\s][^\{\};]*?(?=\s*\{)/,string:/("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,property:/(\b|\B)[\w-]+(?=\s*:)/i,important:/\B!important\b/i,function:/[-a-z0-9]+(?=\()/i,punctuation:/[(){};:]/},Prism.languages.css.atrule.inside.rest=Prism.util.clone(Prism.languages.css),Prism.languages.markup&&(Prism.languages.insertBefore("markup","tag",{style:{pattern:/(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,lookbehind:!0,inside:Prism.languages.css,alias:"language-css"}}),Prism.languages.insertBefore("inside","attr-value",{"style-attr":{pattern:/\s*style=("|').*?\1/i,inside:{"attr-name":{pattern:/^\s*style/i,inside:Prism.languages.markup.tag.inside},punctuation:/^\s*=\s*['"]|['"]\s*$/,"attr-value":{pattern:/.+/i,inside:Prism.languages.css}},alias:"language-css"}},Prism.languages.markup.tag)),Prism.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\w\W]*?\*\//,lookbehind:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0}],string:/(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,"class-name":{pattern:/((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,lookbehind:!0,inside:{punctuation:/(\.|\\)/}},keyword:/\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,boolean:/\b(true|false)\b/,function:/[a-z0-9_]+(?=\()/i,number:/\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,operator:/--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,punctuation:/[{}[\];(),.:]/},Prism.languages.javascript=Prism.languages.extend("clike",{keyword:/\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/,number:/\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,function:/[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i}),Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:/(^|[^\/])\/(?!\/)(\[.+?]|\\.|[^\/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,lookbehind:!0}}),Prism.languages.insertBefore("javascript","class-name",{"template-string":{pattern:/`(?:\\`|\\?[^`])*`/,inside:{interpolation:{pattern:/\$\{[^}]+\}/,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:Prism.languages.javascript}},string:/[\s\S]+/}}}),Prism.languages.markup&&Prism.languages.insertBefore("markup","tag",{script:{pattern:/(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,lookbehind:!0,inside:Prism.languages.javascript,alias:"language-javascript"}}),Prism.languages.js=Prism.languages.javascript,function(){"undefined"!=typeof self&&self.Prism&&self.document&&document.querySelector&&(self.Prism.fileHighlight=function(){var t={js:"javascript",html:"markup",svg:"markup",xml:"markup",py:"python",rb:"ruby",ps1:"powershell",psm1:"powershell"};Array.prototype.forEach&&Array.prototype.slice.call(document.querySelectorAll("pre[data-src]")).forEach(function(e){for(var n,o=e.getAttribute("data-src"),r=e,a=/\blang(?:uage)?-(?!\*)(\w+)\b/i;r&&!a.test(r.className);)r=r.parentNode;if(r&&(n=(e.className.match(a)||[,""])[1]),!n){var i=(o.match(/\.(\w+)$/)||[,""])[1];n=t[i]||i}var s=document.createElement("code");s.className="language-"+n,e.textContent="",s.textContent="Loading…",e.appendChild(s);var l=new XMLHttpRequest;l.open("GET",o,!0),l.onreadystatechange=function(){4==l.readyState&&(l.status<400&&l.responseText?(s.textContent=l.responseText,Prism.highlightElement(s)):l.status>=400?s.textContent="✖ Error "+l.status+" while fetching file: "+l.statusText:s.textContent="✖ Error: File does not exist or is empty")},l.send(null)})},self.Prism.fileHighlight())}(),function t(e,n,o){function r(i,s){if(!n[i]){if(!e[i]){var l="function"==typeof require&&require;if(!s&&l)return l(i,!0);if(a)return a(i,!0);var c=new Error("Cannot find module '"+i+"'");throw c.code="MODULE_NOT_FOUND",c}var u=n[i]={exports:{}};e[i][0].call(u.exports,function(t){var n=e[i][1][t];return r(n?n:t)},u,u.exports,t,e,n,o)}return n[i].exports}for(var a="function"==typeof require&&require,i=0;i<o.length;i++)r(o[i]);return r}({1:[function(t,e,n){"use strict";function o(){function t(){c=!0,Moff.each(l,function(t,e){o.include(e.id,e.callback)})}function e(){a.addEventListener("load",t,!1)}function n(){Moff.each(s,function(t,e){e.loadOnScreen.length&&e.loadOnScreen.indexOf(Moff.getMode())!==-1&&!i.querySelectorAll('[data-load-module="'+t+'"]').length&&o.include(t)})}var o=this,a=window,i=a.document,s={},l=[],c=!1;this.register=function(t){s[t.id]={loaded:!1,depend:{js:t.depend&&t.depend.js||[],css:t.depend&&t.depend.css||[]},file:{js:t.file&&t.file.js||[],css:t.file&&t.file.css||[]},loadOnScreen:t.loadOnScreen||[],beforeInclude:t.beforeInclude||void 0,afterInclude:t.afterInclude||void 0,onWindowLoad:t.onWindowLoad||!1}},this.include=function(t,e){function n(){Moff.loadAssets(i.file,o,a)}function o(){"function"==typeof i.afterInclude&&i.afterInclude(),u&&e()}var a=arguments.length<=2||void 0===arguments[2]?{}:arguments[2],i=s[t];if(!i)return void Moff.debug(t+" AMD module is not registered.");"object"===("undefined"==typeof e?"undefined":r(e))&&(a=e,e=void 0);var u="function"==typeof e;return!a.reload&&i.loaded?void(u&&e()):i.onWindowLoad&&!c?void l.push({id:t,callback:e}):(i.loaded=!0,"function"==typeof i.beforeInclude&&i.beforeInclude(),void Moff.loadAssets(i.depend,n,a))},Moff.$(function(){e(),n()}),this._testonly={_deferredObjects:l,_registeredFiles:s}}Object.defineProperty(n,"__esModule",{value:!0});var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t};n.default=o},{}],2:[function(t,e,n){"use strict";function o(){function t(){_?(O(L).addListener(o),O(j).addListener(o),O(E).addListener(o)):P.addEventListener("resize",o,!1),P.addEventListener("scroll",u,!1),P.addEventListener("popstate",g,!1),S.handleDataEvents()}function e(){var t=document.createElement("style");t.appendChild(document.createTextNode('\n\t\t\t.moff-loader {\n\t\t\t\tdisplay: none;\n\t\t\t\tposition: absolute;\n\t\t\t\twidth: 50px;\n\t\t\t\theight: 50px;\n\t\t\t\tleft: 0;\n\t\t\t\ttop: 0;\n\t\t\t\tz-index: 9999;\n\t\t\t\t-webkit-transition: 0s ease-in;\n\t\t\t\t-moz-transition: 0s ease-in;\n\t\t\t\t-o-transition: 0s ease-in;\n\t\t\t\ttransition: 0s ease-in;\n\t\t\t}\n\t\t\t.moff-loader.__default {\n\t\t\t\ttop: 12px;\n\t\t\t\tleft: 50%;\n\t\t\t\tmargin-left: -25px;\n\t\t\t\tposition: fixed;\n\t\t\t}\n\t\t\t.moff-loader.__ie9-preloader {\n\t\t\t\tbackground: url(\'http://moffjs.com/images/ie9-preloader.gif\');\n\t\t\t}\n\t\t\t.moff-loader.__ie9-preloader .moff-loader_box {\n\t\t\t\tdisplay: none;\n\n\t\t\t}\n\t\t\t.moff-loader.__visible {\n\t\t\t\tdisplay: block;\n\t\t\t}\n\t\t\t.moff-loader_box {\n\t\t\t\tposition: absolute;\n\t\t\t\twidth: 100%;\n\t\t\t\theight: 100%;\n\t\t\t\tborder-radius: 50%;\n\t\t\t\tborder: 1px solid transparent;\n\t\t\t\tborder-top-color: #3498db;\n\t\t\t\t-webkit-animation: spin 2s linear infinite;\n\t\t\t\tanimation: spin 2s linear infinite;\n\t\t\t}\n\t\t\t.moff-loader_box:before {\n\t\t\t\tcontent: "";\n\t\t\t\tposition: absolute;\n\t\t\t\ttop: 2px;\n\t\t\t\tleft: 2px;\n\t\t\t\tright: 2px;\n\t\t\t\tbottom: 2px;\n\t\t\t\tborder-radius: 50%;\n\t\t\t\tborder: 1px solid transparent;\n\t\t\t\tborder-top-color: #e74c3c;\n\t\t\t\t-webkit-animation: spin 3s linear infinite;\n\t\t\t\tanimation: spin 3s linear infinite;\n\t\t\t}\n\t\t\t.moff-loader_box:after {\n\t\t\t\tcontent: "";\n\t\t\t\tposition: absolute;\n\t\t\t\ttop: 5px;\n\t\t\t\tleft: 5px;\n\t\t\t\tright: 5px;\n\t\t\t\tbottom: 5px;\n\t\t\t\tborder-radius: 50%;\n\t\t\t\tborder: 1px solid transparent;\n\t\t\t\tborder-top-color: #f9c922;\n\t\t\t\t-webkit-animation: spin 1.5s linear infinite;\n\t\t\t\tanimation: spin 1.5s linear infinite;\n\t\t\t}\n\t\t\t.moff-hidden {\n\t\t\t\tdisplay: none;\n\t\t\t}\n\t\t\t@-webkit-keyframes spin {\n\t\t\t\t0% {\n\t\t\t\t\t-webkit-transform: rotate(0deg);\n\t\t\t\t\t-ms-transform: rotate(0deg);\n\t\t\t\t\ttransform: rotate(0deg);\n\t\t\t\t}\n\t\t\t\t100% {\n\t\t\t\t\t-webkit-transform: rotate(360deg);\n\t\t\t\t\t-ms-transform: rotate(360deg);\n\t\t\t\t\ttransform: rotate(360deg);\n\t\t\t\t}\n\t\t\t}\n\t\t\t@keyframes spin {\n\t\t\t\t0% {\n\t\t\t\t\t-webkit-transform: rotate(0deg);\n\t\t\t\t\t-ms-transform: rotate(0deg);\n\t\t\t\t\ttransform: rotate(0deg);\n\t\t\t\t}\n\t\t\t\t100% {\n\t\t\t\t\t-webkit-transform: rotate(360deg);\n\t\t\t\t\t-ms-transform: rotate(360deg);\n\t\t\t\t\ttransform: rotate(360deg);\n\t\t\t\t}\n\t\t\t}\n\t\t')),document.querySelector("head").appendChild(t)}function n(){M=A.createElement("div"),C=A.createElement("div"),M.setAttribute("class","moff-loader"),C.setAttribute("class","moff-loader_box"),A.body.appendChild(M),M.appendChild(C)}function o(t){(_&&t.matches||l())&&(c(),S.runCallbacks(T,S,[S.getMode()]),S.handleDataEvents())}function a(t){var e=t.getAttribute("data-load-screen"),n=e.split(" ");return!e||n.length&&n.indexOf(S.getMode())!==-1}function i(){var t=w();S.each(t,function(t,e){z[t]=e})}function s(){if(z.breakpoints&&_){var t=z.breakpoints;E=E.replace("%d",t.sm),j=j.replace("%d",t.md),L=L.replace("%d",t.lg)}}function l(){return x!==S.getMode()}function c(){x=S.getMode()}function u(){if($.length)for(var t=0,e=$.slice(0),n=e.length;t<n;t++){var o=e[t];S.inViewport(o)&&($.splice(t,1),p(o))}}function d(t,e){S.ajax({url:t,type:"GET",crossDomain:f(t),success:function(t){"function"==typeof e&&e(t)}})}function f(t){var e=document.createElement("a");return e.href=t,A.domain!==e.hostname}function p(t){var e=t.title||"",n=t.href||t.getAttribute("data-load-url"),o=t.getAttribute("data-load-target"),r=t.getAttribute("data-push-url"),a=t.getAttribute("data-load-module");if(n){if(S.showPreloader(),n=m(t,n),t.removeAttribute("data-load-event"),S.runCallbacks(D,t),S.detect.history&&null!==r){var i=Date.now();P.history.pushState({elemId:i,url:n},e,n),F[i]=t}h(t,n,o,function(){var e=document.querySelector(o);a?S.amd.include(a,function(){S.hidePreloader(),S.removeClass(e,"moff-hidden"),S.runCallbacks(I,t)}):(S.hidePreloader(),S.removeClass(e,"moff-hidden"),S.runCallbacks(I,t))})}else a&&(S.showPreloader(),S.amd.include(a,function(){S.hidePreloader()}))}function m(t,e){return e.replace(/\{\{(.*?)\}\}/g,function(){var e=arguments[1];return e.indexOf("-")!==-1?t.getAttribute(e):t[e]})}function h(t,e,n,o){function r(e){var r=t.getAttribute("data-page-title"),a=A.querySelector(n);null!==a&&(S.addClass(a,"moff-hidden"),a.innerHTML=e),r&&(A.title=r),o(),S.handleDataEvents()}e=v(e),q[e]?r(q[e]):d(e,r)}function g(t){var e=t.state;if(e){var n=F[e.elemId];if(n){if(!a(n))return;var o=e.url,r=n.getAttribute("data-load-target");S.runCallbacks(D,n),h(n,o,r,function(){S.runCallbacks(I,n)})}}}function v(t){var e=t.indexOf("#");return e===-1?t:t.substr(0,e)}function y(){var t="data-load-screen";S.each(A.querySelectorAll("["+t+"]"),function(){var e=this;a(e)&&(e.removeAttribute(t),e.handled=!0,p(e))})}function b(t){var e=Object.prototype.toString.call(t);return r(/^\[object (HTMLCollection|NodeList)\]$/.test(e))&&t.hasOwnProperty("length")&&(0===t.length||"object"===r(t[0])&&t[0].nodeType>0)}function w(){return window.moffConfig||{}}function k(){W=!0,e(),n(),t(),S.runCallbacks(N,this)}var x,P=window,S=this,A=P.document,M=null,C=null,_=!(!P.matchMedia||!P.matchMedia("screen").addListener),O=_&&P.matchMedia,E="(min-width: %dpx)",j=E,L=E,T=[],N=[],W=!1,D=[],I=[],q={},$=[],z={breakpoints:{sm:768,md:992,lg:1200},loadOnHover:!0,cacheLiveTime:2e3},B=["[data-load-target]","[data-load-module]","[data-load-event]","[data-load-url]","[data-load-screen]","[data-push-url]","[data-page-title]"],F={};this.showPreloader=function(){var t=arguments.length<=0||void 0===arguments[0]||arguments[0];this.hidePreloader(),this.addClass(M,"__visible"),t&&this.addClass(M,"__default"),S.detect.supportCSS3("transition")||this.addClass(M,"__ie9-preloader")},this.hidePreloader=function(){this.removeClass(M,"__visible __default __ie9-preloader"),M.removeAttribute("style")},this.positionPreloader=function(t,e){if(this.showPreloader(!1),"number"==typeof t&&"number"==typeof e){var n="";if(S.detect.supportCSS3("transition")){var o=t+"px, "+e+"px";n="-webkit-transform: translate("+o+");\n\t\t\t\t-moz-transform: translate("+o+");\n\t\t\t\t-o-transform: translate("+o+");\n\t\t\t\ttransform: translate("+o+");"}else n="left: "+t+"px; top: "+e+"px",this.addClass(M,"__ie9-preloader");M.setAttribute("style",n)}},this.addClass=function(t,e){if(t){var n,o,e=e.split(/\s/),r=e.length,a=0;for(o=" "+t.className+" ";a<r;a++)n=e[a],o.indexOf(" "+n+" ")<0&&(o+=n+" ");t.className=o.trim()}},this.removeClass=function(t,e){if(t){for(var e=e?e.split(/\s/):[],n=e.length,o=t.className||"",r=0;r<n;r++){var a=new RegExp("(^| )"+e[r]+"( |$)");o=o.replace(a," ")}return t.className!=o||n||(o=""),t.className=o.trim(),t}},this.handleDataEvents=function(){y(),S.each(A.querySelectorAll(B.join(", ")),function(){var t=this,e=this;if(!e.handled){var n=(e.getAttribute("data-load-event")||"click").toLowerCase();Moff.detect.isMobile&&"click"===n&&(n="touchstart"),"dom"===n?(S.$(function(){p(e)}),n="click"):"scroll"===n?S.inViewport(e)?p(e):$.push(e):"click"!==n&&"touchstart"!==n||z.loadOnHover&&!S.detect.isMobile&&e.addEventListener("mouseenter",function(){e=t;var n=e.href||e.getAttribute("data-load-url");n&&(n=v(n),n&&(n=m(e,n),d(n,function(t){q[n]=t,setTimeout(function(){delete q[n]},z.cacheLiveTime)})))},!1),e.addEventListener(n,function(t){p(this),t.preventDefault()},!1),e.handled=!0}})},this.inViewport=function(t){for(var e=t.offsetTop,n=t.offsetLeft,o=t.offsetWidth,r=t.offsetHeight;t.offsetParent;)t=t.offsetParent,e+=t.offsetTop,n+=t.offsetLeft;return e<P.pageYOffset+P.innerHeight&&n<P.pageXOffset+P.innerWidth&&e+r>P.pageYOffset&&n+o>P.pageXOffset},this.ajax=function(t){var e,n=[];t.type=t.type.toUpperCase(),"object"===r(t.data)&&(e=t.data,this.each(e,function(t,e){n.push(encodeURIComponent(t)+"="+encodeURIComponent(e))}),t.data=n.join("&")),"GET"===t.type&&t.data&&(t.url+=(t.url.indexOf("?")!==-1?"&":"?")+t.data.replace(/%20/g,"+"),t.data=null);var o=new XMLHttpRequest;o.open(t.type,t.url,!0),o.setRequestHeader("Content-Type",t.contentType||"application/x-www-form-urlencoded; charset=UTF-8"),t.crossDomain||o.setRequestHeader("X-Requested-With","XMLHttpRequest"),o.onload=function(){var e=this.status;e>=200&&e<300||304===e?t.success(this.responseText,this):t.error(this)},o.send(t.data)},this.runCallbacks=function(t,e,n){Array.isArray(t)||(t=[]),S.each(t,function(t,o){"function"==typeof o&&o.apply(e,n)})},this.onViewChange=function(t){return"function"!=typeof t?void this.debug("Moff.onViewChange callback must be a function"):void T.push(t)},this.beforeLoad=function(t){return"function"!=typeof t?void this.debug("Moff.beforeLoad callback must be a function"):void D.push(t)},this.afterLoad=function(t){return"function"!=typeof t?void this.debug("Moff.afterLoad callback must be a function"):void I.push(t)},this.getMode=function(){var t="xs";if(_)O(L).matches?t="lg":O(j).matches?t="md":O(E).matches&&(t="sm");else{var e=A.documentElement.clientWidth,n=z.breakpoints;e>=n.lg?t="lg":e>=n.md?t="md":e>=n.sm&&(t="sm")}return t},this.loadAssets=function(t,e){function n(){var o=t.js[s];o&&S.loadJS(o,function(){s++,a++,a===i?u&&e():n()},r)}function o(){a++,a===i&&u&&e()}var r=arguments.length<=2||void 0===arguments[2]?{}:arguments[2],a=0,i=0,s=0,l=Array.isArray(t.css),c=Array.isArray(t.js),u="function"==typeof e;return c&&(i+=t.js.length),l&&(i+=t.css.length),i?(n(),void(l&&t.css.length&&this.each(t.css,function(t,e){S.loadCSS(e,o,r)}))):(Moff.debug("You must pass minimum one assets or css file"),void(u&&e()))},this.loadJS=function(t,e){function n(){var n=A.createElement("script");n.setAttribute("src",t),i&&n.addEventListener("load",e,!1),A.querySelector("body").appendChild(n)}var o=arguments.length<=2||void 0===arguments[2]?{}:arguments[2];if("string"!=typeof t)return void this.debug("Moff.loadJS source must be a string");"object"===("undefined"==typeof e?"undefined":r(e))&&(o=e,e=void 0);var a=A.querySelector('script[src="'+t+'"]'),i="function"==typeof e;o.reload?(a&&a.parentNode.removeChild(a),n()):a?i&&e():n()},this.loadCSS=function(t,e){function n(){var n=A.createElement("link");i&&n.addEventListener("load",e,!1),n.setAttribute("href",t),n.setAttribute("rel","stylesheet"),A.querySelector("head").appendChild(n),n.onreadystatechange=function(){var t=n.readyState;"loaded"!==t&&"complete"!==t||(n.onreadystatechange=null,i&&e())}}var o=arguments.length<=2||void 0===arguments[2]?{}:arguments[2];if("string"!=typeof t)return void this.debug("Moff.loadCSS source must be a string");"object"===("undefined"==typeof e?"undefined":r(e))&&(o=e,e=void 0);var a=A.querySelector('link[href="'+t+'"]'),i="function"==typeof e;o.reload?(a&&a.parentNode.removeChild(a),n()):a?i&&e():n()},this.settings=function(t,e){return"undefined"==typeof e?z[t]:void(z[t]=e)},this.each=function(t,e){var n,o=0,r=t.length,a=Array.isArray(t)||b(t);if(a)for(;o<r&&(n=e.call(t[o],o,t[o]),n!==!1);o++);else for(o in t)if(t.hasOwnProperty(o)&&(n=e.call(t[o],o,t[o]),n===!1))break},this.$=function(t){return"function"!=typeof t?void this.debug("Moff.$ argument must be a function"):void(W?t():N.push(t))},this.debug=function(t){window.console&&window.console.debug&&window.console.debug("Moff DEBUG: "+t)},this.error=function(t){throw t},this.version="1.11.1",i(),s(),c(),A.addEventListener("DOMContentLoaded",k,!1),this._testonly={_cache:q,_loader:function(){return M}}}Object.defineProperty(n,"__esModule",{value:!0});var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t};n.default=o},{}],3:[function(t,e,n){"use strict";function o(){function t(){a.touch=!!("ontouchstart"in r||r.DocumentTouch&&s instanceof r.DocumentTouch),a.applicationCache=!!r.applicationCache,a.canvas=function(){var t=s.createElement("canvas");return!(!t.getContext||!t.getContext("2d"))}(),a.canvasText=!(!a.canvas||"function"!=typeof s.createElement("canvas").getContext("2d").fillText),a.dragAndDrop=function(){var t=s.createElement("div");return"draggable"in t||"ondragstart"in t&&"ondrop"in t}(),a.hashChange=!!("onhashchange"in r&&("undefined"==typeof s.documentMode||s.documentMode>7)),a.history=!(!r.history||!history.pushState),a.postMessage=!!r.postMessage,a.webSockets=!!("WebSocket"in r||"MozWebSocket"in r),a.webWorkers=!!r.Worker,a.audio=function(){var t=s.createElement("audio"),e=!1;try{t.canPlayType&&(e={},e.ogg=t.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),e.mp3=t.canPlayType("audio/mpeg;").replace(/^no$/,""),e.wav=t.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),e.m4a=(t.canPlayType("audio/x-m4a;")||t.canPlayType("audio/aac;")).replace(/^no$/,""))}catch(t){}return e}(),a.video=function(){var t=s.createElement("video"),e=!1;try{t.canPlayType&&(e={},e.ogg=t.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),e.h264=t.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),e.webm=t.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,""))}catch(t){}return e}(),a.indexedDB=function(){var t=["indexedDB","webkitIndexedDB","mozIndexedDB","OIndexedDB","msIndexedDB"];for(var e in t)if(t.hasOwnProperty(e)){var n=r[t[e]];if(void 0!==n)return n===!1?t[e]:"function"==typeof n?n.bind(r):n}return!1}(),a.localStorage=function(){try{return localStorage.setItem(a.mode,a.mode),localStorage.removeItem(a.mode),!0}catch(t){return!1}}(),a.sessionStorage=function(){try{return sessionStorage.setItem(a.mode,a.mode),sessionStorage.removeItem(a.mode),!0}catch(t){return!1}}()}function e(){var t=/(edge)[\/]([0-9\.]+)/.exec(i)||/(chrome)[ \/]([\w.]+)/.exec(i)||/(webkit)[ \/]([\w.]+)/.exec(i)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(i)||/(msie) ([\w.]+)/.exec(i)||i.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(i)||[];t[1]&&(a.browser[t[1]]=!0),t[2]&&(a.browser.version=t[2]),a.browser.chrome&&(a.browser.webkit=!0)}function n(){var t=a.OS,e=/(ipad|iphone|ipod)/g.test(i),n=i.indexOf("mac")>-1,o=i.indexOf("win")>-1,r=i.indexOf("android")>-1,s=i.indexOf("windows phone")>-1;e?t.iOS=e:n?t.macOS=n:o?t.windows=o:r?t.android=r:s&&(t.windowsPhone=s)}function o(){a.isMobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(i)}var r=window,a=this,i=window.navigator.userAgent.toLowerCase(),s=document;this.browser={},this.OS={},this.supportCSS3=function(t){for(var e=t.charAt(0).toUpperCase()+t.slice(1),n=(t+" "+"Webkit Moz O ms".split(" ").join(e+" ")+e).split(" "),o=n.length,r=0;r<o;r++)if(t=n[r],t.indexOf("-")===-1&&void 0!==document.createElement("div").style[t])return!0;return!1},t(),e(),n(),o()}Object.defineProperty(n,"__esModule",{value:!0}),n.default=o},{}],4:[function(t,e,n){"use strict";function o(){var t={};this.add=function(e){"undefined"==typeof t[e]&&(t[e]=[])},this.on=function(e,n){this.add(e),"function"==typeof n&&t[e].push(n)},this.once=function(t,e){e._onceExecuted=!0,this.on(t,e)},this.trigger=function(e){var n=this,o=Array.prototype.slice.call(arguments,1),r=[];"undefined"!=typeof t[e]&&(Moff.runCallbacks(t[e],this,o),Moff.each(t[e],function(t,e){e._onceExecuted&&r.push(t)}),Moff.each(r,function(o,r){n.off(e,t[e][r])}))},this.get=function(e){var n=t[e];if(Array.isArray(n)&&n.length)return n},this.off=function(e,n){return n?void Moff.each(t[e],function(o,r){if(r===n)return t[e].splice(o,1),!1}):void(t[e]=[])},this._testonly={_eventStore:t}}Object.defineProperty(n,"__esModule",{value:!0}),n.default=o},{}],5:[function(t,e,n){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}var r=t("../../amd/src/amd.e6"),a=o(r),i=t("../../core/src/core.e6"),s=o(i),l=t("../../event/src/event.e6"),c=o(l),u=t("../../detect/src/detect.e6"),d=o(u),f=t("../../modules/src/base.es6"),p=o(f),m=t("../../modules/src/api.e6"),h=o(m);window.Moff=new s.default,window.Moff.amd=new a.default,window.Moff.event=new c.default,window.Moff.Module=new p.default,window.Moff.detect=new d.default,window.Moff.modules=new h.default},{"../../amd/src/amd.e6":1,"../../core/src/core.e6":2,"../../detect/src/detect.e6":3,"../../event/src/event.e6":4,"../../modules/src/api.e6":6,"../../modules/src/base.es6":7}],6:[function(t,e,n){"use strict";function o(){function t(t){Array.isArray(t)&&Moff.each(t,function(t,e){Moff.event.add(e)})}var e={},n={};this.create=function(t,e,o){"undefined"==typeof o&&(o=e,e=void 0),o.prototype=Moff.Module,o.prototype.constructor=o,"undefined"==typeof n[t]&&(n[t]={constructor:o,depend:e})},this.initClass=function(o,r){function a(){var n=new i.constructor,a=e[o];Array.isArray(a)?a.push(n):"undefined"!=typeof a?e[o]=[a,n]:e[o]=n,"function"==typeof n.beforeInit&&n.beforeInit(),r&&Moff.each(r,function(t,e){n[t]=e}),n.moduleName=o,Array.isArray(n.events)&&n.events.length&&t(n.events),n.setScope(),"function"==typeof n.init&&n.init(),"function"==typeof n.afterInit&&n.afterInit()}var i=n[o];if(!i)return void Moff.debug(o+" Class is not registered");try{i.depend?Moff.loadAssets(i.depend,a):a()}catch(t){Moff.error(t)}},this.get=function(t){return e.hasOwnProperty(t)&&e[t]||void 0},this.getAll=function(){return e},this.getBy=function(t,e){var n=this.getAll(),o=[];return"class"===t&&(t="moduleName"),Moff.each(n,function(n,r){Array.isArray(r)?Moff.each(r,function(n,r){r[t]&&r[t]===e&&o.push(r)}):r[t]&&r[t]===e&&o.push(r)}),o},this.remove=function(t){var n=0,o="string"!=typeof t,r=o?t.moduleName:t,a=e[r];if(Array.isArray(a)){for(var i=a.length;n<i;n++){var s=a[n];(o&&s===t||!o&&s.moduleName===r)&&(a.splice(n,1),i=a.length,--n)}1===a.length?e[r]=e[r][0]:e[r].length||delete e[r]}else delete e[r]},this._testonly={_moduleClassStorage:n,_moduleObjectStorage:e}}Object.defineProperty(n,"__esModule",{value:!0}),n.default=o},{}],7:[function(t,e,n){"use strict";function o(){this.scopeSelector=null,this.scope=null,this.events=[],this.beforeInit=function(){},this.init=function(){},this.afterInit=function(){},this.setScope=function(){this.scopeSelector&&(this.scope=document.querySelector(this.scopeSelector))},this.find=function(t){return this.scope.querySelectorAll(t)},this.reopen=function(t){var e=this;return"object"!==("undefined"==typeof t?"undefined":r(t))?void Moff.debug("Reopen method argument must be an object"):void Moff.each(t,function(t,n){e[t]=n})}}Object.defineProperty(n,"__esModule",{value:!0});var r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol?"symbol":typeof t};n.default=o},{}]},{},[5]);