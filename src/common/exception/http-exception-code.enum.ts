export enum ExceptionCode {
  /** 通用模块 */
  OK = 1,
  NOT_FOUND_CODE = 999,
  BAD_REQUEST = 10400,
  UNAUTHORIZED = 10401,
  FORBIDDEN = 10403,
  NOT_FOUND = 10404,
  UNKNOWN_ERROR = 10500,
  SERVICE_UNAVAILABLE = 10503,

  /** 用户模块异常 */
  USER_NOT_FOUND = 20001,
  USER_NOT_FOUND_OR_PASSWORD_IS_WRONG = 20002,
  USERNAME_ALREADY_EXISTS = 20003,
  IS_SAME_OLD_PASSWORD = 20004,
  USER_LOGIN_TYPE_NOT_FOUND = 20005,
  WX_INNER_LOGIN_FAIL = 20006,
}
