import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const SavedJobs = () => {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const fetchSavedJobs = async () => {
        try {
            const response = await api.get('/api/saved-jobs');
            setSavedJobs(response.data);
        } catch (error) {
            console.error("Failed to fetch saved jobs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = async (jobId) => {
        try {
            await api.delete(`/api/saved-jobs/${jobId}`);
            setSavedJobs(savedJobs.filter(sj => sj.job.id !== jobId));
        } catch (error) {
            console.error("Failed to unsave job", error);
        }
    };

    const formatSalary = (sal) => {
        if (!sal) return 'Not specified';
        return `₹${(sal / 100000).toFixed(1)} LPA`;
    };

    const getInitials = (name) => {
        if (!name) return 'CO';
        return name.substring(0, 2).toUpperCase();
    };

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
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                <div>
                    <h3 className="fw-bold mb-1">Saved Jobs</h3>
                    <p className="text-muted mb-0 fw-medium">Jobs you've saved for later</p>
                </div>
                <div className="d-flex gap-2">
                    <button onClick={() => window.location.reload()} className="btn btn-outline-secondary fw-bold px-3 py-2 d-flex align-items-center" style={{ borderRadius: '8px' }}>
                        <i className="bi bi-arrow-clockwise me-2"></i> Refresh Data
                    </button>
                    <Link to="/jobs" className="btn fw-bold px-4 py-2 d-flex align-items-center" style={{ backgroundColor: '#0ea5e9', color: 'white', borderRadius: '8px' }}>
                        <i className="bi bi-search me-2"></i> Browse More
                    </Link>
                </div>
            </div>

            {savedJobs.length === 0 ? (
                <div className="text-center py-5 bg-white rounded shadow-sm border">
                    <h5 className="fw-bold">No saved jobs</h5>
                    <p className="text-muted">You haven't saved any jobs yet.</p>
                    <Link to="/jobs" className="btn btn-primary-custom mt-2">Start Exploring</Link>
                </div>
            ) : (
                <div className="d-flex flex-column gap-3">
                    {savedJobs.map(sj => {
                        const job = sj.job;
                        return (
                            <div key={sj.id} className="card border-0 shadow-sm hover-card" style={{ borderRadius: '16px' }}>
                                <div className="card-body p-4 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
                                    
                                    <div className="d-flex align-items-center">
                                        <div className="d-flex align-items-center justify-content-center fw-bold me-4 flex-shrink-0" 
                                             style={{ width: '60px', height: '60px', backgroundColor: '#eff6ff', color: '#3b82f6', borderRadius: '14px', fontSize: '1.2rem' }}>
                                            {getInitials(job.company?.name)}
                                        </div>
                                        <div>
                                            <h5 className="fw-bold mb-1">{job.title}</h5>
                                            <div className="text-muted fw-medium mb-2" style={{ fontSize: '0.95rem' }}>{job.company?.name}</div>
                                            <div className="d-flex align-items-center text-muted fw-medium flex-wrap gap-3" style={{ fontSize: '0.85rem' }}>
                                                <div><i className="bi bi-geo-alt me-1" style={{ color: '#94a3b8' }}></i> {job.location}</div>
                                                <div><i className="bi bi-currency-rupee me-1" style={{ color: '#94a3b8' }}></i> {formatSalary(job.salary)}</div>
                                                <div><i className="bi bi-briefcase me-1" style={{ color: '#94a3b8' }}></i> {job.type?.replace('_', ' ')}</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="d-flex flex-md-column align-items-center align-items-md-end justify-content-between gap-3">
                                        <span className="text-muted fw-medium" style={{ fontSize: '0.8rem' }}>Saved {new Date(sj.savedAt).toLocaleDateString()}</span>
                                        <div className="d-flex gap-2">
                                            <button onClick={() => handleUnsave(job.id)} className="btn btn-light fw-bold" style={{ borderRadius: '25px', fontSize: '0.9rem' }}>
                                                <i className="bi bi-bookmark-fill text-primary-custom"></i>
                                            </button>
                                            <Link to={`/jobs/${job.id}`} className="btn btn-primary-custom fw-bold px-4" 
                                                  style={{ borderRadius: '25px', fontSize: '0.9rem' }}>
                                                Apply
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default SavedJobs;
