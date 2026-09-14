/* =========================
   EMAILJS
========================= */

emailjs.init({
    publicKey: "ZG95D2xbqDlg63iZJ"
});


/* =========================
   VARIABLES
========================= */

const menuBtn = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeMenu");
const sideMenu = document.getElementById("sideMenu");
const overlay = document.getElementById("overlay");

const searchBtn = document.getElementById("searchBtn");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");

const productCards = document.querySelectorAll(".product-card");

const productModal = document.getElementById("productModal");
const registerModal = document.getElementById("registerModal");
const favoritesModal = document.getElementById("favoritesModal");
const cartModal = document.getElementById("cartModal");
const contactModal = document.getElementById("contactModal");

const modalProductImage =
    document.getElementById("modalProductImage");

const modalProductName =
    document.getElementById("modalProductName");

const modalProductPrice =
    document.getElementById("modalProductPrice");

const orderBtn =
    document.getElementById("orderBtn");

const sizeWarning =
    document.getElementById("sizeWarning");

const sizeButtons =
    document.querySelectorAll(".size-btn");

const personalizationInput =
    document.getElementById("personalizationInput");

const registerForm =
    document.getElementById("registerForm");

const registerContent =
    document.getElementById("registerContent");

const successMessage =
    document.getElementById("successMessage");

const registeredPhone =
    document.getElementById("registeredPhone");

const finishBtn =
    document.getElementById("finishBtn");

const favoritesBtn =
    document.getElementById("favoritesBtn");

const cartBtn =
    document.getElementById("cartBtn");

const favoritesList =
    document.getElementById("favoritesList");

const cartList =
    document.getElementById("cartList");

const favoritesCount =
    document.getElementById("favoritesCount");

const cartCount =
    document.getElementById("cartCount");

const footerContact =
    document.getElementById("footerContact");

const footerHome =
    document.getElementById("footerHome");


/* =========================
   DATOS GUARDADOS
========================= */

let favorites = JSON.parse(
    localStorage.getItem("anelliaFavorites")
) || [];

let orders = JSON.parse(
    localStorage.getItem("anelliaOrders")
) || [];

let selectedProduct = null;
let selectedSize = null;
let selectedPersonalization = "";


/* =========================
   MENÚ
========================= */

menuBtn.addEventListener("click", () => {

    sideMenu.classList.add("active");
    overlay.classList.add("active");

});

closeMenu.addEventListener("click", closeSideMenu);
overlay.addEventListener("click", closeSideMenu);

function closeSideMenu() {

    sideMenu.classList.remove("active");
    overlay.classList.remove("active");

}


/* =========================
   BUSCADOR
========================= */

searchBtn.addEventListener("click", () => {

    searchBox.classList.toggle("active");

    if (searchBox.classList.contains("active")) {
        searchInput.focus();
    }

});

searchInput.addEventListener("input", () => {

    const text =
        searchInput.value.toLowerCase().trim();

    productCards.forEach(card => {

        const name =
            card.dataset.name.toLowerCase();

        if (name.includes(text)) {

            card.classList.remove("hidden");

        } else {

            card.classList.add("hidden");

        }

    });

});


/* =========================
   FILTROS
========================= */

document.querySelectorAll("[data-filter]")
    .forEach(link => {

        link.addEventListener("click", event => {

            event.preventDefault();

            const category =
                link.dataset.filter;

            filterProducts(category);

            closeSideMenu();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    });


function filterProducts(category = "todos") {

    productCards.forEach(card => {

        if (
            category === "todos" ||
            card.dataset.category === category
        ) {

            card.classList.remove("hidden");

        } else {

            card.classList.add("hidden");

        }

    });

}


/* =========================
   ABRIR PRODUCTO
========================= */

productCards.forEach(card => {

    card.addEventListener("click", event => {

        if (
            event.target.classList.contains(
                "favorite-btn"
            )
        ) {
            return;
        }


        selectedProduct = {

            name: card.dataset.name,

            price: Number(
                card.dataset.price
            ),

            image: card.dataset.image,

            category: card.dataset.category

        };


        selectedSize = null;
        selectedPersonalization = "";


        modalProductImage.src =
            selectedProduct.image;

        modalProductImage.alt =
            selectedProduct.name;


        modalProductName.textContent =
            selectedProduct.name;


        modalProductPrice.textContent =
            formatPrice(
                selectedProduct.price
            );


        sizeButtons.forEach(button => {

            button.classList.remove(
                "selected"
            );

        });


        personalizationInput.value = "";


        sizeWarning.style.display =
            "block";


        productModal.classList.add(
            "active"
        );

    });

});


/* =========================
   TALLAS
========================= */

sizeButtons.forEach(button => {

    button.addEventListener("click", () => {

        selectedSize =
            button.dataset.size;


        sizeButtons.forEach(btn => {

            btn.classList.remove(
                "selected"
            );

        });


        button.classList.add(
            "selected"
        );


        sizeWarning.style.display =
            "none";

    });

});


/* =========================
   PERSONALIZACIÓN
========================= */

personalizationInput.addEventListener(
    "input",
    () => {

        personalizationInput.value =
            personalizationInput.value
                .replace(
                    /[^a-zA-ZáéíóúÁÉÍÓÚñÑ]/g,
                    ""
                )
                .slice(0, 6)
                .toUpperCase();

    }
);


/* =========================
   PEDIR PRODUCTO
========================= */

orderBtn.addEventListener("click", () => {

    if (!selectedSize) {

        sizeWarning.style.display =
            "block";

        return;

    }


    selectedPersonalization =
        personalizationInput.value
            .trim()
            .toUpperCase();


    productModal.classList.remove(
        "active"
    );


    registerContent.classList.remove(
        "hidden"
    );

    successMessage.classList.add(
        "hidden"
    );


    registerForm.reset();


    registerModal.classList.add(
        "active"
    );

});


/* =========================
   REGISTRO Y PEDIDO
========================= */

registerForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        const name =
            document
                .getElementById("customerName")
                .value
                .trim();


        const phone =
            document
                .getElementById("customerPhone")
                .value
                .trim();


        const email =
            document
                .getElementById("customerEmail")
                .value
                .trim();


        const address =
            document
                .getElementById("customerAddress")
                .value
                .trim();


        if (
            !name ||
            !phone ||
            !email ||
            !address
        ) {
            return;
        }


        const personalization =
            selectedPersonalization ||
            "Sin personalización";


        const newOrder = {

            id: Date.now(),

            product:
                selectedProduct.name,

            price:
                selectedProduct.price,

            image:
                selectedProduct.image,

            size:
                selectedSize,

            personalization:
                personalization,

            customer: {

                name:
                    name,

                phone:
                    phone,

                email:
                    email,

                address:
                    address

            },

            date:
                new Date()
                    .toLocaleString("es-CO")

        };


        /* =========================
           ENVIAR A EMAILJS
        ========================= */

        const templateParams = {

            customer_name:
                name,

            customer_phone:
                phone,

            customer_email:
                email,

            customer_address:
                address,

            product_name:
                selectedProduct.name,

            product_size:
                selectedSize,

            product_price:
                formatPrice(
                    selectedProduct.price
                ),

            personalization:
                personalization,

            order_id:
                newOrder.id,

            reply_to:
                email

        };


        try {

            orderBtn.disabled = true;


            await emailjs.send(

                "service_ljas3l8",

                "template_8pkazks",

                templateParams

            );


            /* GUARDAR PEDIDO */

            orders.push(newOrder);


            localStorage.setItem(
                "anelliaOrders",
                JSON.stringify(orders)
            );


            updateCartCount();


            registeredPhone.textContent =
                phone;


            registerContent.classList.add(
                "hidden"
            );

            successMessage.classList.remove(
                "hidden"
            );


        } catch (error) {

            console.error(
                "Error enviando pedido:",
                error
            );


            alert(
                "No pudimos enviar el pedido en este momento. Inténtalo nuevamente."
            );

        } finally {

            orderBtn.disabled = false;

        }

    }
);


/* =========================
   FINALIZAR
========================= */

finishBtn.addEventListener(
    "click",
    () => {

        registerModal.classList.remove(
            "active"
        );


        registerContent.classList.remove(
            "hidden"
        );


        successMessage.classList.add(
            "hidden"
        );


        registerForm.reset();


        selectedProduct = null;
        selectedSize = null;
        selectedPersonalization = "";

    }
);


/* =========================
   FAVORITOS
========================= */

document
    .querySelectorAll(".favorite-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                const card =
                    button.closest(
                        ".product-card"
                    );


                const product = {

                    name:
                        card.dataset.name,

                    price:
                        Number(
                            card.dataset.price
                        ),

                    image:
                        card.dataset.image,

                    category:
                        card.dataset.category

                };


                const exists =
                    favorites.some(
                        item =>
                            item.name ===
                            product.name
                    );


                if (exists) {

                    favorites =
                        favorites.filter(
                            item =>
                                item.name !==
                                product.name
                        );


                    button.textContent =
                        "♡";


                    button.classList.remove(
                        "active"
                    );


                } else {

                    favorites.push(
                        product
                    );


                    button.textContent =
                        "♥";


                    button.classList.add(
                        "active"
                    );

                }


                localStorage.setItem(
                    "anelliaFavorites",
                    JSON.stringify(
                        favorites
                    )
                );


                updateFavoritesCount();

            }
        );

    });


/* =========================
   ACTUALIZAR FAVORITOS
========================= */

function updateFavoritesCount() {

    favoritesCount.textContent =
        favorites.length;


    document
        .querySelectorAll(".product-card")
        .forEach(card => {

            const button =
                card.querySelector(
                    ".favorite-btn"
                );


            const isFavorite =
                favorites.some(
                    item =>
                        item.name ===
                        card.dataset.name
                );


            if (isFavorite) {

                button.textContent =
                    "♥";

                button.classList.add(
                    "active"
                );

            } else {

                button.textContent =
                    "♡";

                button.classList.remove(
                    "active"
                );

            }

        });

}


/* =========================
   MOSTRAR FAVORITOS
========================= */

favoritesBtn.addEventListener(
    "click",
    () => {

        renderFavorites();

        favoritesModal.classList.add(
            "active"
        );

    }
);


function renderFavorites() {

    favoritesList.innerHTML = "";


    if (favorites.length === 0) {

        favoritesList.innerHTML = `
            <div class="empty-list">
                ❤️ Todavía no tienes anillos favoritos.
            </div>
        `;

        return;

    }


    favorites.forEach(product => {

        const item =
            document.createElement("div");


        item.className =
            "favorite-item";


        item.innerHTML = `

            <img
                src="${product.image}"
                alt="${product.name}"
            >

            <div class="favorite-item-info">

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${formatPrice(product.price)}
                </p>

            </div>

            <button class="remove-favorite">
                ♥
            </button>

        `;


        item
            .querySelector(
                ".remove-favorite"
            )
            .addEventListener(
                "click",
                () => {

                    favorites =
                        favorites.filter(
                            favorite =>
                                favorite.name !==
                                product.name
                        );


                    localStorage.setItem(
                        "anelliaFavorites",
                        JSON.stringify(
                            favorites
                        )
                    );


                    updateFavoritesCount();

                    renderFavorites();

                }
            );


        favoritesList.appendChild(item);

    });

}


/* =========================
   BOLSA / PEDIDOS
========================= */

cartBtn.addEventListener(
    "click",
    () => {

        renderOrders();

        cartModal.classList.add(
            "active"
        );

    }
);


function renderOrders() {

    cartList.innerHTML = "";


    if (orders.length === 0) {

        cartList.innerHTML = `
            <div class="empty-list">
                🛍️ Todavía no has realizado ningún pedido.
            </div>
        `;

        return;

    }


    let total = 0;


    orders.forEach(order => {

        total += order.price;


        const item =
            document.createElement("div");


        item.className =
            "cart-item";


        const personalizationText =
            order.personalization &&
            order.personalization !==
            "Sin personalización"
                ? `Personalización: ${order.personalization}`
                : "Sin personalización";


        item.innerHTML = `

            <img
                src="${order.image}"
                alt="${order.product}"
            >

            <div class="cart-item-info">

                <h3>
                    ${order.product}
                </h3>

                <p>
                    Talla: ${order.size}
                </p>

                <p>
                    ${personalizationText}
                </p>

                <p>
                    ${formatPrice(order.price)}
                </p>

                <p>
                    Pedido: ${order.date}
                </p>

            </div>

            <button class="remove-cart">
                ×
            </button>

        `;


        item
            .querySelector(
                ".remove-cart"
            )
            .addEventListener(
                "click",
                () => {

                    orders =
                        orders.filter(
                            savedOrder =>
                                savedOrder.id !==
                                order.id
                        );


                    localStorage.setItem(
                        "anelliaOrders",
                        JSON.stringify(
                            orders
                        )
                    );


                    updateCartCount();

                    renderOrders();

                }
            );


        cartList.appendChild(item);

    });


    const totalElement =
        document.createElement("div");


    totalElement.className =
        "cart-total";


    totalElement.innerHTML = `

        <span>
            Total
        </span>

        <span>
            ${formatPrice(total)}
        </span>

    `;


    cartList.appendChild(
        totalElement
    );

}


/* =========================
   CONTACTOS
========================= */

footerContact.addEventListener(
    "click",
    event => {

        event.preventDefault();

        contactModal.classList.add(
            "active"
        );

    }
);


/* =========================
   INICIO
========================= */

footerHome.addEventListener(
    "click",
    event => {

        event.preventDefault();


        filterProducts("todos");


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
);


/* =========================
   CERRAR MODALES
========================= */

document
    .querySelectorAll("[data-close]")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const modalId =
                    button.dataset.close;


                document
                    .getElementById(modalId)
                    .classList.remove(
                        "active"
                    );

            }
        );

    });


document
    .querySelectorAll(".modal")
    .forEach(modal => {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    modal.classList.remove(
                        "active"
                    );

                }

            }
        );

    });


/* =========================
   ESC PARA CERRAR
========================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            document
                .querySelectorAll(".modal")
                .forEach(modal => {

                    modal.classList.remove(
                        "active"
                    );

                });


            closeSideMenu();

        }

    }
);


/* =========================
   FUNCIONES
========================= */

function updateCartCount() {

    cartCount.textContent =
        orders.length;

}


function formatPrice(price) {

    return new Intl.NumberFormat(
        "es-CO",
        {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }
    ).format(price);

}


/* =========================
   CARGAR DATOS GUARDADOS
========================= */

updateFavoritesCount();

updateCartCount();

filterProducts("todos");
