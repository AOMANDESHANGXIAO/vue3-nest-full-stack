import { useAsyncState } from "@vueuse/core";
import type { ColumnType } from "ant-design-vue/es/table";
import _ from "lodash";
import type { Reactive, Ref } from "vue";

let context: CanvasRenderingContext2D | null = null;
(() => {
  const canvas = document.createElement("canvas");
  context = canvas.getContext("2d");
})();

const getProxyValue = (value: any) => {
  if (isRef(value)) {
    return value.value;
  } else if (isReactive(value)) {
    return toRaw(value);
  }
  return value;
};

// TODO: 实现自动计算每一列的width
// 默认字体为微软雅黑 Microsoft YaHei,字体大小为 14px
function getTextWidth(text: string, font = "14px Microsoft YaHei") {
  if (!context) {
    return 0;
  }
  context.font = font;
  const textmetrics = context.measureText(text);
  return textmetrics.width;
}

const calculateColumnWidth = (
  columns: ColumnType[],
  data: any[],
  options: {
    padding: number;
    font: string;
  } = {
    padding: 35,
    font: "14px Microsoft YaHei",
  }
) => {
  // 定义一个 Map 接收每列的长度值
  let widthMap = new Map();
  // columns 为动态表格的表头数组 data为展示数据的数组
  //作用是遍历所有数据拿到长度，记下每一列的宽度
  data.forEach((target) => {
    for (let key in target) {
      if (target.hasOwnProperty(key)) {
        let keyWidth = getTextWidth(target[key]);
        // 字段有值就放入数组
        widthMap.has(key)
          ? widthMap.set(key, widthMap.get(key).concat([keyWidth]))
          : widthMap.set(key, [keyWidth]);
      }
    }
  });

  // 计算平均值,保证列宽尽量保持均衡
  for (let [mapKey] of widthMap) {
    let valueArr = widthMap.get(mapKey);
    let len = valueArr.length;
    let value = valueArr.reduce((acc: number, cur: number) => acc + 1 / cur, 0);
    widthMap.set(mapKey, len / value);
  }

  //遍历表头，拿到对应表头的宽度与对应表头下内容比对，取最大值作为列宽，这样可以确保表头不换行。
  return columns.map((item) => {
    // 如果列宽已经设置，则直接返回
    if (item.width) {
      return {
        ...item,
        width: item.width,
      };
    }
    // title，dataIndex为 ant design Table对应参数
    let textWidth = getTextWidth(item.title as string);
    if (widthMap.get(item.dataIndex) < textWidth) {
      widthMap.set(item.dataIndex, textWidth);
    }
    return {
      ...item,
      width: Math.ceil(widthMap.get(item.dataIndex)) + options.padding,
    };
  });
};

// TODO: 实现根据列的宽度自动换行

/**
 * 基于ant-design-vue的表格组件封装的hooks
 */
export function useTable(
  api: (params: any) => Promise<any>,
  options?: {
    conditions?: Ref<any> | Reactive<any>;
    autoCalculateColumnWidth?: {
      enabled: boolean;
      padding?: number;
      font?: string;
      columns: ColumnType[];
    };
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
  const optionsFilter = () => {
    if (!options || !options.conditions || !_.isEmpty(options.conditions)) {
      return {
        pageSize: queryOptions.value.params.pageSize,
        current: queryOptions.value.params.current,
      };
    }
    const conditions = getProxyValue(options.conditions);
    return {
      pageSize: queryOptions.value.params.pageSize,
      current: queryOptions.value.params.current,
      conditions: _.pickBy(conditions, isValueCanBePicked),
    };
  };
  const queryParams = computed(optionsFilter);
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

  const computedColumns = computed(() => {
    if (options?.autoCalculateColumnWidth?.enabled) {
      return calculateColumnWidth(
        getProxyValue(options.autoCalculateColumnWidth.columns),
        tableState.value.list,
        {
          padding:
            getProxyValue(options.autoCalculateColumnWidth.padding) ?? 35,
          font:
            getProxyValue(options.autoCalculateColumnWidth.font) ??
            "14px ali",
        }
      );
    }
    return options?.autoCalculateColumnWidth?.columns;
  });

  return {
    queryOptions,
    queryParams,
    isLoading,
    tableState,
    search,
    computedColumns,
  };
}
