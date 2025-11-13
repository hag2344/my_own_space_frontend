import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api/axios";

const ProtectedRoute = () => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/auth/check"); // 백엔드에서 쿠키 기반 인증 확인용 API(JWT 검증 요청)
        setAuth(res.data?.auth === true);
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuth(false); // 실패 시 무조건 false 처리
      }
    };
    checkAuth();
  }, []);

  if (auth === null) return <div>인증 확인 중...</div>;
  if (!auth) return <Navigate to="/login" replace />; // 인증 실패 시 로그인페이지로
  return <Outlet />; // 인증 성공 시 페이지로
};

export default ProtectedRoute;
