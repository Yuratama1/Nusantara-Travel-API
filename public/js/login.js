const loginForm =
  document.getElementById("loginForm");

const loginButton =
  document.getElementById("loginButton");

const alertBox =
  document.getElementById("alert");

loginForm.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();

    const email =
      document.getElementById("email").value;

    const password =
      document.getElementById("password").value;

    alertBox.className = "alert";
    alertBox.textContent = "";

    loginButton.disabled = true;
    loginButton.textContent = "Loading...";

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        alertBox.className =
          "alert alert-error";

        alertBox.textContent =
          result.message ||
          "Login gagal.";

        return;
      }

      localStorage.setItem(
        "token",
        result.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(result.user)
      );

      alertBox.className =
        "alert alert-success";

      alertBox.textContent =
        "Login berhasil.";

      window.location.href =
        "/dashboard";

    } catch (error) {
      alertBox.className =
        "alert alert-error";

      alertBox.textContent =
        "Terjadi kesalahan saat login.";

    } finally {
      loginButton.disabled = false;
      loginButton.textContent = "Login";
    }
  }
);