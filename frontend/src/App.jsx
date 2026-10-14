import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Spinner from "./components/Spinner";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Application from "./pages/Application";
import MyApplications from "./pages/MyApplications";
import PostJob from "./pages/PostJob";
import MyJobs from "./pages/MyJobs";
import Applications from "./pages/Applications";
import NotFound from "./pages/NotFound";

// Only accessible when NOT logged in
const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

// Only accessible when logged in
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Only accessible by a specific role
const RoleRoute = ({ children, role }) => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== role) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute>
                <JobDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/application/:jobId"
            element={
              <RoleRoute role="Job Seeker">
                <Application />
              </RoleRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <RoleRoute role="Job Seeker">
                <MyApplications />
              </RoleRoute>
            }
          />
          <Route
            path="/post-job"
            element={
              <RoleRoute role="Employer">
                <PostJob />
              </RoleRoute>
            }
          />
          <Route
            path="/my-jobs"
            element={
              <RoleRoute role="Employer">
                <MyJobs />
              </RoleRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <RoleRoute role="Employer">
                <Applications />
              </RoleRoute>
            }
          />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;
