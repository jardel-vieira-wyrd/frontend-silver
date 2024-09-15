import { useAuthStore } from "../stores/authStore";
import { Button } from "@/components/ui/button";

const UserHeader = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    // window.location.href = '/';
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-black">{user?.name || 'Unknown User'}</span>
      <Button
        onClick={handleLogout}
        variant="secondary"
        size="sm"
        className="bg-white text-black hover:bg-gray-100 border border-gray-300"
      >
        Logout
      </Button>
    </div>
  );
};

export default UserHeader;
