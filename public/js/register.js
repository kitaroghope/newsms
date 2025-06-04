document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const response = await fetch("/api/users/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
//   alert("Registration successful!");

  const result = await response.json();
  const messageDiv = document.getElementById("message");

  if (response.ok) {
    messageDiv.textContent = result.message;
    messageDiv.className = "text-green-600";
  } else {
    messageDiv.textContent = result.message || "Registration failed";
    messageDiv.className = "text-red-600";
  }
});
