import { Outlet } from "react-router-dom";
import { AdminSideNav } from "../components/AdminSideNav";
import { AdminTopBar } from "../components/AdminTopBar";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      <AdminSideNav />
      <AdminTopBar />
      <main className="ml-72 min-h-screen relative">
        <Outlet />
      </main>
    </div>
  );
}
