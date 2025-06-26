document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".header__menu-item");

  links.forEach((link) => {
    link.addEventListener("click", () => {
      links.forEach((l) => l.classList.remove("active")); // clear others
      link.classList.add("active"); // set clicked one active
    });
  });

  const menuBtn = document.querySelector(".header__menu-btn");
  const menuBtnIcon = document.querySelector(".header__menu-btn img");

  const cartBtn = document.querySelector(".header__cart-btn");

  const nav = document.querySelector(".header__nav");
  const overlay = document.querySelector(".overlay");

  const currImg = document.querySelector(".product__image");
  const prevImg = document.querySelector(".product__carousel-btn--prev");
  const nextImg = document.querySelector(".product__carousel-btn--next");
  const thumbnails = document.querySelectorAll(".product__thumbnail");

  const productTitle = document.querySelector(".product__title");
  const itemCount = document.querySelector(".cart__item-count");
  const minusBtn = document.querySelector(".product__quantity-btn--decrease ");
  const addBtn = document.querySelector(".product__quantity-btn--increase ");
  const itemQty = document.querySelector(".product__quantity-number");
  const itemPrice = document.querySelector(".product__price");
  // this should render the quantity of our order then render the item in our basket :)
  const cart = document.querySelector(".cart");
  const cartList = document.querySelector(".cart__list");
  const addToCart = document.querySelector(".product__add-to-cart");

  const emptyMsg = document.querySelector(".cart__empty");
  const checkoutBtn = document.querySelector(".cart__checkout-btn");

  const carousel = document.querySelector(".product__gallery");
  const thumbnailBtns = document.querySelectorAll(".product__thumbnail-btn");

  thumbnailBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      // First update ARIA attributes
      thumbnailBtns.forEach((b) => b.setAttribute("aria-selected", "false"));
      btn.setAttribute("aria-selected", "true");

      openLightBox(index); // Pass the clicked index
    });
  });

  const lightbox = document.getElementById("lightbox-carousel");
  const lightboxMainImage = lightbox.querySelector(".lightbox__main-image");
  const lightboxThumbnails = lightbox.querySelectorAll(".lightbox__thumbnail");
  const lightboxThumbnailBtns = lightbox.querySelectorAll(
    ".lightbox__thumbnail-btn"
  );
  const lightboxCloseBtn = lightbox.querySelector(".lightbox__close-btn");

  const lightboxPrevBtn = document.querySelector(".lightbox__btn--prev");
  const lightboxNextBtn = document.querySelector(".lightbox__btn--next");

  menuBtn.addEventListener("click", openMenu);
  cartBtn.addEventListener("click", toggleCart);

  prevImg.addEventListener("click", prevImage);
  nextImg.addEventListener("click", nextImage);

  minusBtn.addEventListener("click", decreaseItem);
  addBtn.addEventListener("click", increaseItem);

  // dynamic price obtained
  const priceText = itemPrice.textContent; // "$125.00"
  const numericPrice = parseFloat(priceText.replace("$", ""));

  const prodName = productTitle.textContent;
  const cleanedTitle = prodName.replace(/\s+/g, " ").trim();

  const thumbArr = [
    "images/image-product-1-thumbnail.jpg",
    "images/image-product-2-thumbnail.jpg",
    "images/image-product-3-thumbnail.jpg",
    "images/image-product-4-thumbnail.jpg",
  ];

  function getProductData() {
    return {
      thumbnail: thumbArr[0],
      name: cleanedTitle,
      price: numericPrice,
      quantity: parseInt(itemQty.textContent, 10),
    };
  }

  addToCart.addEventListener("click", () => {
    itemToCart(getProductData());
    updateCartUI();
  });

  // carousel.addEventListener("click");

  function openMenu() {
    nav.classList.toggle("hidden");

    overlay.classList.toggle("hidden");

    document.body.classList.toggle("no-scroll");

    const isOpen = menuBtnIcon.getAttribute("src").includes("icon-menu");

    if (isOpen) {
      menuBtnIcon.setAttribute("src", "images/icon-close.svg");
      menuBtn.setAttribute("aria-label", "Close navigation menu");
      menuBtn.setAttribute("aria-expanded", "true");
    } else {
      menuBtnIcon.setAttribute("src", "images/icon-menu.svg");
      menuBtn.setAttribute("aria-label", "Open navigation menu");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  }

  let currentIndex = 0;
  const images = [
    "images/image-product-1.jpg",
    "images/image-product-2.jpg",
    "images/image-product-3.jpg",
    "images/image-product-4.jpg",
  ];

  function updateImage(index) {
    currImg.src = images[index];

    const matchingThumbnail = thumbnails[index];

    if (matchingThumbnail) {
      currImg.alt = matchingThumbnail.getAttribute("alt");
    }

    currentIndex = index;
  }

  function nextImage() {
    const newIndex = (currentIndex + 1) % images.length;
    updateImage(newIndex);
  }

  function prevImage() {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage(newIndex);
  }

  let current;
  function increaseItem() {
    current = parseInt(itemQty.textContent, 10);
    itemQty.textContent = current + 1;
  }

  function decreaseItem() {
    current = parseInt(itemQty.textContent, 10);
    if (current > 0) {
      itemQty.textContent = current - 1;
    }
  }

  // step1 n 2 for this func: render qty order, render elements on ul

  // this renders the item elements first before it gets added to the list
  function renderCartItem(product) {
    if (product.quantity === 0) return null;

    const cartItem = document.createElement("li");
    cartItem.classList.add("cart__item", "flex");

    // thumbnail
    const thumbnail = document.createElement("img");
    thumbnail.src = product.thumbnail;
    thumbnail.alt = "thumbnail of chosen product";
    thumbnail.className = "cart__item-thumbnail";

    // details wrapper
    const details = document.createElement("div");
    details.classList.add("cart__details", "flex");

    const name = document.createElement("p");
    name.className = "cart__item-name";
    name.textContent = product.name;

    const amount = document.createElement("p");
    amount.className = "cart__amount";
    // amount.classList.add = "flex";

    const priceSpan = document.createElement("span");
    priceSpan.className = "item__price";
    priceSpan.textContent = `$${product.price}`;

    const qtySpan = document.createElement("span");
    qtySpan.className = "item__qty";
    qtySpan.textContent = product.quantity;

    const totalSpan = document.createElement("span");
    totalSpan.className = "cart__total";
    totalSpan.textContent = `$${(product.price * product.quantity).toFixed(2)}`;

    amount.append(priceSpan, " x ", qtySpan, totalSpan);

    details.append(name, amount);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("cart__delete-item", "btn-reset");
    deleteBtn.type = "button";

    const deleteIcon = document.createElement("img");
    deleteIcon.src = "images/icon-delete.svg";
    deleteIcon.alt = "delete cart item";

    deleteBtn.appendChild(deleteIcon);

    // Final assemble of item
    cartItem.append(thumbnail, details, deleteBtn);

    deleteBtn.addEventListener("click", () => {
      delItem(deleteBtn);
    });

    return cartItem;
  }

  // this finally adds it to our ul(list)
  function itemToCart(product) {
    const newCartItem = renderCartItem(getProductData());
    if (newCartItem) cartList.appendChild(newCartItem);
    updateCartItemCount();
  }

  // item count indicator in cart icon
  function updateCartItemCount() {
    const qtySpans = document.querySelectorAll(".item__qty");
    let totalQty = 0;
    qtySpans.forEach((span) => {
      totalQty += parseInt(span.textContent, 10);
    });

    if (totalQty > 0) {
      itemCount.textContent = totalQty;
      itemCount.classList.remove("hidden");
    } else {
      itemCount.classList.add("hidden");
    }
  }

  function delItem(btn) {
    const cartListItem = btn.closest(".cart__item");
    if (cartListItem) {
      cartListItem.remove();
      updateCartUI();
      updateCartItemCount();
    }
  }

  function updateCartUI() {
    const isEmpty = cartList.children.length === 0;

    if (isEmpty) {
      emptyMsg.classList.remove("hidden");
    } else {
      emptyMsg.classList.add("hidden");
    }

    checkoutBtn.style.display = isEmpty ? "none" : "inline-block";
  }

  function toggleCart() {
    if (cart.classList.contains("hidden")) {
      cart.classList.remove("hidden");
    } else {
      cart.classList.add("hidden");
    }
  }

  function openLightBox(index) {
    // ✅ Sync the global index
    currentIndex = index;

    // Show the lightbox
    lightbox.classList.remove("hidden");
    lightbox.classList.add("grid");

    document.body.classList.add("no-scroll");
    overlay.classList.remove("hidden");

    // set the main image i lightbox
    lightboxMainImage.src = images[index];
    lightboxMainImage.alt = thumbnails[index].alt;

    //Remove existing classes from lightbox thumbnails
    lightboxThumbnails.forEach((thumb) => {
      thumb.classList.remove("active");
    });
    lightboxThumbnailBtns.forEach((btn) => {
      const container = btn.querySelector(".lightbox__thumbnail-container");

      container.classList.remove("active-border");
    });

    // Add active state to matching lightbox thumbnail
    const activeBtn = lightboxThumbnailBtns[index];
    const activeThumb = lightboxThumbnails[index];
    const activeContainer = activeBtn.querySelector(
      ".lightbox__thumbnail-container"
    );

    activeThumb.classList.add("active");
    activeContainer.classList.add("active-border");
  }

  lightboxCloseBtn.addEventListener("click", () => {
    lightbox.classList.remove("grid");
    lightbox.classList.add("hidden");

    document.body.classList.remove("no-scroll");
    overlay.classList.add("hidden");
  });

  function updateLightbox(index) {
    // Wrap around the image array
    currentIndex = (index + images.length) % images.length;

    // Update main image
    lightboxMainImage.src = images[currentIndex];
    lightboxMainImage.alt = lightboxThumbnails[currentIndex].alt;

    // Clear active states
    lightboxThumbnails.forEach((img) => img.classList.remove("active"));
    lightboxThumbnailBtns.forEach((btn) =>
      btn
        .querySelector(".lightbox__thumbnail-container")
        .classList.remove("active-border")
    );

    // Activate new current thumb
    lightboxThumbnails[currentIndex].classList.add("active");
    lightboxThumbnailBtns[currentIndex]
      .querySelector(".lightbox__thumbnail-container")
      .classList.add("active-border");
  }

  lightboxPrevBtn.addEventListener("click", () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox(newIndex);
  });

  lightboxNextBtn.addEventListener("click", () => {
    const newIndex = (currentIndex + 1) % images.length;
    updateLightbox(newIndex);
  });

  lightboxThumbnailBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      currentIndex = index; // 👈 This syncs the global index!
      updateLightbox(currentIndex); // now it will properly cycle forward/backward from here
    });
  });
});
