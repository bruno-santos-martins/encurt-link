import { Routes, Route } from "react-router-dom";
import { NewLink } from "./components/new-link";
import { RedirectUrl } from "./components/redirect";
import { NotFound } from "./components/not-found";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<NewLink />} />
      <Route path="/error/not-found" element={<NotFound />} />
      <Route path="/:curt" element={<RedirectUrl />} />
    </Routes>
  );
}