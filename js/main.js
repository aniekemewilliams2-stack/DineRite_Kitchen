/**
 * ==========================================================================
 * Dine'Rite Kitchen - Full Client Application Script
 * Features:
 *  - Mock Menu & Delivery Zones Catalog
 *  - Complete Shopping Cart System (Add, Update, Remove, LocalStorage)
 *  - Checkout Process with WhatsApp Order Generator & Mock Order Storage
 *  - Table Reservation Engine with Real-Time Validation & Booking Storage
 *  - Toast Notification System
 *  - Category Filters & FAQ Accordion
 * ==========================================================================
 */

// --------------------------------------------------------------------------
// 1. Mock Data Catalog
// --------------------------------------------------------------------------
const MOCK_MENU = [
    {
        id: "dish-1",
        name: "Smoky Party Jollof Rice",
        category: "rice",
        price: 4500,
        desc: "Aromatic long-grain rice infused with rich tomato-pepper reduction, woodsmoke essence, sweet fried dodo, and spiced protein.",
        image: "images/menu/jollof-rice.jpg",
        tag: "Signature"
    },
    {
        id: "dish-2",
        name: "Native Village Fried Rice",
        category: "rice",
        price: 5000,
        desc: "Stir-fried in spiced palm oil broth with dried prawns, scent leaves, diced cow liver, and sweet peppers for deep rustic flavour.",
        image: "images/menu/native-rice.jpg",
        tag: "Chef's Pick"
    },
    {
        id: "dish-3",
        name: "Creamy Coconut Rice & Beef",
        category: "rice",
        price: 4800,
        desc: "Steamed in fresh coconut milk reduction with sweet bell peppers, baby carrots, and succulent roasted beef chunks.",
        image: "images/menu/coconut-rice.jpg",
        tag: "Special"
    },
    {
        id: "dish-4",
        name: "Akwa Ibom Afang Soup",
        category: "soups",
        price: 6000,
        desc: "The crown jewel of Uyo cuisine. Finely shredded okazi, tender waterleaf, periwinkles, stockfish head, kpomo, and pounded yam.",
        image: "images/menu/afang-soup.jpg",
        tag: "Akwa Ibom Pride"
    },
    {
        id: "dish-5",
        name: "Royal Edikang Ikong Soup",
        category: "soups",
        price: 6500,
        desc: "Luxurious, nutrient-packed vegetable soup made with premium fluted pumpkin leaves, waterleaf, smoked fish, and goat meat.",
        image: "images/menu/edikang-ikong.jpg",
        tag: "Traditional"
    },
    {
        id: "dish-6",
        name: "Velvet Seafood Okro Soup",
        category: "soups",
        price: 7000,
        desc: "Freshly crushed crunchy okro cooked with whole Atlantic sea prawns, fresh blue crab, croaker fish fillet, and aromatic uziza leaves.",
        image: "images/menu/seafood-okro.jpg",
        tag: "Seafood"
    },
    {
        id: "dish-7",
        name: "Charcoal Flame Catfish & Bole",
        category: "grills",
        price: 7500,
        desc: "Fresh point-and-kill catfish flame-grilled on charcoal, basted with fiery native pepper sauce, and paired with roasted plantains.",
        image: "images/menu/catfish-bole.jpg",
        tag: "Grilled Fresh"
    },
    {
        id: "dish-8",
        name: "Spicy Peppered Goat Meat (Asun)",
        category: "grills",
        price: 4000,
        desc: "Bite-sized chunks of tender roasted chevon tossed in coarse habanero pepper, caramelized onions, and native spices.",
        image: "images/menu/asun-goat-meat.jpg",
        tag: "Hot & Spicy"
    },
    {
        id: "dish-9",
        name: "Crispy Peppered Turkey Wings",
        category: "grills",
        price: 4500,
        desc: "Deep seasoned jumbo turkey wings boiled in aromatic spices, fried crisp, and glazed in thick spicy Nigerian pepper stew.",
        image: "images/menu/peppered-poultry.jpg",
        tag: "Customer Favorite"
    }
];

const DELIVERY_ZONES = {
    "ewet-housing": { name: "Ewet Housing Estate", fee: 800 },
    "shelter-afrique": { name: "Shelter Afrique Estate", fee: 1000 },
    "osongama": { name: "Osongama Estate", fee: 1000 },
    "ring-road": { name: "Ring Road 1, 2 & 3", fee: 1200 },
    "aka-road": { name: "Aka Road & Environs", fee: 1000 },
    "abak-road": { name: "Abak Road & Federal Housing", fee: 1200 },
    "ikot-ekpene": { name: "Ikot Ekpene Road", fee: 1500 },
    "nwaniba": { name: "Nwaniba & Uniuyo Main Campus", fee: 1500 },
    "pickup": { name: "Store Pickup (100 Udo Udoma Ave)", fee: 0 }
};

const KITCHEN_WHATSAPP_NUMBER = "234XXXXXXXXXX";

// --------------------------------------------------------------------------
// 2. Application State
// --------------------------------------------------------------------------
const AppState = {
    cart: [],
    orderType: "delivery", // 'delivery' or 'pickup'
    selectedZone: "ewet-housing",
    ordersHistory: [],
    reservationsHistory: []
};

// --------------------------------------------------------------------------
// 3. Storage Utilities
// --------------------------------------------------------------------------
function loadStateFromStorage() {
    try {
        const storedCart = localStorage.getItem("dinerite_cart");
        if (storedCart) AppState.cart = JSON.parse(storedCart);

        const storedOrders = localStorage.getItem("dinerite_orders");
        if (storedOrders) AppState.ordersHistory = JSON.parse(storedOrders);

        const storedReservations = localStorage.getItem("dinerite_reservations");
        if (storedReservations) AppState.reservationsHistory = JSON.parse(storedReservations);
    } catch (err) {
        console.warn("Could not load local storage data:", err);
    }
}

function saveCartToStorage() {
    try {
        localStorage.setItem("dinerite_cart", JSON.stringify(AppState.cart));
    } catch (err) {
        console.warn("Could not save cart to storage:", err);
    }
}

function saveOrderToStorage(order) {
    try {
        AppState.ordersHistory.unshift(order);
        localStorage.setItem("dinerite_orders", JSON.stringify(AppState.ordersHistory));
    } catch (err) {
        console.warn("Could not save order to storage:", err);
    }
}

function saveReservationToStorage(res) {
    try {
        AppState.reservationsHistory.unshift(res);
        localStorage.setItem("dinerite_reservations", JSON.stringify(AppState.reservationsHistory));
    } catch (err) {
        console.warn("Could not save reservation to storage:", err);
    }
}

// --------------------------------------------------------------------------
// 4. Cart Calculations & Operations
// --------------------------------------------------------------------------
function formatCurrency(amount) {
    return "₦" + amount.toLocaleString("en-NG");
}

function getCartSubtotal() {
    return AppState.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function getDeliveryFee() {
    if (AppState.orderType === "pickup") return 0;
    const zone = DELIVERY_ZONES[AppState.selectedZone];
    return zone ? zone.fee : 1000;
}

function getGrandTotal() {
    return getCartSubtotal() + getDeliveryFee();
}

function addToCart(dishId, qty = 1) {
    const dish = MOCK_MENU.find(d => d.id === dishId);
    if (!dish) return;

    const existingIndex = AppState.cart.findIndex(item => item.id === dishId);
    if (existingIndex > -1) {
        AppState.cart[existingIndex].qty += qty;
    } else {
        AppState.cart.push({
            id: dish.id,
            name: dish.name,
            price: dish.price,
            image: dish.image,
            qty: qty
        });
    }

    saveCartToStorage();
    updateCartUI();
    showToast(`Added ${dish.name} to cart!`, "success");
}

function updateCartItemQty(dishId, delta) {
    const itemIndex = AppState.cart.findIndex(item => item.id === dishId);
    if (itemIndex === -1) return;

    AppState.cart[itemIndex].qty += delta;

    if (AppState.cart[itemIndex].qty <= 0) {
        const removedItem = AppState.cart.splice(itemIndex, 1)[0];
        showToast(`Removed ${removedItem.name} from cart`, "info");
    }

    saveCartToStorage();
    updateCartUI();
}

function removeFromCart(dishId) {
    const itemIndex = AppState.cart.findIndex(item => item.id === dishId);
    if (itemIndex > -1) {
        const removedItem = AppState.cart.splice(itemIndex, 1)[0];
        saveCartToStorage();
        updateCartUI();
        showToast(`Removed ${removedItem.name}`, "info");
    }
}

function clearCart() {
    AppState.cart = [];
    saveCartToStorage();
    updateCartUI();
}

// --------------------------------------------------------------------------
// 5. DOM Elements & UI Rendering
// --------------------------------------------------------------------------
function updateCartUI() {
    // 1. Update Cart Badge Counters
    const cartBadges = document.querySelectorAll(".cart-badge");
    const totalItems = AppState.cart.reduce((total, item) => total + item.qty, 0);

    cartBadges.forEach(badge => {
        badge.textContent = totalItems;
        badge.classList.add("bump");
        setTimeout(() => badge.classList.remove("bump"), 300);
    });

    // 2. Render Cart Drawer Items
    const cartContainer = document.getElementById("cart-items-container");
    const cartSubtotalEl = document.getElementById("cart-subtotal");
    const cartDeliveryEl = document.getElementById("cart-delivery-fee");
    const cartGrandTotalEl = document.getElementById("cart-grand-total");
    const btnProceedCheckout = document.getElementById("btn-proceed-checkout");

    if (!cartContainer) return;

    if (AppState.cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="cart-empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                <h4>Your Cart is Empty</h4>
                <p>Explore our menu and add authentic smoky jollof and native soups.</p>
                <a href="#menu" class="primary-btn" onclick="closeCartDrawer()">View Dishes</a>
            </div>
        `;
        if (cartSubtotalEl) cartSubtotalEl.textContent = formatCurrency(0);
        if (cartDeliveryEl) cartDeliveryEl.textContent = formatCurrency(0);
        if (cartGrandTotalEl) cartGrandTotalEl.textContent = formatCurrency(0);
        if (btnProceedCheckout) btnProceedCheckout.disabled = true;
        return;
    }

    if (btnProceedCheckout) btnProceedCheckout.disabled = false;

    // Render active cart items
    let itemsHTML = '<div class="cart-items-list">';
    AppState.cart.forEach(item => {
        itemsHTML += `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                    <h5 class="cart-item-title">${item.name}</h5>
                    <div class="cart-item-price">${formatCurrency(item.price * item.qty)}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="qty-control">
                        <button type="button" class="qty-btn" onclick="updateCartItemQty('${item.id}', -1)" aria-label="Decrease quantity">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                        <span class="qty-count">${item.qty}</span>
                        <button type="button" class="qty-btn" onclick="updateCartItemQty('${item.id}', 1)" aria-label="Increase quantity">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        </button>
                    </div>
                    <button type="button" class="btn-remove-item" onclick="removeFromCart('${item.id}')" aria-label="Remove item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
        `;
    });
    itemsHTML += "</div>";

    cartContainer.innerHTML = itemsHTML;

    const subtotal = getCartSubtotal();
    const delivery = getDeliveryFee();
    const grandTotal = subtotal + delivery;

    if (cartSubtotalEl) cartSubtotalEl.textContent = formatCurrency(subtotal);
    if (cartDeliveryEl) cartDeliveryEl.textContent = formatCurrency(delivery);
    if (cartGrandTotalEl) cartGrandTotalEl.textContent = formatCurrency(grandTotal);
}

// --------------------------------------------------------------------------
// 6. Drawer & Modal Controller
// --------------------------------------------------------------------------
function openCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("cart-backdrop");
    if (drawer && backdrop) {
        drawer.classList.add("active");
        backdrop.classList.add("active");
        document.body.classList.add("modal-open");
    }
}

function closeCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("cart-backdrop");
    if (drawer && backdrop) {
        drawer.classList.remove("active");
        backdrop.classList.remove("active");
        document.body.classList.remove("modal-open");
    }
}

function openCheckoutModal() {
    if (AppState.cart.length === 0) {
        showToast("Please add items to your cart before checking out.", "error");
        return;
    }
    closeCartDrawer();

    const modal = document.getElementById("checkout-modal");
    if (!modal) return;

    // Populate checkout item summary snippet
    const summaryContainer = document.getElementById("checkout-items-summary");
    if (summaryContainer) {
        let snippet = "";
        AppState.cart.forEach(item => {
            snippet += `
                <div class="checkout-item-row">
                    <span>${item.qty}x ${item.name}</span>
                    <span>${formatCurrency(item.price * item.qty)}</span>
                </div>
            `;
        });
        summaryContainer.innerHTML = snippet;
    }

    updateCheckoutTotals();
    modal.classList.add("active");
    document.body.classList.add("modal-open");
}

function closeCheckoutModal() {
    const modal = document.getElementById("checkout-modal");
    if (modal) {
        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
    }
}

function updateCheckoutTotals() {
    const subtotal = getCartSubtotal();
    const delivery = getDeliveryFee();
    const total = subtotal + delivery;

    const subEl = document.getElementById("checkout-subtotal");
    const delEl = document.getElementById("checkout-delivery-fee");
    const totEl = document.getElementById("checkout-grand-total");

    if (subEl) subEl.textContent = formatCurrency(subtotal);
    if (delEl) delEl.textContent = formatCurrency(delivery);
    if (totEl) totEl.textContent = formatCurrency(total);

    // Show/hide address field based on order type
    const addressGroup = document.getElementById("delivery-address-group");
    const zoneGroup = document.getElementById("delivery-zone-group");
    if (addressGroup && zoneGroup) {
        if (AppState.orderType === "pickup") {
            addressGroup.style.display = "none";
            zoneGroup.style.display = "none";
        } else {
            addressGroup.style.display = "block";
            zoneGroup.style.display = "block";
        }
    }
}

// --------------------------------------------------------------------------
// 7. Order Placement & WhatsApp Integration
// --------------------------------------------------------------------------
function handleCheckoutFormSubmit(e) {
    e.preventDefault();

    const nameInput = document.getElementById("cust-name");
    const phoneInput = document.getElementById("cust-phone");
    const addressInput = document.getElementById("cust-address");
    const zoneSelect = document.getElementById("cust-zone");
    const paymentSelect = document.getElementById("cust-payment");
    const notesInput = document.getElementById("cust-notes");

    if (!nameInput.value.trim() || !phoneInput.value.trim()) {
        showToast("Please provide your full name and phone number.", "error");
        return;
    }

    if (AppState.orderType === "delivery" && !addressInput.value.trim()) {
        showToast("Please provide your delivery address in Uyo.", "error");
        return;
    }

    const orderId = `DRK-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const subtotal = getCartSubtotal();
    const deliveryFee = getDeliveryFee();
    const grandTotal = subtotal + deliveryFee;
    const selectedZoneName = AppState.orderType === "pickup" 
        ? "Pickup at Restaurant" 
        : DELIVERY_ZONES[AppState.selectedZone].name;

    const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        customer: {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            address: AppState.orderType === "delivery" ? addressInput.value.trim() : "Store Pickup",
            zone: selectedZoneName,
            paymentMethod: paymentSelect ? paymentSelect.value : "Instant Transfer",
            notes: notesInput ? notesInput.value.trim() : ""
        },
        type: AppState.orderType,
        items: [...AppState.cart],
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        grandTotal: grandTotal,
        status: "Confirmed"
    };

    saveOrderToStorage(newOrder);

    // Build WhatsApp Order String
    let waText = `*NEW ORDER - DINE'RITE KITCHEN*\n`;
    waText += `*Order ID:* ${orderId}\n`;
    waText += `*Customer:* ${newOrder.customer.name}\n`;
    waText += `*Phone:* ${newOrder.customer.phone}\n`;
    waText += `*Type:* ${newOrder.type === "pickup" ? "Pickup at Kitchen" : "Delivery"}\n`;
    if (newOrder.type === "delivery") {
        waText += `*Area:* ${newOrder.customer.zone}\n`;
        waText += `*Address:* ${newOrder.customer.address}\n`;
    }
    waText += `\n*ORDER ITEMS:*\n`;
    newOrder.items.forEach(it => {
        waText += `• ${it.qty}x ${it.name} - ${formatCurrency(it.price * it.qty)}\n`;
    });
    waText += `\n*Subtotal:* ${formatCurrency(newOrder.subtotal)}\n`;
    waText += `*Delivery Fee:* ${formatCurrency(newOrder.deliveryFee)}\n`;
    waText += `*GRAND TOTAL:* ${formatCurrency(newOrder.grandTotal)}\n`;
    waText += `*Payment:* ${newOrder.customer.paymentMethod}\n`;
    if (newOrder.customer.notes) {
        waText += `*Special Note:* ${newOrder.customer.notes}\n`;
    }

    const waURL = `https://wa.me/${KITCHEN_WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

    // Show Success Receipt Modal
    closeCheckoutModal();
    showOrderReceipt(newOrder, waURL);

    // Clear active cart
    clearCart();
    showToast("Order placed successfully!", "success");
}

function showOrderReceipt(order, waURL) {
    const modal = document.getElementById("order-receipt-modal");
    if (!modal) return;

    document.getElementById("receipt-order-id").textContent = order.id;
    document.getElementById("receipt-customer-name").textContent = order.customer.name;
    document.getElementById("receipt-customer-phone").textContent = order.customer.phone;
    document.getElementById("receipt-order-type").textContent = order.type === "pickup" ? "Pickup at Kitchen" : `Delivery (${order.customer.zone})`;
    document.getElementById("receipt-order-address").textContent = order.customer.address;
    document.getElementById("receipt-order-total").textContent = formatCurrency(order.grandTotal);

    const waBtn = document.getElementById("btn-send-order-wa");
    if (waBtn) {
        waBtn.href = waURL;
    }

    modal.classList.add("active");
    document.body.classList.add("modal-open");
}

function closeOrderReceiptModal() {
    const modal = document.getElementById("order-receipt-modal");
    if (modal) {
        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
    }
}

// --------------------------------------------------------------------------
// 8. Table Reservation Engine
// --------------------------------------------------------------------------
function handleReservationSubmit(e) {
    e.preventDefault();

    const nameInput = document.getElementById("res-name");
    const phoneInput = document.getElementById("res-phone");
    const dateInput = document.getElementById("res-date");
    const timeSelect = document.getElementById("res-time");
    const guestsSelect = document.getElementById("res-guests");
    const seatingSelect = document.getElementById("res-seating");
    const occasionSelect = document.getElementById("res-occasion");
    const notesInput = document.getElementById("res-notes");

    if (!nameInput.value.trim() || !phoneInput.value.trim() || !dateInput.value) {
        showToast("Please fill in your name, phone number, and reservation date.", "error");
        return;
    }

    const bookingId = `DRK-RES-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReservation = {
        id: bookingId,
        dateCreated: new Date().toISOString(),
        guestName: nameInput.value.trim(),
        phone: phoneInput.value.trim(),
        bookingDate: dateInput.value,
        bookingTime: timeSelect.value,
        guests: guestsSelect.value,
        seating: seatingSelect.value,
        occasion: occasionSelect.value,
        notes: notesInput ? notesInput.value.trim() : "",
        status: "Table Confirmed"
    };

    saveReservationToStorage(newReservation);

    // Build WhatsApp Confirmation Message
    let waText = `*TABLE RESERVATION - DINE'RITE KITCHEN*\n`;
    waText += `*Booking Reference:* ${bookingId}\n`;
    waText += `*Guest Name:* ${newReservation.guestName}\n`;
    waText += `*Phone:* ${newReservation.phone}\n`;
    waText += `*Date:* ${newReservation.bookingDate}\n`;
    waText += `*Time Slot:* ${newReservation.bookingTime}\n`;
    waText += `*Party Size:* ${newReservation.guests}\n`;
    waText += `*Seating Area:* ${newReservation.seating}\n`;
    waText += `*Occasion:* ${newReservation.occasion}\n`;
    if (newReservation.notes) {
        waText += `*Special Requests:* ${newReservation.notes}\n`;
    }

    const waURL = `https://wa.me/${KITCHEN_WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

    // Reset Form
    e.target.reset();

    // Show Reservation Receipt Modal
    showReservationReceipt(newReservation, waURL);
    showToast("Table reserved successfully!", "success");
}

function showReservationReceipt(res, waURL) {
    const modal = document.getElementById("reservation-receipt-modal");
    if (!modal) return;

    document.getElementById("res-receipt-code").textContent = res.id;
    document.getElementById("res-receipt-name").textContent = res.guestName;
    document.getElementById("res-receipt-datetime").textContent = `${res.bookingDate} at ${res.bookingTime}`;
    document.getElementById("res-receipt-guests").textContent = res.guests;
    document.getElementById("res-receipt-seating").textContent = res.seating;
    document.getElementById("res-receipt-occasion").textContent = res.occasion;

    const waBtn = document.getElementById("btn-send-res-wa");
    if (waBtn) {
        waBtn.href = waURL;
    }

    modal.classList.add("active");
    document.body.classList.add("modal-open");
}

function closeReservationReceiptModal() {
    const modal = document.getElementById("reservation-receipt-modal");
    if (modal) {
        modal.classList.remove("active");
        document.body.classList.remove("modal-open");
    }
}

// --------------------------------------------------------------------------
// 9. Toast Notification System
// --------------------------------------------------------------------------
function showToast(message, type = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let iconSVG = `
        <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    `;
    if (type === "error") {
        iconSVG = `
            <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
        `;
    }

    toast.innerHTML = `${iconSVG}<span>${message}</span>`;
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    // Auto remove after 3.5 seconds
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 350);
    }, 3500);
}

// --------------------------------------------------------------------------
// 10. Initialization & Event Listeners
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // 1. Load Stored Data
    loadStateFromStorage();
    updateCartUI();

    // 2. Mobile Menu Toggle
    const siteHeader = document.querySelector(".site-header");
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");
    const navItems = document.querySelectorAll(".nav-links a");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", String(!isExpanded));
            navLinks.classList.toggle("active");
        });

        navItems.forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        document.addEventListener("click", e => {
            if (!siteHeader.contains(e.target) && navLinks.classList.contains("active")) {
                navLinks.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // 3. Cart Drawer Toggle Listeners
    const cartTriggerBtns = document.querySelectorAll(".cart-trigger-btn");
    const cartCloseBtn = document.getElementById("cart-close-btn");
    const cartBackdrop = document.getElementById("cart-backdrop");

    cartTriggerBtns.forEach(btn => btn.addEventListener("click", openCartDrawer));
    if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCartDrawer);
    if (cartBackdrop) cartBackdrop.addEventListener("click", closeCartDrawer);

    // 4. Checkout Modal Listeners
    const btnProceedCheckout = document.getElementById("btn-proceed-checkout");
    const btnCloseCheckout = document.getElementById("btn-close-checkout");
    const checkoutModal = document.getElementById("checkout-modal");
    const checkoutForm = document.getElementById("checkout-form");

    if (btnProceedCheckout) btnProceedCheckout.addEventListener("click", openCheckoutModal);
    if (btnCloseCheckout) btnCloseCheckout.addEventListener("click", closeCheckoutModal);
    if (checkoutForm) checkoutForm.addEventListener("submit", handleCheckoutFormSubmit);

    // Order Type Tabs in Checkout (Delivery vs Pickup)
    const typeTabBtns = document.querySelectorAll(".type-tab-btn");
    typeTabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            typeTabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            AppState.orderType = btn.getAttribute("data-type");
            updateCheckoutTotals();
            updateCartUI();
        });
    });

    // Delivery Zone Select Change
    const custZoneSelect = document.getElementById("cust-zone");
    if (custZoneSelect) {
        custZoneSelect.addEventListener("change", (e) => {
            AppState.selectedZone = e.target.value;
            updateCheckoutTotals();
            updateCartUI();
        });
    }

    // 5. Order Receipt Modal Close
    const btnCloseReceipt = document.getElementById("btn-close-receipt");
    if (btnCloseReceipt) btnCloseReceipt.addEventListener("click", closeOrderReceiptModal);

    // 6. Reservation Form Handling
    const reservationForm = document.getElementById("reservation-form");
    if (reservationForm) {
        // Auto set minimum date to today
        const dateInput = document.getElementById("res-date");
        if (dateInput) {
            const todayStr = new Date().toISOString().split("T")[0];
            dateInput.min = todayStr;
            dateInput.value = todayStr;
        }
        reservationForm.addEventListener("submit", handleReservationSubmit);
    }

    const btnCloseResReceipt = document.getElementById("btn-close-res-receipt");
    if (btnCloseResReceipt) btnCloseResReceipt.addEventListener("click", closeReservationReceiptModal);

    // 7. Menu Category Filter Tabs
    const filterButtons = document.querySelectorAll(".filter-btn");
    const foodCards = document.querySelectorAll(".food-card");

    if (filterButtons.length > 0 && foodCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                filterButtons.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");

                const targetCategory = btn.getAttribute("data-filter");

                foodCards.forEach(card => {
                    const cardCategory = card.getAttribute("data-category");
                    if (targetCategory === "all" || cardCategory === targetCategory) {
                        card.classList.remove("hidden");
                    } else {
                        card.classList.add("hidden");
                    }
                });
            });
        });
    }

    // 8. FAQ Accordion
    const faqQuestions = document.querySelectorAll(".faq-question");
    faqQuestions.forEach(question => {
        question.addEventListener("click", () => {
            const item = question.parentElement;
            const isActive = item.classList.contains("active");

            document.querySelectorAll(".faq-item").forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove("active");
                    const otherBtn = otherItem.querySelector(".faq-question");
                    if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
                }
            });

            item.classList.toggle("active", !isActive);
            question.setAttribute("aria-expanded", String(!isActive));
        });
    });

    // 9. Global Escape Key Listener for Modals & Drawers
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeCartDrawer();
            closeCheckoutModal();
            closeOrderReceiptModal();
            closeReservationReceiptModal();
        }
    });

    // 10. Active Nav Scrollspy
    const sections = document.querySelectorAll("section[id]");
    function updateActiveNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 140;
            const sectionId = current.getAttribute("id");

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }
    window.addEventListener("scroll", updateActiveNavLink, { passive: true });

    // 11. Copyright Year
    const copyrightYearEl = document.getElementById("copyright-year");
    if (copyrightYearEl) {
        copyrightYearEl.textContent = new Date().getFullYear();
    }
});

// Expose necessary functions to window for inline onclick handlers
window.addToCart = addToCart;
window.updateCartItemQty = updateCartItemQty;
window.removeFromCart = removeFromCart;
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
window.openCheckoutModal = openCheckoutModal;
window.closeCheckoutModal = closeCheckoutModal;
window.closeOrderReceiptModal = closeOrderReceiptModal;
window.closeReservationReceiptModal = closeReservationReceiptModal;
