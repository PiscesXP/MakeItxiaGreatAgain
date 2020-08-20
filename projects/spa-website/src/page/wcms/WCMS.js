import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { UserInfoProvider } from "CONTEXT/UserInfo";
import { routePath } from "../routePath";
import { BackTop, Col, Layout, Row } from "antd";
import { Footer as MyFooter } from "COMPONENTS/footer";
import { WcmsNavigateBar } from "COMPONENTS/navigate";
import { NotFound } from "COMPONENTS/notFound";
import { Login } from "./login";
import { DashBoard } from "./dashboard";
import { HandleOrder } from "./handleOrder";
import { Profile } from "./profile";
import { AnnouncementManage } from "./announcementManage";
import { MemberManage } from "./memberManage";

const { Header, Content, Footer } = Layout;

/**
 * 后台系统的router.
 * */
function WCMS() {
  return (
    <Switch>
      <Route exact path={routePath.WCMS}>
        <Redirect to={routePath.wcms.LOGIN} />
      </Route>
      <Route path={routePath.wcms.LOGIN}>
        <Login />
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
    <UserInfoProvider>
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
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </UserInfoProvider>
  );
}

function ItxiaPage() {
  return (
    <Layout id="home">
      <Header id="home-header">
        <span id="home-header-text">NJU IT侠后台管理系统</span>
        <div id="home-header-navi">
          <WcmsNavigateBar />
        </div>
      </Header>
      <Content id="home-content">
        <Row gutter={[8, 0]} type="flex" justify="center" align="top">
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
  );
}

export { WCMS };
