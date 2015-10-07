
import {View} from 'frzr'

export default function (root, target) {
  var view = new View('h1', {textContent: 'Todo'})
  var notice = new View('p', {textContent: '(items stay between refreshes)', style: {
    fontStyle: 'italic'
  }})

  view.mount(target)
  notice.mount(target)
}
