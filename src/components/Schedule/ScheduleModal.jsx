import { useState, useEffect, useRef } from "react";
import { scheduleApi } from "../../api/scheduleApi";
import "./ScheduleModal.css";
import { colors } from "../../utils/colorList";
import {
  toDateTime,
  toggleAllDay,
  adjustDateRange,
} from "../../utils/dateFormat";
import Button from "../common/Button";
import { mapFormToApi } from "../../mappers/scheduleMapper";

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

  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);

  // event가 바뀔 때 모달 값 다시 채우기
  useEffect(() => {
    if (!event) return;

    let start = event.start || "";
    let end = event.end || event.start || "";

    // 신규 일정(default 시간 적용)
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

    // 날짜 변경 로직
    if (name === "startDate" || name === "endDate") {
      setForm((prev) => {
        const newStart = name === "startDate" ? value : prev.startDate;
        const newEnd = name === "endDate" ? value : prev.endDate;

        const { newStart: fixedStart, newEnd: fixedEnd } = adjustDateRange(
          name,
          newStart,
          newEnd,
          prev.allDay
        );

        return {
          ...prev,
          startDate: fixedStart,
          endDate: fixedEnd,
        };
      });
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 일정 저장 (생성 or 수정)
  const handleSave = async () => {
    if (savingRef.current) return;
    savingRef.current = true;
    setIsSaving(true);

    try {
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
    } finally {
      savingRef.current = false;
      setIsSaving(false);
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
          <Button
            text={isSaving ? "저장 중..." : "저장"}
            onClick={handleSave}
            type={"New"}
            disabled={isSaving}
          />

          <Button
            text={"닫기"}
            onClick={onClose}
            type={"Basic"}
            disabled={isSaving}
          />
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
