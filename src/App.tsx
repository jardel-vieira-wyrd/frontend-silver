import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Taskboard from './pages/Taskboard';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './stores/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/taskboard" /> : <Home />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to="/taskboard" /> : <SignUp />} />
        <Route path="/signin" element={isAuthenticated ? <Navigate to="/taskboard" /> : <SignIn />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/taskboard" element={<Taskboard />} />
        </Route>
        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
