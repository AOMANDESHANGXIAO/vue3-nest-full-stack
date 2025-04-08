// vue3有一个bug，无法正确获取异步组件的引用
// 所以这里只能使用eventBus来传递事件
import mitt from 'mitt'

const eventBus = mitt<{
    validate: () => void
}>()

export default eventBus