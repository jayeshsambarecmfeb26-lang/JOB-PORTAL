import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';


const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await api.get('/api/applications/my');
                setApplications(response.data);
            } catch (err) {
                console.error("Failed to fetch applications", err);
                setError("Failed to load your applications.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const getStatusBadge = (status) => {
        switch(status?.toUpperCase()) {
            case 'PENDING':
                return <span className="badge fw-medium px-3 py-2" style={{ backgroundColor: '#fef3c7', color: '#b45309', borderRadius: '20px' }}>Pending</span>;
            case 'ACCEPTED':
                return <span className="badge fw-medium px-3 py-2" style={{ backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '20px' }}>Accepted</span>;
            case 'REJECTED':
                return <span className="badge fw-medium px-3 py-2" style={{ backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '20px' }}>Rejected</span>;
            default:
                return null;
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.substring(0, 2).toUpperCase();
    };

    const formatSalary = (sal) => {
        if (!sal) return 'Not specified';
        return `₹${(sal / 100000).toFixed(1)} LPA`;
    };

    // Derived stats
    const totalApplied = applications.length;
    const pendingCount = applications.filter(a => a.status === 'PENDING').length;
    const acceptedCount = applications.filter(a => a.status === 'ACCEPTED').length;
    const rejectedCount = applications.filter(a => a.status === 'REJECTED').length;

    // Filter logic
    let filteredApplications = applications;
    if (filterStatus !== 'ALL') {
        filteredApplications = filteredApplications.filter(a => a.status === filterStatus);
    }
    if (searchKeyword.trim()) {
        const lowerK = searchKeyword.toLowerCase();
        filteredApplications = filteredApplications.filter(a => 
            a.job?.title?.toLowerCase().includes(lowerK) || 
            a.job?.company?.name?.toLowerCase().includes(lowerK)
        );
    }

    return (
        <>
                        
                        {/* Page Header */}
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                            <div>
                                <h3 className="fw-bold mb-1">My Applications</h3>
                                <p className="text-muted mb-0 fw-medium">Track all your job applications in one place</p>
                            </div>
                            <div className="d-flex gap-2">
                                <button onClick={() => window.location.reload()} className="btn btn-outline-secondary fw-bold px-3 py-2 d-flex align-items-center" style={{ borderRadius: '8px' }}>
                                    <i className="bi bi-arrow-clockwise me-2"></i> Refresh Data
                                </button>
                                <Link to="/jobs" className="btn fw-bold px-4 py-2 d-flex align-items-center" style={{ backgroundColor: '#0ea5e9', color: 'white', borderRadius: '8px' }}>
                                    <i className="bi bi-search me-2"></i> Browse Jobs
                                </Link>
                            </div>
                        </div>
                        
                        {/* Stat Cards */}
                        <div className="row g-4 mb-5">
                            <div className="col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                    <div className="card-body p-4">
                                        <div className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>Total Applied</div>
                                        <h2 className="fw-bold mb-2">{totalApplied}</h2>
                                        <div className="text-muted fw-medium" style={{ fontSize: '0.85rem' }}>All time</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                    <div className="card-body p-4">
                                        <div className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>Pending</div>
                                        <h2 className="fw-bold mb-2" style={{ color: '#d97706' }}>{pendingCount}</h2>
                                        <div className="text-muted fw-medium d-flex align-items-center" style={{ fontSize: '0.85rem' }}>
                                            <span className="me-2 rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b' }}></span> Awaiting response
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                    <div className="card-body p-4">
                                        <div className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>Accepted</div>
                                        <h2 className="fw-bold mb-2" style={{ color: '#15803d' }}>{acceptedCount}</h2>
                                        <div className="text-muted fw-medium d-flex align-items-center" style={{ fontSize: '0.85rem' }}>
                                            <span className="me-2 rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#22c55e' }}></span> Congratulations!
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                    <div className="card-body p-4">
                                        <div className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>Rejected</div>
                                        <h2 className="fw-bold mb-2" style={{ color: '#b91c1c' }}>{rejectedCount}</h2>
                                        <div className="text-muted fw-medium d-flex align-items-center" style={{ fontSize: '0.85rem' }}>
                                            <span className="me-2 rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: '#ef4444' }}></span> Keep applying
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filter Strip & Search */}
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                            <div className="d-flex align-items-center flex-wrap gap-2">
                                <button onClick={() => setFilterStatus('ALL')} className={`btn fw-medium rounded-pill px-4 ${filterStatus === 'ALL' ? 'text-white' : 'text-muted'}`} style={{ backgroundColor: filterStatus === 'ALL' ? '#0ea5e9' : 'transparent' }}>All ({totalApplied})</button>
                                <button onClick={() => setFilterStatus('PENDING')} className={`btn fw-medium rounded-pill px-3 ${filterStatus === 'PENDING' ? 'text-white' : 'text-muted'}`} style={{ backgroundColor: filterStatus === 'PENDING' ? '#f59e0b' : 'transparent' }}>Pending ({pendingCount})</button>
                                <button onClick={() => setFilterStatus('ACCEPTED')} className={`btn fw-medium rounded-pill px-3 ${filterStatus === 'ACCEPTED' ? 'text-white' : 'text-muted'}`} style={{ backgroundColor: filterStatus === 'ACCEPTED' ? '#22c55e' : 'transparent' }}>Accepted ({acceptedCount})</button>
                                <button onClick={() => setFilterStatus('REJECTED')} className={`btn fw-medium rounded-pill px-3 ${filterStatus === 'REJECTED' ? 'text-white' : 'text-muted'}`} style={{ backgroundColor: filterStatus === 'REJECTED' ? '#ef4444' : 'transparent' }}>Rejected ({rejectedCount})</button>
                            </div>
                            <div className="position-relative" style={{ minWidth: '250px' }}>
                                <i className="bi bi-search position-absolute top-50 translate-middle-y ms-3" style={{ color: '#38bdf8', fontSize: '1.1rem' }}></i>
                                <input type="text" className="form-control job-search-input" placeholder="Search applications..." 
                                       value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)}
                                       style={{ paddingLeft: '45px', paddingRight: '15px', paddingTop: '10px', paddingBottom: '10px', borderRadius: '8px' }} />
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-primary-custom" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                                <p className="mt-2 text-muted">Loading applications...</p>
                            </div>
                        ) : error ? (
                            <div className="text-center py-5 text-danger">
                                <p>{error}</p>
                            </div>
                        ) : applications.length === 0 ? (
                            <div className="text-center py-5 bg-white rounded shadow-sm border">
                                <h5 className="fw-bold">No applications found</h5>
                                <p className="text-muted">You haven't applied to any jobs yet.</p>
                                <Link to="/jobs" className="btn btn-primary-custom mt-2">Start Exploring</Link>
                            </div>
                        ) : filteredApplications.length === 0 ? (
                            <div className="text-center py-5 bg-white rounded shadow-sm border">
                                <h5 className="fw-bold">No results found</h5>
                                <p className="text-muted">No applications match your current filters.</p>
                                <button className="btn btn-outline-secondary mt-2" onClick={() => { setFilterStatus('ALL'); setSearchKeyword(''); }}>Clear Filters</button>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {filteredApplications.map(app => (
                                    <div key={app.id} className="card border-0 shadow-sm hover-card" style={{ borderRadius: '16px' }}>
                                        <div className="card-body p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
                                            
                                            {/* App Info Left */}
                                            <div className="d-flex align-items-center">
                                                <div className="d-flex align-items-center justify-content-center fw-bold me-4 flex-shrink-0" 
                                                     style={{ width: '60px', height: '60px', backgroundColor: '#e0e7ff', color: '#3730a3', borderRadius: '14px', fontSize: '1.2rem' }}>
                                                    {getInitials(app.job?.company?.name)}
                                                </div>
                                                <div>
                                                    <h5 className="fw-bold mb-1">{app.job?.title}</h5>
                                                    <div className="text-muted fw-medium mb-2" style={{ fontSize: '0.95rem' }}>{app.job?.company?.name}</div>
                                                    <div className="d-flex align-items-center text-muted fw-medium flex-wrap gap-3" style={{ fontSize: '0.85rem' }}>
                                                        <div><i className="bi bi-geo-alt me-1" style={{ color: '#94a3b8' }}></i> {app.job?.location}</div>
                                                        <div><i className="bi bi-currency-rupee me-1" style={{ color: '#94a3b8' }}></i> {formatSalary(app.job?.salary)}</div>
                                                        <div><i className="bi bi-briefcase me-1" style={{ color: '#94a3b8' }}></i> {app.job?.type?.replace('_', ' ')}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Status & Action Right */}
                                            <div className="d-flex flex-md-column align-items-center align-items-md-end justify-content-between gap-3">
                                                <div className="d-flex flex-column align-items-md-end">
                                                    <div className="mb-2">{getStatusBadge(app.status)}</div>
                                                    <div className="text-muted fw-medium" style={{ fontSize: '0.8rem' }}>Applied {new Date(app.appliedAt).toLocaleDateString()}</div>
                                                </div>
                                                <Link to={`/jobs/${app.job?.id}`} className="btn fw-bold px-4 py-2" 
                                                      style={{ color: '#0ea5e9', border: '1px solid #bae6fd', borderRadius: '25px', backgroundColor: 'transparent', fontSize: '0.9rem' }}>
                                                    View details
                                                </Link>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
        </>
    );
};

export default MyApplications;
