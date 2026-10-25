import { Outlet } from "react-router-dom";
import { InstructorSideNavBar } from "../components/InstructorSideNavBar";
import { InstructorTopAppBar } from "../components/InstructorTopAppBar";

export function InstructorLayout() {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body overflow-x-hidden">
      <InstructorSideNavBar />
      <InstructorTopAppBar />
      <main className="ml-64 min-h-screen relative">
        <Outlet />
      </main>
    </div>
  );
}
