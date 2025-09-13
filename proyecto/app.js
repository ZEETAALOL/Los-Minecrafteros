(function(){
  // ---------- Data inicial ----------
  const PRODUCTS = [
    { code:"JM001", category:"Juegos de Mesa", name:"Catan", price:29990, desc:"Juego de estrategia 3-4 jugadores.", stock:10, img:"https://via.placeholder.com/400x250?text=Catan" },
    { code:"JM002", category:"Juegos de Mesa", name:"Carcassonne", price:24990, desc:"Juego de colocación de fichas 2-5 jugadores.", stock:6, img:"https://via.placeholder.com/400x250?text=Carcassonne" },
    { code:"AC001", category:"Accesorios", name:"Controlador Inalámbrico Xbox Series X", price:59990, desc:"Control inalámbrico compatible con Xbox y PC.", stock:5, img:"https://via.placeholder.com/400x250?text=Control+Xbox" },
    { code:"AC002", category:"Accesorios", name:"Auriculares HyperX Cloud II", price:79990, desc:"Auriculares gaming con micrófono desmontable.", stock:8, img:"https://via.placeholder.com/400x250?text=HyperX+Cloud+II" },
    { code:"CO001", category:"Consolas", name:"PlayStation 5", price:549990, desc:"Consola Sony PS5.", stock:3, img:"https://via.placeholder.com/400x250?text=PS5" },
    { code:"CG001", category:"Computadores Gamers", name:"PC Gamer ASUS ROG Strix", price:1299990, desc:"PC potente para gaming.", stock:2, img:"https://via.placeholder.com/400x250?text=ASUS+ROG" },
    { code:"SG001", category:"Sillas Gamers", name:"Silla Secretlab Titan", price:349990, desc:"Silla ergonómica para largas sesiones.", stock:7, img:"https://via.placeholder.com/400x250?text=Secretlab+Titan" },
    { code:"MS001", category:"Mouse", name:"Logitech G502 HERO", price:49990, desc:"Mouse con sensor de alta precisión.", stock:12, img:"https://via.placeholder.com/400x250?text=G502" },
    { code:"MP001", category:"Mousepad", name:"Razer Goliathus Extended Chroma", price:29990, desc:"Mousepad con iluminación RGB.", stock:10, img:"https://via.placeholder.com/400x250?text=Razer+Goliathus" },
    { code:"PP001", category:"Poleras Personalizadas", name:"Polera Level-Up", price:14990, desc:"Polera personalizada 'Level-Up'.", stock:20, img:"https://via.placeholder.com/400x250?text=Polera+LevelUp" }
  ];

  // ---------- Utilidades ----------
  function formatCLP(n){ return n.toLocaleString('es-CL',{style:'currency',currency:'CLP'}); }
  function uid(prefix='id'){ return prefix+'_'+Math.random().toString(36).slice(2,10); }
  function todayYear(){ return new Date().getFullYear(); }

  // ---------- LocalStorage ----------
  function dbGet(key, def=null){ try{ const v=localStorage.getItem(key); return v?JSON.parse(v):def; }catch(e){return def;} }
  function dbSet(key,val){ localStorage.setItem(key, JSON.stringify(val)); }

  if(!dbGet('lug_products')) dbSet('lug_products', PRODUCTS);
  if(!dbGet('lug_users')) dbSet('lug_users', []);
  if(!dbGet('lug_cart')) dbSet('lug_cart', []);
  if(!dbGet('lug_reviews')) dbSet('lug_reviews', []);
  if(!dbGet('lug_current')) dbSet('lug_current',{userId:null});

  let PRODUCTS_DB = dbGet('lug_products');
  let USERS_DB = dbGet('lug_users');
  let REVIEWS_DB = dbGet('lug_reviews');
  let CURRENT = dbGet('lug_current');
  let CART = dbGet('lug_cart');

  // ---------- Helpers ----------
  function getCurrentUser(){
    const cur = dbGet('lug_current') || {userId:null};
    if(!cur.userId) return null;
    const users = dbGet('lug_users') || [];
    return users.find(u=>u.id===cur.userId) || null;
  }
  function getLevel(points){
    if(!points) return 1;
    if(points<100) return 1;
    if(points<500) return 2;
    if(points<1000) return 3;
    return 4;
  }

  // ---------- Render año en footer ----------
  const yearEl = document.getElementById('current-year');
  if(yearEl) yearEl.textContent = todayYear();

  // ---------- Render catálogo ----------
  function renderProducts(){
    const grid = document.getElementById('product-grid');
    if(!grid) return;
    grid.innerHTML = PRODUCTS_DB.map(p=>`
      <div class="col-md-4">
        <div class="card card-product h-100 p-2">
          <img src="${p.img}" class="img-fluid rounded" alt="${p.name}">
          <div class="mt-2 d-flex justify-content-between align-items-start">
            <div>
              <h5 class="mb-1">${p.name}</h5>
              <div class="muted small">${p.category} • ${p.code}</div>
            </div>
            <div class="text-end">
              <div class="h6">${formatCLP(p.price)}</div>
              <div class="muted small">${p.stock>0? 'En stock':'Agotado'}</div>
            </div>
          </div>
          <p class="mt-2">${p.desc}</p>
        </div>
      </div>
    `).join('');
  }

  // ---------- Render top usuarios ----------
  function renderTopUsers(){
    const el = document.getElementById('top-users');
    if(!el) return;
    const users = dbGet('lug_users')||[];
    const sorted = users.slice().sort((a,b)=>(b.points||0)-(a.points||0)).slice(0,5);
    el.innerHTML = sorted.length? sorted.map(u=>`
      <div>${u.name} — <span class="badge badge-points">${u.points||0} pts</span> (Nivel ${getLevel(u.points||0)})</div>
    `).join('') : '<div class="muted">Aún no hay usuarios con puntos.</div>';
  }

  // ---------- Historial de compras ----------
  function renderPurchaseHistory(){
    const el = document.getElementById('purchase-history');
    if(!el) return;
    const cur = getCurrentUser();
    if(!cur){ el.textContent = 'Inicia sesión para ver tu historial.'; return; }
    if(!cur.purchases || cur.purchases.length===0){ el.textContent = 'Aún no tienes compras.'; return; }
    el.innerHTML = cur.purchases.map(p=>`
      <div><strong>${new Date(p.date).toLocaleDateString()}</strong> — Total: ${formatCLP(p.total)} — Puntos: ${p.points}</div>
    `).join('');
  }

  // ---------- INIT ----------
  document.addEventListener('DOMContentLoaded',()=>{
    renderProducts();
    renderTopUsers();
    renderPurchaseHistory();
  });

})();
