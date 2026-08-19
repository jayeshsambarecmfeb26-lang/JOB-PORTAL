import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Public pages — accessible to everyone
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import JobListings from "./pages/JobListings";
import JobDetail from "./pages/JobDetail";
import Companies from "./pages/Companies";
import Unauthorized from "./pages/Unauthorized";

// Candidate pages — only CANDIDATE role can access
import CandidateLayout from "./layouts/CandidateLayout";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import MyApplications from "./pages/candidate/MyApplications";
import SavedJobs from "./pages/candidate/SavedJobs";
import CandidateProfile from "./pages/candidate/CandidateProfile";
import CandidateSettings from "./pages/candidate/CandidateSettings";

// Company pages — only COMPANY role can access
import CompanyDashboard from "./pages/CompanyDashboard";
import PostJob from "./pages/PostJob";
import EditJob from "./pages/EditJob";

// Admin pages — only ADMIN role can access
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

/**
 * RoleBasedRedirect Component
 *
 * After login, this component checks the user's role and
 * automatically redirects them to their specific dashboard.
 *
 * CANDIDATE → /jobs
 * COMPANY   → /company/dashboard
 * ADMIN     → /admin
 */
const RoleBasedRedirect = () => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;

    if (user.role === "CANDIDATE") return <Navigate to="/candidate/dashboard" />;
    if (user.role === "COMPANY")   return <Navigate to="/company/dashboard" />;
    if (user.role === "ADMIN")     return <Navigate to="/admin" />;

    return <Navigate to="/" />;
};

/**
 * App Component - Main Router
 *
 * This is the root component of the JobHub React application.
 * It wraps the entire app with AuthProvider so all components
 * can access the logged in user's information.
 *
 * Route structure:
 *  Public routes    — anyone can visit (Home, Login, Register, etc.)
 *  Protected routes — only logged in users with correct role can visit
 *
 * ProtectedRoute wraps each protected page and passes the allowed
 * roles. If the user's role doesn't match, they are redirected.
 */
function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                {/* Navbar is shown on all pages */}
                <Navbar />

                <Routes>

                    {/* ─── Public Routes ─── */}

                    {/* Home page — landing page of JobHub */}
                    <Route path="/" element={<Home />} />

                    {/* Login page — shows login form */}
                    <Route path="/login" element={<Login />} />

                    {/* Register page — shows registration form */}
                    <Route path="/register" element={<Register />} />

                    {/* About Us page — information about JobHub */}
                    <Route path="/about" element={<AboutUs />} />

                    {/* Contact Us page — contact form */}
                    <Route path="/contact" element={<ContactUs />} />

                    {/* Job Listings — all open jobs, visible to everyone */}
                    <Route path="/jobs" element={<JobListings />} />

                    {/* Job Detail — individual job page, visible to everyone */}
                    <Route path="/jobs/:id" element={<JobDetail />} />

                    {/* Companies Directory — visible to everyone */}
                    <Route path="/companies" element={<Companies />} />

                    {/* Dashboard redirect — sends user to correct dashboard after login */}
                    <Route path="/dashboard" element={<RoleBasedRedirect />} />

                    {/* Unauthorized page — shown when user accesses wrong role page */}
                    <Route path="/unauthorized" element={<Unauthorized />} />


                    {/* ─── Candidate Protected Routes ─── */}

                    <Route path="/candidate/*" element={
                        <ProtectedRoute allowedRoles={["CANDIDATE"]}>
                            <CandidateLayout>
                                <Routes>
                                    <Route path="dashboard" element={<CandidateDashboard />} />
                                    <Route path="applications" element={<MyApplications />} />
                                    <Route path="saved-jobs" element={<SavedJobs />} />
                                    <Route path="profile" element={<CandidateProfile />} />
                                    <Route path="settings" element={<CandidateSettings />} />
                                    <Route path="*" element={<Navigate to="dashboard" />} />
                                </Routes>
                            </CandidateLayout>
                        </ProtectedRoute>
                    } />
                    
                    {/* Redirect old applications route to new one */}
                    <Route path="/my-applications" element={<Navigate to="/candidate/applications" />} />


                    {/* ─── Company Protected Routes ─── */}

                    {/* Company Dashboard — company sees their job listings and applicants */}
                    <Route path="/company/dashboard" element={
                        <ProtectedRoute allowedRoles={["COMPANY"]}>
                            <CompanyDashboard />
                        </ProtectedRoute>
                    } />

                    {/* Post Job — company creates a new job listing */}
                    <Route path="/company/post-job" element={
                        <ProtectedRoute allowedRoles={["COMPANY"]}>
                            <PostJob />
                        </ProtectedRoute>
                    } />

                    {/* Edit Job — company edits an existing job listing */}
                    <Route path="/company/edit-job/:id" element={
                        <ProtectedRoute allowedRoles={["COMPANY"]}>
                            <EditJob />
                        </ProtectedRoute>
                    } />


                    {/* ─── Admin Protected Routes ─── */}

                    {/* Admin Dashboard — admin manages users, roles, and settings */}
                    <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={["ADMIN"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />


                    {/* Catch all unknown routes and redirect to home */}
                    <Route path="*" element={<Navigate to="/" />} />

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
