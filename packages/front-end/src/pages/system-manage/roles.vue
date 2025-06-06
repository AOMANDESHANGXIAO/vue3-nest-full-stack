<route lang="json">
{
  "meta": {
    "title": "角色管理",
    "menuOrder": 1,
    "showInMenu": true,
    "breadcrumbName": ["系统管理", "角色管理"]
  }
}
</route>

<script lang="ts" setup>
import { DictsApi } from "@/apis/modules/dicts";
import { PermissionApi } from "@/apis/modules/permissions";
import { RolesApi } from "@/apis/modules/roles";
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
import {
  type CreateRoleInterface,
  type UpdateRoleInterface,
  type GetRoleListResult,
  type RoleOperatorRecord,
  type QueryPermissionResult,
  STATUS,
} from "@v3-nest-full-stack/shared-types";
import { useAsyncState } from "@vueuse/core";
import { useElementSize } from "@vueuse/core";
import { type FormInstance, Input, message, Select } from "ant-design-vue";
import type { Rule } from "ant-design-vue/es/form";
import type { ColumnType } from "ant-design-vue/es/table";
import _ from "lodash";
import { vPermissions } from "@/directives/v-permissions";
import Tags from "@/components/ui/Tags.vue";
import { useSystemConfigStore } from "@/stores/modules/use-system-config-store";
import { rgbToHex } from "@/utils/color";
const { getDict } = useDictStore();

defineOptions({
  name: "role",
});
const systemConfigStore = useSystemConfigStore();
const tagColor = computed(() => {
  return rgbToHex(systemConfigStore.config.cssVars["--color-primary"]);
});
const columns: ColumnType[] = [
  {
    title: "角色名称",
    dataIndex: "name",
    key: "name",
    align: "center",
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    align: "center",
    customRender: ({ text }) => getDict("status", text),
  },
  {
    title: "描述",
    dataIndex: "desc",
    key: "desc",
    align: "center",
  },
  {
    title: "权限",
    dataIndex: "permissions",
    key: "permissions",
    align: "center",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
    align: "center",
    customRender: ({ text }) => commonDateFormatter(text),
  },
  {
    title: "创建人",
    dataIndex: ["createdBy", "username"],
    key: "createdBy",
    customRender: ({
      record,
    }: {
      record: {
        createdBy: RoleOperatorRecord;
      };
    }) => record.createdBy.username,
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "action",
    key: "action",
    width: 150,
    align: "center",
  },
];
const conditions = ref({
  name: "",
});
watch(
  conditions,
  _.debounce(() => {
    search();
  }, 500),
  {
    immediate: false,
    deep: true,
  }
);
const { tableState, search, isLoading, queryOptions } = useTable(
  RolesApi.getRoles,
  {
    conditions,
  }
);
onMounted(() => {
  search();
});
const handleReset = () => {
  conditions.value.name = "";
};
const isModalOpen = ref(false);
const formStatus = ref<"create" | "update">("create");
const handleCreate = () => {
  handleSubmit = create;
  isModalOpen.value = true;
  formStatus.value = "create";
};
const createFormData = ref<CreateRoleInterface>({
  name: "",
  desc: "",
  permissionIds: [],
});
const updateFormData = ref<UpdateRoleInterface>({
  name: "",
  desc: "",
  permissionIds: [],
  status: STATUS.ENABLE,
});
const createFormRendererItems = [
  {
    key: "name",
    label: "角色名称",
    name: "name",
    component: Input,
  },
  {
    key: "desc",
    label: "描述",
    name: "desc",
    component: Input.TextArea,
  },
  {
    key: "permissionIds",
    label: "权限",
    name: "permissionIds",
    component: Select,
    attrs: () => {
      return {
        mode: "multiple",
        options: permissions.value.map((item) => ({
          label: item.name,
          value: item.id,
        })),
        onPopupScroll: () => {
          fetchPagedPermissions(0, fetchPermissionsParmas);
        },
      };
    },
  },
];
const { state: statusState, execute: fetchstatusState } = useAsyncState(
  DictsApi.getSelectableDictList,
  {
    list: [],
  },
  {
    immediate: false,
  }
);
onMounted(() => {
  fetchstatusState(0, "status");
});
const updateFormRendererItems = [
  {
    key: "name",
    label: "角色名称",
    name: "name",
    component: Input,
  },
  {
    key: "desc",
    label: "描述",
    name: "desc",
    component: Input.TextArea,
  },
  {
    key: "permissionIds",
    label: "权限",
    name: "permissionIds",
    component: Select,
    attrs: () => {
      return {
        mode: "multiple",
        options: permissions.value.map((item) => ({
          label: item.name,
          value: item.id,
        })),
        onPopupScroll: () => {
          fetchPagedPermissions(0, fetchPermissionsParmas);
        },
      };
    },
  },
  {
    key: "status",
    label: "状态",
    name: "status",
    component: Select,
    attrs: () => {
      return {
        options: statusState.value.list,
      };
    },
  },
];
const permissions = ref<QueryPermissionResult["list"]>([]);
const fetchPermissionsParmas = {
  current: 1,
  pageSize: 10,
  conditions: {
    status: STATUS.ENABLE,
  },
};
const { execute: fetchPagedPermissions } = useAsyncState(
  PermissionApi.getList,
  {
    list: [],
    total: 0,
  },
  {
    immediate: false,
    onSuccess(data) {
      permissions.value = permissions.value.concat(data.list);
      fetchPermissionsParmas.current += 1;
    },
  }
);
onMounted(() => {
  fetchPagedPermissions(0, fetchPermissionsParmas);
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
const create = async () => {
  try {
    isConfirmLoading.value = true;
    await formRef.value?.validate();
    await RolesApi.createRole(createFormData.value);
    message.success("创建成功");
    isModalOpen.value = false;
    formRef.value?.resetFields();
    search();
  } catch (e) {
    console.error(e);
  } finally {
    isConfirmLoading.value = false;
  }
};
let handleSubmit = create;
let id = "";
const patch = async () => {
  try {
    isConfirmLoading.value = true;
    await formRef.value?.validate();
    await RolesApi.updateRole(id, updateFormData.value);
    message.success("更新成功");
    isModalOpen.value = false;
    formRef.value?.resetFields();
    search();
  } catch (e) {
    console.error(e);
  } finally {
    isConfirmLoading.value = false;
  }
};
const isDeleteLoading = ref(false);
const _delete = async () => {
  try {
    isDeleteLoading.value = true;
    await RolesApi.deleteRole(id);
    message.success("删除成功");
    search();
  } catch (e) {
    console.error(e);
  } finally {
    isDeleteLoading.value = false;
  }
};
const handleUpdate = (record: GetRoleListResult["list"][number]) => {
  id = record.id;
  formStatus.value = "update";
  handleSubmit = patch;
  updateFormData.value = {
    name: record.name,
    desc: record.desc,
    permissionIds: record.permissions.map((item) => item.id),
    status: record.status,
  };
  isModalOpen.value = true;
};
const handleDelete = (record: GetRoleListResult["list"][number]) => {
  id = record.id;
  _delete();
};
const searchFormRef = useTemplateRef<HTMLFormElement>("searchFormRef");
const { height: searchFormHeight } = useElementSize(searchFormRef);
const aTableWrapperStyle = computed(() => {
  return {
    height: `100% - ${searchFormHeight.value}px - 30px`,
  };
});
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
      <template #title>
        {{ formStatus === "create" ? "新增角色" : "编辑角色" }}
      </template>
      <FormRenderer
        v-if="isModalOpen"
        :model="formStatus === 'create' ? createFormData : updateFormData"
        :rules="rules"
        :items="
          formStatus === 'create'
            ? createFormRendererItems
            : updateFormRendererItems
        "
      ></FormRenderer>
    </a-modal>

    <!--- 搜索表单 --->
    <a-form ref="searchFormRef" layout="inline" class="mb-4 relative">
      <a-form-item label="角色名称">
        <a-input v-model:value="conditions.name" placeholder="请输入"></a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="search">
          <SearchOutlined></SearchOutlined>
          <span>查询</span>
        </a-button>
        <a-button class="ml-2" @click="handleReset">
          <UndoOutlined></UndoOutlined>
          <span>重置</span>
        </a-button>
      </a-form-item>
      <a-form-item class="absolute right-0">
        <a-button
          type="primary"
          class="ml-2"
          @click="handleCreate"
          v-permissions="['role:create']"
        >
          <PlusOutlined></PlusOutlined>
          <span>新增</span>
        </a-button>
      </a-form-item>
    </a-form>

    <!--- 表格区域 --->
    <section class="w-full" :style="aTableWrapperStyle">
      <a-table
        :columns="columns"
        :data-source="tableState.list"
        :scroll="{
          x: '100%',
          y: 'max-content',
        }"
        v-model:pagination="queryOptions"
        :loading="isLoading"
      >
        <template #headerCell="{ column }">
          <span class="font-bold">{{ column.title }}</span>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <div class="flex items-center justify-center">
              <a-button
                type="primary"
                class="mr-2"
                @click="
                  handleUpdate(record as GetRoleListResult['list'][number])
                "
              >
                编辑</a-button
              >
              <a-popconfirm
                title="你确定要删除吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="
                  handleDelete(record as GetRoleListResult['list'][number])
                "
              >
                <a-button
                  danger
                  :loading="isDeleteLoading"
                  v-permissions="['role:del']"
                  >删除</a-button
                >
              </a-popconfirm>
            </div>
          </template>
          <template v-else-if="column.dataIndex === 'permissions'">
            <Tags
              :tags="
                record.permissions.map(
                  (item: GetRoleListResult['list'][number]['permissions'][number]) =>
                    item.name
                )
              "
              :color="tagColor"
            />
          </template>
        </template>
      </a-table>
    </section>
  </ContentContainer>
</template>

<style lang="scss" scoped>
@import url("@/styles/a-table.scss");
</style>
