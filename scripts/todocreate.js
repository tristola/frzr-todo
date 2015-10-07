
import {shuffle, View} from 'frzr'

var whattodo = ['Buy milk', 'Feed cat', 'Go fishing', 'Pay rent', 'Watch a movie', 'Learn to cook']

shuffle(whattodo)

export default function (root, target) {
  var view = new View('div', {
    class: 'todo-create'
  })
  var form = new View('form', {listen: {
    submit: createTodo
  }})
  var title = new View('h2', {textContent: 'What to do?'})
  var input = new View('input', {attrs: {autofocus: true, placeholder: whattodo[0]}})
  var createbutton = new View('button', {textContent: 'Insert'})
  var clearbutton = new View('button', {textContent: 'Clear done', listen: {
    click: clearDone
  }})
  var clearallbutton = new View('button', {textContent: 'Clear all', listen: {
    click: clearAll
  }})

  form.mount(target)
  view.mount(form.$el)
  title.mount(form.$el)
  input.mount(form.$el)
  createbutton.mount(form.$el)
  clearbutton.mount(target)
  clearallbutton.mount(target)

  function createTodo () {
    root.trigger('todo-create', {
      id: Date.now(),
      title: input.$el.value,
      done: false
    })
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
