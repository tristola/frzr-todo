
import {shuffle, View} from 'frzr'

// Choose some of these for placeholder
var whattodo = ['Buy milk', 'Feed cat', 'Go fishing', 'Pay rent', 'Watch a movie', 'Learn to cook']

// shuffle
shuffle(whattodo)

export default function (root, target) {
  // Form
  var form = new View({
    el: 'form',
    listen: {
      submit: createTodo
    },
    $root: target
  })

  // elements
  var title = new View({
    el: 'h2',
    text: 'What to do?',
    parent: form
  })
  var input = new View({
    el: 'input',
    attr: {
      autofocus: true,
      placeholder: whattodo[0]
    },
    parent: form
  })
  var insertbutton = new View({
    el: 'button',
    text: 'Insert',
    parent: form
  })
  var clearbutton = new View({
    el: 'button',
    text: 'Clear done',
    listen: {
      click: clearDone
    },
    $root: target
  })
  var clearallbutton = new View({
    el: 'button',
    text: 'Clear all',
    listen: {
      click: clearAll
    },
    $root: target
  })

  // actions

  function createTodo (e) {
    e.preventDefault()
    var newTodo = {
      id: Date.now(),
      title: input.$el.value || whattodo[0],
      done: false
    }
    root.trigger('todo-create', newTodo)

    input.$el.value = ''

    shuffle(whattodo)
    input.attr({
      placeholder: whattodo[0]
    })
    input.$el.focus()
  }

  function clearDone () {
    clearbutton.$el.blur()
    root.trigger('todo-clear')
  }

  function clearAll () {
    clearallbutton.$el.blur()
    root.trigger('todo-clearall')
  }
}
