import { Route } from "react-router-dom";
import BookReport from "../pages/BookReport/BookReport";
import BookReportDetail from "../pages/BookReport/BookReportDetail";
import BookReportModify from "../pages/BookReport/BookReportModify";
import BookReportNew from "../pages/BookReport/BookReportNew";

export const BookReportRoutes = (
  <>
    <Route path="/bookreport" element={<BookReport />} />
    <Route path="/bookreport/new" element={<BookReportNew />} />
    <Route path="/bookreport/:id" element={<BookReportDetail />} />
    <Route path="/bookreport/:id/modify" element={<BookReportModify />} />
  </>
);
