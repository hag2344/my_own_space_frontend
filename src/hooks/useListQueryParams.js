import { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const toSafePage = (v) => {
  const n = Number(v);
  if (Number.isNaN(n) || n < 0) return 0;
  return Math.floor(n);
};

/**
 * 리스트 페이지에서 URL을 단일 소스로 쓰기 위한 공용 훅
 * - q: 실제 검색 적용값
 * - k: 검색 input에 유지할 값
 * - p: 페이지 번호
 */
export default function useListQueryParams({
  pageKey = "p",
  queryKey = "q",
  inputKey = "k",
  defaultPage = 0,
} = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const appliedKeyword = searchParams.get(queryKey) ?? "";
  const urlKeyword = searchParams.get(inputKey) ?? appliedKeyword;

  const pageStr = searchParams.get(pageKey);
  const page = useMemo(
    () => toSafePage(pageStr ?? defaultPage),
    [pageStr, defaultPage]
  );

  const setPageInUrl = useCallback(
    (nextPage) => {
      const next = new URLSearchParams(searchParams);
      next.set(pageKey, String(toSafePage(nextPage)));
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams, pageKey]
  );

  /**
   * 검색 적용: q/k 업데이트 + (보통) p=0으로 리셋
   * 반환값: { urlChanged: boolean }  // 같은 검색어 재조회 판단용
   */
  const applySearchInUrl = useCallback(
    ({ applied, input, resetPage = true }) => {
      const curQ = searchParams.get(queryKey) ?? "";
      const curP = searchParams.get(pageKey) ?? "0";

      const nextP = resetPage ? "0" : curP;

      const next = new URLSearchParams(searchParams);
      next.set(queryKey, applied);
      next.set(inputKey, input);
      if (resetPage) next.set(pageKey, "0");

      setSearchParams(next, { replace: true });

      const urlChanged = curQ !== applied || curP !== nextP;
      return { urlChanged };
    },
    [searchParams, setSearchParams, pageKey, queryKey, inputKey]
  );

  return {
    // 원본도 필요하면 꺼내쓰라고 제공
    searchParams,

    // 읽기
    appliedKeyword,
    urlKeyword,
    page,

    // 쓰기
    setPageInUrl,
    applySearchInUrl,
  };
}
