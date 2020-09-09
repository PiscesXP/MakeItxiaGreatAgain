import React, { useCallback, useMemo, useState } from "react";
import { Button, Table, Icon, Input, Dropdown, Menu } from "antd";
import { parseEnumValue, parseRoleAuthLevel } from "UTIL/enumParser";
import { utcDateToText } from "UTIL/time";
import Highlighter from "react-highlight-words";

/**
 *
 * @param data {Object} 成员信息数据
 * @param onSelectRow {function} 勾选表格行时的回调
 * */
function MemberInfoTable({ data, onSelectRow }) {
  const [searchInput, setSearchInput] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [searchText, setSearchText] = useState("");

  function handleAction({ record, key }) {
    console.log(record);
    console.log(key);
  }

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
            icon="search"
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
        <Icon
          type="search"
          style={{ color: filtered ? "#1890ff" : undefined }}
        />
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
          { text: "已禁用", value: true },
        ],
        filterMultiple: false,
        onFilter: (value, record) => record.disabled === value,
        render: (disabled) => {
          if (disabled) {
            return (
              <span>
                <Icon type="close-circle" style={{ color: "red" }} />
                已禁用
              </span>
            );
          } else {
            return "正常";
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
      { title: "登录账号ID", dataIndex: "loginName", key: "loginName" },
      {
        title: "ID",
        key: "ID",
        dataIndex: "_id",
        width: 256,
        ...getColumnSearchProps("_id", "ID"),
      },
      {
        title: "",
        key: "operation",
        fixed: "right",
        width: 100,
        render: (text, record) => (
          <Dropdown
            overlay={
              <Menu
                onClick={({ key }) => {
                  handleAction({ record, key });
                }}
              >
                <Menu.Item key="pwdReset">
                  <Icon type="lock" />
                  修改密码
                </Menu.Item>
                <Menu.Item key="changeRole">
                  <Icon type="user" />
                  更改权限
                </Menu.Item>
                <Menu.Item key="detailInfo">
                  <Icon type="solution" />
                  详细信息
                </Menu.Item>
                <Menu.Item key="changeDisable">
                  {record.disabled ? (
                    <>
                      <Icon
                        type="check-circle"
                        className="member-action-enable"
                      />
                      启用账号
                    </>
                  ) : (
                    <>
                      <Icon
                        type="close-circle"
                        className="member-action-disable"
                      />
                      禁用账号
                    </>
                  )}
                </Menu.Item>
              </Menu>
            }
          >
            <Button type="link">
              操作
              <Icon type="down" />
            </Button>
          </Dropdown>
        ),
      },
    ];
  }, [getColumnSearchProps]);

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey={(member) => member._id}
      scroll={{ x: 1600 }}
      rowSelection={{ columnTitle: "选择", onSelect: onSelectRow }}
    />
  );
}

export { MemberInfoTable };
