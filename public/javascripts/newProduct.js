let products = [];

const form = document.getElementById("productForm");

// Listen for form submission
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const formData = new FormData(form);
    const slug = formatToSlug(formData.get("productName"));

    console.log("Form data", formData);
    // Check if the name is unique
    const nameIsUnique =
      products.length > 0
        ? products.every((product) => product.slug !== slug)
        : true;

    if (!nameIsUnique) {
      alert("Du måste skriva in ett namn som är unikt för produkten");
      return;
    }

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

    // If the response is ok, get all products from the backend
    if (response.ok) {
      alert(`Produkten \`${formData.get("productName")}\` har lagts till`);
      products = await getProducts();
      window.scrollTo(0, document.body.scrollHeight);
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

window.onload = initializePage;
