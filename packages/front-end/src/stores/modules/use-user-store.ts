import { defineStore } from 'pinia'
import { message } from 'ant-design-vue'
import { useLocalStorage } from '@vueuse/core'
import { UserApi } from '@/apis/modules/user'
import { AuthApi } from '@/apis/modules/auth'
import router from '@/routers'
import mitt from 'mitt'
import { HttpStatus } from '@v3-nest-full-stack/shared-types'

export const userStoreMitter = mitt<{
  [key: string]: any
}>()
userStoreMitter.on(HttpStatus.UNAUTHORIZED.toString(), () => {
  useUserStore().logout()
})
export interface UserVO {
  id: string;
  status: number;
  username: string;
  nickname: string;
  createTime: Date;
  updateTime: Date;
  roles: string[];
  permissions: string[];
}

export const useUserStore = defineStore('user-store', () => {
  const token = useLocalStorage('access_token', '')
  const isAuthenticated = computed(() => {
    return !!token.value
  })
  const user = ref<UserVO | null>(null)
  const initUser = async () => {
    // 使用token来获取用户的信息
    const res = await UserApi.getUserInfo()
    console.log('initUser res=', res);
    user.value = res.user
  }
  const isLoading = ref(false)
  const login = async (username: string, password: string) => {
    if (isLoading.value) return
    isLoading.value = true
    try {
      const res = await AuthApi.login({ username, password })
      token.value = res.access_token
      router.push('/')
      message.success('登录成功')
    } catch (e) {
      console.log(e)
    } finally {
      isLoading.value = false
    }
  }
  const getUser = () => {
    return user.value
  }
  const getToken = () => {
    return token.value
  }
  const logout = () => {
    user.value = null
    token.value = ''
  }
  return {
    user,
    isAuthenticated,
    getToken,
    initUser,
    getUser,
    login,
    logout,
    isLoading
  }
})
