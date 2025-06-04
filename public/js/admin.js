let currentUserEmail = "";
let currentCourseId = "";

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const profileRes = await fetch('/api/profiles/admin', { credentials: 'include' });
    if (!profileRes.ok) throw new Error('Unauthorized');
    await loadStats();
    await loadUsers();
    await loadCourses();
  } catch (err) {
    alert("Access denied. Please log in as an admin.");
    window.location.href = '/login.html';
  }
});

async function loadStats() {
  const [usersRes, coursesRes, enrollRes] = await Promise.all([
    fetch('/api/users', { credentials: 'include' }),
    fetch('/api/courses', { credentials: 'include' }),
    fetch('/api/enrollments', { credentials: 'include' })
  ]);
  document.getElementById('userCount').textContent = (await usersRes.json()).length;
  document.getElementById('courseCount').textContent = (await coursesRes.json()).length;
  document.getElementById('enrollmentCount').textContent = (await enrollRes.json()).length;
}

async function loadUsers() {
  const res = await fetch('/api/users', { credentials: 'include' });
  const users = await res.json();
  document.getElementById('userList').innerHTML = users.map(user => `
    <li class="border p-3 rounded bg-gray-50 flex justify-between">
      <span>${user.name} – ${user.email} (${user.role})</span>
      <div>
        <button onclick="editUser('${user.email}', '${user.role}')" class="text-blue-600 mr-2">Edit</button>
        <button onclick="deleteUser('${user.email}')" class="text-red-600">Delete</button>
      </div>
    </li>
  `).join('');
}

async function loadCourses() {
  const res = await fetch('/api/courses', { credentials: 'include' });
  const courses = await res.json();
  document.getElementById('courseList').innerHTML = courses.map(course => `
    <li class="border p-3 rounded bg-gray-50 flex justify-between">
      <span>${course.title} – ${course.instructor} (${course.category})</span>
      <div>
        <button onclick="editCourse('${course._id}', '${course.title}', '${course.category}', '${course.instructor}')" class="text-green-600 mr-2">Edit</button>
        <button onclick="deleteCourse('${course._id}')" class="text-red-600">Delete</button>
      </div>
    </li>
  `).join('');
}

function showNotification(msg, isError = false) {
  const note = document.getElementById('notification');
  note.className = `fixed top-4 right-4 px-4 py-2 rounded shadow ${isError ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`;
  note.textContent = msg;
  note.classList.remove('hidden');
  setTimeout(() => note.classList.add('hidden'), 3000);
}

// User Modals
function editUser(email, role) {
  currentUserEmail = email;
  document.getElementById('userEmail').value = email;
  document.getElementById('userRole').value = role;
  document.getElementById('userModal').classList.remove('hidden');
}
function closeUserModal() {
  document.getElementById('userModal').classList.add('hidden');
}
async function saveUser() {
  const role = document.getElementById('userRole').value;
  const res = await fetch(`/api/users/${currentUserEmail}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ role })
  });
  closeUserModal();
  if (res.ok) {
    showNotification('User updated');
    loadUsers();
  } else {
    showNotification('Failed to update user', true);
  }
}
async function deleteUser(email) {
  const res = await fetch(`/api/users/${email}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (res.ok) {
    showNotification('User deleted');
    loadUsers();
  } else {
    showNotification('Failed to delete user', true);
  }
}

// Course Modals
function editCourse(id, title, category, instructor) {
  currentCourseId = id;
  document.getElementById('courseId').value = id;
  document.getElementById('courseTitle').value = title;
  document.getElementById('courseCategory').value = category;
  document.getElementById('courseInstructor').value = instructor;
  document.getElementById('courseModal').classList.remove('hidden');
}
function closeCourseModal() {
  document.getElementById('courseModal').classList.add('hidden');
}
async function saveCourse() {
  const course = {
    title: document.getElementById('courseTitle').value,
    category: document.getElementById('courseCategory').value,
    instructor: document.getElementById('courseInstructor').value
  };
  const res = await fetch(`/api/courses/${currentCourseId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(course)
  });
  closeCourseModal();
  if (res.ok) {
    showNotification('Course updated');
    loadCourses();
  } else {
    showNotification('Failed to update course', true);
  }
}
async function deleteCourse(id) {
  const res = await fetch(`/api/courses/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (res.ok) {
    showNotification('Course deleted');
    loadCourses();
  } else {
    showNotification('Failed to delete course', true);
  }
}
