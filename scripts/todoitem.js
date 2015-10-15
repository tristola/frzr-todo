
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
    attr: {
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
  var self = this

  self.data.done = !self.data.done
  self.parent.root.trigger('todo-update', self.data)
}

function update (data) {
  var self = this

  self.title.text(data.title)
  self.checkbox.attr({
    checked: data.done
  })
}
