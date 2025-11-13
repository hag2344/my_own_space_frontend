import "./App.css";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import KakaoCallback from "./pages/KakaoCallback";
import ProtectedRoute from "./ProtectedRoute";

import {
  ScheduleRoutes,
  DiaryRoutes,
  MyMemoryRoutes,
  BookReportRoutes,
  MyMovieListRoutes,
} from "./routes";

function App() {
  return (
    <>
      <Routes>
        {/* 로그인 & 콜백카카오는 보호되지 않음 */}
        <Route path="/login" element={<Login />} />
        <Route path="/oauth/kakao" element={<KakaoCallback />} />

        {/* 로그인한 사용자만 접근 가능 */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            {ScheduleRoutes}
            {DiaryRoutes}
            {MyMemoryRoutes}
            {BookReportRoutes}
            {MyMovieListRoutes}
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
