var express = require("express");
var router = express.Router();
const multer = require("multer");
const zlib = require("zlib"); // compress files
const sharp = require("sharp"); // resize images
// Init db
const Database = require("better-sqlite3");

// Open db file
const db = new Database("./db/Retrendo.db", { verbose: console.log });
// init multer
const upload = multer();

// GET /products
router.get("/products", (req, res) => {
  console.log("fetching products: ", req.body);
  try {
    const stmt = db.prepare(
      "SELECT id, name, slug, image, image_type FROM products"
    );
    const products = stmt.all();

    const formattedProducts = formatProducts(products);

    res.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).send("Error fetching products");
  }
});

// GET / page
router.get("/", function (request, response) {
  response.render("newProduct");
});

// POST / add product to db
router.post("/", upload.single("productPicture"), async function (req, res) {
  const {
    productName,
    productType,
    productColor,
    productPrice,
    productSize,
    productBrand,
    productCondition,
    productDescription,
    productSlug,
    productCategory,
  } = req.body;

  const imageBlob = req.file?.buffer;
  const imageType = req.file?.mimetype;

  if (!imageBlob || !imageType) {
    return res.status(400).send("Image is required");
  }

  // Check if image is bigger than 800px
  const isBigSize = sharp(imageBlob)
    .metadata()
    .then((metadata) => {
      return metadata.width > 800 || metadata.height > 800;
    });

  // Resize image if it's bigger than 800px
  let modifiedBlob = null;
  if (isBigSize) {
    modifiedBlob = await sharp(imageBlob).resize({ width: 800 }).toBuffer();
  } else {
    modifiedBlob = imageBlob;
  }

  // Compress the image
  const compressedBlob = zlib.brotliCompressSync(modifiedBlob);

  console.log("blob orignal size:", imageBlob.length);
  console.log("blob compressed size:", compressedBlob.length);
  try {
    const insert = db.prepare(`
    INSERT INTO products (
      name,
      product_type,
      color,
      price,
      size,
      brand,
      condition,
      image,
      image_type,
      description,
      slug,
      category
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
    
  `);

    insert.run(
      productName,
      productType,
      productColor,
      productPrice,
      productSize,
      productBrand,
      productCondition,
      compressedBlob,
      imageType,
      productDescription,
      productSlug,
      productCategory
    );
    res.status(200).send("Product added");
  } catch (err) {
    console.error("Error inserting product:", err.message);
    res.status(500).send("Failed to add product");
  }
});

// DELETE /products/:id
router.delete("/products/:id", (req, res) => {
  const productId = req.params.id;
  const deleteProduct = db.prepare("DELETE FROM products WHERE id = ?");
  deleteProduct.run(productId);
  res.json({ message: "Product deleted" });
});

/**
 * Takes an array of products and formats them for frontend consumption.
 *
 * @param {Array} products - array of products
 * @returns {Array} formatted products
 */
function formatProducts(products) {
  const formattedProducts =
    products.length > 0
      ? products.map((product) => {
          if (product.image && typeof product.image !== "string") {
            // Decompress the image
            const decompressedBlob = zlib.brotliDecompressSync(
              Buffer.from(product.image)
            );

            // Convert the image buffer to Base64
            product.image = `data:image/${
              product.image_type
            };charset=utf-8;base64,${decompressedBlob.toString("base64")}`;
          }

          return product;
        })
      : [];

  return formattedProducts;
}

module.exports = { router, formatProducts };
