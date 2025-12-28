import DiaryEditor from "../../components/Diary/DiaryEditor";
import { useNavigate } from "react-router-dom";
import { diaryApi } from "../../api/diaryApi";

const DiaryNew = () => {
  const navigate = useNavigate();

  // 일기 저장 (생성)
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
    const data = form;

    try {
      const res = await diaryApi.create(data);
      if (!res.data.success) {
        alert(res.data.message);
        return;
      }
      navigate(`/diary/${res.data.data.id}`, { replace: true });
    } catch (err) {
      console.error("일정 저장 실패:", err);
      alert("서버 오류로 저장 실패");
    }
  };

  return (
    <div>
      <DiaryEditor onSave={handleSave} />
    </div>
  );
};

export default DiaryNew;
