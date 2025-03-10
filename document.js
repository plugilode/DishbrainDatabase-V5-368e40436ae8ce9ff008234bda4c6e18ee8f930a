document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerBtn = document.querySelector('.register-btn');

    async function loadUsers() {
        try {
            const response = await fetch('users.json');
            return await response.json();
        } catch (error) {
            console.error('Error loading users:', error);
            return { users: [] };
        }
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const userData = await loadUsers();
        const user = userData.users.find(u => 
            u.username === username && u.password === password
        );

        if (user) {
            alert('Access granted! Welcome to Dishbrain AI Database System');
        } else {
            alert('Access denied! Invalid credentials');
        }
    });

    registerBtn.addEventListener('click', () => {
        alert('Registration system coming soon...');
    });
});
