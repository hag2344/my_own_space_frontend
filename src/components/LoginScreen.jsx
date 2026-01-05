import { Link } from "react-router-dom";
import "./LoginScreen.css";
import api from "../api/axios";
import { useEffect, useState } from "react";

const LoginScreen = () => {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  const [serverState, setServerState] = useState("OFF");

  useEffect(() => {
    const fetchServerState = async () => {
      try {
        const res = await api.get("/auth/server/state");
        setServerState(res.data); // ON
      } catch (err) {
        console.error("서버 상태 정보 불러오기 실패:", err);
      }
    };
    fetchServerState();
  }, []);

  return (
    <div className="LoginWrapper">
      <h2>나만의 공간</h2>
      <div className="LoginScreen">
        <section className="left_section">
          <img src="/loginBackground.png" />
        </section>
        <section className="right_section">
          <h4>- Login -</h4>
          <a href={kakaoAuthUrl}>
            <img src="/kakao_login_medium_wide.png" alt="카카오 로그인" />
          </a>
        </section>
      </div>
      <div className="server_on_off">
        <div>
          - 서버 <span className={`server_${serverState}`}>{serverState}</span>{" "}
          -
        </div>
        <div>※ 로그인 실패 시 다시시도 해주세요.</div>
        <p className="login-notice">
          ℹ️ 무료 배포 환경 특성상 첫 접속 시 로딩이 지연될 수 있습니다.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
