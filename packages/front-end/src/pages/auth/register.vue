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

defineOptions({
  name: 'register',
})

const formRef = ref<FormInstance>()
const loading = ref(false)

const formState = ref({
  username: '',
  password: '',
  repassword: '',
})

const rules: Record<string, Rule[]> = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    },
  ],
  repassword: [
    {
      required: true,
      message: '请输入确认密码',
      trigger: 'blur',
    },
  ],
}

const handleFinish = async (values: any) => {
  loading.value = true
  console.log(values)
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
          placeholder="用户名"
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