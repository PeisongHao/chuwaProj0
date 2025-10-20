import React from "react";
import { Modal } from "antd";
import { SignInUpForm } from "./SignInUpForm";
import { ForgotPwdForm } from "./ForgotPwdForm";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authErr, login, signup, token } from "../../feature/auth/authSlice";

export function SigninModal({ modalOpen, setModalOpen }) {
  const dispatch = useDispatch();
  const [isSignIn, setIsSignIn] = useState(true);
  const [isForgotPwd, setIsForgotPwd] = useState(false);
  const [hasTitle,setHasTitle] = useState(true);
  const error = useSelector(authErr);
  const authToken = useSelector(token);
  const onFinish = (values) => {
    if (!isForgotPwd) {
      if (isSignIn) {
        dispatch(login({ username: values.email, password: values.password }));
      } else {
        dispatch(signup({ username: values.email, password: values.password,isAdmin : values.isAdmin }));
      }
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleClose = () => {
    setModalOpen(false);
    setIsForgotPwd(false);
    setIsSignIn(true);
    setHasTitle(true);
  };

  useEffect(() => {
    if (!error && authToken) setModalOpen(false);
  }, [authToken,error,setModalOpen]);

  return (
    <Modal
      open={modalOpen}
      onCancel={handleClose}
      footer={null}
      centered
      width={520}
      title={
        <div className="text-center text-[24px] font-bold leading-[28px] tracking-[-0.5px]">
          {isForgotPwd
            ? hasTitle ? "Update your password" : ""
            : isSignIn
            ? "Sign in to your account"
            : "Sign Up an account"}
        </div>
      }
      className="rounded-2xl"
    >
      {isForgotPwd ? (
        <ForgotPwdForm setHasTitle={setHasTitle} onFinishFailed={onFinishFailed} setModalOpen = {setModalOpen}/>
      ) : (
        <SignInUpForm
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          isSignIn={isSignIn}
          setIsSignIn={setIsSignIn}
          setIsForgotPwd={setIsForgotPwd}
        />
      )}
      <div
        className="mt-2 text-sm text-red-600"
        role="alert"
        aria-live="polite"
      >
        {error}
      </div>
    </Modal>
  );
}
