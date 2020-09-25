import React, { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { UserInfoProvider } from "CONTEXT/UserInfo";
import { routePath } from "../routePath";
import { BackTop, Col, Layout, Modal, Row } from "antd";
import { Footer as MyFooter } from "COMPONENTS/footer";
import { WcmsNavigateBar } from "COMPONENTS/navigate";
import { NotFound } from "COMPONENTS/notFound";
import { Login } from "./login";
import { DashBoard } from "./dashboard";
import { HandleOrder } from "./handleOrder";
import { Profile } from "./profile";
import { AnnouncementManage } from "./announcementManage";
import { MemberManage } from "./memberManage";
import { useLocalStorageState } from "HOOK";
import { Join } from "PAGE/wcms/join/Join";
import { ExpPage } from "PAGE/wcms/exp/ExpPage";

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
          window.location = "https://nju.itxia.cn";
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

function ItxiaPage() {
  return (
    <UserInfoProvider>
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
    </UserInfoProvider>
  );
}

export { WCMS };
