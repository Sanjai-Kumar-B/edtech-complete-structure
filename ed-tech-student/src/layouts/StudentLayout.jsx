import { Outlet } from 'react-router-dom'
import { StudentSideNav } from '../components/StudentSideNav'
import { StudentTopBar } from '../components/StudentTopBar'

export function StudentLayout() {
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen selection:bg-violet-200">
      <StudentSideNav />
      <main className="md:ml-72 min-h-screen">
        <StudentTopBar />
        <div className="pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto space-y-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
