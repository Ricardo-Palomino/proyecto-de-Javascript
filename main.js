// Efecto de carga inicial
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display = 'none';
            animateSplashElements();
        }, 500);
    }, 1000);
});


// Escribir texto como máquina de escribir
function typeWriter(element, text, speed, callback) {
    let i = 0;
    element.textContent = '';
    (function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i++);
            setTimeout(type, speed);
        } else if (callback) {
            callback();
        }
    })();
}

// Animación de entrada progresiva
function animateSplashElements() {
    const logoText = document.getElementById('logo-text');
    const tagline = document.getElementById('tagline');
    const enterButton = document.getElementById('enter-button');
    const features = document.querySelectorAll('.feature');
    const socials = document.querySelectorAll('.social-link');

    const logoTextContent = logoText.textContent;
    logoText.textContent = '';
    tagline.style.opacity = '1';
    typeWriter(logoText, logoTextContent, 100, () => {
        const taglineText = tagline.textContent;
        tagline.textContent = '';
        typeWriter(tagline, taglineText, 50, () => {
            enterButton.classList.add('show-button');

            features.forEach((feature, index) => {
                const delay = parseInt(feature.getAttribute('data-delay')) || index * 100;
                setTimeout(() => feature.classList.add('show-feature'), delay);
            });

            socials.forEach((link, index) => {
                const delay = parseInt(link.getAttribute('data-delay')) || index * 100;
                setTimeout(() => link.classList.add('show-social'), delay);
            });
        });
    });
}

// Interacciones y efectos
document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.querySelector('.cart-icon');
    const enterButton = document.getElementById('enter-button');

    // Efecto de seguimiento del mouse en el carrito
    document.addEventListener('mousemove', e => {
        const { clientX, clientY } = e;
        const moveX = (clientX - window.innerWidth / 2) / 50;
        const moveY = (clientY - window.innerHeight / 2) / 50;
        cartIcon.style.transform = `translateY(-10px) rotateX(${moveY}deg) rotateY(${-moveX}deg)`;
    });

    // Hover en botón
    enterButton.addEventListener('mouseenter', () => {
        enterButton.querySelector('i').style.transform = 'translateX(8px)';
    });

    enterButton.addEventListener('mouseleave', () => {
        enterButton.querySelector('i').style.transform = 'translateX(0)';
    });

    // Click con efecto de onda
    enterButton.addEventListener('click', e => {
        e.preventDefault();

        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        enterButton.appendChild(ripple);

        const rect = enterButton.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        setTimeout(() => {
            ripple.remove();
            document.body.classList.add('page-transition');
            setTimeout(() => {
                window.location.href = enterButton.getAttribute('href');
            }, 500);
        }, 600);
    });
});
