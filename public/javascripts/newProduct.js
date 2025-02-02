let products = [];

const form = document.getElementById("productForm"),
  editModal = document.getElementById("EditModal"),
  addNewProductCategory = document.getElementById("productCategory");

addNewProductCategory.addEventListener("change", () => {
  // disable size edit form control if category is Elektronik
  const addNewProductSize = document.getElementById("productSize");

  if (addNewProductCategory.value === "Elektronik") {
    addNewProductSize.disabled = true;
    const notUsedOption = document.createElement("option");
    notUsedOption.value = "not-used";
    notUsedOption.textContent = "ANVÄNDS EJ";
    notUsedOption.selected = true;
    addNewProductSize.appendChild(notUsedOption);
  } else {
    const notUsedOption = addNewProductSize.querySelector(
      "option[value='not-used']"
    );
    if (notUsedOption) {
      notUsedOption.remove();
    }
    addNewProductSize.disabled = false;
    preSelectOptions([{ id: "#productSize", value: "XS" }]);
  }
});

// Listen for form submission
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const formData = new FormData(form);
    const slug = formatToSlug(formData.get("productName"));

    // Set the slug and categories in the form data
    formData.set("productSlug", slug);

    formData.set("productDate", new Date().toISOString().split("T")[0]);
    formData.set(
      "productBrand",
      toTitleCase(formData.get("productBrand").trim())
    );
    formData.set(
      "productColor",
      toTitleCase(formData.get("productColor").trim())
    );
    formData.set(
      "productType",
      toTitleCase(formData.get("productType").trim())
    );

    // Send the product object to the backend
    const response = await fetch("/admin", {
      method: "POST",
      body: formData,
    });

    // If the response is bad, throw an error
    if (response.status === 400) {
      const errorData = await response.json();
      alert(errorData.message);
      return;
    }

    // If the response is ok, get all products from the backend
    if (response.ok) {
      alert(`Produkten \`${formData.get("productName")}\` har lagts till`);
      products = await getProducts();

      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
      }, 200);
    } else {
      console.error("Failed to add product");
    }
  } catch (error) {
    throw new Error(error);
  }
});

function formatToSlug(name) {
  // Trim whitespace on both ends
  let slug = name.trim();

  // Replace special Swedish characters with regular characters
  slug = slug.replace(/[åä]/gi, "a"); // Replace 'å' and 'ä' with 'a'
  slug = slug.replace(/[ö]/gi, "o"); // Replace 'ö' with 'o'

  // Replace spaces between characters with a single dash
  slug = slug.replace(/\s+/g, "-");

  // Convert to lowercase
  slug = slug.toLowerCase();

  return slug;
}

async function getProducts() {
  // fetch all products from the backend
  const productsResponse = await fetch("/admin/products");

  // if the response is not ok, throw an error
  if (!productsResponse.ok) {
    throw new Error("Could not fetch products");
  }

  // parse the response body as JSON (transform to a javscript object)
  const fetchedProducts = await productsResponse.json();

  // show the products on the page
  addProductsAsElementsOnPage(fetchedProducts);
  return fetchedProducts;
}

// init page with getting all the products from the database
async function initializePage() {
  products = await getProducts();
  console.log(products);
}

// reset and update products liss
function addProductsAsElementsOnPage(fetchedProducts) {
  // dynamically create HTML elements from the products we get from our backend request
  const productsSection = document.getElementById("products");
  // clear the products div before adding new products
  productsSection.innerHTML = "";

  const productsHeader = document.createElement("h2");
  productsHeader.style.textAlign = "center";
  productsHeader.textContent = "Produkter";
  productsSection.appendChild(productsHeader);

  // loop/iterate through all the proudcts we got from the backend
  fetchedProducts.forEach((product) => {
    // create parent div  to put the product name and image in
    const productDiv = document.createElement("div");

    // set the innerHTML of the product div
    productDiv.innerHTML = `
      <br />
      <br />
      <hr />
      <br />
       <h3>
          id:<span style="color:rgb(86, 151, 129)"> ${product.id}</span>, 
          namn: <span style="color:rgb(86, 151, 129)">${product.name}</span>, 
          slug:<span style="color:rgb(86, 151, 129)"> ${product.slug}</span>
       </h3>
      <img src="${product.image || "/images/tshirt.png"}" alt="${
      product.name
    }" />
      <button class="delete" data-id="${product.id}">Ta bort</button>
      <button class ="editForm" id="editForm${
        product.id
      }" onclick="openEditModal(${product.id})">Redigera</button>
    `;

    // add the product div to the products div
    productsSection.appendChild(productDiv);
  });

  const deleteButtons = document.querySelectorAll(".delete");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.dataset.id;
      deleteProduct(productId);
    });
  });
}
const deleteProduct = async (productId) => {
  const response = await fetch(`/admin/products/${productId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    alert("Produkten har tagits bort");
    products = await getProducts();
  } else {
    console.error("Failed to delete product");
  }
};

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function showPreviewImage() {
  const formImgInputElement = document.getElementById("editedProductPicture");
  const previewElement = document.getElementById("EditProductImage");
  const file = formImgInputElement.files[0];
  if (file) {
    previewElement.src = URL.createObjectURL(file);
  }
}

function openEditModal(id) {
  const editProduct = products.find((product) => product.id === id);
  animateProducts("hide");

  form.style = "visibility: hidden";
  const body = document.getElementById("body");
  const backdrop = document.createElement("div");
  backdrop.id = "editModalBackdrop";
  backdrop.classList.add("backdrop");
  body.insertAdjacentElement("afterbegin", backdrop);
  editModal.style = "display: block";

  editModal.innerHTML = `
    <div>
      <h1>Redigera</h1>
    </div>
    <span id="closeEditModal">
      <a href="#" onclick="cancelEditModal()"
        ><i class="fa-sharp fa-solid fa-xmark"></i
      ></a>
    </span>

    <section id="EditModalContainer">
      <div>
        <img id="EditProductImage" src="${editProduct.image}" />
        <p id="createdAt">
          Skapad datum:
          <strong>${formatDate(editProduct.created_at)} </strong> (tillagd
          <strong>${howManyDaysAgo(editProduct.created_at)}</strong>)
        </p>
      </div>

      <form id="editProductForm">
        <!-- Bild -->
        <div class="image-container">
          <div class="NewProductItem">
            <label for="editedProductPicture">Bild</label>
            <input
              id="editedProductPicture"
              type="file"
              name="editedProductPicture"
              accept="image/*"
              onchange="showPreviewImage()"
            />
          </div>
        </div>
        <!-- Namn -->
        <div class="details-container">
          <div class="NewProductItem">
            <label for="editedProductName">Namn</label>
            <input
              type="text"
              id="editedProductName"
              name="editedProductName"
              value="${editProduct.name}"
              required
            />
          </div>
          <!-- productBrand -->
          <div class="NewProductItem">
            <label for="editedProductBrand">Märke</label>
            <input
              type="text"
              id="editedProductBrand"
              name="editedProductBrand"
              value="${editProduct.brand}"
              required
            />
          </div>
          <!-- Beskrivning -->
          <div class="NewProductItem">
            <label for="editedProductDescription">Beskrivning</label>
            <textarea type="text" id="editedProductDescription" name="editedProductDescription" rows="5" cols="40">
            </textarea>
          </div>
        </div>
        <!-- Pris -->
        <div class="price-container">
          <div id="price-container" class="NewProductItem">
            <label for="editedProductPrice">Pris</label>
            <input
              type="number"
              id="editedProductPrice"
              name="editedProductPrice"
              value="${editProduct.price}"
              required
            />
          </div>
        </div>
        <!-- Skick -->
        <div class="productPropertiesContainer">
          <div>
            <label for="editedProductCondition">Välj skick</label>
            <select id="editedProductCondition" name="editedProductCondition">
              <option value="Mycket bra">Mycket bra</option>
              <option value="Bra">Bra</option>
              <option value="Acceptabelt">Acceptabelt</option>
            </select>
          </div>
          <!-- Storlek -->
          <div class="NewProductItem">
            <label for="editedProductSize">Välj storlek (Kläder/Skor)</label>
            <select id="editedProductSize" name="editedProductSize">
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="36">36</option>
              <option value="38">38</option>
              <option value="41">41</option>
              <option value="43">43</option>
            </select>
          </div>

          <div class="NewProductItem">
            <label for="editedProductColor">Färg</label>
            <input
              type="text"
              id="editedProductColor"
              name="editedProductColor"
              value="${editProduct.color}"
              required
            />
          </div>
          <div class="NewProductItem">
            <label for="editedProductType">Typ</label>
            <input
              type="text"
              id="editedProductType"
              name="editedProductType"
              value="${editProduct.product_type}"
              required
            />
          </div>
          <!-- Categiries -->
          <div id="CategoriesContainer">
            <div class="NewProductItem">
              <h4>Kategorier</h4>
              <select id="editedProductCategory" name="editedProductCategory">
                <option value="Dam">Dam</option>
                <option value="Herr">Herr</option>
                <option value="Elektronik">Elektronik</option>
              </select>
            </div>
          </div>
        </div>
        <!-- Button -->
        <div class="button-container">
          <button id="ProductEditResetButton" type="reset">Återställ</button>
          <button id="ProductEditButton" type="submit">Uppdatera produkt</button>
          <button
            id="ProductEditCancelButton"
            onclick="cancelEditModal()"
            type="button"
          >
            Avbryt
          </button>
        </div>
      </form>
    </section>
`;
  document.getElementById("editedProductDescription").value =
    editProduct.description.replace(/\s+/g, " ").trim();

  if (editProduct.updated_at) {
    const createdAtElement = document.querySelector("#createdAt");
    const updatedAtElement = document.createElement("p");
    updatedAtElement.innerHTML = `Uppdaterad datum:  <strong>${formatDate(
      editProduct.updated_at
    )}</strong> (ändrad <strong>${howManyDaysAgo(
      editProduct.updated_at
    )}</strong>)`;
    createdAtElement.insertAdjacentElement("afterend", updatedAtElement);
  }

  preSelectOptions([
    { id: "#editedProductCondition", value: editProduct.condition },
    { id: "#editedProductSize", value: editProduct.size },
    { id: "#editedProductCategory", value: editProduct.category },
  ]);

  iniEditProductFormEventListeners(editProduct);

  const animation = editModal.animate(
    [
      { transform: "translateY(0)", opacity: 0 }, // Starting state: no translation, fully transparent
      { transform: "translateY(-50%)", opacity: 1 }, // Ending state: translated up, fully visible
    ],
    {
      duration: 500, // Animation duration in milliseconds
      fill: "forwards", // Ensures the element stays in the final position after animation
    }
  );

  animation.onfinish = () => {};
}

function preSelectOptions(selectArray) {
  selectArray.forEach((selectObject) => {
    const selectElement = document.querySelector(selectObject.id);
    const options = selectElement.querySelectorAll("option");
    options.forEach((option) => {
      if (option.value === selectObject.value) {
        option.setAttribute("selected", true);
      }
    });
  });
}

// function to add event listeners to the form and handle form control states
function iniEditProductFormEventListeners(editProduct) {
  const editProductForm = document.getElementById("editProductForm");
  const editFormElements = Array.from(editProductForm.elements);
  const pictureElementId = "editedProductPicture";

  //submitting edit
  editProductForm.addEventListener("submit", (event) => {
    event.preventDefault();
    onSubmitEditProductForm(editProductForm, editProduct);
  });

  //resetting edit
  editProductForm.addEventListener("reset", (event) => {
    editProductForm.reset();
    const previewElement = document.getElementById("EditProductImage");
    previewElement.classList.remove("EditedProductTouched");
    previewElement.src = editProduct.image;
    setAllFormControlsToUntouched(editFormElements);
  });

  // disable size edit form control if category is Elektronik
  disableSizeFormControlOnInitBy(
    editFormElements.find((element) => element.id === "editedProductCategory")
  );

  for (const element of editFormElements) {
    const isPicture = element.id === pictureElementId;
    const defaultValue = isPicture ? editProduct.image : element.value;

    element.addEventListener("change", () => {
      // disable size edit form control if category is Elektronik
      if (element.id === "editedProductCategory") {
        const editedProductSize = editFormElements.find(
          (element) => element.id === "editedProductSize"
        );

        if (element.value === "Elektronik") {
          editedProductSize.disabled = true;
          const notUsedOption = document.createElement("option");
          notUsedOption.value = "not-used";
          notUsedOption.textContent = "ANVÄNDS EJ";
          notUsedOption.selected = true;
          editedProductSize.appendChild(notUsedOption);
        } else {
          const notUsedOption = editedProductSize.querySelector(
            "option[value='not-used']"
          );
          if (notUsedOption) {
            notUsedOption.remove();
          }
          editedProductSize.disabled = false;
          preSelectOptions([
            { id: "#editedProductSize", value: editProduct.size },
          ]);
        }
      }

      // separate logic for picture
      if (isPicture) {
        setImageInputToTouched(element, defaultValue);
      } else {
        // if the value is the same as the default value, remove the EditedProductTouched class
        if (element.value === defaultValue) {
          element.classList.remove("EditedProductTouched");
        } else {
          element.classList.add("EditedProductTouched");
        }
      }
    });
  }

  function setAllFormControlsToUntouched(editFormElements) {
    editFormElements.forEach((element) =>
      element.classList.remove("EditedProductTouched")
    );
  }

  function setImageInputToTouched(pictureElement, defaultValue) {
    const hasFiles = !!pictureElement.files.length;
    const classList = pictureElement.classList;
    const previewElement = document.getElementById("EditProductImage");
    classList.toggle("EditedProductTouched", hasFiles);
    previewElement.src = hasFiles
      ? URL.createObjectURL(pictureElement.files[0])
      : defaultValue;
  }
}

function disableSizeFormControlOnInitBy(editedProductCategory) {
  const editedProductSize = document.getElementById("editedProductSize");
  if (editedProductCategory.value === "Elektronik") {
    editedProductSize.disabled = true;
    editedProductSize.insertAdjacentHTML(
      "beforeend",
      "<option value='not-used' selected>ANVÄNDS EJ</option>"
    );
  }
}

function cancelEditModal() {
  animateProducts("show");

  const animation = editModal.animate(
    [
      { transform: "translateY(-50%)", opacity: 1 },
      { transform: "translateY(-150%)", opacity: 0 },
    ],
    {
      duration: 700, // Animation duration in milliseconds
      fill: "forwards", // Ensures the element stays in the final position after animation
    }
  );

  animation.onfinish = () => {
    const productsDiv = document.getElementById("products");
    productsDiv.style = "visibility: unset";
    form.style = "visibility: unset";
    const backdrop = document.getElementById("editModalBackdrop");
    backdrop.remove();
    const editModal = document.getElementById("EditModal");
    editModal.style = "display : none";
    editModal.innerHTML = "";
  };
}

function formatDate(date) {
  return new Date(date).toISOString().split("T")[0];
}

function howManyDaysAgo(date) {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;
  const daysAgo = Math.floor(diff / 86400000);
  return daysAgo === 0
    ? "idag"
    : daysAgo === 1
    ? "igår"
    : `${daysAgo} dagar sedan`;
}

function animateProducts(action) {
  const productsSection = document.getElementById("products");
  const hideAlpha = 0.1;
  const fadeSpeed = 300;
  if (action === "hide") {
    productsSection.animate([{ opacity: 1 }, { opacity: hideAlpha }], {
      duration: fadeSpeed,
      fill: "forwards",
    });

    form.animate([{ opacity: 1 }, { opacity: hideAlpha }], {
      duration: fadeSpeed, // Animation duration in milliseconds
      fill: "forwards", // Ensures the element stays in the final position after animation
    });
  }

  if (action === "show") {
    productsSection.animate([{ opacity: hideAlpha }, { opacity: 1 }], {
      duration: fadeSpeed,
      fill: "forwards",
    });

    form.animate([{ opacity: hideAlpha }, { opacity: 1 }], {
      duration: fadeSpeed,
      fill: "forwards",
    });
  }
}

async function onSubmitEditProductForm(editForm, editProduct) {
  try {
    const formData = new FormData(editForm);
    const slug = formatToSlug(formData.get("editedProductName"));

    console.log("Edited form data", formData);
    console.log("Edited form slug", slug);

    // Set the slug and categories in the form data
    formData.set("editedProductSlug", slug);

    formData.set(
      "editedProductBrand",
      toTitleCase(formData.get("editedProductBrand").trim())
    );
    formData.set(
      "editedProductColor",
      toTitleCase(formData.get("editedProductColor").trim())
    );
    formData.set(
      "editedProductType",
      toTitleCase(formData.get("editedProductType").trim())
    );

    formData.set("editedProductId", +editProduct.id);

    // Send the product object to the backend
    const response = await fetch("/admin", {
      method: "PUT",
      body: formData,
    });

    // If the response is bad, throw an error
    if (response.status === 400) {
      const errorData = await response.json();
      alert(errorData.message);
      return;
    }
    // If the response is ok, get all products from the backend
    if (response.ok) {
      const successData = await response.json();
      alert(successData.message);
      products = await getProducts();
      cancelEditModal();
    } else {
      console.error("Failed to add product");
    }
  } catch (error) {
    throw new Error(error);
  }
}

window.onload = initializePage;
