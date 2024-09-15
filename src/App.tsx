import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Taskboard from './pages/Taskboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './stores/authStore';

function App() {
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    // You might want to verify the token with your backend here
    if (token) {
      // Optionally refresh the token or fetch user data
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/taskboard" /> : <Home />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/taskboard" /> : <SignUp />} />
        <Route path="/signin" element={isAuthenticated ? <Navigate to="/taskboard" /> : <SignIn />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/taskboard" element={<Taskboard />} />
          {/* Add other protected routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
