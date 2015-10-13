
import {shuffle, View} from 'frzr'

// Choose some of these for placeholder
var whattodo = ['Buy milk', 'Feed cat', 'Go fishing', 'Pay rent', 'Watch a movie', 'Learn to cook']

// shuffle
shuffle(whattodo)

export default function (root, target) {
  // Container
  var view = new View({
    el: 'div',
    class: 'todo-create'
  })

  // Form
  var form = new View({
    el: 'form',
    listen: {
      submit: createTodo
    }
  })

  // elements
  var title = new View({
    el: 'h2',
    textContent: 'What to do?'
  })
  var input = new View({
    el: 'input',
    attrs: {
      autofocus: true,
      placeholder: whattodo[0]
    }
  })
  var insertbutton = new View({
    el: 'button',
    textContent: 'Insert'
  })
  var clearbutton = new View({
    el: 'button',
    textContent: 'Clear done',
    listen: {
      click: clearDone
    }
  })
  var clearallbutton = new View({
    el: 'button',
    textContent: 'Clear all',
    listen: {
      click: clearAll
    }
  })

  // mount all

  form.mount(target)
  view.mount(form.$el)
  title.mount(form.$el)
  input.mount(form.$el)
  insertbutton.mount(form.$el)
  clearbutton.mount(target)
  clearallbutton.mount(target)

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
    input.setAttributes({
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
