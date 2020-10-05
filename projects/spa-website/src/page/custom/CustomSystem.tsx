import React from "react";
import { Link, Redirect, Route, Switch, useLocation } from "react-router-dom";
import { routePath } from "@/page/routePath";
import {
  CalendarOutlined,
  FileSearchOutlined,
  HomeOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Divider, Layout, Menu } from "antd";
import { Footer as MyFooter } from "@/components/footer";
import { CustomHomePage } from "./home";
import { RequestOrderPage } from "./requestOrder";
import { PageNotFound } from "@/components/notFound";
import { CenterMeResponsive } from "@/components/layout";
import { AnnouncementList } from "@/components/announcement";
import { useTitle } from "@/hook/useTitle";
import { RetrieveOrder } from "@/page/custom/retrieveOrder";
import { AnnouncementType } from "@/util/enum";
import { CustomContextProvider } from "@/page/custom/CustomContext";

const { Header, Content, Footer } = Layout;

function CustomRouter() {
  return (
    <Switch>
      <Route exact path={routePath.CUSTOM}>
        <Redirect to={routePath.custom.HOME} />
      </Route>
      <Route path={routePath.custom.HOME}>
        <CustomHomePage />
      </Route>
      <Route path={routePath.custom.ORDER}>
        <RequestOrderPage />
      </Route>
      <Route path={routePath.custom.RETRIEVE}>
        <RetrieveOrder />
      </Route>
      <Route path="*">
        <PageNotFound />
      </Route>
    </Switch>
  );
}

function CustomSystem() {
  useTitle("IT侠预约系统");
  return (
    <CustomContextProvider>
      <Layout id="home">
        <Header id="home-header">
          <span id="home-header-text">NJU IT侠预约系统</span>
          <div id="home-header-navi" style={{ flexGrow: 0.3 }}>
            <CustomNavigate />
          </div>
        </Header>
        <Content id="home-content">
          <CenterMeResponsive small>
            <CustomRouter />
            <Divider dashed />
            <AnnouncementList type={AnnouncementType.EXTERNAL} />
          </CenterMeResponsive>
        </Content>
        <Footer>
          <MyFooter />
        </Footer>
      </Layout>
    </CustomContextProvider>
  );
}

const { SubMenu } = Menu;

function CustomNavigate() {
  const location = useLocation();
  return (
    <Menu mode="horizontal" theme="dark" selectedKeys={[location.pathname]}>
      <SubMenu
        title={
          <span>
            <CalendarOutlined />
            预约系统
          </span>
        }
      >
        <Menu.Item key={routePath.custom.HOME}>
          <HomeOutlined />
          主页
          <Link to={routePath.custom.HOME} />
        </Menu.Item>
        <Menu.Item key={routePath.custom.ORDER}>
          <CalendarOutlined />
          发起预约
          <Link to={routePath.custom.ORDER} />
        </Menu.Item>
        <Menu.Item key={routePath.custom.RETRIEVE}>
          <FileSearchOutlined />
          找回预约单
          <Link to={routePath.custom.RETRIEVE} />
        </Menu.Item>
      </SubMenu>
      <Menu.Item key={routePath.WCMS}>
        <SolutionOutlined />
        后台系统
        <Link to={routePath.WCMS} />
      </Menu.Item>
    </Menu>
  );
}

export { CustomSystem };
