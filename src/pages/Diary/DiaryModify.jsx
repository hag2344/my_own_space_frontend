import { useLocation, useNavigate, useParams } from "react-router-dom";
import DiaryEditor from "../../components/Diary/DiaryEditor";
import useDiary from "../../hooks/useDiary";
import { diaryApi } from "../../api/diaryApi";

const DiaryModify = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // detail에서 넘겨준 state (없을 수도 있음)
  const stateData = location.state ?? null;

  // 안전하게는 id로 다시 조회
  const { data, isLoading, error } = useDiary(id);

  // initData 우선순위: stateData(빠른 화면) → data(최신)
  const initData = stateData || data;

  if (isLoading && !stateData) return <div>로딩중...</div>;
  if (error && !stateData) return <div>조회 실패</div>;
  if (!initData) return <div>데이터 없음</div>;

  // 일기 저장 (수정)
  const handleSave = async (form) => {
    if (!form.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!form.todayDate) {
      alert("날짜를 입력해주세요.");
      return;
    }

    if (!form.content) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const res = await diaryApi.update(id, form);
      if (!res.data.success) {
        alert(res.data.message);
        return;
      }
      navigate(-1);
    } catch (err) {
      console.error("일기 수정 실패:", err);
      alert("서버 오류로 수정 실패");
    }
  };

  return <DiaryEditor initData={initData} onSave={handleSave} />;
};

export default DiaryModify;
