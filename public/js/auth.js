document.getElementById('toggleForm').addEventListener('click', () => {
  document.getElementById('loginForm').classList.toggle('hidden');
  document.getElementById('registerForm').classList.toggle('hidden');

  const toggle = document.getElementById('toggleForm');
  toggle.textContent = toggle.textContent.includes('Register')
    ? 'Already have an account? Login'
    : "Don't have an account? Register";
});

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const res = await fetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // send cookie
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.ok) {
    redirectToDashboard(data.user.role);
  } else {
    alert(data.message || 'Login failed');
  }
});

// Register
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = {
    name: document.getElementById('registerName').value,
    email: document.getElementById('registerEmail').value,
    password: document.getElementById('registerPassword').value,
    role: document.getElementById('registerRole').value
  };

  const res = await fetch('/api/users/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(user)
  });

  const data = await res.json();

  if (res.ok) {
    redirectToDashboard(data.user.role);
  } else {
    alert(data.message || 'Registration failed');
  }
});

function redirectToDashboard(role) {
  switch (role) {
    case 'student':
      window.location.href = '/pages/student.html';
      break;
    case 'instructor':
      window.location.href = '/pages/instructor.html';
      break;
    case 'admin':
      window.location.href = '/pages/admin.html';
      break;
    default:
      window.location.href = '/';
  }
}
