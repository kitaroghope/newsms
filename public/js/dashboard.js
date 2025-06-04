document.addEventListener('DOMContentLoaded', async () => {
  const [users, courses, enrollments] = await Promise.all([
    fetch('/api/users').then(res => res.json()),
    fetch('/api/courses').then(res => res.json()),
    fetch('/api/enrollments').then(res => res.json())
  ]);

  document.getElementById('totalUsers').textContent = users.length;
  document.getElementById('totalCourses').textContent = courses.length;
  document.getElementById('totalEnrollments').textContent = enrollments.length;

  // Count enrollments per course
  const courseCounts = {};
  enrollments.forEach(enroll => {
    const title = enroll.courseId.title;
    courseCounts[title] = (courseCounts[title] || 0) + 1;
  });

  const list = document.getElementById('enrollStats');
  Object.entries(courseCounts).forEach(([title, count]) => {
    const li = document.createElement('li');
    li.className = 'border p-3 rounded bg-gray-50 flex justify-between';
    li.innerHTML = `<span>${title}</span><span class="font-semibold">${count}</span>`;
    list.appendChild(li);
  });
});
