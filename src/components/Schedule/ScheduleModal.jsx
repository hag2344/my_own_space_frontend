import { useState } from "react";
import api from "../../api/axios";
import "./ScheduleModal.css";

const ScheduleModal = ({ event, onClose, onRefresh }) => {
  const [title, setTitle] = useState(event.title || "");
  const [startDate, setStartDate] = useState(event.start || "");
  const [endDate, setEndDate] = useState(event.end || "");
  const [color, setColor] = useState(event.color || "#3788d8");
  const [description, setDescription] = useState(event.description || "");

  // 📌 저장
  const handleSave = async () => {
    try {
      const data = {
        title,
        startDate,
        endDate,
        color,
        description,
      };

      if (event.id) {
        await api.put(`/schedule/${event.id}`, data);
      } else {
        await api.post("/schedule", data);
      }

      onRefresh();
      onClose();
    } catch (err) {
      console.error("일정 저장 실패:", err);
    }
  };

  // 📌 삭제
  const handleDelete = async () => {
    if (!event.id) return;

    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await api.delete(`/schedule/${event.id}`);
      onRefresh();
      onClose();
    } catch (err) {
      console.error("일정 삭제 실패:", err);
    }
  };

  return (
    <div className="schedule-modal">
      <div className="schedule-modal-content">
        <h2>{event.id ? "일정 수정" : "새 일정 추가"}</h2>

        <label>제목</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>시작일</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label>종료일</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <label>색상</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <label>설명</label>
        <textarea
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="actions">
          <button onClick={handleSave}>저장</button>
          {event.id && <button onClick={handleDelete}>삭제</button>}
          <button className="close" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
