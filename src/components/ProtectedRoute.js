import { render } from "@testing-library/react";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Login from "../components/Login";

function ProtectedRoute(props) {
  const { Component, setInCall, fullName } = props;

  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    let isLogin = localStorage.getItem("isLogin");
    setIsLogin(isLogin);
  }, [isLogin]);

  if (isLogin) {
    return <Component setInCall={setInCall} />;
  }
  return <Navigate to="/login" />;
}

export default ProtectedRoute;
