import React, { useEffect } from "react";
import { Modal } from "antd";
import { PUT } from "@/request/api";
import { popModalOnApiResult } from "@/util/modalUtil";

interface ChangeDisableProps {
  member: any;
  onRefreshData: () => void;
  onHide: () => void;
}

/**
 * 改变账号的禁用状态.
 * */
export const ChangeDisable: React.FC<ChangeDisableProps> = ({
  member,
  onRefreshData,
  onHide,
}) => {
  useEffect(() => {
    if (!member) {
      return;
    }
    let actionName = "禁用";
    if (member.disabled) {
      actionName = "启用";
    }
    Modal.confirm({
      title: "请再次确认",
      content: `确定要${actionName} ${member.realName} 的账号吗？`,
      centered: true,
      cancelText: "取消",
      okText: "确认",
      onOk: async () => {
        const result = await PUT(`/member/${member._id}/disabled`, {
          disabled: !member.disabled,
        });
        popModalOnApiResult({
          result,
          onSuccess: {
            title: "操作成功",
            content: `已${actionName} ${member.realName} 的账号.`,
            onOk: () => {
              onRefreshData();
            },
          },
          onFail: {
            title: "操作失败",
            content: "请确认是否有足够权限，或者刷新重试",
          },
          onError: true,
        });
      },
      onCancel: () => {
        onHide();
      },
    });
  }, [member, onRefreshData, onHide]);
  return null;
};
