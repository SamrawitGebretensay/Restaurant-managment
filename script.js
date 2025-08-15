document.addEventListener('DOMContentLoaded', function() {
    // Menu Tab Functionality
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuItems = document.querySelectorAll('.menu-item');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            menuTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            const category = tab.getAttribute('data-category');
            
            // Show/hide menu items based on category
            menuItems.forEach(item => {
                if (item.getAttribute('data-category') === category || category === 'all') {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Shopping Cart Functionality
    let cart = [];
    const orderItemsEl = document.getElementById('order-items');
    const orderTotalEl = document.getElementById('order-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const customerInfoForm = document.getElementById('customer-info-form');
    const customerForm = document.getElementById('customer-form');
    const orderModal = document.getElementById('order-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const closeModal = document.querySelector('.close-modal');

    // Add to cart functionality
    function setupAddToCartButtons() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const name = button.getAttribute('data-name');
                const price = parseFloat(button.getAttribute('data-price'));
                
                // Check if item already exists in cart
                const existingItem = cart.find(item => item.id === id);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id,
                        name,
                        price,
                        quantity: 1
                    });
                }
                
                updateCart();
            });
        });
    }

    // Update cart display
    function updateCart() {
        // Clear current cart display
        orderItemsEl.innerHTML = '';
        
        if (cart.length === 0) {
            orderItemsEl.innerHTML = '<p class="empty-cart-message">Your cart is empty. Add some delicious items from our menu!</p>';
            orderTotalEl.textContent = '$0.00';
            checkoutBtn.disabled = true;
            return;
        }
        
        // Add each item to cart display
        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'order-item';
            itemEl.innerHTML = `
                <div>
                    <h4>${item.name}</h4>
                    <span>$${item.price.toFixed(2)}</span>
                </div>
                <div class="order-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    <span class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></span>
                </div>
            `;
            orderItemsEl.appendChild(itemEl);
        });
        
        // Calculate and display total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        orderTotalEl.textContent = `$${total.toFixed(2)}`;
        
        // Enable checkout button
        checkoutBtn.disabled = false;
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    cart = cart.filter(item => item.id !== id);
                }
                
                updateCart();
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const item = cart.find(item => item.id === id);
                item.quantity += 1;
                updateCart();
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                cart = cart.filter(item => item.id !== id);
                updateCart();
            });
        });
    }

    // Checkout button functionality
    checkoutBtn.addEventListener('click', () => {
        document.querySelector('.order-summary').style.display = 'none';
        customerInfoForm.style.display = 'block';
        
        // Scroll to form
        customerInfoForm.scrollIntoView({ behavior: 'smooth' });
    });

    // Form submission
    customerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const table = document.getElementById('table').value;
        const notes = document.getElementById('notes').value;
        
        // Create order object
        const order = {
            customer: { name, email, phone, table },
            items: cart,
            notes,
            total: parseFloat(orderTotalEl.textContent.replace('$', '')),
            date: new Date().toISOString()
        };
        
        // In a real application, you would send this to your server
        console.log('Order submitted:', order);
        
        // Show confirmation modal
        orderModal.style.display = 'flex';
        
        // Reset form and cart
        customerForm.reset();
        cart = [];
        updateCart();
        document.querySelector('.order-summary').style.display = 'block';
        customerInfoForm.style.display = 'none';
    });

    // Close modal
    closeModalBtn.addEventListener('click', () => {
        orderModal.style.display = 'none';
    });

    closeModal.addEventListener('click', () => {
        orderModal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === orderModal) {
            orderModal.style.display = 'none';
        }
    });

    // Initialize cart and buttons
    setupAddToCartButtons();
    updateCart();
});