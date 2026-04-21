// 1. Product Data (Simulating a Database)
const products = [
    { id: 1, name: "Pro Wireless Headset", price: 199.99, category: "Audio", img: "images/image1.jpg" },
    { id: 2, name: "Ultrabook X1", price: 1299.00, category: "Laptops", img: "images/image2.jpg" },
    { id: 3, name: "Smart Watch S8", price: 349.00, category: "Wearables", img: "images/images3.jpg" },
    { id: 4, name: "4K Mirrorless Camera", price: 899.00, category: "Cameras", img: "images/image4.jpg" }
];

// 2. Initialize Cart from Session (LocalStorage)
let cart = JSON.parse(localStorage.getItem('nexgen_cart')) || [];

// 3. Function to display products
function displayProducts(items) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    grid.innerHTML = items.length > 0 ? "" : "<p style='padding: 20px;'>No products found matching your search.</p>";

    items.forEach(product => {
        grid.innerHTML += `
            <div class="product-card">
                <img src="${product.img}" alt="${product.name}" class="product-img">
                <div class="product-info">
                    <p style="font-size: 0.8rem; color: #555;">${product.category}</p>
                    <h3 style="font-size: 1.1rem; margin: 5px 0;">${product.name}</h3>
                    <p class="price">$${product.price.toLocaleString()}</p>
                    <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
    });
}

// 4. ADD TO CART Logic (Lab 5: Session Handling)
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart(); // Updates UI and saves to session
}

// 5. REMOVE FROM CART Logic
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// 6. UPDATE UI & SESSION
function updateCart() {
    // Save to Session (Memory)
    localStorage.setItem('nexgen_cart', JSON.stringify(cart)); 
    
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update count icon in header
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if(cartCount) cartCount.innerText = totalItems;

    // Display items in the side drawer
    if(cartItems) {
        cartItems.innerHTML = "";
        let total = 0;
        
        cart.forEach(item => {
            total += item.price * item.quantity;
            cartItems.innerHTML += `
                <div class="cart-item" style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
                    <div>
                        <strong style="font-size:0.9rem;">${item.name}</strong><br>
                        <small>$${item.price} x ${item.quantity}</small>
                    </div>
                    <button onclick="removeFromCart(${item.id})" style="border:none; background:none; cursor:pointer; color:red; font-weight:bold;">×</button>
                </div>
            `;
        });
        
        if(cartTotal) cartTotal.innerText = total.toFixed(2);
    }
}

// 7. Search & Filter Logic
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.category.toLowerCase().includes(searchTerm)
    );
    displayProducts(filtered);
}

function filterByCategory(categoryName) {
    const filtered = products.filter(product => 
        product.category.toLowerCase() === categoryName.toLowerCase()
    );
    displayProducts(filtered);
    document.getElementById('productGrid').scrollIntoView({ behavior: 'smooth' });
}

// 8. Setup & Initial Load
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products); // Show all products
    updateCart(); // Load any existing items from the session

    // Category Card Listeners
    const catCards = document.querySelectorAll('.cat-card');
    catCards.forEach(card => {
        card.addEventListener('click', () => filterByCategory(card.innerText));
    });

    // Newsletter Submission
    const navNewsForm = document.getElementById('navNewsletter');
    if (navNewsForm) {
        navNewsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input').value;
            alert(`Discount code sent to ${email}!`);
            e.target.reset();
        });
    }
});

function toggleCart() {
    document.getElementById('cartDrawer').classList.toggle('active');
}

function checkout() {
    if (cart.length === 0) return alert("Your cart is empty!");
    alert("Order Successful! Total processed: $" + document.getElementById('cartTotal').innerText);
    cart = [];
    updateCart();
    toggleCart();
}