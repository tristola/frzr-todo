'use strict';

(function () {
  'use strict';

  // This is just a very basic inheritable Observable class, like node.js's but with jQuery's API style

  function Observable() {
    this.listeners = {};
  }

  Observable.prototype.on = function (name, cb, ctx, once) {
    this.listeners[name] || (this.listeners[name] = []);
    this.listeners[name].push({
      once: once || false,
      cb: cb,
      ctx: ctx
    });
  };

  Observable.prototype.one = function (name, cb, ctx) {
    this.on(name, cb, ctx, true);
  };

  Observable.prototype.off = function (name, cb, ctx) {
    if (typeof name === 'undefined') {
      this.listeners = {};
      return;
    }
    if (typeof cb === 'undefined') {
      this.listeners[name] = [];
      return;
    }
    var listeners = this.listeners[name];
    if (!listeners) {
      return;
    }
    for (var i = 0, len = listeners.length; i < len; i++) {
      if (ctx) {
        if (listeners[i].ctx === ctx) {
          listeners.splice(i--, 1);
          len--;
        }
        continue;
      }
      if (listeners[i].cb === cb) {
        listeners.splice(i--, 1);
        len--;
      }
    }
  };

  Observable.prototype.trigger = function (name) {
    var listeners = this.listeners[name];
    var len = arguments.length - 1;
    var args = new Array(len);

    // V8 optimization
    // https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments

    for (var i = 0; i < len; i++) {
      args[i] = arguments[i + 1];
    }

    if (!listeners) {
      return;
    }

    var listener;

    for (i = 0; i < listeners.length; i++) {
      listener = listeners[i];
      listener.cb.apply(listener.ctx || this, args);
      if (listener.once) {
        listeners.splice(i--, 1);
        len--;
      }
    }
  };

  function element(type, attrs) {
    // Just a simple helper for creating DOM elements
    var $el = document.createElement(type);

    if (typeof attrs !== 'undefined') {
      for (var attr in attrs) {
        $el.setAttribute(attr, attrs[attr]);
      }
    }

    return $el;
  }

  function SVGelement(type, attrs) {
    // Just a simple helper for creating SVG DOM elements
    var $el = document.createElementNS('http://www.w3.org/2000/svg', type);

    if (typeof attrs !== 'undefined') {
      for (var attr in attrs) {
        $el.setAttribute(attrs, attrs[attr]);
      }
    }

    return $el;
  }

  var ticking = [];
  // very simple polyfill for requestAnimationFrame
  var requestAnimationFrame = window.requestAnimationFrame || function (cb) {
    setTimeout(cb, 1000 / 60);
  };

  var renderer = new Observable();

  function batchAnimationFrame(cb) {
    // batchAnimationFrame collects multiple requestAnimationFrame calls to a single call
    if (!ticking.length) {
      // render cycle starts
      renderer.trigger('render');
      requestAnimationFrame(tick);
    }
    ticking.push(cb);
  }

  function tick() {
    var cbs = ticking.splice(0, ticking.length);
    for (var i = 0, len = cbs.length; i < len; i++) {
      cbs[i]();
    }
    if (ticking.length === 0) {
      // render cycle ends
      renderer.trigger('rendered');
      return;
    }
    tick();
  }

  function each(array, iterator) {
    var len = array.length;

    for (var i = 0; i < len; i++) {
      iterator(array[i], i, len);
    }
  }

  function filter(array, iterator) {
    var results = [];
    var len = array.length;
    var item;

    for (var i = 0; i < len; i++) {
      item = array[i];
      iterator(item, i, len) && results.push(item);
    }

    return results;
  }

  function shuffle(array) {
    if (!array || !array.length) {
      return array;
    }

    var rnd, temp;

    for (var i = array.length - 1; i > 0; i--) {
      rnd = Math.random() * i | 0;
      temp = array[i];
      array[i] = array[rnd];
      array[rnd] = temp;
    }

    return array;
  }

  function map(array, iterator) {
    var len = array.length;
    var results = new Array(len);

    for (var i = 0; i < len; i++) {
      results[i] = iterator(array[i], i, len);
    }

    return results;
  }

  function inherits(targetClass, superClass) {
    targetClass['super'] = superClass;
    targetClass.prototype = Object.create(superClass.prototype, {
      constructor: {
        configurable: true,
        value: targetClass,
        writable: true
      }
    });
  }

  function View(options) {
    var isView = this instanceof View;
    if (!isView) {
      return new View(options);
    }
    var svg = options && options.svg || false;

    View['super'].call(this); // init Observable

    this.$el = svg ? SVGelement(options.el || 'svg') : element(options.el || 'div');
    this.attrs = {};
    this['class'] = {};
    this.data = {};
    this.style = {};

    options && this.setOptions(options, true);
    this.trigger('init', this);
    options.data && this.set(options.data);
    this.trigger('inited', this);
  }

  inherits(View, Observable);

  View.extend = function (superOptions) {
    return function ExtendedView(options) {
      if (!options) {
        return new View(superOptions);
      }
      var currentOptions = {};

      for (var key in superOptions) {
        currentOptions[key] = superOptions[key];
      }
      for (key in options) {
        currentOptions[key] = options[key];
      }
      return new View(currentOptions);
    };
  };

  View.prototype.mount = function (target) {
    var self = this;

    if (self.parent) {
      // If already have parent, remove parent listeners first
      self.parent.off('mount', onParentMount, self);
      self.parent.off('mounted', onParentMounted, self);
    }

    if (target instanceof View) {
      self.parent = target;
      self.$root = target.$el;
    } else {
      self.$root = target;
    }

    batchAnimationFrame(function () {
      if (self.parent) {
        self.parent.on('mount', onParentMount, self);
        self.parent.on('mounted', onParentMounted, self);
      }
      self.trigger('mount');
      self.$root.appendChild(self.$el);
      self.trigger('mounted');
    });
  };

  function onParentMount() {
    this.trigger('parentmount');
  }

  function onParentMounted() {
    this.trigger('parentmounted');
  }

  View.prototype.unmount = function () {
    var self = this;
    var $el = self.$el;

    if (!self.$root) {
      return;
    }

    if (self.parent) {
      self.parent.off('mount', onParentMount, self);
      self.parent.off('mounted', onParentMounted, self);
    }

    batchAnimationFrame(function () {
      self.trigger('unmount');
      self.$root.removeChild($el);
      self.$root = null;
      self.parent = null;
      self.trigger('unmounted');
    });
  };

  View.prototype.destroy = function () {
    var self = this;

    self.trigger('destroy');
    self.off();
    self.unmount();
    self.trigger('destroyed');
  };

  View.prototype.mountBefore = function (target, before) {
    var $el = this.$el;

    this.$root = target;

    batchAnimationFrame(function () {
      target.insertBefore($el, before);
    });
  };

  View.prototype.set = function (data) {
    var self = this;
    batchAnimationFrame(function () {
      self.trigger('render');
    });
    self.trigger('update', data);
    for (var key in data) {
      self.data[key] = data[key];
    }
    self.trigger('updated');
    batchAnimationFrame(function () {
      self.trigger('rendered');
    });
  };

  View.prototype.setOptions = function (options, skipData) {
    if (!options) {
      return;
    }
    var key;

    for (key in options) {
      if (key === 'attrs') {
        this.setAttributes(options.attrs);
      } else if (key === 'attr') {
        this.setAttributes(options.attr);
      } else if (key === 'href') {
        this.setAttributes({
          href: options.href
        });
      } else if (key === 'id') {
        this.setAttributes({
          id: options.id
        });
      } else if (key === 'data') {
        if (!skipData) {
          this.set(options.data);
        }
      } else if (key === 'style') {
        if (typeof options.style === 'string') {
          this.setAttributes({
            style: options.style
          });
          continue;
        }
        this.setStyle(options.style);
      } else if (key === 'class') {
        if (typeof options['class'] === 'string') {
          this.setAttributes({
            'class': options['class']
          });
          continue;
        }
        this.setClass(options['class']);
      } else if (key === 'textContent') {
        this.textContent(options.textContent);
      } else if (key === 'listen') {
        this.addListeners(options.listen);
      } else if (key === 'init') {
        this.on('init', options.init);
      } else if (key === 'update') {
        this.on('update', options.update);
      } else if (key === 'parent') {
        this.mount(options.parent);
      } else if (key === '$root') {
        this.mount(options.$root);
      } else {
        this[key] = options[key];
      }
    }
  };

  View.prototype.textContent = function (text) {
    var self = this;
    var $el = self.$el;

    if (text !== self.text) {
      self.text = text;

      batchAnimationFrame(function () {
        if (text === self.text) {
          $el.textContent = text;
        }
      });
    }
  };

  View.prototype.addListeners = function (listeners) {
    var self = this;
    var $el = self.$el;
    var key, value;

    for (key in listeners) {
      value = listeners[key];
      addListener(key, value);
    }
    function addListener(key, value) {
      self.on(key, value);
      $el.addEventListener(key, function (e) {
        self.trigger(key, e);
      });
    }
  };

  View.prototype.setClass = function (classes) {
    var self = this;
    var $el = self.$el;
    var key, value;

    for (key in classes) {
      value = classes[key];
      if (self['class'][key] !== value) {
        self['class'][key] = value;
        setClass(key, value);
      }
    }

    function setClass(key, value) {
      batchAnimationFrame(function () {
        if (self['class'][key] === value) {
          if (value) {
            $el.classList.add(key);
          } else {
            $el.classList.remove(key);
          }
        }
      });
    }
  };

  View.prototype.setStyle = function (style) {
    var self = this;
    var $el = self.$el;
    var key, value;

    for (key in style) {
      value = style[key];
      if (self.style[key] !== value) {
        self.style[key] = value;
        setStyle(key, value);
      }
    }

    function setStyle(key, value) {
      batchAnimationFrame(function () {
        if (self.style[key] === style[key]) {
          $el.style[key] = value;
        }
      });
    }
  };

  View.prototype.setAttribute = function (attr, value) {
    var data = {};
    data[attr] = value;
    this.setAttributes(data);
  };

  View.prototype.setAttributes = function (attrs) {
    var self = this;
    var $el = self.$el;
    var currentAttrs = self.attrs;
    var value, attr;

    for (attr in attrs) {
      value = attrs[attr];
      if (value !== currentAttrs[attr]) {
        self.attrs[attr] = value;

        if (value === self.attrs[attr]) {
          setAttribute(attr, value);
        }
      }
    }

    function setAttribute(attr, value) {
      batchAnimationFrame(function () {
        if (value === self.attrs[attr]) {
          if (value === false || value == null) {
            $el.removeAttribute(attr);
            return;
          }
          $el.setAttribute(attr, value);

          if (attr === 'autofocus') {
            if (value) {
              $el.focus();
              self.on('mounted', onAutofocus);
              self.on('parentmounted', onAutofocus, self);
            } else {
              self.off('mounted', onAutofocus);
              self.off('parentmounted', onAutofocus, self);
            }
          }
        }
      });
    }
  };

  function onAutofocus() {
    this.$el.focus();
  }

  function Views(ChildView, options) {
    var isViews = this instanceof Views;
    if (!isViews) {
      return new Views(ChildView, options);
    }
    this.view = new View(options);
    this.views = [];
    this.lookup = {};
    this.ChildView = ChildView || View;
  }

  inherits(Views, Observable);

  Views.prototype.mount = function (target) {
    this.view.mount(target);
  };

  Views.prototype.mountBefore = function (target, before) {
    this.view.mountBefore(target, before);
  };

  Views.prototype.unmount = function () {
    this.view.unmount();
  };

  Views.prototype.reset = function (data, key) {
    var self = this;
    var ChildView = self.ChildView;

    var views = new Array(data.length);
    var lookup = {};
    var currentLookup = self.lookup;

    each(data, function (item, i) {
      var id_or_i = key ? item[key] : i;
      var view = currentLookup[id_or_i];

      if (!view) {
        view = new ChildView(null, { parent: self.view });
      }
      lookup[id_or_i] = view;
      view.set(item);
      views[i] = view;
    });
    for (var id in currentLookup) {
      if (!lookup[id]) {
        currentLookup[id].destroy();
      }
    }
    self.views = views;
    self.lookup = lookup;
    self.reorder();
  };

  Views.prototype.reorder = function () {
    var self = this;
    var $root = self.view.$el;

    batchAnimationFrame(function () {
      var traverse = $root.firstChild;

      each(self.views, function (view, i) {
        if (traverse === view.$el) {
          traverse = traverse.nextSibling;
          return;
        }
        if (traverse) {
          view.$root = $root;
          $root.insertBefore(view.$el, traverse);
        } else {
          view.$root = $root;
          $root.appendChild(view.$el);
        }
      });
      var next;
      while (traverse) {
        next = traverse.nextSibling;
        $root.removeChild(traverse);
        traverse = next;
      }
    });
  };

  var starttime;

  function debug(root, target) {
    // listen to 'render' event and remember time
    renderer.on('render', function () {
      starttime = Date.now();
    });
    // listen to 'rendered' event and log render time
    renderer.on('rendered', function () {
      target.textContent = 'Rendering took ' + (Date.now() - starttime) + ' ms';
    });
  }

  function title(root, target) {
    // h1
    var view = new View({ el: 'h1', textContent: 'Todo' });
    // p
    var notice = new View({ el: 'p', textContent: '(items stay between refreshes)', style: {
        fontStyle: 'italic'
      } });

    // mount elements
    view.mount(target);
    notice.mount(target);
  }

  // Choose some of these for placeholder
  var whattodo = ['Buy milk', 'Feed cat', 'Go fishing', 'Pay rent', 'Watch a movie', 'Learn to cook'];

  // shuffle
  shuffle(whattodo);

  function todocreate(root, target) {
    // Container
    var view = new View({
      el: 'div',
      'class': 'todo-create'
    });

    // Form
    var form = new View({
      el: 'form',
      listen: {
        submit: createTodo
      }
    });

    // elements
    var title = new View({
      el: 'h2',
      textContent: 'What to do?'
    });
    var input = new View({
      el: 'input',
      attrs: {
        autofocus: true,
        placeholder: whattodo[0]
      }
    });
    var insertbutton = new View({
      el: 'button',
      textContent: 'Insert'
    });
    var clearbutton = new View({
      el: 'button',
      textContent: 'Clear done',
      listen: {
        click: clearDone
      }
    });
    var clearallbutton = new View({
      el: 'button',
      textContent: 'Clear all',
      listen: {
        click: clearAll
      }
    });

    // mount all

    form.mount(target);
    view.mount(form.$el);
    title.mount(form.$el);
    input.mount(form.$el);
    insertbutton.mount(form.$el);
    clearbutton.mount(target);
    clearallbutton.mount(target);

    // actions

    function createTodo(e) {
      e.preventDefault();
      var newTodo = {
        id: Date.now(),
        title: input.$el.value || whattodo[0],
        done: false
      };
      root.trigger('todo-create', newTodo);

      input.$el.value = '';

      shuffle(whattodo);
      input.setAttributes({
        placeholder: whattodo[0]
      });
      input.$el.focus();
    }

    function clearDone() {
      clearbutton.$el.blur();
      root.trigger('todo-clear');
    }

    function clearAll() {
      clearallbutton.$el.blur();
      root.trigger('todo-clearall');
    }
  }

  // extend View
  var TodoItem = View.extend({
    el: 'li',
    'class': 'todoitem',
    listen: {
      click: switchDone
    },
    init: init,
    update: update
  });

  // init function, executed when View is added
  function init() {
    var self = this;

    // checkbox + title
    self.checkbox = new View({
      el: 'input',
      attrs: {
        type: 'checkbox'
      },
      parent: self
    });
    self.title = new View({ el: 'span' });

    // mount elements
    self.checkbox.mount(self.$el);
    self.title.mount(self.$el);
  }

  // actions

  function switchDone() {
    this.data.done = !this.data.done;
    this.parent.root.trigger('todo-update', this.data);
  }

  function update(data) {
    this.title.textContent(data.title);
    this.checkbox.setAttributes({
      checked: data.done
    });
  }

  var localStorage = window.localStorage;
  var todoitems = JSON.parse(localStorage.getItem('todoitems')) || [];

  function todoitems$1(root, target) {
    // container
    var view = new Views(TodoItem, {
      el: 'ul',
      'class': 'todoitems',
      root: root
    });
    view.reset(todoitems, 'id');

    // mount
    view.mount(target);

    // listeners

    root.on('todo-create', function (todoitem) {
      todoitems.push(todoitem);
      view.reset(todoitems, 'id');
      localStorage.setItem('todoitems', JSON.stringify(todoitems));
    });

    root.on('todo-update', function (todoitem) {
      todoitems = map(view.views, function (view) {
        return view.data;
      });
      localStorage.setItem('todoitems', JSON.stringify(todoitems));
      view.reset(todoitems, 'id');
    });

    root.on('todo-clear', function () {
      var notDone = filter(view.views, function (view) {
        return !view.data.done;
      });
      todoitems = map(notDone, function (view) {
        return view.data;
      });
      view.reset(todoitems, 'id');
      localStorage.setItem('todoitems', JSON.stringify(todoitems));
    });

    root.on('todo-clearall', function () {
      todoitems = [];
      view.reset(todoitems, 'id');
      localStorage.setItem('todoitems', JSON.stringify([]));
    });
  }

  var $rendertime = document.getElementById('rendertime');
  var $container = document.getElementById('container');
  var root = new Observable();

  // mount debug
  debug(root, $rendertime);

  // mount title
  title(root, $container);

  // mount input
  todocreate(root, $container);

  // mount items
  todoitems$1(root, $container);
})();