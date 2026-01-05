import api from "./axios";

export const homeApi = {
  summary() {
    return api.get("/home/summary");
  },
};
