import { defineStore } from 'pinia'
import { DictsApi } from '@/apis/modules/dicts'
import { useLocalStorage } from '@vueuse/core'

// TODO: atable的customRender不支持异步函数
// 因此，需要1. 后端实现一个接口将所有的字典数据一次性返回，然后前端缓存
// 2. 前端实现一个字典缓存，然后在customRender中使用
export const useDictStore = defineStore('dict', () => {
  // 使用Map来缓存字典数据，键为 code:dictCode
  const dictCache = useLocalStorage('dictCache', new Map<string, any>())

  // 获取字典数据
  const getDict = async (code: string, dictCode: string) => {
    const cacheKey = `${code}:${dictCode}`

    // 优先从缓存读取
    if (dictCache.value.has(cacheKey)) {
      return dictCache.value.get(cacheKey)
    }

    // 缓存不存在则请求接口
    try {
      const data = await DictsApi.getTransferText(code, dictCode)
      dictCache.value.set(cacheKey, data)
      console.log('获取字典数据:', data)
      return data
    } catch (error) {
      console.error('获取字典数据失败:', error)
      throw error
    }
  }

  // 清除指定字典缓存
  const clearDictCache = (code?: string, dictCode?: string) => {
    if (code && dictCode) {
      dictCache.value.delete(`${code}:${dictCode}`)
    } else if (code) {
      // 清除该code下的所有缓存
      for (const key of dictCache.value.keys()) {
        if (key.startsWith(`${code}:`)) {
          dictCache.value.delete(key)
        }
      }
    } else {
      dictCache.value.clear()
    }
  }

  return {
    getDict,
    clearDictCache,
  }
})
