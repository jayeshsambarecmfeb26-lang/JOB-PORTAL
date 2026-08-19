import { useState } from 'react';
import api from '../../services/api';

const CandidateSettings = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        if (newPassword !== confirmPassword) {
            setMessage({ text: 'New passwords do not match.', type: 'danger' });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ text: 'New password must be at least 6 characters long.', type: 'danger' });
            return;
        }

        setSaving(true);
        try {
            await api.put('/api/users/settings/password', {
                currentPassword,
                newPassword
            });
            setMessage({ text: 'Password updated successfully!', type: 'success' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error("Failed to update password", error);
            setMessage({ 
                text: error.response?.data?.message || 'Failed to update password. Please check your current password.', 
                type: 'danger' 
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <div className="mb-5">
                <h3 className="fw-bold mb-1">Account Settings</h3>
                <p className="text-muted mb-0 fw-medium">Manage your security and preferences</p>
            </div>

            {message.text && (
                <div className={`alert alert-${message.type} alert-dismissible fade show`} role="alert">
                    {message.text}
                    <button type="button" className="btn-close" onClick={() => setMessage({text: '', type: ''})}></button>
                </div>
            )}

            <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                <div className="card-body p-4 p-md-5">
                    <h5 className="fw-bold mb-4">Change Password</h5>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            <div className="col-12">
                                <label className="form-label fw-bold">Current Password</label>
                                <input 
                                    type="password" 
                                    className="form-control px-3 py-2" 
                                    value={currentPassword} 
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required 
                                    style={{ borderRadius: '8px' }}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">New Password</label>
                                <input 
                                    type="password" 
                                    className="form-control px-3 py-2" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required 
                                    style={{ borderRadius: '8px' }}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Confirm New Password</label>
                                <input 
                                    type="password" 
                                    className="form-control px-3 py-2" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required 
                                    style={{ borderRadius: '8px' }}
                                />
                            </div>
                        </div>

                        <div className="d-flex justify-content-end mt-5">
                            <button type="submit" className="btn btn-primary-custom px-5 py-2 fw-bold" disabled={saving} style={{ borderRadius: '8px' }}>
                                {saving ? (
                                    <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Updating...</>
                                ) : 'Update Password'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CandidateSettings;
