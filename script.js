document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  // --- DOM Elements ---
  const productModal = document.getElementById("product-modal");
  const closeProductModalBtn = document.getElementById("close-product-modal");
  const modalProductName = document.getElementById("modal-product-name");
  const modalProductImage = document.getElementById("modal-product-image");
  const modalProductDescription = document.getElementById(
    "modal-product-description"
  );
  const modalProductPrice = document.getElementById("modal-product-price");
  const addToBasketBtn = document.getElementById("add-to-basket-btn");

  const basketIcon = document.getElementById("basket-icon");
  const basketCountSpan = document.getElementById("basket-count");

  const orderModal = document.getElementById("order-modal");
  const closeOrderModalBtn = document.getElementById("close-order-modal");
  const basketItemsList = document.getElementById("basket-items-list");
  const orderTotalSpan = document.getElementById("order-total");
  const tableNumberInput = document.getElementById("table-number");
  const confirmOrderBtn = document.getElementById("confirm-order-btn");

  const billModal = document.getElementById("bill-modal");
  const closeBillModalBtn = document.getElementById("close-bill-modal");
  const billDetailsDiv = document.getElementById("bill-details");
  const finalBillTotalSpan = document.getElementById("final-bill-total");

  // Toast Notification elements
  const toastNotification = document.getElementById("toast-notification");
  const toastMessage = document.getElementById("toast-message");

  let basket = []; // Array to store products in the basket
  let selectedProduct = null; // To hold the product currently viewed in the modal

  // --- Product Data (Hardcoded for demonstration) ---
  const products = [
    // Plates
    {
      name: "Steak",
      price: 9,
      image: "img/OurPlate4.webp",
      description:
        "A perfectly grilled steak, served with a side of crispy fries and fresh vegetables. Cooked to your preference.",
    },
    {
      name: "Pasta",
      price: 9,
      image: "img/OurPlate1.jpg",
      description:
        "Delicious pasta tossed in a rich tomato sauce with fresh basil and parmesan cheese.",
    },
    {
      name: "Fried Rice",
      price: 9,
      image: "img/OurPlate2.jpg",
      description:
        "Savory fried rice with a mix of fresh vegetables, tender chicken, and a hint of soy.",
    },
    {
      name: "Lasagna",
      price: 9,
      image: "img/OurPlate3.jpg",
      description:
        "Layers of rich meat sauce, creamy béchamel, and al dente pasta, baked to perfection.",
    },
    // Drinks
    {
      name: "Coffee",
      price: 9,
      image: "img/Coffee.jpg",
      description:
        "A rich and aromatic cup of freshly brewed coffee, perfect to start your day or as an after-meal treat.",
    },
    {
      name: "Mocktail",
      price: 9,
      image: "img/Mocktail.jpg",
      description:
        "Refreshing non-alcoholic mocktail, a delightful blend of tropical fruits and sparkling water.",
    },
    {
      name: "Juice",
      price: 9,
      image: "img/Juice.jpg",
      description:
        "Freshly squeezed fruit juice, choose from orange, apple, or a mix of berries.",
    },
    {
      name: "Soda",
      price: 9,
      image: "img/Soda.jpg",
      description:
        "Classic refreshing soda, available in various popular flavors.",
    },
    // Desserts
    {
      name: "Creme Brulee",
      price: 9,
      image: "img/creme.jpg",
      description:
        "Classic French dessert with a rich custard base topped with a layer of hardened caramelized sugar.",
    },
    {
      name: "Pudding",
      price: 9,
      image: "img/Pudding.jpg",
      description: "Creamy and delicious pudding, a comforting sweet treat.",
    },
    {
      name: "Cookies",
      price: 9,
      image: "img/Cookies.jpg",
      description:
        "Freshly baked assorted cookies, perfect with coffee or tea.",
    },
    {
      name: "Ice Cream",
      price: 9,
      image: "img/Ice Cream.jpg",
      description:
        "A scoop of rich, creamy ice cream. Choose from vanilla, chocolate, or strawberry.",
    },
  ];

  // Function to dynamically render menu items (to ensure consistency with data attributes)
  function renderMenuItems() {
    const menuGrids = document.querySelectorAll(".menu-grid");
    menuGrids.forEach((grid) => {
      const sectionId = grid.closest("section").id;
      grid.innerHTML = ""; // Clear existing items

      let filteredProducts = [];
      if (sectionId === "plates") {
        filteredProducts = products.slice(0, 4);
      } else if (sectionId === "drinks") {
        filteredProducts = products.slice(4, 8);
      } else if (sectionId === "dessert") {
        filteredProducts = products.slice(8, 12);
      }

      filteredProducts.forEach((product) => {
        const menuItemCard = document.createElement("div");
        menuItemCard.classList.add("menu-item-card");
        menuItemCard.dataset.name = product.name;
        menuItemCard.dataset.price = product.price;
        menuItemCard.dataset.image = product.image;
        menuItemCard.dataset.description = product.description;

        menuItemCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="menu-item-image">
                    <div class="menu-item-info">
                        <span class="menu-item-name">${product.name}</span>
                        <span class="menu-item-price">${product.price} DT</span>
                    </div>
                `;
        grid.appendChild(menuItemCard);
      });
    });
  }

  renderMenuItems(); // Call on load

  // --- Toast Notification Function ---
  function showToast(message, type = "success") {
    // type can be 'success', 'error', 'info'
    toastMessage.innerHTML = message;
    toastNotification.style.backgroundColor = ""; // Reset background
    toastNotification.style.color = ""; // Reset color

    if (type === "success") {
      toastNotification.style.backgroundColor = "#a87f4c"; // Your accent color
      toastMessage.innerHTML = `<i class="fas fa-check-circle mr-2"></i> ${message}`;
    } else if (type === "error") {
      toastNotification.style.backgroundColor = "#dc2626"; // Red
      toastMessage.innerHTML = `<i class="fas fa-times-circle mr-2"></i> ${message}`;
    } else {
      // info
      toastNotification.style.backgroundColor = "#3b82f6"; // Blue
      toastMessage.innerHTML = `<i class="fas fa-info-circle mr-2"></i> ${message}`;
    }

    toastNotification.classList.remove("opacity-0");
    toastNotification.classList.add("opacity-100");

    setTimeout(() => {
      toastNotification.classList.remove("opacity-100");
      toastNotification.classList.add("opacity-0");
    }, 3000); // Hide after 3 seconds
  }

  // --- Event Listeners ---

  // Open Product Detail Modal
  document.querySelectorAll(".menu-item-card").forEach((card) => {
    card.addEventListener("click", () => {
      const name = card.dataset.name;
      const price = parseFloat(card.dataset.price);
      const image = card.dataset.image;
      const description = card.dataset.description;

      selectedProduct = { name, price, image, description };

      modalProductName.textContent = name;
      modalProductImage.src = image;
      modalProductDescription.textContent = description;
      modalProductPrice.textContent = price;

      productModal.classList.remove("hidden");
      setTimeout(
        () => productModal.querySelector("div").classList.remove("scale-95"),
        10
      );
    });
  });

  // Close Product Detail Modal
  closeProductModalBtn.addEventListener("click", () => {
    productModal.querySelector("div").classList.add("scale-95");
    setTimeout(() => productModal.classList.add("hidden"), 300);
  });

  // Add to Basket button in Product Detail Modal
  addToBasketBtn.addEventListener("click", () => {
    if (selectedProduct) {
      const existingItem = basket.find(
        (item) => item.name === selectedProduct.name
      );
      if (existingItem) {
        existingItem.quantity++;
      } else {
        basket.push({ ...selectedProduct, quantity: 1 });
      }
      updateBasketCount();
      productModal.querySelector("div").classList.add("scale-95");
      setTimeout(() => productModal.classList.add("hidden"), 300);
      showToast(`${selectedProduct.name} added to basket!`, "success");
    }
  });

  // Open Basket/Order Modal
  basketIcon.addEventListener("click", () => {
    renderBasketItems();
    orderModal.classList.remove("hidden");
    setTimeout(
      () => orderModal.querySelector("div").classList.remove("scale-95"),
      10
    );
  });

  // Close Basket/Order Modal
  closeOrderModalBtn.addEventListener("click", () => {
    orderModal.querySelector("div").classList.add("scale-95");
    setTimeout(() => orderModal.classList.add("hidden"), 300);
  });

  // Confirm Order Button
  confirmOrderBtn.addEventListener("click", () => {
    const tableNumber = tableNumberInput.value.trim();
    if (basket.length === 0) {
      showToast("Your basket is empty. Please add some items.", "error");
      return;
    }
    if (!tableNumber) {
      showToast("Please enter your table number.", "error");
      return;
    }

    // Custom confirmation modal (instead of `confirm()`)
    showConfirmationModal(
      "Are you sure you want to confirm this order?",
      () => {
        generateBill(tableNumber);
        orderModal.querySelector("div").classList.add("scale-95");
        setTimeout(() => orderModal.classList.add("hidden"), 300);
        showToast("Order confirmed!", "success");
      }
    );
  });

  // Close Bill Modal
  closeBillModalBtn.addEventListener("click", () => {
    billModal.querySelector("div").classList.add("scale-95");
    setTimeout(() => billModal.classList.add("hidden"), 300);
  });

  // --- Functions ---

  function updateBasketCount() {
    const totalItems = basket.reduce((sum, item) => sum + item.quantity, 0);
    basketCountSpan.textContent = totalItems;
    if (totalItems > 0) {
      basketCountSpan.classList.remove("hidden");
    } else {
      basketCountSpan.classList.add("hidden");
    }
  }

  function renderBasketItem(item) {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add(
      "flex",
      "justify-between",
      "items-center",
      "py-2",
      "border-b",
      "border-gray-200",
      "last:border-b-0"
    ); // Changed border color for white background
    itemDiv.innerHTML = `
            <div class="flex items-center flex-grow">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-md mr-4">
                <div>
                    <p class="text-gray-900 font-semibold">${item.name}</p>
                    <p class="text-gray-600 text-sm">${item.price} DT each</p>
                </div>
            </div>
            <div class="flex items-center">
                <button data-name="${item.name}" class="quantity-decrease bg-gray-300 text-gray-800 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-400 transition-colors mr-2">-</button>
                <span class="text-gray-900 font-bold w-6 text-center">${item.quantity}</span>
                <button data-name="${item.name}" class="quantity-increase bg-gray-300 text-gray-800 rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-400 transition-colors ml-2">+</button>
                <button data-name="${item.name}" class="remove-item-btn bg-red-600 text-white p-2 rounded-full ml-4 hover:bg-red-700 transition-colors">
                    <i class="fas fa-trash-alt text-sm"></i>
                </button>
            </div>
        `;
    return itemDiv;
  }

  function renderBasketItems() {
    basketItemsList.innerHTML = "";
    let total = 0;

    if (basket.length === 0) {
      basketItemsList.innerHTML =
        '<p class="text-gray-500 text-center py-4">Your basket is empty.</p>';
    } else {
      basket.forEach((item) => {
        basketItemsList.appendChild(renderBasketItem(item));
        total += item.price * item.quantity;
      });
    }
    orderTotalSpan.textContent = total.toFixed(2);

    // Add event listeners for quantity buttons and remove button
    basketItemsList.querySelectorAll(".quantity-decrease").forEach((button) => {
      button.addEventListener("click", (event) => {
        const itemName = event.currentTarget.dataset.name;
        const itemIndex = basket.findIndex((item) => item.name === itemName);
        if (itemIndex > -1) {
          if (basket[itemIndex].quantity > 1) {
            basket[itemIndex].quantity--;
          } else {
            basket.splice(itemIndex, 1); // Remove item if quantity becomes 0
          }
          renderBasketItems(); // Re-render the list
          showToast(`${itemName} quantity updated.`, "info");
        }
      });
    });

    basketItemsList.querySelectorAll(".quantity-increase").forEach((button) => {
      button.addEventListener("click", (event) => {
        const itemName = event.currentTarget.dataset.name;
        const itemIndex = basket.findIndex((item) => item.name === itemName);
        if (itemIndex > -1) {
          basket[itemIndex].quantity++;
          renderBasketItems(); // Re-render the list
          showToast(`${itemName} quantity updated.`, "info");
        }
      });
    });

    basketItemsList.querySelectorAll(".remove-item-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const itemName = event.currentTarget.dataset.name;
        basket = basket.filter((item) => item.name !== itemName);
        renderBasketItems(); // Re-render the list
        showToast(`${itemName} removed from basket.`, "error");
      });
    });
  }

  function generateBill(tableNumber) {
    billDetailsDiv.innerHTML = "";
    let totalBill = 0;

    const billHeader = document.createElement("div");
    billHeader.classList.add("mb-4", "pb-2", "border-b", "border-gray-300"); // Changed border color
    billHeader.innerHTML = `<p class="text-xl font-bold text-[#a87f4c]">Table Number: ${tableNumber}</p>`;
    billDetailsDiv.appendChild(billHeader);

    const itemsContainer = document.createElement("div");
    itemsContainer.classList.add("mb-4");
    basket.forEach((item) => {
      const itemLine = document.createElement("p");
      const itemTotal = item.price * item.quantity;
      itemLine.classList.add(
        "flex",
        "justify-between",
        "text-gray-800",
        "py-1"
      ); // Changed text color
      itemLine.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span class="text-[#a87f4c]">${itemTotal.toFixed(2)} DT</span>
            `;
      itemsContainer.appendChild(itemLine);
      totalBill += itemTotal;
    });
    billDetailsDiv.appendChild(itemsContainer);

    finalBillTotalSpan.textContent = totalBill.toFixed(2);

    billModal.classList.remove("hidden");
    setTimeout(
      () => billModal.querySelector("div").classList.remove("scale-95"),
      10
    );

    // Clear the basket and table number after generating bill
    basket = [];
    tableNumberInput.value = "";
    updateBasketCount();
  }

  // --- Custom Confirmation Modal ---
  // Instead of `confirm()`, we'll create a simple modal for confirmation.
  // Add this to your HTML (outside any other modal, but still hidden):
  /*
    <div id="confirmation-modal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 hidden p-4">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm transform scale-95 transition-transform duration-300">
            <h3 id="confirmation-message" class="text-gray-900 font-bold text-center mb-6 text-xl"></h3>
            <div class="flex justify-around gap-4">
                <button id="confirm-yes-btn" class="flex-1 bg-[#a87f4c] text-white py-2 rounded-lg hover:bg-[#8f6d40] transition-colors">Yes</button>
                <button id="confirm-no-btn" class="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition-colors">No</button>
            </div>
        </div>
    </div>
    */
  // Then add the JS logic for it:

  const confirmationModal = document.createElement("div");
  confirmationModal.id = "confirmation-modal";
  confirmationModal.classList.add(
    "fixed",
    "inset-0",
    "bg-black",
    "bg-opacity-75",
    "flex",
    "items-center",
    "justify-center",
    "z-50",
    "hidden",
    "p-4"
  );
  confirmationModal.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm transform scale-95 transition-transform duration-300">
            <h3 id="confirmation-message" class="text-gray-900 font-bold text-center mb-6 text-xl"></h3>
            <div class="flex justify-around gap-4">
               <button id="confirm-yes-btn" class="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors">Yes</button>

                <button id="confirm-no-btn" class="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition-colors">No</button>
            </div>
        </div>
    `;
  document.body.appendChild(confirmationModal);

  const confirmationMessage = document.getElementById("confirmation-message");
  const confirmYesBtn = document.getElementById("confirm-yes-btn");
  const confirmNoBtn = document.getElementById("confirm-no-btn");
  let confirmationCallback = null;

  function showConfirmationModal(message, callback) {
    confirmationMessage.textContent = message;
    confirmationCallback = callback;
    confirmationModal.classList.remove("hidden");
    setTimeout(
      () => confirmationModal.querySelector("div").classList.remove("scale-95"),
      10
    );
  }

  confirmYesBtn.addEventListener("click", () => {
    if (confirmationCallback) {
      confirmationCallback();
    }
    confirmationModal.querySelector("div").classList.add("scale-95");
    setTimeout(() => confirmationModal.classList.add("hidden"), 300);
  });

  confirmNoBtn.addEventListener("click", () => {
    confirmationModal.querySelector("div").classList.add("scale-95");
    setTimeout(() => confirmationModal.classList.add("hidden"), 300);
  });

  // Initial basket count update on load
  updateBasketCount();
});
