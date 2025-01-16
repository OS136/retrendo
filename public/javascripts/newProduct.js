const form = document.getElementById("productForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const formData = new FormData(form);

    const slug = formData
      .get("productName")
      .trim()
      .toLocaleLowerCase()
      .replace(/ /g, "-")
      .replace("å", "a")
      .replace("ä", "a")
      .replace("ö", "o");

    const productCategories = formData.getAll("productCategories");
    const product = {
      productName: formData.get("productName"),
      productType: formData.get("productType"),
      productColor: formData.get("productColor"),
      productPrice: formData.get("productPrice"),
      productSize: formData.get("productSize"),
      productBrand: formData.get("productBrand"),
      productCondition: formData.get("productCondition"),
      productPicture: formData.get("productPicture"),
      productDescription: formData.get("productDescription"),
      productSlug: slug,
      productCategories: productCategories.join(", "),
      productDate: new Date().toISOString().split("T")[0],
    };

    const response = await fetch("/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (response.ok) {
      window.alert("Product added successfully");
      window.location.href = "/";
    } else {
      console.error("Failed to add product");
    }
  } catch (error) {
    throw new Error(error);
  }
});
