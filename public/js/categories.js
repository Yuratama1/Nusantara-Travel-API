const token =
  localStorage.getItem("token");

if (!token) {
  window.location.href = "/login";
}

const categoryTable =
  document.getElementById(
    "categoryTable"
  );

const categoryModal =
  document.getElementById(
    "categoryModal"
  );

const categoryForm =
  document.getElementById(
    "categoryForm"
  );

const formAlert =
  document.getElementById(
    "formAlert"
  );

let categories = [];

const handleUnauthorized = (
  response
) => {
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href =
      "/login";

    return true;
  }

  return false;
};

const getActiveApiKey = async () => {
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
    return null;
  }

  const result =
    await response.json();

  if (!response.ok) {
    return null;
  }

  return (
    result.data.find(
      (item) => item.is_active
    ) || null
  );
};

const loadCategories = async () => {
  try {
    const apiKey =
      await getActiveApiKey();

    if (!apiKey) {
      categoryTable.innerHTML = `
        <tr>
          <td colspan="5">
            Tidak ada API Key aktif.
          </td>
        </tr>
      `;

      return;
    }

    const response = await fetch(
      "/api/v1/categories",
      {
        headers: {
          "x-api-key":
            apiKey.key,
        },
      }
    );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.message
      );
    }

    categories =
      result.data || [];

    renderCategories();

  } catch (error) {
    categoryTable.innerHTML = `
      <tr>
        <td colspan="5">
          Gagal mengambil data category.
        </td>
      </tr>
    `;
  }
};

const renderCategories = () => {
  if (!categories.length) {
    categoryTable.innerHTML = `
      <tr>
        <td colspan="5">
          Data category kosong.
        </td>
      </tr>
    `;

    return;
  }

  categoryTable.innerHTML =
    categories
      .map((category) => {
        const totalDestinations =
          Array.isArray(
            category.Destinations
          )
            ? category.Destinations.length
            : 0;

        return `
          <tr>
            <td>
              ${category.id}
            </td>

            <td>
              <strong>
                ${category.name}
              </strong>
            </td>

            <td class="description-cell">
              ${category.description || "-"}
            </td>

            <td>
              ${totalDestinations}
            </td>

            <td>
              <div class="action-buttons">

                <button
                  class="btn-edit"
                  onclick="editCategory(${category.id})"
                >
                  Edit
                </button>

                <button
                  class="btn-delete"
                  onclick="deleteCategory(${category.id})"
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
  categoryModal.classList.add(
    "show"
  );
};

const closeModal = () => {
  categoryModal.classList.remove(
    "show"
  );
};

const resetForm = () => {
  categoryForm.reset();

  document.getElementById(
    "categoryId"
  ).value = "";

  document.getElementById(
    "modalTitle"
  ).textContent =
    "Tambah Category";

  formAlert.className = "alert";
  formAlert.textContent = "";
};

document.getElementById(
  "openCreateButton"
).addEventListener(
  "click",
  () => {
    resetForm();
    openModal();
  }
);

document.getElementById(
  "closeModalButton"
).addEventListener(
  "click",
  closeModal
);

window.editCategory = (
  id
) => {
  const category =
    categories.find(
      (item) =>
        item.id === id
    );

  if (!category) {
    return;
  }

  document.getElementById(
    "modalTitle"
  ).textContent =
    "Edit Category";

  document.getElementById(
    "categoryId"
  ).value =
    category.id;

  document.getElementById(
    "name"
  ).value =
    category.name || "";

  document.getElementById(
    "description"
  ).value =
    category.description || "";

  formAlert.className = "alert";
  formAlert.textContent = "";

  openModal();
};

categoryForm.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();

    const id =
      document.getElementById(
        "categoryId"
      ).value;

    const payload = {
      name:
        document.getElementById(
          "name"
        ).value,

      description:
        document.getElementById(
          "description"
        ).value,
    };

    const url = id
      ? `/api/admin/categories/${id}`
      : "/api/admin/categories";

    const method = id
      ? "PUT"
      : "POST";

    try {
      const response = await fetch(
        url,
        {
          method,

          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(
              payload
            ),
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
          "Gagal menyimpan category.";

        return;
      }

      formAlert.className =
        "alert alert-success";

      formAlert.textContent =
        result.message;

      await loadCategories();

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

window.deleteCategory =
  async (id) => {
    const category =
      categories.find(
        (item) =>
          item.id === id
      );

    if (!category) {
      return;
    }

    const confirmed =
      confirm(
        `Yakin ingin menghapus category "${category.name}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/categories/${id}`,
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
          "Gagal menghapus category."
        );

        return;
      }

      alert(
        result.message
      );

      await loadCategories();

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

loadCategories();