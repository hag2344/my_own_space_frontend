import "./BookReportViewer.css";

import SearchBar from "../common/SearchBar";
import Pagination from "../common/Pagination";
import Loader from "../common/Loader";
import ScrollTopButton from "../common/ScrollTopButton";
import BookReportItem from "./BookReportItem";

import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";
import { bookReportApi, unwrapPageResponse } from "../../api/bookreportApi";

import usePagedList from "../../hooks/usePagedList";
import useListQueryParams from "../../hooks/useListQueryParams";
import useScrollToTopOnChange from "../../hooks/useScrollToTopOnChange";

const PAGE_SIZE = 10;

const BookReportViewer = () => {
  const navigate = useNavigate();

  const { appliedKeyword, urlKeyword, page, setPageInUrl, applySearchInUrl } =
    useListQueryParams();

  const [keyword, setKeyword] = useState(urlKeyword);

  useEffect(() => {
    setKeyword(urlKeyword);
  }, [urlKeyword]);

  useScrollToTopOnChange({
    containerId: "main-scroll",
    behavior: "auto",
    deps: [page, appliedKeyword],
  });

  const fetchBookReportPage = useCallback(
    async (pageParam, size = PAGE_SIZE) => {
      const res = await bookReportApi.select(pageParam, size, appliedKeyword);

      return unwrapPageResponse(res, "독시 기록 조회에 실패했습니다.");
    },
    [appliedKeyword]
  );

  const { items, isFetching, totalPages, reload } = usePagedList({
    fetchPage: fetchBookReportPage,
    page,
    pageSize: PAGE_SIZE,
  });

  const onPageChange = useCallback(
    (nextPage) => {
      setPageInUrl(nextPage);
    },
    [setPageInUrl]
  );

  const onSearch = useCallback(() => {
    const nextApplied = keyword.trim();

    const { urlChanged } = applySearchInUrl({
      applied: nextApplied,
      input: keyword,
      resetPage: true,
    });

    if (!urlChanged) reload();
  }, [keyword, applySearchInUrl, reload]);

  return (
    <div className="bookreport-viewer-wrapper">
      <SearchBar
        SearchBarName={"BookReport Search..."}
        ButtonName={"독서 기록 쓰기"}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onSearch={onSearch}
        onClick={() => navigate("/bookreport/new")}
      />

      <div className="bookreport-item-list">
        {items.map((item) => (
          <BookReportItem
            key={item.id}
            {...item}
            onClick={() => navigate(`/bookreport/${item.id}`)}
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

export default BookReportViewer;
