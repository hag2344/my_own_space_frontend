/**
 * 서버 → FullCalendar Event 변환
 *  - 서버: startDate / endDate / allDay / color / location / description
 *  - 캘린더: start / end / allDay / backgroundColor / extendedProps
 */
export const mapApiToCalendarEvent = (apiEvent) => {
  return {
    id: apiEvent.id,
    title: apiEvent.title,
    start: apiEvent.startDate, // "2025-02-12" or "2025-02-12T14:30"
    end: apiEvent.endDate || apiEvent.startDate,
    allDay: apiEvent.allDay,
    backgroundColor: apiEvent.color,
    borderColor: apiEvent.color,
    extendedProps: {
      location: apiEvent.location,
      description: apiEvent.description,
    },
  };
};

/**
 * FullCalendar Event → 서버로 보낼 DTO 변환
 */
export const mapCalendarEventToApi = (calendarEvent) => {
  return {
    title: calendarEvent.title,
    startDate: calendarEvent.startStr,
    endDate: calendarEvent.endStr || calendarEvent.startStr,
    allDay: calendarEvent.allDay,
    color: calendarEvent.backgroundColor,
    location: calendarEvent.extendedProps?.location || "",
    description: calendarEvent.extendedProps?.description || "",
  };
};

/**
 * 새 일정 등록, 수정 Form → 서버로 보낼 DTO 변환
 */
export const mapFormToApi = (form) => {
  let start = form.startDate;
  let end = form.endDate;

  // allDay라면 +1 day
  if (form.allDay) {
    const endObj = new Date(end);
    endObj.setDate(endObj.getDate() + 1);
    end = endObj.toISOString().split("T")[0];
  }

  return {
    title: form.title,
    startDate: start,
    endDate: end,
    allDay: form.allDay,
    color: form.color,
    location: form.location,
    description: form.description,
  };
};

/**
 * FullCalendar Event → Form으로 보낼 DTO 변환
 */
export const mapCalendarEventToForm = (calendarEvent) => {
  let start = calendarEvent.startStr;
  let end = calendarEvent.endStr || calendarEvent.startStr;
  // allDay면 endDate - 1 해서 원래 선택 날짜로 복구
  if (calendarEvent.allDay && end) {
    const endObj = new Date(end);
    endObj.setDate(endObj.getDate() - 1);
    end = endObj.toISOString().split("T")[0];
  }

  return {
    id: calendarEvent.id,
    title: calendarEvent.title,
    startDate: start,
    endDate: end,
    allDay: calendarEvent.allDay,
    color: calendarEvent.backgroundColor,
    location: calendarEvent.extendedProps?.location || "",
    description: calendarEvent.extendedProps?.description || "",
  };
};
