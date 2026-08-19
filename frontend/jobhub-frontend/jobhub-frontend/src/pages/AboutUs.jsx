import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const AboutUs = () => {
    const [stats, setStats] = useState({ jobs: 0, companies: 0, candidates: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/api/stats');
                const statsData = response.data || {};
                setStats({
                    jobs: statsData.activeJobs || 0,
                    companies: statsData.companies || 0,
                    candidates: statsData.candidates || 0
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section text-center">
                <Particles />
                <div className="container hero-content py-5">
                    <div className="d-inline-block mb-3 px-3 py-1" style={{ border: '1px solid rgba(59,130,246,0.3)', borderRadius: '20px', color: '#60a5fa', fontSize: '0.85rem', fontWeight: '500', background: 'rgba(59,130,246,0.1)' }}>
                        OUR STORY
                    </div>
                    <h1 className="display-4 fw-bold mb-3">
                        Built to connect <span className="text-primary-custom">talent</span> <br/>
                        with opportunity
                    </h1>
                    <p className="lead mb-5 text-muted mx-auto" style={{ maxWidth: '600px' }}>
                        JobHub was created with one mission — to make the hiring process simpler, faster, and more human for everyone involved.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-5 bg-white">
                <div className="container py-4">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <div className="text-primary-custom fw-bold mb-2 small text-uppercase" style={{ letterSpacing: '1px' }}>OUR MISSION</div>
                            <h2 className="fw-bold mb-4">Bridging the gap between <span className="text-primary-custom">talent and growth</span></h2>
                            <p className="text-muted">
                                We believe everyone deserves access to meaningful work. JobHub was built to remove the barriers between great candidates and great companies — making hiring transparent, efficient, and fair.
                            </p>
                            <p className="text-muted mb-0">
                                From fresh graduates to seasoned professionals, our platform gives every candidate an equal opportunity to shine.
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <div className="login-card bg-darker-custom p-4 p-md-5">
                                <div className="row g-4 text-center">
                                    <div className="col-6">
                                        <div className="glass-stat-box">
                                            <h3 className="text-primary-custom fw-bold mb-1">{stats.jobs > 0 ? stats.jobs : '0'}</h3>
                                            <p className="text-muted small mb-0">Active jobs</p>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="glass-stat-box">
                                            <h3 className="text-primary-custom fw-bold mb-1">{stats.companies > 0 ? stats.companies : '0'}</h3>
                                            <p className="text-muted small mb-0">Companies</p>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="glass-stat-box">
                                            <h3 className="text-primary-custom fw-bold mb-1">{stats.candidates > 0 ? stats.candidates : '0'}</h3>
                                            <p className="text-muted small mb-0">Candidates</p>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="glass-stat-box">
                                            <h3 className="text-primary-custom fw-bold mb-1">98%</h3>
                                            <p className="text-muted small mb-0">Satisfaction rate</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-5" style={{ backgroundColor: '#f1f5f9' }}>
                <div className="container py-4 text-center">
                    <h3 className="fw-bold mb-1">What we stand for</h3>
                    <p className="text-muted mb-5">The principles that guide everything we build</p>
                    
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="hover-card p-4 h-100 text-center">
                                <div className="icon-box" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                                    <i className="bi bi-eye"></i>
                                </div>
                                <h6 className="fw-bold mb-3">Transparency</h6>
                                <p className="text-muted small mb-0">Clear job descriptions, honest salary ranges, and open application status at every step</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="hover-card p-4 h-100 text-center">
                                <div className="icon-box" style={{ background: '#f0fdf4', color: '#22c55e' }}>
                                    <i className="bi bi-lightning-charge"></i>
                                </div>
                                <h6 className="fw-bold mb-3">Speed</h6>
                                <p className="text-muted small mb-0">From application to offer — we help companies hire faster and candidates land quicker</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="hover-card p-4 h-100 text-center">
                                <div className="icon-box" style={{ background: '#faf5ff', color: '#a855f7' }}>
                                    <i className="bi bi-heart"></i>
                                </div>
                                <h6 className="fw-bold mb-3">People first</h6>
                                <p className="text-muted small mb-0">Behind every application is a person with a dream. We never forget that</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
                <div className="container py-4">
                    <h3 className="fw-bold mb-1">Meet the team</h3>
                    <p className="text-muted mb-5">The people who built JobHub</p>
                    
                    <div className="row g-4 text-center justify-content-center">
                        <div className="col-lg-4 col-md-6">
                            <div className="hover-card p-4 h-100">
                                <div className="mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold" style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', fontSize: '1.5rem' }}>
                                    AP
                                </div>
                                <h5 className="fw-bold mb-1">Atharva Pawar</h5>
                                <p className="text-muted small mb-3">Founder & Lead Full Stack Developer</p>
                                <p className="text-muted small mb-0">Architected the core JobHub platform using Spring Boot and React. Led the overall development strategy.</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="hover-card p-4 h-100">
                                <div className="mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold" style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f0fdf4', color: '#22c55e', fontSize: '1.5rem' }}>
                                    BP
                                </div>
                                <h5 className="fw-bold mb-1">Bhupesh Patil</h5>
                                <p className="text-muted small mb-3">Frontend Engineer</p>
                                <p className="text-muted small mb-0">Designed and implemented the responsive React UI. Focused on creating an intuitive candidate experience.</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="hover-card p-4 h-100">
                                <div className="mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold" style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#faf5ff', color: '#a855f7', fontSize: '1.5rem' }}>
                                    SM
                                </div>
                                <h5 className="fw-bold mb-1">Sahil Madge</h5>
                                <p className="text-muted small mb-3">Backend Developer</p>
                                <p className="text-muted small mb-0">Built the REST APIs and integrated the Spring Security module with JWT authentication.</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="hover-card p-4 h-100">
                                <div className="mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold" style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fffbeb', color: '#d97706', fontSize: '1.5rem' }}>
                                    RB
                                </div>
                                <h5 className="fw-bold mb-1">Roshan Bhamre</h5>
                                <p className="text-muted small mb-3">UI/UX Designer & QA</p>
                                <p className="text-muted small mb-0">Crafted the initial wireframes and user flow. Ensured pixel-perfect implementation and rigorous testing.</p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6">
                            <div className="hover-card p-4 h-100">
                                <div className="mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold" style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#fdf2f8', color: '#db2777', fontSize: '1.5rem' }}>
                                    JS
                                </div>
                                <h5 className="fw-bold mb-1">Jayesh Sambhare</h5>
                                <p className="text-muted small mb-3">Cloud & DevOps Engineer</p>
                                <p className="text-muted small mb-0">Set up the CI/CD pipelines, managed cloud hosting, and optimized backend application performance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-5 bg-darker-custom text-white text-center">
                <div className="container py-5">
                    <h2 className="fw-bold mb-3">Ready to find your next opportunity?</h2>
                    <p className="text-muted mb-4">Join thousands of professionals already using JobHub</p>
                    <div className="d-flex justify-content-center flex-wrap gap-3">
                        <Link to="/register" className="btn btn-gradient px-4 py-2">Get started free</Link>
                        <Link to="/jobs" className="btn btn-outline-custom px-4 py-2">Browse jobs</Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer text-center text-md-start">
                <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <div className="brand-logo h5 mb-0 text-white">Job<span className="text-primary-custom">Hub</span></div>
                    <div className="d-flex flex-wrap justify-content-center gap-4 small">
                        <Link to="/about" className="text-muted text-decoration-none">About</Link>
                        <Link to="/contact" className="text-muted text-decoration-none">Contact</Link>
                        <span className="text-muted" style={{ cursor: 'pointer' }}>Privacy</span>
                        <span className="text-muted" style={{ cursor: 'pointer' }}>Terms</span>
                    </div>
                    <div className="small text-muted">&copy; 2026 JobHub. All rights reserved.</div>
                </div>
            </footer>
        </>
    );
};

export default AboutUs;
