interface DictItem {
  id: string
  code: string
  name: string
  desc: string
  status: number
  createTime: Date
  updateTime: Date
}

export interface DictListResult {
  list: DictItem[]
  total: number
}

export interface FindOneDictResult {
  list: { id: string; label: string; value: number }[]
}

export interface GetAllDictsDetailResult {
  list: {
    key: string
    value: string
  } []
}
