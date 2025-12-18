import { useState, useEffect, useRef, useCallback } from "react";

/**
 * 페이지네이션 전용(PC/모바일 공통)
 *
 * - page는 "외부(=URL)"가 소유
 * - 훅은 page가 바뀌거나 reload()가 호출되면 fetch만 수행
 */
export default function usePagedList({ fetchPage, page, pageSize = 20 }) {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  const requestIdRef = useRef(0);
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    // 같은 page/q여도 재조회 트리거
    setReloadKey((v) => v + 1);
  }, []);

  useEffect(() => {
    const myId = ++requestIdRef.current;
    let cancelled = false;

    const run = async () => {
      setIsFetching(true);

      try {
        const res = await fetchPage(page, pageSize);

        if (!cancelled && myId === requestIdRef.current) {
          setItems(res?.items || []);
          setTotalPages(res?.totalPages ?? 1);
        }
      } catch (err) {
        if (!cancelled && myId === requestIdRef.current) {
          console.error("목록 조회 실패:", err);
          setItems([]);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled && myId === requestIdRef.current) {
          setIsFetching(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [fetchPage, page, pageSize, reloadKey]);

  return { items, totalPages, isFetching, reload };
}
