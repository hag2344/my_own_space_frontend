import Header from "../components/common/Header";
import Aside from "../components/common/Aside";
import Button from "../components/common/Button";
import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { routeMeta } from "../config/menuConfig";
import "../index.css";
import "./MainLayout.css";

const MainLayout = () => {
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [title, setTitle] = useState("나만의 공간");
  const [subTitle, setSubTitle] = useState("my own space");
  const [fadeIn, setFadeIn] = useState(false);
  const location = useLocation();

  //화면 리사이즈 시 데스크탑이면 강제로 닫힘 상태 해제(겹침 방지)
  const handleResize = useCallback(() => {
    if (window.innerWidth > 768 && isAsideOpen) {
      setIsAsideOpen(false);
    }
  }, [isAsideOpen]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  // 현재 경로 변경 감지해서 제목 변경
  useEffect(() => {
    const matched = [...routeMeta]
      .sort((a, b) => b.path.length - a.path.length)
      .find((r) => location.pathname.startsWith(r.path));
    setTitle(matched?.title || "나만의 공간");
    setSubTitle(matched?.subTitle || "my own space");
    // 페이드인 효과
    setFadeIn(false);
    const timer = setTimeout(() => setFadeIn(true), 10);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const closeIfOverlay = (e) => {
    if (e.target.classList.contains("overlay")) {
      setIsAsideOpen(false);
    }
  };

  return (
    <div
      className={`MainLayout ${fadeIn ? "fade-in" : ""} ${
        isAsideOpen ? "open" : ""
      }`}
    >
      <Button
        onClick={() => setIsAsideOpen(!isAsideOpen)}
        text={"☰"}
        type={"Toggle"}
      />

      <Aside
        onNavigate={() => {
          setIsAsideOpen(false);
        }}
      />
      <Header title={title} subTitle={subTitle} />
      <main className="Main">
        <Outlet />
      </main>

      <div className="overlay" onClick={closeIfOverlay} />
    </div>
  );
};

export default MainLayout;
