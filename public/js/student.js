document.addEventListener('DOMContentLoaded', async () => {
  try {
    // ✅ 1. Verify role and fetch profile
    const profileRes = await fetch('/api/profiles/student', {
      credentials: 'include'
    });

    if (!profileRes.ok) throw new Error("Unauthorized");

    const user = await profileRes.json();
    document.getElementById('studentName').textContent = user.name;

    // ✅ 2. Fetch enrollments for this user
    const enrollRes = await fetch('/api/enrollments', {
      credentials: 'include'
    });

    const enrollments = await enrollRes.json();

    const list = document.getElementById('courseList');
    list.innerHTML = '';

    if (!enrollments.length) {
      list.innerHTML = '<li class="text-gray-500">You are not enrolled in any courses.</li>';
      return;
    }

    enrollments.forEach(e => {
      const li = document.createElement('li');
      li.className = 'bg-gray-50 border p-4 rounded';

      li.innerHTML = `
        <h3 class="text-lg font-bold">${e.courseId.title}</h3>
        <p class="text-sm text-gray-600">Instructor: ${e.courseId.instructor || 'N/A'} | Enrolled: ${new Date(e.enrolledAt).toLocaleDateString()}</p>
      `;

      list.appendChild(li);
    });

  } catch (err) {
    alert("Access denied. Please log in as a student.");
    window.location.href = '/login.html';
  }
});
