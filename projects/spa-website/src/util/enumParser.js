const enumPair = {
  GULOU: "鼓楼",
  XIANLIN: "仙林",
  PENDING: "等待处理",
  HANDLING: "正在处理",
  DONE: "已完成",
  CANCELED: "已取消",
  MEMBER: "普通成员",
  ADMIN: "管理员",
  SUPER_ADMIN: "超级管理员",
};

function parseEnumValue(enumValue) {
  const result = enumPair[enumValue];
  if (result) {
    return result;
  }
  return "?";
}

/**
 * @param roleEnum {string}
 * */
function parseRoleAuthLevel(roleEnum) {
  switch (roleEnum) {
    case "MEMBER":
      return 16;
    case "ADMIN":
      return 32;
    case "SUPER_ADMIN":
      return 64;
    default:
      return 0;
  }
}

export { parseEnumValue, parseRoleAuthLevel };
