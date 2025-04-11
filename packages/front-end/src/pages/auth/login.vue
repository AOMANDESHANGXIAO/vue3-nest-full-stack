<route lang="json">
{
  "meta": {
    "title": "登录界面",
    "showInMenu": false
  }
}
</route>

<script lang="ts" setup>
import { useUserStore } from '@/stores/modules/use-user-store';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { Base64 } from 'js-base64';
import _ from 'lodash';
import { ref } from 'vue';
import { useRoute } from 'vue-router';


defineOptions({
  name: 'login',
})

const formRef = ref<FormInstance>()
const rememberMe = ref(false)
const route = useRoute()
console.log('路由跳转', route.query.params)
const queryFormState = route.query.params
  ? (_.pick(JSON.parse(Base64.decode(route.query.params as string)), [
      'username',
      'password',
    ]) as FormState)
  : {
      username: '',
      password: '',
    }
interface FormState {
  username: string
  password: string
}

const formState = ref<FormState>(queryFormState)

const rules: Record<string, Rule[]> = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
}
const userStore = useUserStore()
const handleFinish = async () => {
  await formRef.value?.validate()
  userStore.login(formState.value.username, formState.value.password)
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2 opacity-70">欢迎回来👋</h1>
      <p class="text-gray-600">请输入您的账号和密码~</p>
    </div>

    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      @finish="handleFinish"
    >
      <a-form-item name="username">
        <a-input
          v-model:value="formState.username"
          size="large"
          placeholder="用户名"
        >
          <template #prefix>
            <UserOutlined class="text-gray-400"></UserOutlined>
          </template>
        </a-input>
      </a-form-item>

      <a-form-item name="password">
        <a-input-password
          v-model:value="formState.password"
          size="large"
          placeholder="密码"
        >
          <template #prefix>
            <LockOutlined class="text-gray-400"></LockOutlined>
          </template>
        </a-input-password>
      </a-form-item>

      <div class="flex justify-between items-center mb-4">
        <a-checkbox v-model:checked="rememberMe"> 记住我 </a-checkbox>
        <a class="text-blue-500 hover:text-blue-600"> 忘记密码？ </a>
      </div>

      <a-button
        type="primary"
        html-type="submit"
        :loading="userStore.isLoading"
        class="w-full"
        size="large"
      >
        {{ userStore.isLoading ? "登录中..." : "登录" }}
      </a-button>
    </a-form>
    <a-divider class="my-4"
      >还没有账号?<RouterLink to="/auth/register"
        >&nbsp;点击注册</RouterLink
      ></a-divider
    >
  </div>
</template>
