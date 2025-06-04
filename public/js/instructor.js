let instructor = null;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Authenticate instructor via role-based profile
    const res = await fetch('/api/profiles/instructor', {
      credentials: 'include'
    });
    console.log(res.ok)

    if (!res.ok) throw new Error("Unauthorized");
    instructor = await res.json();

    document.getElementById('instructorName').textContent = instructor.name;
    loadCourses();
  } catch (err) {
    alert("Access denied. Please log in as an instructor.");
    window.location.href = "/login.html";
  }
});

async function loadCourses() {
  const res = await fetch('/api/courses', { credentials: 'include' });
  const allCourses = await res.json();

  const myCourses = allCourses.filter(c => c.instructor === instructor.name);

  const list = document.getElementById('courseList');
  list.innerHTML = myCourses.map(course => `
    <li class="p-4 bg-gray-50 border rounded flex justify-between items-center">
      <div>
        <p class="font-bold">${course.title}</p>
        <p class="text-sm text-gray-600">${course.category} – ${course.level}</p>
      </div>
      <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        onclick="deleteCourse('${course._id}')">Delete</button>
    </li>
  `).join('');
}

document.getElementById('courseForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const course = {
    title: document.getElementById('title').value,
    category: document.getElementById('category').value,
    level: document.getElementById('level').value,
    duration: document.getElementById('duration').value,
    description: document.getElementById('description').value,
    instructor: instructor.name
  };

  const res = await fetch('/api/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(course)
  });

  if (res.ok) {
    document.getElementById('courseForm').reset();
    loadCourses();
  }
});

async function deleteCourse(id) {
  const res = await fetch(`/api/courses/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (res.ok) loadCourses();
}
