import type { App, Directive } from 'vue'
import tippy, { type Placement, type ReferenceElement } from 'tippy.js'

const tippyDirective: Directive = {
  mounted(el, bind) {
    const { value } = bind
    let offset = [0, 20],
      content = '',
      placement: Placement = 'right'
    if (typeof value === 'object') {
      content = value.content
      offset = value.offset || [0, 20]
      placement = value.placement || 'right'
    }
    if (typeof value === 'string') {
      content = value as string
    }
    tippy(el, {
      content,
      placement,
      offset: offset as [number, number]
    })
  },
  unmounted(el) {
    ;(el as ReferenceElement)._tippy?.destroy()
  }
}

export const registerTippy = (app: App) => app.directive('tippy', tippyDirective)
