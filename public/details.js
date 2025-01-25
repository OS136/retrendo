document.addEventListener("DOMContentLoaded", function () {
    
    document.querySelectorAll('.heart').forEach(heart => {
        const path = heart.querySelector('path');
        path.setAttribute('fill', 'none');  // Tom i början
        path.setAttribute('stroke', 'black'); // Svart outline
        path.setAttribute('stroke-width', '2');
    
        heart.addEventListener('click', function(e) {
            e.preventDefault();
            if (path.getAttribute('fill') === 'none') {
                path.setAttribute('fill', 'red');
                path.setAttribute('stroke', 'none');
            } else {
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke', 'black');
            }
        });
    });

    // Varukorg och checkout knappar
    document.querySelector('.add')?.addEventListener('click', () => 
        alert('Produkten har lagts till i varukorgen'));

    document.querySelector('.checkOut')?.addEventListener('click', () => 
        window.location.href = '/checkout');

    // Meny-toggle
    const menuIcon = document.querySelector('.menu-icon');
    menuIcon?.addEventListener('click', e => {
        e.stopPropagation();
        menuIcon.classList.toggle('open');
    });
    
    document.addEventListener('click', () => 
        menuIcon?.classList.remove('open'));
});

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