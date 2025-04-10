import _ from "lodash";
import { useAsyncState } from "@vueuse/core";
import type { Reactive, Ref } from "vue";
/**
 * 基于ant-design-vue的表格组件封装的hooks
 */
export function useTable(
  api: (params: any) => Promise<any>,
  options?: {
    conditions?: Ref<any> | Reactive<any>;
  }
) {
  const defaultQueryOptions = {
    showSizeChanger: true,
    showQuickJumper: true,
    total: 0,
    showTotal: (total: number) => `共 ${total} 条`,
    params: {
      pageSize: 5,
      current: 1,
    },
    pageSizeOptions: ["5", "10", "20", "50"],
    async onChange(current: number, pageSize: number) {
      this.params.current = current;
      this.params.pageSize = pageSize;
      await nextTick();
      search();
    },
  };
  const queryOptions = ref(_.cloneDeep(defaultQueryOptions));
  const isValueCanBePicked = (value: any) => {
    let val = value;
    if (isRef(value)) {
      val = value.value;
    } else if (isReactive(value)) {
      val = toRaw(value);
    }
    if (Array.isArray(val)) {
      return val.length > 0;
    } else if (typeof val === "object" && val !== null) {
      return !_.isEmpty(val);
    } else if (typeof val === "string") {
      return val.trim() !== "";
    } else {
      return val !== undefined && val !== null;
    }
  };
  const queryParams = computed(() => {
    if (
      options &&
      options.conditions !== undefined &&
      !_.isEmpty(options.conditions)
    ) {
      if (isRef(options.conditions)) {
        const selectedConditions = _.pickBy(
          options.conditions.value as object,
          isValueCanBePicked
        );
        return {
          pageSize: queryOptions.value.params.pageSize,
          current: queryOptions.value.params.current,
          conditions: selectedConditions,
        };
      }
      if (isReactive(options.conditions)) {
        const selectedConditions = _.pickBy(
          toRaw(options.conditions) as object,
          isValueCanBePicked
        );
        return {
          pageSize: queryOptions.value.params.pageSize,
          current: queryOptions.value.params.current,
          conditions: selectedConditions,
        };
      }
    }
    return {
      pageSize: queryOptions.value.params.pageSize,
      current: queryOptions.value.params.current,
    };
  });
  const {
    state: tableState,
    isLoading,
    execute,
  } = useAsyncState(
    () => api(queryParams.value),
    {
      total: 0,
      list: [],
    },
    {
      onSuccess(res) {
        queryOptions.value.total = res.total;
      },
      immediate: false,
    }
  );
  const search = () => {
    execute();
  };

  return {
    queryOptions,
    queryParams,
    isLoading,
    tableState,
    search,
  };
}
