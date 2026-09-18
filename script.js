// =========================
// DATA PRODUK
// =========================

const products = [
    {
        id: 1,
        name: "hijab paris premium",
        category: "fashion",
        price: 20000,
        rating: 4.8,
        badge: "Terlaris",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"
    },

    {
        id: 2,
        name: "Hoodie Premium",
        category: "fashion",
        price: 249000,
        rating: 4.7,
        badge: "Baru",
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600"
    },

    {
        id: 3,
        name: "Smart Watch",
        category: "elektronik",
        price: 599000,
        rating: 4.9,
        badge: "Promo",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"
    },

    {
        id: 4,
        name: "Headphone Wireless",
        category: "elektronik",
        price: 449000,
        rating: 4.8,
        badge: "",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"
    },

    {
        id: 5,
        name: "Tas Selempang",
        category: "aksesoris",
        price: 179000,
        rating: 4.6,
        badge: "Baru",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"
    },

    {
        id: 6,
        name: "Kacamata Fashion",
        category: "aksesoris",
        price: 25000,
        rating: 4.5,
        badge: "",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600"
    },

    {
        id: 7,
        name: "T-Shirt Basic",
        category: "fashion",
        price: 99000,
        rating: 4.7,
        badge: "Hemat",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"
    },

    {
        id: 8,
        name: "Speaker Bluetooth",
        category: "elektronik",
        price: 349000,
        rating: 4.8,
        badge: "",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600"

        
    }
];


// =========================
// CART
// =========================

let cart = JSON.parse(localStorage.getItem("shopkita_cart")) || [];


// =========================
// ELEMENT
// =========================

const productGrid =
    document.getElementById("productGrid");

const cartItems =
    document.getElementById("cartItems");

const cartCount =
    document.getElementById("cartCount");

const cartTotal =
    document.getElementById("cartTotal");

const cartSidebar =
    document.getElementById("cartSidebar");

const overlay =
    document.getElementById("overlay");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


// =========================
// FORMAT RUPIAH
// =========================

function formatRupiah(number) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }
    ).format(number);

}


// =========================
// RENDER PRODUCTS
// =========================

function renderProducts(category = "all", keyword = "") {

    const filteredProducts = products.filter(product => {

        const categoryMatch =
            category === "all" ||
            product.category === category;

        const keywordMatch =
            product.name
                .toLowerCase()
                .includes(keyword.toLowerCase());

        return categoryMatch && keywordMatch;
    });


    if (filteredProducts.length === 0) {

        productGrid.innerHTML = `
            <div style="
                grid-column: 1/-1;
                text-align:center;
                padding:50px;
                color:#999;
            ">
                <i class="fa-solid fa-box-open"
                   style="font-size:50px;margin-bottom:15px;">
                </i>

                <p>Produk tidak ditemukan.</p>
            </div>
        `;

        return;
    }


    productGrid.innerHTML =
        filteredProducts.map(product => {

            return `
                <div class="product-card">

                    <div class="product-image">

                        ${
                            product.badge
                            ?
                            `<span class="product-badge">
                                ${product.badge}
                            </span>`
                            :
                            ""
                        }

                        <img
                            src="${product.image}"
                            alt="${product.name}"
                            loading="lazy"
                        >

                    </div>


                    <div class="product-info">

                        <span class="product-category">
                            ${product.category}
                        </span>

                        <h3 class="product-name">
                            ${product.name}
                        </h3>

                        <div class="product-rating">

                            ${getStars(product.rating)}

                            <span>
                                ${product.rating}
                            </span>

                        </div>


                        <div class="product-bottom">

                            <span class="product-price">
                                ${formatRupiah(product.price)}
                            </span>

                            <button
                                class="add-cart"
                                onclick="addToCart(${product.id})"
                                title="Tambah ke keranjang"
                            >
                                <i class="fa-solid fa-cart-plus"></i>
                            </button>

                        </div>

                    </div>

                </div>
            `;

        }).join("");
}


// =========================
// STAR
// =========================

function getStars(rating) {

    let stars = "";

    for (let i = 1; i <= 5; i++) {

        if (i <= Math.round(rating)) {
            stars +=
                `<i class="fa-solid fa-star"></i>`;
        } else {
            stars +=
                `<i class="fa-regular fa-star"></i>`;
        }

    }

    return stars;
}


// =========================
// ADD CART
// =========================

function addToCart(productId) {

    const product =
        products.find(
            product => product.id === productId
        );

    const existing =
        cart.find(
            item => item.id === productId
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }


    saveCart();

    showToast(
        `${product.name} ditambahkan ke keranjang`
    );
}


// =========================
// SAVE CART
// =========================

function saveCart() {

    localStorage.setItem(
        "shopkita_cart",
        JSON.stringify(cart)
    );

    renderCart();
}


// =========================
// RENDER CART
// =========================

function renderCart() {

    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const totalPrice =
        cart.reduce(
            (total, item) =>
                total +
                (item.price * item.quantity),
            0
        );


    cartCount.textContent =
        totalQuantity;

    cartTotal.textContent =
        formatRupiah(totalPrice);


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div class="empty-cart">

                <i class="fa-solid fa-cart-shopping"></i>

                <p>
                    Keranjang masih kosong
                </p>

            </div>
        `;

        return;
    }


    cartItems.innerHTML =
        cart.map(item => {

            return `
                <div class="cart-item">

                    <div class="cart-item-image">
                        <img
                            src="${item.image}"
                            alt="${item.name}"
                        >
                    </div>


                    <div>

                        <h4>
                            ${item.name}
                        </h4>

                        <span class="cart-item-price">
                            ${formatRupiah(item.price)}
                        </span>


                        <div class="quantity">

                            <button
                                onclick="changeQuantity(
                                    ${item.id},
                                    -1
                                )"
                            >
                                -
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                onclick="changeQuantity(
                                    ${item.id},
                                    1
                                )"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <button
                        class="remove-item"
                        onclick="removeFromCart(${item.id})"
                        title="Hapus"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>
            `;

        }).join("");
}


// =========================
// CHANGE QUANTITY
// =========================

function changeQuantity(productId, change) {

    const item =
        cart.find(
            item => item.id === productId
        );

    if (!item) return;


    item.quantity += change;


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id !== productId
            );
    }


    saveCart();
}


// =========================
// REMOVE CART
// =========================

function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );

    saveCart();

    showToast("Produk dihapus dari keranjang");
}


// =========================
// OPEN CART
// =========================

function openCart() {

    cartSidebar.classList.add("active");

    overlay.classList.add("active");

    document.body.style.overflow = "hidden";
}


// =========================
// CLOSE CART
// =========================

function closeCart() {

    cartSidebar.classList.remove("active");

    overlay.classList.remove("active");

    document.body.style.overflow = "";
}


// =========================
// TOAST
// =========================

let toastTimer;

function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


// =========================
// FILTER
// =========================

document
    .querySelectorAll(".filter-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".filter-btn")
                    .forEach(btn =>
                        btn.classList.remove("active")
                    );

                button.classList.add("active");


                const category =
                    button.dataset.category;

                const keyword =
                    document.getElementById(
                        "searchInput"
                    ).value;


                renderProducts(
                    category,
                    keyword
                );

            }
        );

    });


// =========================
// SEARCH
// =========================

document
    .getElementById("searchBtn")
    .addEventListener("click", () => {

        document
            .getElementById("searchBox")
            .classList.toggle("active");

        document
            .getElementById("searchInput")
            .focus();

    });


document
    .getElementById("searchInput")
    .addEventListener("input", function () {

        const keyword =
            this.value;

        const activeCategory =
            document
                .querySelector(".filter-btn.active")
                .dataset.category;

        renderProducts(
            activeCategory,
            keyword
        );

    });


// =========================
// MOBILE MENU
// =========================

document
    .getElementById("menuBtn")
    .addEventListener("click", () => {

        document
            .querySelector(".nav-menu")
            .classList.toggle("active");

    });


// =========================
// CART EVENTS
// =========================

document
    .getElementById("cartBtn")
    .addEventListener(
        "click",
        openCart
    );


document
    .getElementById("closeCart")
    .addEventListener(
        "click",
        closeCart
    );


overlay.addEventListener(
    "click",
    closeCart
);


// =========================
// CHECKOUT
// =========================

const checkoutModal =
    document.getElementById("checkoutModal");


document
    .getElementById("checkoutBtn")
    .addEventListener("click", () => {

        if (cart.length === 0) {

            showToast(
                "Keranjang masih kosong"
            );

            return;
        }

        checkoutModal.classList.add("active");

    });


document
    .getElementById("closeModal")
    .addEventListener("click", () => {

        checkoutModal.classList.remove("active");

    });


checkoutModal.addEventListener(
    "click",
    event => {

        if (event.target === checkoutModal) {

            checkoutModal.classList.remove("active");

        }

    }
);


// =========================
// SUBMIT CHECKOUT
// =========================

document
    .getElementById("checkoutForm")
    .addEventListener("submit", event => {

        event.preventDefault();


        const name =
            document.getElementById(
                "customerName"
            ).value;

        const phone =
            document.getElementById(
                "customerPhone"
            ).value;

        const address =
            document.getElementById(
                "customerAddress"
            ).value;

        const payment =
            document.getElementById(
                "paymentMethod"
            ).value;


        console.log({
            name,
            phone,
            address,
            payment,
            cart
        });


        checkoutModal.classList.remove(
            "active"
        );

        closeCart();


        showToast(
            "Pesanan berhasil dibuat!"
        );


        cart = [];

        saveCart();


        event.target.reset();

    });


// =========================
// NEWSLETTER
// =========================

document
    .getElementById("newsletterForm")
    .addEventListener("submit", event => {

        event.preventDefault();

        showToast(
            "Berhasil subscribe newsletter!"
        );

        event.target.reset();

    });


// =========================
// ABOUT
// =========================

function showAboutMessage() {

    showToast(
        "Terima kasih sudah mengunjungi ShopKita!"
    );

}


// =========================
// INITIALIZE
// =========================

renderProducts();

renderCart();
