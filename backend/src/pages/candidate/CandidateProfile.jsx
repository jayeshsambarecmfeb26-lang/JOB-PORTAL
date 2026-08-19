import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CandidateProfile = () => {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [resume, setResume] = useState(null);
    const [resumeUrl, setResumeUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/api/users/me');
                setName(response.data.name || '');
                setPhone(response.data.phone || '');
                setResumeUrl(response.data.resumeUrl || '');
            } catch (error) {
                console.error("Failed to load profile", error);
                setMessage({ text: 'Failed to load profile data', type: 'danger' });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setResume(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: '', type: '' });

        const formData = new FormData();
        formData.append('name', name);
        formData.append('phone', phone);
        if (resume) {
            formData.append('resume', resume);
        }

        try {
            const response = await api.put('/api/users/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setResumeUrl(response.data.resumeUrl);
            setResume(null); // Clear file input state after upload
            
            // Re-authenticate or update user context if needed
            // For now, simply show success
            setMessage({ text: 'Profile updated successfully!', type: 'success' });
            
            // Optionally update the context user
            const updatedUser = { ...user, name: response.data.name };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.dispatchEvent(new Event('storage')); // Trigger context update if implemented
            
        } catch (error) {
            console.error("Failed to update profile", error);
            setMessage({ text: 'Failed to update profile', type: 'danger' });
        } finally {
            setSaving(false);
        }
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
            <div className="mb-5">
                <h3 className="fw-bold mb-1">My Profile</h3>
                <p className="text-muted mb-0 fw-medium">Update your personal information and resume</p>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                    {message.text}
                    <button type="button" className="btn-close" onClick={() => setMessage({text: '', type: ''})}></button>
                </div>
            )}

            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                <div className="card-body p-4 p-md-5">
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4 mb-4">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Full Name</label>
                                <input 
                                    type="text" 
                                    className="form-control px-3 py-2" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                    required 
                                    style={{ borderRadius: '8px' }}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Email Address</label>
                                <input 
                                    type="email" 
                                    className="form-control px-3 py-2 bg-light" 
                                    value={user?.email} 
                                    disabled 
                                    style={{ borderRadius: '8px', color: '#64748b' }}
                                />
                                <div className="form-text small">Email cannot be changed.</div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Phone Number</label>
                                <input 
                                    type="tel" 
                                    className="form-control px-3 py-2" 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+91 9876543210"
                                    style={{ borderRadius: '8px' }}
                                />
                            </div>
                        </div>

                        <hr className="my-5" style={{ opacity: 0.1 }} />

                        <div className="mb-4">
                            <h5 className="fw-bold mb-3">Resume Upload</h5>
                            <p className="text-muted small mb-4">Upload your latest resume to make it easy to apply for jobs. PDF format is recommended.</p>
                            
                            <div className="row g-4 align-items-center">
                                <div className="col-md-8">
                                    <input 
                                        type="file" 
                                        className="form-control" 
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        style={{ padding: '10px 15px', borderRadius: '8px' }}
                                    />
                                    {resumeUrl && !resume && (
                                        <div className="mt-2 text-success small fw-medium">
                                            <i className="bi bi-check-circle-fill me-1"></i> Resume currently uploaded
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-4">
                                    {resumeUrl && (
                                        <a href={`http://localhost:8080${resumeUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary w-100 fw-bold" style={{ borderRadius: '8px', padding: '10px' }}>
                                            <i className="bi bi-eye me-2"></i> View Current Resume
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-5">
                            <button type="submit" className="btn btn-primary-custom px-5 py-2 fw-bold" disabled={saving} style={{ borderRadius: '8px' }}>
                                {saving ? (
                                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>
                                ) : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CandidateProfile;
