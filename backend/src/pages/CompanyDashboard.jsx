import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// Modal component for Cover Letter
const CoverLetterModal = ({ show, onClose, text }) => {
    if (!show) return null;
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card border-0 shadow-lg" style={{ width: '90%', maxWidth: '500px', borderRadius: '16px' }}>
                <div className="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center pt-4 px-4">
                    <h5 className="fw-bold mb-0">Cover Letter</h5>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>
                <div className="card-body p-4 text-secondary" style={{ whiteSpace: 'pre-wrap', maxHeight: '60vh', overflowY: 'auto' }}>
                    {text || 'No cover letter provided.'}
                </div>
                <div className="card-footer bg-white border-top-0 pb-4 px-4 text-end">
                    <button className="btn fw-medium px-4" style={{ backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '8px' }} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

const CompanyDashboard = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    const [selectedCoverLetter, setSelectedCoverLetter] = useState(null);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const jobsRes = await api.get('/api/jobs/my');
            const fetchedJobs = jobsRes.data;
            setJobs(fetchedJobs);

            let allApplicants = [];
            for (let job of fetchedJobs) {
                const appsRes = await api.get(`/api/applications/job/${job.id}`);
                const appsWithJob = appsRes.data.map(app => ({ ...app, job })); // Attach job to app
                allApplicants = [...allApplicants, ...appsWithJob];
            }
            
            // Sort by most recent
            allApplicants.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
            setApplicants(allApplicants);

        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const updateStatus = async (appId, status) => {
        try {
            await api.put(`/api/applications/${appId}/status`, { status });
            fetchDashboardData(); // Refresh data to show changes
        } catch (err) {
            console.error('Failed to update status', err);
            alert('Failed to update status');
        }
    };

    const toggleJobStatus = async (jobId) => {
        try {
            await api.put(`/api/jobs/${jobId}/toggle-status`);
            fetchDashboardData();
        } catch (err) {
            console.error('Failed to toggle job status', err);
            alert('Failed to toggle job status');
        }
    };

    const deleteJob = async (jobId) => {
        if (!window.confirm("Are you sure you want to permanently delete this job?")) return;
        try {
            await api.delete(`/api/jobs/${jobId}`);
            fetchDashboardData();
        } catch (err) {
            console.error('Failed to delete job', err);
            alert('Failed to delete job');
        }
    };

    const formatSalary = (sal) => {
        if (!sal) return 'Not specified';
        return `₹${(sal / 100000).toFixed(1)} LPA`;
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.substring(0, 2).toUpperCase();
    };

    if (loading) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#f8fafc' }}>
                <div className="spinner-border text-primary-custom" style={{ color: '#6366f1' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    const activeListings = jobs.filter(j => j.status === 'OPEN').length;
    const hired = applicants.filter(a => a.status === 'ACCEPTED').length;

    // Quick Stats computation
    // Find top 4 jobs by applicant count
    const jobStats = jobs.map(job => {
        return {
            title: job.title,
            count: applicants.filter(a => a.job.id === job.id).length
        };
    }).sort((a, b) => b.count - a.count).slice(0, 4);
    
    // find max count for progress bars
    const maxCount = Math.max(...jobStats.map(s => s.count), 1);
    const colors = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b'];

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 76px)' }}>
            <CoverLetterModal 
                show={selectedCoverLetter !== null} 
                onClose={() => setSelectedCoverLetter(null)} 
                text={selectedCoverLetter} 
            />
            <div className="container-fluid p-0">
                <div className="row g-0">
                    
                    {/* Left Sidebar - Hidden on small screens */}
                    <div className="col-lg-2 d-none d-lg-block bg-dark-custom" style={{ minHeight: 'calc(100vh - 76px)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                        {/* Profile Section */}
                        <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="d-flex align-items-center mb-3">
                                <div className="d-flex align-items-center justify-content-center fw-bold rounded-circle text-white me-3 flex-shrink-0" 
                                     style={{ width: '48px', height: '48px', backgroundColor: '#6366f1', fontSize: '1.2rem' }}>
                                    {getInitials(user?.name)}
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0 text-white">{user?.name}</h6>
                                    <div className="text-muted" style={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>{user?.email}</div>
                                </div>
                            </div>
                            <span className="badge border px-3 py-1" style={{ borderColor: '#4f46e5', color: '#818cf8', borderRadius: '20px', fontWeight: '500', backgroundColor: 'rgba(79, 70, 229, 0.1)' }}>
                                Company
                            </span>
                        </div>

                        {/* Navigation Menu */}
                        <div className="p-3">
                            <div className="text-uppercase mb-3 px-3" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', color: '#475569' }}>Main</div>
                            <ul className="nav flex-column mb-4 gap-1">
                                <li className="nav-item">
                                    <button onClick={() => setActiveTab('dashboard')} className={`nav-link w-100 text-start px-3 py-2 rounded d-flex align-items-center ${activeTab === 'dashboard' ? 'text-white' : 'text-muted hover-bg-dark'}`} 
                                          style={activeTab === 'dashboard' ? { backgroundColor: 'rgba(99, 102, 241, 0.15)', border: 'none' } : { backgroundColor: 'transparent', border: 'none' }}>
                                        <i className="bi bi-grid me-3 fs-5" style={{ color: activeTab === 'dashboard' ? '#818cf8' : 'inherit' }}></i> 
                                        <span className={activeTab === 'dashboard' ? 'fw-medium' : ''}>Dashboard</span>
                                    </button>
                                </li>
                                <li className="nav-item mt-1">
                                    <button onClick={() => setActiveTab('jobs')} className={`nav-link w-100 text-start px-3 py-2 rounded d-flex align-items-center justify-content-between ${activeTab === 'jobs' ? 'text-white' : 'text-muted hover-bg-dark'}`} 
                                            style={activeTab === 'jobs' ? { backgroundColor: 'rgba(99, 102, 241, 0.15)', border: 'none', transition: 'all 0.2s' } : { backgroundColor: 'transparent', border: 'none', transition: 'all 0.2s' }}>
                                        <div><i className="bi bi-briefcase me-3 fs-5" style={{ color: activeTab === 'jobs' ? '#818cf8' : 'inherit' }}></i> <span className={activeTab === 'jobs' ? 'fw-medium' : ''}>My Jobs</span></div>
                                        <span className="badge rounded-pill" style={{ backgroundColor: '#6366f1' }}>{jobs.length}</span>
                                    </button>
                                </li>
                                <li className="nav-item mt-1">
                                    <button onClick={() => setActiveTab('applicants')} className={`nav-link w-100 text-start px-3 py-2 rounded d-flex align-items-center justify-content-between ${activeTab === 'applicants' ? 'text-white' : 'text-muted hover-bg-dark'}`} 
                                            style={activeTab === 'applicants' ? { backgroundColor: 'rgba(99, 102, 241, 0.15)', border: 'none', transition: 'all 0.2s' } : { backgroundColor: 'transparent', border: 'none', transition: 'all 0.2s' }}>
                                        <div><i className="bi bi-people me-3 fs-5" style={{ color: activeTab === 'applicants' ? '#818cf8' : 'inherit' }}></i> <span className={activeTab === 'applicants' ? 'fw-medium' : ''}>Applicants</span></div>
                                        <span className="badge rounded-pill" style={{ backgroundColor: '#6366f1' }}>{applicants.length}</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <style>{`
                            .hover-bg-dark:hover { background-color: rgba(255,255,255,0.03); color: white !important; }
                        `}</style>
                    </div>

                    {/* Main Content Area */}
                    <div className="col-lg-10 p-4 p-md-5">
                        
                        {/* Page Header */}
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                            <div>
                                <h3 className="fw-bold mb-1">
                                    {activeTab === 'dashboard' && 'Company Dashboard'}
                                    {activeTab === 'jobs' && 'My Job Listings'}
                                    {activeTab === 'applicants' && 'All Applicants'}
                                </h3>
                                <p className="text-muted mb-0 fw-medium">
                                    {activeTab === 'dashboard' && 'Manage your job listings and applicants'}
                                    {activeTab === 'jobs' && 'View and manage all jobs you have posted'}
                                    {activeTab === 'applicants' && 'Review all candidates who have applied to your jobs'}
                                </p>
                            </div>
                        </div>
                        
                        {activeTab === 'dashboard' && (
                            <>
                                {/* Stat Cards */}
                        <div className="row g-4 mb-5">
                            <div className="col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                    <div className="card-body p-4">
                                        <div className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>Total Jobs Posted</div>
                                        <h2 className="fw-bold mb-2 text-dark">{jobs.length}</h2>
                                        <div className="text-muted fw-medium" style={{ fontSize: '0.85rem' }}>All time</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                    <div className="card-body p-4">
                                        <div className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>Active Listings</div>
                                        <h2 className="fw-bold mb-2" style={{ color: '#16a34a' }}>{activeListings}</h2>
                                        <div className="text-muted fw-medium" style={{ fontSize: '0.85rem' }}>Currently open</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                    <div className="card-body p-4">
                                        <div className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>Total Applicants</div>
                                        <h2 className="fw-bold mb-2" style={{ color: '#6366f1' }}>{applicants.length}</h2>
                                        <div className="text-muted fw-medium" style={{ fontSize: '0.85rem' }}>Across all jobs</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                    <div className="card-body p-4">
                                        <div className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>Hired</div>
                                        <h2 className="fw-bold mb-2" style={{ color: '#0ea5e9' }}>{hired}</h2>
                                        <div className="text-muted fw-medium" style={{ fontSize: '0.85rem' }}>Accepted candidates</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Jobs Table */}
                        <div className="mb-5 d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="fw-bold mb-1">Your Job Listings</h5>
                            </div>
                            <div className="d-flex gap-2">
                                <button onClick={fetchDashboardData} className="btn btn-outline-secondary btn-sm rounded-pill px-3 d-flex align-items-center">
                                    <i className="bi bi-arrow-clockwise me-2"></i>Refresh Data
                                </button>
                                <Link to="/company/post-job" className="btn btn-sm rounded-pill px-3 d-flex align-items-center text-white fw-bold" style={{ backgroundColor: '#0ea5e9' }}>
                                    <i className="bi bi-plus-lg me-2"></i>Post New Job
                                </Link>
                            </div>
                        </div>
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0 align-middle">
                                        <thead style={{ backgroundColor: '#f8fafc' }}>
                                            <tr>
                                                <th className="text-muted px-4 py-3 border-bottom-0" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>JOB TITLE</th>
                                                <th className="text-muted px-4 py-3 border-bottom-0" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>TYPE</th>
                                                <th className="text-muted px-4 py-3 border-bottom-0 text-center" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>APPLICANTS</th>
                                                <th className="text-muted px-4 py-3 border-bottom-0 text-center" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>STATUS</th>
                                                <th className="text-muted px-4 py-3 border-bottom-0 text-center" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jobs.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-4 text-muted">No jobs posted yet.</td>
                                                </tr>
                                            )}
                                            {jobs.map(job => (
                                                <tr key={job.id}>
                                                    <td className="px-4 py-3">
                                                        <div className="fw-bold text-dark">{job.title}</div>
                                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>{job.location} &middot; {formatSalary(job.salary)}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-secondary" style={{ fontSize: '0.9rem' }}>{job.type?.replace('_', ' ')}</td>
                                                    <td className="px-4 py-3 text-center fw-bold" style={{ color: '#6366f1' }}>
                                                        {applicants.filter(a => a.job.id === job.id).length}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {job.status === 'OPEN' ? (
                                                            <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>Open</span>
                                                        ) : (
                                                            <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>Closed</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="d-flex justify-content-center gap-2">
                                                            <Link to={`/jobs/${job.id}`} className="btn btn-sm btn-outline-info rounded-pill px-3 fw-medium" style={{ fontSize: '0.8rem' }}>View</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        {/* Bottom Two Columns */}
                        <div className="row g-4">
                            {/* Recent Applicants */}
                            <div className="col-lg-6">
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                    <div className="card-body p-4">
                                        <h6 className="fw-bold mb-4">Recent applicants</h6>
                                        <div className="d-flex flex-column gap-3">
                                            {applicants.length === 0 && (
                                                <div className="text-muted">No applicants yet.</div>
                                            )}
                                            {applicants.slice(0, 5).map((app, index) => {
                                                const bgColors = ['#e0f2fe', '#dcfce7', '#f3e8ff', '#fef08a', '#fee2e2'];
                                                const textColors = ['#0369a1', '#166534', '#6b21a8', '#854d0e', '#b91c1c'];
                                                const colorIdx = index % bgColors.length;

                                                return (
                                                    <div key={app.id} className="d-flex flex-column p-3 mb-2" style={{ border: '1px solid #f1f5f9', borderRadius: '12px' }}>
                                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                                            <div className="d-flex align-items-center">
                                                                <div className="d-flex align-items-center justify-content-center fw-bold me-3 flex-shrink-0" 
                                                                     style={{ width: '45px', height: '45px', backgroundColor: bgColors[colorIdx], color: textColors[colorIdx], borderRadius: '50%', fontSize: '0.9rem' }}>
                                                                    {getInitials(app.candidate?.name)}
                                                                </div>
                                                                <div>
                                                                    <h6 className="fw-bold mb-0" style={{ fontSize: '0.95rem' }}>{app.candidate?.name}</h6>
                                                                    <div className="text-muted" style={{ fontSize: '0.8rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{app.job?.title}</div>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex align-items-center gap-2">
                                                                {app.status === 'PENDING' && (
                                                                    <>
                                                                        <button onClick={() => updateStatus(app.id, 'ACCEPTED')} className="btn btn-sm fw-medium px-3 border-0" style={{ backgroundColor: '#dcfce7', color: '#166534', borderRadius: '6px', fontSize: '0.8rem' }}>Accept</button>
                                                                        <button onClick={() => updateStatus(app.id, 'REJECTED')} className="btn btn-sm fw-medium px-3 border-0" style={{ backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '0.8rem' }}>Reject</button>
                                                                    </>
                                                                )}
                                                                {app.status === 'ACCEPTED' && <span className="badge bg-success">Accepted</span>}
                                                                {app.status === 'REJECTED' && <span className="badge bg-danger">Rejected</span>}
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Applied {new Date(app.appliedAt).toLocaleDateString()}</div>
                                                            <div className="d-flex gap-3">
                                                                {app.candidate?.resumeUrl && (
                                                                    <a href={`http://localhost:8080${app.candidate.resumeUrl}`} 
                                                                       target="_blank" rel="noopener noreferrer" 
                                                                       className="btn btn-sm text-info fw-medium p-0" 
                                                                       style={{ fontSize: '0.8rem' }}>
                                                                        View Resume <i className="bi bi-file-earmark-pdf"></i>
                                                                    </a>
                                                                )}
                                                                <button 
                                                                    onClick={() => setSelectedCoverLetter(app.coverLetter)}
                                                                    className="btn btn-sm text-primary fw-medium p-0" 
                                                                    style={{ fontSize: '0.8rem' }}>
                                                                    View Cover Letter <i className="bi bi-file-text"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="col-lg-6">
                                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                    <div className="card-body p-4">
                                        <h6 className="fw-bold mb-4">Quick stats overview</h6>
                                        
                                        <div className="d-flex flex-column gap-4 mt-2">
                                            {jobStats.length === 0 && (
                                                <div className="text-muted">No data to display.</div>
                                            )}
                                            {jobStats.map((stat, i) => {
                                                const percent = (stat.count / maxCount) * 100;
                                                const color = colors[i % colors.length];
                                                return (
                                                    <div key={i}>
                                                        <div className="d-flex justify-content-between mb-1">
                                                            <div className="text-secondary fw-medium text-truncate" style={{ fontSize: '0.9rem', maxWidth: '80%' }}>{stat.title} &mdash; Applications</div>
                                                            <div className="fw-bold" style={{ color: color }}>{stat.count}</div>
                                                        </div>
                                                        <div className="progress" style={{ height: '8px', backgroundColor: '#f1f5f9' }}>
                                                            <div className="progress-bar rounded" style={{ width: `${percent}%`, backgroundColor: color }}></div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </>
                        )}

                        {/* JOBS TAB CONTENT */}
                        {activeTab === 'jobs' && (
                            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0 align-middle">
                                        <thead style={{ backgroundColor: '#f8fafc' }}>
                                            <tr>
                                                <th className="text-muted px-4 py-3 border-bottom-0" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>JOB TITLE</th>
                                                <th className="text-muted px-4 py-3 border-bottom-0" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>TYPE</th>
                                                <th className="text-muted px-4 py-3 border-bottom-0 text-center" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>APPLICANTS</th>
                                                <th className="text-muted px-4 py-3 border-bottom-0 text-center" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>STATUS</th>
                                                <th className="text-muted px-4 py-3 border-bottom-0 text-center" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jobs.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="text-center py-4 text-muted">No jobs posted yet.</td>
                                                </tr>
                                            )}
                                            {jobs.map(job => (
                                                <tr key={job.id}>
                                                    <td className="px-4 py-3">
                                                        <div className="fw-bold text-dark">{job.title}</div>
                                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>{job.location} &middot; {formatSalary(job.salary)}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-secondary" style={{ fontSize: '0.9rem' }}>{job.type?.replace('_', ' ')}</td>
                                                    <td className="px-4 py-3 text-center fw-bold" style={{ color: '#6366f1' }}>
                                                        {applicants.filter(a => a.job.id === job.id).length}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        {job.status === 'OPEN' ? (
                                                            <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>Open</span>
                                                        ) : (
                                                            <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#64748b', padding: '0.4rem 0.8rem', borderRadius: '20px' }}>Closed</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <div className="d-flex justify-content-center gap-2">
                                                            <Link to={`/jobs/${job.id}`} className="btn btn-sm btn-outline-info rounded px-3 fw-medium" title="View Job" style={{ fontSize: '0.8rem' }}><i className="bi bi-eye"></i></Link>
                                                            <Link to={`/company/edit-job/${job.id}`} className="btn btn-sm btn-outline-primary rounded px-3 fw-medium" title="Edit Job" style={{ fontSize: '0.8rem' }}><i className="bi bi-pencil"></i></Link>
                                                            {job.status === 'OPEN' ? (
                                                                <button onClick={() => toggleJobStatus(job.id)} className="btn btn-sm btn-outline-warning rounded px-3 fw-medium" title="Close Job" style={{ fontSize: '0.8rem' }}><i className="bi bi-pause-circle"></i></button>
                                                            ) : (
                                                                <button onClick={() => toggleJobStatus(job.id)} className="btn btn-sm btn-outline-success rounded px-3 fw-medium" title="Open Job" style={{ fontSize: '0.8rem' }}><i className="bi bi-play-circle"></i></button>
                                                            )}
                                                            <button onClick={() => deleteJob(job.id)} className="btn btn-sm btn-outline-danger rounded px-3 fw-medium" title="Delete Job" style={{ fontSize: '0.8rem' }}><i className="bi bi-trash"></i></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* APPLICANTS TAB CONTENT */}
                        {activeTab === 'applicants' && (
                            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                                <div className="card-body p-4">
                                    <div className="d-flex flex-column gap-3">
                                        {applicants.length === 0 && (
                                            <div className="text-muted text-center py-4">No applicants yet.</div>
                                        )}
                                        {applicants.map((app, index) => {
                                            const bgColors = ['#e0f2fe', '#dcfce7', '#f3e8ff', '#fef08a', '#fee2e2'];
                                            const textColors = ['#0369a1', '#166534', '#6b21a8', '#854d0e', '#b91c1c'];
                                            const colorIdx = index % bgColors.length;

                                            return (
                                                <div key={app.id} className="d-flex flex-column flex-md-row align-items-md-center justify-content-between p-3 mb-2 gap-3" style={{ border: '1px solid #f1f5f9', borderRadius: '12px' }}>
                                                    <div className="d-flex align-items-center">
                                                        <div className="d-flex align-items-center justify-content-center fw-bold me-3 flex-shrink-0" 
                                                             style={{ width: '45px', height: '45px', backgroundColor: bgColors[colorIdx], color: textColors[colorIdx], borderRadius: '50%', fontSize: '0.9rem' }}>
                                                            {getInitials(app.candidate?.name)}
                                                        </div>
                                                        <div>
                                                            <h6 className="fw-bold mb-0" style={{ fontSize: '0.95rem' }}>{app.candidate?.name}</h6>
                                                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>Applied for: <span className="fw-medium text-dark">{app.job?.title}</span></div>
                                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(app.appliedAt).toLocaleDateString()}</div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-3">
                                                        {app.candidate?.resumeUrl && (
                                                            <a href={`http://localhost:8080${app.candidate.resumeUrl}`} 
                                                               target="_blank" rel="noopener noreferrer" 
                                                               className="btn btn-sm text-info fw-medium p-0" 
                                                               style={{ fontSize: '0.85rem' }}>
                                                                View Resume <i className="bi bi-file-earmark-pdf"></i>
                                                            </a>
                                                        )}
                                                        <button 
                                                            onClick={() => setSelectedCoverLetter(app.coverLetter)}
                                                            className="btn btn-sm text-primary fw-medium p-0" 
                                                            style={{ fontSize: '0.85rem' }}>
                                                            View Cover Letter <i className="bi bi-file-text"></i>
                                                        </button>
                                                        <div className="d-flex align-items-center gap-2">
                                                            {app.status === 'PENDING' && (
                                                                <>
                                                                    <button onClick={() => updateStatus(app.id, 'ACCEPTED')} className="btn fw-medium px-3 border-0" style={{ backgroundColor: '#dcfce7', color: '#166534', borderRadius: '6px', fontSize: '0.85rem' }}>Accept</button>
                                                                    <button onClick={() => updateStatus(app.id, 'REJECTED')} className="btn fw-medium px-3 border-0" style={{ backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '6px', fontSize: '0.85rem' }}>Reject</button>
                                                                </>
                                                            )}
                                                            {app.status === 'ACCEPTED' && <span className="badge bg-success px-3 py-2">Accepted</span>}
                                                            {app.status === 'REJECTED' && <span className="badge bg-danger px-3 py-2">Rejected</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboard;
