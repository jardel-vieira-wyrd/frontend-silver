import { Link } from "react-router-dom";
import ApiHealthCheck from "./ApiHealthCheck";
import UserHeader from "./UserHeader";
import { useAuthStore } from "../stores/authStore";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b-2 border-gray-300 p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="block">
            <h1 className="text-3xl font-bold">Silver Task Manager</h1>
          </Link>
          {isAuthenticated && <UserHeader />}
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-100 border-t-2 border-gray-300 p-4 mt-auto">
        <div className="container mx-auto">
          <ApiHealthCheck />
        </div>
      </footer>
    </div>
  );
}

export default Layout;
