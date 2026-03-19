// ================= DEFAULT PRODUCTS (NO TRAILING SPACES!) =================
// THIS DEFULT PRODUCT ,ALREADY BUILD IN
var defaultProducts = [
  {
    id: 1,
    sellerId: 999,
    seller: "Maxi",
    name: "iPhone 17 Pro - Like New",
    price: 4500,
    category: "Phones",
    location: "Unity Hall",
    contact: "0241234567",
    description: "Barely used iPhone 17 Pro, 2bTB. Comes with original box and charger.",
    image: "image/iphone.jpg",
    sold: false,
    views: 0,
    dateAdded: new Date().toISOString()
  },
  {
    id: 2,
    sellerId: 999,
    seller: "Admin",
    name: "HP Laptop 15.6 inch",
    price: 2500,
    category: "Electronics",
    location: "Brunei Hall",
    contact: "0249876543",
    description: "HP Pavilion, Intel i5, 8GB RAM, 256GB SSD. Perfect for students.",
    image: "image/l.jpg",
    sold: false,
    views: 0,
    dateAdded: new Date().toISOString()
  },
  {
    id: 3,
    sellerId: 999,
    seller: "kwame",
    name: "Textbook ",
    price: 150,
    category: "Books",
    location: "Ayeduase",
    contact: "0245551234",
    description: "textbook, 4th edition. Great condition.",
    image: "image/love.jpg",
    sold: false,
    views: 0,
    dateAdded: new Date().toISOString()
  },
  {
    id: 4,
    sellerId: 999,
    seller: "carey",
    name: "Gaming Chair - Ergonomic",
    price: 800,
    category: "Hostel Items",
    location: "Kotei Hall",
    contact: "0243334455",
    description: "Comfortable gaming/office chair. Adjustable height and armrests.",
    image: "image/gaming chair.jpg",
    sold: false,
    views: 0,
    dateAdded: new Date().toISOString()
  },
  {
    id: 5,
    sellerId: 999,
    seller: "bill",
    name: "Nike Sneakers - Size 42",
    price: 350,
    category: "Fashion",
    location: "Off Campus",
    contact: "0247778899",
    description: "Brand new Nike Air Max, never worn. Size 42.",
    image: "image/yh.jpg",
    sold: false,
    views: 0,
    dateAdded: new Date().toISOString()
  },
  {
    id: 6,
    sellerId: 999,
    seller: "Admin",
    name: "Samsung Galaxy S21",
    price: 3200,
    category: "Phones",
    location: "Kentinkrono",
    contact: "0241112233",
    description: "Samsung S21 5G, 128GB. Excellent condition with screen protector.",
    image: "image/Samsung S.jpg",
    sold: false,
    views: 0,
    dateAdded: new Date().toISOString()
  }
];

// ================= CURRENT USER =================
var currentUser = null;
try {
  var userStr = localStorage.getItem('currentUser');
  if (userStr) {
    currentUser = JSON.parse(userStr);
  }
} catch (e) {
  console.error('User data error');
  localStorage.removeItem('currentUser');
}

// ================= USER STORAGE =================
function getUsers() {
  var data = localStorage.getItem('users');
  return data ? JSON.parse(data) : [];
}
function saveUsers(list) {
  localStorage.setItem('users', JSON.stringify(list));
}

// ================= PRODUCT STORAGE =================
function getProducts() {
  var data = localStorage.getItem('products');
  if (!data || data.trim() === '' || data === '[]') {
    localStorage.setItem('products', JSON.stringify(defaultProducts));
    return defaultProducts.slice();
  }
  try {
    var parsed = JSON.parse(data);
    if (!parsed || parsed.length === 0) {
      localStorage.setItem('products', JSON.stringify(defaultProducts));
      return defaultProducts.slice();
    }
    return parsed;
  } catch (e) {
    console.error('Products parse error:', e);
    localStorage.setItem('products', JSON.stringify(defaultProducts));
    return defaultProducts.slice();
  }
}
function saveProducts(list) {
  localStorage.setItem('products', JSON.stringify(list));
}

// ================= INIT PRODUCTS =================
(function initProducts() {
  try {
    var existing = localStorage.getItem('products');
    if (!existing || existing.trim() === '' || existing === '[]') {
      localStorage.setItem('products', JSON.stringify(defaultProducts));
      console.log('✓ Default products initialized');
    }
  } catch (e) {
    localStorage.setItem('products', JSON.stringify(defaultProducts));
  }
})();

// ================= AUTH =================
// 
function signup(name, email, password) {
  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email) return false;
  }
  users.push({ id: Date.now(), name: name, email: email, password: password });
  saveUsers(users);
  return true;
}

function login(email, password) {
  var users = getUsers();
  for (var i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
      localStorage.setItem('currentUser', JSON.stringify(users[i]));
      currentUser = users[i];
      return true;
    }
  }
  return false;
}

function logout() {
  localStorage.removeItem('currentUser');
  currentUser = null;
  window.location.href = "index.html";
}

function checkAuth() {
  if (!currentUser) {
    var page = window.location.pathname.split('/').pop();
    if (page === 'dashboard.html' || page === 'marketplace.html' || page === 'add-product.html') {
      window.location.href = "index.html";
    }
    return false;
  }
  return true;
}

function updateUserNameUI() {
  if (!currentUser) return;
  var el = document.getElementById('welcomeUser');
  if (el) el.textContent = 'Hello, ' + currentUser.name + '! 👋';
  var el2 = document.getElementById('userName');
  if (el2) el2.textContent = currentUser.name;
  var el3 = document.getElementById('marketUserName');
  if (el3) el3.textContent = currentUser.name;
}

// ================= ADD PRODUCT =================
// this is where the user can upload the product 
function addProduct(event) {
  if (event) event.preventDefault();
  if (!checkAuth()) return;
  
  var name = document.getElementById('productName')?.value.trim();
  var price = parseFloat(document.getElementById('productPrice')?.value || 0);
  var category = document.getElementById('productCategory')?.value;
  var location = document.getElementById('productLocation')?.value;
  var contact = document.getElementById('productContact')?.value.trim();
  var description = document.getElementById('productDescription')?.value.trim() || 'No description';
  var imageInput = document.getElementById('productImage');
  
  if (!name || !price || !category || !location || !contact) {
    alert('Please fill all required fields');
    return;
  }
  
  var saveIt = function(imgData) {
    var all = getProducts();
    var maxId = 6;
    for (var i = 0; i < all.length; i++) {
      if (all[i].id > maxId) maxId = all[i].id;
    }
    var product = {
      id: maxId + 1,
      sellerId: currentUser.id,
      seller: currentUser.name,
      name: name,
      price: price,
      category: category,
      location: location,
      contact: contact,
      description: description,
      image: imgData || 'https://via.placeholder.com/300?text=No+Image',
      sold: false,
      views: 0,
      dateAdded: new Date().toISOString()
    };
    all.unshift(product);
    saveProducts(all);
    alert('Product posted successfully!');
    window.location.href = 'dashboard.html';
  };
  
  if (imageInput && imageInput.files && imageInput.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) { saveIt(e.target.result); };
    reader.onerror = function() { saveIt(null); };
    reader.readAsDataURL(imageInput.files[0]);
  } else {
    saveIt(null);
  }
}

// ================= DASHBOARD =================
function loadDashboard() {
  if (!checkAuth()) return;
  var grid = document.getElementById('productGrid');
  if (!grid) return;
  var all = getProducts();
  var mine = [];
  for (var i = 0; i < all.length; i++) {
    if (all[i].sellerId === currentUser.id) mine.push(all[i]);
  }
  renderDashboard(mine, grid);
  updateStats(mine);
}

function renderDashboard(list, container) {
  container.innerHTML = '';
  if (list.length === 0) {
    container.innerHTML = '<p class="empty" style="text-align:center;padding:40px;color:#7f8c8d">No products yet. <a href="add-product.html" style="color:var(--primary)">Add one</a></p>';
    return;
  }
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    var statusClass = p.sold ? 'sold' : 'available';
    var statusText = p.sold ? '🟢 SOLD' : '🔵 AVAILABLE';
    var btnText = p.sold ? 'Mark Available' : 'Mark Sold';
    container.innerHTML += 
      '<div class="product-card">' +
        '<div class="card-image">' +
          '<img src="' + p.image + '" onerror="this.src=\'https://via.placeholder.com/300\'" alt="' + p.name + '">' +
          '<span class="status-badge ' + statusClass + '">' + statusText + '</span>' +
        '</div>' +
        '<div class="card-body">' +
          '<span class="card-category">' + p.category + '</span>' +
          '<h4 class="card-title">' + p.name + '</h4>' +
          '<p class="card-price">₵' + p.price.toFixed(2) + '</p>' +
          '<p class="card-info">' + (p.description ? p.description.substring(0, 80) + (p.description.length > 80 ? '...' : '') : 'No description') + '</p>' +
          '<p class="card-location"><i class="fas fa-map-marker-alt"></i> ' + p.location + '</p>' +
          '<div class="card-actions">' +
            '<button class="btn btn-edit" onclick="toggleSold(' + p.id + ')">' + btnText + '</button>' +
            '<button class="btn btn-delete" onclick="deleteProduct(' + p.id + ')">Delete</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }
}

function updateStats(list) {
  var active = 0, sold = 0, views = 0;
  for (var i = 0; i < list.length; i++) {
    if (list[i].sold) sold++; else active++;
    views += (list[i].views || 0);
  }
  var a = document.getElementById('statActive'), s = document.getElementById('statSold'), v = document.getElementById('statViews');
  if (a) a.textContent = active;
  if (s) s.textContent = sold;
  if (v) v.textContent = views;
}

// ================= MARKETPLACE =================
function loadMarketplace() {
  var grid = document.getElementById('marketGrid');
  if (!grid) return;
  var all = getProducts();
  var avail = [];
  for (var i = 0; i < all.length; i++) {
    if (!all[i].sold) avail.push(all[i]);
  }
  renderMarketplace(avail, grid);
}

function renderMarketplace(list, container) {
  container.innerHTML = '';
  
  if (list.length === 0) {
    container.innerHTML = '<p class="empty">No items found. Be the first to post!</p>';
    return;
  }
  
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    
    // Show ONLY: image, name, price, location (hide description, contact, seller details)
    container.innerHTML += 
      '<div class="product-card" onclick="openProductModal(' + p.id + ')">' +
        '<div class="card-image">' +
          '<img src="' + p.image + '" onerror="this.src=\'https://via.placeholder.com/300\'" alt="' + p.name + '">' +
          (p.sold ? '<span class="status-badge sold">SOLD</span>' : '') +
        '</div>' +
        '<div class="card-body">' +
          '<span class="card-category">' + p.category + '</span>' +
          '<h4 class="card-title">' + p.name + '</h4>' +
          '<p class="card-price">₵' + p.price.toFixed(2) + '</p>' +
          '<p class="card-location"><i class="fas fa-map-marker-alt"></i> ' + p.location + '</p>' +
          '<button class="btn btn-view" onclick="event.stopPropagation(); openProductModal(' + p.id + ')">👁 View Details</button>' +
        '</div>' +
      '</div>';
  }
}

// ================= ACTIONS =================
function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  var all = getProducts();
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === id && all[i].sellerId === currentUser.id) {
      all.splice(i, 1);
      saveProducts(all);
      loadDashboard();
      alert('Deleted');
      return;
    }
  }
  alert('Not found');
}

function toggleSold(id) {
  var all = getProducts();
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === id && all[i].sellerId === currentUser.id) {
      all[i].sold = !all[i].sold;
      saveProducts(all);
      loadDashboard();
      alert(all[i].sold ? 'Marked SOLD' : 'Marked AVAILABLE');
      return;
    }
  }
}

function viewProduct(id) {
  var all = getProducts();
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === id) {
      all[i].views = (all[i].views || 0) + 1;
      saveProducts(all);
      alert('📦 ' + all[i].name + '\n💰 ₵' + all[i].price + '\n📍 ' + all[i].location + '\n👤 ' + all[i].seller + '\n📞 ' + all[i].contact);
      return;
    }
  }
}

function contactSeller(name, contact) {
  var phone = contact.replace(/\D/g, '');
  if (phone.length >= 10) {
    if (confirm('Open WhatsApp to contact ' + name + '?')) {
      window.open('https://wa.me/233' + phone, '_blank');
    }
  } else {
    alert('Contact ' + name + ': ' + contact);
  }
}

// ================= FILTERS =================
function filterDashboard() {
  var search = (document.getElementById('dashSearch')?.value || '').toLowerCase();
  var cat = document.getElementById('dashCategory')?.value || 'All';
  var loc = document.getElementById('dashLocation')?.value || 'All';
  var all = getProducts();
  var filtered = [];
  for (var i = 0; i < all.length; i++) {
    if (all[i].sellerId !== currentUser.id) continue;
    if (search && all[i].name.toLowerCase().indexOf(search) === -1 && (all[i].description || '').toLowerCase().indexOf(search) === -1) continue;
    if (cat !== 'All' && all[i].category !== cat) continue;
    if (loc !== 'All' && all[i].location !== loc) continue;
    filtered.push(all[i]);
  }
  renderDashboard(filtered, document.getElementById('productGrid'));
}

function searchMarketplace() { applyMarketplaceFilters(); }

function filterMarket(cat, btn) {
  var btns = document.querySelectorAll('.filter-btn');
  for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
  if (btn) btn.classList.add('active');
  applyMarketplaceFilters(cat);
}

function applyMarketplaceFilters(selCat) {
  var search = (document.getElementById('marketSearch')?.value || '').toLowerCase();
  var loc = document.getElementById('marketLocation')?.value || 'All';
  var price = document.getElementById('priceRange')?.value || 'All';
  var activeBtn = document.querySelector('.filter-btn.active');
  var cat = selCat || (activeBtn ? activeBtn.textContent.trim().replace(/^[^\s]+\s/, '') : 'All');
  var all = getProducts();
  var filtered = [];
  for (var i = 0; i < all.length; i++) {
    if (all[i].sold) continue;
    if (search && all[i].name.toLowerCase().indexOf(search) === -1 && (all[i].category || '').toLowerCase().indexOf(search) === -1) continue;
    if (cat !== 'All' && all[i].category !== cat) continue;
    if (loc !== 'All' && all[i].location !== loc) continue;
    if (price !== 'All') {
      var p = all[i].price;
      if (price === '0-100' && p > 100) continue;
      if (price === '100-500' && (p <= 100 || p > 500)) continue;
      if (price === '500-1000' && (p <= 500 || p > 1000)) continue;
      if (price === '1000+' && p <= 1000) continue;
    }
    filtered.push(all[i]);
  }
  renderMarketplace(filtered, document.getElementById('marketGrid'));
}

// ================= CHAT =================
function loadMessages() {
  var list = document.getElementById('chatList');
  if (!list) return;
  list.innerHTML = '<p style="padding:15px;color:#7f8c8d;text-align:center">No messages yet</p>';
}
function openChat() {
  var modal = document.getElementById('chatModal');
  if (modal) { modal.style.display = 'flex'; loadMessages(); }
}
function closeChat() {
  var modal = document.getElementById('chatModal');
  if (modal) modal.style.display = 'none';
}
function sendMessage() {
  var input = document.getElementById('chatInput');
  if (input && input.value.trim()) { alert('Message sent!'); input.value = ''; }
}
window.onclick = function(event) {
  var modal = document.getElementById('chatModal');
  if (modal && event.target === modal) closeChat();
};

// ================= PAGE LOAD =================
document.addEventListener('DOMContentLoaded', function() {
  var page = window.location.pathname.split('/').pop();
  if (page === 'dashboard.html') { checkAuth(); loadDashboard(); loadMessages(); updateUserNameUI(); }
  else if (page === 'marketplace.html') { checkAuth(); loadMarketplace(); updateUserNameUI(); }
});
// ================= PRODUCT MODAL =================

function openProductModal(productId) {
  var all = getProducts();
  var product = null;
  
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === productId) {
      product = all[i];
      break;
    }
  }
  
  if (!product) return;
  
  // Increment view count
  product.views = (product.views || 0) + 1;
  saveProducts(all);
  
  // Build modal content (show FULL details here)
  var modalBody = document.getElementById('productModalBody');
  modalBody.innerHTML = 
    '<div class="modal-product">' +
      '<div class="modal-product-img">' +
        '<img src="' + product.image + '" onerror="this.src=\'https://via.placeholder.com/300\'" alt="' + product.name + '">' +
      '</div>' +
      '<div class="modal-product-info">' +
        '<h2>' + product.name + '</h2>' +
        '<p class="price">₵' + product.price.toFixed(2) + '</p>' +
        '<p class="meta"><i class="fas fa-tag"></i> <strong>Category:</strong> ' + product.category + '</p>' +
        '<p class="meta"><i class="fas fa-map-marker-alt"></i> <strong>Location:</strong> ' + product.location + '</p>' +
        '<p class="meta"><i class="fas fa-user"></i> <strong>Seller:</strong> ' + product.seller + '</p>' +
        '<p class="meta"><i class="fas fa-eye"></i> <strong>Views:</strong> ' + (product.views || 0) + '</p>' +
        '<p class="meta"><i class="fas fa-calendar"></i> <strong>Posted:</strong> ' + new Date(product.dateAdded).toLocaleDateString() + '</p>' +
        '<div class="description">' +
          '<strong>Description:</strong><br>' +
          (product.description || 'No description provided') +
        '</div>' +
        '<div class="seller-info">' +
          '<p><strong>📞 Contact Seller:</strong></p>' +
          '<p><i class="fas fa-phone"></i> ' + product.contact + '</p>' +
        '</div>' +
        '<div class="modal-actions">' +
          '<button class="btn-contact-large btn-whatsapp" onclick="contactViaWhatsApp(\'' + product.seller + '\', \'' + product.contact + '\')">' +
            '<i class="fab fa-whatsapp"></i> Chat on WhatsApp' +
          '</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  
  // Show modal
  var modal = document.getElementById('productModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
}

function closeProductModal() {
  var modal = document.getElementById('productModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
  }
}

function contactViaWhatsApp(sellerName, contact) {
  var phone = contact.replace(/\D/g, '');
  var msg = 'Hi ' + sellerName + ', I saw your item "' + document.getElementById('productModalBody').querySelector('h2')?.textContent + '" on Campus Marketplace and I\'m interested!';
  
  if (phone.length >= 10) {
    window.open('https://wa.me/233' + phone + '?text=' + encodeURIComponent(msg), '_blank');
  } else {
    alert('Contact ' + sellerName + ' at: ' + contact);
  }
}

// Close modal when clicking outside
window.onclick = function(event) {
  var modal = document.getElementById('productModal');
  var chatModal = document.getElementById('chatModal');
  
  if (modal && event.target === modal) {
    closeProductModal();
  }
  if (chatModal && event.target === chatModal) {
    closeChat();
  }
};

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeProductModal();
    closeChat();
  }
});
// ================= EXPOSE =================
window.login = login;
window.signup = signup;
window.logout = logout;
window.checkAuth = checkAuth;
window.addProduct = addProduct;
window.loadDashboard = loadDashboard;
window.loadMarketplace = loadMarketplace;
window.deleteProduct = deleteProduct;
window.toggleSold = toggleSold;
window.viewProduct = viewProduct;
window.contactSeller = contactSeller;
window.filterDashboard = filterDashboard;
window.searchMarketplace = searchMarketplace;
window.filterMarket = filterMarket;
window.applyMarketplaceFilters = applyMarketplaceFilters;
window.loadMessages = loadMessages;
window.openChat = openChat;
window.closeChat = closeChat;
window.sendMessage = sendMessage;