import "./Aside.css";
import { menuMetaData } from "../../config/menuConfig";
import MenuItem from "./MenuItem";
import api from "../../api/axios";
import { useEffect, useState } from "react";

const Aside = ({ onNavigate }) => {
  const [user, setUser] = useState({ nickname: "", profileImage: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user/me");
        if (!res.data.success) {
          console.error(res.data.message);
          return;
        }
        setUser(res.data.data); // nickname, profileImage, provider
      } catch (err) {
        console.error("사용자 정보 불러오기 실패:", err);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await api.post("/auth/logout");
      if (res.data?.success) {
        alert("로그아웃 되었습니다.");
        // 로그인 페이지로 이동
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <aside className="Aside">
      <ul className="aside_list">
        <li className="menu_profile">
          <img
            src={user.profileImage || "/myownspace.png"}
            alt="프로필 이미지"
          />
          <div className="project_name">
            <MenuItem
              path={menuMetaData.home.path}
              title={menuMetaData.home.webTitle}
              onNavigate={onNavigate}
            />
          </div>
          <div>{user.nickname ? user.nickname : "사용자"}</div>
        </li>

        <li>
          <h2 className="aside_title">메뉴</h2>
          <ul className="menu_list">
            {Object.entries(menuMetaData).map(([key, menu]) => (
              <li key={key}>
                <MenuItem
                  path={menu.path}
                  onNavigate={onNavigate}
                  title={menu.title}
                />
              </li>
            ))}
          </ul>
        </li>
        <li className="menu_logout">
          <div className="logout">
            <a onClick={handleLogout}>- Logout -</a>
          </div>
        </li>
      </ul>
    </aside>
  );
};

export default Aside;
