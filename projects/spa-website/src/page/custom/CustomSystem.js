import React from "react";
import { Link, Redirect, Route, Switch, useLocation } from "react-router-dom";
import { routePath } from "../routePath";
import { BackTop, Col, Icon, Layout, Menu, Row } from "antd";
import { Footer as MyFooter } from "COMPONENTS/footer";
import { CustomHomePage } from "./home";
import { RequestOrder } from "./requestOrder";
import { NotFound } from "COMPONENTS/notFound";

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
        <RequestOrder />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
}

function CustomSystem() {
  return (
    <Layout id="home">
      <Header id="home-header">
        <span id="home-header-text">NJU IT侠预约系统</span>
        <div id="home-header-navi" style={{ flexGrow: 0.3 }}>
          <CustomNavigate />
        </div>
      </Header>
      <Content id="home-content">
        <Row gutter={[8, 0]} type="flex" justify="center" align="top">
          <Col xs={24} sm={24} md={24} lg={16} xl={12}>
            <CustomRouter />
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

const { SubMenu } = Menu;

function CustomNavigate() {
  const location = useLocation();
  return (
    <Menu mode="horizontal" theme="dark" selectedKeys={[location.pathname]}>
      <SubMenu
        title={
          <span>
            <Icon type="calendar" />
            预约系统
          </span>
        }
      >
        <Menu.Item key={routePath.custom.HOME}>
          <Icon type="home" />
          主页
          <Link to={routePath.custom.HOME} />
        </Menu.Item>
        <Menu.Item key={routePath.custom.ORDER}>
          <Icon type="calendar" />
          发起预约
          <Link to={routePath.custom.ORDER} />
        </Menu.Item>
      </SubMenu>
      <Menu.Item key={routePath.WCMS}>
        <Icon type="solution" />
        后台系统
        <Link to={routePath.WCMS} />
      </Menu.Item>
    </Menu>
  );
}

export { CustomSystem };
