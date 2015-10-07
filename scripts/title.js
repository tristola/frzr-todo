
import {View} from 'frzr'

export default function (root, target) {
  // h1
  var view = new View('h1', {textContent: 'Todo'})
  // p
  var notice = new View('p', {textContent: '(items stay between refreshes)', style: {
    fontStyle: 'italic'
  }})

  // mount elements
  view.mount(target)
  notice.mount(target)
}
