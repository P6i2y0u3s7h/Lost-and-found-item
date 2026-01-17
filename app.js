// ---------------------------
// FIREBASE CONFIG
// ---------------------------
const firebaseConfig = {
  apiKey: "AIzaSyDHiSnOe4MkwZA_DCatnxhVQLUBzmJ9SNw",
  authDomain: "lost-and-found-system-80ca9.firebaseapp.com",
  projectId: "lost-and-found-system-80ca9",
  storageBucket: "lost-and-found-system-80ca9.appspot.com",
  messagingSenderId: "1069291577545",
  appId: "1:1069291577545:web:f2361dce9288da0f5d6d18"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ---------------------------
// DOM ELEMENTS
// ---------------------------
const form = document.getElementById('itemForm');
const itemList = document.getElementById('itemList');

const els = {
  userName: document.getElementById('userName'),
  contact: document.getElementById('contact'),
  type: document.getElementById('type'),
  itemName: document.getElementById('itemName'),
  category: document.getElementById('category'),
  location: document.getElementById('location'),
  date: document.getElementById('date'),
  description: document.getElementById('description'),
  image: document.getElementById('image'),

  fCategory: document.getElementById('fCategory'),
  fType: document.getElementById('fType'),
  fDate: document.getElementById('fDate'),
  fLocation: document.getElementById('fLocation'),
  fQuery: document.getElementById('fQuery'),

  applyFilters: document.getElementById('applyFilters'),
  clearFilters: document.getElementById('clearFilters'),
  seedDemo: document.getElementById('seedDemo'),
};

// ---------------------------
// HELPER: Convert file → Base64
// ---------------------------
function fileToBase64(file) {
  return new Promise((resolve) => {
    if (!file) return resolve("");
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

// ---------------------------
// SUBMIT FORM → SAVE TO FIRESTORE
// ---------------------------
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const imgBase64 = await fileToBase64(els.image.files[0]);

  const doc = {
    name: els.userName.value.trim(),
    contact: els.contact.value.trim(),
    type: els.type.value,
    title: els.itemName.value.trim(),
    category: els.category.value,
    location: els.location.value.trim(),
    date: els.date.value,
    description: els.description.value.trim(),
    image: imgBase64,
    createdAt: Date.now()
  };

  await db.collection("items").add(doc);

  form.reset();
  loadItems();
});

// ---------------------------
// LOAD ALL ITEMS FROM FIRESTORE
// ---------------------------
async function loadItems() {
  const snap = await db.collection("items")
    .orderBy("createdAt", "desc")
    .get();

  const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  renderItems(data);
}

loadItems();

// ---------------------------
// FILTERS
// ---------------------------
els.applyFilters.addEventListener('click', async () => {
  const snap = await db.collection("items")
    .orderBy("createdAt", "desc")
    .get();
  let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  const f = {
    category: els.fCategory.value,
    type: els.fType.value,
    date: els.fDate.value,
    location: els.fLocation.value.trim().toLowerCase(),
    q: els.fQuery.value.trim().toLowerCase(),
  };

  const filtered = items.filter(it =>
    (f.category === "" || it.category === f.category) &&
    (f.type === "" || it.type === f.type) &&
    (f.date === "" || it.date === f.date) &&
    (f.location === "" || it.location.toLowerCase().includes(f.location)) &&
    (f.q === "" || (it.title + " " + it.description).toLowerCase().includes(f.q))
  );

  renderItems(filtered);
});

els.clearFilters.addEventListener('click', () => {
  els.fCategory.value = "";
  els.fType.value = "";
  els.fDate.value = "";
  els.fLocation.value = "";
  els.fQuery.value = "";
  loadItems();
});

// ---------------------------
// DELETE ITEM
// ---------------------------
async function deleteItem(id) {
  if (!confirm("Delete this post?")) return;

  await db.collection("items").doc(id).delete();
  loadItems();
}

window.deleteItem = deleteItem; // make callable from HTML

// ---------------------------
// RENDER UI
// ---------------------------
function renderItems(list) {
  itemList.innerHTML = "";

  if (!list.length) {
    itemList.innerHTML = "<div class='empty'>No posts yet.</div>";
    return;
  }

  list.forEach(it => {
    const card = document.createElement("div");
    card.className = "item";

    card.innerHTML = `
  <img src="${it.image || 'https://via.placeholder.com/300x200?text=No+Image'}">
  <div>
    <div class="badges">
      <span class="badge ${it.type === 'found' ? 'ok' : 'warn'}">${it.type.toUpperCase()}</span>
      <span class="badge">${it.category}</span>
    </div>
    <h3>${escapeHtml(it.title)}</h3>
    <div class="meta">Location: ${escapeHtml(it.location)} • Date: ${it.date}</div>
    <p>${escapeHtml(it.description)}</p>
    <div class="meta">Posted by: ${escapeHtml(it.name)} • Contact: ${escapeHtml(it.contact)}</div>
  </div>
  <div class="controls">
    <button onclick="deleteItem('${it.id}')" class="secondary">Delete</button>
  </div>
`;


    itemList.appendChild(card);
  });
}

// ---------------------------
// UTILS
// ---------------------------
function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}
