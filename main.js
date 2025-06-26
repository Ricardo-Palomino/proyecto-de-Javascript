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

