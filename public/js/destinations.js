const token =
  localStorage.getItem("token");

if (!token) {
  window.location.href = "/login";
}

const destinationTable =
  document.getElementById(
    "destinationTable"
  );

const modal =
  document.getElementById(
    "destinationModal"
  );

const destinationForm =
  document.getElementById(
    "destinationForm"
  );

const formAlert =
  document.getElementById(
    "formAlert"
  );

const categorySelect =
  document.getElementById(
    "categoryId"
  );

let destinations = [];

const authHeaders = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

const handleUnauthorized = (
  response
) => {
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";

    return true;
  }

  return false;
};

const loadCategories = async () => {
  const apiKeysResponse =
    await fetch(
      "/api/keys",
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  if (
    handleUnauthorized(
      apiKeysResponse
    )
  ) {
    return;
  }

  const keysResult =
    await apiKeysResponse.json();

  if (
    !apiKeysResponse.ok ||
    !keysResult.data.length
  ) {
    categorySelect.innerHTML = `
      <option value="">
        API Key diperlukan
      </option>
    `;

    return;
  }

  const apiKey =
    keysResult.data.find(
      (item) => item.is_active
    );

  if (!apiKey) {
    return;
  }

  const response = await fetch(
    "/api/v1/categories",
    {
      headers: {
        "x-api-key": apiKey.key,
      },
    }
  );

  const result =
    await response.json();

  categorySelect.innerHTML = `
    <option value="">
      Pilih Kategori
    </option>
  `;

  result.data.forEach(
    (category) => {
      categorySelect.innerHTML += `
        <option value="${category.id}">
          ${category.name}
        </option>
      `;
    }
  );
};

const loadDestinations = async () => {
  try {
    const apiKeysResponse =
      await fetch(
        "/api/keys",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    if (
      handleUnauthorized(
        apiKeysResponse
      )
    ) {
      return;
    }

    const keysResult =
      await apiKeysResponse.json();

    const apiKey =
      keysResult.data.find(
        (item) => item.is_active
      );

    if (!apiKey) {
      destinationTable.innerHTML = `
        <tr>
          <td colspan="8">
            Tidak ada API Key aktif.
          </td>
        </tr>
      `;

      return;
    }

    const response = await fetch(
      "/api/v1/destinations?page=1&limit=100",
      {
        headers: {
          "x-api-key": apiKey.key,
        },
      }
    );

    const result =
      await response.json();

    destinations =
      result.data || [];

    renderDestinations();

  } catch (error) {
    destinationTable.innerHTML = `
      <tr>
        <td colspan="8">
          Gagal mengambil data.
        </td>
      </tr>
    `;
  }
};

const renderDestinations = () => {
  if (!destinations.length) {
    destinationTable.innerHTML = `
      <tr>
        <td colspan="8">
          Data destination kosong.
        </td>
      </tr>
    `;

    return;
  }

  destinationTable.innerHTML =
    destinations
      .map((item) => {
        const category =
          item.Category
            ? item.Category.name
            : "-";

        return `
          <tr>
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${category}</td>
            <td>${item.city}</td>
            <td>${item.province}</td>
            <td>${item.rating ?? "-"}</td>
            <td>
              Rp ${Number(
                item.ticket_price || 0
              ).toLocaleString("id-ID")}
            </td>

            <td>
              <div class="action-buttons">
                <button
                  class="btn-edit"
                  onclick="editDestination(${item.id})"
                >
                  Edit
                </button>

                <button
                  class="btn-delete"
                  onclick="deleteDestination(${item.id})"
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

const resetForm = () => {
  destinationForm.reset();

  document.getElementById(
    "destinationId"
  ).value = "";

  document.getElementById(
    "modalTitle"
  ).textContent =
    "Tambah Destination";

  formAlert.className = "alert";
  formAlert.textContent = "";
};

const openModal = () => {
  modal.classList.add("show");
};

const closeModal = () => {
  modal.classList.remove("show");
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

window.editDestination = (
  id
) => {
  const item =
    destinations.find(
      (destination) =>
        destination.id === id
    );

  if (!item) {
    return;
  }

  document.getElementById(
    "modalTitle"
  ).textContent =
    "Edit Destination";

  document.getElementById(
    "destinationId"
  ).value = item.id;

  document.getElementById(
    "name"
  ).value = item.name || "";

  document.getElementById(
    "categoryId"
  ).value =
    item.category_id || "";

  document.getElementById(
    "city"
  ).value = item.city || "";

  document.getElementById(
    "province"
  ).value =
    item.province || "";

  document.getElementById(
    "latitude"
  ).value =
    item.latitude || "";

  document.getElementById(
    "longitude"
  ).value =
    item.longitude || "";

  document.getElementById(
    "rating"
  ).value =
    item.rating || "";

  document.getElementById(
    "reviewCount"
  ).value =
    item.review_count || 0;

  document.getElementById(
    "ticketPrice"
  ).value =
    item.ticket_price || 0;

  document.getElementById(
    "openingTime"
  ).value =
    item.opening_time
      ? item.opening_time.substring(
          0,
          5
        )
      : "";

  document.getElementById(
    "closingTime"
  ).value =
    item.closing_time
      ? item.closing_time.substring(
          0,
          5
        )
      : "";

  document.getElementById(
    "status"
  ).value =
    item.status || "active";

  document.getElementById(
    "address"
  ).value =
    item.address || "";

  document.getElementById(
    "description"
  ).value =
    item.description || "";

  openModal();
};

destinationForm.addEventListener(
  "submit",
  async (event) => {
    event.preventDefault();

    const id =
      document.getElementById(
        "destinationId"
      ).value;

    const payload = {
      category_id: Number(
        categorySelect.value
      ),

      name:
        document.getElementById(
          "name"
        ).value,

      description:
        document.getElementById(
          "description"
        ).value,

      city:
        document.getElementById(
          "city"
        ).value,

      province:
        document.getElementById(
          "province"
        ).value,

      address:
        document.getElementById(
          "address"
        ).value,

      latitude:
        document.getElementById(
          "latitude"
        ).value || null,

      longitude:
        document.getElementById(
          "longitude"
        ).value || null,

      rating:
        document.getElementById(
          "rating"
        ).value || null,

      review_count:
        Number(
          document.getElementById(
            "reviewCount"
          ).value || 0
        ),

      ticket_price:
        Number(
          document.getElementById(
            "ticketPrice"
          ).value || 0
        ),

      opening_time:
        document.getElementById(
          "openingTime"
        ).value || null,

      closing_time:
        document.getElementById(
          "closingTime"
        ).value || null,

      status:
        document.getElementById(
          "status"
        ).value,
    };

    const url = id
      ? `/api/admin/destinations/${id}`
      : "/api/admin/destinations";

    const method = id
      ? "PUT"
      : "POST";

    try {
      const response = await fetch(
        url,
        {
          method,
          headers: authHeaders,
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
          "Gagal menyimpan data.";

        return;
      }

      formAlert.className =
        "alert alert-success";

      formAlert.textContent =
        result.message;

      await loadDestinations();

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

window.deleteDestination =
  async (id) => {
    const confirmed =
      confirm(
        "Yakin ingin menghapus destination ini?"
      );

    if (!confirmed) {
      return;
    }

    const response = await fetch(
      `/api/admin/destinations/${id}`,
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
        "Gagal menghapus destination."
      );

      return;
    }

    await loadDestinations();
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
loadDestinations();