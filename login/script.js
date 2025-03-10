// Sample user database
const users = [
    {
        username: "pblanks",
        password: "Patrick82",
        fullName: "Patrick Blanks",
        role: "admin"
    },
    {
        username: "jsmith",
        password: "demo123",
        fullName: "John Smith",
        role: "user"
    },
    {
        username: "acooper",
        password: "test456",
        fullName: "Alice Cooper",
        role: "user"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const registerModal = document.getElementById('registerModal');
    const successModal = document.getElementById('successModal');
    const registerBtn = document.querySelector('.register-btn');
    const closeBtns = document.querySelectorAll('.close-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const okBtn = document.querySelector('.ok-btn');
    
    // Event Listeners
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegistration);
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            showModal(registerModal);
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
            hideModal(registerModal);
        });
    }
    
    // OK button on success modal
    if (okBtn) {
        okBtn.addEventListener('click', function() {
            hideModal(successModal);
        });
    }
    
    // Close modal if clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target);
        }
    });
    
    // Handle form inputs for floating labels
    const inputs = document.querySelectorAll('.input-group input');
    inputs.forEach(input => {
        // Set placeholder to space to ensure label floats when there's content
        input.setAttribute('placeholder', ' ');
        
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Functions
    function handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Check if the user exists
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Successful login
            console.log('Login successful:', user);
            
            // Show success animation
            const loginContainer = document.querySelector('.login-container');
            const leftSide = document.querySelector('.left-side');
            
            // Store user info in sessionStorage
            sessionStorage.setItem('currentUser', JSON.stringify({
                username: user.username,
                fullName: user.fullName,
                role: user.role
            }));
            
            // Add success class to form
            loginForm.classList.add('success');
            
            // Animate login container
            loginContainer.classList.add('login-success');
            
            // Animate left side
            leftSide.classList.add('login-success-left');
            
            // Create and show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'login-success-message';
            successMsg.innerHTML = `
                <div class="success-checkmark">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52" class="checkmark">
                        <circle cx="26" cy="26" r="25" fill="none" class="checkmark__circle"/>
                        <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" class="checkmark__check"/>
                    </svg>
                </div>
                <h3>Welcome, ${user.fullName}</h3>
                <p>Redirecting to dashboard...</p>
            `;
            loginContainer.appendChild(successMsg);
            
            // Add transition overlay to the whole page
            const transitionOverlay = document.createElement('div');
            transitionOverlay.className = 'transition-overlay';
            document.body.appendChild(transitionOverlay);
            
            // Animate the transition overlay
            setTimeout(() => {
                transitionOverlay.classList.add('active');
            }, 1500);
            
            // Redirect to dashboard after animation completes
            setTimeout(() => {
                window.location.href = '../src/app/App.jsx';
            }, 2200);
        } else {
            // Failed login
            console.log('Login failed');
            shakeElement(loginForm);
            document.getElementById('username').classList.add('error');
            document.getElementById('password').classList.add('error');
            
            // Remove error styling after a delay
            setTimeout(() => {
                document.getElementById('username').classList.remove('error');
                document.getElementById('password').classList.remove('error');
            }, 1000);
        }
    }
    
    function handleRegistration(e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const fullName = document.getElementById('regFullName').value;
        const company = document.getElementById('regCompany').value;
        
        // Simulate sending data
        console.log('Registration request:', {
            username,
            password,
            fullName,
            company,
            dateRequested: new Date().toISOString()
        });
        
        // Simulate email being sent
        emailAdmin({
            to: "patrick.blanks@plugilo.com",
            subject: "New Dishbrain Access Request",
            body: `
                New user registration request:
                
                Username: ${username}
                Full Name: ${fullName}
                Company: ${company || 'Not provided'}
                Date Requested: ${new Date().toLocaleString()}
                
                Please log in to the admin panel to approve or reject this request.
            `
        });
        
        // Hide registration modal and show success
        hideModal(registerModal);
        showModal(successModal);
        
        // Reset form
        registerForm.reset();
    }
    
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
    
    function emailAdmin(emailData) {
        // This is a simulation of sending an email
        console.log(`Email would be sent to: ${emailData.to}`);
        console.log(`Subject: ${emailData.subject}`);
        console.log(`Body: ${emailData.body}`);
        
        // In a real application, this would connect to a server-side API
        // that handles the actual email sending
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
        margin: 0 auto 20px;
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
