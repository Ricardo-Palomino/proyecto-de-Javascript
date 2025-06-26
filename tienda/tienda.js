// Funcionalidad del carrito
let cart = [];
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartSubtotal = document.getElementById('cartSubtotal');
const emptyCartMessage = document.getElementById('emptyCartMessage');
const cartFooter = document.getElementById('cartFooter');

// Datos de productos
let products = [];
let categories = [];

// Elementos del DOM
const productGrid = document.getElementById('productGrid');
const categoriesGrid = document.getElementById('categoriesGrid');
const productsLoading = document.getElementById('productsLoading');
const categoriesLoading = document.getElementById('categoriesLoading');

// Obtener productos desde la API
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        productGrid.innerHTML = '<p class="text-center col-span-full text-red-500">Error al cargar productos. Por favor, intenta de nuevo más tarde.</p>';
    } finally {
        productsLoading.style.display = 'none';
    }
}

// Obtener categorías desde la API
async function fetchCategories() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        categories = await response.json();
        displayCategories(categories);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        categoriesGrid.innerHTML = '<p class="text-center col-span-full text-red-500">Error al cargar categorías. Por favor, intenta de nuevo más tarde.</p>';
    } finally {
        categoriesLoading.style.display = 'none';
    }
}

// Mostrar productos en la cuadrícula
function displayProducts(productsToDisplay) {
    productGrid.innerHTML = '';

    if (productsToDisplay.length === 0) {
        productGrid.innerHTML = '<p class="text-center col-span-full text-gray-400">No se encontraron productos.</p>';
        return;
    }

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'glass-card p-4 fade-in';

        // Crear estrellas de calificación
        const ratingStars = createRatingStars(product.rating.rate);

        productCard.innerHTML = `
            <div class="relative mb-4 overflow-hidden rounded-lg">
                <img src="${product.image}" alt="${product.title}" class="product-image w-full">
                <span class="absolute top-2 right-2 category-badge">${product.category}</span>
            </div>
            <h3 class="text-xl font-semibold mb-2 truncate" title="${product.title}">${product.title}</h3>
            <div class="flex items-center mb-2">
                <div class="flex text-yellow-400">
                    ${ratingStars}
                </div>
                <span class="text-gray-400 text-sm ml-2">(${product.rating.count})</span>
            </div>
            <p class="text-gray-400 text-sm mb-4 line-clamp-2" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${product.description}</p>
            <div class="flex justify-between items-center">
                <span class="text-xl font-bold">$${product.price.toFixed(2)}</span>
                <button class="btn-primary add-to-cart" data-id="${product.id}">
                    <i class="fas fa-shopping-cart mr-2"></i>Añadir
                </button>
            </div>
        `;

        productGrid.appendChild(productCard);

        // Evento para mostrar detalles del producto
        productCard.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart')) {
                showProductDetails(product);
            }
        });

        // Evento para añadir al carrito
        const addToCartBtn = productCard.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(product);
        });
    });

    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);
}