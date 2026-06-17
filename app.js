// --- Product Catalog Data ---
const PRODUCTS = [
  {
    id: 'aether-chrono',
    name: 'AETHER Legacy Chrono',
    category: 'chronograph',
    price: 6800,
    image: 'assets/chrono.png',
    caliber: 'AE-3012 Chrono',
    movement: 'Integrated Column-Wheel Chrono',
    crystal: 'Double-Dome Sapphire',
    water: '100 Meters / 10 ATM',
    desc: 'An exceptional timepiece celebrating mechanical complexity and sporty heritage. Driven by our self-winding integrated column-wheel chronograph caliber.'
  },
  {
    id: 'aether-minimalist',
    name: 'AETHER Minimalist Titanium',
    category: 'classic',
    price: 4200,
    image: 'assets/minimalist.png',
    caliber: 'AE-2010 Calibre',
    movement: 'Slim Mechanical Hand-wound',
    crystal: 'Anti-Reflective Flat Sapphire',
    water: '50 Meters / 5 ATM',
    desc: 'Sophisticated minimalism carved from matte-brushed space-grade titanium. Features an ultra-slim casing and minimalist dial face.'
  },
  {
    id: 'aether-automatic',
    name: 'AETHER Skeleton Legacy',
    category: 'automatic',
    price: 8900,
    image: 'assets/automatic.png',
    caliber: 'AE-9005 Skeleton',
    movement: 'Self-Winding Openworked Automatic',
    crystal: 'Curved Domed Sapphire',
    water: '50 Meters / 5 ATM',
    desc: 'A mesmerizing view of rotating wheels and mechanical heartbeat. Every plate is skeletonized and finished entirely by hand.'
  },
  {
    id: 'aether-diver',
    name: 'AETHER Oceanus Diver',
    category: 'diver',
    price: 5600,
    image: 'assets/diver.png',
    caliber: 'AE-6040 Diver',
    movement: 'Bidirectional Self-Winding Automatic',
    crystal: 'Thick Solid Sapphire Bezel Face',
    water: '300 Meters / 30 ATM',
    desc: 'Engineered for marine depth. Features highly-legible luminescent indexes, helium escape valve, and an exact 120-click unidirectional rotating bezel.'
  }
];

// --- Watch Customizer Pricing Scheme ---
const BASE_CONFIG_PRICE = 5000;
const CUSTOMIZER_PRICES = {
  case: {
    gold: { price: 1500, label: 'Rose Gold' },
    platinum: { price: 2500, label: 'Brushed Platinum' },
    obsidian: { price: 800, label: 'Matte Obsidian' }
  },
  dial: {
    emerald: { price: 300, label: 'Emerald Sunburst' },
    midnight: { price: 0, label: 'Midnight Matte' },
    champagne: { price: 500, label: 'Champagne Gold' }
  },
  strap: {
    steel: { price: 600, label: 'Oyster Steel Mesh' },
    leather: { price: 300, label: 'Alligator Leather' },
    rubber: { price: 0, label: 'Sport Vulcanized Rubber' }
  }
};

// --- App State ---
let cart = [];
let activeFilters = 'all';
let currentSort = 'default';
let activeConfig = {
  case: 'gold',
  dial: 'emerald',
  strap: 'steel'
};
let selectedModalProduct = null;

// --- DOM Cache Elements ---
const productGrid = document.getElementById('product-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sort-select');

const mainHeader = document.getElementById('main-header');
const menuToggleBtn = document.getElementById('menu-toggle-btn');
const navMenu = document.getElementById('nav-menu');

// Cart DOM
const cartDrawer = document.getElementById('cart-drawer');
const cartOverlayBg = document.getElementById('cart-overlay-bg');
const cartToggleBtn = document.getElementById('cart-toggle-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartDrawerBody = document.getElementById('cart-drawer-body');
const cartSubtotalValue = document.getElementById('cart-subtotal-value');
const cartBadgeCount = document.getElementById('cart-badge-count');
const checkoutBtn = document.getElementById('checkout-btn');

// Configurator DOM
const configOptionBtns = document.querySelectorAll('.option-btn');
const summaryCaseVal = document.getElementById('summary-case-val');
const summaryDialVal = document.getElementById('summary-dial-val');
const summaryStrapVal = document.getElementById('summary-strap-val');
const configPriceVal = document.getElementById('config-price-val');
const configAddToCartBtn = document.getElementById('config-add-to-cart');

// Modal DOM
const detailsModal = document.getElementById('details-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalWatchImg = document.getElementById('modal-watch-img');
const modalWatchCategory = document.getElementById('modal-watch-category');
const modalWatchTitle = document.getElementById('modal-watch-title');
const modalWatchPrice = document.getElementById('modal-watch-price');
const modalWatchDesc = document.getElementById('modal-watch-desc');
const modalSpecCaliber = document.getElementById('modal-spec-caliber');
const modalSpecMovement = document.getElementById('modal-spec-movement');
const modalSpecCrystal = document.getElementById('modal-spec-crystal');
const modalSpecWater = document.getElementById('modal-spec-water');
const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');

// Toast DOM
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Load Cart from LocalStorage
  const storedCart = localStorage.getItem('aether_cart');
  if (storedCart) {
    try {
      cart = JSON.parse(storedCart);
      updateCartUI();
    } catch (e) {
      cart = [];
    }
  }

  // Render original catalogs
  renderCatalog();

  // Scroll Header Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  });

  // Mobile menu toggle
  menuToggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    menuToggleBtn.classList.toggle('active');
  });

  // Close Mobile Menu on Nav Clicks
  document.querySelectorAll('#nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggleBtn.classList.remove('active');
    });
  });

  // Event Listeners: Filtering & Sorting
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeFilters = e.target.getAttribute('data-filter');
      renderCatalog();
    });
  });

  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    renderCatalog();
  });

  // Event Listeners: Cart Drawer
  cartToggleBtn.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  cartOverlayBg.addEventListener('click', closeCart);

  checkoutBtn.addEventListener('click', handleCheckout);

  // Event Listeners: Details Modal
  closeModalBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  modalAddToCartBtn.addEventListener('click', () => {
    if (selectedModalProduct) {
      addToCart(selectedModalProduct);
      closeModal();
    }
  });

  // Event Listeners: Customizer Controls
  configOptionBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const type = btn.getAttribute('data-config-type');
      const val = btn.getAttribute('data-value');
      
      // Update state
      activeConfig[type] = val;
      
      // Toggle button active classes
      document.querySelectorAll(`.option-btn[data-config-type="${type}"]`).forEach(b => {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      
      // Render SVG changes & updates text details
      updateConfiguratorUI();
    });
  });

  configAddToCartBtn.addEventListener('click', addBespokeToCart);

  // Initial Customizer Setup
  updateConfiguratorUI();
}

// --- Catalog Rendering, Filtering, Sorting ---
function renderCatalog() {
  let filtered = [...PRODUCTS];
  
  // Apply Filter
  if (activeFilters !== 'all') {
    filtered = filtered.filter(p => p.category === activeFilters);
  }
  
  // Apply Sort
  if (currentSort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  }
  
  // Clear and Rebuild
  productGrid.innerHTML = '';
  
  if (filtered.length === 0) {
    productGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 4rem 0;">No masterworks found in this series.</div>`;
    return;
  }
  
  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <span class="product-tag">${product.category}</span>
      <div class="product-img-box">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-overlay">
          <button class="overlay-btn view-details-btn" data-id="${product.id}" title="Technical Specifications" aria-label="View specifications">
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              <line x1="11" y1="8" x2="11" y2="14"></line>
              <line x1="8" y1="11" x2="14" y2="11"></line>
            </svg>
          </button>
          <button class="overlay-btn add-to-cart-btn" data-id="${product.id}" title="Acquire" aria-label="Add to collection">
            <svg viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </button>
        </div>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category} Series</span>
        <h3 class="product-title">${product.name}</h3>
        <span class="product-price">$${product.price.toLocaleString()}</span>
      </div>
    `;
    
    // Wire up events inside catalog list
    card.querySelector('.view-details-btn').addEventListener('click', () => {
      openModal(product);
    });
    
    card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
      addToCart(product);
    });
    
    productGrid.appendChild(card);
  });
}

// --- Cart Core Drawer & Business Logic ---
function openCart() {
  cartDrawer.classList.add('open');
  cartOverlayBg.classList.add('visible');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlayBg.classList.remove('visible');
}

function addToCart(product, options = null) {
  // Identify key if bespoke or general product
  const cartItemId = options 
    ? `${product.id}-${options.case}-${options.dial}-${options.strap}` 
    : product.id;
    
  const existingItemIndex = cart.findIndex(item => item.cartId === cartItemId);
  
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push({
      cartId: cartItemId,
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      options: options
    });
  }
  
  updateCartUI();
  showToast(options ? `Bespoke timepiece added to your collection` : `${product.name} added to collection`);
  
  // Bounce Cart badge count visually
  cartToggleBtn.classList.add('pulse');
  setTimeout(() => {
    cartToggleBtn.classList.remove('pulse');
  }, 400);
}

function updateCartUI() {
  // Sync with LocalStorage
  localStorage.setItem('aether_cart', JSON.stringify(cart));
  
  // Count Badge
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (totalCount > 0) {
    cartBadgeCount.innerText = totalCount;
    cartBadgeCount.classList.add('active');
  } else {
    cartBadgeCount.classList.remove('active');
  }
  
  // Render list
  cartDrawerBody.innerHTML = '';
  
  if (cart.length === 0) {
    cartDrawerBody.innerHTML = `
      <div class="empty-cart-message">
        <svg viewBox="0 0 24 24">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <p>Your collection is currently empty.</p>
      </div>
    `;
    cartSubtotalValue.innerText = '$0';
    return;
  }
  
  let subtotal = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    
    const cartCard = document.createElement('div');
    cartCard.className = 'cart-item';
    
    // Render customizer details text if bespoke watch
    let optionsText = '';
    let itemImage = item.image;
    
    if (item.options) {
      optionsText = `
        <div class="cart-item-options">
          ${item.options.case} &bull; ${item.options.dial} &bull; ${item.options.strap}
        </div>
      `;
      // We will render a placeholder mini watch preview for bespoke
      itemImage = 'data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="%230c0c0c" stroke="%23d4af37" stroke-width="1.5"/><circle cx="50" cy="50" r="34" fill="%23050505"/><line x1="50" y1="50" x2="50" y2="28" stroke="%23fff" stroke-width="1.5"/><line x1="50" y1="50" x2="72" y2="50" stroke="%23d4af37" stroke-width="1"/></svg>';
    }
    
    cartCard.innerHTML = `
      <div class="cart-item-img">
        <img src="${itemImage}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <div>
          <h4 class="cart-item-title">${item.name}</h4>
          ${optionsText}
        </div>
        <div class="cart-item-meta">
          <div class="cart-qty-control">
            <button class="qty-btn dec-qty" data-id="${item.cartId}">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn inc-qty" data-id="${item.cartId}">+</button>
          </div>
          <span class="cart-item-price">$${itemTotal.toLocaleString()}</span>
        </div>
        <div>
          <button class="remove-item-btn" data-id="${item.cartId}">Release Item</button>
        </div>
      </div>
    `;
    
    // Event listeners
    cartCard.querySelector('.dec-qty').addEventListener('click', () => changeQuantity(item.cartId, -1));
    cartCard.querySelector('.inc-qty').addEventListener('click', () => changeQuantity(item.cartId, 1));
    cartCard.querySelector('.remove-item-btn').addEventListener('click', () => removeCartItem(item.cartId));
    
    cartDrawerBody.appendChild(cartCard);
  });
  
  cartSubtotalValue.innerText = `$${subtotal.toLocaleString()}`;
}

function changeQuantity(cartId, delta) {
  const index = cart.findIndex(item => item.cartId === cartId);
  if (index > -1) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
    updateCartUI();
  }
}

function removeCartItem(cartId) {
  cart = cart.filter(item => item.cartId !== cartId);
  updateCartUI();
}

function handleCheckout() {
  if (cart.length === 0) return;
  
  // Show successful purchase flow
  checkoutBtn.disabled = true;
  checkoutBtn.innerText = 'Acquiring...';
  
  setTimeout(() => {
    cart = [];
    updateCartUI();
    closeCart();
    
    checkoutBtn.disabled = false;
    checkoutBtn.innerText = 'Proceed to Acquisition';
    
    // Gorgeous acquisition prompt
    alert('Thank you for choosing AETHER. A dedicated client advisor will reach out to schedule secure delivery and complete formal paperwork.');
  }, 1500);
}

// --- Details Modal Dialog Operations ---
function openModal(product) {
  selectedModalProduct = product;
  
  modalWatchImg.src = product.image;
  modalWatchCategory.innerText = `${product.category} Series`;
  modalWatchTitle.innerText = product.name;
  modalWatchPrice.innerText = `$${product.price.toLocaleString()}`;
  modalWatchDesc.innerText = product.desc;
  
  modalSpecCaliber.innerText = product.caliber;
  modalSpecMovement.innerText = product.movement;
  modalSpecCrystal.innerText = product.crystal;
  modalSpecWater.innerText = product.water;
  
  detailsModal.classList.add('open');
  document.body.style.overflow = 'hidden'; // Lock background scroll
}

function closeModal() {
  detailsModal.classList.remove('open');
  document.body.style.overflow = '';
  selectedModalProduct = null;
}

// --- Watch Configurator SVG Rendering & Controls ---
function updateConfiguratorUI() {
  // Get detailed information of selections
  const caseInfo = CUSTOMIZER_PRICES.case[activeConfig.case];
  const dialInfo = CUSTOMIZER_PRICES.dial[activeConfig.dial];
  const strapInfo = CUSTOMIZER_PRICES.strap[activeConfig.strap];
  
  // Calculate price
  const estimatedPrice = BASE_CONFIG_PRICE + caseInfo.price + dialInfo.price + strapInfo.price;
  
  // Sync text labels
  summaryCaseVal.innerText = caseInfo.label;
  summaryDialVal.innerText = dialInfo.label;
  summaryStrapVal.innerText = strapInfo.label;
  configPriceVal.innerText = `$${estimatedPrice.toLocaleString()}`;
  
  // Modify SVG Elements dynamically
  const bezelOuter = document.getElementById('watch-bezel-outer');
  const bezelInner = document.getElementById('watch-bezel-inner');
  const casing = document.getElementById('watch-casing');
  const crown = document.getElementById('watch-crown');
  const dialFace = document.getElementById('watch-dial-face');
  const strapLayer = document.getElementById('svg-strap-layer');
  const markers = document.getElementById('watch-markers');

  // Case Metal styling
  let metalGradient = 'url(#grad-gold-metal)';
  let darkInnerBezel = '#151515';
  let accentColor = '#d4af37';
  
  if (activeConfig.case === 'platinum') {
    metalGradient = 'url(#grad-platinum-metal)';
    darkInnerBezel = '#252525';
    accentColor = '#cccccc';
  } else if (activeConfig.case === 'obsidian') {
    metalGradient = 'url(#grad-obsidian-metal)';
    darkInnerBezel = '#080808';
    accentColor = '#d4af37'; // Golden details pop on dark casing
  }
  
  casing.setAttribute('fill', metalGradient);
  crown.setAttribute('fill', metalGradient);
  bezelOuter.setAttribute('fill', metalGradient);
  bezelInner.setAttribute('fill', darkInnerBezel);
  
  // Dial colors
  let dialGradient = 'url(#grad-emerald)';
  let markerColor = '#d4af37';
  
  if (activeConfig.dial === 'midnight') {
    dialGradient = 'url(#grad-midnight)';
    markerColor = '#ffffff';
  } else if (activeConfig.dial === 'champagne') {
    dialGradient = 'url(#grad-champagne)';
    markerColor = activeConfig.case === 'platinum' ? '#fff' : '#d4af37';
  }
  
  dialFace.setAttribute('fill', dialGradient);
  markers.setAttribute('stroke', markerColor);

  // Strap drawing
  let strapColor = '#d4af37'; // Steel match casing
  let strapHTML = '';
  
  if (activeConfig.strap === 'steel') {
    if (activeConfig.case === 'platinum') {
      strapColor = '#cccccc';
    } else if (activeConfig.case === 'obsidian') {
      strapColor = '#222';
    }
    
    // Draw classic oyster steel metal link paths (top & bottom)
    strapHTML = `
      <!-- Top Strap Oyster Mesh -->
      <rect x="160" y="5" width="60" height="90" fill="${strapColor}" stroke="#111" stroke-width="0.5"/>
      <line x1="180" y1="5" x2="180" y2="95" stroke="#111" stroke-width="0.5" stroke-dasharray="10 5"/>
      <line x1="200" y1="5" x2="200" y2="95" stroke="#111" stroke-width="0.5" stroke-dasharray="10 5"/>
      <line x1="160" y1="20" x2="220" y2="20" stroke="#111" stroke-width="1"/>
      <line x1="160" y1="40" x2="220" y2="40" stroke="#111" stroke-width="1"/>
      <line x1="160" y1="60" x2="220" y2="60" stroke="#111" stroke-width="1"/>
      <line x1="160" y1="80" x2="220" y2="80" stroke="#111" stroke-width="1"/>

      <!-- Bottom Strap Oyster Mesh -->
      <rect x="160" y="285" width="60" height="90" fill="${strapColor}" stroke="#111" stroke-width="0.5"/>
      <line x1="180" y1="285" x2="180" y2="375" stroke="#111" stroke-width="0.5" stroke-dasharray="10 5"/>
      <line x1="200" y1="285" x2="200" y2="375" stroke="#111" stroke-width="0.5" stroke-dasharray="10 5"/>
      <line x1="160" y1="300" x2="220" y2="300" stroke="#111" stroke-width="1"/>
      <line x1="160" y1="320" x2="220" y2="320" stroke="#111" stroke-width="1"/>
      <line x1="160" y1="340" x2="220" y2="340" stroke="#111" stroke-width="1"/>
      <line x1="160" y1="360" x2="220" y2="360" stroke="#111" stroke-width="1"/>
    `;
  } else if (activeConfig.strap === 'leather') {
    // Elegant brown crocodile leather
    strapHTML = `
      <!-- Top Strap Leather -->
      <path d="M 160,5 L 220,5 L 215,95 C 205,95 205,92 200,92 L 180,92 C 175,92 175,95 165,95 Z" fill="#4a2e1d" stroke="#1c110a" stroke-width="0.5"/>
      <path d="M 164,10 L 216,10 L 212,87 C 203,87 203,85 198,85 L 182,85 C 177,85 177,87 168,87 Z" fill="none" stroke="#2c1a0e" stroke-width="1" stroke-dasharray="2 2"/>
      
      <!-- Leather scale lines -->
      <path d="M 175,20 Q 190,15 205,20 M 172,45 Q 190,40 208,45 M 170,70 Q 190,65 210,70" fill="none" stroke="#2c1a0e" stroke-width="0.5"/>

      <!-- Bottom Strap Leather -->
      <path d="M 165,285 C 175,285 175,288 180,288 L 200,288 C 205,288 205,285 215,285 L 220,375 L 160,375 Z" fill="#4a2e1d" stroke="#1c110a" stroke-width="0.5"/>
      <path d="M 168,293 C 177,293 177,295 182,295 L 198,295 C 203,295 203,293 212,293 L 216,370 L 164,370 Z" fill="none" stroke="#2c1a0e" stroke-width="1" stroke-dasharray="2 2"/>
      
      <!-- Leather scale lines -->
      <path d="M 170,310 Q 190,305 210,310 M 172,335 Q 190,330 208,335 M 175,360 Q 190,355 205,360" fill="none" stroke="#2c1a0e" stroke-width="0.5"/>
    `;
  } else if (activeConfig.strap === 'rubber') {
    // Sleek ribbed black rubber strap
    strapHTML = `
      <!-- Top Strap Rubber -->
      <rect x="160" y="5" width="60" height="90" fill="#1b1c1e" rx="2" stroke="#000" stroke-width="0.5"/>
      <rect x="165" y="15" width="50" height="5" fill="#111213" rx="1"/>
      <rect x="165" y="30" width="50" height="5" fill="#111213" rx="1"/>
      <rect x="165" y="45" width="50" height="5" fill="#111213" rx="1"/>
      <rect x="165" y="60" width="50" height="5" fill="#111213" rx="1"/>
      <rect x="165" y="75" width="50" height="5" fill="#111213" rx="1"/>

      <!-- Bottom Strap Rubber -->
      <rect x="160" y="285" width="60" height="90" fill="#1b1c1e" rx="2" stroke="#000" stroke-width="0.5"/>
      <rect x="165" y="300" width="50" height="5" fill="#111213" rx="1"/>
      <rect x="165" y="315" width="50" height="5" fill="#111213" rx="1"/>
      <rect x="165" y="330" width="50" height="5" fill="#111213" rx="1"/>
      <rect x="165" y="345" width="50" height="5" fill="#111213" rx="1"/>
      <rect x="165" y="360" width="50" height="5" fill="#111213" rx="1"/>
    `;
  }
  
  strapLayer.innerHTML = strapHTML;
}

function addBespokeToCart() {
  const caseInfo = CUSTOMIZER_PRICES.case[activeConfig.case];
  const dialInfo = CUSTOMIZER_PRICES.dial[activeConfig.dial];
  const strapInfo = CUSTOMIZER_PRICES.strap[activeConfig.strap];
  
  const estimatedPrice = BASE_CONFIG_PRICE + caseInfo.price + dialInfo.price + strapInfo.price;
  
  const bespokeWatch = {
    id: 'aether-bespoke',
    name: 'AETHER Bespoke Commission',
    price: estimatedPrice,
    image: null // Rendered using dynamically coded placeholder SVG inside Cart Drawer
  };
  
  const options = {
    case: caseInfo.label,
    dial: dialInfo.label,
    strap: strapInfo.label
  };
  
  addToCart(bespokeWatch, options);
}

// --- success Toast feedback mechanism ---
function showToast(message) {
  toastMessage.innerText = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// --- Contact / Newsletter submit validations ---
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('.newsletter-input');
    const email = emailInput.value.trim();
    
    if (email) {
      emailInput.value = '';
      showToast('Dispatch subscription confirmed.');
    }
  });
}
