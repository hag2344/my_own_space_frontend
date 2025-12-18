import "./DiaryViewer.css";
import SearchBar from "../common/SearchBar";
import DiaryItem from "./DiaryItem";
import Pagination from "../common/Pagination";

import Loader from "../common/Loader";
import ScrollTopButton from "../common/ScrollTopButton";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { diaryApi } from "../../api/diaryApi";

import usePagedList from "../../hooks/usePagedList";
import useListQueryParams from "../../hooks/useListQueryParams";
import useScrollToTopOnChange from "../../hooks/useScrollToTopOnChange";

const PAGE_SIZE = 20;

const DiaryViewer = () => {
  const navigate = useNavigate();

  const { appliedKeyword, urlKeyword, page, setPageInUrl, applySearchInUrl } =
    useListQueryParams(); // 기본: p/q/k 사용

  // 입력값은 UI state로만 관리 (뒤로가기로 돌아오면 URL(k)로 복원)
  const [keyword, setKeyword] = useState(urlKeyword);

  // 뒤로가기/앞으로가기 등으로 URL(k)이 바뀌면 input도 맞춰줌
  useEffect(() => {
    setKeyword(urlKeyword);
  }, [urlKeyword]);

  useScrollToTopOnChange({
    containerId: "main-scroll",
    behavior: "auto",
    deps: [page, appliedKeyword], // 페이지/검색 바뀔 때만 탑으로
  });

  /**
   *  usePagedList가 기대하는 형태로 변환해서 반환
   * - success=false면 throw → usePagedList 내부에서 catch 처리
   */
  const fetchDiaryPage = useCallback(
    async (pageParam, size = PAGE_SIZE) => {
      const res = await diaryApi.select(pageParam, size, appliedKeyword);

      // HTTP는 200인데 비즈니스 실패(success=false)인 케이스 방어
      if (!res.data || res.data.success === false) {
        const msg = res.data?.message || "일기 조회에 실패했습니다.";
        console.error("일기 조회 실패:", msg);
        throw new Error(msg);
      }

      const data = res.data.data || {};
      return {
        items: data.items || [],
        totalPages: data.totalPages ?? 1,
      };
    },
    [appliedKeyword]
  );

  const { items, isFetching, totalPages, reload } = usePagedList({
    fetchPage: fetchDiaryPage,
    page,
    pageSize: PAGE_SIZE,
  });

  // 페이지 변경은 URL(p)만 바꿈
  const onPageChange = useCallback(
    (nextPage) => {
      setPageInUrl(nextPage);
    },
    [setPageInUrl]
  );

  // 검색은 항상 0페이지 + 같은 검색어라도 reload로 재조회 가능
  const onSearch = useCallback(() => {
    const nextApplied = keyword.trim();

    const { urlChanged } = applySearchInUrl({
      applied: nextApplied,
      input: keyword,
      resetPage: true, // 검색하면 항상 0페이지
    });

    // URL이 안 바뀐 경우만 강제 재조회
    if (!urlChanged) reload();
  }, [keyword, applySearchInUrl, reload]);

  return (
    <div className="diary-viewer-wrapper">
      <SearchBar
        SearchBarName={"Diary Search..."}
        ButtonName={"새 일기 쓰기"}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onSearch={onSearch}
        onClick={() => navigate("/diary/new")}
      />
      <div className="diary-item-list">
        {items.map((item) => (
          <DiaryItem
            key={item.id}
            {...item}
            onClick={() => navigate(`/diary/${item.id}`)}
          />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        groupSize={5} // 기본값이 5라 생략해도 됨
      />

      {/* 로딩 표시 (PC/모바일 공통) */}
      {isFetching && <Loader />}

      {/* 공통: 맨 위로 이동 버튼 */}
      <ScrollTopButton />
    </div>
  );
};

export default DiaryViewer;
