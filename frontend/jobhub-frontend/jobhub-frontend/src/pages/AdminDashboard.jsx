import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [messages, setMessages] = useState([]);
    const [stats, setStats] = useState({ totalUsers: 0, activeJobs: 0, totalApplications: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, users, jobs, applications

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const [usersRes, jobsRes, appsRes, messagesRes] = await Promise.all([
                api.get('/api/admin/users'),
                api.get('/api/admin/jobs'),
                api.get('/api/applications/all'),
                api.get('/api/contact')
            ]);
            setUsers(usersRes.data);
            setJobs(jobsRes.data);
            setApplications(appsRes.data);
            setStats({
                totalUsers: usersRes.data.length,
                activeJobs: jobsRes.data.filter(j => j.status === 'OPEN').length,
                totalApplications: appsRes.data.length
            });
            setMessages(messagesRes.data);
        } catch (err) {
            console.error("Failed to load admin data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMessage = async (id) => {
        try {
            if (window.confirm('Are you sure you want to delete this message?')) {
                await api.delete(`/api/contact/${id}`);
                setMessages(messages.filter(m => m.id !== id));
            }
        } catch (err) {
            console.error("Failed to delete message", err);
            alert("Failed to delete message");
        }
    };

    const handleDeleteUser = async (id) => {
        try {
            if (window.confirm('Are you sure you want to delete this user? This may fail if they have associated applications or jobs.')) {
                await api.delete(`/api/admin/users/${id}`);
                fetchAdminData();
            }
        } catch (err) {
            console.error("Failed to delete user", err);
            alert("Failed to delete user. They likely have associated records preventing deletion.");
        }
    };

    const handleDeleteJob = async (id) => {
        try {
            if (window.confirm('Are you sure you want to delete this job?')) {
                await api.delete(`/api/admin/jobs/${id}`);
                fetchAdminData();
            }
        } catch (err) {
            console.error("Failed to delete job", err);
            alert("Failed to delete job.");
        }
    };

    if (loading && !users.length) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ backgroundColor: '#f8fafc' }}>
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 76px)' }}>
            <div className="container-fluid p-0">
                <div className="row g-0">
                    
                    {/* Left Sidebar */}
                    <div className="col-lg-2 d-none d-lg-block bg-dark-custom" style={{ minHeight: 'calc(100vh - 76px)', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="d-flex align-items-center mb-3">
                                <div className="d-flex align-items-center justify-content-center fw-bold rounded-circle text-white me-3 flex-shrink-0" 
                                     style={{ width: '48px', height: '48px', backgroundColor: '#ef4444', fontSize: '1.2rem' }}>
                                    AD
                                </div>
                                <div>
                                    <h6 className="fw-bold mb-0 text-white">Admin</h6>
                                    <div className="text-muted" style={{ fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>{user?.email || 'admin@jobhub.com'}</div>
                                </div>
                            </div>
                            <span className="badge border px-3 py-1" style={{ borderColor: '#ef4444', color: '#f87171', borderRadius: '20px', fontWeight: '500', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                                Administrator
                            </span>
                        </div>

                        <div className="p-3">
                            <div className="text-uppercase mb-3 px-3" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px', color: '#475569' }}>Management</div>
                            <ul className="nav flex-column mb-4 gap-1">
                                <li className="nav-item">
                                    <button onClick={() => setActiveTab('dashboard')} className={`nav-link px-3 py-2 rounded d-flex align-items-center w-100 border-0 ${activeTab === 'dashboard' ? 'text-white' : 'text-muted hover-bg-dark'}`} 
                                          style={{ backgroundColor: activeTab === 'dashboard' ? 'rgba(239, 68, 68, 0.15)' : 'transparent', textAlign: 'left' }}>
                                        <i className="bi bi-grid me-3 fs-5" style={{ color: activeTab === 'dashboard' ? '#f87171' : 'inherit' }}></i> 
                                        <span className="fw-medium">Dashboard</span>
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button onClick={() => setActiveTab('users')} className={`nav-link px-3 py-2 rounded d-flex align-items-center justify-content-between w-100 border-0 ${activeTab === 'users' ? 'text-white' : 'text-muted hover-bg-dark'}`}
                                          style={{ backgroundColor: activeTab === 'users' ? 'rgba(239, 68, 68, 0.15)' : 'transparent', textAlign: 'left' }}>
                                        <div><i className="bi bi-people me-3 fs-5" style={{ color: activeTab === 'users' ? '#f87171' : 'inherit' }}></i> All Users</div>
                                        <span className="badge rounded-pill" style={{ backgroundColor: '#ef4444' }}>{stats.totalUsers}</span>
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button onClick={() => setActiveTab('jobs')} className={`nav-link px-3 py-2 rounded d-flex align-items-center justify-content-between w-100 border-0 ${activeTab === 'jobs' ? 'text-white' : 'text-muted hover-bg-dark'}`}
                                          style={{ backgroundColor: activeTab === 'jobs' ? 'rgba(239, 68, 68, 0.15)' : 'transparent', textAlign: 'left' }}>
                                        <div><i className="bi bi-briefcase me-3 fs-5" style={{ color: activeTab === 'jobs' ? '#f87171' : 'inherit' }}></i> All Jobs</div>
                                        <span className="badge rounded-pill" style={{ backgroundColor: '#ef4444' }}>{stats.activeJobs}</span>
                                    </button>
                                </li>
                                <li className="nav-item">
                                    <button onClick={() => setActiveTab('applications')} className={`nav-link px-3 py-2 rounded d-flex align-items-center justify-content-between w-100 border-0 ${activeTab === 'applications' ? 'text-white' : 'text-muted hover-bg-dark'}`}
                                          style={{ backgroundColor: activeTab === 'applications' ? 'rgba(239, 68, 68, 0.15)' : 'transparent', textAlign: 'left' }}>
                                        <div><i className="bi bi-file-earmark-text me-3 fs-5" style={{ color: activeTab === 'applications' ? '#f87171' : 'inherit' }}></i> Applications</div>
                                        <span className="badge rounded-pill" style={{ backgroundColor: '#ef4444' }}>{stats.totalApplications}</span>
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
                        
                        <div className="mb-5 d-flex justify-content-between align-items-center">
                            <div>
                                <h3 className="fw-bold mb-1">Admin Panel</h3>
                                <p className="text-muted mb-0 fw-medium">Full platform oversight and management</p>
                            </div>
                            <button onClick={fetchAdminData} className="btn btn-outline-secondary btn-sm rounded-pill px-3">
                                <i className="bi bi-arrow-clockwise me-2"></i>Refresh Data
                            </button>
                        </div>
                        
                        {/* Stat Cards - Show only on Dashboard */}
                        {activeTab === 'dashboard' && (
                            <div className="row g-4 mb-4">
                                <div className="col-md-6 col-xl-3">
                                    <div className="card border-0 shadow-sm h-100 cursor-pointer" onClick={() => setActiveTab('users')} style={{ borderRadius: '16px', cursor: 'pointer' }}>
                                        <div className="card-body p-4">
                                            <div className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>Total Users</div>
                                            <h2 className="fw-bold mb-2 text-dark">{stats.totalUsers}</h2>
                                            <div className="text-muted fw-medium" style={{ fontSize: '0.85rem' }}>Registered accounts</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xl-3">
                                    <div className="card border-0 shadow-sm h-100 cursor-pointer" onClick={() => setActiveTab('jobs')} style={{ borderRadius: '16px', cursor: 'pointer' }}>
                                        <div className="card-body p-4">
                                            <div className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>Active Jobs</div>
                                            <h2 className="fw-bold mb-2" style={{ color: '#16a34a' }}>{stats.activeJobs}</h2>
                                            <div className="text-muted fw-medium" style={{ fontSize: '0.85rem' }}>Open listings</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xl-3">
                                    <div className="card border-0 shadow-sm h-100 cursor-pointer" onClick={() => setActiveTab('applications')} style={{ borderRadius: '16px', cursor: 'pointer' }}>
                                        <div className="card-body p-4">
                                            <div className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>Applications</div>
                                            <h2 className="fw-bold mb-2" style={{ color: '#6366f1' }}>{stats.totalApplications}</h2>
                                            <div className="text-muted fw-medium" style={{ fontSize: '0.85rem' }}>Total submitted</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xl-3">
                                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                        <div className="card-body p-4">
                                            <div className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>Messages</div>
                                            <h2 className="fw-bold mb-2" style={{ color: '#ef4444' }}>{messages.length}</h2>
                                            <div className="text-muted fw-medium" style={{ fontSize: '0.85rem' }}>Unread contact forms</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Messages Table - Show only on Dashboard */}
                        {activeTab === 'dashboard' && (
                            <div className="mb-4">
                                <h5 className="fw-bold mb-4">Recent Messages</h5>
                                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0 align-middle">
                                            <thead style={{ backgroundColor: '#f8fafc' }}>
                                                <tr>
                                                    <th className="text-muted px-4 py-3 border-bottom-0" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>FROM</th>
                                                    <th className="text-muted px-4 py-3 border-bottom-0" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>EMAIL</th>
                                                    <th className="text-muted px-4 py-3 border-bottom-0" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>MESSAGE</th>
                                                    <th className="text-muted px-4 py-3 border-bottom-0 text-center" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>ACTION</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {messages.length === 0 && (
                                                    <tr>
                                                        <td colSpan="4" className="text-center py-4 text-muted">No messages found.</td>
                                                    </tr>
                                                )}
                                                {messages.map((m, i) => (
                                                    <tr key={m.id}>
                                                        <td className={`px-4 py-3 fw-bold text-dark ${i === messages.length - 1 ? 'border-bottom-0' : ''}`}>
                                                            {m.name || m.from || 'Anonymous'}
                                                        </td>
                                                        <td className={`px-4 py-3 text-secondary ${i === messages.length - 1 ? 'border-bottom-0' : ''}`} style={{ fontSize: '0.9rem' }}>
                                                            {m.email}
                                                        </td>
                                                        <td className={`px-4 py-3 text-secondary ${i === messages.length - 1 ? 'border-bottom-0' : ''}`} style={{ fontSize: '0.9rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {m.message || m.text}
                                                        </td>
                                                        <td className={`px-4 py-3 text-center ${i === messages.length - 1 ? 'border-bottom-0' : ''}`}>
                                                            <button onClick={() => handleDeleteMessage(m.id)} className="btn btn-sm text-danger border rounded-pill px-3 fw-medium" style={{ fontSize: '0.8rem', borderColor: '#fee2e2' }}>Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Users Table */}
                        {activeTab === 'users' && (
                            <div className="mb-4">
                                <h5 className="fw-bold mb-4">All Registered Users</h5>
                                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0 align-middle">
                                            <thead style={{ backgroundColor: '#f8fafc' }}>
                                                <tr>
                                                    <th className="text-muted px-4 py-3 border-bottom-0" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>ID / NAME</th>
                                                    <th className="text-muted px-4 py-3 border-bottom-0 text-center" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>ROLE</th>
                                                    <th className="text-muted px-4 py-3 border-bottom-0 text-center" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>PHONE</th>
                                                    <th className="text-muted px-4 py-3 border-bottom-0 text-center" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>ACTIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {users.length === 0 && (
                                                    <tr>
                                                        <td colSpan="4" className="text-center py-4 text-muted">No users found.</td>
                                                    </tr>
                                                )}
                                                {users.map((u, i) => (
                                                    <tr key={u.id}>
                                                        <td className={`px-4 py-3 ${i === users.length - 1 ? 'border-bottom-0' : ''}`}>
                                                            <div className="fw-bold text-dark">#{u.id} {u.name}</div>
                                                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>{u.email}</div>
                                                        </td>
                                                        <td className={`px-4 py-3 text-center ${i === users.length - 1 ? 'border-bottom-0' : ''}`}>
                                                            <span className="badge px-3 py-2 rounded-pill" 
                                                                  style={ u.role === 'CANDIDATE' 
                                                                    ? { backgroundColor: '#e0f2fe', color: '#0369a1' } 
                                                                    : u.role === 'COMPANY' ? { backgroundColor: '#f3e8ff', color: '#6b21a8' } : { backgroundColor: '#fee2e2', color: '#b91c1c' }}>
                                                                {u.role}
                                                            </span>
                                                        </td>
                                                        <td className={`px-4 py-3 text-center text-secondary ${i === users.length - 1 ? 'border-bottom-0' : ''}`} style={{ fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                                                            <div>{u.phone || 'N/A'}</div>
                                                        </td>
                                                        <td className={`px-4 py-3 text-center ${i === users.length - 1 ? 'border-bottom-0' : ''}`}>
                                                            {u.role !== 'ADMIN' && (
                                                                <button onClick={() => handleDeleteUser(u.id)} className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-medium" style={{ fontSize: '0.8rem' }}>Delete</button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Jobs Table */}
                        {activeTab === 'jobs' && (
                            <div className="mb-4">
                                <h5 className="fw-bold mb-4">All Jobs</h5>
                                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0 align-middle">
                                            <thead style={{ backgroundColor: '#f8fafc' }}>
                                                <tr>
                                                    <th className="text-muted px-4 py-3 border-bottom-0" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>JOB TITLE</th>
                                                    <th className="text-muted px-4 py-3 border-bottom-0" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>COMPANY</th>
                                                    <th className="text-muted px-4 py-3 border-bottom-0 text-center" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>STATUS</th>
                                                    <th className="text-muted px-4 py-3 border-bottom-0 text-center" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>ACTIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {jobs.length === 0 && (
                                                    <tr>
                                                        <td colSpan="4" className="text-center py-4 text-muted">No jobs found.</td>
                                                    </tr>
                                                )}
                                                {jobs.map((j, i) => (
                                                    <tr key={j.id}>
                                                        <td className={`px-4 py-3 ${i === jobs.length - 1 ? 'border-bottom-0' : ''}`}>
                                                            <div className="fw-bold text-dark">{j.title}</div>
                                                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>{j.location} • {j.type}</div>
                                                        </td>
                                                        <td className={`px-4 py-3 ${i === jobs.length - 1 ? 'border-bottom-0' : ''}`}>
                                                            <div className="fw-medium text-dark">{j.company?.name || 'Unknown'}</div>
                                                        </td>
                                                        <td className={`px-4 py-3 text-center ${i === jobs.length - 1 ? 'border-bottom-0' : ''}`}>
                                                            <span className={`badge px-3 py-2 rounded-pill ${j.status === 'OPEN' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'}`}>
                                                                {j.status}
                                                            </span>
                                                        </td>
                                                        <td className={`px-4 py-3 text-center ${i === jobs.length - 1 ? 'border-bottom-0' : ''}`}>
                                                            <button onClick={() => handleDeleteJob(j.id)} className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-medium" style={{ fontSize: '0.8rem' }}>Delete</button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Applications Table */}
                        {activeTab === 'applications' && (
                            <div className="mb-4">
                                <h5 className="fw-bold mb-4">All Applications</h5>
                                <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0 align-middle">
                                            <thead style={{ backgroundColor: '#f8fafc' }}>
                                                <tr>
                                                    <th className="text-muted px-4 py-3 border-bottom-0" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>CANDIDATE</th>
                                                    <th className="text-muted px-4 py-3 border-bottom-0" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>JOB</th>
                                                    <th className="text-muted px-4 py-3 border-bottom-0 text-center" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>STATUS</th>
                                                    <th className="text-muted px-4 py-3 border-bottom-0 text-center" style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '1px' }}>DATE</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {applications.length === 0 && (
                                                    <tr>
                                                        <td colSpan="4" className="text-center py-4 text-muted">No applications found.</td>
                                                    </tr>
                                                )}
                                                {applications.map((app, i) => (
                                                    <tr key={app.id}>
                                                        <td className={`px-4 py-3 ${i === applications.length - 1 ? 'border-bottom-0' : ''}`}>
                                                            <div className="fw-bold text-dark">{app.candidate?.name || 'Unknown'}</div>
                                                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>{app.candidate?.email}</div>
                                                        </td>
                                                        <td className={`px-4 py-3 ${i === applications.length - 1 ? 'border-bottom-0' : ''}`}>
                                                            <div className="fw-medium text-dark">{app.job?.title || 'Unknown Job'}</div>
                                                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>{app.job?.company?.name}</div>
                                                        </td>
                                                        <td className={`px-4 py-3 text-center ${i === applications.length - 1 ? 'border-bottom-0' : ''}`}>
                                                            <span className={`badge px-3 py-2 rounded-pill ${
                                                                app.status === 'ACCEPTED' ? 'bg-success bg-opacity-10 text-success' : 
                                                                app.status === 'REJECTED' ? 'bg-danger bg-opacity-10 text-danger' : 
                                                                'bg-warning bg-opacity-10 text-warning'
                                                            }`}>
                                                                {app.status}
                                                            </span>
                                                        </td>
                                                        <td className={`px-4 py-3 text-center text-secondary ${i === applications.length - 1 ? 'border-bottom-0' : ''}`} style={{ fontSize: '0.9rem' }}>
                                                            {new Date(app.appliedAt).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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

export default AdminDashboard;
