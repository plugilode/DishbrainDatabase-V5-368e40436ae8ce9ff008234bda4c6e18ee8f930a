import App from './src/app/App.jsx';
window.App = App;

document.addEventListener('DOMContentLoaded', function() {
    const registerPopup = document.getElementById('registerPopup');
    const registerBtn = document.querySelector('.register-btn');
    const closeBtns = document.querySelectorAll('.close-btn');
    const cancelBtn = document.querySelector('.cancel-btn');

    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            showModal(registerPopup);
        });
    }

    // Close button for modals
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            hideModal(modal);
        });
    });

    // Cancel button on registration form
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            hideModal(registerPopup);
        });
    }

    // Close modal if clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target);
        }
    });

    function showModal(modal) {
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
        }
    }

    function hideModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    function shakeElement(element) {
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    }
});

// Add shake animation style to document
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }

    .shake {
        animation: shake 0.5s;
    }

    .error {
        border-bottom-color: #ff4d4f !important;
    }
`;
document.head.append(style);

// Add animation styles to document
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    /* ...existing animation styles... */

    /* Login success animations */
    .login-success {
        animation: successPulse 0.5s forwards, fadeOutZoom 0.5s 1s forwards;
        box-shadow: 0 0 50px rgba(99, 102, 241, 0.4);
    }

    .login-success-left {
        animation: pulseGlow 1.5s ease-out;
    }

    .login-success-message {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        z-index: 5;
        opacity: 0;
        animation: fadeInScale 0.5s 0.5s forwards;
    }

    .login-success-message h3 {
        margin-bottom: 5px;
        color: white;
    }

    .login-success-message p {
        margin: 0;
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.8);
    }

    @keyframes successPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(99, 102, 241, 0.6); }
        100% { transform: scale(1); box-shadow: 0 0 50px rgba(99, 102, 241, 0.4); }
    }

    @keyframes fadeOutZoom {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.2); }
    }

    @keyframes fadeInScale {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.7); }
        100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }

    @keyframes pulseGlow {
        0% { box-shadow: inset 0 0 0px rgba(99, 102, 241, 0); }
        50% { box-shadow: inset 0 0 100px rgba(99, 102, 241, 0.3); }
        100% { box-shadow: inset 0 0 0px rgba(99, 102, 241, 0); }
    }

    /* Checkmark animation */
    .success-checkmark {
        width: 80px;
        height: 80px;
    }

    .checkmark {
        width: 80px;
        height: 80px;
    }

    .checkmark__circle {
        stroke-width: 2;
        stroke: #4ade80;
        fill: none;
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }

    .checkmark__check {
        stroke-width: 3;
        stroke: #4ade80;
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        animation: stroke 0.3s 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }

    @keyframes stroke {
        100% { stroke-dashoffset: 0; }
    }

    /* Page transition overlay */
    .transition-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--background);
        z-index: 1000;
        transform: translateY(100%);
        transition: transform 0.7s cubic-bezier(0.645, 0.045, 0.355, 1.000);
    }

    .transition-overlay.active {
        transform: translateY(0%);
    }
`;
document.head.append(animationStyles);
