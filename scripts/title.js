
import {View} from 'frzr'

export default function (root, target) {
  // h1
  var view = new View({el: 'h1', text: 'Todo'})
  // p
  var notice = new View({el: 'p', text: '(items stay between refreshes)', style: {
    fontStyle: 'italic'
  }})

  // mount elements
  view.mount(target)
  notice.mount(target)
}
