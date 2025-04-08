<route lang="json">
{
  "meta": {
    "title": "角色",
    "menuOrder": 1,
    "showInMenu": true,
    "breadcrumbName": "角色"
  }
}
</route>

<script lang="ts" setup>
import ContentContainer from '@/components/layouts/content-container.vue'
import { RolesApi } from '@/apis/modules/roles'
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
import { useElementSize } from '@vueuse/core'
import { commonDateFormatter } from '@/utils/time'

defineOptions({
  name: 'role',
})
const columns: ColumnType[] = [
  {
    title: '角色名称',
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
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    customRender: ({ text }) => commonDateFormatter(text),
  },
  {
    title: '创建人',
    dataIndex: ['createdBy', 'username'],
    key: 'createdBy',
    customRender: ({
      record,
    }: {
      record: {
        createdBy: RoleOperatorRecord
      }
    }) => record.createdBy.username,
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
// const queryParams = ref(_.cloneDeep(defaultQueryParams))
const { state, isLoading, execute } = useAsyncState(
  RolesApi.getRoles,
  {
    list: [],
    total: 0,
  },
  {
    immediate: false,
    onSuccess(data){
      queryOptions.value.total = data.total
    }
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
const handleCreate = () => {
  handleSubmit = create
  isModalOpen.value = true
}
const formData = ref<CreateRoleInterface>({
  name: '',
  desc: '',
})
const formRef = ref<FormInstance>()
const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: '角色名称不能为空', trigger: 'blur' },
    { max: 50, message: '名称长度不能超过50个字符', trigger: 'blur' },
  ],
  desc: [
    { required: true, message: '角色描述不能为空', trigger: 'blur' },
    { max: 200, message: '描述长度不能超过200个字符', trigger: 'blur' },
  ],
}
const isConfirmLoading = ref(false)
const create = async () => {
  try {
    isConfirmLoading.value = true
    await formRef.value?.validate()
    await RolesApi.createRole(formData.value)
    message.success('创建成功')
    isModalOpen.value = false
    formRef.value?.resetFields()
    handleSearch()
  } catch (e) {
    console.error(e)
  } finally {
    isConfirmLoading.value = false
  }
}
let handleSubmit = create
let id = ''
const patch = async () => {
  try {
    isConfirmLoading.value = true
    await formRef.value?.validate()
    await RolesApi.updateRole(id, formData.value)
    message.success('更新成功')
    isModalOpen.value = false
    formRef.value?.resetFields()
    handleSearch()
  } catch (e) {
    console.error(e)
  } finally {
    isConfirmLoading.value = false
  }
}
const isDeleteLoading = ref(false)
const _delete = async () => {
  try {
    isDeleteLoading.value = true
    await RolesApi.deleteRole(id)
    message.success('删除成功')
    handleSearch()
  } catch (e) {
    console.error(e)
  } finally {
    isDeleteLoading.value = false
  }
}
const handleEdit = (record: GetRoleListResult['list'][number]) => {
  id = record.id
  handleSubmit = patch
  formData.value = {
    name: record.name,
    desc: record.desc,
  }
  isModalOpen.value = true
}
const handleDelete = (record: GetRoleListResult['list'][number]) => {
  id = record.id
  _delete()
}
const searchFormRef = useTemplateRef('searchFormRef')
const { height: searchFormHeight } = useElementSize(searchFormRef)
const aTableWrapperStyle = computed(() => {
  return {
    height: `100% - ${searchFormHeight.value}px - 30px`,
  }
})
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
    <a-form ref="searchFormRef" layout="inline" class="mb-4 relative">
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
        <a-button type="primary" class="ml-2" @click="handleCreate">
          <PlusOutlined />
          <span>新增</span>
        </a-button>
      </a-form-item>
    </a-form>

    <!--- 表格区域 --->
    <section class="w-full" :style="aTableWrapperStyle">
      <a-table
        :columns="columns"
        :data-source="state.list"
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
            <div class="flex items-center">
              <a-button
                type="primary"
                class="mr-2"
                @click="handleEdit(record as GetRoleListResult['list'][number])"
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
                <a-button danger :loading="isDeleteLoading">删除</a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </section>
  </ContentContainer>
</template>

<style lang="scss" scoped>
@import url('@/styles/a-table.scss');
</style>
