import ApiHealthCheck from "../blocks/ApiHealthCheck";
import Navbar from "../components/Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
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
