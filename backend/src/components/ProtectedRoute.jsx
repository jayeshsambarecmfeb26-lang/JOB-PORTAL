import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute Component
 *
 * This component acts as a security guard for React routes.
 * It checks whether the logged in user has permission to
 * access a specific page based on their role.
 *
 * Three scenarios it handles:
 *  1. User is not logged in
 *     → Redirects to /login page
 *
 *  2. User is logged in but their role is not allowed for this route
 *     → Redirects to /unauthorized page
 *
 *  3. User is logged in and has the correct role
 *     → Renders the requested page normally
 *
 * Usage in App.jsx:
 *  <ProtectedRoute allowedRoles={["CANDIDATE"]}>
 *      <MyApplications />
 *  </ProtectedRoute>
 *
 * @param allowedRoles - array of roles that can access this route
 * @param children     - the page component to render if access is granted
 */
const ProtectedRoute = ({ allowedRoles, children }) => {

    const { user } = useAuth();

    // Scenario 1: Not logged in — redirect to login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Scenario 2: Logged in but wrong role — redirect to unauthorized page
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Scenario 3: Logged in and correct role — render the page
    return children;
};

export default ProtectedRoute;
