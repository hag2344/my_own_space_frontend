import BookReportEditor from "../../components/BookReport/BookReportEditor";
import { useNavigate } from "react-router-dom";
import { bookReportApi, unwrapResponse } from "../../api/bookreportApi";

const BookReportNew = () => {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const res = await bookReportApi.create(payload);
    const created = unwrapResponse(res, "독서 기록 생성에 실패했습니다.");
    // 생성 후 목록으로 이동 or 상세로 이동
    navigate(`/bookreport/${created.id}`, { replace: true });
  };

  return (
    <div>
      <BookReportEditor onSubmit={handleSubmit} />
    </div>
  );
};

export default BookReportNew;
