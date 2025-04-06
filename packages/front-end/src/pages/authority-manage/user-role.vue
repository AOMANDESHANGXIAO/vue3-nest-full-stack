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
import { useAsyncState } from '@vueuse/core'
import type { AdminAddUserDtoInterface } from '@v3-nest-full-stack/shared-types'
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
    width: 170,
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
// TODO: 完成新增用户功能
const formData = ref<AdminAddUserDtoInterface>({
  nickname: '',
  username: '',
  password: '',
  roleIds: [],
})
const formRules: Record<string, Rule[]> = {
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
  isModalOpen.value = true
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
    await UserApi.addUser(formData.value)
    message.success('添加成功')
    formData.value = {
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
</script>

<template>
  <ContentContainer>
    <a-modal
      v-model:open="isModalOpen"
      ok-text="确定"
      cancel-text="取消"
      @ok="handleSubmit"
    >
      <template #title>添加用户</template>
      <a-form
        layout="horizontal"
        ref="formRef"
        :model="formData"
        :rules="formRules"
      >
        <a-row :gutter="10">
          <a-col :span="12">
            <a-form-item label="账号" name="username">
              <a-input v-model:value="formData.username" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="昵称" name="nickname">
              <a-input v-model:value="formData.nickname" placeholder="请输入" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="10">
          <a-col :span="12">
            <a-form-item label="密码" name="password">
              <a-input v-model:value="formData.password" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="角色" name="roles">
              <a-select
                v-model:value="formData.roleIds"
                :options="rolesData"
                :loading="rolesLoading"
                :filter-option="false"
                :show-search="true"
                :allow-clear="true"
                :not-found-content="rolesLoading ? '加载中...' : '暂无数据'"
                mode="multiple"
                placeholder="请选择"
                @search="searchRoles($event)"
              >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
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
            <div class="flex items-center justify-between p-x-2px">
              <a-button
                type="primary"
                @click="
                  () => {
                    console.log(record)
                  }
                "
              >
                编辑</a-button
              >
              <a-popconfirm
                title="你确定吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm=""
              >
                <a-button danger>{{
                  record.status ? '禁用' : '启用'
                }}</a-button>
              </a-popconfirm>
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
