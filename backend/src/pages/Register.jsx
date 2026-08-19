import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [role, setRole] = useState('CANDIDATE');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { registerUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const data = await registerUser({ 
                name: `${firstName} ${lastName}`.trim(), 
                email, 
                password, 
                role, 
                phone,
                ...(role === 'COMPANY' && { website })
            });
            
            // Navigate based on actual role returned by backend
            if (data.role === 'CANDIDATE') navigate('/my-applications');
            else if (data.role === 'COMPANY') navigate('/company-dashboard');
            else if (data.role === 'ADMIN') navigate('/admin-dashboard');
            else navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 bg-dark-custom text-white d-flex flex-column position-relative overflow-hidden">
            {/* Background Glow */}
            <div className="glow-effect" style={{ top: '5%', left: '-5%' }}></div>
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
                        <div className="mb-3 text-primary-custom fw-bold" style={{ letterSpacing: '1px', fontSize: '0.85rem', textTransform: 'uppercase' }}>
                            GET STARTED TODAY
                        </div>
                        <h1 className="display-5 fw-bold mb-4">
                            Join thousands of <br />
                            professionals on <br />
                            <span className="text-primary-custom">JobHub</span>
                        </h1>
                        <p className="lead text-muted mb-5" style={{ fontSize: '1.1rem' }}>
                            Create your account in under 2 minutes and start your journey toward your next opportunity.
                        </p>

                        <div className="d-flex flex-column gap-3">
                            <div 
                                className={`role-preview-card ${role === 'CANDIDATE' ? 'active' : ''}`}
                                onClick={() => setRole('CANDIDATE')}
                            >
                                <h6 className={`fw-bold mb-1 ${role === 'CANDIDATE' ? 'text-primary-custom' : 'text-white'}`}>Candidate</h6>
                                <p className="text-muted small mb-0">Browse jobs, apply with one click, track your applications</p>
                            </div>
                            
                            <div 
                                className={`role-preview-card ${role === 'COMPANY' ? 'active' : ''}`}
                                onClick={() => setRole('COMPANY')}
                            >
                                <h6 className={`fw-bold mb-1 ${role === 'COMPANY' ? 'text-primary-custom' : 'text-white'}`}>Company</h6>
                                <p className="text-muted small mb-0">Post jobs, manage listings, find the right talent fast</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel (Form) */}
                    <div className="col-lg-6 ps-lg-5">
                        <div className="login-card">
                            <h3 className="fw-bold mb-1">Create your account</h3>
                            <p className="text-muted mb-4 small">Fill in your details to get started</p>

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
                            </div>

                            <form onSubmit={handleSubmit}>
                                {error && (
                                    <div className="alert alert-danger py-2 small border-0" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                                        <i className="bi bi-exclamation-circle me-2"></i>{error}
                                    </div>
                                )}
                                <div className="row g-3 mb-3">
                                    <div className="col-sm-6">
                                        <label className="form-label text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>FIRST NAME</label>
                                        <input 
                                            type="text" 
                                            className="form-control login-input" 
                                            placeholder="John" 
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="form-label text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>LAST NAME</label>
                                        <input 
                                            type="text" 
                                            className="form-control login-input" 
                                            placeholder="Doe" 
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>EMAIL ADDRESS</label>
                                    <input 
                                        type="email" 
                                        className="form-control login-input" 
                                        placeholder="you@example.com" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>PHONE NUMBER</label>
                                    <input 
                                        type="tel" 
                                        className="form-control login-input" 
                                        placeholder="+91 00000 00000" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                {role === 'COMPANY' && (
                                    <div className="mb-3">
                                        <label className="form-label text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>COMPANY WEBSITE</label>
                                        <input 
                                            type="url" 
                                            className="form-control login-input" 
                                            placeholder="https://example.com" 
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}
                                
                                <div className="row g-3 mb-4">
                                    <div className="col-sm-6">
                                        <label className="form-label text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>PASSWORD</label>
                                        <div className="position-relative">
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                className="form-control login-input pe-5" 
                                                placeholder="Min 6 chars" 
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
                                    </div>
                                    <div className="col-sm-6">
                                        <label className="form-label text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>CONFIRM PASSWORD</label>
                                        <div className="position-relative">
                                            <input 
                                                type={showConfirmPassword ? "text" : "password"} 
                                                className="form-control login-input pe-5" 
                                                placeholder="Repeat password" 
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                            <i 
                                                className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute top-50 translate-middle-y text-muted`}
                                                style={{ right: '15px', cursor: 'pointer' }}
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            ></i>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-check mb-4 d-flex align-items-center gap-2">
                                    <input className="form-check-input form-check-input-custom m-0" type="checkbox" id="termsCheck" required />
                                    <label className="form-check-label text-muted small" htmlFor="termsCheck" style={{ marginTop: '2px' }}>
                                        I agree to the <Link to="/terms" className="text-primary-custom text-decoration-none">Terms of Service</Link> and <Link to="/privacy" className="text-primary-custom text-decoration-none">Privacy Policy</Link>
                                    </label>
                                </div>

                                <button type="submit" className="btn btn-gradient w-100 mb-4" disabled={loading}>
                                    {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>

                                <div className="text-center small text-muted">
                                    Already have an account? <Link to="/login" className="text-primary-custom text-decoration-none fw-bold">Sign in</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
