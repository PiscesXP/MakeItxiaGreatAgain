import {
  Alert,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Modal,
  Select,
} from "antd";
import React, { useEffect } from "react";
import {
  AttachmentUpload,
  attachmentUploadFormParser,
} from "COMPONENTS/attachment";
import { useApi } from "HOOK/index";

const { Option } = Select;

function RequestOrderForm(props) {
  const {
    validateFields,
    getFieldsValue,
    setFieldsValue,
    getFieldDecorator,
  } = props.form;
  const { onSubmitSuccess } = props;

  let draftTimer = null;
  const draftStorageKey = "orderRequestDraft";

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

  const { loading, send } = useApi({
    path: "/custom/order",
    method: "POST",
    later: true,
    onSuccess: ({ payload }) => {
      Modal.success({
        title: "预约成功",
        centered: true,
      });
      //删除保存的草稿
      localStorage.removeItem(draftStorageKey);
      onSubmitSuccess(payload);
    },
    onFail: ({ message, payload }) => {
      Modal.error({
        title: "预约未成功",
        content: message + "," + payload.toString(),
        centered: true,
      });
    },
    onError: (error) => {
      Modal.error({
        title: "预约未成功",
        content: error.toString(),
        centered: true,
      });
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    validateFields((err, values) => {
      if (err) {
        return;
      }
      values.attachments = attachmentUploadFormParser(values.attachments);
      send(values);
    });
  }

  /**
   * 保存正在编辑的内容.
   * */
  function saveDraft() {
    const values = getFieldsValue();
    if (draftTimer != null) {
      clearTimeout(draftTimer);
    }
    delete values.attachments; //去掉attachments，这部分没法恢复...
    draftTimer = setTimeout(() => {
      localStorage.setItem(draftStorageKey, JSON.stringify(values));
    }, 1000);
  }

  useEffect(() => {
    const draft = localStorage.getItem(draftStorageKey);
    if (draft) {
      //提示是否恢复草稿
      Modal.confirm({
        title: "是否恢复上次编辑的内容？",
        centered: true,
        okText: "恢复",
        cancelText: "不用了",
        onOk: () => {
          setFieldsValue(JSON.parse(draft));
        },
        onCancel: () => {
          localStorage.removeItem(draftStorageKey);
        },
      });
    }
  }, [setFieldsValue]);

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  return (
    <Card title="你好,请提交你的维修预约">
      <Form {...formItemLayout} onSubmit={handleSubmit} onChange={saveDraft}>
        <Form.Item label="姓名" hasFeedback>
          {getFieldDecorator("name", {
            rules: [{ required: true, message: "请输入姓名" }],
          })(<Input />)}
        </Form.Item>

        <Form.Item label="手机号" hasFeedback>
          {getFieldDecorator("phone", {
            rules: [{ required: true, message: "请输入手机号" }],
          })(<Input />)}
          <Alert type="info" message="联系方式仅用于IT侠联系." />
        </Form.Item>

        <Form.Item label="QQ" hasFeedback>
          {getFieldDecorator("qq", {
            rules: [{ required: false, message: "请输入联系QQ号" }],
          })(<Input />)}
        </Form.Item>

        <Form.Item label="Email" hasFeedback>
          {getFieldDecorator("email", {
            rules: [
              { type: "email", message: "邮箱地址看起来不对..." },
              { required: false, message: "请输入邮箱地址" },
            ],
          })(<Input />)}
        </Form.Item>

        <Form.Item label="邮件提醒">
          {getFieldDecorator("acceptEmailNotification", {
            valuePropName: "checked",
            initialValue: false,
            rules: [
              (rules, value, callback) => {
                if (value === true) {
                  validateFields(["email"], (error, { email }) => {
                    if (error || email === "" || email === undefined) {
                      callback("请先填写Email地址");
                    }
                  });
                }
                callback();
              },
            ],
          })(<Checkbox>IT侠回复消息时，发邮件提醒我</Checkbox>)}
        </Form.Item>

        <Form.Item label="操作系统" hasFeedback>
          {getFieldDecorator("os", {
            rules: [{ required: true, message: "请输入系统名称" }],
          })(<Input />)}
          <Alert message="例如:win10 x64, win7 32位, mac, ubuntu." />
        </Form.Item>

        <Form.Item label="电脑型号" hasFeedback>
          {getFieldDecorator("brandModel", {
            rules: [{ required: true, message: "请输入电脑型号" }],
          })(<Input />)}
          <Alert
            type="info"
            message="电脑型号可以查看发票、说明书标识，在电脑背面或电池下面也有电脑型号标签."
          />
        </Form.Item>

        <Form.Item label="是否在保修期内" hasFeedback>
          {getFieldDecorator("warranty", {
            rules: [{ required: false }],
          })(<Input />)}
          <Alert type="info" message="选填，在保的机器我们会更谨慎对待." />
        </Form.Item>

        <Form.Item label="校区" hasFeedback>
          {getFieldDecorator("campus", {
            rules: [{ required: true, message: "请选择校区" }],
          })(
            <Select placeholder="请选择校区">
              <Option value={"仙林"}>仙林</Option>
              <Option value={"鼓楼"}>鼓楼</Option>
            </Select>
          )}
        </Form.Item>

        <Form.Item label="问题详细描述" hasFeedback>
          {getFieldDecorator("description", {
            rules: [{ required: true, message: "请详细描述你遇到的问题" }],
          })(<Input.TextArea autoSize={{ minRows: 6 }} allowClear={true} />)}
          <Alert
            type="warning"
            message="请尽可能地详细描述，包括但不限于："
            description={descriptionFieldAlertDescription}
            showIcon
          />
        </Form.Item>

        <AttachmentUpload
          label="附件图片上传"
          id="attachments"
          getFieldDecorator={getFieldDecorator}
        >
          <Alert type="info" message="单个附件最大5MB." />
        </AttachmentUpload>
        <Form.Item label="预约须知、服务条款">
          {getFieldDecorator("agreement", {
            valuePropName: "checked",
            initialValue: false,
            rules: [
              (rules, value, callback) => {
                if (value === true) {
                  callback();
                }
                callback("必须同意才能发起预约");
              },
            ],
          })(
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
          )}
        </Form.Item>

        <Form.Item wrapperCol={{ span: 2, offset: 11 }}>
          <Button type="primary" htmlType="submit" loading={loading}>
            发起预约
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

const OrderForm = Form.create()(RequestOrderForm);

export { OrderForm };
