import api from "./axios";

export const diaryApi = {
  select(page = 0, size = 20, q = "") {
    return api.get("/diary", {
      params: {
        page,
        size,
        q: q?.trim() || undefined,
      },
    });
  },
  getById(id) {
    return api.get(`/diary/${id}`);
  },
  create(data) {
    return api.post("/diary", data);
  },
  update(id, data) {
    return api.put(`/diary/${id}`, data);
  },
  delete(id) {
    return api.delete(`/diary/${id}`);
  },
};
