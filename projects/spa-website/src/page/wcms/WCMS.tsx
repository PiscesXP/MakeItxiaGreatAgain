import React, { useEffect, useMemo } from "react";
import { Link, Redirect, Route, Switch, useLocation } from "react-router-dom";
import { UserInfoProvider } from "@/context/UserInfo";
import { routePath } from "../routePath";
import { BackTop, Col, Layout, Menu, Modal, Row } from "antd";
import { Footer as MyFooter } from "@/components/footer";
import { NotFound } from "@/components/notFound";
import { Login } from "./login";
import { DashBoard } from "./dashboard";
import { HandleOrder } from "./handleOrder";
import { Profile } from "./profile";
import { AnnouncementManage } from "./announcementManage";
import { MemberManage } from "./memberManage";
import { useLocalStorageState, useMemberContext } from "HOOK";
import { Join } from "./join/Join";
import { ExpPage } from "./exp/ExpPage";
import {
  CalendarOutlined,
  DashboardOutlined,
  FormOutlined,
  MenuOutlined,
  ReadOutlined,
  SmileOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { LogoutButton } from "@/components/logout";

const { Header, Content, Footer } = Layout;

/**
 * 后台系统的router.
 * */
function WCMS() {
  //提示是否前往 nju.itxia.cn
  const [noticeGotoNewSite, setNoticeGotoNewSite] = useLocalStorageState(
    "noticeGotoNewSite",
    () => {
      return window.location.host !== "nju.itxia.cn";
    }
  );

  useEffect(() => {
    if (noticeGotoNewSite) {
      Modal.info({
        title: "试试新网站？",
        content: "新网站(https://nju.itxia.cn)上线了，速度更快，功能更全.",
        centered: true,
        okText: "现在就去",
        onOk: () => {
          window.location.assign("https://nju.itxia.cn");
        },
        cancelText: "不用了",
        onCancel: () => {
          setNoticeGotoNewSite(false);
        },
        okCancel: true,
      });
    }
  }, [noticeGotoNewSite, setNoticeGotoNewSite]);

  return (
    <Switch>
      <Route exact path={routePath.WCMS}>
        <Redirect to={routePath.wcms.LOGIN} />
      </Route>
      <Route path={routePath.wcms.LOGIN}>
        <Login />
      </Route>
      <Route path={routePath.wcms.JOIN}>
        <Join />
      </Route>
      <Route>
        <ItxiaPage />
      </Route>
    </Switch>
  );
}

/**
 * 登录后的router.
 * */
function WCMSRouter() {
  return (
    <Switch>
      <Route path={routePath.wcms.DASHBOARD}>
        <DashBoard />
      </Route>
      <Route path={routePath.wcms.HANDLE_ORDER}>
        <HandleOrder />
      </Route>
      <Route path={routePath.wcms.SELF_PROFILE}>
        <Profile />
      </Route>
      <Route path={routePath.wcms.ANNOUNCE_MANAGE}>
        <AnnouncementManage />
      </Route>
      <Route path={routePath.wcms.MEMBER_MANAGE}>
        <MemberManage />
      </Route>
      <Route path={routePath.wcms.EXP}>
        <ExpPage />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

/**
 * 顶部导航栏.
 * */
function NavigateBar() {
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
      <Menu.Item>
        <LogoutButton />
      </Menu.Item>
    </Menu>
  );
}

function ItxiaPage() {
  return (
    <UserInfoProvider>
      <Layout id="home">
        <Header id="home-header">
          <span id="home-header-text">NJU IT侠后台管理系统</span>
          <div id="home-header-navi">
            <NavigateBar />
          </div>
        </Header>
        <Content id="home-content">
          <Row gutter={[8, 0]} justify="center" align="top">
            <Col span={24}>
              <WCMSRouter />
            </Col>
          </Row>
          <BackTop />
        </Content>
        <Footer>
          <MyFooter />
        </Footer>
      </Layout>
    </UserInfoProvider>
  );
}

export { WCMS };
