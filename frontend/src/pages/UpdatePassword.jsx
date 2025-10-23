import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "antd";
const { Content } = Layout;
import { Form, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { updatepwd, token, authErr } from "../feature/auth/authSlice";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const { email } = useParams();
  const dispatch = useDispatch();
  const error = useSelector(authErr);
  const authToken = useSelector(token);
  const navigate = useNavigate();
  const onFinish = (values) => {
    dispatch(updatepwd({ username: email, password: values.password }));
  };
  const [showPwd, setShowPwd] = useState(false);
  useEffect(() => {
    if (!error && authToken) navigate("/");
  }, [authToken, error, navigate]);
  return (
    <Content
      className="site-layout-background"
      style={{
        display: "flex",
        justifyContent: "center",
        padding: 24,
        margin: 0,
        height: 800,
        overflow: "auto",
      }}
    >
      <Form layout="vertical" requiredMark={false} onFinish={onFinish}>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter your password" },
            { 
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                
                if (value.length < 8) {
                  return Promise.reject(new Error("Password must be at least 8 characters long"));
                }
                
                if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value)) {
                  return Promise.reject(new Error("Password must contain uppercase, lowercase, number, and special character"));
                }
                
                return Promise.resolve();
              }
            }
          ]}
        >
          <Input
            key={showPwd ? "text" : "password"}
            size="large"
            type={showPwd ? "text" : "password"}
            placeholder="Your Password"
            suffix={
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="text-gray-600 hover:text-gray-900 text-sm"
                style={{ background: "transparent" }}
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            }
          />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                return !value || getFieldValue("password") === value
                  ? Promise.resolve()
                  : Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input
            key={showPwd ? "text" : "password"}
            size="large"
            type={showPwd ? "text" : "password"}
            placeholder="Repeat your password"
            autoComplete="new-password"
            suffix={
              <button
                type="button"
                onClick={() => setShowPwd((v) => !v)}
                className="text-gray-600 hover:text-gray-900 text-sm"
                style={{ background: "transparent" }}
              >
                {showPwd ? "Hide" : "Show"}
              </button>
            }
          />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          className="w-full !h-11"
        >
          Update password
        </Button>
        <div
          className="mt-2 text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      </Form>
    </Content>
  );
};

export default UpdatePassword;
