let allEnrollments = [];

document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  loadCourses();
  loadEnrollments();

  document.getElementById('filterUser').addEventListener('change', applyFilters);
  document.getElementById('filterCourse').addEventListener('change', applyFilters);
});

async function loadUsers() {
  const res = await fetch('/api/users');
  const users = await res.json();

  const userSelect = document.getElementById('userSelect');
  const filterUser = document.getElementById('filterUser');
  userSelect.innerHTML = users.map(u => `<option value="${u._id}">${u.name} (${u.email})</option>`).join('');
  filterUser.innerHTML += users.map(u => `<option value="${u._id}">${u.name}</option>`).join('');
}

async function loadCourses() {
  const res = await fetch('/api/courses');
  const courses = await res.json();

  const courseSelect = document.getElementById('courseSelect');
  const filterCourse = document.getElementById('filterCourse');
  courseSelect.innerHTML = courses.map(c => `<option value="${c._id}">${c.title}</option>`).join('');
  filterCourse.innerHTML += courses.map(c => `<option value="${c._id}">${c.title}</option>`).join('');
}

async function loadEnrollments() {
  const res = await fetch('/api/enrollments');
  allEnrollments = await res.json();
  applyFilters();
}

function applyFilters() {
  const userId = document.getElementById('filterUser').value;
  const courseId = document.getElementById('filterCourse').value;

  let filtered = allEnrollments;

  if (userId) {
    filtered = filtered.filter(e => e.userId._id === userId);
  }

  if (courseId) {
    filtered = filtered.filter(e => e.courseId._id === courseId);
  }

  displayEnrollments(filtered);
}

function displayEnrollments(enrollments) {
  const list = document.getElementById('enrollmentsList');
  list.innerHTML = '';

  enrollments.forEach(enroll => {
    const li = document.createElement('li');
    li.className = 'bg-gray-50 border p-3 rounded flex justify-between items-center';

    li.innerHTML = `
      <div>
        <p><strong>${enroll.userId.name}</strong> enrolled in <strong>${enroll.courseId.title}</strong></p>
        <p class="text-xs text-gray-500">${new Date(enroll.enrolledAt).toLocaleString()}</p>
      </div>
      <button onclick="deleteEnrollment('${enroll._id}')" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
    `;

    list.appendChild(li);
  });
}

async function deleteEnrollment(id) {
  const res = await fetch(`/api/enrollments/${id}`, { method: 'DELETE' });
  if (res.ok) loadEnrollments();
}
