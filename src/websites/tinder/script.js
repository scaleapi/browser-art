const apiUrl = 'http://localhost:3000'; // JSON Server URL

// Registration
if (document.getElementById('register-form')) {
  const registerForm = document.getElementById('register-form');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();

    // Simple validation
    if (!email || !password) {
      alert('Please fill all fields.');
      return;
    }

    // Check if user already exists
    try {
      const res = await fetch(`${apiUrl}/users?email=${email}`);
      const users = await res.json();

      if (users.length > 0) {
        alert('User already exists.');
        return;
      }

      // Create new user
      await fetch(`${apiUrl}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, profileComplete: false }),
      });

      alert('Registration successful! Please login.');
      window.location.href = 'login.html';
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Something went wrong. Please try again later.');
    }
  });
}

// Login
if (document.getElementById('login-form')) {
  const loginForm = document.getElementById('login-form');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    try {
      // Authenticate user
      const res = await fetch(`${apiUrl}/users?email=${email}&password=${password}`);
      const users = await res.json();

      if (users.length === 0) {
        alert('Invalid email or password.');
        return;
      }

      const user = users[0];
      localStorage.setItem('userId', user.id);

      if (user.profileComplete) {
        window.location.href = 'swipe.html';
      } else {
        window.location.href = 'profile.html';
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Something went wrong. Please try again later.');
    }
  });
}
