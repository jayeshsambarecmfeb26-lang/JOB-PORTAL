import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CandidateDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ applied: 0, saved: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [appsRes, savedRes] = await Promise.all([
                    api.get('/api/applications/my'),
                    api.get('/api/saved-jobs')
                ]);
                setStats({
                    applied: appsRes.data.length,
                    saved: savedRes.data.length
                });
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary-custom" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="mb-5 d-flex justify-content-between align-items-center">
                <div>
                    <h3 className="fw-bold mb-1">Welcome back, {user?.name?.split(' ')[0]}! 👋</h3>
                    <p className="text-muted mb-0 fw-medium">Here is what's happening with your job search today.</p>
                </div>
                <button onClick={() => window.location.reload()} className="btn btn-outline-secondary fw-bold px-3 py-2 d-flex align-items-center" style={{ borderRadius: '8px' }}>
                    <i className="bi bi-arrow-clockwise me-2"></i> Refresh Data
                </button>
            </div>

            <div className="row g-4 mb-5">
                <div className="col-md-6 col-xl-4">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', color: 'white' }}>
                        <div className="card-body p-4 position-relative overflow-hidden">
                            <i className="bi bi-file-earmark-text position-absolute" style={{ fontSize: '6rem', opacity: 0.1, right: '-10px', bottom: '-20px' }}></i>
                            <div className="text-uppercase mb-2" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', opacity: 0.8 }}>Total Applications</div>
                            <h2 className="fw-bold mb-3">{stats.applied}</h2>
                            <Link to="/candidate/applications" className="btn btn-sm btn-light fw-bold" style={{ borderRadius: '20px' }}>View All</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-xl-4">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #f59e0b, #ea580c)', color: 'white' }}>
                        <div className="card-body p-4 position-relative overflow-hidden">
                            <i className="bi bi-bookmark position-absolute" style={{ fontSize: '6rem', opacity: 0.1, right: '-10px', bottom: '-20px' }}></i>
                            <div className="text-uppercase mb-2" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', opacity: 0.8 }}>Saved Jobs</div>
                            <h2 className="fw-bold mb-3">{stats.saved}</h2>
                            <Link to="/candidate/saved-jobs" className="btn btn-sm btn-light fw-bold" style={{ borderRadius: '20px' }}>View Saved</Link>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-xl-4">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px', background: 'white' }}>
                        <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center text-center">
                            <div className="mb-3" style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f0fdf4', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                                <i className="bi bi-search"></i>
                            </div>
                            <h5 className="fw-bold mb-2">Find Your Next Role</h5>
                            <p className="text-muted small mb-3">Browse thousands of jobs that match your skills.</p>
                            <Link to="/jobs" className="btn btn-primary-custom px-4 rounded-pill fw-bold">Browse Jobs</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CandidateDashboard;
