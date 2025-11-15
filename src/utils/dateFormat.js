// Date → YYYY-MM-DD 문자열 변환 함수
export const toDateStr = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};
