import "./ScheduleDetailModal.css";
import Button from "../common/Button";

const ScheduleDetailModal = ({ event, onClose, onEdit, onDelete }) => {
  if (!event) return null;

  return (
    <div className="schedule-detail-modal">
      <div className="detail-content">
        {/* === 상단 헤더 === */}
        <div className="detail-header">
          <h2>{event.title}</h2>

          {/* X 버튼 */}
          <button className="close-icon" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* === 날짜 === */}
        <div className="detail-item">
          <strong>날짜</strong>
          <span>
            {event.allDay
              ? `${event.start} ~ ${event.end}`
              : `${event.start.replace("T", " ")} ~ ${event.end.replace(
                  "T",
                  " "
                )}`}
          </span>
        </div>

        {/* === 장소 === */}
        {event.location && (
          <div className="detail-item">
            <strong>장소</strong>
            <span>{event.location}</span>
          </div>
        )}

        {/* === 메모 === */}
        {event.description && (
          <div className="detail-item">
            <strong>메모</strong>
            <p>{event.description}</p>
          </div>
        )}

        {/* === 하단 버튼 === */}
        <div className="detail-actions">
          <Button text={"수정"} type={"New"} onClick={onEdit} />
          <Button text={"삭제"} type={"Del"} onClick={onDelete} />
          <Button text={"닫기"} type={"Basic"} onClick={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailModal;
