import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { MailOutlined } from "@ant-design/icons";

export function ForgotPwdForm({ setHasTitle, onFinishFailed,setModalOpen }) {
  const [hasSendEmail, sethasSendEmail] = useState(false);

  const navigate = useNavigate();
  const onFinish = (values) => {
    sethasSendEmail(true);
    setHasTitle(false);
    setTimeout(() => {
      setModalOpen(false);
      navigate(`/${values.email}`);
    }, 5000);
  };
  return hasSendEmail ? (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <MailOutlined style={{ fontSize: 48, color: "#3b82f6" }} />
      <p className="mt-4 text-[16px] font-medium text-black leading-relaxed max-w-[300px]">
        We have sent the update password link to your email, please check
        that&nbsp;!
      </p>
    </div>
  ) : (
    <Form
      layout="vertical"
      requiredMark={false}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please enter your email" },
          { type: "email", message: "Please enter a valid email" },
        ]}
      >
        <Input placeholder="you@example.com" size="large" />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        size="large"
        className="w-full !h-11"
      >
        Update password
      </Button>
    </Form>
  );
}
