import { useNavigate, useParams } from "react-router-dom";
import DiaryDetailViewer from "../../components/Diary/DiaryDetailViewer";
import useDiary from "../../hooks/useDiary";
import { diaryApi } from "../../api/diaryApi";

const DiaryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useDiary(id);

  if (isLoading) return <div>데이터 로딩중...!</div>;
  if (error) return <div>조회 실패</div>;
  if (!data) return <div>데이터가 없습니다.</div>;

  // 일기 삭제
  const handleDelete = async () => {
    if (!id) return;

    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await diaryApi.delete(id);

      if (!res.data.success) {
        alert(res.data.message);
        return;
      }

      navigate("/diary", { replace: true });
    } catch (err) {
      console.error("일기 삭제 실패:", err);
      alert("서버 오류로 삭제 실패");
    }
  };

  return (
    <div>
      <DiaryDetailViewer
        item={data}
        onBack={() => navigate(-1)}
        onEdit={() => navigate(`/diary/${id}/modify`, { state: data })}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DiaryDetail;
