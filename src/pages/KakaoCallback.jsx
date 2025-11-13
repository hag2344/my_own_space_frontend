import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (!code) return;

    api
      .get("/auth/kakao", { params: { code } })
      .then(() => {
        // 백엔드에서 HttpOnly 쿠키(token)가 자동 저장됨
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.error("카카오 로그인 오류:", err);
        alert("로그인 실패");
        navigate("/login");
      });
  }, [navigate]);

  return <div>로그인 중입니다...</div>;
};

export default KakaoCallback;
