import { useNavigate } from "react-router-dom";
import MyMemoryEditor from "../../components/MyMemory/MyMemoryEditor";
import { myMemoryApi, unwrapResponse } from "../../api/mymemoryApi";

const MyMemoryNew = () => {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    const res = await myMemoryApi.create(payload);
    // if (!res.data?.success) {
    //   throw new Error(res.data?.message || "추억 생성에 실패했습니다.");
    // }
    // navigate("/mymemory", { replace: true });
    const created = unwrapResponse(res, "추억 생성에 실패했습니다.");
    // 생성 후 목록으로 이동 or 상세로 이동
    navigate(`/mymemory/${created.id}`, { replace: true });
  };
  return (
    <div>
      <MyMemoryEditor onSubmit={handleSubmit} />
    </div>
  );
};

export default MyMemoryNew;
