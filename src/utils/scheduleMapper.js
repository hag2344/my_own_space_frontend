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
export const mapCalendarEventToApi = (calenderEvent) => {
  return {
    title: calenderEvent.title,
    startDate: calenderEvent.startStr,
    endDate: calenderEvent.endStr || calenderEvent.startStr,
    allDay: calenderEvent.allDay,
    color: calenderEvent.backgroundColor,
    location: calenderEvent.extendedProps?.location || "",
    description: calenderEvent.extendedProps?.description || "",
  };
};
