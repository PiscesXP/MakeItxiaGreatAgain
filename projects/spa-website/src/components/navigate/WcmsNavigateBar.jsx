import {
  CalendarOutlined,
  DashboardOutlined,
  FormOutlined,
  MenuOutlined,
  ReadOutlined,
  SmileOutlined,
  TeamOutlined,
} from '@ant-design/icons';

import { Menu } from "antd";
import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogoutButton } from "COMPONENTS/logout";
import { routePath } from "PAGE/routePath";
import { useMemberContext } from "HOOK/index";

function WcmsNavigateBar() {
  const location = useLocation();

  const memberContext = useMemberContext();

  const isAdminOrSuperAdmin = useMemo(() => {
    return (
      memberContext &&
      (memberContext.role === "ADMIN" || memberContext.role === "SUPER_ADMIN")
    );
  }, [memberContext]);

  return (
    <Menu
      mode="horizontal"
      theme="dark"
      overflowedIndicator={
        <div>
          <MenuOutlined />
          菜单
        </div>
      }
      selectedKeys={[location.pathname]}
    >
      <Menu.Item key={routePath.wcms.DASHBOARD}>
        <DashboardOutlined />
        DashBoard
        <Link to={routePath.wcms.DASHBOARD} />
      </Menu.Item>

      <Menu.Item key={routePath.wcms.HANDLE_ORDER}>
        <CalendarOutlined />
        预约单
        <Link to={routePath.wcms.HANDLE_ORDER} />
      </Menu.Item>

      <Menu.Item key={routePath.wcms.EXP}>
        <ReadOutlined />
        经验记录
        <Link to={routePath.wcms.EXP} />
      </Menu.Item>

      {isAdminOrSuperAdmin && (
        <Menu.Item key={routePath.wcms.ANNOUNCE_MANAGE}>
          <FormOutlined />
          发布公告
          <Link to={routePath.wcms.ANNOUNCE_MANAGE} />
        </Menu.Item>
      )}

      <Menu.Item key={routePath.wcms.SELF_PROFILE}>
        <SmileOutlined />
        个人信息
        <Link to={routePath.wcms.SELF_PROFILE} />
      </Menu.Item>

      {isAdminOrSuperAdmin && (
        <Menu.Item key={routePath.wcms.MEMBER_MANAGE}>
          <TeamOutlined />
          成员管理
          <Link to={routePath.wcms.MEMBER_MANAGE} />
        </Menu.Item>
      )}
      {/*<Menu.SubMenu
        title={
          <span>
            <Icon type="experiment" />
            实验功能
          </span>
        }
      ></Menu.SubMenu>*/}
      <Menu.Item key="logout">
        <LogoutButton />
      </Menu.Item>
    </Menu>
  );
}

export { WcmsNavigateBar };
