
import {filter, map, Views} from 'frzr'
import TodoItem from './todoitem'

var localStorage = window.localStorage
var todoitems = JSON.parse(localStorage.getItem('todoitems')) || []

export default function (root, target) {
  // container
  var view = new Views(TodoItem, 'ul', {
    class: 'todoitems', 
    root: root
  })
  view.reset(todoitems, 'id')

  // mount
  view.mount(target)

  // listeners

  root.on('todo-create', function (todoitem) {
    todoitems.push(todoitem)
    view.reset(todoitems, 'id')
    localStorage.setItem('todoitems', JSON.stringify(todoitems))
  })

  root.on('todo-update', function (todoitem) {
    todoitems = map(view.views, function (view) {
      return view.data
    })
    localStorage.setItem('todoitems', JSON.stringify(todoitems))
    view.reset(todoitems, 'id')
  })

  root.on('todo-clear', function () {
    var notDone = filter(view.views, function (view) {
      return !view.data.done
    })
    todoitems = map(notDone, function (view) {
      return view.data
    })
    view.reset(todoitems, 'id')
    localStorage.setItem('todoitems', JSON.stringify(todoitems))
  })

  root.on('todo-clearall', function () {
    todoitems = []
    view.reset(todoitems, 'id')
    localStorage.setItem('todoitems', JSON.stringify([]))
  })
}
