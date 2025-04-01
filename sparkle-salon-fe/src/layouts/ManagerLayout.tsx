
import Sidebar from "../components/SideBarDashboard";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex bg-white">
            <Sidebar />
            <main className="flex-1 p-6 h-full">{children}</main>
        </div>
    );
}