
import {View} from 'frzr'

// extend View
export default View.extend('li', {
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
  this.checkbox = new View('input', {
    attrs: {
      type: 'checkbox'
    }, 
    parent: self
  })
  this.title = new View('span')

  // mount elements
  this.checkbox.mount(this.$el)
  this.title.mount(this.$el)
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
