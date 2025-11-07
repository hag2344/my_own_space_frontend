import { Route } from "react-router-dom";
import MyMemory from "../pages/MyMemory/MyMemory";
import MyMemoryDetail from "../pages/MyMemory/MyMemoryDetail";
import MyMemoryModify from "../pages/MyMemory/MyMemoryModify";
import MyMemoryNew from "../pages/MyMemory/MyMemoryNew";

export const MyMemoryRoutes = (
  <>
    <Route path="/mymemory" element={<MyMemory />} />
    <Route path="/mymemory/new" element={<MyMemoryNew />} />
    <Route path="/mymemory/:id" element={<MyMemoryDetail />} />
    <Route path="/mymemory/:id/modify" element={<MyMemoryModify />} />
  </>
);
