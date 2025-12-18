import { useEffect } from "react";

/**
 * 특정 deps가 바뀔 때 스크롤을 맨 위로 올려주는 공용 훅
 *
 * @param {Object} options
 * @param {string} options.containerId - 스크롤 컨테이너 id (없으면 window)
 * @param {"auto" | "smooth"} options.behavior - 스크롤 애니메이션
 * @param {any[]} options.deps - 변화 감지할 의존성 배열
 * @param {boolean} options.enabled - 동작 여부
 */
export default function useScrollToTopOnChange({
  containerId = "main-scroll",
  behavior = "auto",
  deps = [],
  enabled = true,
} = {}) {
  useEffect(() => {
    if (!enabled) return;

    const el = document.getElementById(containerId);
    if (el) el.scrollTo({ top: 0, behavior });
    else window.scrollTo({ top: 0, behavior });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
