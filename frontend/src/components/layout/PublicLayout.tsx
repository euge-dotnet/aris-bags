import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function PublicLayout() {
  return (
    <div className="public-shell">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
