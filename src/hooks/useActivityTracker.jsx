import { useEffect, useRef, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Activity-based session extension hook
 * @param {Object} user - Current user object
 * @param {Function} onTimeout - Callback when session times out
 * @param {Object} options - Configuration options
 * @param {number} options.sessionTimeout - Total session timeout in ms (default: 30 min)
 * @param {number} options.extendThreshold - Time between extension requests in ms (default: 5 min)
 * @param {number} options.warningTime - Time before timeout to trigger warning in ms (default: 2 min)
 */
export function useActivityTracker(user, onTimeout, options = {}) {
  const {
    sessionTimeout = 30 * 60 * 1000, // 30 minutes
    extendThreshold = 5 * 60 * 1000,  // 5 minutes
    warningTime = 2 * 60 * 1000,      // 2 minutes before timeout
  } = options;

  const lastActivityRef = useRef(Date.now());
  const sessionTimeoutRef = useRef(null);
  const warningTimeoutRef = useRef(null);
  const extendCooldownRef = useRef(false);
  const [showWarning, setShowWarning] = useState(false);

  // Reset session timeout
  const resetTimeout = () => {
    // Clear existing timers
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Hide warning if it's showing
    setShowWarning(false);

    // Set new timeout for automatic logout
    sessionTimeoutRef.current = setTimeout(() => {
      console.log('Session timed out due to inactivity');
      if (onTimeout) {
        onTimeout();
      }
    }, sessionTimeout);

    // Set warning timer
    warningTimeoutRef.current = setTimeout(() => {
      console.log('Session will expire soon');
      setShowWarning(true);
    }, sessionTimeout - warningTime);
  };

  // Extend session on backend
  const extendSession = async () => {
    // Prevent multiple simultaneous requests
    if (extendCooldownRef.current) {
      return;
    }

    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;

    // Only extend if enough time has passed since last extension
    if (timeSinceLastActivity < extendThreshold) {
      return;
    }

    try {
      extendCooldownRef.current = true;
      lastActivityRef.current = now;

      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Session extended successfully');
        resetTimeout();
      } else {
        console.error('Failed to extend session');
        // Session might be invalid, trigger timeout
        if (onTimeout) {
          onTimeout();
        }
      }
    } catch (err) {
      console.error('Error extending session:', err);
    } finally {
      // Reset cooldown after 1 minute
      setTimeout(() => {
        extendCooldownRef.current = false;
      }, 60 * 1000);
    }
  };

  useEffect(() => {
    if (!user) {
      // Clear all timers if user is not logged in
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      setShowWarning(false);
      return;
    }

    // Initialize timeout
    resetTimeout();

    // Activity event handler
    const handleActivity = () => {
      extendSession();
    };

    // Track these user activities
    const events = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ];

    // Throttle mousemove to avoid too many calls
    let mouseMoveTimeout;
    const throttledMouseMove = () => {
      if (!mouseMoveTimeout) {
        mouseMoveTimeout = setTimeout(() => {
          handleActivity();
          mouseMoveTimeout = null;
        }, 1000); // Throttle to once per second
      }
    };

    // Add event listeners
    events.forEach((event) => {
      if (event === 'mousemove') {
        window.addEventListener(event, throttledMouseMove, { passive: true });
      } else {
        window.addEventListener(event, handleActivity, { passive: true });
      }
    });

    // Cleanup
    return () => {
      events.forEach((event) => {
        if (event === 'mousemove') {
          window.removeEventListener(event, throttledMouseMove);
        } else {
          window.removeEventListener(event, handleActivity);
        }
      });

      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (mouseMoveTimeout) {
        clearTimeout(mouseMoveTimeout);
      }
    };
  }, [user, sessionTimeout, extendThreshold, warningTime]);

  return {
    showWarning,
    extendSession: () => {
      lastActivityRef.current = 0; // Force immediate extension
      extendSession();
    },
    resetTimeout,
  };
}