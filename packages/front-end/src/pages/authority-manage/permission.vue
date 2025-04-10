<route lang="json">
{
  "meta": {
    "title": "权限",
    "menuOrder": 3,
    "showInMenu": true,
    "breadcrumbName": "权限"
  }
}
</route>

<script setup lang="ts">
import ContentContainer from "@/components/layouts/content-container.vue";
import type { ColumnType } from "ant-design-vue/es/table";
import { useTable } from "@/hooks/use-table";
import { PermissionApi } from "@/apis/modules/permissions";
import { useDictStore } from "@/stores/modules/use-dict-store";
import { DictsApi } from "@/apis/modules/dicts";
import { commonDateFormatter } from "@/utils/time";
import { useAsyncState } from "@vueuse/core";
import _ from "lodash";

defineOptions({
  name: "permission",
});
const { getDict } = useDictStore();
const columns: ColumnType[] = [
  {
    title: "权限名称",
    dataIndex: "name",
    key: "name",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    customRender: ({ text }) => {
      return getDict("status", text);
    },
    align: "center",
  },
  {
    title: "描述",
    dataIndex: "desc",
    key: "desc",
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
    customRender: ({ text }) => {
      return commonDateFormatter(text);
    },
    align: "center",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    key: "updateTime",
    customRender: ({ text }) => {
      return commonDateFormatter(text);
    },
    align: "center",
  },
  {
    title: "创建者",
    dataIndex: "createBy.nickname",
    key: "createBy",
    customRender: ({ text }) => {
      return text || "--";
    },
    align: "center",
  },
  {
    title: "更新者",
    dataIndex: "updateBy.nickname",
    key: "updateBy",
    customRender: ({ text }) => {
      return text || "--";
    },
    align: "center",
  },
];
const conditions = ref({
  name: "",
  status: undefined,
});
const { tableState, queryOptions, search, isLoading } = useTable(
  PermissionApi.getList,
  {
    conditions,
  }
);
watch(
  conditions,
  _.debounce(() => {
    search();
  }, 500),
  {
    deep: true,
    immediate: false,
  }
);
const handleSearch = () => {
  search();
};
const handleReset = () => {
  conditions.value = {
    name: "",
    status: undefined,
  };
};
onMounted(() => {
  search();
});
const {
  execute,
  state: statusSelectList,
  isLoading: fetchStatusLoading,
} = useAsyncState(
  DictsApi.getSelectableDictList,
  {
    list: [],
  },
  {
    immediate: false,
  }
);
onMounted(() => {
  execute(0, "status");
});
</script>

<template>
  <ContentContainer>
    <section>
      <a-form layout="inline" class="mb-4">
        <div class="flex flex-wrap gap-4">
          <a-form-item label="权限名称">
            <a-input
              v-model:value="conditions.name"
              placeholder="请输入权限名称"
            ></a-input>
          </a-form-item>
          <a-form-item label="状态">
            <a-select
              v-model:value="conditions.status"
              placeholder="请选择状态"
              :options="statusSelectList.list"
              :loading="fetchStatusLoading"
              :style="{
                width: '200px',
              }"
            >
            </a-select>
          </a-form-item>
        </div>
      </a-form>
      <div class="flex flex-wrap gap-4">
        <a-form-item>
          <a-button type="primary" @click="handleSearch"> 查询 </a-button>
        </a-form-item>
        <a-form-item>
          <a-button @click="handleReset"> 重置 </a-button>
        </a-form-item>
      </div>
    </section>
    <section class="w-full">
      <a-table
        :columns="columns"
        :data-source="tableState.list"
        :pagination="queryOptions"
        :loading="isLoading"
        :rowKey="(record) => record.id"
        :scroll="{ y: 'max-content' }"
        :bordered="false"
      ></a-table>
    </section>
  </ContentContainer>
</template>

<style scoped lang="scss">
@import url("@/styles/a-table.scss");
</style>
