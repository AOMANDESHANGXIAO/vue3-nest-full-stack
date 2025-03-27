<route lang="json">
{
  "meta": {
    "title": "注册界面",
    "showInMenu": false
  }
}
</route>

<script lang="ts" setup>
import { ref } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { UserOutlined, LockOutlined, EyeOutlined } from '@ant-design/icons-vue'
import { UserApi } from '@/apis/modules/user'
import { message } from 'ant-design-vue'
import router from '@/routers'
import _ from 'lodash'

defineOptions({
  name: 'register',
})

const formRef = ref<FormInstance>()

// const formState = ref({
//   username: '',
//   password: '',
//   nickname: '',
//   repassword: '',
// })
const formState = ref({
  username: 'user_123',
  password: '123abcABC',
  nickname: '斌神',
  repassword: '123abcABC',
})

const rules: Record<string, Rule[]> = {
  username: [
    { required: true, message: '请输入用户名' },
    { min: 3, message: '用户名至少3个字符' },
    { max: 20, message: '用户名最多20个字符' },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]{3,20}$/,
      message: '用户名必须以字母开头,允许字母数字下划线',
    },
  ],
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码至少6个字符' },
    { max: 15, message: '密码最多15个字符' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,15}$/,
      message: '密码必须包含至少一个大写字母、一个小写字母和一个数字',
    },
  ],
  nickname: [
    { required: true, message: '请输入昵称' },
    { min: 2, message: '昵称至少2个字符' },
    { max: 20, message: '昵称最多20个字符' },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_\-\s·]+$/,
      message: '昵称只能包含中文、字母、数字、下划线、横线、空格和点',
    },
  ],
  repassword: [
    {
      required: true,
      message: '请输入确认密码',
      trigger: 'blur',
    },
    {
      validator(_, value) {
        if (value === formState.value.password) {
          return Promise.resolve()
        }
        return Promise.reject(new Error('两次输入的密码不一致'))
      },
      trigger: 'blur',
    },
  ],
}
const loading = ref(false)
const handleFinish = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true
    await UserApi.register(_.omit(formState.value, ['repassword']))
    message.success('注册成功')
    loading.value = false
    // 注册成功后跳转到登录页
    router.push({
      path: '/auth/login',
      query: {
        formState: JSON.stringify(formState.value),
      },
    })
  } catch (error) {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-2 opacity-70">创建一个账号🚀</h1>
      <p class="text-gray-600">加入我们趁现在~</p>
    </div>

    <a-form
      ref="formRef"
      :model="formState"
      @finish="handleFinish"
      :rules="rules"
    >
      <a-form-item name="username">
        <a-input
          v-model:value="formState.username"
          size="large"
          placeholder="账号"
        >
          <template #prefix>
            <UserOutlined class="text-gray-400" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item name="nickname">
        <a-input
          v-model:value="formState.nickname"
          size="large"
          placeholder="昵称"
        >
          <template #prefix>
            <UserOutlined class="text-gray-400" />
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
            <EyeOutlined class="text-gray-400" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item name="repassword">
        <a-input-password
          v-model:value="formState.repassword"
          size="large"
          placeholder="确认密码"
        >
          <template #prefix>
            <LockOutlined class="text-gray-400" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-button
        type="primary"
        html-type="submit"
        :loading="loading"
        class="w-full"
        size="large"
      >
        {{ loading ? '注册中...' : '注册' }}
      </a-button>
    </a-form>
    <a-divider class="my-4"
      >已有账号?<RouterLink to="/auth/login"
        >&nbsp;点击登录</RouterLink
      ></a-divider
    >
  </div>
</template>
