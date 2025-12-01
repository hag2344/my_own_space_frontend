/* ============================
   날짜 포맷 변환 유틸
============================ */
export const toDateOnly = (str) => str?.split("T")[0] || "";
export const toDateTime = (date, time = "08:00") => `${date}T${time}`;

/* ============================
   일정: 하루종일 toggle 처리
============================ */
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
