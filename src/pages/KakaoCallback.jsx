import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const code = new URL(window.location.href).searchParams.get("code");

      // code 없으면 로그인 페이지로 이동
      if (!code) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        // 백엔드에서 HttpOnly 쿠키(token)가 자동 저장됨
        const res = await api.get("/auth/kakao", { params: { code } });

        if (!res.data.success) {
          alert(res.data.message);
          navigate("/login", { replace: true });
          return;
        }

        navigate("/", { replace: true });
      } catch (err) {
        console.error("카카오 로그인 오류:", err);
        alert("로그인 실패");
        navigate("/login", { replace: true });
      }
    };

    run();
  }, [navigate]);

  return <div>로그인 처리 중...</div>;
};

export default KakaoCallback;
