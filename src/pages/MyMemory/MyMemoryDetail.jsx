import { useNavigate, useParams } from "react-router-dom";
import MyMemoryDetailViewer from "../../components/MyMemory/MyMemoryDetailViewer";
import useMyMemory from "../../hooks/useMyMemory";
import { myMemoryApi } from "../../api/mymemoryApi";

const MyMemoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useMyMemory(id);

  if (isLoading) return <div>데이터 로딩중...</div>;
  if (error) return <div>조회 실패</div>;
  if (!data) return <div>데이터가 없습니다.</div>;

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await myMemoryApi.delete(id);
      if (!res.data?.success) {
        alert(res.data?.message || "삭제 실패");
        return;
      }
      navigate("/mymemory", { replace: true });
    } catch (err) {
      console.error("추억 삭제 실패:", err);
      alert("서버 오류로 삭제 실패");
    }
  };

  return (
    <div>
      <MyMemoryDetailViewer
        item={data}
        onBack={() => navigate(-1)}
        onEdit={() => navigate(`/mymemory/${id}/modify`, { state: data })}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default MyMemoryDetail;
