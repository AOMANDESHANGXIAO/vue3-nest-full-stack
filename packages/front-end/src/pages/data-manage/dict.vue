<route lang="json">
{
  "meta": {
    "title": "字典管理",
    "menuOrder": 1,
    "showInMenu": true,
    "breadcrumbName": "字典管理"
  }
}
</route>

<script setup lang="ts">
import ContentContainer from '@/components/layouts/content-container.vue'
import AsyncFormRender from '@/components/ant/async-form-render.vue'
import type { ColumnType } from 'ant-design-vue/es/table'
import { commonDateFormatter } from '@/utils/time'
import { useAsyncState } from '@vueuse/core'
import { DictsApi } from '@/apis/modules/dicts'
import _ from 'lodash'
import { useElementSize } from '@vueuse/core'
import { SearchOutlined, UndoOutlined } from '@ant-design/icons-vue'
import { useDictStore } from '@/stores/modules/use-dict-store'

defineOptions({
  name: 'dict',
})
const defaultQueryOptions = {
  showSizeChanger: true,
  showQuickJumper: true,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条`,
  pageSize: 5,
  current: 1,
  pageSizeOptions: ['5', '10', '20', '50'],
  async onChange(current: number, pageSize: number) {
    this.current = current
    this.pageSize = pageSize
    await nextTick()
    handleSearch()
  },
}
const queryOptions = ref(_.cloneDeep(defaultQueryOptions))
const { state, execute, isLoading } = useAsyncState(
  DictsApi.getDictList,
  {
    list: [],
    total: 0,
  },
  {
    immediate: false,
    onSuccess(res) {
      queryOptions.value.total = res.total
    },
  }
)
const handleSearch = () => {
  execute(0, _.pick(queryOptions.value, ['current', 'pageSize']))
}
onMounted(() => {
  handleSearch()
})
const { getDict } = useDictStore()

const columns: ColumnType<any>[] = [
  {
    title: '编码',
    dataIndex: 'code',
    key: 'code',
    align: 'center',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '描述',
    dataIndex: 'desc',
    key: 'desc',
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    customRender: ({ text }: { text: string }) => {
      return commonDateFormatter(text)
    },
    align: 'center',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    customRender: ({ text }: { text: string }) => {
      return commonDateFormatter(text)
    },
    align: 'center',
  },
]

const searchFormRef = useTemplateRef('searchFormRef')
const { height } = useElementSize(searchFormRef)
const tableContainerStyle = computed(() => {
  return {
    height: `calc(100% - ${height.value}px)`,
    width: '100%',
  }
})
const searchFormModel = ref({
  code: '',
  name: '',
  status: undefined,
})
const { state: statusDictList, execute: statusDictListExecute } = useAsyncState(
  DictsApi.getDict,
  {
    list: [],
  },
  {
    immediate: false,
  }
)
onMounted(() => {
  statusDictListExecute(0, 'status')
})
</script>

<template>
  <ContentContainer>
    <!-- search form -->
    <div ref="searchFormRef">
      <a-form layout="inline" class="mb-4 relative">
        <a-form-item label="编码" name="code">
          <a-input
            v-model:value="searchFormModel.code"
            placeholder="请输入编码"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="名称" name="name">
          <a-input
            v-model:value="searchFormModel.name"
            placeholder="请输入名称"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="状态" name="status">
          <a-select
            v-model:value="searchFormModel.status"
            allow-clear
            placeholder="请选择状态"
            :options="statusDictList.list"
          >
          </a-select>
        </a-form-item>
        <div class="absolute right-0 top-0 flex items-center gap-2">
          <a-button type="primary" @click="handleSearch">
            <SearchOutlined /><span>查询</span></a-button
          >
          <a-button @click=""> <UndoOutlined /><span>重置</span></a-button>
        </div>
      </a-form>
    </div>
    <!-- table -->
    <div :style="tableContainerStyle">
      <a-table
        :columns="columns"
        :data-source="state.list"
        :pagination="queryOptions"
        :loading="isLoading"
        :scroll="{ x: '100%', y: 'max-content' }"
      >
        <template #bodyCell="{ column, record }">
          <div v-if="column.dataIndex === 'status'">
            {{ getDict('status', record.status) }}
          </div>
        </template>
      </a-table>
    </div>
  </ContentContainer>
</template>

<style scoped lang="scss">
@import url('@/styles/a-table.scss');
</style>
