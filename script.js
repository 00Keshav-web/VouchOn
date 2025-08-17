
<script type="module">
  import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

  onAuthStateChanged(auth, (user) => {
    const authSpan = document.getElementById("user-auth");
    const signupBtn = document.getElementById("signup-link");

    if (user) {
      authSpan.innerHTML = `<a href="profile.html" class="nav-link">Profile 👤</a>`;
      if (signupBtn) signupBtn.style.display = 'none';
    } else {
      authSpan.innerHTML = `<a href="login.html" class="nav-link">Login 🔐</a>`;
      if (signupBtn) signupBtn.style.display = 'inline-block';
    }
  });
</script>



// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
  // Firebase auth check
  firebase.auth().onAuthStateChanged(user => {
    const authSpan = document.getElementById("user-auth");
    if (authSpan) {
      if (user) {
        authSpan.innerHTML = `<a href="profile.html" class="nav-link">Profile 👤</a>`;
      } else {
        authSpan.innerHTML = `<a href="login.html" class="nav-link">Login 🔐</a>`;
      }
    }
  });
});
