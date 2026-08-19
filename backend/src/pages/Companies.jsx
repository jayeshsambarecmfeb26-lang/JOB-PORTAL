import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Companies = () => {
    const [companies, setCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await api.get('/api/companies');
                setCompanies(res.data);
            } catch (error) {
                console.error("Failed to fetch companies", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter(company => 
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 pb-5" style={{ backgroundColor: '#f8fafc' }}>
            {/* Header Section */}
            <div className="text-white py-5 mb-5" style={{ backgroundColor: '#0f172a' }}>
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-8">
                            <h1 className="display-4 fw-bold mb-3">Top Companies Hiring Now</h1>
                            <p className="lead text-secondary mb-4">Discover the best places to work and find your next great opportunity.</p>
                            
                            {/* Search Bar */}
                            <div className="bg-white p-2 rounded shadow-sm d-flex">
                                <span className="input-group-text bg-transparent border-0"><i className="bi bi-search text-muted"></i></span>
                                <input 
                                    type="text" 
                                    className="form-control border-0 shadow-none" 
                                    placeholder="Search companies by name..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Companies Grid */}
            <div className="container">
                <div className="row g-4">
                    {filteredCompanies.length === 0 ? (
                        <div className="col-12 text-center py-5">
                            <h3 className="text-muted">No companies found matching "{searchTerm}"</h3>
                        </div>
                    ) : (
                        filteredCompanies.map(company => (
                            <div key={company.id} className="col-md-6 col-lg-4">
                                <div className="card h-100 border-0 shadow-sm company-card" style={{ borderRadius: '16px', transition: 'transform 0.2s' }}>
                                    <div className="card-body p-4 text-center d-flex flex-column">
                                        <div className="d-flex justify-content-center align-items-center fw-bold rounded-circle mx-auto mb-3 text-white shadow-sm" 
                                             style={{ width: '80px', height: '80px', backgroundColor: '#6366f1', fontSize: '2.5rem' }}>
                                            {company.name.substring(0, 1).toUpperCase()}
                                        </div>
                                        <h4 className="card-title fw-bold text-dark mb-1">{company.name}</h4>
                                        <p className="text-muted small mb-3"><i className="bi bi-geo-alt-fill text-danger me-1"></i>{company.location}</p>
                                        
                                        <p className="card-text text-secondary mb-4 flex-grow-1" style={{ fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {company.description || "Leading innovator in their industry, providing top-tier solutions and a great workplace culture."}
                                        </p>
                                        
                                        <div className="d-flex justify-content-between align-items-center mt-auto border-top pt-3">
                                            <div className="text-start">
                                                <div className="text-muted small fw-medium text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>Active Jobs</div>
                                                <div className="fw-bold" style={{ color: '#16a34a', fontSize: '1.4rem' }}>{company.activeJobs}</div>
                                            </div>
                                            <Link to={`/jobs`} className="btn btn-outline-primary rounded-pill px-4 fw-medium">
                                                View Jobs
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <style>{`
                .company-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
            `}</style>
        </div>
    );
};

export default Companies;
