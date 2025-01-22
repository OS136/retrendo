document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;
    const urlDelar = path.split('/');
    const slug = urlDelar[urlDelar.length - 1];

    console.log("slug:", slug);

    fetch(`/product/${slug}/similar`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch product');
            }
            return response.json();
        })
        .then(similarProducts => {
            const similarContainer = document.querySelector(".similarContainer");

            similarProducts.forEach(product => {
                let article = document.createElement("article");
                let imageContainer = document.createElement("div");
                let a = document.createElement("a");
                let picture = document.createElement("picture");
                let img = document.createElement("img");
                let like = document.createElement("div");
                let productInfoContainer = document.createElement("div");
                let brand = document.createElement("h3");
                let price = document.createElement("p");
                let productCategory = document.createElement("p");

                img.src = `${product.image}`;
                img.alt = `${product.name}`;
                a.href = `${product.slug}`;
                brand.innerText = `${product.brand}`;
                price.innerText = `${product.price} sek`;
                productCategory.innerText = `${product.product_type}`;

                like.innerHTML = `<svg class="heart" width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181"/></svg>`;

                article.appendChild(imageContainer);
                imageContainer.appendChild(a);
                a.appendChild(picture);
                picture.appendChild(img);
                imageContainer.appendChild(like);
                article.appendChild(productInfoContainer);
                productInfoContainer.appendChild(brand);
                productInfoContainer.appendChild(price);
                productInfoContainer.appendChild(productCategory);

                article.classList.add("similarProducts");
                imageContainer.classList.add(`images`);
                productInfoContainer.classList.add("productsBrand");
                price.classList.add("productPrice");
                productCategory.classList.add("productName");
                brand.classList.add("productSimilarHeading");
                like.classList.add("heart");

                like.addEventListener('click', function (event) {
                    event.preventDefault();
                    const heartPath = like.querySelector('path');

                    if (heartPath.getAttribute('fill') === 'red') {
                        heartPath.setAttribute('fill', 'black');
                    } else {
                        heartPath.setAttribute('fill', 'red');
                    }
                });

                similarContainer.appendChild(article);
            });
        });

    const buttonAdd = document.querySelector('.add');
    buttonAdd.addEventListener("click", function () {
        alert(`produkten har lagts till i varukorgen`);
    });

    const buttonCheckout = document.querySelector('.checkOut');
    buttonCheckout.addEventListener("click", function () {
        window.location.href = "/checkout";
    });

    const menuIcon = document.querySelector(".menu-icon");
    menuIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        menuIcon.classList.toggle("open");
    });

    document.addEventListener("click", () => {
        menuIcon.classList.remove("open");
    });
});
