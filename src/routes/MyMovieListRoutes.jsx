import { Route } from "react-router-dom";
import MyMovieList from "../pages/MyMovieList/MyMovieList";

export const MyMovieListRoutes = (
  <>
    <Route path="/mymovielist" element={<MyMovieList />} />
  </>
);
