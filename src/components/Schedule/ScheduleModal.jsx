import { useState, useEffect } from "react";
import { scheduleApi } from "../../api/scheduleApi";
import "./ScheduleModal.css";

const ScheduleModal = ({ event = {}, onClose, onRefresh }) => {
  const [form, setForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    allDay: true,
    color: "#3788d8",
    location: "",
    description: "",
  });

  // event가 바뀔 때 모달 값 다시 채우기
  useEffect(() => {
    setForm({
      title: event.title || "",
      startDate: event.start || "",
      endDate: event.end || event.start || "",
      color: event.color || "#3788d8",
      location: event.location || "",
      description: event.description || "",
      allDay: event.allDay ?? true,
    });
  }, [event]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 일정 저장 (생성 or 수정)
  const handleSave = async () => {
    if (!form.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!form.startDate) {
      alert("시작일을 입력해주세요.");
      return;
    }

    if (!form.allDay && !form.endDate) {
      alert("종료일을 입력해주세요.");
      return;
    }

    const data = { ...form };

    try {
      if (event.id) {
        const res = await scheduleApi.update(event.id, data);
        if (!res.data.success) {
          alert(res.data.message);
          return;
        }
      } else {
        const res = await scheduleApi.create(data);
        if (!res.data.success) {
          alert(res.data.message);
          return;
        }
      }
      onRefresh();
      onClose();
    } catch (err) {
      console.error("일정 저장 실패:", err);
      alert("서버 오류로 저장 실패");
    }
  };

  return (
    <div className="schedule-modal">
      <div className="schedule-modal-content">
        <h2>{event.id ? "일정 수정" : "새 일정 추가"}</h2>

        <label>제목</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          maxLength={100}
        />

        <label>
          <input
            type="checkbox"
            name="allDay"
            checked={form.allDay}
            onChange={handleChange}
          />
          하루종일
        </label>

        <label>시작</label>
        <input
          type={form.allDay ? "date" : "datetime-local"}
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
        />

        <label>종료</label>
        <input
          type={form.allDay ? "date" : "datetime-local"}
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
        />

        <label>장소</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          maxLength={100}
        />

        <label>색상</label>
        <input
          type="color"
          name="color"
          value={form.color}
          onChange={handleChange}
        />

        <label>메모</label>
        <textarea
          name="description"
          rows="3"
          value={form.description}
          onChange={handleChange}
        />

        <div className="actions">
          <button onClick={handleSave}>저장</button>

          <button className="close" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
