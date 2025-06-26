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

// Crear HTML de estrellas de calificación
function createRatingStars(rating) {
    let starsHTML = '';
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }

    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }

    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }

    return starsHTML;
}

// Mostrar categorías
function displayCategories(categories) {
    categoriesGrid.innerHTML = '';

    const categoryIcons = {
        'electronics': { icon: 'fas fa-laptop', color: 'blue' },
        'jewelery': { icon: 'fas fa-gem', color: 'purple' },
        "men's clothing": { icon: 'fas fa-tshirt', color: 'green' },
        "women's clothing": { icon: 'fas fa-female', color: 'pink' }
    };

    categories.forEach(category => {
        const { icon, color } = categoryIcons[category] || { icon: 'fas fa-tag', color: 'gray' };

        const categoryCard = document.createElement('div');
        categoryCard.className = 'glass-card p-6 text-center fade-in';
        categoryCard.innerHTML = `
            <div class="bg-${color}-500 bg-opacity-20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <i class="${icon} text-3xl text-${color}-400"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            <p class="text-gray-400 text-sm mb-4">Explora nuestra selección de ${category}.</p>
            <a href="#" class="text-${color}-400 hover:text-${color}-300 transition-colors category-link" data-category="${category}">Ver productos <i class="fas fa-arrow-right ml-1"></i></a>
        `;

        categoriesGrid.appendChild(categoryCard);

        const categoryLink = categoryCard.querySelector('.category-link');
        categoryLink.addEventListener('click', (e) => {
            e.preventDefault();
            const selectedCategory = e.target.dataset.category;
            filterProductsByCategory(selectedCategory);
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
    });

    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);
}

// Filtrar productos por categoría
function filterProductsByCategory(category) {
    const filteredProducts = products.filter(product => product.category === category);
    displayProducts(filteredProducts);

    const productsTitle = document.querySelector('#products h2');
    productsTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);

    const productsSubtitle = document.querySelector('#products p');
    productsSubtitle.textContent = `Mostrando ${filteredProducts.length} productos en esta categoría`;
}

// Mostrar detalles del producto en un modal
function showProductDetails(product) {
    const productDetails = document.getElementById('productDetails');
    const modalProductTitle = document.getElementById('modalProductTitle');

    modalProductTitle.textContent = product.title;

    const ratingStars = createRatingStars(product.rating.rate);

    productDetails.innerHTML = `
        <div class="md:w-1/2">
            <img src="${product.image}" alt="${product.title}" class="w-full h-auto bg-white p-4 rounded-lg">
        </div>
        <div class="md:w-1/2">
            <span class="category-badge inline-block mb-4">${product.category}</span>
            <h3 class="text-2xl font-bold mb-2">${product.title}</h3>
            <div class="flex items-center mb-4">
                <div class="flex text-yellow-400">
                    ${ratingStars}
                </div>
                <span class="text-gray-400 text-sm ml-2">(${product.rating.count} reseñas)</span>
            </div>
            <p class="text-gray-300 mb-6">${product.description}</p>
            <div class="flex justify-between items-center mb-6">
                <span class="text-3xl font-bold">$${product.price.toFixed(2)}</span>
                <span class="text-green-500">En stock</span>
            </div>
            <button class="btn-primary w-full py-3 mb-4 modal-add-to-cart" data-id="${product.id}">
                <i class="fas fa-shopping-cart mr-2"></i>Añadir al carrito
            </button>
        </div>
    `;

    const modalAddToCartBtn = productDetails.querySelector('.modal-add-to-cart');
    modalAddToCartBtn.addEventListener('click', () => {
        addToCart(product);
    });

    document.getElementById('overlay').style.display = 'block';
    document.getElementById('productModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Función para añadir producto al carrito
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    updateCart();

    // Mostrar notificación
    showNotification(`${product.title} añadido al carrito`);
}

// Actualizar la interfaz del carrito
function updateCart() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartFooter.style.display = 'none';
        cartItems.innerHTML = '';
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    cartFooter.style.display = 'block';
    
    let subtotal = 0;
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'flex items-center justify-between border-b border-gray-700 pb-4';
        cartItem.innerHTML = `
            <div class="flex items-center">
                <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-contain bg-white p-1 rounded mr-4">
                <div>
                    <h4 class="font-medium text-sm mb-1 line-clamp-1" style="display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">${item.title}</h4>
                    <div class="flex items-center">
                        <button class="decrease-quantity text-gray-400 hover:text-white px-2" data-id="${item.id}">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="increase-quantity text-gray-400 hover:text-white px-2" data-id="${item.id}">+</button>
                    </div>
                </div>
            </div>
            <div class="flex items-center">
                <span class="mr-4">$${itemTotal.toFixed(2)}</span>
                <button class="remove-item text-red-500 hover:text-red-400" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
        // Actualizar la interfaz del carrito
        cartItem.querySelector('.decrease-quantity').addEventListener('click', () => {
            decreaseQuantity(item.id);
        });
        
        cartItem.querySelector('.increase-quantity').addEventListener('click', () => {
            increaseQuantity(item.id);
        });
        
        cartItem.querySelector('.remove-item').addEventListener('click', () => {
            removeFromCart(item.id);
        });
    });
    
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
}

// Disminuir cantidad del producto
function decreaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        removeFromCart(id);
        return;
    }
    
    updateCart();
}

// Aumentar cantidad del producto
function increaseQuantity(id) {
    const item = cart.find(item => item.id === id);
    item.quantity += 1;
    updateCart();
}

// Eliminar producto del carrito
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Vaciar el carrito completamente
function clearCart() {
    cart = [];
    updateCart();
}

// Mostrar notificación flotante
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, 20px)';
        notification.style.transition = 'opacity 0.5s, transform 0.5s';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 2000);
}
