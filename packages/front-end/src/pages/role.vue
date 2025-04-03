<route lang="json">
{
  "meta": {
    "title": "角色管理",
    "icon": "user",
    "menuOrder": 3,
    "showInMenu": true,
    "breadcrumbName": "角色管理"
  }
}
</route>

<script lang="ts" setup>
import ContentContainer from "@/components/layouts/content-container.vue";
import { RolesApi } from "@/apis/modules/roles";
import { useAsyncState } from "@vueuse/core";

defineOptions({
  name: "role",
});
const columns = [
  {
    title: "角色名称",
    dataIndex: "name",
    key: "name",
    width: 200,
  },
  {
    title: "描述",
    dataIndex: "desc",
    key: "desc",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    customRender: ({ text }: { text: boolean }) => (text ? "启用" : "禁用"),
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
  },
  {
    title: "创建人",
    dataIndex: ["createdBy", "username"],
    key: "createdBy",
    customRender: ({
      record,
    }: {
      record: {
        createdBy: {
          id: string;
          status: boolean;
          nickname: string;
          username: string;
          createTime: Date;
          updateTime: Date;
        };
      };
    }) => record.createdBy.username,
  },
  {
    title: "操作",
    key: "action",
    width: 150,
  },
];
const defaultQueryParams = {
  roleName: "", // 角色名称
  status: "", // 状态
  page: 1, // 当前页码
  size: 5, // 每页显示条数
};
const queryParams = ref(defaultQueryParams);
const { state, isLoading, execute } = useAsyncState(
  RolesApi.getRoles,
  {
    list: [],
    total: 0,
  },
  {
    immediate: false,
  }
);
onMounted(() => {
  execute(0, queryParams.value);
});

const handleSearch = () => {
  execute(0, queryParams.value);
};
const handleReset = () => {
  queryParams.value = { ...defaultQueryParams };
  handleSearch()
};
</script>

<template>
  <ContentContainer>
    <!--- 搜索表单 --->
    <a-form layout="inline" class="mb-4">
      <a-form-item label="角色名称">
        <a-input v-model:value="queryParams.roleName" placeholder="请输入" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleSearch">查询</a-button>
        <a-button class="ml-2" @click="handleReset">重置</a-button>
      </a-form-item>
    </a-form>

    <!--- 表格区域 --->
    <a-table
      :columns="columns"
      :data-source="state.list"
      :pagination="{
        showSizeChanger: true,
        showQuickJumper: true,
        total:state.total,
        showTotal: (total:number) => `共 ${total} 条`,
      }"
      :loading="isLoading"
      bordered
    >
      <template #headerCell="{ column }">
        <span class="font-bold">{{ column.title }}</span>
      </template>
    </a-table>
  </ContentContainer>
</template>

<style lang="scss" scoped></style>
