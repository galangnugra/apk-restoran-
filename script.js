// Data Default Menu
let menuData = [
  { id: 1, name: "Nasi Goreng Spesial", category: "makanan", price: 25000 },
  { id: 2, name: "Mie Ayam Bakso", category: "makanan", price: 20000 },
  { id: 3, name: "Ayam Bakar", category: "makanan", price: 28000 },
  { id: 4, name: "Es Teh Manis", category: "minuman", price: 5000 },
  { id: 5, name: "Jus Alpukat", category: "minuman", price: 15000 },
  { id: 6, name: "Kopi Hitam", category: "minuman", price: 10000 }
];

let cart = [];
let currentCategory = "semua";

// Format Angka ke Rupiah
function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", { 
    style: "currency", 
    currency: "IDR", 
    maximumFractionDigits: 0 
  }).format(number);
}

// Render Menu ke Layar
function renderMenu() {
  const menuContainer = document.getElementById("menuContainer");
  menuContainer.innerHTML = "";

  const filteredMenu = currentCategory === "semua" 
    ? menuData 
    : menuData.filter(item => item.category === currentCategory);

  filteredMenu.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-body">
        <span class="badge">${item.category}</span>
        <h3 class="card-title">${item.name}</h3>
        <div class="card-price">${formatRupiah(item.price)}</div>
      </div>
      <div class="card-footer">
        <button class="btn btn-block" onclick="addToCart(${item.id})">+ Keranjang</button>
      </div>
    `;
    menuContainer.appendChild(card);
  });
}

// Filter Berdasarkan Kategori
function filterCategory(category) {
  currentCategory = category;
  document.querySelectorAll(".categories .btn").forEach(btn => {
    btn.classList.remove("active");
    if (btn.textContent.toLowerCase() === category || (category === "semua" && btn.textContent === "Semua")) {
      btn.classList.add("active");
    }
  });
  renderMenu();
}

// Tambah Item ke Keranjang
function addToCart(id) {
  const item = menuData.find(m => m.id === id);
  const cartItem = cart.find(c => c.id === id);

  if (cartItem) {
    cartItem.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCartUI();
}

// Ubah Jumlah Item di Keranjang (+ / -)
function updateQty(id, change) {
  const cartItem = cart.find(c => c.id === id);
  if (cartItem) {
    cartItem.qty += change;
    if (cartItem.qty <= 0) {
      cart = cart.filter(c => c.id !== id);
    }
  }
  updateCartUI();
}

// Update Tampilan Keranjang
function updateCartUI() {
  const cartItemsElement = document.getElementById("cartItems");
  const totalPriceElement = document.getElementById("totalPrice");

  if (cart.length === 0) {
    cartItemsElement.innerHTML = `<li style="text-align: center; color: var(--text-muted); padding: 1rem 0;">Keranjang masih kosong</li>`;
    totalPriceElement.textContent = formatRupiah(0);
    return;
  }

  cartItemsElement.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;

    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-title">${item.name}</span>
        <span class="cart-item-price">${formatRupiah(item.price)} x ${item.qty}</span>
      </div>
      <div class="cart-item-actions">
        <button class="btn btn-sm" onclick="updateQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button class="btn btn-sm" onclick="updateQty(${item.id}, 1)">+</button>
      </div>
    `;
    cartItemsElement.appendChild(li);
  });

  totalPriceElement.textContent = formatRupiah(total);
}

// Proses Pesanan dan Tampilkan Struk
function processOrder() {
  const customerName = document.getElementById("customerName").value.trim();
  const receiptElement = document.getElementById("receipt");

  if (!customerName) {
    alert("Silakan masukkan nama pelanggan terlebih dahulu!");
    return;
  }

  if (cart.length === 0) {
    alert("Keranjang belanja masih kosong!");
    return;
  }

  let total = 0;
  let detailsHTML = "";

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    detailsHTML += `<div>${item.name} x${item.qty} - ${formatRupiah(itemTotal)}</div>`;
  });

  document.getElementById("receiptName").textContent = customerName;
  document.getElementById("receiptDetails").innerHTML = detailsHTML;
  document.getElementById("receiptTotal").textContent = formatRupiah(total);

  receiptElement.style.display = "block";

  // Reset keranjang belanja setelah sukses
  cart = [];
  document.getElementById("customerName").value = "";
  updateCartUI();
}

// Buka dan Tutup Modal
function openModal() {
  document.getElementById("addMenuModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("addMenuModal").style.display = "none";
  document.getElementById("addMenuForm").reset();
}

// Tambah Menu Baru dari Form
function addNewMenu(event) {
  event.preventDefault();
  const name = document.getElementById("itemName").value.trim();
  const category = document.getElementById("itemCategory").value;
  const price = parseFloat(document.getElementById("itemPrice").value);

  const newItem = {
    id: menuData.length ? menuData[menuData.length - 1].id + 1 : 1,
    name: name,
    category: category,
    price: price
  };

  menuData.push(newItem);
  renderMenu();
  closeModal();
}

// Jalankan Fungsi Utama Saat Pertama Kali Dibuka
renderMenu();
