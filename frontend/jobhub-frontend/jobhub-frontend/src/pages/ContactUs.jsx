import { useState, useEffect } from 'react';

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

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');
        try {
            await api.post('/api/contact', {
                name: formData.name,
                email: formData.email,
                message: formData.message
            });
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Failed to send message. Please try again.');
        }
    };

    return (
        <>
            {/* Hero Section */}
            <section className="hero-section text-center">
                <Particles />
                <div className="container hero-content py-5">
                    <div className="d-inline-block mb-3 px-3 py-1" style={{ border: '1px solid rgba(59,130,246,0.3)', borderRadius: '20px', color: '#60a5fa', fontSize: '0.85rem', fontWeight: '500', background: 'rgba(59,130,246,0.1)' }}>
                        GET IN TOUCH
                    </div>
                    <h1 className="display-4 fw-bold mb-3">
                        We'd love to <span className="text-primary-custom">hear from you</span>
                    </h1>
                    <p className="lead mb-5 text-muted mx-auto" style={{ maxWidth: '600px' }}>
                        Have a question or suggestion? Drop us a message and we'll get back to you within 24 hours.
                    </p>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="py-5" style={{ backgroundColor: '#f8fafc' }}>
                <div className="container py-4">
                    <div className="row g-5">
                        
                        {/* Left Column: Info Cards */}
                        <div className="col-lg-4">
                            <div className="d-flex flex-column gap-3">
                                {/* Email */}
                                <div className="hover-card p-3 d-flex align-items-center gap-3" style={{ borderRadius: '12px', background: '#fff', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                                    <div className="d-flex align-items-center justify-content-center fw-bold" style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#eff6ff', color: '#3b82f6', fontSize: '1.25rem', flexShrink: 0 }}>
                                        <i className="bi bi-envelope"></i>
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1 m-0">Email us</h6>
                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>support@jobhub.com</div>
                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>careers@jobhub.com</div>
                                    </div>
                                </div>
                                
                                {/* Call */}
                                <div className="hover-card p-3 d-flex align-items-center gap-3" style={{ borderRadius: '12px', background: '#fff', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                                    <div className="d-flex align-items-center justify-content-center fw-bold" style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#f0fdf4', color: '#22c55e', fontSize: '1.25rem', flexShrink: 0 }}>
                                        <i className="bi bi-telephone"></i>
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1 m-0">Call us</h6>
                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>+91 98765 43210</div>
                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>Mon-Fri, 9am-6pm IST</div>
                                    </div>
                                </div>

                                {/* Visit */}
                                <div className="hover-card p-3 d-flex align-items-center gap-3" style={{ borderRadius: '12px', background: '#fff', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                                    <div className="d-flex align-items-center justify-content-center fw-bold" style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#faf5ff', color: '#a855f7', fontSize: '1.25rem', flexShrink: 0 }}>
                                        <i className="bi bi-geo-alt"></i>
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1 m-0">Visit us</h6>
                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>CDAC, Andheri East</div>
                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>Mumbai, Maharashtra 400069</div>
                                    </div>
                                </div>

                                {/* Working Hours */}
                                <div className="hover-card p-3 d-flex align-items-center gap-3" style={{ borderRadius: '12px', background: '#fff', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                                    <div className="d-flex align-items-center justify-content-center fw-bold" style={{ width: '48px', height: '48px', borderRadius: '10px', background: '#fffbeb', color: '#d97706', fontSize: '1.25rem', flexShrink: 0 }}>
                                        <i className="bi bi-clock"></i>
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1 m-0">Working hours</h6>
                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>Mon-Fri: 9am-6pm</div>
                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>Saturday: 10am-2pm</div>
                                    </div>
                                </div>

                                {/* Location Map Card */}
                                <div className="hover-card p-3 mt-2" style={{ borderRadius: '12px', background: '#fff', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                                    <div className="fw-bold mb-3 m-0" style={{ fontSize: '0.9rem' }}>
                                        <i className="bi bi-geo-alt-fill me-2" style={{ color: '#0ea5e9' }}></i>Our Location
                                    </div>
                                    <div className="rounded overflow-hidden" style={{ height: '220px', border: '1px solid #e2e8f0' }}>
                                        <iframe 
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995736186!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                                            width="100%" 
                                            height="100%" 
                                            style={{ border: 0 }} 
                                            allowFullScreen="" 
                                            loading="lazy" 
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title="Mumbai Location"
                                        ></iframe>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Form */}
                        <div className="col-lg-8">
                            <div className="hover-card p-4 p-md-5 h-100" style={{ borderRadius: '16px', background: '#fff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                                <h3 className="fw-bold mb-1">Send us a message</h3>
                                <p className="text-muted small mb-4">We typically respond within 24 hours</p>

                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>YOUR NAME</label>
                                            <div className="position-relative">
                                                <i className="bi bi-person position-absolute top-50 translate-middle-y text-muted ms-3"></i>
                                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-control contact-input with-icon" placeholder="John Doe" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>EMAIL ADDRESS</label>
                                            <div className="position-relative">
                                                <i className="bi bi-envelope position-absolute top-50 translate-middle-y text-muted ms-3"></i>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-control contact-input with-icon" placeholder="you@example.com" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>SUBJECT</label>
                                        <select name="subject" value={formData.subject} onChange={handleChange} required className="form-select contact-input">
                                            <option value="">Select a subject...</option>
                                            <option value="General Inquiry">General Inquiry</option>
                                            <option value="Support Request">Support Request</option>
                                            <option value="Feedback">Feedback</option>
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label text-muted small fw-bold" style={{ letterSpacing: '0.5px' }}>MESSAGE</label>
                                        <div className="position-relative">
                                            <i className="bi bi-chat-left-text position-absolute text-muted ms-3" style={{ top: '16px' }}></i>
                                            <textarea name="message" value={formData.message} onChange={handleChange} required className="form-control contact-input with-icon" placeholder="Write your message here..." rows="5"></textarea>
                                        </div>
                                    </div>

                                    {status === 'success' && (
                                        <div className="alert alert-success border-0 py-2 small fw-medium mb-3">Message sent successfully!</div>
                                    )}
                                    {status === 'error' && (
                                        <div className="alert alert-danger border-0 py-2 small fw-medium mb-3">{errorMessage}</div>
                                    )}

                                    <button type="submit" disabled={status === 'submitting'} className="btn btn-primary-custom w-100 py-3 fw-bold" style={{ background: '#0ea5e9' }}>
                                        {status === 'submitting' ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-5 bg-white">
                <div className="container py-4">
                    <h3 className="fw-bold mb-4">Frequently asked questions</h3>
                    
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="hover-card p-4 h-100" style={{ borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', boxShadow: 'none' }}>
                                <h6 className="fw-bold mb-2">Is JobHub free to use?</h6>
                                <p className="text-muted small mb-0">Yes, JobHub is completely free for candidates. Companies may have premium listing options.</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="hover-card p-4 h-100" style={{ borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', boxShadow: 'none' }}>
                                <h6 className="fw-bold mb-2">How do I track my application?</h6>
                                <p className="text-muted small mb-0">Log in to your candidate dashboard and visit My Applications for real-time status updates.</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="hover-card p-4 h-100" style={{ borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', boxShadow: 'none' }}>
                                <h6 className="fw-bold mb-2">Can I apply for multiple jobs?</h6>
                                <p className="text-muted small mb-0">Absolutely. You can apply for as many open positions as you like from your dashboard.</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="hover-card p-4 h-100" style={{ borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', boxShadow: 'none' }}>
                                <h6 className="fw-bold mb-2">How do companies post jobs?</h6>
                                <p className="text-muted small mb-0">Register as a Company, complete your profile, and use the Post Job button on your dashboard.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer text-center text-md-start position-relative">
                <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    <div className="brand-logo h5 mb-0 text-white">Job<span className="text-primary-custom">Hub</span></div>
                    
                    {/* Circle Arrow */}
                    <div className="position-absolute start-50 translate-middle-x d-none d-md-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                        <i className="bi bi-arrow-down text-muted"></i>
                    </div>

                    <div className="d-flex flex-wrap justify-content-center gap-4 small ms-auto">
                        <div className="small text-muted">&copy; 2026 JobHub. All rights reserved.</div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default ContactUs;
