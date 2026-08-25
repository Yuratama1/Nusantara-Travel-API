const token =
  localStorage.getItem("token");

const user =
  JSON.parse(
    localStorage.getItem("user")
  );

if (!token) {
  window.location.href = "/login";
}

if (user) {
  document.getElementById(
    "userName"
  ).textContent = user.name;
}

const loadDashboard = async () => {
  try {
    const response = await fetch(
      "/api/admin/dashboard",
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    const result =
      await response.json();

    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href =
        "/login";

      return;
    }

    if (!response.ok) {
      throw new Error(
        result.message ||
        "Gagal mengambil dashboard."
      );
    }

    const data = result.data;

    document.getElementById(
      "totalDestinations"
    ).textContent =
      data.totalDestinations;

    document.getElementById(
      "totalCategories"
    ).textContent =
      data.totalCategories;

    document.getElementById(
      "totalApiKeys"
    ).textContent =
      data.totalApiKeys;

    document.getElementById(
      "totalApiRequests"
    ).textContent =
      data.totalApiRequests;

    renderUsage(
      data.recentUsage
    );

  } catch (error) {
    console.error(
      "Dashboard error:",
      error
    );
  }
};

const renderUsage = (usage) => {
  const table =
    document.getElementById(
      "usageTable"
    );

  if (!usage.length) {
    table.innerHTML = `
      <tr>
        <td colspan="5">
          Belum ada API usage.
        </td>
      </tr>
    `;

    return;
  }

  table.innerHTML =
    usage
      .map((item) => {
        const statusClass =
          item.status_code >= 200 &&
          item.status_code < 400
            ? "status-success"
            : "status-error";

        const apiKeyName =
          item.ApiKey
            ? item.ApiKey.name
            : "-";

        const date =
          new Date(
            item.requested_at
          ).toLocaleString(
            "id-ID"
          );

        return `
          <tr>
            <td>
              ${apiKeyName}
            </td>

            <td>
              ${item.endpoint}
            </td>

            <td>
              ${item.method}
            </td>

            <td
              class="${statusClass}"
            >
              ${item.status_code}
            </td>

            <td>
              ${date}
            </td>
          </tr>
        `;
      })
      .join("");
};

document.getElementById(
  "logoutButton"
).addEventListener(
  "click",
  () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    window.location.href =
      "/login";
  }
);

loadDashboard();
