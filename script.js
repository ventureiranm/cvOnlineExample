// 1. Loader
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.style.display = 'none';
    }, 1000);
});

// 2. Scroll Suave para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 3. Animaciones al hacer scroll (Fade-In)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// 4. Modal de Galería
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("img01");
const span = document.getElementsByClassName("close")[0];

document.querySelectorAll('.gallery-img').forEach(img => {
    img.onclick = function() {
        modal.style.display = "block";
        modalImg.src = this.src;
    }
});

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// 5. Botón Volver Arriba
const scrollBtn = document.getElementById("scrollTop");

window.onscroll = function() {
    if (document.body.scrollTop > 500 || document.documentElement.scrollTop > 500) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
};

scrollBtn.onclick = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 6. Formulario de Contacto
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Simulación de envío
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const mensaje = document.getElementById('mensaje').value;

    // Validación básica
    if(nombre && email && mensaje) {
        formStatus.innerHTML = "¡Enviando mensaje...";
        formStatus.style.color = "#FBBC05";

        setTimeout(() => {
            formStatus.innerHTML = "Mensaje enviado correctamente. Sundar (o el dev) te contactará pronto.";
            formStatus.style.color = "#34A853";
            
            // Aquí se usaría el mailto si se quisiera abrir el gestor de correo
            // window.location.href = `mailto:ventureiranm@gmail.com?subject=Contacto desde CV&body=${mensaje}`;
            
            contactForm.reset();
        }, 2000);
    }
});

// 7. Efecto Ripple (Opcional - Extra)
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple-effect");

    const ripple = button.getElementsByClassName("ripple-effect")[0];
    if (ripple) { ripple.remove(); }
    button.appendChild(circle);
}

document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', createRipple);
});
