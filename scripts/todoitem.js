
import {View} from 'frzr'

export default View.extend('li', {class: 'todoitem', listen: {click: switchDone}, init: init, update: update})

function init () {
  var self = this

  this.checkbox = new View('input', {attrs: {type: 'checkbox'}, parent: self})
  this.title = new View('span')

  this.checkbox.mount(this.$el)
  this.title.mount(this.$el)
}

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
