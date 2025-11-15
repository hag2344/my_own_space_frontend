import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import api from "../../api/axios";
import ScheduleModal from "../../components/Schedule/ScheduleModal";
import { toDateStr } from "../../utils/dateFormat";
import "./Schedule.css";

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // 수정/상세
  const [modalOpen, setModalOpen] = useState(false); // 추가/수정 모달

  const headerToolbar = {
    left: "prevYear,prev,next,nextYear today",
    center: "title",
    right: "dayGridMonth,dayGridWeek,timeGridDay",
  };

  // 📌 일정 전체 조회
  const fetchSchedule = async () => {
    try {
      const res = await api.get("/schedule");
      // 서버 → FullCalendar 변환
      const scheduleData = res.data.map((e) => ({
        id: e.id,
        title: e.title,
        start: e.startDate,
        end: e.endDate,
        color: e.color,
        extendedProps: {
          location: e.location,
          description: e.description,
        },
        allDay: e.allDay,
      }));
      setEvents(scheduleData);
    } catch (err) {
      console.error("일정 조회 실패:", err);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  // 날짜 클릭 → 새 일정 추가
  const handleDateClick = (info) => {
    setSelectedEvent({
      id: null,
      title: "",
      start: info.dateStr,
      end: null,
      color: "#3788d8",
      location: "",
      description: "",
      allDay: info.allDay ?? false,
    });
    setModalOpen(true);
  };

  // 일정 클릭 → 수정 모달
  const handleEventClick = (info) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: toDateStr(info.event.start),
      end: toDateStr(info.event.end),
      color: info.event.backgroundColor,
      location: info.event.extendedProps.location,
      description: info.event.extendedProps.description,
      allDay: info.event.allDay,
    });
    setModalOpen(true);
  };

  // 일정 드래그 이동
  const handleEventDrop = async (info) => {
    try {
      console.log(info.event.id);
      await api.put(`/schedule/${info.event.id}`, {
        title: info.event.title,
        startDate: toDateStr(info.event.start),
        endDate: toDateStr(info.event.end),
        color: info.event.backgroundColor,
        location: info.event.extendedProps.location,
        description: info.event.extendedProps.description,
        allDay: info.event.allDay,
      });

      fetchSchedule();
    } catch (err) {
      console.error("일정 이동 실패:", err);
    }
  };

  return (
    <div className="schedule-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        editable={true}
        locale={"ko"}
        timeZone="Asia/Seoul"
        events={events}
        headerToolbar={headerToolbar}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
      />

      {/* 일정 등록/수정 모달 */}
      {modalOpen && (
        <ScheduleModal
          event={selectedEvent}
          onClose={() => setModalOpen(false)}
          onRefresh={fetchSchedule}
        />
      )}
    </div>
  );
};

export default Schedule;
