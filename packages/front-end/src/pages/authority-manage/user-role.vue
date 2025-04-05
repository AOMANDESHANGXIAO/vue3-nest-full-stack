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
import { useAsyncState } from '@vueuse/core'
import {
  PlusOutlined,
  UndoOutlined,
  SearchOutlined,
} from '@ant-design/icons-vue'
import type {
  CreateRoleInterface,
  GetRoleListResult,
  RoleOperatorRecord,
} from '@v3-nest-full-stack/shared-types'
import { type FormInstance, message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import _ from 'lodash'
import type { ColumnType } from 'ant-design-vue/es/table'
import { commonDateFormatter } from '@/utils/time'

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
    width: 150,
    align: 'center',
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
  async onChange(page: number, pageSize: number){
    this.current = page
    this.pageSize = pageSize
    await nextTick()
    handleSearch()
  },
}
const queryOptions = ref(_.cloneDeep(defaultQueryOptions))
const queryParams = computed(() => {
  return {
    keyWord: queryOptions.value.keyWord,
    current: queryOptions.value.current,
    pageSize: queryOptions.value.pageSize,
  }
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
  queryOptions.value = { ...defaultQueryOptions }
  await nextTick()
  handleSearch()
}
const isModalOpen = ref(false)
</script>

<template>
  <ContentContainer>
    <a-modal
      v-model:open="isModalOpen"
      ok-text="确定"
      cancel-text="取消"
      @ok=""
    >
      <template #title>新增角色</template>
      <!-- <a-form
        layout="horizontal"
        ref="formRef"
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
      </a-form> -->
    </a-modal>

    <!--- 搜索表单 --->
    <a-form layout="inline" class="mb-4 relative">
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
        <a-button type="primary" class="ml-2" @click="">
          <PlusOutlined />
          <span>新增</span>
        </a-button>
      </a-form-item>
    </a-form>

    <!--- 表格区域 --->
    <a-table
      :columns="columns"
      :data-source="state.list"
      v-model:pagination="queryOptions"
      :loading="isLoading"
      bordered
    >
      <template #headerCell="{ column }">
        <span class="font-bold">{{ column.title }}</span>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'action'">
          <div class="flex items-center">
            <a-button type="primary" class="mr-2"> 编辑</a-button>
            <a-popconfirm
              title="你确定吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm=""
            >
              <a-button danger>删除</a-button>
            </a-popconfirm>
          </div>
        </template>
      </template>
    </a-table>
  </ContentContainer>
</template>

<style lang="scss" scoped></style>
