export class CreateDictDto {
  code: string;
  name: string;
  desc?: string;
  details: {
    code: string; // 编码.0,1,2
    name: string; // 值.正常,禁用,删除
  }[];
}
