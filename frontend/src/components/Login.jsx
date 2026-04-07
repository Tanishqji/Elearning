import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                const res = await loginUser({ email: formData.email, password: formData.password });
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/');
            } else {
                await registerUser(formData);
                setIsLogin(true); // Switch to login after register
                alert('Registration successful! Your 3-day trial has started. Please login.');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div className="login-form-container active">
            <div id="close-login-btn" className="fas fa-times" onClick={() => navigate('/')}></div>
            <form onSubmit={handleSubmit}>
                <h3>{isLogin ? 'Sign In' : 'Sign Up'}</h3>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                {!isLogin && (
                    <>
                        <span>Username</span>
                        <input type="text" className="box" placeholder="Enter your username" 
                            onChange={e => setFormData({...formData, username: e.target.value})} required />
                    </>
                )}

                <span>Email</span>
                <input type="email" className="box" placeholder="Enter your email" 
                    onChange={e => setFormData({...formData, email: e.target.value})} required />
                
                <span>Password</span>
                <input type="password" className="box" placeholder="Enter your password" 
                    onChange={e => setFormData({...formData, password: e.target.value})} required />
                
                {isLogin && (
                    <div className="checkbox">
                        <input type="checkbox" id="remember-me" />
                        <label htmlFor="remember-me"> Remember me</label>
                    </div>
                )}
                
                <input type="submit" value={isLogin ? 'Sign In' : 'Sign Up'} className="btn" />
                
                <p>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button type="button" onClick={() => setIsLogin(!isLogin)} style={{background: 'none', color: '#27ae60', cursor:'pointer', textDecoration: 'underline'}}>
                        {isLogin ? 'Create one' : 'Sign in'}
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Login;
