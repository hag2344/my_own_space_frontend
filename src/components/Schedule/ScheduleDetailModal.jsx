import "./ScheduleDetailModal.css";

const ScheduleDetailModal = ({ event, onClose, onEdit, onDelete }) => {
  if (!event) return null;

  return (
    <div className="schedule-detail-modal">
      <div className="detail-content">
        <h2>{event.title}</h2>

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

        {event.location && (
          <div className="detail-item">
            <strong>장소</strong>
            <span>{event.location}</span>
          </div>
        )}

        {event.description && (
          <div className="detail-item">
            <strong>메모</strong>
            <p>{event.description}</p>
          </div>
        )}

        <div className="detail-actions">
          <button className="edit-btn" onClick={onEdit}>
            수정
          </button>
          <button className="delete-btn" onClick={onDelete}>
            삭제
          </button>
          <button className="close-btn" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailModal;
