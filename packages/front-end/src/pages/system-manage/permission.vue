<route lang="json">
{
  "meta": {
    "title": "权限管理",
    "menuOrder": 3,
    "showInMenu": true,
    "breadcrumbName": ["系统管理", "权限管理"]
  }
}
</route>

<script setup lang="ts">
import { DictsApi } from "@/apis/modules/dicts";
import { PermissionApi } from "@/apis/modules/permissions";
import FormRenderer from "@/components/ant/form-renderer.vue";
import ContentContainer from "@/components/layouts/content-container.vue";
import { useTable } from "@/hooks/use-table";
import { useDictStore } from "@/stores/modules/use-dict-store";
import { commonDateFormatter } from "@/utils/time";
import {
  PlusOutlined,
  UndoOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue";
import { useAsyncState, useElementSize } from "@vueuse/core";
import { Input, message, Select } from "ant-design-vue";
import type { ColumnType } from "ant-design-vue/es/table";
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
    width: 150,
    fixed: "right",
  },
];
const conditions = ref({
  name: "",
  status: undefined,
});
const { tableState, queryOptions, search, isLoading, computedColumns } =
  useTable(PermissionApi.getList, {
    conditions,
    autoCalculateColumnWidth: {
      enabled: true,
      columns,
    },
  });
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
  state: statusState,
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
const createFormItems = [
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
];
const updateFormItems = [
  ...createFormItems,
  {
    key: "status",
    label: "状态",
    name: "status",
    component: Select,
    attrs: () => ({
      placeholder: "请选择状态",
      options: statusState.value.list,
    }),
  },
];
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
const searchFormContainerRef = useTemplateRef<HTMLDivElement>(
  "searchFormContainerRef"
);
const { height: searchFormContainerHeight } = useElementSize(
  searchFormContainerRef
);
const aTableContainerStyle = computed(() => {
  return {
    height: `calc(100% - ${searchFormContainerHeight.value}px - 30px)`,
    width: "100%",
  };
});
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

    <section ref="searchFormContainerRef">
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
              :options="statusState.list"
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
          <SearchOutlined></SearchOutlined>
          <span class="ml-2">搜索</span>
        </a-button>
        <a-button @click="handleReset">
          <UndoOutlined></UndoOutlined>
          <span class="ml-2">重置</span>
        </a-button>
        <a-button type="primary" @click="handleClickAdd">
          <PlusOutlined></PlusOutlined>
          <span class="ml-2">新增</span>
        </a-button>
      </div>
    </section>

    <section :style="aTableContainerStyle">
      <a-table
        :columns="computedColumns"
        :data-source="tableState.list"
        :pagination="queryOptions"
        :loading="isLoading"
        :rowKey="(record) => record.id"
        :scroll="{ y: 'max-content', x: '100%' }"
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
