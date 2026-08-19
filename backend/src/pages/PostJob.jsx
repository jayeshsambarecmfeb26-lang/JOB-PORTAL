import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const PostJob = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        salary: '',
        type: 'FULL_TIME'
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');
        
        try {
            // Convert salary to number if provided
            const payload = { ...formData };
            if (payload.salary) {
                payload.salary = Number(payload.salary);
            }

            await api.post('/api/jobs', payload);
            
            // Redirect to dashboard on success
            navigate('/company/dashboard');
        } catch (error) {
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Failed to post the job. Please try again.');
        }
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 76px)', padding: '40px 0' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        
                        <div className="d-flex align-items-center mb-4">
                            <Link to="/company/dashboard" className="btn btn-sm btn-outline-secondary rounded-pill me-3 px-3">
                                <i className="bi bi-arrow-left me-1"></i> Back
                            </Link>
                            <h3 className="fw-bold mb-0">Post a New Job</h3>
                        </div>

                        <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                            <div className="card-body p-4 p-md-5">
                                <form onSubmit={handleSubmit}>
                                    
                                    {/* Job Title */}
                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-muted small" style={{ letterSpacing: '0.5px' }}>JOB TITLE <span className="text-danger">*</span></label>
                                        <input 
                                            type="text" 
                                            name="title" 
                                            value={formData.title} 
                                            onChange={handleChange} 
                                            className="form-control px-3 py-2" 
                                            placeholder="e.g. Senior Software Engineer" 
                                            required 
                                        />
                                    </div>

                                    <div className="row g-4 mb-4">
                                        {/* Location */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold text-muted small" style={{ letterSpacing: '0.5px' }}>LOCATION <span className="text-danger">*</span></label>
                                            <input 
                                                type="text" 
                                                name="location" 
                                                value={formData.location} 
                                                onChange={handleChange} 
                                                className="form-control px-3 py-2" 
                                                placeholder="e.g. Mumbai, Remote" 
                                                required 
                                            />
                                        </div>

                                        {/* Job Type */}
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold text-muted small" style={{ letterSpacing: '0.5px' }}>JOB TYPE <span className="text-danger">*</span></label>
                                            <select 
                                                name="type" 
                                                value={formData.type} 
                                                onChange={handleChange} 
                                                className="form-select px-3 py-2" 
                                                required
                                            >
                                                <option value="FULL_TIME">Full Time</option>
                                                <option value="PART_TIME">Part Time</option>
                                                <option value="INTERNSHIP">Internship</option>
                                                <option value="REMOTE">Remote</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Salary */}
                                    <div className="mb-4">
                                        <label className="form-label fw-bold text-muted small" style={{ letterSpacing: '0.5px' }}>SALARY (Yearly INR)</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-white text-muted">₹</span>
                                            <input 
                                                type="number" 
                                                name="salary" 
                                                value={formData.salary} 
                                                onChange={handleChange} 
                                                className="form-control px-3 py-2" 
                                                placeholder="e.g. 1200000" 
                                                min="0"
                                            />
                                        </div>
                                        <div className="form-text mt-1">Leave blank if you prefer not to disclose.</div>
                                    </div>

                                    {/* Job Description */}
                                    <div className="mb-5">
                                        <label className="form-label fw-bold text-muted small" style={{ letterSpacing: '0.5px' }}>JOB DESCRIPTION <span className="text-danger">*</span></label>
                                        <textarea 
                                            name="description" 
                                            value={formData.description} 
                                            onChange={handleChange} 
                                            className="form-control px-3 py-3" 
                                            rows="8" 
                                            placeholder="Describe the responsibilities, requirements, and perks of the job..."
                                            required
                                        ></textarea>
                                    </div>

                                    {/* Error Message */}
                                    {status === 'error' && (
                                        <div className="alert alert-danger border-0 py-2 mb-4 d-flex align-items-center">
                                            <i className="bi bi-exclamation-triangle-fill me-2"></i> {errorMessage}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="d-flex justify-content-end gap-3">
                                        <Link to="/company/dashboard" className="btn btn-light fw-bold px-4 py-2">
                                            Cancel
                                        </Link>
                                        <button 
                                            type="submit" 
                                            disabled={status === 'submitting'} 
                                            className="btn fw-bold px-5 py-2 text-white" 
                                            style={{ backgroundColor: '#0ea5e9' }}
                                        >
                                            {status === 'submitting' ? 'Posting...' : 'Post Job'}
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
