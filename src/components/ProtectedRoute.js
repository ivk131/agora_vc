import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute(props) {
  const { Component } = props;

  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    let isLogin = localStorage.getItem("isLogin");
    setIsLogin(isLogin);
  });
  return (
    <div>
      <Component />
    </div>
  );
}

export default ProtectedRoute;
