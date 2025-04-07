<route lang="json">
{
  "meta": {
    "title": "分配角色",
    "menuOrder": 2,
    "showInMenu": true,
    "breadcrumbName": "分配角色"
  }
}
</route>

<!-- 为用户分配权限 -->
<script lang="ts" setup>
import ContentContainer from '@/components/layouts/content-container.vue'
import { UserApi } from '@/apis/modules/user'
import { RolesApi } from '@/apis/modules/roles'
import { useAsyncState, useResizeObserver } from '@vueuse/core'
import type {
  AdminAddUserDtoInterface,
  UpdateUserDtoInterface,
} from '@v3-nest-full-stack/shared-types'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  UndoOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue'
import _ from 'lodash'
import type { ColumnType } from 'ant-design-vue/es/table'
import { useElementSize } from '@vueuse/core'
import { commonDateFormatter } from '@/utils/time'
import type { FormInstance, Rule } from 'ant-design-vue/es/form'
import type { FindAllUsersApiResult } from '@v3-nest-full-stack/shared-types'
import AsyncFormRender from '@/components/ant/async-form-render.vue'

defineOptions({
  name: 'role',
})
const columns: ColumnType[] = [
  {
    title: '账号',
    dataIndex: 'username',
    key: 'username',
    align: 'center',
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
    align: 'center',
  },
  {
    title: '角色',
    dataIndex: 'roles',
    key: 'roles',
    align: 'center',
    customRender: ({ record }: { record: any }) => {
      return record.roles.map((item: any) => item.name).join(',') || '普通用户'
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    customRender: ({ text }) => commonDateFormatter(text),
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    customRender: ({ text }) => commonDateFormatter(text),
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text }) => {
      return text ? '启用' : '禁用'
    },
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 100,
    align: 'center',
    fixed: 'right',
  },
]
const defaultQueryOptions = {
  showSizeChanger: true,
  showQuickJumper: true,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSize: 5,
  current: 1,
  keyWord: '',
  pageSizeOptions: ['5', '10', '20', '50'],
  async onChange(current: number, pageSize: number) {
    this.current = current
    this.pageSize = pageSize
    await nextTick()
    handleSearch()
  },
}
const queryOptions = ref(_.cloneDeep(defaultQueryOptions))
const queryParams = computed(() => {
  return _.pick(queryOptions.value, ['keyWord', 'current', 'pageSize'])
})
const { state, isLoading, execute } = useAsyncState(
  UserApi.getAllUsers,
  {
    list: [],
    total: 0,
  },
  {
    immediate: false,
    onSuccess(data) {
      queryOptions.value.total = data.total
    },
  }
)
onMounted(() => {
  handleSearch()
})

const handleSearch = () => {
  execute(0, queryParams.value)
}
const handleReset = async () => {
  queryOptions.value = _.cloneDeep(defaultQueryOptions)
  await nextTick()
  handleSearch()
}
const isModalOpen = ref(false)
const searchFormRef = useTemplateRef('searchFormRef')
const { height: searchFormHeight } = useElementSize(searchFormRef)
const formStatus = ref('add')
const addUserformData = ref<AdminAddUserDtoInterface>({
  nickname: '',
  username: '',
  password: '',
  roleIds: [],
})
const addUserformRules: Record<string, Rule[]> = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 20, message: '账号长度在3到20个字符之间', trigger: 'blur' },
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在2到20个字符之间', trigger: 'blur' },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_\-\s·]+$/,
      message: '昵称只能包含中文、字母、数字和下划线',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码长度在6到20个字符之间', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,15}$/,
      message: '密码必须包含至少一个大写字母、一个小写字母和一个数字',
      trigger: 'blur',
    },
  ],
}
const handleClickAdd = () => {
  handleSubmit = addUser
  formStatus.value = 'add'
  isModalOpen.value = true
  console.log('addUserformData', addUserformData.value)
  console.log('addUserItems', addUserFormItems.value)
}
const {
  state: rolesState,
  isLoading: rolesLoading,
  execute: rolesExecute,
} = useAsyncState(
  RolesApi.getAllRoles,
  {
    list: [],
  },
  {
    onSuccess(data) {
      console.log('get all roles', data)
    },
    immediate: true,
  }
)
const searchRoles = _.debounce(async (value: string) => {
  if (value) {
    await rolesExecute(0, { keyWord: value })
  } else {
    await rolesExecute(0, {})
  }
}, 500)
const rolesData = computed(() => {
  return rolesState.value.list.map((item: { id: string; name: string }) => {
    return {
      label: item.name,
      value: item.id,
    }
  })
})
const isAddUserLoading = ref(false)
const formRef = useTemplateRef<FormInstance>('formRef')
const addUser = async () => {
  try {
    isModalOpen.value = true
    await formRef.value?.validate()
    await UserApi.addUser(addUserformData.value)
    message.success('添加成功')
    addUserformData.value = {
      nickname: '',
      username: '',
      password: '',
      roleIds: [],
    }
    handleSearch()
    isModalOpen.value = false
  } catch (error) {
    console.error(error)
  } finally {
    isAddUserLoading.value = false
  }
}
let handleSubmit = addUser
const addUserFormItems = ref([
  {
    key: 'username',
    label: '账号',
    name: 'username',
    component: 'Input',
    attrs: {
      placeholder: '请输入',
    },
  },
  {
    key: 'nickname',
    label: '昵称',
    name: 'nickname',
    component: 'Input',
    attrs: {
      placeholder: '请输入',
    },
  },
  {
    key: 'password',
    label: '密码',
    name: 'password',
    component: 'Input',
    attrs: {
      placeholder: '请输入',
    },
  },
  {
    key: 'roles',
    label: '角色',
    name: 'roles',
    component: 'Select',
    attrs: () => {
      return {
        mode: 'multiple',
        placeholder: '请选择',
        options: rolesData.value,
        loading: rolesLoading.value,
        filterOption: false,
        showSearch: true,
        allowClear: true,
        notFoundContent: rolesLoading ? '加载中...' : '暂无数据',
        onSearch: (value: string) => {
          searchRoles(value)
        },
      }
    },
  },
])

const editUserFormData = ref<UpdateUserDtoInterface>({
  nickname: '',
  username: '',
  password: '',
  roleIds: [],
  status: true,
})
const editUserformRules: Record<string, Rule[]> = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 20, message: '账号长度在3到20个字符之间', trigger: 'blur' },
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在2到20个字符之间', trigger: 'blur' },
    {
      pattern: /^[\u4e00-\u9fa5a-zA-Z0-9_\-\s·]+$/,
      message: '昵称只能包含中文、字母、数字和下划线',
      trigger: 'blur',
    },
  ],
}
const editFormItems = ref([
  {
    key: 'username',
    label: '账号',
    name: 'username',
    component: 'Input',
    attrs: {
      placeholder: '请输入',
      disabled: true,
    },
  },
  {
    key: 'nickname',
    label: '昵称',
    name: 'nickname',
    component: 'Input',
    attrs: {
      placeholder: '请输入',
    },
  },
  {
    key: 'roleIds',
    label: '角色',
    name: 'roleIds',
    component: 'Select',
    attrs: () => {
      return {
        mode: 'multiple',
        placeholder: '请选择',
        options: rolesData.value,
        loading: rolesLoading.value,
        defaultValue: editUserFormData.value.roleIds,
        key: `${Date.now()}`,
        filterOption: false,
        showSearch: true,
        allowClear: true,
        notFoundContent: rolesLoading ? '加载中...' : '暂无数据',
        onSearch: (value: string) => {
          searchRoles(value)
        },
      }
    },
  },
  {
    key: 'status',
    label: '状态',
    name: 'status',
    component: 'Select',
    attrs: () => {
      return {
        placeholder: '请选择',
        options: [
          {
            label: '启用',
            value: true,
          },
          {
            label: '禁用',
            value: false,
          },
        ],
        defaultValue: true,
      }
    },
  },
])
const editUser = async () => {
  try {
    await formRef.value?.validate()
    await UserApi.updateUser(id, editUserFormData.value)
    message.success('编辑成功')
    editUserFormData.value = {
      nickname: '',
      username: '',
      password: '',
      roleIds: [],
      status: true,
    }
    handleSearch()
  } catch (error) {
    console.error(error)
  } finally {
    isAddUserLoading.value = false
  }
}

let id = ''
const handleClickEdit = async (
  record: FindAllUsersApiResult['list'][number]
) => {
  isModalOpen.value = true
  id = record.id
  formStatus.value = 'edit'
  editUserFormData.value = {
    ...editUserFormData.value,
    username: record.username,
    nickname: record.nickname,
    roleIds: record.roles.map(item => item.id),
    status: record.status,
  }
  console.log('editUserFormData', editUserFormData.value)
  handleSubmit = editUser
}
// TODO: 1. 当页面大小发生变化时应该重新绘制ant-table
const contentContainerRef = useTemplateRef('contentContainerRef')
const aTableKey = ref(`a-table-${Date.now()}`)
const updateTable = () => {
  aTableKey.value = `a-table-${Date.now()}`
}
useResizeObserver(
  contentContainerRef,
  _.debounce(() => {
    console.log('resize')
    updateTable()
  }, 1000)
)
</script>

<template>
  <ContentContainer ref="contentContainerRef">
    <a-modal
      v-model:open="isModalOpen"
      ok-text="确定"
      cancel-text="取消"
      @ok="handleSubmit"
    >
      <template #title>{{
        formStatus === 'add' ? '新增用户' : '编辑用户'
      }}</template>
      <Suspense>
        <template #fallback>
          <div>Loading model</div>
        </template>
        <template #default>
          <AsyncFormRender
            v-if="isModalOpen"
            ref="formRef"
            :model="formStatus === 'add' ? addUserformData : editUserFormData"
            :rules="formStatus === 'add' ? addUserformRules : editUserformRules"
            :items="formStatus === 'add' ? addUserFormItems : editFormItems"
          ></AsyncFormRender>
        </template>
      </Suspense>
    </a-modal>

    <!--- 搜索表单 --->
    <a-form layout="inline" class="mb-4 relative" ref="searchFormRef">
      <a-form-item label="角色名称">
        <a-input v-model:value="queryOptions.keyWord" placeholder="请输入" />
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
        <a-button type="primary" class="ml-2" @click="handleClickAdd">
          <PlusOutlined />
          <span>新增</span>
        </a-button>
      </a-form-item>
    </a-form>

    <section
      class="w-full"
      :style="{ height: `calc(100% - ${searchFormHeight}px - 30px)` }"
    >
      <!--- 表格区域 --->
      <a-table
        :row-key="record => record.id"
        :columns="columns"
        :data-source="state.list"
        v-model:pagination="queryOptions"
        :scroll="{ x: '100%', y: 'max-content' }"
        :loading="isLoading"
      >
        <template #headerCell="{ column }">
          <span class="font-bold">{{ column.title }}</span>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'action'">
            <div class="flex items-center justify-center p-x-2px">
              <a-button
                type="primary"
                @click="
                  handleClickEdit(
                    record as FindAllUsersApiResult['list'][number]
                  )
                "
              >
                编辑</a-button
              >
            </div>
          </template>
        </template>
      </a-table>
    </section>
  </ContentContainer>
</template>

<style lang="scss" scoped>
// WARNING: 如果你使用了ant-design的table组件一定要引用这个样式
// 这个样式用来解决表格的宽度和高度自适应问题
@import url('@/styles/a-table.scss');
</style>
