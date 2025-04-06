<!-- 这个组件用于渲染表单，它接受一个对象数组作为参数，其中每个对象表示一个表单字段，
 包括字段的key、label、name、component和attrs等属性。
 需要注意的是，该组件为一个异步组件，所以你需要结合Suspence组件来使用。
 可以参考Vue官网: https://cn.vuejs.org/guide/built-ins/suspense.html
 -->
<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form'

defineOptions({
  name: 'FormRender',
})
export interface FormRenderProps {
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
    attrs?: {
      [key: string]: any
    }
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

function combinePairs<T>(arr: T[]): [T, T][] {
  const result: [T, T][] = []

  for (let i = 0; i < arr.length; i += 2) {
    if (i + 1 < arr.length) {
      result.push([arr[i], arr[i + 1]])
    }
  }

  return result
}
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
              v-if="loadedComponents[item.component]"
              :is="loadedComponents[item.component]"
              v-model:value="model[item.name]"
              v-bind="item.attrs"
            ></component>
          </a-form-item>
        </a-col>
      </a-row>
    </template>
  </a-form>
</template>

<style scoped lang="scss"></style>
