import { Link } from "react-router-dom";
import Layout from "../layouts/Layout";
import { Button } from "@/assets/ui/button";
import { useAuthStore } from "../stores/authStore";

function Home() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Layout>
      <div className="flex flex-col items-center">
        {isAuthenticated ? (
          <div className="text-center">
            <p className="mb-4">Welcome back, {user?.name}!</p>
            <Link to="/taskboard">
              <Button className="text-xl py-6 px-8 w-64">Go to Taskboard</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-6">
            <Link to="/signup">
              <Button className="text-xl py-6 px-8 w-64">Sign Up</Button>
            </Link>
            <Link to="/signin">
              <Button className="text-xl py-6 px-8 w-64">Sign In</Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Home;
