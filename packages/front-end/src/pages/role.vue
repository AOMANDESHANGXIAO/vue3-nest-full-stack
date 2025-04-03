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
import {
  PlusOutlined,
  UndoOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import { type CreateRoleInterface } from "@v3-nest-full-stack/shared-types";
import { type FormInstance, message } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";

defineOptions({
  name: "role",
});
const columns = [
  {
    title: "角色名称",
    dataIndex: "name",
    key: "name",
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
    dataIndex: "action",
    key: "action",
    width: 150,
  },
];
const defaultQueryParams = {
  roleName: "", // 角色名称
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
  handleSearch();
});

const handleSearch = () => {
  execute(0, queryParams.value);
};
const handleReset = () => {
  queryParams.value = { ...defaultQueryParams };
  handleSearch();
};
const isModalOpen = ref(false);
const handleOpenModal = () => {
  isModalOpen.value = true;
};
const formData = ref<CreateRoleInterface>({
  name: "",
  desc: "",
});
const formRef = ref<FormInstance>();
const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: "角色名称不能为空", trigger: "blur" },
    { max: 50, message: "名称长度不能超过50个字符", trigger: "blur" },
  ],
  desc: [
    { required: true, message: "角色描述不能为空", trigger: "blur" },
    { max: 200, message: "描述长度不能超过200个字符", trigger: "blur" },
  ],
};
const isConfirmLoading = ref(false);
const handleSubmit = async () => {
  try {
    isConfirmLoading.value = true;
    await formRef.value?.validate();
    await RolesApi.createRole(formData.value);
    message.success("创建成功");
    isModalOpen.value = false;
    formRef.value?.resetFields();
    handleSearch();
  } catch (e) {
    console.error(e);
  } finally {
    isConfirmLoading.value = false;
  }
};
</script>

<template>
  <ContentContainer>
    <a-modal
      v-model:open="isModalOpen"
      ok-text="确定"
      cancel-text="取消"
      :confirm-loading="isConfirmLoading"
      @ok="handleSubmit"
    >
      <template #title>新增角色</template>
      <a-form
        layout="horizontal"
        :model="formData"
        ref="formRef"
        :rules="rules"
      >
        <a-row :gutter="10">
          <a-col :span="12">
            <a-form-item label="角色名称" name="name">
              <a-input v-model:value="formData.name" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="描述" name="desc">
              <a-textarea v-model:value="formData.desc" placeholder="请输入" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>

    <!--- 搜索表单 --->
    <a-form layout="inline" class="mb-4 relative">
      <a-form-item label="角色名称">
        <a-input v-model:value="queryParams.roleName" placeholder="请输入" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="handleSearch">
          <SearchOutlined />
          <span>查询</span>
        </a-button>
        <a-button class="ml-2" @click="handleReset">
          <UndoOutlined />
          <span>重置</span>
        </a-button>
      </a-form-item>
      <a-form-item class="absolute right-0">
        <a-button type="primary" class="ml-2" @click="handleOpenModal">
          <PlusOutlined />
          <span>新增</span>
        </a-button>
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
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'action'">
          <div class="flex items-center">
            <a-button type="primary" class="mr-2">编辑</a-button>
            <a-button danger>删除</a-button>
          </div>
        </template>
      </template>
    </a-table>
  </ContentContainer>
</template>

<style lang="scss" scoped></style>
