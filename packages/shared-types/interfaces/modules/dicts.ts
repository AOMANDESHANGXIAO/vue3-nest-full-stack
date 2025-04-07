interface DictItem {
  id: string;
  code: string;
  name: string;
  desc: string;
  status: number;
  createTime: Date;
  updateTime: Date;
}

export interface DictListResult {
  list: DictItem[];
  total: number;
}
