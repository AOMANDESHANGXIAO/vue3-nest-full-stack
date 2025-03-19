// This is a example for the vue directive files.
export default () => {
  return {
    mounted(el: HTMLElement) {
      el.focus()
    },
  }
}
