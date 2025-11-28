import { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function OTPLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email) return alert('Enter a valid email');

    try {
      await axios.post('/send-otp/', { email });
      setOtpSent(true);
      alert('OTP sent to your email');
    } catch (err) {
      alert('Failed to send OTP');
    }
  };

  const verifyOtp = async () => {
    if (!otp) return alert('Enter the OTP');

    try {
      const res = await axios.post('/verify-otp/', { email, code: otp });
      alert('Login successful');
      onLogin(res.data.user_id, email); // ✅ Pass both user_id and email
      navigate('/dashboard');
    } catch (err) {
      alert('Invalid or expired OTP');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={(e) => e.preventDefault()} className="login-form">
        <h2 className="login-title">Login</h2>

        <input
          type="email"
          placeholder="Enter Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {!otpSent ? (
          <button type="button" className="login-button" onClick={sendOtp}>
            Send OTP
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="login-input"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="button" className="login-button" onClick={verifyOtp}>
              Verify OTP
            </button>
          </>
        )}
      </form>
    </div>
  );
}
