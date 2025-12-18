import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { diaryApi } from "../api/diaryApi";

/**
 * 단건 일기 조회 훅
 * - GET /api/diary/{id}
 * - 응답 형태: ApiResponse<DiaryResponseDto> (즉 res.data.data 가 실제 아이템)
 */
const useDiary = (id) => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  const fetchDiaryItem = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await diaryApi.getById(id);

      // 너의 백엔드 응답이 ApiResponse<T> 이므로 실제 데이터는 res.data.data
      const item = res?.data?.data ?? null;

      setData(item);
    } catch (e) {
      setError(e);

      const status = e?.response?.status;

      // 상태코드별 UX (필요 없으면 아래 블럭 삭제/수정)
      if (status === 404) {
        alert("조회 실패: 로그인 필요/권한 없음/데이터 없음");
        navigate("/diary", { replace: true });
        return;
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchDiaryItem();
  }, [fetchDiaryItem]);

  // 필요하면 상세에서 수정/삭제 후 강제 새로고침할 때 쓰려고 refetch 제공
  return { data, isLoading, error, refetch: fetchDiaryItem };
};

export default useDiary;
