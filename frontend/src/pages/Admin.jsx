import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || user.role !== 'admin') {
            alert('Access Denied. Admins only.');
            navigate('/');
        } else {
            // Mock fetching users - you would add this route to backend
            // For now just representing visually
            setUsers([
                { id: 1, email: 'test1@test.com', isSubscribed: true, trialExpiresAt: '2026-05-01' },
                { id: 2, email: 'test2@test.com', isSubscribed: false, trialExpiresAt: '2026-04-01' } // expired
            ]);
        }
    }, [navigate]);

    return (
        <div style={{ padding: '5rem', fontSize: '1.5rem' }}>
            <h2>Admin Dashboard</h2>
            <button className="btn" onClick={() => navigate('/')}>Back to Home</button>
            <table style={{ width: '100%', marginTop: '2rem', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                <thead>
                    <tr style={{ background: '#f4f4f4', textAlign: 'left', borderBottom: '1px solid #ccc' }}>
                        <th style={{ padding: '10px' }}>Email</th>
                        <th style={{ padding: '10px' }}>Subscribed</th>
                        <th style={{ padding: '10px' }}>Trial Expiry</th>
                        <th style={{ padding: '10px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>{u.email}</td>
                            <td style={{ padding: '10px' }}>{u.isSubscribed ? 'Yes' : 'No'}</td>
                            <td style={{ padding: '10px' }}>{new Date(u.trialExpiresAt).toLocaleDateString()}</td>
                            <td style={{ padding: '10px' }}>
                                <button className="btn" style={{ padding: '5px 10px', fontSize: '1.2rem', marginTop: 0 }}>
                                    {u.isSubscribed ? 'Revoke Access' : 'Grant Subscription'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;
