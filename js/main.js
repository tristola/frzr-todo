"use strict";!function(){function t(){this.listeners={}}function e(t,e){var n=document.createElement(t);if("undefined"!=typeof e)for(var o in e)n.setAttribute(o,e[o]);return n}function n(t,e){var n=document.createElementNS("http://www.w3.org/2000/svg",t);if("undefined"!=typeof e)for(var o in e)n.setAttribute(e,e[o]);return n}function o(t){x.length||(A.trigger("render"),C(i)),x.push(t)}function i(){for(var t=x.splice(0,x.length),e=0,n=t.length;n>e;e++)t[e]();return 0===x.length?void A.trigger("rendered"):void i()}function r(t,e){for(var n=t.length,o=0;n>o;o++)e(t[o],o,n)}function s(t,e){for(var n,o=[],i=t.length,r=0;i>r;r++)n=t[r],e(n,r,i)&&o.push(n);return o}function u(t){if(!t||!t.length)return t;for(var e,n,o=t.length-1;o>0;o--)e=Math.random()*o|0,n=t[o],t[o]=t[e],t[e]=n;return t}function a(t,e){for(var n=t.length,o=new Array(n),i=0;n>i;i++)o[i]=e(t[i],i,n);return o}function l(t,e){t["super"]=e,t.prototype=Object.create(e.prototype,{constructor:{configurable:!0,value:t,writable:!0}})}function f(t){var o=this instanceof f;if(!o)return new f(t);var i=t&&t.svg||!1;f["super"].call(this),this.$el=i?n(t.el||"svg"):e(t.el||"div"),this.attrs={},this["class"]={},this.data={},this.style={},t&&this.setOptions(t,!0),this.trigger("init",this),t.data&&this.set(t.data),this.trigger("inited",this)}function c(){this.trigger("parentmount")}function d(){this.trigger("parentmounted")}function h(){this.$el.focus()}function p(t,e){var n=this instanceof p;return n?(this.view=new f(e),this.views=[],this.lookup={},void(this.ChildView=t||f)):new p(t,e)}function v(t,e){A.on("render",function(){k=Date.now()}),A.on("rendered",function(){e.textContent="Rendering took "+(Date.now()-k)+" ms"})}function g(t,e){var n=new f({el:"h1",textContent:"Todo"}),o=new f({el:"p",textContent:"(items stay between refreshes)",style:{fontStyle:"italic"}});n.mount(e),o.mount(e)}function m(t,e){function n(e){e.preventDefault();var n={id:Date.now(),title:l.$el.value||S[0],done:!1};t.trigger("todo-create",n),l.$el.value="",u(S),l.setAttributes({placeholder:S[0]}),l.$el.focus()}function o(){d.$el.blur(),t.trigger("todo-clear")}function i(){h.$el.blur(),t.trigger("todo-clearall")}var r=new f({el:"div","class":"todo-create"}),s=new f({el:"form",listen:{submit:n}}),a=new f({el:"h2",textContent:"What to do?"}),l=new f({el:"input",attrs:{autofocus:!0,placeholder:S[0]}}),c=new f({el:"button",textContent:"Insert"}),d=new f({el:"button",textContent:"Clear done",listen:{click:o}}),h=new f({el:"button",textContent:"Clear all",listen:{click:i}});s.mount(e),r.mount(s.$el),a.mount(s.$el),l.mount(s.$el),c.mount(s.$el),d.mount(e),h.mount(e)}function y(){var t=this;t.checkbox=new f({el:"input",attrs:{type:"checkbox"},parent:t}),t.title=new f({el:"span"}),t.checkbox.mount(t.$el),t.title.mount(t.$el)}function w(){this.data.done=!this.data.done,this.parent.root.trigger("todo-update",this.data)}function $(t){this.title.textContent(t.title),this.checkbox.setAttributes({checked:t.done})}function b(t,e){var n=new p(B,{el:"ul","class":"todoitems",root:t});n.reset(O,"id"),n.mount(e),t.on("todo-create",function(t){O.push(t),n.reset(O,"id"),I.setItem("todoitems",JSON.stringify(O))}),t.on("todo-update",function(t){O=a(n.views,function(t){return t.data}),I.setItem("todoitems",JSON.stringify(O)),n.reset(O,"id")}),t.on("todo-clear",function(){var t=s(n.views,function(t){return!t.data.done});O=a(t,function(t){return t.data}),n.reset(O,"id"),I.setItem("todoitems",JSON.stringify(O))}),t.on("todo-clearall",function(){O=[],n.reset(O,"id"),I.setItem("todoitems",JSON.stringify([]))})}t.prototype.on=function(t,e,n,o){this.listeners[t]||(this.listeners[t]=[]),this.listeners[t].push({once:o||!1,cb:e,ctx:n})},t.prototype.one=function(t,e,n){this.on(t,e,n,!0)},t.prototype.off=function(t,e,n){if("undefined"==typeof t)return void(this.listeners={});if("undefined"==typeof e)return void(this.listeners[t]=[]);var o=this.listeners[t];if(o)for(var i=0,r=o.length;r>i;i++)n?o[i].ctx===n&&(o.splice(i--,1),r--):o[i].cb===e&&(o.splice(i--,1),r--)},t.prototype.trigger=function(t){for(var e=this.listeners[t],n=arguments.length-1,o=new Array(n),i=0;n>i;i++)o[i]=arguments[i+1];if(e){var r;for(i=0;i<e.length;i++)r=e[i],r.cb.apply(r.ctx||this,o),r.once&&(e.splice(i--,1),n--)}};var x=[],C=window.requestAnimationFrame||function(t){setTimeout(t,1e3/60)},A=new t;l(f,t),f.extend=function(t){return function(e){if(!e)return new f(t);var n={};for(var o in t)n[o]=t[o];for(o in e)n[o]=e[o];return new f(n)}},f.prototype.mount=function(t){var e=this;e.parent&&(e.parent.off("mount",c,e),e.parent.off("mounted",d,e)),t instanceof f?(e.parent=t,e.$root=t.$el):e.$root=t,o(function(){e.parent&&(e.parent.on("mount",c,e),e.parent.on("mounted",d,e)),e.trigger("mount"),e.$root.appendChild(e.$el),e.trigger("mounted")})},f.prototype.unmount=function(){var t=this,e=t.$el;t.$root&&(t.parent&&(t.parent.off("mount",c,t),t.parent.off("mounted",d,t)),o(function(){t.trigger("unmount"),t.$root.removeChild(e),t.$root=null,t.parent=null,t.trigger("unmounted")}))},f.prototype.destroy=function(){var t=this;t.trigger("destroy"),t.off(),t.unmount(),t.trigger("destroyed")},f.prototype.mountBefore=function(t,e){var n=this.$el;this.$root=t,o(function(){t.insertBefore(n,e)})},f.prototype.set=function(t){var e=this;o(function(){e.trigger("render")}),e.trigger("update",t);for(var n in t)e.data[n]=t[n];e.trigger("updated"),o(function(){e.trigger("rendered")})},f.prototype.setOptions=function(t,e){if(t){var n;for(n in t)if("attrs"===n)this.setAttributes(t.attrs);else if("attr"===n)this.setAttributes(t.attr);else if("href"===n)this.setAttributes({href:t.href});else if("id"===n)this.setAttributes({id:t.id});else if("data"===n)e||this.set(t.data);else if("style"===n){if("string"==typeof t.style){this.setAttributes({style:t.style});continue}this.setStyle(t.style)}else if("class"===n){if("string"==typeof t["class"]){this.setAttributes({"class":t["class"]});continue}this.setClass(t["class"])}else"textContent"===n?this.textContent(t.textContent):"listen"===n?this.addListeners(t.listen):"init"===n?this.on("init",t.init):"update"===n?this.on("update",t.update):"parent"===n?this.mount(t.parent):"$root"===n?this.mount(t.$root):this[n]=t[n]}},f.prototype.textContent=function(t){var e=this,n=e.$el;t!==e.text&&(e.text=t,o(function(){t===e.text&&(n.textContent=t)}))},f.prototype.addListeners=function(t){function e(t,e){i.on(t,e),r.addEventListener(t,function(e){i.trigger(t,e)})}var n,o,i=this,r=i.$el;for(n in t)o=t[n],e(n,o)},f.prototype.setClass=function(t){function e(t,e){o(function(){r["class"][t]===e&&(e?s.classList.add(t):s.classList.remove(t))})}var n,i,r=this,s=r.$el;for(n in t)i=t[n],r["class"][n]!==i&&(r["class"][n]=i,e(n,i))},f.prototype.setStyle=function(t){function e(e,n){o(function(){r.style[e]===t[e]&&(s.style[e]=n)})}var n,i,r=this,s=r.$el;for(n in t)i=t[n],r.style[n]!==i&&(r.style[n]=i,e(n,i))},f.prototype.setAttribute=function(t,e){var n={};n[t]=e,this.setAttributes(n)},f.prototype.setAttributes=function(t){function e(t,e){o(function(){if(e===r.attrs[t]){if(e===!1||null==e)return void s.removeAttribute(t);s.setAttribute(t,e),"autofocus"===t&&(e?(s.focus(),r.on("mounted",h),r.on("parentmounted",h,r)):(r.off("mounted",h),r.off("parentmounted",h,r)))}})}var n,i,r=this,s=r.$el,u=r.attrs;for(i in t)n=t[i],n!==u[i]&&(r.attrs[i]=n,n===r.attrs[i]&&e(i,n))},l(p,t),p.prototype.mount=function(t){this.view.mount(t)},p.prototype.mountBefore=function(t,e){this.view.mountBefore(t,e)},p.prototype.unmount=function(){this.view.unmount()},p.prototype.reset=function(t,e){var n=this,o=n.ChildView,i=new Array(t.length),s={},u=n.lookup;r(t,function(t,r){var a=e?t[e]:r,l=u[a];l||(l=new o(null,{parent:n.view})),s[a]=l,l.set(t),i[r]=l});for(var a in u)s[a]||u[a].destroy();n.views=i,n.lookup=s,n.reorder()},p.prototype.reorder=function(){var t=this,e=t.view.$el;o(function(){var n=e.firstChild;r(t.views,function(t,o){return n===t.$el?void(n=n.nextSibling):void(n?(t.$root=e,e.insertBefore(t.$el,n)):(t.$root=e,e.appendChild(t.$el)))});for(var o;n;)o=n.nextSibling,e.removeChild(n),n=o})};var k,S=["Buy milk","Feed cat","Go fishing","Pay rent","Watch a movie","Learn to cook"];u(S);var B=f.extend({el:"li","class":"todoitem",listen:{click:w},init:y,update:$}),I=window.localStorage,O=JSON.parse(I.getItem("todoitems"))||[],L=document.getElementById("rendertime"),N=document.getElementById("container"),E=new t;v(E,L),g(E,N),m(E,N),b(E,N)}();