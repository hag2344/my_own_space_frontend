import { useLocation, useNavigate, useParams } from "react-router-dom";
import MyMemoryEditor from "../../components/MyMemory/MyMemoryEditor";
import useMyMemory from "../../hooks/useMyMemory";
import { myMemoryApi, unwrapResponse } from "../../api/mymemoryApi";

const MyMemoryModify = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const stateData = location.state ?? null;
  const { data, isLoading, error } = useMyMemory(id);

  const initData = stateData || data;

  if (isLoading && !stateData) return <div>로딩중...</div>;
  if (error && !stateData) return <div>조회 실패</div>;
  if (!initData) return <div>데이터 없음</div>;

  const handleSubmit = async (payload) => {
    try {
      const res = await myMemoryApi.update(id, payload);
      // if (!res.data?.success) {
      //   throw new Error(res.data?.message || "추억 수정에 실패했습니다.");
      // }
      // navigate(-1);
      const updated = unwrapResponse(res, "추억 수정에 실패했습니다.");
      // navigate(`/mymemory/${updated.id}`, { replace: true });
      navigate(-1);
    } catch (err) {
      console.error("추억 수정 실패:", err);
      alert(err.message || "서버 오류로 수정 실패");
    }
  };

  return (
    <MyMemoryEditor
      initialTitle={initData.title}
      initialContent={initData.contentHtml}
      initialImagePaths={initData.imagePaths || []}
      onSubmit={handleSubmit}
    />
  );
};

export default MyMemoryModify;
