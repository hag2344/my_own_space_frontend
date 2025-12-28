import "./MyMemoryViewer.css";
import SearchBar from "../common/SearchBar";
import MyMemoryItem from "./MyMemoryItem";
import Pagination from "../common/Pagination";
import Loader from "../common/Loader";
import ScrollTopButton from "../common/ScrollTopButton";

import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { myMemoryApi, unwrapPageResponse } from "../../api/mymemoryApi";

import usePagedList from "../../hooks/usePagedList";
import useListQueryParams from "../../hooks/useListQueryParams";
import useScrollToTopOnChange from "../../hooks/useScrollToTopOnChange";

const PAGE_SIZE = 20;

const MyMemoryViewer = () => {
  const navigate = useNavigate();

  // 일기와 같은 공용 훅 사용 (p/q/k)
  const { appliedKeyword, urlKeyword, page, setPageInUrl, applySearchInUrl } =
    useListQueryParams();

  // 입력값은 UI state로만 관리 (뒤로가기 시 URL(k)로 복원)
  const [keyword, setKeyword] = useState(urlKeyword);

  // URL의 k가 바뀌면 input도 맞춰줌
  useEffect(() => {
    setKeyword(urlKeyword);
  }, [urlKeyword]);

  // 페이지 / 검색어 바뀔 때 스크롤 맨 위로
  useScrollToTopOnChange({
    containerId: "main-scroll",
    behavior: "auto",
    deps: [page, appliedKeyword],
  });

  // 페이지 데이터 로더 (usePagedList용)
  const fetchMyMemoryPage = useCallback(
    async (pageParam, size = PAGE_SIZE) => {
      const res = await myMemoryApi.select(pageParam, size, appliedKeyword);

      // unwrapPageResponse: ApiResponse<PagingResponse<T>> 처리
      return unwrapPageResponse(res, "추억 목록 조회에 실패했습니다.");
    },
    [appliedKeyword]
  );

  const { items, isFetching, totalPages, reload } = usePagedList({
    fetchPage: fetchMyMemoryPage,
    page,
    pageSize: PAGE_SIZE,
  });

  // 페이지 변경은 URL p만 변경
  const onPageChange = useCallback(
    (nextPage) => {
      setPageInUrl(nextPage);
    },
    [setPageInUrl]
  );

  // 검색: 항상 0페이지로, 같은 검색어면 reload()
  const onSearch = useCallback(() => {
    const nextApplied = keyword.trim();

    const { urlChanged } = applySearchInUrl({
      applied: nextApplied,
      input: keyword,
      resetPage: true, // 검색 시 항상 0페이지
    });

    if (!urlChanged) reload();
  }, [keyword, applySearchInUrl, reload]);

  return (
    <div className="mymemory-viewer-wrapper">
      <SearchBar
        SearchBarName={"MyMemory Search..."}
        ButtonName={"새 추억 쓰기"}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onSearch={onSearch}
        onClick={() => navigate("/mymemory/new")}
      />

      <div className="mymemory-item-list">
        {items.map((item) => (
          <MyMemoryItem
            key={item.id}
            {...item}
            onClick={() => navigate(`/mymemory/${item.id}`)}
          />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
        groupSize={5}
      />

      {isFetching && <Loader />}

      <ScrollTopButton />
    </div>
  );
};

export default MyMemoryViewer;
