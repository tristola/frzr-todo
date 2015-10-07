
import {renderer} from 'frzr'

var starttime

export default function (root, target) {
  // listen to 'render' event and remember time
  renderer.on('render', function () {
    starttime = Date.now()
  })
  // listen to 'rendered' event and log render time
  renderer.on('rendered', function () {
    target.textContent = 'Rendering took ' + (Date.now() - starttime) + ' ms'
  })
}
