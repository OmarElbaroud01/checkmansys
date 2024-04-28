document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    // Example validation (replace with your actual user validation logic)
    const users = [
      { username: "Omar", password: "om97", role: "admin" },
      { username: "Rachid", password: "admin", role: "admin" },
      { username: "Rabie", password: "admin", role: "admin" },
      { username: "Anissa", password: "user", role: "user" },
      { username: "Oumama", password: "user", role: "user" },
      { username: "Nisrine", password: "user", role: "user" },
      { username: "Arabi", password: "user", role: "user" },
    ];

    const user = users.find(
      (u) =>
        u.username === username && u.password === password && u.role === role
    );
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      alert("Login successful!");
      window.location.href = "index.html"; // Redirect to index.html regardless of the user role
    } else {
      alert("Invalid credentials or role!");
    }
  });
