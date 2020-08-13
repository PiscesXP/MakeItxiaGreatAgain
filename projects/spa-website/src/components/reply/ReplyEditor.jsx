import { Button, Form, Input, Modal, Upload } from "antd";
import React from "react";
import * as api from "UTIL/api";
import { config } from "CONFIG";

class ReplyEditorForm extends React.Component {
  state = {
    submitting: false
  };
  onSubmit = e => {
    e.preventDefault();
    const { validateFields, resetFields } = this.props.form;
    const { postUrl, onReply } = this.props;
    validateFields(async (err, values) => {
      if (err) {
        //TODO
        return;
      }
      //检查附件是否全部上传.
      const uploadIDArr = [];
      if (!!!values.attachments) {
        values.attachments = [];
      }
      if (!!!values.tags) {
        values.tags = [];
      }
      for (const file of values.attachments) {
        if (file.percent === 100 && file.status === "done") {
          const { code, payload } = file.response;
          if (code === 0) {
            uploadIDArr.push(payload._id);
          }
        } else {
          Modal.error({
            title: "附件未全部上传",
            content: "请等待附件全部上传，或删除上传失败的附件.",
            centered: true
          });
          return;
        }
      }
      values.attachments = uploadIDArr;
      this.setState({
        submitting: true
      });
      try {
        await api.POST(postUrl, values);
        this.setState({
          submitting: false
        });
        Modal.success({
          title: "回复成功",
          centered: true
        });
        if (onReply) {
          onReply(); //调用来刷新评论
        }
        resetFields();
      } catch (error) {
        Modal.error({
          title: "回复失败",
          content: error.message,
          centered: true
        });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { submitting } = this.state;
    const { TextArea } = Input;
    return (
      <Form onSubmit={this.onSubmit}>
        <Form.Item>
          {getFieldDecorator("content", {
            rules: [{ required: true, message: "请填写回复内容" }]
          })(<TextArea autoSize={{ minRows: 2, maxRows: 8 }} />)}
        </Form.Item>
        <Form.Item label="附件上传">
          {getFieldDecorator("attachments", {
            valuePropName: "fileList",
            getValueFromEvent: e => {
              if (Array.isArray(e)) {
                return e;
              }
              return e && e.fileList;
            }
          })(
            <Upload
              action={
                config.network.api.protocol +
                "://" +
                config.network.api.host +
                "/upload"
              }
              headers={{
                "X-Requested-With": null
              }}
              withCredentials
              listType="picture"
            >
              <Button>上传</Button>
            </Upload>
          )}
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" loading={submitting} type="primary">
            发送回复
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
const ReplyEditor = Form.create()(ReplyEditorForm);

export { ReplyEditor };
