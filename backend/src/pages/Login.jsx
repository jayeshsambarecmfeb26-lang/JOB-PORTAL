import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [role, setRole] = useState('CANDIDATE');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { loginUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await loginUser({ email, password });
            
            // Check if the selected tab matches the actual user role
            if (data.role !== role) {
                logout(); // Immediately log them out
                throw new Error(`This email is registered as a ${data.role.toLowerCase()}, not a ${role.toLowerCase()}. Please select the correct tab.`);
            }
            
            // Navigate based on actual role returned by backend
            if (data.role === 'CANDIDATE') navigate('/candidate/dashboard');
            else if (data.role === 'COMPANY') navigate('/company/dashboard');
            else if (data.role === 'ADMIN') navigate('/admin');
            else navigate('/');
        } catch (err) {
            setError(err.message || err.response?.data?.message || 'Failed to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 bg-dark-custom text-white d-flex flex-column position-relative overflow-hidden">
            {/* Background Glow */}
            <div className="glow-effect" style={{ top: '10%', left: '5%' }}></div>
            <div className="glow-effect" style={{ bottom: '10%', right: '20%' }}></div>

            {/* Header */}
            <div className="container pt-4 position-relative z-1">
                <div className="d-flex justify-content-between align-items-center">
                    <Link className="navbar-brand brand-logo text-white h4 mb-0 text-decoration-none" to="/">
                        Job<span className="text-primary-custom">Hub</span>
                    </Link>
                    <Link to="/" className="text-muted text-decoration-none d-flex align-items-center gap-2" style={{ transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color='white'} onMouseOut={e => e.target.style.color='var(--text-muted)'}>
                        <i className="bi bi-arrow-left"></i> Back to home
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="container flex-grow-1 d-flex align-items-center py-5 position-relative z-1">
                <div className="row w-100 g-5 align-items-center mx-0">
                    
                    {/* Left Panel */}
                    <div className="col-lg-6 pe-lg-5 mb-5 mb-lg-0">
                        <div className="mb-3 text-primary-custom fw-bold" style={{ letterSpacing: '1px', fontSize: '0.85rem' }}>
                            WELCOME BACK
                        </div>
                        <h1 className="display-5 fw-bold mb-4">
                            Your career journey <br />
                            continues <span className="text-primary-custom">here</span>
                        </h1>
                        <p className="lead text-muted mb-5" style={{ fontSize: '1.1rem' }}>
                            Log in to access your personalized dashboard, track applications, and discover new opportunities.
                        </p>

                        <div className="d-flex flex-column gap-4">
                            <div className="d-flex align-items-center gap-3">
                                <div className="feature-icon-login">
                                    <i className="bi bi-briefcase"></i>
                                </div>
                                <div>
                                    <span className="text-white fw-medium">Candidates</span>
                                    <span className="text-muted"> — track applications and get hired</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <div className="feature-icon-login">
                                    <i className="bi bi-building"></i>
                                </div>
                                <div>
                                    <span className="text-white fw-medium">Companies</span>
                                    <span className="text-muted"> — manage listings and find talent</span>
                                </div>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <div className="feature-icon-login" style={{ color: '#22c55e' }}>
                                    <i className="bi bi-shield-check"></i>
                                </div>
                                <div>
                                    <span className="text-white fw-medium">Secure</span>
                                    <span className="text-muted"> — JWT protected sessions</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel (Form) */}
                    <div className="col-lg-6 ps-lg-5">
                        <div className="login-card">
                            <h3 className="fw-bold mb-1">Sign in</h3>
                            <p className="text-muted mb-4 small">Enter your credentials to continue</p>

                            {/* Role Switcher */}
                            <div className="role-switch mb-4">
                                <div 
                                    className={`role-tab ${role === 'CANDIDATE' ? 'active' : ''}`}
                                    onClick={() => setRole('CANDIDATE')}
                                >
                                    Candidate
                                </div>
                                <div 
                                    className={`role-tab ${role === 'COMPANY' ? 'active' : ''}`}
                                    onClick={() => setRole('COMPANY')}
                                >
                                    Company
                                </div>
                                <div 
                                    className={`role-tab ${role === 'ADMIN' ? 'active' : ''}`}
                                    onClick={() => setRole('ADMIN')}
                                >
                                    Admin
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                {error && (
                                    <div className="alert alert-danger py-2 small border-0" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                                        <i className="bi bi-exclamation-circle me-2"></i>{error}
                                    </div>
                                )}
                                <div className="mb-3">
                                    <label className="form-label text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>EMAIL ADDRESS</label>
                                    <div className="position-relative">
                                        <input 
                                            type="email" 
                                            className="form-control login-input" 
                                            placeholder="you@example.com" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="form-label text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>PASSWORD</label>
                                    <div className="position-relative">
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            className="form-control login-input pe-5" 
                                            placeholder="Enter your password" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <i 
                                            className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute top-50 translate-middle-y text-muted`}
                                            style={{ right: '15px', cursor: 'pointer' }}
                                            onClick={() => setShowPassword(!showPassword)}
                                        ></i>
                                    </div>
                                    <div className="text-end mt-2">
                                        <Link to="/forgot-password" className="text-primary-custom text-decoration-none small">Forgot password?</Link>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-gradient w-100 mb-4" disabled={loading}>
                                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                                    {loading ? 'Signing in...' : 'Sign in to JobHub'}
                                </button>



                                <div className="text-center small text-muted">
                                    Don't have an account? <Link to="/register" className="text-primary-custom text-decoration-none fw-bold">Register here</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
