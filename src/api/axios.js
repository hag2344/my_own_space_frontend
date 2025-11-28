import axios from "axios";

const api = axios.create({
  baseURL: "/api", // 자동 프록시 덕분에 로컬/배포 모두 동작
  withCredentials: true, // 쿠키 자동 전송 (JWT 쿠키 인증용)
  headers: { "Content-Type": "application/json" },
  timeout: 7000,
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
    if (
      original?.url?.includes("/auth/refresh") ||
      original?.url?.includes("/auth/check")
    ) {
      return Promise.reject(error);
    }

    // Access Token 만료 케이스
    if (status === 401 || status === 403) {
      original._retry = true;

      // 이미 refresh 진행 중이면 기존 refreshPromise 기다리기
      if (isRefreshing) {
        try {
          await refreshPromise;
          // 원래 요청 재실행
          return api({ ...original });
        } catch (err) {
          return Promise.reject(err);
        }
      }

      // refresh 최초 실행
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

      try {
        await refreshPromise;
        return api({ ...original });
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
