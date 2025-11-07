import "./App.css";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

import { ScheduleRoutes } from "./routes/ScheduleRoutes";
import { DiaryRoutes } from "./routes/DiaryRoutes";
import { MyMemoryRoutes } from "./routes/MyMemoryRoutes";
import { BookReportRoutes } from "./routes/BookReportRoutes";
import { MyMovieListRoutes } from "./routes/MyMovieListRoutes";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          {ScheduleRoutes}
          {DiaryRoutes}
          {MyMemoryRoutes}
          {BookReportRoutes}
          {MyMovieListRoutes}
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
