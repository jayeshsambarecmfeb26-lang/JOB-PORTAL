import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const JobDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Apply states
    const [coverLetter, setCoverLetter] = useState('');
    const [applying, setApplying] = useState(false);
    const [applyError, setApplyError] = useState('');
    const [applySuccess, setApplySuccess] = useState(false);

    // Save states
    const [savingJob, setSavingJob] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [saveError, setSaveError] = useState('');

    useEffect(() => {
        const fetchJobAndStatus = async () => {
            try {
                const response = await api.get(`/api/jobs/${id}`);
                setJob(response.data);

                // If candidate, check if already applied or saved
                if (user?.role === 'CANDIDATE') {
                    try {
                        const [appsRes, savedRes] = await Promise.all([
                            api.get('/api/applications/my'),
                            api.get('/api/saved-jobs')
                        ]);
                        
                        const hasApplied = appsRes.data.some(app => app.job.id === parseInt(id));
                        const hasSaved = savedRes.data.some(sj => sj.job.id === parseInt(id));

                        if (hasApplied) setApplySuccess(true);
                        if (hasSaved) setSaveSuccess(true);
                    } catch (err) {
                        console.error('Failed to fetch user status for job', err);
                    }
                }

            } catch (err) {
                setError('Failed to load job details.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchJobAndStatus();
    }, [id, user]);

    const handleApply = async () => {
        setApplyError('');
        setApplying(true);
        try {
            await api.post('/api/applications', {
                jobId: job.id,
                coverLetter: coverLetter || "I am very interested in this position."
            });
            setApplySuccess(true);
            setCoverLetter('');
        } catch (err) {
            setApplyError(err.response?.data?.message || 'Failed to submit application.');
        } finally {
            setApplying(false);
        }
    };

    const handleSaveJob = async () => {
        setSaveError('');
        setSavingJob(true);
        try {
            await api.post(`/api/saved-jobs/${job.id}`);
            setSaveSuccess(true);
        } catch (err) {
            setSaveError(err.response?.data?.message || 'Failed to save job.');
        } finally {
            setSavingJob(false);
        }
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#f8fafc' }}>
                <div className="spinner-border text-primary-custom" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-vh-100 d-flex flex-column justify-content-center align-items-center" style={{ backgroundColor: '#f8fafc' }}>
                <h3 className="fw-bold text-danger">Job not found</h3>
                <Link to="/jobs" className="btn btn-primary-custom mt-3">Back to Jobs</Link>
            </div>
        );
    }

    const initials = job.company?.name ? job.company.name.substring(0, 2).toUpperCase() : 'CO';
    const salary = job.salary ? `₹${(job.salary / 100000).toFixed(1)} LPA` : 'Not specified';
    const postedDate = new Date(job.postedAt).toLocaleDateString();

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
            <div className="container pt-4">
                {/* Breadcrumb */}
                <div className="mb-4">
                    <span className="text-muted fw-medium" style={{ fontSize: '0.9rem' }}>
                        <Link to="/" className="text-primary text-decoration-none">Home</Link>
                        <span className="mx-2">/</span>
                        <Link to="/jobs" className="text-primary text-decoration-none">Jobs</Link>
                        <span className="mx-2">/</span>
                        <span className="text-secondary">{job.title}</span>
                    </span>
                </div>

                <div className="row g-4">
                    {/* Left Column - Main Content */}
                    <div className="col-lg-8 d-flex flex-column gap-4">
                        
                        {/* Header Card */}
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                            <div className="card-body p-4 p-md-5">
                                <div className="d-flex flex-column flex-md-row align-items-md-start mb-4">
                                    <div className="d-flex align-items-center justify-content-center fw-bold me-md-4 mb-3 mb-md-0 flex-shrink-0" 
                                         style={{ width: '70px', height: '70px', backgroundColor: '#dbeafe', color: '#1e40af', borderRadius: '12px', fontSize: '1.4rem' }}>
                                        {initials}
                                    </div>
                                    <div>
                                        <h3 className="fw-bold mb-2">{job.title}</h3>
                                        <p className="text-muted fw-medium mb-3">{job.company?.name} &middot; {job.location}</p>
                                        <div className="d-flex flex-wrap gap-2">
                                            <span className="badge bg-light text-secondary px-3 py-2 border rounded-pill fw-medium">{job.type?.replace('_', ' ')}</span>
                                        </div>
                                    </div>
                                </div>

                                <hr className="my-4" style={{ borderColor: '#e2e8f0' }} />

                                <div className="row text-center g-3">
                                    <div className="col-6 col-md-3">
                                        <i className="bi bi-currency-rupee fs-4 mb-2 d-block" style={{ color: '#0ea5e9' }}></i>
                                        <div className="text-muted text-uppercase mb-1" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>Salary</div>
                                        <div className="fw-bold text-dark">{salary}</div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <i className="bi bi-geo-alt fs-4 mb-2 d-block" style={{ color: '#c084fc' }}></i>
                                        <div className="text-muted text-uppercase mb-1" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>Location</div>
                                        <div className="fw-bold text-dark">{job.location}</div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <i className="bi bi-briefcase fs-4 mb-2 d-block" style={{ color: '#22c55e' }}></i>
                                        <div className="text-muted text-uppercase mb-1" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>Type</div>
                                        <div className="fw-bold text-dark">{job.type?.replace('_', ' ')}</div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <i className="bi bi-calendar3 fs-4 mb-2 d-block" style={{ color: '#f59e0b' }}></i>
                                        <div className="text-muted text-uppercase mb-1" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>Posted</div>
                                        <div className="fw-bold text-dark">{postedDate}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About the role */}
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                            <div className="card-body p-4 p-md-5">
                                <h5 className="fw-bold mb-4">About the role</h5>
                                <p className="text-secondary" style={{ lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                                    {job.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="col-lg-4 d-flex flex-column gap-4">
                        
                        {/* Apply Card - Sticky using Bootstrap sticky-top */}
                        <div className="sticky-top" style={{ top: '2rem', zIndex: 1 }}>
                            <div className="card border-0 shadow-lg mb-4" style={{ borderRadius: '16px', backgroundColor: '#0f172a', color: 'white' }}>
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="fw-bold mb-1" style={{ color: '#38bdf8' }}>{salary}</h2>
                                    <p className="fw-medium mb-4" style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Annual package &middot; {job.type?.replace('_', ' ')}</p>
                                    
                                    {applySuccess ? (
                                        <div className="alert alert-success border-0 py-3 text-center" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22c55e', borderRadius: '8px' }}>
                                            <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                                            <div className="fw-bold mt-1">Application Submitted!</div>
                                        </div>
                                    ) : user?.role === 'COMPANY' ? (
                                        <div className="alert py-3 text-center border-0 mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#94a3b8', borderRadius: '8px' }}>
                                            <i className="bi bi-info-circle me-2"></i>
                                            You are viewing this as a Company. You cannot apply to jobs.
                                        </div>
                                    ) : (
                                        <>
                                            {applyError && (
                                                <div className="alert alert-danger py-2 small border-0 text-center" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                                                    {applyError}
                                                </div>
                                            )}
                                            <textarea 
                                                className="form-control mb-3 border-0 cover-letter-input" 
                                                rows="3" 
                                                placeholder="Write a short cover letter..." 
                                                style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.9rem' }}
                                                value={coverLetter}
                                                onChange={(e) => setCoverLetter(e.target.value)}
                                            ></textarea>
                                            <button 
                                                className="btn w-100 fw-bold mb-3 py-3" 
                                                style={{ background: '#0ea5e9', color: 'white', borderRadius: '8px', fontSize: '1.05rem', border: 'none' }}
                                                onClick={handleApply}
                                                disabled={applying || job.status === 'CLOSED'}
                                            >
                                                {applying ? 'Submitting...' : job.status === 'CLOSED' ? 'Job Closed' : 'Apply for this job'}
                                            </button>
                                        </>
                                    )}
                                    
                                    {user?.role !== 'COMPANY' && (
                                        <>
                                            {saveError && (
                                                <div className="alert alert-danger py-2 small border-0 text-center" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                                                    {saveError}
                                                </div>
                                            )}
                                            {saveSuccess ? (
                                                <button className="btn w-100 fw-bold py-3 mb-4 d-flex align-items-center justify-content-center gap-2" 
                                                        style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px' }} disabled>
                                                    <i className="bi bi-bookmark-check-fill"></i> Job Saved
                                                </button>
                                            ) : (
                                                <button 
                                                    className="btn w-100 fw-bold py-3 mb-4 d-flex align-items-center justify-content-center gap-2" 
                                                    style={{ background: 'transparent', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', transition: 'all 0.2s' }}
                                                    onClick={handleSaveJob}
                                                    disabled={savingJob}
                                                >
                                                    {savingJob ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-bookmark"></i>} 
                                                    {savingJob ? 'Saving...' : 'Save job'}
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Company Info Card */}
                            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="d-flex align-items-center justify-content-center fw-bold me-3 flex-shrink-0" 
                                             style={{ width: '50px', height: '50px', backgroundColor: '#e0e7ff', color: '#3730a3', borderRadius: '10px', fontSize: '1.1rem' }}>
                                            {initials}
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-1">{job.company?.name}</h6>
                                            {job.company?.website && <div className="text-muted fw-medium" style={{ fontSize: '0.8rem' }}>{job.company?.website}</div>}
                                        </div>
                                    </div>

                                    <div className="d-flex flex-column gap-3 mb-4">
                                        <div className="d-flex align-items-center text-secondary fw-medium" style={{ fontSize: '0.9rem' }}>
                                            <i className="bi bi-geo-alt fs-5 me-3" style={{ color: '#cbd5e1' }}></i>
                                            {job.company?.location || job.location}
                                        </div>
                                    </div>

                                    <Link to="/jobs" className="fw-bold text-decoration-none d-block text-center mt-2" style={{ fontSize: '0.9rem', color: '#0ea5e9' }}>
                                        View more jobs &rarr;
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;
