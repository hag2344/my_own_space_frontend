import { useState, useEffect } from "react";
import { scheduleApi } from "../../api/scheduleApi";
import "./ScheduleModal.css";
import { colors } from "../../utils/colorList";
import { toDateOnly, toDateTime, toggleAllDay } from "../../utils/dateFormat";
import Button from "../common/Button";
import { mapFormToApi } from "../../utils/scheduleMapper";

const ScheduleModal = ({ event = {}, onClose, onRefresh }) => {
  const [form, setForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    allDay: false,
    color: "#3788d8",
    location: "",
    description: "",
  });

  // event가 바뀔 때 모달 값 다시 채우기
  useEffect(() => {
    let start = event.start || "";
    let end = event.end || event.start || "";
    if (!event.id && start) {
      start = toDateTime(start, "08:00");
      end = toDateTime(end, "09:00");
    }
    setForm({
      title: event.title || "",
      startDate: start,
      endDate: end,
      color: event.color || "#3788d8",
      location: event.location || "",
      description: event.description || "",
      allDay: event.allDay ?? false,
    });
  }, [event]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 하루 종일 체크박스 전용 처리
    if (name === "allDay") {
      setForm((prev) => toggleAllDay(prev, checked));
      return;
    }

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

    const data = mapFormToApi({ ...form });

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
        <div className="checkbox-row">
          <label htmlFor="allDay" className="checkbox-label">
            하루 종일
          </label>
          <input
            id="allDay"
            type="checkbox"
            name="allDay"
            className="checkbox-input"
            checked={form.allDay}
            onChange={handleChange}
          />
        </div>

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
        <div className="color-picker">
          {colors.map((c) => (
            <div
              key={c}
              className={`color-box ${form.color === c ? "selected" : ""}`}
              style={{ backgroundColor: c }}
              onClick={() => setForm({ ...form, color: c })}
            />
          ))}
        </div>

        <label>메모</label>
        <textarea
          name="description"
          rows="3"
          value={form.description}
          onChange={handleChange}
        />

        <div className="actions">
          <Button text={"저장"} onClick={handleSave} type={"New"} />

          <Button text={"닫기"} onClick={onClose} type={"Basic"} />
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
