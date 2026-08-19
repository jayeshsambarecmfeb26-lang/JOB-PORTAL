import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getDashboardLink = () => {
        if (user?.role === 'CANDIDATE') return '/my-applications';
        if (user?.role === 'COMPANY') return '/company/dashboard';
        if (user?.role === 'ADMIN') return '/admin';
        return '/';
    };

    // Do not show the global navbar on login and register pages
    if (location.pathname === '/login' || location.pathname === '/register') {
        return null;
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark-custom py-3">
            <div className="container-fluid px-4 px-lg-5">
                <Link className="navbar-brand brand-logo text-white" to="/">
                    Job<span className="text-primary-custom">Hub</span>
                </Link>
                <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item">
                            <Link className="nav-link nav-link-custom" to="/jobs">Browse Jobs</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link nav-link-custom" to="/companies">Companies</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link nav-link-custom" to="/about">About</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link nav-link-custom" to="/contact">Contact</Link>
                        </li>
                    </ul>
                    <div className="d-flex gap-3 mt-3 mt-lg-0">
                        {user ? (
                            <>
                                <Link to={getDashboardLink()} className="btn btn-outline-custom px-4" style={{ color: '#38BDF8', borderColor: '#38BDF8', fontWeight: '500' }}>Dashboard</Link>
                                <button onClick={handleLogout} className="btn btn-outline-danger px-4" style={{ fontWeight: '500' }}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline-custom px-4">Login</Link>
                                <Link to="/register" className="btn btn-primary-custom px-4">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
