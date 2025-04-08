import { defineStore } from "pinia";
import { DictsApi } from "@/apis/modules/dicts";
import { useLocalStorage } from "@vueuse/core";
import { message } from "ant-design-vue";
import _ from "lodash";
// TODO: atable的customRender不支持异步函数
// 因此，需要1. 后端实现一个接口将所有的字典数据一次性返回，然后前端缓存
// 2. 前端实现一个字典缓存，然后在customRender中使用
export const useDictStore = defineStore("dict", () => {
  // 使用Map来缓存字典数据，键为 code:dictCode
  const dictCache = useLocalStorage("dictCache", {} as { [key: string]: any });
  let isLoading = false;
  const successMessage = _.debounce((msg: string) => {
    message.success(msg);
  }, 1000);
  const errorMessage = _.debounce((msg: string) => {
    message.error(msg);
  });
  // 从后端获取字典数据，并缓存到dictCache中
  const fetchAllDictsDetails = _.debounce(async () => {
    isLoading = true;
    try {
      dictCache.value = {};
      const result = await DictsApi.getAlllDictsDetails();
      for (const dict of result.list) {
        dictCache.value[dict.key] = dict.value;
      }
      successMessage("字典数据加载完成");
    } catch (error) {
    } finally {
      isLoading = false;
    }
  }, 1000);

  /**
   *
   * @param code 字典编码
   * @param value 字典详情编码
   * @example getDict("gender", "1") => 男
   * @returns
   */
  const getDict = (code: string, value: string) => {
    const key = `${code}:${value}`;
    const val = dictCache.value[key];
    if (val === void 0) {
      if (isLoading) return "DICT_NOT_FOUND";
      errorMessage(`字典数据不存在,请检查${key}是否存在。或者刷新页面`);
      // fetchAllDictsDetails()
      fetchAllDictsDetails();
      return "DICT_NOT_FOUND";
    }
    return val;
  };
  return {
    dictCache,
    fetchAllDictsDetails,
    getDict,
  };
});
