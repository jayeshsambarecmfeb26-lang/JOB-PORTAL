import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Particles = () => {
    const [particles, setParticles] = useState([]);
    
    useEffect(() => {
        const arr = [];
        for(let i=0; i<30; i++) {
            arr.push({
                id: i,
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDuration: (Math.random() * 15 + 10) + 's',
                animationDelay: (Math.random() * 5) + 's',
            });
        }
        setParticles(arr);
    }, []);

    return (
        <div className="particles-container">
            {particles.map(p => (
                <div 
                    key={p.id} 
                    className="particle" 
                    style={{ left: p.left, top: p.top, animationDuration: p.animationDuration, animationDelay: p.animationDelay }}
                ></div>
            ))}
        </div>
    );
};

const Home = () => {
    const navigate = useNavigate();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [locationKeyword, setLocationKeyword] = useState('');
    const [stats, setStats] = useState({ jobs: 0, companies: 0, candidates: 0 });
    const [recentJobs, setRecentJobs] = useState([]);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                // Fetch stats and recent jobs
                const [jobsRes, statsRes] = await Promise.all([
                    api.get('/api/jobs').catch(() => ({ data: [] })),
                    api.get('/api/stats').catch(() => ({ data: {} }))
                ]);

                const jobsData = jobsRes.data || [];
                const statsData = statsRes.data || {};

                setStats({
                    jobs: statsData.activeJobs || 0,
                    companies: statsData.companies || 0,
                    candidates: statsData.candidates || 0
                });

                // Top 4 recent jobs
                const sortedJobs = [...jobsData].sort((a, b) => new Date(b.postedAt || 0) - new Date(a.postedAt || 0)).slice(0, 4);
                setRecentJobs(sortedJobs);

            } catch (error) {
                console.error("Error fetching home data:", error);
            }
        };

        fetchHomeData();
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchKeyword.trim()) params.append('search', searchKeyword.trim());
        if (locationKeyword.trim()) params.append('location', locationKeyword.trim());
        
        if (params.toString()) {
            navigate(`/jobs?${params.toString()}`);
        } else {
            navigate('/jobs');
        }
    };

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section">
                <Particles />
                <div className="container hero-content text-center py-5">
                    <div className="d-inline-block mb-3 px-3 py-1" style={{ border: '1px solid rgba(59,130,246,0.3)', borderRadius: '20px', color: '#60a5fa', fontSize: '0.85rem', fontWeight: '500', background: 'rgba(59,130,246,0.1)' }}>
                        YOUR NEXT OPPORTUNITY AWAITS
                    </div>
                    <h1 className="display-4 fw-bold mb-3">
                        Find the job that fits <br />
                        <span className="text-primary-custom">your ambition</span>
                    </h1>
                    <p className="lead mb-5 text-muted mx-auto" style={{ maxWidth: '600px' }}>
                        Connect with top companies hiring right now. Browse thousands of roles across industries and locations.
                    </p>

                    <div className="search-container p-2 mx-auto mb-4 d-flex flex-column flex-md-row gap-2 align-items-center" style={{ maxWidth: '800px' }}>
                        <div className="input-group">
                            <span className="input-group-text bg-transparent border-0 text-muted"><i className="bi bi-search"></i></span>
                            <input type="text" className="form-control search-input" placeholder="Job title, skill, keyword..." 
                                   value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} 
                                   onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                        </div>
                        <div className="d-none d-md-block" style={{ width: '1px', background: 'rgba(255,255,255,0.1)', height: '2rem' }}></div>
                        <div className="input-group mt-2 mt-md-0">
                            <span className="input-group-text bg-transparent border-0 text-muted"><i className="bi bi-geo-alt"></i></span>
                            <input type="text" className="form-control search-input" placeholder="City or remote..." 
                                   value={locationKeyword} onChange={(e) => setLocationKeyword(e.target.value)}
                                   onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                        </div>
                        <button onClick={handleSearch} className="btn btn-primary-custom px-4 py-2 w-100 w-md-auto mt-2 mt-md-0" style={{ minWidth: '150px' }}>Search Jobs</button>
                    </div>

                    <div className="d-flex flex-wrap justify-content-center gap-2">
                        <span onClick={() => navigate('/jobs?search=Java')} className="pill-badge" style={{ cursor: 'pointer' }}>Java Developer</span>
                        <span onClick={() => navigate('/jobs?search=React')} className="pill-badge" style={{ cursor: 'pointer' }}>React Frontend</span>
                        <span onClick={() => navigate('/jobs?search=Data')} className="pill-badge" style={{ cursor: 'pointer' }}>Data Analyst</span>
                        <span onClick={() => navigate('/jobs?search=UI')} className="pill-badge" style={{ cursor: 'pointer' }}>UI/UX Designer</span>
                        <span onClick={() => navigate('/jobs?search=DevOps')} className="pill-badge" style={{ cursor: 'pointer' }}>DevOps Engineer</span>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-darker-custom text-white py-4 border-bottom border-secondary">
                <div className="container">
                    <div className="row text-center gy-4">
                        <div className="col-6 col-md-3">
                            <h3 className="text-primary-custom mb-1">{stats.jobs > 0 ? stats.jobs : '0'}</h3>
                            <p className="text-muted small mb-0">Active jobs</p>
                        </div>
                        <div className="col-6 col-md-3">
                            <h3 className="text-primary-custom mb-1">{stats.companies > 0 ? stats.companies : '0'}</h3>
                            <p className="text-muted small mb-0">Companies</p>
                        </div>
                        <div className="col-6 col-md-3">
                            <h3 className="text-primary-custom mb-1">{stats.candidates > 0 ? stats.candidates : '0'}</h3>
                            <p className="text-muted small mb-0">Candidates</p>
                        </div>
                        <div className="col-6 col-md-3">
                            <h3 className="text-primary-custom mb-1">98%</h3>
                            <p className="text-muted small mb-0">Satisfaction rate</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-5" style={{ backgroundColor: '#f1f5f9' }}>
                <div className="container">
                    <h4 className="mb-4 fw-bold">Browse by category</h4>
                    <div className="row g-4">
                        <div className="col-6 col-md-3" style={{ cursor: 'pointer' }} onClick={() => navigate('/jobs?search=Developer')}>
                            <div className="hover-card category-card">
                                <div className="icon-box" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                                    <i className="bi bi-code-slash"></i>
                                </div>
                                <h6 className="mb-1 fw-bold">Technology</h6>
                                <p className="text-muted small mb-0">Browse jobs</p>
                            </div>
                        </div>
                        <div className="col-6 col-md-3" style={{ cursor: 'pointer' }} onClick={() => navigate('/jobs?search=Finance')}>
                            <div className="hover-card category-card">
                                <div className="icon-box" style={{ background: '#f0fdf4', color: '#22c55e' }}>
                                    <i className="bi bi-graph-up"></i>
                                </div>
                                <h6 className="mb-1 fw-bold">Finance</h6>
                                <p className="text-muted small mb-0">Browse jobs</p>
                            </div>
                        </div>
                        <div className="col-6 col-md-3" style={{ cursor: 'pointer' }} onClick={() => navigate('/jobs?search=Designer')}>
                            <div className="hover-card category-card">
                                <div className="icon-box" style={{ background: '#faf5ff', color: '#a855f7' }}>
                                    <i className="bi bi-palette"></i>
                                </div>
                                <h6 className="mb-1 fw-bold">Design</h6>
                                <p className="text-muted small mb-0">Browse jobs</p>
                            </div>
                        </div>
                        <div className="col-6 col-md-3" style={{ cursor: 'pointer' }} onClick={() => navigate('/jobs?search=Marketing')}>
                            <div className="hover-card category-card">
                                <div className="icon-box" style={{ background: '#fffbeb', color: '#f59e0b' }}>
                                    <i className="bi bi-megaphone"></i>
                                </div>
                                <h6 className="mb-1 fw-bold">Marketing</h6>
                                <p className="text-muted small mb-0">Browse jobs</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Latest Openings Section */}
            <section className="py-5 bg-light">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="mb-0 fw-bold">Latest openings</h4>
                        <Link to="/jobs" className="text-primary-custom text-decoration-none fw-bold">View all &rarr;</Link>
                    </div>
                    <div className="row g-4">
                        {recentJobs.length > 0 ? recentJobs.map((job) => {
                            const badgeColors = {
                                FULL_TIME: { bg: '#eff6ff', text: '#3b82f6' },
                                PART_TIME: { bg: '#fffbeb', text: '#d97706' },
                                REMOTE: { bg: '#faf5ff', text: '#a855f7' },
                                INTERNSHIP: { bg: '#f0fdf4', text: '#22c55e' }
                            };
                            const bCol = badgeColors[job.type] || badgeColors.FULL_TIME;
                            const initials = job.company?.name ? job.company.name.substring(0, 2).toUpperCase() : 'CO';
                            
                            return (
                                <div className="col-md-6" key={job.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/jobs/${job.id}`)}>
                                    <div className="hover-card bg-white p-4 h-100">
                                        <div className="d-flex justify-content-between mb-3">
                                            <div className="d-flex align-items-center gap-3">
                                                <div style={{ width: '40px', height: '40px', background: bCol.bg, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: bCol.text, fontWeight: 'bold' }}>{initials}</div>
                                                <div>
                                                    <h6 className="mb-0 fw-bold">{job.title}</h6>
                                                    <small className="text-muted">{job.company?.name}</small>
                                                </div>
                                            </div>
                                            <span className="badge" style={{ background: bCol.bg, color: bCol.text, height: 'fit-content' }}>{job.type?.replace('_', ' ')}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mt-4">
                                            <div className="text-muted small"><i className="bi bi-geo-alt me-1"></i> {job.location}</div>
                                            <div className="text-primary-custom fw-bold">{job.salary ? `₹${(job.salary / 100000).toFixed(1)} LPA` : 'Not specified'}</div>
                                            <div className="text-muted small">{new Date(job.postedAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="col-12 text-center py-5 text-muted">
                                No jobs available at the moment.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-5 bg-dark-custom text-white">
                <div className="container py-4 text-center">
                    <h4 className="mb-5 fw-bold">How JobHub works</h4>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="p-4 h-100" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div className="mb-3 mx-auto d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(59,130,246,0.2)', color: '#60a5fa', fontWeight: 'bold', border: '1px solid #3b82f6', fontSize: '1.2rem' }}>1</div>
                                <h6 className="fw-bold">Create your profile</h6>
                                <p className="text-muted small mb-0">Register as a candidate or company in under 2 minutes</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 h-100" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div className="mb-3 mx-auto d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(59,130,246,0.2)', color: '#60a5fa', fontWeight: 'bold', border: '1px solid #3b82f6', fontSize: '1.2rem' }}>2</div>
                                <h6 className="fw-bold">Browse and apply</h6>
                                <p className="text-muted small mb-0">Search thousands of listings and apply with one click</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="p-4 h-100" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div className="mb-3 mx-auto d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(59,130,246,0.2)', color: '#60a5fa', fontWeight: 'bold', border: '1px solid #3b82f6', fontSize: '1.2rem' }}>3</div>
                                <h6 className="fw-bold">Get hired</h6>
                                <p className="text-muted small mb-0">Track your application status and land your dream role</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div className="brand-logo h5 mb-0 text-white">Job<span className="text-primary-custom">Hub</span></div>
                    <div className="d-flex gap-4 small">
                        <Link to="/about" className="text-muted text-decoration-none">About</Link>
                        <Link to="/contact" className="text-muted text-decoration-none">Contact</Link>
                        <span className="text-muted">Privacy</span>
                        <span className="text-muted">Terms</span>
                    </div>
                    <div className="small text-muted">&copy; 2026 JobHub</div>
                </div>
            </footer>
        </>
    );
};

export default Home;
