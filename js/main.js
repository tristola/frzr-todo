"use strict";!function(){function t(){this.listeners={}}function e(t,e){var n=document.createElement(t);if("undefined"!=typeof e)for(var o in e)n.setAttribute(o,e[o]);return n}function n(t,e){var n=document.createElementNS("http://www.w3.org/2000/svg",t);if("undefined"!=typeof e)for(var o in e)n.setAttribute(e,e[o]);return n}function o(t){w.length||(b.trigger("render"),$(i)),w.push(t)}function i(){for(var t=w.splice(0,w.length),e=0,n=t.length;n>e;e++)t[e]();return 0===w.length?void b.trigger("rendered"):void i()}function r(t,e){for(var n=t.length,o=0;n>o;o++)e(t[o],o,n)}function s(t,e){for(var n,o=[],i=t.length,r=0;i>r;r++)n=t[r],e(n,r,i)&&o.push(n);return o}function u(t){if(!t||!t.length)return t;for(var e,n,o=t.length-1;o>0;o--)e=Math.random()*o|0,n=t[o],t[o]=t[e],t[e]=n;return t}function a(t,e){for(var n=t.length,o=new Array(n),i=0;n>i;i++)o[i]=e(t[i],i,n);return o}function l(t,e){t["super"]=e,t.prototype=Object.create(e.prototype,{constructor:{configurable:!0,value:t,writable:!0}})}function c(t,o,i){var r=o&&o.svg||!1;c["super"].call(this),this.$el=r?n(t):e(t),this.attrs={},this["class"]={},this.data={},this.style={},o&&this.setOptions(o),this.trigger("init",this),i&&this.set(i),this.trigger("inited",this)}function f(t,e,n){this.view=new c(e,n),this.views=[],this.lookup={},this.ChildView=t||c}function d(t,e){b.on("render",function(){x=Date.now()}),b.on("rendered",function(){e.textContent="Rendering took "+(Date.now()-x)+" ms"})}function h(t,e){var n=new c("h1",{textContent:"Todo"}),o=new c("p",{textContent:"(items stay between refreshes)",style:{fontStyle:"italic"}});n.mount(e),o.mount(e)}function p(t,e){function n(e){e.preventDefault(),t.trigger("todo-create",{id:Date.now(),title:l.$el.value,done:!1}),l.$el.value="",u(C),l.setAttributes({placeholder:C[0]}),l.$el.focus()}function o(){d.$el.blur(),t.trigger("todo-clear")}function i(){h.$el.blur(),t.trigger("todo-clearall")}var r=new c("div",{"class":"todo-create"}),s=new c("form",{listen:{submit:n}}),a=new c("h2",{textContent:"What to do?"}),l=new c("input",{attrs:{autofocus:!0,placeholder:C[0]}}),f=new c("button",{textContent:"Insert"}),d=new c("button",{textContent:"Clear done",listen:{click:o}}),h=new c("button",{textContent:"Clear all",listen:{click:i}});s.mount(e),r.mount(s.$el),a.mount(s.$el),l.mount(s.$el),f.mount(s.$el),d.mount(e),h.mount(e)}function g(){var t=this;this.checkbox=new c("input",{attrs:{type:"checkbox"},parent:t}),this.title=new c("span"),this.checkbox.mount(this.$el),this.title.mount(this.$el)}function v(){this.data.done=!this.data.done,this.parent.root.trigger("todo-update",this.data)}function m(t){this.title.textContent(t.title),this.checkbox.setAttributes({checked:t.done})}function y(t,e){var n=new f(k,"ul",{"class":"todoitems",root:t});n.reset(S,"id"),n.mount(e),t.on("todo-create",function(t){S.push(t),n.reset(S,"id"),A.setItem("todoitems",JSON.stringify(S))}),t.on("todo-update",function(t){S=a(n.views,function(t){return t.data}),A.setItem("todoitems",JSON.stringify(S)),n.reset(S,"id")}),t.on("todo-clear",function(){var t=s(n.views,function(t){return!t.data.done});S=a(t,function(t){return t.data}),n.reset(S,"id"),A.setItem("todoitems",JSON.stringify(S))}),t.on("todo-clearall",function(){S=[],n.reset(S,"id"),A.setItem("todoitems",JSON.stringify([]))})}t.prototype.on=function(t,e,n,o){this.listeners[t]||(this.listeners[t]=[]),this.listeners[t].push({once:o||!1,cb:e,ctx:n||this})},t.prototype.one=function(t,e,n){this.on(t,e,n,!0)},t.prototype.off=function(t,e){if("undefined"==typeof t)return void(this.listeners={});if("undefined"==typeof e)return void(this.listeners[t]=[]);var n=this.listeners[t];if(n)for(var o=0,i=n.length;i>o;o++)n[o].cb===e&&(n.splice(o--,1),i--)},t.prototype.trigger=function(t){for(var e=this.listeners[t],n=arguments.length-1,o=new Array(n),i=0;n>i;i++)o[i]=arguments[i+1];if(e){var r;for(i=0;i<e.length;i++)r=e[i],r.cb.apply(r.ctx||this,o),r.once&&(e.splice(i--,1),n--)}};var w=[],$=window.requestAnimationFrame||function(t){setTimeout(t,1e3/60)},b=new t;l(c,t),c.extend=function(t,e){return function(n,o){if(!o)return new c(n||t,e);var i={};for(var r in e)i[r]=e[r];for(r in o)i[r]=o[r];return new c(n||t,i)}},c.prototype.mount=function(t){var e=this,n=e.$el;e.$root=t,o(function(){e.trigger("mount"),t.appendChild(n),e.trigger("mounted")})},c.prototype.unmount=function(){var t=this,e=t.$el;t.$root&&o(function(){t.trigger("unmount"),t.$root.removeChild(e),t.$root=null,t.trigger("unmounted")})},c.prototype.destroy=function(){var t=this;t.trigger("destroy"),t.off(),t.unmount(),t.trigger("destroyed")},c.prototype.mountBefore=function(t,e){var n=this.$el;this.$root=t,o(function(){t.insertBefore(n,e)})},c.prototype.set=function(t){var e=this;o(function(){e.trigger("render")}),e.trigger("update",t);for(var n in t)e.data[n]=t[n];e.trigger("updated"),o(function(){e.trigger("rendered")})},c.prototype.setOptions=function(t){if(t){var e;for(e in t)if("attrs"===e)this.setAttributes(t.attrs);else if("style"===e){if("string"==typeof t.style){this.setAttributes({style:t.style});continue}this.setStyle(t.style)}else if("class"===e){if("string"==typeof t["class"]){this.setAttributes({"class":t["class"]});continue}this.setClass(t["class"])}else"textContent"===e?this.textContent(t.textContent):"listen"===e?this.addListeners(t.listen):"init"===e?this.on("init",t.init):"update"===e?this.on("update",t.update):this[e]=t[e]}},c.prototype.textContent=function(t){var e=this,n=e.$el;t!==e.text&&(e.text=t,o(function(){t===e.text&&(n.textContent=t)}))},c.prototype.addListeners=function(t){function e(t,e){i.on(t,e),r.addEventListener(t,function(e){i.trigger(t,e)})}var n,o,i=this,r=i.$el;for(n in t)o=t[n],e(n,o)},c.prototype.setClass=function(t){function e(t,e){o(function(){r["class"][t]===e&&(e?s.classList.add(t):s.classList.remove(t))})}var n,i,r=this,s=r.$el;for(n in t)i=t[n],r["class"][n]!==i&&(r["class"][n]=i,e(n,i))},c.prototype.setStyle=function(t){function e(e,n){o(function(){r.style[e]===t[e]&&(s.style[e]=n)})}var n,i,r=this,s=r.$el;for(n in t)i=t[n],r.style[n]!==i&&(r.style[n]=i,e(n,i))},c.prototype.setAttributes=function(t){function e(t,e){o(function(){if(e===r.attrs[t]){if(!e)return void s.removeAttribute(t);s.setAttribute(t,e),"autofocus"===t&&s.focus()}})}var n,i,r=this,s=r.$el,u=r.attrs;for(i in t)n=t[i],n!==u[i]&&(r.attrs[i]=n,n===r.attrs[i]&&e(i,n))},l(f,t),f.prototype.mount=function(t){this.view.mount(t)},f.prototype.mountBefore=function(t,e){this.view.mountBefore(t,e)},f.prototype.unmount=function(){this.view.unmount()},f.prototype.reset=function(t,e){var n=this,o=n.ChildView,i=new Array(t.length),s={},u=n.lookup;r(t,function(t,r){var a=e?t[e]:r,l=u[a];l||(l=new o(null,{parent:n.view})),s[a]=l,l.set(t),i[r]=l});for(var a in u)s[a]||u[a].destroy();n.views=i,n.lookup=s,n.reorder()},f.prototype.reorder=function(){var t=this,e=t.view.$el;o(function(){var n=e.firstChild;r(t.views,function(t,o){return n===t.$el?void(n=n.nextSibling):void(n?(t.$root=e,e.insertBefore(t.$el,n)):(t.$root=e,e.appendChild(t.$el)))});for(var o;n;)o=n.nextSibling,e.removeChild(n),n=o})};var x,C=["Buy milk","Feed cat","Go fishing","Pay rent","Watch a movie","Learn to cook"];u(C);var k=c.extend("li",{"class":"todoitem",listen:{click:v},init:g,update:m}),A=window.localStorage,S=JSON.parse(A.getItem("todoitems"))||[],B=document.getElementById("rendertime"),I=document.getElementById("container"),O=new t;d(O,B),h(O,I),p(O,I),y(O,I)}();