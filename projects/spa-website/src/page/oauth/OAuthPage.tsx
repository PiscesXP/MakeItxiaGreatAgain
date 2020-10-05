import React, { useMemo } from "react";
import { parseQueryString } from "@/util/query";
import { useTitleWCMS } from "@/hook/useTitle";
import { useHistory } from "react-router-dom";
import { routePath } from "@/page/routePath";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Alert, Card, Modal, Spin } from "antd";
import { useApiRequest } from "@/hook/useApiRequest";
import "./oauthPage.css";

/**
 * OAuth登录的页面.
 * (也包括绑定时的)
 * */
export const OAuthPage: React.FC = () => {
  useTitleWCMS("OAuth登录");
  const history = useHistory();

  const modal = useMemo(() => {
    return Modal.info({
      icon: <LoadingOutlined />,
      title: "登录中...",
      content: "请稍等",
      centered: true,
    });
  }, []);

  useApiRequest({
    path: "/oauth/link/qq",
    method: "POST",
    requestBody: { accessToken: parseQueryString()["token"] },
    onFail: ({ code, message }) => {
      switch (code) {
        case 16:
          //登录成功
          modal.update({
            type: "success",
            icon: <CheckCircleOutlined />,
            title: "登陆成功",
            content: "正在跳转中...",
            centered: true,
          });
          setTimeout(() => {
            modal.destroy();
            history.push(routePath.wcms.DASHBOARD);
          }, 1000);
          break;
        case 17:
          //绑定成功
          modal.update({
            type: "success",
            icon: <CheckCircleOutlined />,
            title: "绑定成功",
            content: "你可通过QQ登录后台系统.",
            okText: "好的",
            onOk: () => {
              history.push(routePath.wcms.SELF_PROFILE);
            },
            centered: true,
          });
          break;
        default:
          //登录失败
          modal.update({
            type: "error",
            icon: <CloseCircleOutlined />,
            title: "登陆失败",
            content: message,
            okText: "返回",
            onOk: () => {
              history.push(routePath.wcms.LOGIN);
            },
            centered: true,
          });
      }
    },
    onError: (error) => {
      modal.update({
        type: "error",
        icon: <CloseCircleOutlined />,
        title: "登陆失败",
        content: error.toString(),
        okText: "返回",
        onOk: () => {
          history.push(routePath.wcms.LOGIN);
        },
        centered: true,
      });
    },
  });

  return (
    <div className="oauth-page-container">
      <Card title="QQ OAuth登录" className="oauth-page-card">
        <Alert
          type="info"
          message={
            <span>
              <Spin />
              通过QQ登录中...
            </span>
          }
        />
      </Card>
    </div>
  );
};
