import { useNavigate, useParams } from "react-router-dom";
import BookReportDetailViewer from "../../components/BookReport/BookReportDetailViewer";
import useBookReport from "../../hooks/useBookReport";
import { bookReportApi } from "../../api/bookreportApi";

const BookReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useBookReport(id);

  if (isLoading) return <div>데이터 로딩중...!</div>;
  if (error) return <div>조회 실패</div>;
  if (!data) return <div>데이터가 없습니다.</div>;

  // 독서 기록 삭제
  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await bookReportApi.delete(id);
      if (!res.data.success) {
        alert(res.data?.message || "삭제 실패");
        return;
      }
      navigate("/bookreport", { replace: true });
    } catch (err) {
      console.error("독서 기록 삭제 실패:", err);
      alert("서버 오류로 삭제 실패");
    }
  };

  return (
    <div>
      <BookReportDetailViewer
        item={data}
        onBack={() => navigate(-1)}
        onEdit={() => navigate(`/bookreport/${id}/modify`, { state: data })}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default BookReportDetail;
