DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    product_type TEXT NOT NULL, 
    color TEXT NOT NULL, 
    price TEXT NOT NULL, 
    size TEXT, 
    brand TEXT NOT NULL, 
    condition TEXT NOT NULL, 
    image BLOB TEXT NOT NULL,
    image_type TEXT NULL,
    description TEXT NOT NULL, 
    slug TEXT UNIQUE NOT NULL, 
    category TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP 
);

INSERT INTO products (id, name, product_type, color, price, size, brand, condition, image, description, slug, category)
VALUES 
(1, 'Nike', 'Leggings', 'Svart', '199', 'M', 'Nike', 'Mycket bra', '/images/leggings.png', 'Mycket bra, varan har inga eller små tecken på användning.', 'leggings-nike', 'Dam'),
(2, 'Adidas', 'T-shirt', 'Svart', '129', 'S', 'Adidas', 'Bra', '/images/tshirt.png', 'Bra, varan har synliga men mindre tecken på användning. Inga stora defekter.', 'tshirt-adidas', 'Dam'),
(3, 'Zara', 'Klänning', 'Gul', '299', 'M', 'Zara', 'Mycket bra', '/images/dress.png', 'Mycket bra, varan har inga eller små tecken på användning.', 'dress-zara', 'Dam'),
(4, 'H&M', 'Jeans', 'Blå', '199', 'L', 'H&M', 'Acceptabelt', '/images/jeans.png', 'Acceptabelt, varan har tydliga tecken på användning. Mindre defekter kan förekomma.', 'jeans-hm', 'Dam'),
(5, 'Tiger of Sweden', 'Kappa', 'Vit', '499', 'L', 'Tiger of Sweden', 'Mycket bra', '/images/coat.png', 'Mycket bra, varan har inga eller små tecken på användning. Defekter förekommer.', 'coat-tiger-of-sweden', 'Dam'),
(6, 'Mango', 'Kjol', 'Blå', '179', 'S', 'Mango', 'Bra', '/images/skirt.png', 'Bra, varan har synliga men mindre tecken på användning. Inga stora defekter.', 'kjol-mango', 'Dam'),
(7, 'Apple', 'Iphone 12', 'Svart', '5499', '128 GB', 'Apple', 'Bra', '/images/apple-iphone12.png', 'Bra, varan har synliga men mindre tecken på användning. Inga stora defekter.', 'iphone12-apple', 'Elektronik'),
(8, 'Samsung', 'TV', 'Svart', '4999', '55 tum', 'Samsung', 'Bra', '/images/samsung55tv.png', 'Bra, varan har synliga men mindre tecken på användning. Inga stora defekter.', 'smarttv-samsung', 'Elektronik');