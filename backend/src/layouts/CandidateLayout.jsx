import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CandidateLayout = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.substring(0, 2).toUpperCase();
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 76px)' }}>
            <div className="container-fluid p-0">
                <div className="row g-0">
                    
                    {/* Left Sidebar - Hidden on small screens */}
                    <div className="col-lg-2 d-none d-lg-block bg-dark-custom" style={{ minHeight: 'calc(100vh - 76px)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                        {/* Profile Section */}
                        <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="d-flex align-items-center mb-3">
                                <div className="d-flex align-items-center justify-content-center fw-bold rounded-circle text-white me-3 flex-shrink-0" 
                                     style={{ width: '48px', height: '48px', backgroundColor: '#0ea5e9', fontSize: '1.2rem' }}>
                                    {getInitials(user?.name)}
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0 text-white">{user?.name || 'User'}</h6>
                                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>{user?.email || 'email@example.com'}</div>
                                </div>
                            </div>
                            <span className="badge border px-3 py-1" style={{ borderColor: '#0ea5e9', color: '#38bdf8', borderRadius: '20px', fontWeight: '500' }}>
                                Candidate
                            </span>
                        </div>

                        {/* Navigation Menu */}
                        <div className="p-3">
                            <div className="text-uppercase mb-3 px-3" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', color: '#475569' }}>Main</div>
                            <ul className="nav flex-column mb-4 gap-1">
                                <li className="nav-item">
                                    <Link to="/candidate/dashboard" className={`nav-link px-3 py-2 rounded d-flex align-items-center ${isActive('/candidate/dashboard') ? 'text-white' : 'text-muted hover-bg-dark'}`} style={{ transition: 'all 0.2s', backgroundColor: isActive('/candidate/dashboard') ? 'rgba(14, 165, 233, 0.15)' : 'transparent' }}>
                                        <i className="bi bi-grid me-3 fs-5" style={{ color: isActive('/candidate/dashboard') ? '#38bdf8' : 'inherit' }}></i> 
                                        <span className={isActive('/candidate/dashboard') ? 'fw-medium' : ''}>Dashboard</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/candidate/applications" className={`nav-link px-3 py-2 rounded d-flex align-items-center ${isActive('/candidate/applications') ? 'text-white' : 'text-muted hover-bg-dark'}`} style={{ transition: 'all 0.2s', backgroundColor: isActive('/candidate/applications') ? 'rgba(14, 165, 233, 0.15)' : 'transparent' }}>
                                        <i className="bi bi-file-earmark-text me-3 fs-5" style={{ color: isActive('/candidate/applications') ? '#38bdf8' : 'inherit' }}></i> 
                                        <span className={isActive('/candidate/applications') ? 'fw-medium' : ''}>My Applications</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/candidate/saved-jobs" className={`nav-link px-3 py-2 rounded d-flex align-items-center ${isActive('/candidate/saved-jobs') ? 'text-white' : 'text-muted hover-bg-dark'}`} style={{ transition: 'all 0.2s', backgroundColor: isActive('/candidate/saved-jobs') ? 'rgba(14, 165, 233, 0.15)' : 'transparent' }}>
                                        <i className="bi bi-bookmark me-3 fs-5" style={{ color: isActive('/candidate/saved-jobs') ? '#38bdf8' : 'inherit' }}></i> 
                                        <span className={isActive('/candidate/saved-jobs') ? 'fw-medium' : ''}>Saved Jobs</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/jobs" className="nav-link px-3 py-2 rounded d-flex align-items-center text-muted hover-bg-dark" style={{ transition: 'all 0.2s' }}>
                                        <i className="bi bi-search me-3 fs-5"></i> Browse Jobs
                                    </Link>
                                </li>
                            </ul>

                            <div className="text-uppercase mb-3 px-3 mt-4" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', color: '#475569' }}>Account</div>
                            <ul className="nav flex-column gap-1">
                                <li className="nav-item">
                                    <Link to="/candidate/profile" className={`nav-link px-3 py-2 rounded d-flex align-items-center ${isActive('/candidate/profile') ? 'text-white' : 'text-muted hover-bg-dark'}`} style={{ transition: 'all 0.2s', backgroundColor: isActive('/candidate/profile') ? 'rgba(14, 165, 233, 0.15)' : 'transparent' }}>
                                        <i className="bi bi-person me-3 fs-5" style={{ color: isActive('/candidate/profile') ? '#38bdf8' : 'inherit' }}></i> 
                                        <span className={isActive('/candidate/profile') ? 'fw-medium' : ''}>My Profile</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/candidate/settings" className={`nav-link px-3 py-2 rounded d-flex align-items-center ${isActive('/candidate/settings') ? 'text-white' : 'text-muted hover-bg-dark'}`} style={{ transition: 'all 0.2s', backgroundColor: isActive('/candidate/settings') ? 'rgba(14, 165, 233, 0.15)' : 'transparent' }}>
                                        <i className="bi bi-gear me-3 fs-5" style={{ color: isActive('/candidate/settings') ? '#38bdf8' : 'inherit' }}></i> 
                                        <span className={isActive('/candidate/settings') ? 'fw-medium' : ''}>Settings</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        
                        <style>{`
                            .hover-bg-dark:hover { background-color: rgba(255,255,255,0.03); color: white !important; }
                        `}</style>
                    </div>

                    {/* Main Content Area */}
                    <div className="col-lg-10 p-4 p-md-5">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateLayout;
