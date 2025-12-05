import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-backgroundSecondary">
      <Sidebar />

      {/* Main Content Area - ajusta margen según sidebar */}
      <main className="flex-1 ml-64 transition-all duration-300">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
