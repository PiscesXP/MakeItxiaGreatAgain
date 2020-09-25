import React, { useCallback, useMemo } from "react";
import { parseEnumValue } from "UTIL/enumParser";
import { CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { notification, Button, Table, Typography } from "antd";
import { useApi } from "HOOK/index";
import { DELETE, POST } from "@/request/api";

function MemberRecruit() {
  const { loading, payload, send } = useApi({
    path: "/member/recruit",
    formatResult: (data) => {
      //翻转顺序，让最近的在前面
      if (Array.isArray(data)) {
        return data.reverse();
      }
      return data;
    },
  });

  const handleCopyLink = useCallback((redeemCode) => {
    const inviteLink = `${window.location.origin}/wcms/join?redeemCode=${redeemCode}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      notification.success({
        message: "链接已复制到剪贴板",
        description: inviteLink,
        duration: 3,
      });
    });
  }, []);

  const handleDeleteRecruit = useCallback(
    (id) => {
      DELETE(`/member/recruit/${id}`).then(() => {
        notification.success({
          message: "邀请码已删除",
          duration: 3,
        });
        send();
      });
    },
    [send]
  );
  function handleRecruit() {
    POST("/member/recruit")
      .then(() => {
        notification.success({
          message: "邀请码已生成",
          duration: 2,
        });
        send();
      })
      .catch(() => {});
  }

  const columnProps = useMemo(
    () => [
      {
        title: "邀请码",
        dataIndex: "redeemCode",
        key: "redeemCode",
        width: 210,
        render: (redeemCode) => {
          return <Typography.Text copyable>{redeemCode}</Typography.Text>;
        },
      },
      {
        title: "使用状况",
        dataIndex: "hasRedeemed",
        key: "hasRedeemed",
        width: 150,
        render: (hasRedeemed) => {
          return hasRedeemed ? (
            <>
              <CheckCircleOutlined style={{ color: "green" }} />
              已使用
            </>
          ) : (
            <>
              <ClockCircleOutlined style={{ color: "#1890ff" }} />
              未使用
            </>
          );
        },
      },
      {
        title: "新成员",
        width: 800,
        children: [
          {
            title: "姓名",
            dataIndex: "receiver.realName",
            key: "name",
            width: 150,
          },
          {
            title: "校区",
            dataIndex: "receiver.campus",
            key: "campus",
            width: 150,
            filters: [
              {
                text: "鼓楼",
                value: "GULOU",
              },
              {
                text: "仙林",
                value: "XIANLIN",
              },
            ],
            filterMultiple: false,
            onFilter: (value, record) =>
              record.receiver && record.receiver.campus === value,
            render: (campus) => campus && parseEnumValue(campus),
          },
          {
            title: "登录账号",
            dataIndex: "receiver.loginName",
            key: "loginName",
            width: 200,
          },
          {
            title: "系统ID",
            dataIndex: "receiver._id",
            key: "_id",
            //这里如果设置width，右边会有白边，原因未明
            maxWidth: 200,
          },
        ],
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
        width: 220,
        fixed: "right",
        render: (text, record) => {
          if (record.hasRedeemed) {
            return null;
          } else {
            return (
              <>
                <Button
                  type="primary"
                  style={{ marginRight: "1em" }}
                  onClick={() => {
                    handleCopyLink(record.redeemCode);
                  }}
                >
                  复制链接
                </Button>
                <Button
                  type="danger"
                  onClick={() => {
                    handleDeleteRecruit(record._id);
                  }}
                >
                  删除
                </Button>
              </>
            );
          }
        },
      },
    ],
    [handleCopyLink, handleDeleteRecruit]
  );

  return (
    <>
      <div style={{ marginBottom: "1em" }}>
        <Button type="primary" onClick={handleRecruit}>
          添加邀请
        </Button>
      </div>
      <Table
        bordered
        loading={loading}
        columns={columnProps}
        dataSource={payload}
        rowKey="_id"
        scroll={{ x: 1400 }}
      />
    </>
  );
}

export { MemberRecruit };
