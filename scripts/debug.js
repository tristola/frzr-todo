
import {renderer} from 'frzr'

var starttime

export default function (root, target) {
  renderer.on('render', function () {
    starttime = Date.now()
  })
  renderer.on('rendered', function () {
    target.textContent = 'Rendering took ' + (Date.now() - starttime) + ' ms'
  })
}
