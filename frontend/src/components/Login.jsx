import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import '../styles/auth.css';
import logo from '../assets/drivee.jpg';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { email, password } = formData;
      if (!email || !password) {
        setError('Email and password are required!');
        setLoading(false);
        return;
      }

      const response = await AuthService.login(email, password);
      console.log('Login successful:', response);
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="driveease-login-container">
      <div className="driveease-login-card">
        <div className="driveease-logo">
        <img src={logo} alt="DriveEase Logo" class="driveease-logo" />

        </div>

        <h1>Welcome to DriveEase</h1>
        <p className="driveease-subtitle">
          Your journey begins with a simple login
        </p>

        {error && <div className="driveease-error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="driveease-form">
          <div className="driveease-input-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="driveease-input"
              required
            />
          </div>

          <div className="driveease-input-group">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="driveease-input"
              required
            />
            <button 
              type="button" 
              className="driveease-toggle-password"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="driveease-forgot-password">
            <Link to="/forgot-password" className="driveease-link">Forgot Password?</Link>
          </div>

          <button type="submit" className="driveease-button" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="driveease-separator">
          <span>or continue with</span>
        </div>

        <div className="driveease-social-buttons">
          <button className="driveease-social-button google">
            <span className="driveease-social-icon">G</span>
          </button>
          <button className="driveease-social-button apple">
            <span className="driveease-social-icon">apple</span>
          </button>
          <button className="driveease-social-button facebook">
            <span className="driveease-social-icon">f</span>
          </button>
        </div>

        <div className="driveease-signup">
          <p>Don't have an account? <Link to="/register" className="driveease-link">Register now</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;