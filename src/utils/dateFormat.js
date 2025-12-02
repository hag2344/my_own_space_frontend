/* 날짜 포맷 변환 유틸 */
const toDateOnly = (str) => str?.split("T")[0] || "";
export const toDateTime = (date, time = "08:00") => `${date}T${time}`;

/* 일정: 하루종일 toggle 처리 */
export const toggleAllDay = (form, checked) => {
  const startOnly = toDateOnly(form.startDate);
  const endOnly = toDateOnly(form.endDate) || startOnly;

  if (checked) {
    // allDay 활성화 → 날짜만 남기기
    return {
      ...form,
      allDay: true,
      startDate: startOnly,
      endDate: endOnly,
    };
  }

  // allDay 비활성화 → 08:00 / 09:00 붙이기
  return {
    ...form,
    allDay: false,
    startDate: startOnly ? toDateTime(startOnly, "08:00") : "",
    endDate: endOnly ? toDateTime(endOnly, "09:00") : "",
  };
};

/* 시작 날짜가 종료 날짜보다 느릴 경우 종료 날짜 및 시간에 맞게 조정 */
const isAfter = (start, end) => {
  return new Date(start) >= new Date(end);
};

const toLocalDateTime = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
};

export const adjustDateRange = (name, start, end, allDay) => {
  if (!start || !end) return { newStart: start, newEnd: end };
  // 날짜가 아예 역전되면 (start > end) → end = start 로 맞춘다.
  if (isAfter(start, end) && allDay) {
    let objDate = {};
    if (name === "startDate") {
      objDate = { newStart: start, newEnd: start };
    } else {
      objDate = { newStart: end, newEnd: end };
    }
    return objDate;
  }

  // 날짜가 같고 시간이 역전되면 (startTime > endTime) → endTime = startTime 또는 startTime = endTime 보정
  if (isAfter(start, end) && !allDay) {
    console.log("실행?");
    if (name === "startDate") {
      const startDateObj = new Date(start);
      startDateObj.setHours(startDateObj.getHours() + 1);
      end = toLocalDateTime(startDateObj);
      console.log("startDate" + start, end);
    } else {
      const endDateObj = new Date(end);
      endDateObj.setHours(endDateObj.getHours() - 1);
      start = toLocalDateTime(endDateObj);
    }
  }

  return { newStart: start, newEnd: end };
};
