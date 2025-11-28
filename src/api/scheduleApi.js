import api from "./axios";

export const scheduleApi = {
  select() {
    return api.get("/schedule");
  },
  create(data) {
    return api.post("/schedule", data);
  },
  update(id, data) {
    return api.put(`/schedule/${id}`, data);
  },
  delete(id) {
    return api.delete(`/schedule/${id}`);
  },
};
