// eslint-disable-next-line no-shadow
export enum MemberRoleEnum {
  MEMBER = "MEMBER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

// eslint-disable-next-line no-shadow
export enum OrderStatusEnum {
  PENDING = "PENDING",
  HANDLING = "HANDLING",
  DONE = "DONE",
  CANCELED = "CANCELED",
}

// eslint-disable-next-line no-shadow
export enum CampusEnum {
  XIANLIN = "XIANLIN",
  GULOU = "GULOU",
}

// eslint-disable-next-line no-shadow
export enum AnnouncementType {
  INTERNAL = "INTERNAL",
  EXTERNAL = "EXTERNAL",
}

// eslint-disable-next-line no-shadow
export enum MemberGroupEnum {
  GEEK = "GEEK",
  OP = "OP",
  WEB = "WEB",
}

const enumPairs: { [enumName: string]: string } = {
  GULOU: "鼓楼",
  XIANLIN: "仙林",
  PENDING: "等待处理",
  HANDLING: "正在处理",
  DONE: "已完成",
  CANCELED: "已取消",
  MEMBER: "普通成员",
  ADMIN: "管理员",
  SUPER_ADMIN: "超级管理员",
  GEEK: "geek",
  OP: "op",
  WEB: "web",
};

export function parseEnumValue(enumValue: string, fallback: string = "?") {
  return enumPairs[enumValue] || fallback;
}

export function parseRoleAuthLevel(roleEnumValue: string) {
  switch (roleEnumValue) {
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
