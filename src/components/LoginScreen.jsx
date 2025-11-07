import { Link } from "react-router-dom";
import "./LoginScreen.css";

const LoginScreen = () => {
  return (
    <div className="LoginWrapper">
      <h2>나만의 공간</h2>
      <div className="LoginScreen">
        <section className="left_section">
          <img src="/loginBackground.png" />
        </section>
        <section className="right_section">
          <h4>- Login -</h4>
          <Link>
            <img src="/kakao_login_medium_wide.png" alt="카카오 로그인" />
          </Link>
        </section>
      </div>
    </div>
  );
};

export default LoginScreen;
