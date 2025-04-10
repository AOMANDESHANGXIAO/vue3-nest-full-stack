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
import {
  PlusOutlined,
  UndoOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import FormRenderer from "@/components/ant/form-renderer.vue";
import { Input, message, Select } from "ant-design-vue";

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
    dataIndex: ["createBy", "nickname"],
    key: "createBy",
    customRender: ({ text }) => {
      return text || "--";
    },
    align: "center",
  },
  {
    title: "更新者",
    dataIndex: ["updateBy", "nickname"],
    key: "updateBy",
    customRender: ({ text }) => {
      return text || "--";
    },
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
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
const formModalStatus = ref("create");
const isFormModalOpen = ref(false);
const createFormModel = ref({
  name: "",
  desc: "",
});
const updateFormModel = ref({
  name: "",
  desc: "",
  status: undefined,
});
const formRules = {
  name: [
    { required: true, message: "请输入权限名称" },
    { max: 50, message: "权限名称最多50个字符" },
  ],
  desc: [{ max: 200, message: "描述最多200个字符" }],
};
const createFormItems = ref([
  {
    key: "name",
    label: "权限名称",
    name: "name",
    component: Input,
  },
  {
    key: "desc",
    label: "描述",
    name: "desc",
    component: Input,
  },
]);
const updateFormItems = ref([
  ...createFormItems.value,
  {
    key: "status",
    label: "状态",
    name: "status",
    component: Select,
    attrs: () => ({
      placeholder: "请选择状态",
      options: statusSelectList.value.list,
    }),

  },
]);
const handleClickAdd = () => {
  isFormModalOpen.value = true;
  formModalStatus.value = "create";
};
let recordId = "";
const handleClickEdit = (record: any) => {
  isFormModalOpen.value = true;
  formModalStatus.value = "update";
  updateFormModel.value = record;
  recordId = record.id;
};
let handleSubmit = () => {
  if (formModalStatus.value === "create") {
    create();
  } else {
    update();
  }
};
const formRef = useTemplateRef<InstanceType<typeof FormRenderer>>("formRef");
let isCreateLoading = ref(false);
const create = () => {
  if (isCreateLoading.value) {
    return;
  }
  if (!formRef.value) {
    return;
  }
  const form = formRef.value.getFormRef();
  if (!form) {
    return;
  }
  isCreateLoading.value = true;
  form
    .validate()
    .then(async () => {
      await PermissionApi.create(createFormModel.value);
      message.success("新增权限成功");
      isFormModalOpen.value = false;
      search();
    })
    .catch()
    .finally(() => {
      isCreateLoading.value = false;
    });
};
let isUpdateLoading = ref(false);
const update = () => {
  if (isUpdateLoading.value) {
    return;
  }
  if (!formRef.value) {
    return;
  }
  const form = formRef.value.getFormRef();
  if (!form) {
    return;
  }
  isUpdateLoading.value = true;
  form
    .validate()
    .then(async () => {
      await PermissionApi.update(recordId, updateFormModel.value);
      message.success("更新权限成功");
      isFormModalOpen.value = false;
      search();
    })
    .catch()
    .finally(() => {
      isUpdateLoading.value = false;
    });
};
let isDeleteLoading = ref(false);
const _delete = (record: any) => {
  if (isDeleteLoading.value) {
    return;
  }
  isDeleteLoading.value = true;
  PermissionApi.delete(record.id)
    .then(async () => {
      message.success("删除权限成功");
      isFormModalOpen.value = false;
      search();
    })
    .catch()
    .finally(() => {
      isDeleteLoading.value = false;
    });
};
</script>

<template>
  <ContentContainer>
    <a-modal v-model:open="isFormModalOpen">
      <template #title>
        {{ formModalStatus === "create" ? "新增权限" : "编辑权限" }}
      </template>
      <FormRenderer
        v-if="isFormModalOpen"
        ref="formRef"
        :model="
          formModalStatus === 'create' ? createFormModel : updateFormModel
        "
        :rules="formRules"
        :items="
          formModalStatus === 'create' ? createFormItems : updateFormItems
        "
      ></FormRenderer>
      <template #footer>
        <a-button @click="isFormModalOpen = false" key="back"> 取消 </a-button>
        <a-button
          type="primary"
          @click="handleSubmit"
          key="submit"
          :loading="isCreateLoading || isUpdateLoading"
        >
          {{ formModalStatus === "create" ? "新增" : "更新" }}
        </a-button>
      </template>
    </a-modal>
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
      <div class="flex flex-wrap gap-4 mb-4">
        <a-button type="primary" @click="handleSearch">
          <SearchOutlined />
          <span class="ml-2">搜索</span>
        </a-button>
        <a-button @click="handleReset">
          <UndoOutlined />
          <span class="ml-2">重置</span>
        </a-button>
        <a-button type="primary" @click="handleClickAdd">
          <PlusOutlined />
          <span class="ml-2">新增</span>
        </a-button>
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
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <div class="flex items-center gap-2">
              <a-button
                type="primary"
                @click="handleClickEdit(record)"
                class="mr-2"
                >编辑</a-button
              >
              <a-popconfirm
                title="确定删除该权限吗？"
                @confirm="_delete(record)"
                ok-text="确认"
                cancel-text="取消"
              >
                <a-button danger>删除</a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </section>
  </ContentContainer>
</template>

<style scoped lang="scss">
@import url("@/styles/a-table.scss");
</style>
