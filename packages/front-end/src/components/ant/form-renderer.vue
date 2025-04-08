<script setup lang="ts">
import type { FormInstance, Rule } from "ant-design-vue/es/form";
import _ from "lodash";
import type { Component } from "vue";
defineOptions({
  name: "form-renderer",
});
interface FormRenderProps {
  model: {
    [key: string]: any;
  };
  rules?: {
    [key: string]: Rule[];
  };
  items: {
    key: string;
    label: string;
    name: string;
    component: Component;
    isRender?: boolean;
    attrs?:
      | {
          [key: string]: any;
        }
      | Function;
    [key: string]: any;
  }[];
}
const props = defineProps<FormRenderProps>();
function combinePairs(arr: any[]) {
  const result: any[] = [];
  const flags: boolean[] = [];
  for (let i = 0; i < arr.length; i++) {
    flags[i] = false;
  }
  for (let i = 0; i < arr.length; i++) {
    if (flags[i]) {
      continue;
    }
    if (i + 1 > arr.length - 1) {
      result.push([arr[i]]);
      flags[i] = true;
    } else if (i + 1 <= arr.length - 1) {
      result.push([arr[i], arr[i + 1]]);
      flags[i] = true;
      flags[i + 1] = true;
    }
  }
  return result;
}
const formRef = useTemplateRef<FormInstance>("formRef");
defineExpose({
  getFormRef: () => formRef.value,
});
</script>

<template>
  <a-form layout="horizontal" :model="model" :rules="rules" ref="formRef">
    <template
      v-for="pair in combinePairs(props.items)"
      :key="`key-${pair[0].name}`"
    >
      <a-row :gutter="10">
        <a-col :span="12" v-for="item in pair" :key="item.name">
          <a-form-item :label="item.label" :name="item.name">
            <component
              :is="item.component"
              v-model:value="model[item.name]"
              v-bind="_.isFunction(item.attrs) ? item.attrs() : item.attrs"
            ></component>
          </a-form-item>
        </a-col>
      </a-row>
    </template>
  </a-form>
</template>

<style scoped lang="scss">
::v-deep(.ant-form-item-label) {
  label:not(.ant-form-item-required) {
    margin-left: 10px;
  }
}
</style>
