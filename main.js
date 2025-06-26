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