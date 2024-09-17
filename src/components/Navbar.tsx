import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useTaskStore } from "../stores/taskStore";
import UserHeader from "./UserHeader";
import { Menu, X } from 'lucide-react';

const navigation = [
  { name: 'Projects', href: '/', groupBy: 'project' },
  { name: 'Teams', href: '/', groupBy: 'user' }
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { setGroupBy, fetchProjects } = useTaskStore();
  const navigate = useNavigate();

  const handleNavigation = (href: string, groupBy: 'project' | 'user') => {
    setGroupBy(groupBy);
    fetchProjects();
    navigate(href);
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-black">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {isAuthenticated && (
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          )}
          <div className={`flex flex-1 items-center ${isAuthenticated ? 'justify-center sm:items-stretch sm:justify-start' : 'justify-start p-4'}`}>
            <div className="flex flex-shrink-0 items-center">
              <Link to="/" className={`text-white ${isAuthenticated ? 'text-lg font-bold' : 'text-xl font-bold'}`}>
                Task Manager
              </Link>
            </div>
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.href, item.groupBy as 'project' | 'user')}
                      className="max-w-xs text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {isAuthenticated ? (
              <UserHeader />
            ) : (
              <Link
                to="/signin"
                className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {isAuthenticated && isMenuOpen && (
        <div className="sm:hidden border-t border-gray-700 max-w-xs">
          <div className="space-y-1 px-2 pb-3 pt-2 max-w-xs">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href, item.groupBy as 'project' | 'user')}
                className="max-w-xs text-white hover:bg-gray-700 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
