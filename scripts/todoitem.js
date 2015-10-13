
import {View} from 'frzr'

// extend View
export default View.extend({
  el: 'li',
  class: 'todoitem',
  listen: {
    click: switchDone
  },
  init: init,
  update: update
})

// init function, executed when View is added
function init () {
  var self = this

  // checkbox + title
  self.checkbox = new View({
    el: 'input',
    attrs: {
      type: 'checkbox'
    },
    parent: self
  })
  self.title = new View({el: 'span'})

  // mount elements
  self.checkbox.mount(self.$el)
  self.title.mount(self.$el)
}

// actions

function switchDone () {
  this.data.done = !this.data.done
  this.parent.root.trigger('todo-update', this.data)
}

function update (data) {
  this.title.textContent(data.title)
  this.checkbox.setAttributes({
    checked: data.done
  })
}
