import { Alert, Button, Card, Checkbox, Form, Input, Modal } from "antd";
import React, { useEffect } from "react";
import { AttachmentUpload } from "@/components/attachment";
import { CenterMeFlex } from "@/components/layout";
import { useHistory } from "react-router-dom";
import { routePath } from "@/page/routePath";
import { useApiRequest } from "@/hook/useApiRequest";
import { useLocalStorageState } from "@/hook/useLocalStorageState";
import { useThrottle } from "@/hook/useThrottle";
import { CampusFormItem } from "@/components/form/CampusFormItem";
import { useCustomContext } from "@/page/custom/CustomContext";

//好傻的变量名...
const descriptionFieldAlertDescription = (
  <ul style={{ margin: "0.5em" }}>
    <li>
      故障<strong>现象</strong>(例如系统无法启动、运行时风扇狂转)
    </li>
    <li>
      故障<strong>持续时间</strong>
    </li>
    <li>
      问题出现的<strong>前后</strong>，你有哪些操作
    </li>
    <li>
      需要<strong>软件</strong>还是<strong>硬件</strong>帮助
    </li>
  </ul>
);

export const OrderForm: React.FC = () => {
  const [draft, setDraft, removeDraft] = useLocalStorageState<any>(
    "orderRequestDraft",
    null
  );

  const [form] = Form.useForm();

  const customContext = useCustomContext();

  const { loading, sendRequest } = useApiRequest({
    path: "/custom/order",
    method: "POST",
    manual: true,
    popModal: {
      onSuccess: {
        title: "预约成功",
        onOk: () => {
          form.resetFields();
          //删除保存的草稿
          removeDraft();
          window.scrollTo(0, 0);
        },
      },
      onFail: {
        title: "预约未成功",
      },
      onError: true,
    },
    onSuccess: ({ payload }) => {
      customContext.setOrder(payload._id);
    },
  });

  function handleSubmit(values: any) {
    sendRequest({ requestBody: values });
  }

  /**
   * 保存正在编辑的内容.
   * */
  const saveDraft = useThrottle(() => {
    const formValues = form.getFieldsValue();
    delete formValues.attachments;
    setDraft(formValues);
  }, 5000);

  useEffect(() => {
    if (draft) {
      //提示是否恢复草稿
      Modal.confirm({
        title: "是否恢复上次编辑的内容？",
        centered: true,
        okText: "恢复",
        cancelText: "不用了",
        onOk: () => {
          form.setFieldsValue(draft);
        },
        onCancel: () => {
          removeDraft();
        },
      });
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const history = useHistory();

  function handleRetrieveOrder() {
    history.push(routePath.custom.RETRIEVE);
  }

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  return (
    <Card
      title={
        <span>
          你好,请提交你的维修预约 （已有预约?
          <button
            className="link-like-button"
            type="button"
            onClick={handleRetrieveOrder}
          >
            找回预约单
          </button>
          ）
        </span>
      }
    >
      <Form
        {...formItemLayout}
        form={form}
        scrollToFirstError
        onFinish={handleSubmit}
        onValuesChange={saveDraft}
      >
        <Form.Item
          name="name"
          label="姓名"
          rules={[{ required: true, message: "请输入姓名" }]}
          hasFeedback
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="手机号"
          rules={[{ required: true, message: "请输入手机号" }]}
          hasFeedback
          extra={<Alert type="info" message="联系方式仅用于IT侠联系." />}
        >
          <Input autoComplete="phone" />
        </Form.Item>

        <Form.Item
          name="qq"
          label="QQ"
          rules={[{ required: false, message: "请输入联系QQ号" }]}
          hasFeedback
        >
          <Input autoComplete="qq" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { type: "email", message: "邮箱地址看起来不对..." },
            { required: false, message: "请输入邮箱地址" },
          ]}
          hasFeedback
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          name="acceptEmailNotification"
          label="邮件提醒"
          valuePropName="checked"
          initialValue={false}
          rules={[
            {
              validator: async () => {
                if (!form.getFieldValue("email")) {
                  return Promise.reject("请先填写Email地址");
                }
              },
            },
          ]}
        >
          <Checkbox>IT侠回复消息时，发邮件提醒我</Checkbox>
        </Form.Item>

        <Form.Item
          name="os"
          label="操作系统"
          rules={[{ required: true, message: "请输入系统名称" }]}
          hasFeedback
          extra={<Alert message="例如:win10 x64, win7 32位, mac, ubuntu." />}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="brandModel"
          label="电脑型号"
          rules={[{ required: true, message: "请输入电脑型号" }]}
          hasFeedback
          extra={
            <Alert
              type="info"
              message="电脑型号可以查看发票、说明书标识，在电脑背面或电池下面也有电脑型号标签."
            />
          }
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="warranty"
          label="是否在保修期内"
          required={false}
          hasFeedback
          extra={
            <Alert type="info" message="选填，在保的机器我们会更谨慎对待." />
          }
        >
          <Input />
        </Form.Item>

        <CampusFormItem />

        <Form.Item
          name="description"
          label="问题详细描述"
          rules={[{ required: true, message: "请详细描述你遇到的问题" }]}
          hasFeedback
          extra={
            <Alert
              type="warning"
              message="请尽可能地详细描述，包括但不限于："
              description={descriptionFieldAlertDescription}
            />
          }
        >
          <Input.TextArea autoSize={{ minRows: 6 }} allowClear={true} />
        </Form.Item>

        <AttachmentUpload
          label="附件图片上传"
          name="attachments"
          extra={<Alert type="info" message="单个附件最大10MB." />}
        />

        <Form.Item
          name="agreement"
          label="预约须知"
          valuePropName="checked"
          initialValue={false}
          rules={[
            {
              validator: async (rule, value) => {
                if (value !== true) {
                  return Promise.reject("请先阅读预约须知");
                }
              },
            },
          ]}
        >
          <Checkbox>
            我已了解并同意
            <a
              href="https://itxia.club/service#TOS"
              target="_blank"
              rel="noopener noreferrer"
            >
              预约须知和服务条款
            </a>
          </Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24, offset: 0 }}>
          <CenterMeFlex>
            <Button type="primary" htmlType="submit" loading={loading}>
              发起预约
            </Button>
          </CenterMeFlex>
        </Form.Item>
      </Form>
    </Card>
  );
};
