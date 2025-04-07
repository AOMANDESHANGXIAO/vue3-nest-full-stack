<route lang="json">
{
  "meta": {
    "title": "字典管理",
    "menuOrder": 1,
    "showInMenu": true,
    "breadcrumbName": "字典管理"
  }
}
</route>

<script setup lang="ts">
import ContentContainer from "@/components/layouts/content-container.vue";
import AsyncFormRender from "@/components/ant/async-form-render.vue";
import type { ColumnType } from "ant-design-vue/es/table";
import { commonDateFormatter } from "@/utils/time";
import { useAsyncState } from "@vueuse/core";
import { DictsApi } from "@/apis/modules/dicts";
import _ from "lodash";
import { useElementSize } from "@vueuse/core";

defineOptions({
  name: "dict",
});
const defaultQueryOptions = {
  showSizeChanger: true,
  showQuickJumper: true,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSize: 5,
  current: 1,
  pageSizeOptions: ["5", "10", "20", "50"],
  async onChange(current: number, pageSize: number) {
    this.current = current;
    this.pageSize = pageSize;
    await nextTick();
    handleSearch();
  },
};
const queryOptions = ref(_.cloneDeep(defaultQueryOptions));
const { state, execute, isLoading } = useAsyncState(
  DictsApi.getDictList,
  {
    list: [],
    total: 0,
  },
  {
    immediate: false,
    onSuccess(res) {
      queryOptions.value.total = res.total;
    },
  }
);
const handleSearch = async () => {
  await execute(0, _.pick(queryOptions.value, ["current", "pageSize"]));
};
onMounted(() => {
  handleSearch();
});
const columns: ColumnType<any>[] = [
  {
    title: "编码",
    dataIndex: "code",
    key: "code",
    align: "center",
  },
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
    align: "center",
  },
  {
    title: "描述",
    dataIndex: "desc",
    key: "desc",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
    customRender: ({ text }: { text: string }) => {
      return commonDateFormatter(text);
    },
    align: "center",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    key: "updateTime",
    customRender: ({ text }: { text: string }) => {
      return commonDateFormatter(text);
    },
    align: "center",
  },
];

const searchFormRef = useTemplateRef("searchFormRef");
const { height } = useElementSize(searchFormRef);
const tableContainerStyle = computed(() => {
  return {
    height: `calc(100% - ${height.value}px)`,
    width: "100%",
  };
});
</script>

<template>
  <ContentContainer>
    <!-- search form -->
    <div ref="searchFormRef"></div>
    <!-- table -->
    <div :style="tableContainerStyle">
      <a-table
        :columns="columns"
        :data-source="state.list"
        :pagination="queryOptions"
        :loading="isLoading"
        :scroll="{ x: '100%', y: 'max-content' }"
      >
      </a-table>
    </div>
  </ContentContainer>
</template>

<style scoped lang="scss">
@import url("@/styles/a-table.scss");
</style>
