import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div style={{
      minHeight: '100vh',
      background: '#05132B',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Sora, sans-serif'
    }}>
      <h1 style={{ fontSize: '64px', color: '#38BDF8', marginBottom: '8px' }}>403</h1>
      <p style={{ fontSize: '18px', color: '#F1F5F9', marginBottom: '8px' }}>Access Denied</p>
      <p style={{ fontSize: '13px', color: '#475569', marginBottom: '24px' }}>
        You don't have permission to view this page.
      </p>
      <button
        onClick={() => navigate('/')}
        style={{
          background: '#0EA5E9',
          color: '#fff',
          border: 'none',
          padding: '10px 24px',
          borderRadius: '8px',
          fontSize: '13px',
          cursor: 'pointer',
          fontFamily: 'Sora, sans-serif'
        }}>
        Go back home
      </button>
    </div>
  );
};

export default Unauthorized;
