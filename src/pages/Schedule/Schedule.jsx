import { useEffect, useState, useCallback, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { scheduleApi } from "../../api/scheduleApi";
import ScheduleModal from "../../components/Schedule/ScheduleModal";
import ScheduleDetailModal from "../../components/Schedule/ScheduleDetailModal";

import {
  mapApiToCalendarEvent,
  mapCalendarEventToApi,
} from "../../utils/scheduleMapper";
import "./Schedule.css";

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // 모달에 넘길 데이터
  const [modalMode, setModalMode] = useState(null); // "detail" | "edit"
  const [selectedDate, setSelectedDate] = useState(null);

  const headerToolbar = useMemo(
    () => ({
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,dayGridWeek,timeGridDay",
    }),
    []
  );

  // 일정 전체 조회
  const fetchSchedule = useCallback(async () => {
    try {
      const res = await scheduleApi.select();

      if (!res.data.success) {
        console.error("일정 조회 실패:", res.data.message);
        return;
      }
      const result = res.data.data.map(mapApiToCalendarEvent);
      setEvents(result);
    } catch (err) {
      console.error("일정 조회 실패:", err);
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  // 날짜 클릭 → 새 일정 추가 (기본: 하루종일)
  const handleDateClick = (info) => {
    const clickedDate = info.dateStr;
    if (selectedDate === clickedDate) {
      // 두 번째 클릭 → 생성 모달
      setSelectedEvent({
        id: null,
        title: "",
        start: info.dateStr,
        end: info.dateStr,
        allDay: false,
        color: "#3788d8",
        location: "",
        description: "",
      });
      setModalMode("edit");
    } else {
      // 첫 클릭 → 선택만
      setSelectedDate(clickedDate);
    }
  };

  // 일정 클릭 → 상세보기
  const handleEventClick = (info) => {
    requestAnimationFrame(() => {
      document.querySelectorAll(".fc-popover")?.forEach((el) => el.remove());
    });

    const ev = info.event;

    setSelectedEvent({
      id: ev.id,
      title: ev.title,
      start: ev.startStr, // allDay면 "YYYY-MM-DD", 아니면 "YYYY-MM-DDTHH:mm:ss"
      end: ev.endStr || ev.startStr,
      allDay: ev.allDay,
      color: ev.backgroundColor,
      location: ev.extendedProps?.location || "",
      description: ev.extendedProps?.description || "",
    });

    setModalMode("detail");
  };

  // 드래그로 일정 이동
  const handleEventDrop = async (info) => {
    try {
      const data = mapCalendarEventToApi(info.event);
      const res = await scheduleApi.update(info.event.id, data);

      if (!res.data.success) {
        info.revert(); // 실패 시 원위치
        alert(res.data.message);
        return;
      }
      fetchSchedule();
    } catch (err) {
      console.error("일정 이동 실패:", err);
      info.revert();
      alert("서버 오류로 수정 실패");
    }
  };

  // 리사이즈로 일정 기간/시간 변경
  const handleEventResize = async (info) => {
    try {
      const data = mapCalendarEventToApi(info.event);
      const res = await scheduleApi.update(info.event.id, data);

      if (!res.data.success) {
        info.revert();
        alert(res.data.message);
        return;
      }
      fetchSchedule();
    } catch (err) {
      console.error("일정 리사이즈 실패:", err);
      info.revert();
      alert("서버 오류로 수정 실패");
    }
  };

  // 삭제
  const handleDelete = async (id) => {
    if (!id) return;

    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await scheduleApi.delete(id);

      if (!res.data.success) {
        alert(res.data.message);
        return;
      }
      setModalMode(null);
      fetchSchedule();
    } catch (err) {
      console.error("일정 삭제 실패:", err);
      alert("서버 오류로 삭제 실패");
    }
  };

  return (
    <div className="schedule-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        selectable={true} // 날짜 선택 가능
        editable={true} // 드래그/리사이즈 허용
        dayMaxEvents={true}
        expandRows={true}
        height={"700px"}
        locale={"ko"}
        timeZone="Asia/Seoul"
        events={events}
        headerToolbar={headerToolbar}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        dayCellClassNames={(arg) => {
          const dateStr = arg.date.toISOString().slice(0, 10);
          const day = arg.date.getDay();
          const cls = [];

          if (day === 0) cls.push("fc-sun"); // 일요일
          if (day === 6) cls.push("fc-sat"); // 토요일

          if (selectedDate === dateStr) cls.push("fc-selected-day"); // 선택된 날

          return cls;
        }}
        // allDay 일정 + 시간 일정 동시에 보여줄 수 있도록
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
      />

      {/* 일정 상세정보 모달 */}
      {modalMode === "detail" && (
        <ScheduleDetailModal
          event={selectedEvent}
          onClose={() => setModalMode(null)}
          onEdit={() => {
            setModalMode("edit");
          }}
          onDelete={() => handleDelete(selectedEvent.id)}
        />
      )}

      {/* 일정 등록/수정 모달 */}
      {modalMode === "edit" && (
        <ScheduleModal
          event={selectedEvent}
          onClose={() => setModalMode(null)}
          onRefresh={fetchSchedule}
        />
      )}
    </div>
  );
};

export default Schedule;
