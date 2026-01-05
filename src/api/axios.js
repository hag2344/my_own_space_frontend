import axios from "axios";

const api = axios.create({
  baseURL: "/api", // 자동 프록시 덕분에 로컬/배포 모두 동작
  withCredentials: true, // 쿠키 자동 전송 (JWT 쿠키 인증용)
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

let isRefreshing = false;
let refreshPromise = null;

// 인터셉터로 토큰 만료 자동 처리
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    // 원본 요청이 없거나 이미 재시도된 경우 중단
    if (!original || original._retry) {
      return Promise.reject(error);
    }

    // refresh 또는 check 요청 자체가 실패한 경우 중단
    if (original?.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // Access Token 만료 케이스
    // 401/403만 처리
    if (status !== 401 && status !== 403) {
      return Promise.reject(error);
    }

    original._retry = true;

    // 쓰기 요청은 자동 재시도 금지 (중복 생성 방지)
    const method = (original.method || "get").toLowerCase();
    const isWrite = ["post", "put", "patch", "delete"].includes(method);

    // refresh는 한 번만 공유해서 수행
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = api
        .get("/auth/refresh")
        .then((res) => {
          console.log("Access Token 재발급 완료");
          return res;
        })
        .catch((err) => {
          console.warn("Refresh Token도 만료됨");
          alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
          window.location.href = "/login";
          throw err;
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    //  refreshPromise가 혹시라도 없으면 그대로 실패 처리
    if (!refreshPromise) return Promise.reject(error);

    try {
      await refreshPromise;

      // refresh는 성공했지만, 쓰기 요청은 자동 재시도 안 함
      if (isWrite) {
        alert("세션이 갱신되었습니다. 다시 저장 버튼을 눌러주세요.");
        return Promise.reject(error);
      }

      // 읽기 요청만 자동 재시도
      return api({ ...original });
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

export default api;
