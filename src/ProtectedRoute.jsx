import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api/axios";

const ProtectedRoute = () => {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 백엔드에서 쿠키 기반 인증 확인용 API(JWT 검증 요청)
        const res = await api.get("/auth/check");
        setAuth(res.data.success === true);
      } catch (error) {
        // 실패 시 무조건 false 처리
        console.error("Auth check failed:", error);
        setAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (auth === null) return null;

  // 인증 실패 -> 로그인 페이지 이동
  if (!auth) return <Navigate to="/login" replace />;

  // 인증 성공 -> 내부 페이지 렌더링
  return <Outlet />;
};

export default ProtectedRoute;
