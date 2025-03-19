import type { Directive, DirectiveBinding } from 'vue'

/**
 * 自定义指令，在hover时添加class
 */
type vHoverClassBinding =
  | DirectiveBinding<string | Ref<string>>
  | ComputedRef<string>

const eventMounted = (el: HTMLElement, binding: vHoverClassBinding) => {
  const { value } = binding
  let className = ''
  if (isRef(value)) {
    className = value.value
  } else {
    className = value
  }
  el.removeEventListener('mouseenter', () => {})
  el.removeEventListener('mouseleave', () => {})
  el.addEventListener('mouseenter', () => {
    // splite className by space
    const classList = className.split(' ')
    el.classList.add(...classList)
  })
  el.addEventListener('mouseleave', () => {
    const classList = className.split(' ')
    el.classList.remove(...classList)
  })
}

export const vHoverClass: Directive = {
  mounted: eventMounted,
  updated: eventMounted,
  unmounted(el: HTMLElement) {
    el.removeEventListener('mouseenter', () => {})
    el.removeEventListener('mouseleave', () => {})
  },
}
