import api from "./axios";

// 페이지 응답 공통 언래핑
export function unwrapPageResponse(res, fallbackMsg = "조회 실패") {
  if (!res?.data || res.data.success === false) {
    throw new Error(res?.data?.message || fallbackMsg);
  }
  const data = res.data.data || {};
  return {
    items: data.items || [],
    totalPages: data.totalPages ?? 1,
  };
}

// 단건/일반 응답용
export function unwrapResponse(res, fallbackMsg = "요청 실패") {
  if (!res?.data || res.data.success === false) {
    throw new Error(res?.data?.message || fallbackMsg);
  }
  return res.data.data;
}

export const myMemoryApi = {
  // 리스트 (페이지네이션)
  select(page = 0, size = 20, q = "") {
    return api.get("/mymemory", {
      params: {
        page,
        size,
        q: q?.trim() || undefined,
      },
    });
  },

  // 단건 조회
  getById(id) {
    return api.get(`/mymemory/${id}`);
  },

  // 생성
  create(data) {
    return api.post("/mymemory", data);
  },

  // 수정
  update(id, data) {
    return api.put(`/mymemory/${id}`, data);
  },

  // 삭제
  delete(id) {
    return api.delete(`/mymemory/${id}`);
  },

  // 이미지 업로드 (공용 업로드 API 사용)
  uploadImage(file) {
    const form = new FormData();
    form.append("file", file);

    return api.post("/uploads/image", form, {
      params: { folder: "MYMEMORY" }, // enum 이름과 맞추기
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};
