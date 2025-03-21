const AuthUserConstant = {
  username: {
    minLength: 3,
    maxLength: 20,
    regex: /^[a-zA-Z0-9_]+$/,
    message: '用户名只能包含字母、数字和下划线',
  },
  password: {
   minLength: 6,
   maxLength:15,
   regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,15}$/,
   message: '密码必须包含至少一个大写字母、一个小写字母和一个数字', 
  },
  nickname: {
    minLength: 2,
    maxLength: 20,
    regex: /^[\u4e00-\u9fa5a-zA-Z0-9_\-\s·]+$/,
    message: '昵称只能包含中文、字母、数字、下划线、横线、空格和点',
  },
}
export {
  AuthUserConstant
}