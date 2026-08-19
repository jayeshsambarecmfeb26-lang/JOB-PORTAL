import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        salary: '',
        type: 'FULL_TIME'
    });

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get(`/api/jobs/${id}`);
                const job = res.data;
                setFormData({
                    title: job.title || '',
                    description: job.description || '',
                    location: job.location || '',
                    salary: job.salary || '',
                    type: job.type || 'FULL_TIME'
                });
            } catch (err) {
                console.error("Failed to load job", err);
                setError("Failed to load job details.");
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/jobs/${id}`, formData);
            navigate('/company/dashboard');
        } catch (err) {
            console.error("Failed to update job", err);
            setError("Failed to update job. Please try again.");
        }
    };

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
        <div className="min-vh-100 py-5" style={{ backgroundColor: '#f8fafc' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                            <div className="card-body p-4 p-md-5">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h3 className="fw-bold mb-0">Edit Job Listing</h3>
                                    <button onClick={() => navigate('/company/dashboard')} className="btn btn-outline-secondary btn-sm rounded-pill px-3">Cancel</button>
                                </div>
                                
                                {error && <div className="alert alert-danger">{error}</div>}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label fw-medium">Job Title</label>
                                        <input type="text" name="title" className="form-control p-3 bg-light border-0" 
                                               value={formData.title} onChange={handleChange} required />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label fw-medium">Location</label>
                                        <input type="text" name="location" className="form-control p-3 bg-light border-0" 
                                               value={formData.location} onChange={handleChange} required />
                                    </div>
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">Salary (Yearly in ₹)</label>
                                            <input type="number" name="salary" className="form-control p-3 bg-light border-0" 
                                                   value={formData.salary} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-medium">Job Type</label>
                                            <select name="type" className="form-select p-3 bg-light border-0" value={formData.type} onChange={handleChange}>
                                                <option value="FULL_TIME">Full Time</option>
                                                <option value="PART_TIME">Part Time</option>
                                                <option value="CONTRACT">Contract</option>
                                                <option value="INTERNSHIP">Internship</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label fw-medium">Description</label>
                                        <textarea name="description" className="form-control p-3 bg-light border-0" rows="6" 
                                                  value={formData.description} onChange={handleChange} required></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100 p-3 fw-bold rounded-3" style={{ backgroundColor: '#6366f1', border: 'none' }}>
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditJob;
