import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
} from 'axios'
import { message as antMessage } from 'ant-design-vue'
import { useUserStore } from '@/stores/modules/use-user-store'
import type { ApiResponse } from '@v3-nest-full-stack/shared-types'
import router, { routerMitter } from '@/routers'
// Create axios instance
const BASE_URL = import.meta.env.VITE_APP_API_URL

const service: AxiosInstance = axios.create({
  baseURL: BASE_URL, // URL prefix from .env
  timeout: 10000, // Request timeout
})

// Request interceptor
service.interceptors.request.use(
  config => {
    const { getToken } = useUserStore()
    const token = getToken()
    // Add token to request headers if exists
    if (token) {
      config.headers['Authorization'] = token
    }

    return config
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)
// TODO: 完善
const errorCodeHandler = (code: number) => {
  if (code === 401) {
    routerMitter.emit('noAuth', router)
  }
}
// Response interceptor
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { message, data, success } = response.data as ApiResponse<any>
    // Custom response code handling
    if (!success) {
      antMessage.error(message || '请求出错了~')
      return Promise.reject(new Error(message || 'Error'))
    }

    return data
  },
  (error: AxiosError) => {
    console.error('Response interceptor error:', error)
    const { data,code } = error!.response as unknown as ApiResponse<any>
    errorCodeHandler(code)
    // Network error or timeout handling
    antMessage.error(data.message || '网络异常~')

    return Promise.reject(error)
  }
)

export default service
