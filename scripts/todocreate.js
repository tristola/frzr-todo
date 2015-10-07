
import {shuffle, View} from 'frzr'

// Choose some of these for placeholder
var whattodo = ['Buy milk', 'Feed cat', 'Go fishing', 'Pay rent', 'Watch a movie', 'Learn to cook']

// shuffle
shuffle(whattodo)

export default function (root, target) {
  // Container
  var view = new View('div', {
    class: 'todo-create'
  })

  // Form
  var form = new View('form', {listen: {
    submit: createTodo
  }})

  // elements
  var title = new View('h2', {textContent: 'What to do?'})
  var input = new View('input', {attrs: {autofocus: true, placeholder: whattodo[0]}})
  var insertbutton = new View('button', {textContent: 'Insert'})
  var clearbutton = new View('button', {textContent: 'Clear done', listen: {
    click: clearDone
  }})
  var clearallbutton = new View('button', {textContent: 'Clear all', listen: {
    click: clearAll
  }})

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
    root.trigger('todo-create', {
      id: Date.now(),
      title: input.$el.value,
      done: false
    })
    input.$el.value = ''
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
