import { useState, useEffect } from "react";
import api from "../../api/axios";
import "./ScheduleModal.css";

const ScheduleModal = ({ event = {}, onClose, onRefresh }) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [color, setColor] = useState("#3788d8");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  // event가 바뀔 때 모달 값 다시 채우기
  useEffect(() => {
    setTitle(event.title || "");
    setStartDate(event.start || "");
    setEndDate(event.end || "");
    setColor(event.color || "#3788d8");
    setLocation(event.location || "");
    setDescription(event.description || "");
  }, [event]);

  // 저장
  const handleSave = async () => {
    try {
      const data = {
        title,
        startDate,
        endDate,
        color,
        location,
        description,
      };
      console.log("전송 데이터 :", data);

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

  // 삭제
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
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
        />

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

        <label>장소</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          maxLength={100}
        />

        <label>색상</label>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <label>메모</label>
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
