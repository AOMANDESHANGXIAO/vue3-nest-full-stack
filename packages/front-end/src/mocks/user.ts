const baseUrl = '/user'

export default [
  {
    url: `${baseUrl}/info`,
    method: 'get',
    timeout: 1000,
    response: () => {
      return {
        code: 200,
        message: 'ok',
        success: true,
        data: {
          // just mock...
          username: '张老师',
          avatarUrl:
            'https://ai-public.mastergo.com/ai/img_res/a8bf73a294afd78156d5860b6d704d78.jpg',
        },
      }
    },
  },
  {
    url: `${baseUrl}/login`,
    method: 'post',
    timeout: 1000,
    response: () => {
      return {
        code: 200,
        message: 'ok',
        success: true,
        data: {
          token: 'dadadadfdasdasdasdasdasdas',
        },
      }
    },
  },
  // {
  //   url: `${baseUrl}/info`,
  //   method: 'get',
  //   timeout: 1000,
  //   response: () => {
  //     return {
  //       code: 401,
  //       message: '未登录或者登录过期',
  //       success: false,
  //       data: null,
  //     }
  //   },
  // },
]
