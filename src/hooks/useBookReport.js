import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { bookReportApi, unwrapResponse } from "../api/bookreportApi";

const useBookReport = (id) => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  const fetchBookReportItem = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await bookReportApi.getById(id);
      const item = unwrapResponse(res, "독서 기록 조회에 실패했습니다.");
      setData(item);
    } catch (e) {
      setError(e);

      const status = e?.response?.status;
      if (status === 404) {
        alert("조회 실패: 로그인 필요/권한 없음/데이터 없음");
        navigate("/bookreport", { replace: true });
        return;
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchBookReportItem();
  }, [fetchBookReportItem]);

  return { data, isLoading, error, refetch: fetchBookReportItem };
};

export default useBookReport;
