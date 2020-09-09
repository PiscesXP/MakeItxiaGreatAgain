import { Icon, Menu } from "antd";
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
          <Icon type="menu" />
          菜单
        </div>
      }
      selectedKeys={[location.pathname]}
    >
      <Menu.Item key={routePath.wcms.DASHBOARD}>
        <Icon type="dashboard" />
        DashBoard
        <Link to={routePath.wcms.DASHBOARD} />
      </Menu.Item>

      <Menu.Item key={routePath.wcms.HANDLE_ORDER}>
        <Icon type="calendar" />
        预约单
        <Link to={routePath.wcms.HANDLE_ORDER} />
      </Menu.Item>

      {isAdminOrSuperAdmin && (
        <Menu.Item key={routePath.wcms.ANNOUNCE_MANAGE}>
          <Icon type="form" />
          发布公告
          <Link to={routePath.wcms.ANNOUNCE_MANAGE} />
        </Menu.Item>
      )}

      <Menu.Item key={routePath.wcms.SELF_PROFILE}>
        <Icon type="smile" />
        个人信息
        <Link to={routePath.wcms.SELF_PROFILE} />
      </Menu.Item>

      {isAdminOrSuperAdmin && (
        <Menu.Item key={routePath.wcms.MEMBER_MANAGE}>
          <Icon type="ordered-list" />
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
