import React, { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  EnvelopeIcon,
  ArrowPathIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { Footer } from '../../components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EmailVerificationPage = () => {
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Get token from URL
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');

    if (!tokenFromUrl) {
      setStatus('error');
      setMessage('Invalid verification link. Token is missing.');
      return;
    }

    setToken(tokenFromUrl);
    verifyEmail(tokenFromUrl);
  }, []);

  const verifyEmail = async (verificationToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-email?token=${verificationToken}`, {
        method: 'GET',
        credentials: 'include',
      });

      const text = await response.text();

      if (response.ok) {
        setStatus('success');
        setMessage(text || 'Email successfully verified');
      } else {
        setStatus('error');
        setMessage(text || 'Verification failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setStatus('error');
      setMessage('Unable to verify email. Please try again later.');
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  const handleHomeRedirect = () => {
    window.location.href = '/';
  };

  return (
    <>
      <header className="left-0 w-full z-50 transition-all duration-1500">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between text-white">
          {/* Logo */}
          <a
            href="#"
            onClick={handleHomeRedirect}
            className="text-2xl md:text-3xl font-bold tracking-widest uppercase hover:text-zinc-300 transition-colors"
          >
            INKVERSE
          </a>
        </div>
      </header>
      <div className="min-h-screen"
        style={{
          backgroundColor: 'black',
          background: 'linear-gradient(135deg, #0d0d0d 0%, #1a1a1a 40%, #2b2b2b 100%)'
        }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/20 border-2 border-blue-500 rounded-full mb-6">
                <ArrowPathIcon className="w-12 h-12 text-blue-500 animate-spin" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Verifying Your Email
              </h1>
              <p className="text-lg text-zinc-400">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full mb-6">
                <CheckCircleIcon className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Email Verified!
              </h1>
              <p className="text-lg text-zinc-400 mb-8">
                {message}
              </p>

              {/* Success Card */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 mb-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <EnvelopeIcon className="w-6 h-6 text-green-400" />
                  <p className="text-zinc-300">
                    Your email has been successfully verified. You can now log in to your account.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleLoginRedirect}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 hover:from-gray-300 hover:to-gray-500 text-black font-semibold transition-all shadow-lg"
                  >
                    Continue to Login
                    <ArrowRightIcon className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleHomeRedirect}
                    className="w-full py-3.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold border border-zinc-700 transition-all"
                  >
                    Go to Home
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-gradient-to-r from-green-900/20 to-green-800/20 border border-green-700/30 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-2">What's Next?</h3>
                <p className="text-sm text-zinc-300">
                  Your account is now fully activated. You can log in and start shopping,
                  track your orders, and manage your account settings.
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 border-2 border-red-500 rounded-full mb-6">
                <XCircleIcon className="w-12 h-12 text-red-500" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                Verification Failed
              </h1>
              <p className="text-lg text-zinc-400 mb-8">
                {message}
              </p>

              {/* Error Card */}
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-8 mb-8">
                <div className="mb-6">
                  <p className="text-zinc-300 mb-4">
                    We couldn't verify your email address. This could be because:
                  </p>
                  <ul className="text-sm text-zinc-400 space-y-2 text-left max-w-md mx-auto">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>The verification link has expired</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>The link has already been used</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>The verification link is invalid</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleHomeRedirect}
                    className="w-full py-3.5 rounded-lg bg-gradient-to-r from-gray-200 to-gray-400 hover:from-gray-300 hover:to-gray-500 text-black font-semibold transition-all shadow-lg"
                  >
                    Go to Home
                  </button>

                  <button
                    onClick={handleLoginRedirect}
                    className="w-full py-3.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold border border-zinc-700 transition-all"
                  >
                    Try Logging In
                  </button>
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 border border-zinc-700 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  If you continue to experience issues, please contact our support team.
                </p>
                <button
                  onClick={() => alert('Contact Support feature coming soon!')}
                  className="px-6 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-medium border border-zinc-700 transition-all"
                >
                  Contact Support
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EmailVerificationPage;