import { useEffect, useState } from "react";
import "./ScrollTopButton.css";

const ScrollTopButton = ({ containerId = "main-scroll" }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = document.getElementById(containerId);
    const target = el || window;

    const getTop = () => {
      if (target === window) {
        return (
          window.scrollY ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0
        );
      }
      return target.scrollTop || 0;
    };

    const onScroll = () => {
      setVisible(getTop() > 550);
    };

    onScroll(); // 초기 1회
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, [containerId]);

  const scrollToTop = () => {
    const el = document.getElementById(containerId);
    if (el) el.scrollTo({ top: 0, behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      className={`scroll-top-btn ${visible ? "is-visible" : ""}`}
      onClick={scrollToTop}
      aria-label="맨 위로"
      type="button"
    >
      ↑
    </button>
  );
};

export default ScrollTopButton;
