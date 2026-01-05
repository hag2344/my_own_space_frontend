import { useLocation, useNavigate, useParams } from "react-router-dom";
import BookReportEditor from "../../components/BookReport/BookReportEditor";
import useBookReport from "../../hooks/useBookReport";
import { bookReportApi, unwrapResponse } from "../../api/bookreportApi";

const BookReportModify = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const stateData = location.state ?? null;
  const { data, isLoading, error } = useBookReport(id);

  const initData = stateData || data;

  if (isLoading && !stateData) return <div>로딩중...</div>;
  if (error && !stateData) return <div>조회 실패</div>;
  if (!initData) return <div>데이터 없음</div>;

  const handleSubmit = async (payload) => {
    try {
      const res = await bookReportApi.update(id, payload);

      navigate(-1);
    } catch (err) {
      console.error("독서 기록 수정 실패:", err);
      alert(err.message || "서버 오류로 수정 실패");
    }
  };

  return (
    <div>
      <BookReportEditor initData={initData} onSubmit={handleSubmit} />
    </div>
  );
};

export default BookReportModify;
