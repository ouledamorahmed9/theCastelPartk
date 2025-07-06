document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  // --- DOM Elements ---
  const productModal = document.getElementById("product-modal");
  const closeProductModalBtn = document.getElementById("close-product-modal");
  const modalProductName = document.getElementById("modal-product-name");
  const modalProductDescription = document.getElementById(
    "modal-product-description"
  );
  const modalProductPrice = document.getElementById("modal-product-price");
  const addToBasketBtn = document.getElementById("add-to-basket-btn");

  // Carousel Elements
  const carouselDisplay = document.getElementById("carousel-display");
  const carouselPrevBtn = document.getElementById("carousel-prev");
  const carouselNextBtn = document.getElementById("carousel-next");
  const carouselIndicators = document.getElementById("carousel-indicators");
  let currentSlideIndex = 0;
  let currentProductMedia = []; // Stores media for the currently displayed product

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
  const billTableNumber = document.getElementById("bill-table-number");

  // Toast Notification elements
  const toastNotification = document.getElementById("toast-notification");
  const toastMessage = document.getElementById("toast-message");

  let basket = []; // Array to store products in the basket
  let selectedProduct = null; // To hold the product currently viewed in the modal

  // --- Product Data (Updated with media arrays) ---
  // Each product now has a 'media' array containing objects with 'type' and 'src'
  const products = [
    // Plates
    {
      name: "Steak",
      price: 9,
      media: [
        { type: "image", src: "img/OurPlate4.webp" },
        { type: "image", src: "img/steak3a.jpg" }, // Example additional image
        { type: "video", src: "img/steakVideo.mp4" }, // Example video (create this file!)
      ],
      description:
        "A perfectly grilled steak, served with a side of crispy fries and fresh vegetables. Cooked to your preference.",
    },
    {
      name: "Pasta",
      price: 9,
      media: [
        { type: "image", src: "img/OurPlate1.jpg" },
        { type: "image", src: "img/pasta2.jpg" },
      ],
      description:
        "Delicious pasta tossed in a rich tomato sauce with fresh basil and parmesan cheese.",
    },
    {
      name: "Fried Rice",
      price: 9,
      media: [{ type: "image", src: "img/OurPlate2.jpg" }],
      description:
        "Savory fried rice with a mix of fresh vegetables, tender chicken, and a hint of soy.",
    },
    {
      name: "Lasagna",
      price: 9,
      media: [{ type: "image", src: "img/OurPlate3.jpg" }],
      description:
        "Layers of rich meat sauce, creamy béchamel, and al dente pasta, baked to perfection.",
    },
    // Drinks
    {
      name: "Coffee",
      price: 9,
      media: [{ type: "image", src: "img/Coffee.jpg" }],
      description:
        "A rich and aromatic cup of freshly brewed coffee, perfect to start your day or as an after-meal treat.",
    },
    {
      name: "Mocktail",
      price: 9,
      media: [{ type: "image", src: "img/Mocktail.jpg" }],
      description:
        "Refreshing non-alcoholic mocktail, a delightful blend of tropical fruits and sparkling water.",
    },
    {
      name: "Juice",
      price: 9,
      media: [{ type: "image", src: "img/Juice.jpg" }],
      description:
        "Freshly squeezed fruit juice, choose from orange, apple, or a mix of berries.",
    },
    {
      name: "Soda",
      price: 9,
      media: [{ type: "image", src: "img/Soda.jpg" }],
      description:
        "Classic refreshing soda, available in various popular flavors.",
    },
    // Desserts
    {
      name: "Creme Brulee",
      price: 9,
      media: [{ type: "image", src: "img/creme.jpg" }],
      description:
        "Classic French dessert with a rich custard base topped with a layer of hardened caramelized sugar.",
    },
    {
      name: "Pudding",
      price: 9,
      media: [{ type: "image", src: "img/Pudding.jpg" }],
      description: "Creamy and delicious pudding, a comforting sweet treat.",
    },
    {
      name: "Cookies",
      price: 9,
      media: [{ type: "image", src: "img/Cookies.jpg" }],
      description:
        "Freshly baked assorted cookies, perfect with coffee or tea.",
    },
    {
      name: "Ice Cream",
      price: 9,
      media: [{ type: "image", src: "img/Ice Cream.jpg" }],
      description:
        "A scoop of rich, creamy ice cream. Choose from vanilla, chocolate, or strawberry.",
    },
  ];

  // Function to dynamically render menu items (to ensure consistency with data attributes)
  // Note: We'll now set a default image for the main card from the product's media array
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
        // Store description here directly, media will be looked up by name
        menuItemCard.dataset.description = product.description;

        // Get the first image from the media array for the card display
        const defaultImage =
          product.media.find((m) => m.type === "image")?.src ||
          "img/placeholder.jpg"; // Fallback placeholder

        menuItemCard.innerHTML = `
                    <img src="${defaultImage}" alt="${product.name}" class="menu-item-image">
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

  // --- Animation Function ---
  function animateToBasket(startElement, callback) {
    // If the start element is null or not an image (e.g., video in carousel),
    // try to find a suitable image within the carousel display
    let imageToAnimate = startElement;
    if (!imageToAnimate || imageToAnimate.tagName.toLowerCase() !== "img") {
      // Try to find the active image in the carousel
      imageToAnimate = carouselDisplay.querySelector(
        '.carousel-item.active[src$=".jpg"], .carousel-item.active[src$=".png"], .carousel-item.active[src$=".webp"]'
      );
      if (!imageToAnimate) {
        // If no image, default to the main modal product image (if it was an img before)
        imageToAnimate = carouselDisplay.querySelector(".carousel-item.active");
        if (
          imageToAnimate &&
          imageToAnimate.tagName.toLowerCase() === "video"
        ) {
          // If it's a video, we can't use its source directly for an image animation,
          // so we'll skip the animation.
          if (callback) callback();
          return;
        }
      }
    }

    // If still no valid image to animate, just run the callback
    if (!imageToAnimate) {
      if (callback) callback();
      return;
    }

    const flyingImg = document.createElement("img");
    flyingImg.src = imageToAnimate.src; // Use the image from the modal or carousel
    flyingImg.classList.add(
      "fixed",
      "object-cover",
      "rounded-full",
      "z-[9999]",
      "transition-transform",
      "duration-700",
      "ease-in"
    );
    flyingImg.style.width = "60px"; // Initial size
    flyingImg.style.height = "60px";
    flyingImg.style.opacity = "1";

    // Get positions
    const startRect = imageToAnimate.getBoundingClientRect(); // Get position from the actual displayed media
    const endRect = basketIcon.getBoundingClientRect();

    const startX = startRect.left + startRect.width / 2 - 30; // Center flying image
    const startY = startRect.top + startRect.height / 2 - 30;

    const endX = endRect.left + endRect.width / 2 - 30; // Center on basket icon
    const endY = endRect.top + endRect.height / 2 - 30;

    // Set initial position
    flyingImg.style.left = `${startX}px`;
    flyingImg.style.top = `${startY}px`;

    document.body.appendChild(flyingImg);

    // Force reflow to ensure initial position is rendered before animation starts
    flyingImg.getBoundingClientRect();

    // Calculate deltas for CSS variables
    const dx = endX - startX;
    const dy = endY - startY;

    // Apply animation using CSS variables for transform
    flyingImg.style.setProperty("--dx", `${dx}px`);
    flyingImg.style.setProperty("--dy", `${dy}px`);
    flyingImg.style.animation = "flyToBasket 0.7s forwards ease-in";

    flyingImg.addEventListener("animationend", () => {
      flyingImg.remove();
      if (callback) {
        callback();
      }
    });
  }

  // --- Carousel Functions ---
  function renderCarousel(mediaArray) {
    carouselDisplay.innerHTML = "";
    carouselIndicators.innerHTML = "";
    currentProductMedia = mediaArray;
    currentSlideIndex = 0; // Reset to first slide

    if (mediaArray.length === 0) {
      carouselDisplay.innerHTML =
        '<p class="text-gray-400 text-center text-xl">No media available.</p>';
      carouselPrevBtn.classList.add("hidden");
      carouselNextBtn.classList.add("hidden");
      return;
    }

    mediaArray.forEach((media, index) => {
      let element;
      if (media.type === "image") {
        element = document.createElement("img");
        element.src = media.src;
        element.alt = selectedProduct.name + " " + (index + 1);
      } else if (media.type === "video") {
        element = document.createElement("video");
        element.src = media.src;
        element.controls = true; // Add controls for video
        element.loop = true; // Loop video
        element.muted = true; // Mute by default for autoplay
        element.preload = "metadata"; // Preload metadata for faster loading
        element.playsInline = true; // Important for mobile autoplay
      }
      element.classList.add("carousel-item");
      if (index === currentSlideIndex) {
        element.classList.add("active");
        if (media.type === "video") {
          element.play(); // Auto-play active video
        }
      }
      carouselDisplay.appendChild(element);

      const dot = document.createElement("span");
      dot.classList.add("indicator-dot");
      if (index === currentSlideIndex) {
        dot.classList.add("active");
      }
      dot.addEventListener("click", () => showSlide(index));
      carouselIndicators.appendChild(dot);
    });

    // Show/hide nav buttons based on number of slides
    if (mediaArray.length > 1) {
      carouselPrevBtn.classList.remove("hidden");
      carouselNextBtn.classList.remove("hidden");
    } else {
      carouselPrevBtn.classList.add("hidden");
      carouselNextBtn.classList.add("hidden");
    }
  }

  function showSlide(index, direction = "next") {
    if (index < 0 || index >= currentProductMedia.length) {
      return;
    }

    const currentActive = carouselDisplay.querySelector(
      ".carousel-item.active"
    );
    if (currentActive) {
      // Pause current video if it's a video
      if (currentActive.tagName.toLowerCase() === "video") {
        currentActive.pause();
      }

      // Add leaving animation class
      if (direction === "next") {
        currentActive.classList.add("next-leaving");
      } else {
        currentActive.classList.add("prev-leaving");
      }

      // Remove active class after animation
      currentActive.addEventListener(
        "transitionend",
        function handler() {
          currentActive.classList.remove(
            "active",
            "next-leaving",
            "prev-leaving"
          );
          currentActive.removeEventListener("transitionend", handler);
        },
        { once: true }
      );
    }

    const nextActive = carouselDisplay.children[index];
    if (nextActive) {
      // Add entering animation class
      if (direction === "next") {
        nextActive.classList.add("next-entering");
      } else {
        nextActive.classList.add("prev-entering");
      }
      // Force reflow
      nextActive.getBoundingClientRect();

      nextActive.classList.add("active");
      // Remove entering animation class after a short delay (for animation)
      setTimeout(() => {
        nextActive.classList.remove("next-entering", "prev-entering");
      }, 50); // Small delay to allow CSS to register initial state

      if (nextActive.tagName.toLowerCase() === "video") {
        nextActive.play();
      }
    }

    // Update indicators
    document.querySelectorAll(".indicator-dot").forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });

    currentSlideIndex = index;
  }

  carouselPrevBtn.addEventListener("click", () => {
    let newIndex = currentSlideIndex - 1;
    if (newIndex < 0) {
      newIndex = currentProductMedia.length - 1; // Loop to end
    }
    showSlide(newIndex, "prev");
  });

  carouselNextBtn.addEventListener("click", () => {
    let newIndex = currentSlideIndex + 1;
    if (newIndex >= currentProductMedia.length) {
      newIndex = 0; // Loop to beginning
    }
    showSlide(newIndex, "next");
  });

  // --- Event Listeners ---

  // Open Product Detail Modal
  document.querySelectorAll(".menu-item-card").forEach((card) => {
    card.addEventListener("click", () => {
      const name = card.dataset.name;
      const price = parseFloat(card.dataset.price);
      const description = card.dataset.description;

      // Find the full product object from our 'products' array to get all media
      selectedProduct = products.find((p) => p.name === name);

      if (!selectedProduct) {
        console.error("Product not found:", name);
        showToast("Product details not available.", "error");
        return;
      }

      modalProductName.textContent = selectedProduct.name;
      modalProductDescription.textContent = selectedProduct.description;
      modalProductPrice.textContent = selectedProduct.price;

      renderCarousel(selectedProduct.media || []); // Pass the media array

      productModal.classList.remove("hidden");
      setTimeout(
        () => productModal.querySelector("div").classList.remove("scale-95"),
        10
      );
    });
  });

  // Close Product Detail Modal
  closeProductModalBtn.addEventListener("click", () => {
    // Pause any playing video when closing modal
    const activeVideo = carouselDisplay.querySelector("video.active");
    if (activeVideo) {
      activeVideo.pause();
      activeVideo.currentTime = 0; // Reset video to start
    }

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
        // When adding to basket, store only the first image for the basket list display
        const itemImageForBasket =
          selectedProduct.media.find((m) => m.type === "image")?.src ||
          "img/placeholder.jpg";
        basket.push({
          ...selectedProduct,
          image: itemImageForBasket,
          quantity: 1,
        });
      }

      // Get the currently displayed media element for animation source
      const mediaElementForAnimation = carouselDisplay.querySelector(
        ".carousel-item.active"
      );

      // Trigger the "fly to basket" animation
      animateToBasket(mediaElementForAnimation, () => {
        updateBasketCount(); // Update count AFTER animation
        basketIcon.classList.add("shake"); // Trigger shake animation
        basketIcon.addEventListener(
          "animationend",
          () => {
            basketIcon.classList.remove("shake");
          },
          { once: true }
        ); // Remove shake class after animation
      });

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
    );
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

    basketItemsList.querySelectorAll(".quantity-decrease").forEach((button) => {
      button.addEventListener("click", (event) => {
        const itemName = event.currentTarget.dataset.name;
        const itemIndex = basket.findIndex((item) => item.name === itemName);
        if (itemIndex > -1) {
          if (basket[itemIndex].quantity > 1) {
            basket[itemIndex].quantity--;
          } else {
            basket.splice(itemIndex, 1);
          }
          renderBasketItems();
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
          renderBasketItems();
          showToast(`${itemName} quantity updated.`, "info");
        }
      });
    });

    basketItemsList.querySelectorAll(".remove-item-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const itemName = event.currentTarget.dataset.name;
        basket = basket.filter((item) => item.name !== itemName);
        renderBasketItems();
        showToast(`${itemName} removed from basket.`, "error");
      });
    });
  }

  function generateBill(tableNumber) {
    billDetailsDiv.innerHTML = ""; // Clear previous items

    billTableNumber.textContent = `Table: ${tableNumber}`; // Set table number in the bill header

    let totalBill = 0;

    if (basket.length === 0) {
      billDetailsDiv.innerHTML =
        '<p class="text-gray-500 text-center py-4">No items in this order.</p>';
    } else {
      basket.forEach((item) => {
        const itemLine = document.createElement("p");
        const itemTotal = item.price * item.quantity;
        itemLine.classList.add("bill-item-line");
        itemLine.innerHTML = `
                    <span class="bill-item-name">${item.name} x ${
          item.quantity
        }</span>
                    <span class="bill-item-price">${itemTotal.toFixed(
                      2
                    )} DT</span>
                `;
        billDetailsDiv.appendChild(itemLine);
        totalBill += itemTotal;
      });
    }

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
