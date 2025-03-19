<route lang="json">
{
  "meta": {
    "title": "教师信息",
    "menuOrder": 1,
    "showInMenu": true,
    "breadcrumbName": "教师信息"
  }
}
</route>

<script lang="ts" setup>
import ContentContainer from '@/components/layouts/ContentContainer.vue'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { useAsyncState } from '@vueuse/core'
import type { TablePaginationConfig } from 'ant-design-vue'
import { TeacherApi } from '@/apis/modules/teacher'

defineOptions({
  name: 'info',
})
const sesrchFormModel = reactive({
  name: '',
  department: '',
})
const columns = [
  {
    title: '工号',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '所属院系',
    dataIndex: 'department',
    key: 'department',
  },
  {
    title: '在职状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '操作',
    key: 'action',
  },
]

const { state, isLoading, execute } = useAsyncState(TeacherApi.getTeacherInfo, {
  list: [],
  total: 0,
},{
  onSuccess:(res)=>{
    pagination.value.total = res.total
  }
})
const pagination = ref({
  current: 1,
  pageSize: 5,
  total: state.value.total,
  showSizeChanger: true,
  pageSizeOptions: ['10', '20', '50'],
  showTotal: (total: number) => `共 ${total} 条`,
})
const handleTableChange = (page: TablePaginationConfig) => {
  pagination.value.current = page.current || 1
  pagination.value.pageSize = page.pageSize || 5
  // 第一个参数是延迟，第二个参数是传入的参数
  execute(0, {
    page: pagination.value.current,
    pageSize: pagination.value.pageSize,
  })
}
</script>

<template>
  <ContentContainer>
    <header class="flex justify-between m-b-20px">
      <span>教师信息</span>
      <a-button type="primary" @click="">
        <template #icon>
          <PlusOutlined />
        </template>
        添加教师
      </a-button>
    </header>
    <div class="w-full m-b-20px">
      <a-form :layout="'inline'" :model="sesrchFormModel">
        <a-form-item>
          <a-input
            v-model="sesrchFormModel.name"
            placeholder="工号/姓名"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-model="sesrchFormModel.department"
            placeholder="所属院系"
          ></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary">
            <template #icon>
              <SearchOutlined />
            </template>
            搜索
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button>
            <template #icon>
              <SearchOutlined />
            </template>
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <a-table
      :columns="columns"
      :data-source="state.list"
      :loading="isLoading"
      :pagination="pagination"
      size="small"
      @change="handleTableChange"
    >
      <template v-slot:bodyCell="{ column }">
        <a-space v-if="column.key === 'action'">
          <a-button type="primary">编辑</a-button>
          <a-button danger>删除</a-button>
        </a-space>
      </template>
    </a-table>
  </ContentContainer>
</template>

<style lang="scss" scoped></style>
