import React, { useState } from "react";
import { Button, Modal, Popconfirm } from "antd";
import * as api from "UTIL/api";

const actions = [
  {
    actionName: "设为管理员",
    condition: { role: "普通成员" },
    buttonType: "default",
    urlPostfix: "role",
    data: { role: "管理员" }
  },
  {
    actionName: "设为普通成员",
    condition: { role: "管理员" },
    buttonType: "default",
    urlPostfix: "role",
    data: { role: "普通成员" }
  },
  {
    actionName: "启用账号",
    condition: { disable: true },
    buttonType: "primary",
    urlPostfix: "disable",
    data: { disable: false }
  },
  {
    actionName: "禁用账号",
    condition: { disable: false },
    buttonType: "danger",
    urlPostfix: "disable",
    data: { disable: true }
  },
  {
    actionName: "重置密码",
    buttonType: "dashed",
    notImplemented: true
  }
];

function MemberAction(props) {
  const [loading, setLoading] = useState(false);

  function handleAction(action) {
    if (action.notImplemented) {
      return Modal.info({
        title: "操作失败",
        content: "功能尚未实现，请等待下个版本",
        centered: true
      });
    }
    setLoading(true);
    const { record } = props;
    api
      .PUT(`/user/${record.loginName}/${action.urlPostfix}`, action.data)
      .then(() => {
        Modal.success({
          title: "操作成功",
          content: `已成功${action.actionName}.`,
          centered: true,
          onOk: () => {
            props.onActionDone();
          }
        });
      })
      .catch(e => {
        Modal.error({
          title: "网络请求失败",
          content: e.toString(),
          centered: true
        });
      });
  }

  const { record } = props;
  const actionArr = actions.filter(value => {
    const { condition } = value;
    if (condition) {
      for (const key in condition) {
        if (condition[key] !== record[key]) {
          return false;
        }
      }
    }
    return true;
  });

  return (
    <div>
      {actionArr.map((value, index) => {
        return (
          <Popconfirm
            key={index}
            title={`确定要${value.actionName}吗？`}
            okText="确定"
            cancelText="取消"
            onConfirm={() => {
              handleAction(value);
            }}
          >
            <Button
              type={value.buttonType}
              size="small"
              style={{
                margin: "0.5em"
              }}
              disabled={loading}
            >
              {value.actionName}
            </Button>
          </Popconfirm>
        );
      })}
    </div>
  );
}

export { MemberAction };
