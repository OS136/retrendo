CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    product_type TEXT NOT NULL, 
    color TEXT NOT NULL, 
    price TEXT NOT NULL, 
    size TEXT, 
    brand TEXT NOT NULL, 
    condition TEXT NOT NULL, 
    image TEXT NOT NULL, 
    description TEXT NOT NULL, 
    slug TEXT UNIQUE NOT NULL, 
    category TEXT NOT NULL, 
    date TEXT NOT NULL
)