<!-- 这个组件用于渲染表单，它接受一个对象数组作为参数，其中每个对象表示一个表单字段，
 包括字段的key、label、name、component和attrs等属性。
 需要注意的是，该组件为一个异步组件，所以你需要结合Suspence组件来使用。
 可以参考Vue官网: https://cn.vuejs.org/guide/built-ins/suspense.html
 设计为异步组件的原因是为了提高性能，避免将没有使用的ant-design组件一起打包。
 -->
<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form'
import _ from 'lodash'

defineOptions({
  name: 'FormRender',
})
interface FormRenderProps {
  model: {
    [key: string]: any
  }
  rules?: {
    [key: string]: Rule[]
  }
  items: {
    key: string
    label: string
    name: string
    component: string
    isRender?: boolean
    attrs?:
      | {
          [key: string]: any
        }
      | Function
    [key: string]: any
  }[]
}
const props = defineProps<FormRenderProps>()
const componentReflector = {
  Input: () => import('ant-design-vue/es/input'),
  Select: () => import('ant-design-vue/es/select'),
  DatePicker: () => import('ant-design-vue/es/date-picker'),
  InputNumber: () => import('ant-design-vue/es/input-number'),
  Switch: () => import('ant-design-vue/es/switch'),
  RadioGroup: () => import('ant-design-vue/es/radio/group'),
  Radio: () => import('ant-design-vue/es/radio'),
  CheckboxGroup: () => import('ant-design-vue/es/checkbox/group'),
  Checkbox: () => import('ant-design-vue/es/checkbox'),
}
const loadedComponents = shallowRef<Record<string, any>>({})
const doLoadAllComponents = async () => {
  const uniqueComponents = new Set(props.items.map(item => item.component))
  for (const componentName of uniqueComponents) {
    if (!loadedComponents.value[componentName]) {
      const _name = componentName as keyof typeof componentReflector
      if (componentReflector[_name]) {
        const component = await componentReflector[_name]()
        loadedComponents.value[componentName] = component.default
      }
    }
  }
}
await doLoadAllComponents()

function combinePairs(arr: any[]) {
  const result = []
  const flags: boolean[] = []
  for (let i = 0; i < arr.length; i++) {
    flags[i] = false
  }
  for (let i = 0; i < arr.length; i++) {
    if (flags[i]) {
      continue
    }
    if (i + 1 > arr.length - 1) {
      result.push([arr[i]])
      flags[i] = true
    } else if (i + 1 <= arr.length - 1) {
      result.push([arr[i], arr[i + 1]])
      flags[i] = true
      flags[i + 1] = true
    }
  }
  return result
}
for (const item of props.items) {
  if (_.isFunction(item.attrs)) {
    console.log('attrs is function', item.attrs())
  } else {
    console.log('attrs is object', item.attrs)
  }
}
onMounted(() => {
  console.log('loadedComponents', loadedComponents.value)
})
</script>

<template>
  <a-form layout="horizontal" :model="model" :rules="rules">
    <template
      v-for="pair in combinePairs(props.items)"
      :key="`key-${pair[0].name}`"
    >
      <a-row :gutter="10">
        <a-col :span="12" v-for="item in pair" :key="item.name">
          <a-form-item :label="item.label" :name="item.name">
            <component
              :is="loadedComponents[item.component]"
              v-model:value="model[item.name]"
              v-bind="_.isFunction(item.attrs) ? item.attrs() : item.attrs"
            ></component>
          </a-form-item>
        </a-col>
      </a-row>
    </template>
  </a-form>
</template>

<style scoped lang="scss"></style>
