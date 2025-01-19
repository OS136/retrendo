
    document.addEventListener("DOMContentLoaded", function () {
    const menuIcon = document.querySelector(".menu-icon");

    menuIcon.addEventListener("click", (e) => {
        e.stopPropagation(); 
        menuIcon.classList.toggle("open");
    });

    document.addEventListener("click", () => {
        menuIcon.classList.remove("open");
    });
});
