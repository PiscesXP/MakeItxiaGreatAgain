import React, { useCallback, useMemo, useState } from "react";

import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownOutlined,
  LockOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';

import { Button, Table, Input, Dropdown, Menu } from "antd";
import { parseEnumValue, parseRoleAuthLevel } from "UTIL/enumParser";
import { utcDateToText } from "UTIL/time";
import Highlighter from "react-highlight-words";
import { MemberActionModal } from "./actions/MemberActionModal";
import { authTest } from "UTIL/authTest";
import { useMemberContext } from "HOOK/index";

/**
 *
 * @param data {Object} 成员信息数据
 * @param onRefreshData {function} 更新数据的回调
 * */
function MemberInfoTable({ data, onRefreshData }) {
  const [searchInput, setSearchInput] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  const [action, setAction] = useState(null);

  const memberContext = useMemberContext();

  function handleAction({ member, type }) {
    setAction({ member, type, visible: true });
  }

  const handleHideModal = useCallback(() => {
    setAction({ member: action.member, visible: false });
  }, [action]);

  const getColumnSearchProps = useCallback(
    (dataIndex, title) => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={(node) => {
              setSearchInput(node);
            }}
            placeholder={`查找 ${title ? title : dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            查找
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            重置
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.select());
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
          text
        ),
    }),
    [searchInput, searchedColumn, searchText]
  );

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const columns = useMemo(() => {
    return [
      {
        title: "姓名",
        dataIndex: "realName",
        key: "name",
        fixed: "left",
        width: 150,
        ...getColumnSearchProps("realName", "姓名"),
      },
      {
        title: "校区",
        dataIndex: "campus",
        key: "campus",
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
        onFilter: (value, record) => record.campus === value,
        render: (campus) => parseEnumValue(campus),
      },
      {
        title: "账号状态",
        dataIndex: "disabled",
        key: "disabled",
        filters: [
          { text: "正常", value: false },
          { text: "未启用", value: true },
        ],
        filterMultiple: false,
        onFilter: (value, record) => record.disabled === value,
        render: (disabled) => {
          if (disabled) {
            return (
              <span>
                <CloseCircleOutlined style={{ color: "red" }} />
                未启用
              </span>
            );
          } else {
            return (
              <span>
                <CheckCircleOutlined style={{ color: "green" }} />
                正常
              </span>
            );
          }
        },
      },
      {
        title: "权限",
        dataIndex: "role",
        key: "role",
        filters: [
          { text: "普通成员", value: "MEMBER" },
          { text: "管理员", value: "ADMIN" },
          { text: "超级管理员", value: "SUPER_ADMIN" },
        ],
        filterMultiple: false,
        onFilter: (value, record) => record.role === value,
        sorter: ({ role: a }, { role: b }) => {
          return parseRoleAuthLevel(a) - parseRoleAuthLevel(b);
        },
        render: (role) => parseEnumValue(role),
      },
      {
        title: "email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "邮件提醒",
        children: [
          {
            title: "新预约单",
            dataIndex: "emailNotification.onMyCampusHasNewOrder",
            key: "emailNotification.onMyCampusHasNewOrder",
            width: 120,
            filters: [
              { text: "接受", value: true },
              { text: "不接受", value: false },
            ],
            filterMultiple: false,
            onFilter: (value, record) =>
              record.emailNotification.onMyCampusHasNewOrder === value,
            render: (onMyCampusHasNewOrder) => {
              return onMyCampusHasNewOrder ? "接收" : "";
            },
          },
          {
            title: "预约单回复",
            dataIndex: "emailNotification.onMyOrderHasNewReply",
            key: "emailNotification.onMyOrderHasNewReply",
            width: 120,
            filters: [
              { text: "接受", value: true },
              { text: "不接受", value: false },
            ],
            filterMultiple: false,
            onFilter: (value, record) =>
              record.emailNotification.onMyOrderHasNewReply === value,
            render: (onMyOrderHasNewReply) => {
              return onMyOrderHasNewReply ? "接收" : "";
            },
          },
        ],
      },
      {
        title: "需要重置密码",
        dataIndex: "requirePasswordReset",
        key: "requirePasswordReset",
        filters: [
          { text: "需要", value: true },
          { text: "不需要", value: false },
        ],
        filterMultiple: false,
        onFilter: (value, record) => record.requirePasswordReset === value,
        render: (requirePasswordReset) => {
          return requirePasswordReset ? "需要" : "";
        },
      },
      { title: "登录账号ID", dataIndex: "loginName", key: "loginName" },
      {
        title: "最近登录",
        dataIndex: "lastLogin",
        key: "lastLogin",
        sorter: ({ lastLogin: a }, { lastLogin: b }) => {
          if (!!!a && !!!b) {
            return 0;
          } else if (!!!a && !!b) {
            return 1;
          } else if (!!a && !!!b) {
            return -1;
          } else {
            return Date.parse(b) - Date.parse(a);
          }
        },
        render: (lastLogin) => {
          if (lastLogin) {
            return utcDateToText(lastLogin);
          } else {
            return "---";
          }
        },
      },
      {
        title: "ID",
        key: "ID",
        dataIndex: "_id",
        width: 256,
        ...getColumnSearchProps("_id", "ID"),
      },
      {
        title: "邀请人",
        dataIndex: "inviteBy",
        key: "inviteBy",
        render: (inviteBy) => inviteBy && inviteBy.realName,
      },
      {
        title: "",
        key: "operation",
        fixed: "right",
        width: 100,
        render: (text, record) => {
          if (!authTest.notLessThan(memberContext.role, record.role)) {
            return null;
          }
          const isMyself = memberContext._id === record._id;
          return (
            <Dropdown
              overlay={
                <Menu
                  onClick={({ key }) => {
                    handleAction({ member: record, type: key });
                  }}
                >
                  {!record.disabled && !isMyself && (
                    <Menu.Item key="passwordReset">
                      <LockOutlined />
                      重置密码
                    </Menu.Item>
                  )}
                  {!record.disabled && (
                    <Menu.Item key="changeRole">
                      <UserOutlined />
                      更改权限
                    </Menu.Item>
                  )}
                  {!isMyself && (
                    <Menu.Item key="changeDisable">
                      {record.disabled ? (
                        <>
                          <CheckCircleOutlined className="member-action-enable" />
                          启用账号
                        </>
                      ) : (
                        <>
                          <CloseCircleOutlined className="member-action-disable" />
                          禁用账号
                        </>
                      )}
                    </Menu.Item>
                  )}
                </Menu>
              }
            >
              <Button type="link">
                操作
                <DownOutlined />
              </Button>
            </Dropdown>
          );
        },
      },
    ];
  }, [getColumnSearchProps, memberContext]);

  return (
    <>
      <Table
        bordered
        columns={columns}
        dataSource={data}
        rowKey={(member) => member._id}
        scroll={{ x: 1600 }}
      />
      <MemberActionModal
        actionType={action && action.type}
        member={action && action.member}
        visible={action && action.visible}
        onHide={handleHideModal}
        onRefreshData={onRefreshData}
      />
    </>
  );
}

export { MemberInfoTable };
