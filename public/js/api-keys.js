const token =
  localStorage.getItem("token");

if (!token) {
  window.location.href = "/login";
}

const apiKeyTable =
  document.getElementById("apiKeyTable");

const apiKeyModal =
  document.getElementById("apiKeyModal");

const apiKeyForm =
  document.getElementById("apiKeyForm");

const formAlert =
  document.getElementById("formAlert");

let apiKeys = [];

const handleUnauthorized = (response) => {
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";

    return true;
  }

  return false;
};

const loadApiKeys = async () => {
  try {
    const response = await fetch(
      "/api/keys",
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    if (
      handleUnauthorized(response)
    ) {
      return;
    }

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message
      );
    }

    apiKeys =
      result.data || [];

    renderApiKeys();

  } catch (error) {
    apiKeyTable.innerHTML = `
      <tr>
        <td colspan="6">
          Gagal mengambil API Key.
        </td>
      </tr>
    `;
  }
};

const renderApiKeys = () => {
  if (!apiKeys.length) {
    apiKeyTable.innerHTML = `
      <tr>
        <td colspan="6">
          Belum ada API Key.
        </td>
      </tr>
    `;

    return;
  }

  apiKeyTable.innerHTML =
    apiKeys
      .map((item) => {
        const status =
          item.is_active
            ? `
              <span class="status-active">
                Active
              </span>
            `
            : `
              <span class="status-inactive">
                Inactive
              </span>
            `;

        const createdAt =
          new Date(
            item.created_at ||
            item.createdAt
          ).toLocaleString(
            "id-ID"
          );

        return `
          <tr>
            <td>
              ${item.id}
            </td>

            <td>
              <strong>
                ${item.name}
              </strong>
            </td>

            <td>
              <span
                class="api-key-value"
                title="${item.key}"
              >
                ${item.key}
              </span>
            </td>

            <td>
              ${status}
            </td>

            <td>
              ${createdAt}
            </td>

            <td>
              <div class="action-buttons">

                <button
                  class="btn-copy"
                  onclick="copyApiKey('${item.key}')"
                >
                  Copy
                </button>

                <button
                  class="btn-delete"
                  onclick="deleteApiKey(${item.id})"
                >
                  Hapus
                </button>

              </div>
            </td>
          </tr>
        `;
      })
      .join("");
};

const openModal = () => {
  apiKeyModal.classList.add(
    "show"
  );
};

const closeModal = () => {
  apiKeyModal.classList.remove(
    "show"
  );
};

document.getElementById(
  "openCreateButton"
).addEventListener(
  "click",
  () => {
    apiKeyForm.reset();

    formAlert.className =
      "alert";

    formAlert.textContent =
      "";

    openModal();
  }
);

document.getElementById(
  "closeModalButton"
).addEventListener(
  "click",
  closeModal
);

apiKeyForm.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();

    const name =
      document.getElementById(
        "apiKeyName"
      ).value;

    try {
      const response = await fetch(
        "/api/keys",
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              name,
            }),
        }
      );

      if (
        handleUnauthorized(
          response
        )
      ) {
        return;
      }

      const result =
        await response.json();

      if (!response.ok) {
        formAlert.className =
          "alert alert-error";

        formAlert.textContent =
          result.message ||
          "Gagal membuat API Key.";

        return;
      }

      formAlert.className =
        "alert alert-success";

      formAlert.textContent =
        "API Key berhasil dibuat.";

      await loadApiKeys();

      setTimeout(
        closeModal,
        500
      );

    } catch (error) {
      formAlert.className =
        "alert alert-error";

      formAlert.textContent =
        "Terjadi kesalahan.";
    }
  }
);

window.copyApiKey =
  async (key) => {
    try {
      await navigator.clipboard.writeText(
        key
      );

      alert(
        "API Key berhasil dicopy."
      );

    } catch (error) {
      alert(
        "Gagal menyalin API Key."
      );
    }
  };

window.deleteApiKey =
  async (id) => {
    const apiKey =
      apiKeys.find(
        (item) =>
          item.id === id
      );

    if (!apiKey) {
      return;
    }

    const confirmed =
      confirm(
        `Yakin ingin menghapus API Key "${apiKey.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/keys/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (
        handleUnauthorized(
          response
        )
      ) {
        return;
      }

      const result =
        await response.json();

      if (!response.ok) {
        alert(
          result.message ||
          "Gagal menghapus API Key."
        );

        return;
      }

      await loadApiKeys();

    } catch (error) {
      alert(
        "Terjadi kesalahan."
      );
    }
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

loadApiKeys();