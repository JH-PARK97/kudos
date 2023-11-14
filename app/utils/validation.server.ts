// app/utils/validators.server.ts

export const validateEmail = (email: string): string | undefined => {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.length || !validRegex.test(email)) {
      return "올바른 이메일 형식을 입력해 주세요."
    }
  }
  
  export const validatePassword = (password: string): string | undefined => {
    if (password.length < 5) {
      return "비밀번호를 5자 이상 입력해 주세요."
    }
  }
  
  export const validateName = (name: string): string | undefined => {
    if (!name.length) return `이름을 입력해 주세요.`
  }