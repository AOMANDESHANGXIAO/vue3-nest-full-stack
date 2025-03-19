import type { MockMethod } from 'vite-plugin-mock'
export default [
  {
    url: '/teacher/list',
    method: 'get',
    timeout: 1000,
    response: (res: any) => {
      console.log(res)
      return {
        code: 200,
        message: 'ok',
        success: true,
        data: {
          // 约定表格类的请求必须包含list和total
          list: [
            {
              id: 1,
              name: '张三',
              age: 18,
              department: '计算机科学与技术',
              status: 1,
              createdTime: '2023-01-01',
            },
            {
              id: 2,
              name: '李四',
              age: 22,
              department: '软件工程',
              status: 1,
              createdTime: '2023-02-01',
            },
            {
              id: 3,
              name: '王五',
              age: 25,
              department: '信息管理与信息系统',
              status: 1,
              createdTime: '2023-03-01',
            },
            {
              id: 4,
              name: '赵六',
              age: 28,
              department: '网络工程',
              status: 1,
              createdTime: '2023-04-01',
            },
            {
              id: 5,
              name: '孙七',
              age: 21,
              department: '数据科学与大数据技术',
              status: 1,
              createdTime: '2023-05-01',
            },
          ],
          total: 128,
        },
      }
    },
  },
] as MockMethod[]
