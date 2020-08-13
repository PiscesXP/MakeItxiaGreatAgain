import React from "react";
import { BackTop, Layout } from "antd";
import { WcmsNavigateBar } from "COMPONENTS/navigate";
import { Footer as MyFooter } from "COMPONENTS/footer";
import { HomeRouter } from "ROUTE";
import "./home.css";

const { Header, Content, Footer } = Layout;

function Home() {
  return (
    <Layout id="home">
      <Header id="home-header">
        <span id="home-header-text">NJU IT侠后台管理系统</span>
        <div id="home-header-navi">
          <WcmsNavigateBar />
        </div>
      </Header>
      <Content id="home-content">
        <HomeRouter />
        <BackTop />
      </Content>
      <Footer>
        <MyFooter />
      </Footer>
    </Layout>
  );
}

export { Home };
