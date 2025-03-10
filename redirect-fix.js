/**
 * This script ensures that the redirect to the dashboard works correctly
 * by adjusting the redirect URL based on the server environment
 */
document.addEventListener('DOMContentLoaded', function() {
    // Update the login handler to use the correct redirect path
    const originalLoginFunction = window.handleLogin;
    
    if (typeof originalLoginFunction === 'function') {
        window.handleLogin = function(e) {
            // Capture all the original arguments
            const args = arguments;
            
            // Override the redirect behavior
            const redirectOverride = function(user) {
                // Store user info in localStorage for the dashboard
                localStorage.setItem('dishbrain_user', JSON.stringify({
                    username: user.username,
                    fullName: user.fullName,
                    role: user.role,
                    lastLogin: new Date().toISOString()
                }));
                
                // Determine correct path to dashboard based on current URL
                let dashboardPath;
                const currentPath = window.location.pathname;
                
                if (currentPath.includes('/login/')) {
                    // If we're in a /login/ subdirectory
                    dashboardPath = '../index.html';
                } else if (currentPath.endsWith('/login')) {
                    // If we're in just /login
                    dashboardPath = './index.html';
                } else {
                    // Default fallback
                    dashboardPath = '/index.html';
                }
                
                // Log the redirect for debugging
                console.log('Redirecting to dashboard at:', dashboardPath);
                
                // Create and show transition effect
                showLoginSuccessAnimation(user, dashboardPath);
            };
            
            // Call the original function but capture its return value
            const originalResult = originalLoginFunction.apply(this, args);
            
            // If we have a user, perform our redirect override
            if (originalResult && originalResult.user) {
                redirectOverride(originalResult.user);
                return { ...originalResult, redirected: true };
            }
            
            return originalResult;
        };
    }
    
    function showLoginSuccessAnimation(user, redirectPath) {
        // Add animation code here that works even if the main script fails
        const loginContainer = document.querySelector('.login-container');
        if (!loginContainer) return;
        
        // Create success message if it doesn't exist
        let successMsg = document.querySelector('.login-success-message');
        if (!successMsg) {
            successMsg = document.createElement('div');
            successMsg.className = 'login-success-message';
            successMsg.innerHTML = `
                <div class="success-checkmark">
                    <svg width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="27" cy="27" r="25" fill="none" stroke="#4ade80" stroke-width="2" />
                        <path class="checkmark__check" fill="none" stroke="#4ade80" stroke-width="3" d="M15 27l8 8 16-16" />
                    </svg>
                </div>
                <h3>Welcome, ${user.fullName || user.username}</h3>
                <p>Redirecting to dashboard...</p>
            `;
            loginContainer.appendChild(successMsg);
        }
        
        // Create overlay for page transition
        let overlay = document.querySelector('.transition-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'transition-overlay';
            document.body.appendChild(overlay);
        }
        
        // Add basic animation styles if they don't exist
        const hasStyles = document.querySelector('#redirect-animation-styles');
        if (!hasStyles) {
            const style = document.createElement('style');
            style.id = 'redirect-animation-styles';
            style.textContent = `
                .transition-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: #0f172a;
                    z-index: 9999;
                    transform: translateY(100%);
                    transition: transform 0.7s cubic-bezier(0.19, 1, 0.22, 1);
                }
                .transition-overlay.active {
                    transform: translateY(0%);
                }
            `;
            document.head.appendChild(style);
        }
        
        // Animate and redirect
        setTimeout(() => {
            overlay.classList.add('active');
            setTimeout(() => {
                window.location.href = redirectPath;
            }, 700);
        }, 1000);
    }
});
