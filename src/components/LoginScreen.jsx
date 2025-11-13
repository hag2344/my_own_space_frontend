import { Link } from "react-router-dom";
import "./LoginScreen.css";

const LoginScreen = () => {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
  const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

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
    </div>
  );
};

export default LoginScreen;
