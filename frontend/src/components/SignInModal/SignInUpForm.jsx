import React from "react";
import { useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { useDispatch } from "react-redux";
import { clearErrorMessage } from "../../feature/auth/authSlice";

export function SignInUpForm({
  onFinish,
  onFinishFailed,
  isSignIn,
  setIsSignIn,
  setIsForgotPwd,
}) {
  const dispatch = useDispatch();
  const [showPwd, setShowPwd] = useState(false);
  return (
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

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please enter your Password" }]}
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

      {!isSignIn && (
        <>
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
          <Form.Item
            name="isAdmin"
            valuePropName="checked" // 将复选框的选中状态映射到值
            initialValue={false} // 默认 false
          >
            <Checkbox>Is Admin</Checkbox>
          </Form.Item>
        </>
      )}
      <Button
        type="primary"
        htmlType="submit"
        size="large"
        className="w-full !h-11"
      >
        {isSignIn ? "Sign In" : "Create account"}
      </Button>

      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
        <div>
          {isSignIn ? (
            <div>
              Don’t have an account?
              <a
                className="ml-1 text-indigo-600 hover:underline"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setIsSignIn(!isSignIn);
                  dispatch(clearErrorMessage());
                }}
              >
                Sign up
              </a>
            </div>
          ) : (
            <div>
              Already have an account?
              <a
                className="ml-1 text-indigo-600 hover:underline"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setIsSignIn(!isSignIn);
                  dispatch(clearErrorMessage());
                }}
              >
                Sign In
              </a>
            </div>
          )}
        </div>
        {isSignIn && (
          <a
            className="text-indigo-600 hover:underline"
            role="button"
            tabIndex={0}
            onClick={() => {
              setIsForgotPwd(true);
              dispatch(clearErrorMessage());
            }}
          >
            Forgot password?
          </a>
        )}
      </div>
    </Form>
  );
}
