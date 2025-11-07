import { Route } from "react-router-dom";
import Diary from "../pages/Diary/Diary";
import DiaryDetail from "../pages/Diary/DiaryDetail";
import DiaryModify from "../pages/Diary/DiaryModify";
import DiaryNew from "../pages/Diary/DiaryNew";

export const DiaryRoutes = (
  <>
    <Route path="/diary" element={<Diary />} />
    <Route path="/diary/new" element={<DiaryNew />} />
    <Route path="/diary/:id" element={<DiaryDetail />} />
    <Route path="/diary/:id/modify" element={<DiaryModify />} />
  </>
);
