document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            registerMessage.textContent = ''; // Clear previous messages

            try {
                const response = await fetch('http://127.0.0.1:5000/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    registerMessage.textContent = data.message;
                    registerMessage.style.color = 'green';
                    registerForm.reset(); // Clear the form
                    // Redirect to login page after successful registration
                    setTimeout(() => { window.location.href = 'login.html'; }, 1000);
                } else {
                    registerMessage.textContent = data.error || 'Registration failed';
                    registerMessage.style.color = 'red';
                }
            } catch (error) {
                console.error('Error during registration:', error);
                registerMessage.textContent = 'An error occurred. Please try again.';
                registerMessage.style.color = 'red';
            }
        });
    }
}); 