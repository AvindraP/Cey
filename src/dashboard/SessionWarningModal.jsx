import { useState, useEffect } from 'react';

/**
 * Optional modal to warn users before session expiry
 * @param {boolean} show - Whether to show the modal
 * @param {Function} onContinue - Callback to extend session
 * @param {Function} onLogout - Callback to logout
 * @param {number} timeLeft - Seconds remaining before auto-logout
 */
export default function SessionWarningModal({ show, onContinue, onLogout, timeLeft = 120 }) {
  const [seconds, setSeconds] = useState(timeLeft);

  useEffect(() => {
    if (!show) {
      setSeconds(timeLeft);
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [show, timeLeft]);

  if (!show) return null;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Session Expiring Soon
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Your session will expire in{' '}
              <span className="font-semibold text-amber-600">
                {minutes}:{remainingSeconds.toString().padStart(2, '0')}
              </span>
              {' '}due to inactivity. Would you like to continue?
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onContinue}
            className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Continue Session
          </button>
          <button
            onClick={onLogout}
            className="flex-1 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}