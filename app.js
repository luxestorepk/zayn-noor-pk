/* ================= SETTINGS (client ke hisaab se yahan badlein) ================= */
const CFG = {
  brand: "SAHAR", tag: "ATELIER", currency: "Rs.",
  wa: "923716649231",                       // WhatsApp number (website par nazar nahi aata)
  fee: 250, freeAbove: 10000,               // delivery charges
  pay: {
    easypaisa: { title: "Easypaisa", num: "03XX-XXXXXXX", name: "Account Title" },
    jazzcash:  { title: "JazzCash",  num: "03XX-XXXXXXX", name: "Account Title" }
  }
};

/* ================= PRODUCTS ================= */
const P = [
  { id: 1, name: "Noor Embroidered Lawn", fabric: "Premium lawn, 3 piece", cat: "Lawn", price: 6490, old: 7990, rating: 4.8, rev: 126, img: "p1.jpg",
    colors: [["Mint", "#a9d3bd"], ["Ivory", "#efe6d2"], ["Blush", "#e9b9b5"]], stock: { S: 5, M: 8, L: 3, XL: 2 } },
  { id: 2, name: "Gulbahar Chiffon Formal", fabric: "Chiffon with handwork, 3 piece", cat: "Formal", price: 14900, old: 17500, rating: 4.9, rev: 84, img: "p2.jpg",
    colors: [["Emerald", "#1d5a45"], ["Plum", "#5d2a45"], ["Teal", "#1e5a64"]], stock: { S: 2, M: 3, L: 4, XL: 0 } },
  { id: 3, name: "Mehr Velvet Shawl Suit", fabric: "Velvet with wool shawl, 3 piece", cat: "Winter", price: 12500, old: 0, rating: 4.7, rev: 61, img: "p3.jpg",
    colors: [["Wine", "#6e2233"], ["Navy", "#1c2b4d"], ["Bottle Green", "#16402f"]], stock: { S: 0, M: 4, L: 5, XL: 3 } },
  { id: 4, name: "Zarmeen Khaddar", fabric: "Soft khaddar, 2 piece", cat: "Winter", price: 4990, old: 5900, rating: 4.6, rev: 203, img: "p4.jpg",
    colors: [["Mustard", "#c9972b"], ["Grey", "#8a8d90"], ["Rust", "#a4502d"]], stock: { S: 9, M: 12, L: 10, XL: 6 } },
  { id: 5, name: "Anaya Organza Pret", fabric: "Organza with embroidery, 3 piece", cat: "Formal", price: 9800, old: 11200, rating: 4.8, rev: 47, img: "p5.jpg",
    colors: [["Pearl", "#efe9df"], ["Sage", "#a9b89c"], ["Rose", "#d89aa4"]], stock: { S: 1, M: 2, L: 1, XL: 0 } },
  { id: 6, name: "Rubab Printed Cotton", fabric: "Pure cotton, 2 piece", cat: "Casual", price: 3490, old: 3990, rating: 4.5, rev: 312, img: "p6.jpg",
    colors: [["Sky", "#9fc3dd"], ["Peach", "#f1c3a5"], ["Lilac", "#c2b0dc"]], stock: { S: 14, M: 18, L: 12, XL: 9 } },
  { id: 7, name: "Meerab Wedding Net", fabric: "Net with zari work, 3 piece", cat: "Formal", price: 24900, old: 29900, rating: 5.0, rev: 29, img: "p7.jpg",
    colors: [["Ruby", "#8a1c2e"], ["Gold", "#b8913f"]], stock: { S: 1, M: 1, L: 2, XL: 1 } },
  { id: 8, name: "Saba Linen Co-ord", fabric: "Linen, 2 piece", cat: "Casual", price: 5750, old: 0, rating: 4.6, rev: 95, img: "p8.jpg",
    colors: [["Sand", "#d9c7a5"], ["Olive", "#7b7d4a"], ["White", "#f5f3ee"]], stock: { S: 6, M: 7, L: 5, XL: 4 } }
];

/* ================= HELPERS ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => CFG.currency + " " + Number(n).toLocaleString("en-PK");
const stars = r => `<span class="stars" style="--r:${(r / 5) * 100}%">★★★★★</span>`;
const byId = id => P.find(p => p.id === +id);
const waLink = text => `https://wa.me/${CFG.wa}?text=${encodeURIComponent(text)}`;
const total = o => Object.values(o).reduce((a, b) => a + b, 0);

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ================= CART ================= */
let cart = [];
try { cart = JSON.parse(localStorage.getItem("sahar_cart")) || []; } catch (e) { cart = []; }
const saveCart = () => { try { localStorage.setItem("sahar_cart", JSON.stringify(cart)); } catch (e) {} updateCart(); };
const subtotal = () => cart.reduce((a, i) => a + byId(i.id).price * i.qty, 0);
const shipping = () => (subtotal() === 0 || subtotal() >= CFG.freeAbove ? 0 : CFG.fee);

function addToCart(id, color, size) {
  const f = cart.find(i => i.id === id && i.color === color && i.size === size);
  const left = byId(id).stock[size];
  if (f) { if (f.qty >= left) return toast("Is size ka itna stock nahi hai"); f.qty++; } else cart.push({ id, color, size, qty: 1 });
  saveCart(); toast("Cart mein add ho gaya");
}

function updateCart() {
  $("#cartCount").textContent = cart.reduce((a, i) => a + i.qty, 0);
  const body = $("#cartBody");
  if (!body) return;
  body.innerHTML = cart.length ? cart.map((i, k) => {
    const p = byId(i.id);
    return `<div class="ci"><div class="ph"><img src="images/${p.img}" alt="" onerror="this.remove()"></div>
      <div><h4>${p.name}</h4><small>${i.color}, size ${i.size}</small>
      <div class="qty"><button data-q="-1" data-k="${k}" aria-label="Kam">−</button><span>${i.qty}</span><button data-q="1" data-k="${k}" aria-label="Zyada">+</button></div></div>
      <div style="text-align:right"><b>${money(p.price * i.qty)}</b><br><button class="rm" data-rm="${k}">Hata dein</button></div></div>`;
  }).join("") : `<p class="empty">Aap ka cart khali hai. Collection se suit chunein.</p>`;
  $("#cartSub").textContent = money(subtotal());
  $("#cartShip").textContent = shipping() ? money(shipping()) : "Free";
  $("#cartGo").disabled = !cart.length;
}

function openCart(v) { $("#drawer").classList.toggle("show", v); $("#ov").classList.toggle("show", v); }

/* ================= PRODUCT CARDS ================= */
function stockText(p, size) {
  const n = size ? p.stock[size] : total(p.stock);
  if (n === 0) return ["out", size ? "Is size ka stock khatam" : "Out of stock"];
  if (n <= 3) return ["low", `Sirf ${n} bachay hain`];
  return ["ok", "In stock"];
}

function cardHTML(p) {
  const [c, t] = stockText(p);
  return `<article class="card" data-id="${p.id}">
    <div class="ph"><img loading="lazy" src="images/${p.img}" alt="${p.name}" onerror="this.remove()">
    ${p.old ? `<span class="tag">${Math.round((1 - p.price / p.old) * 100)}% off</span>` : ""}</div>
    <div class="cb"><h3>${p.name}</h3><p class="fab">${p.fabric}</p>
    <div class="rate">${stars(p.rating)}<small>${p.rating} (${p.rev})</small></div>
    <div class="pr"><b>${money(p.price)}</b>${p.old ? `<s>${money(p.old)}</s>` : ""}</div>
    <div><span class="lbl">Color: <em class="cn">${p.colors[0][0]}</em></span>
      <div class="sw">${p.colors.map((c, i) => `<button class="${i ? "" : "on"}" data-c="${c[0]}" title="${c[0]}" aria-label="${c[0]}" style="background:${c[1]}"></button>`).join("")}</div></div>
    <div><span class="lbl">Size</span>
      <div class="sz">${Object.keys(p.stock).map(s => `<button data-s="${s}" ${p.stock[s] ? "" : "disabled"}>${s}</button>`).join("")}</div></div>
    <div class="st ${c}">${t}</div>
    <div class="acts"><button class="btn add" ${c === "out" ? "disabled" : ""}>Add to cart</button>
    <button class="btn ghost one" ${c === "out" ? "disabled" : ""}>Order on WhatsApp</button></div></div></article>`;
}

function renderProducts(el, list) {
  el.innerHTML = list.length ? list.map(cardHTML).join("") : `<p class="empty">Koi suit nahi mila. Doosra filter try karein.</p>`;
}

function cardEvents(el) {
  el.addEventListener("click", e => {
    const card = e.target.closest(".card"); if (!card) return;
    const p = byId(card.dataset.id);
    const sw = e.target.closest(".sw button"), sz = e.target.closest(".sz button:not(:disabled)");
    if (sw) { $$(".sw button", card).forEach(b => b.classList.remove("on")); sw.classList.add("on"); $(".cn", card).textContent = sw.dataset.c; }
    if (sz) {
      $$(".sz button", card).forEach(b => b.classList.remove("on")); sz.classList.add("on");
      const [c, t] = stockText(p, sz.dataset.s); const st = $(".st", card); st.className = "st " + c; st.textContent = t;
    }
    const color = () => $(".sw .on", card).dataset.c, size = () => ($(".sz .on", card) || {}).dataset?.s;
    if (e.target.closest(".add")) { if (!size()) return toast("Pehle size select karein"); addToCart(p.id, color(), size()); }
    if (e.target.closest(".one")) {
      if (!size()) return toast("Pehle size select karein");
      window.open(waLink(`Assalam o Alaikum! Mujhe ye suit order karna hai:\n${p.name}\nColor: ${color()}\nSize: ${size()}\nPrice: ${money(p.price)}`), "_blank");
    }
  });
}

/* ================= PAGE CHROME (header, footer, drawer, chat) ================= */
function chrome() {
  const links = [["index.html", "Home"], ["collection.html", "Collection"], ["about.html", "About us"], ["contact.html", "Contact us"]];
  const cur = location.pathname.split("/").pop() || "index.html";
  $("#hdr").innerHTML = `<div class="announce">Poore Pakistan mein Cash on Delivery. Rs. ${CFG.freeAbove.toLocaleString("en-PK")} se upar delivery free.</div>
  <header class="site"><div class="wrap bar"><button class="burger" id="burger" aria-label="Menu"><span></span><span></span></button>
  <a class="logo" href="index.html">${CFG.brand}<small>${CFG.tag}</small></a>
  <nav id="nav">${links.map(l => `<a href="${l[0]}" class="${cur === l[0] ? "on" : ""}">${l[1]}</a>`).join("")}</nav>
  <button class="cartbtn" id="cartBtn">Cart <b id="cartCount">0</b></button></div></header>`;
  $("#ftr").innerHTML = `<footer class="site"><div class="wrap"><div class="fg">
  <div><div class="logo">${CFG.brand}<small>${CFG.tag}</small></div><p>Pakistani luxury lawn, formal aur winter wear. Har suit apni khoobsurti aur silai ke liye mashhoor.</p></div>
  <div><h4>Explore</h4>${links.map(l => `<a href="${l[0]}">${l[1]}</a>`).join("")}</div>
  <div><h4>Payment</h4><a>Cash on Delivery</a><a>Easypaisa</a><a>JazzCash</a></div></div>
  <p class="copy">© ${new Date().getFullYear()} ${CFG.brand} ${CFG.tag}. Tamam huqooq mehfooz hain.</p></div></footer>`;

  document.body.insertAdjacentHTML("beforeend", `
  <div class="ov" id="ov"></div>
  <aside class="drawer" id="drawer"><div class="dh"><h3>Aap ka cart</h3><button id="cartX" aria-label="Band karein">×</button></div>
    <div class="db" id="cartBody"></div>
    <div class="df"><div class="line"><span>Subtotal</span><b id="cartSub"></b></div><div class="line"><span>Delivery</span><b id="cartShip"></b></div>
    <a class="btn full" id="cartGo" href="checkout.html" style="margin-top:12px">Checkout</a></div></aside>
  <div class="toast" id="toast"></div>
  <a class="wa-float" href="${waLink("Assalam o Alaikum! Mujhe ek suit ke baare mein poochna hai.")}" target="_blank" rel="noopener" aria-label="WhatsApp par baat karein">
    <svg viewBox="0 0 32 32"><path d="M16 3C9 3 3.4 8.6 3.4 15.5c0 2.4.7 4.6 1.9 6.5L3 29l7.2-2.2a12.5 12.5 0 0 0 5.8 1.4c7 0 12.6-5.600 12.600-12.600S23 3 16 3zm0 22.800c-1.900 0-3.700-.5-5.200-1.500l-.4-.2-4.300 1.300 1.400-4.100-.3-.4a10 10 0 0 1-1.600-5.400C5.600 9.900 10.300 5.300 16 5.300s10.400 4.600 10.400 10.300S21.700 25.800 16 25.800zm5.700-7.600c-.3-.2-1.800-.9-2.100-1s-.5-.2-.7.200-.8 1-.9 1.200-.3.200-.6.100a8.400 8.400 0 0 1-4.200-3.700c-.3-.6.300-.5.900-1.700.1-.2 0-.4 0-.5l-1-2.300c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.100-.8.400s-1 1-1 2.500 1.100 2.900 1.200 3.100 2.100 3.300 5.200 4.600c1.900.8 2.700.9 3.600.7.600-.1 1.800-.8 2.100-1.500s.3-1.300.2-1.500-.3-.2-.6-.4z"/></svg></a>
  <button class="chat-fab" id="chatFab">Madad chahiye?</button>
  <section class="chat" id="chat" hidden><div class="ch"><b>${CFG.brand} Assistant</b><button id="chatX" aria-label="Band karein">×</button></div>
    <div class="cm" id="cm"></div>
    <div class="qr" id="qr">${["Delivery", "Payment", "Size", "Return", "Order kaise karein"].map(q => `<button>${q}</button>`).join("")}</div>
    <div class="cf"><input id="ci" placeholder="Apna sawal likhein..." autocomplete="off"><button id="cs">Send</button></div></section>`);

  $("#burger").onclick = () => $("#nav").classList.toggle("open");
  $("#cartBtn").onclick = () => openCart(true);
  $("#cartX").onclick = $("#ov").onclick = () => openCart(false);
  $("#cartBody").addEventListener("click", e => {
    const q = e.target.closest("[data-q]"), r = e.target.closest("[data-rm]");
    if (q) { const i = cart[q.dataset.k]; i.qty += +q.dataset.q; if (i.qty < 1) cart.splice(q.dataset.k, 1); else if (i.qty > byId(i.id).stock[i.size]) { i.qty--; toast("Itna stock nahi hai"); } saveCart(); }
    if (r) { cart.splice(r.dataset.rm, 1); saveCart(); }
  });
  updateCart(); initChat();
}

/* ================= CHATBOT ================= */
const BOT = [
  [/delivery|shipping|kitne din|kab tak|pohanch|dispatch/i, `Delivery 3 se 5 working days mein hoti hai. Rs. ${CFG.freeAbove.toLocaleString("en-PK")} se upar free, warna Rs. ${CFG.fee} charges hain.`],
  [/payment|pay|easypaisa|jazz|cod|cash|paise|raqam/i, "Aap Cash on Delivery, Easypaisa ya JazzCash se payment kar sakte hain. Checkout par apna tareeqa chun lein."],
  [/return|exchange|wapis|badal|tabdeel|kharab/i, "Size ya fault ka masla ho to delivery ke 7 din ke andar exchange ho jata hai. Suit unused aur original packing mein ho."],
  [/size|chart|naap|measure|fit|chota|bara/i, "Hamare sizes S, M, L aur XL hain. Har suit ke neeche size buttons hain, jo size available nahi woh grey nazar aata hai. Naap ke liye humein WhatsApp par message karein."],
  [/price|rate|qeemat|kitne ka|kitna|discount|sale|offer/i, "Har suit ki qeemat uski card par likhi hai. Kai suits par 10 se 20 percent tak discount chal raha hai."],
  [/order|kaise|how|khareed|buy|book/i, "Suit ka color aur size chunein, Add to cart dabayein, phir Checkout par apna poora address likh kar Place Order dabayein. Order hamare WhatsApp par aa jata hai."],
  [/fabric|lawn|kapra|material|cotton|chiffon|velvet|khaddar|quality/i, "Hum premium lawn, chiffon, organza, velvet, khaddar aur cotton ke suits rakhte hain. Har card par fabric likha hota hai."],
  [/available|stock|hai\?|mojood|color|colour|rang/i, "Har suit ke neeche color, size aur availability nazar aati hai. Sirf 3 ya kam bachay hon to 'Sirf N bachay hain' likha hota hai."],
  [/contact|number|whatsapp|call|baat|rabta|phone|address|shop/i, `Hum se baat karne ke liye <a href="${waLink("Assalam o Alaikum!")}" target="_blank" rel="noopener">WhatsApp par message karein</a>.`],
  [/salam|assalam|hello|hi\b|hey/i, "Walaikum Assalam! Aap delivery, payment, size ya order ke baare mein pooch sakte hain."],
  [/shukriya|thanks|thank|jazak/i, "Aap ka bahut shukriya! Aur koi madad chahiye to bataiye."]
];

function initChat() {
  const box = $("#cm"), add = (t, who, html) => { const d = document.createElement("div"); d.className = "m " + who; html ? d.innerHTML = t : d.textContent = t; box.appendChild(d); box.scrollTop = box.scrollHeight; };
  const ask = q => {
    if (!q.trim()) return; add(q, "me");
    const hit = BOT.find(r => r[0].test(q));
    setTimeout(() => hit ? add(hit[1], "bot", true) : add(`Is sawal ka jawab hamari team behtar de sakti hai. <a href="${waLink(q)}" target="_blank" rel="noopener">WhatsApp par poochein</a>.`, "bot", true), 400);
  };
  add("Assalam o Alaikum! Main " + CFG.brand + " ka assistant hoon. Delivery, payment, size ya order ke baare mein poochein.", "bot");
  $("#chatFab").onclick = () => { $("#chat").hidden = false; $("#chatFab").hidden = true; $("#ci").focus(); };
  $("#chatX").onclick = () => { $("#chat").hidden = true; $("#chatFab").hidden = false; };
  $("#cs").onclick = () => { ask($("#ci").value); $("#ci").value = ""; };
  $("#ci").onkeydown = e => { if (e.key === "Enter") $("#cs").click(); };
  $("#qr").onclick = e => { if (e.target.tagName === "BUTTON") ask(e.target.textContent); };
}

/* ================= PAGE: HOME / COLLECTION ================= */
function initHome() {
  const f = $("#featured"); if (!f) return;
  renderProducts(f, P.slice(0, 4)); cardEvents(f);
}

function initCollection() {
  const g = $("#products"); if (!g) return;
  let cat = new URLSearchParams(location.search).get("cat") || "All", sort = "def", q = "";
  const draw = () => {
    let l = P.filter(p => (cat === "All" || p.cat === cat) && p.name.toLowerCase().includes(q));
    if (sort === "lo") l.sort((a, b) => a.price - b.price); if (sort === "hi") l.sort((a, b) => b.price - a.price); if (sort === "rt") l.sort((a, b) => b.rating - a.rating);
    renderProducts(g, l); $$(".chip").forEach(c => c.classList.toggle("on", c.dataset.cat === cat));
  };
  $("#chips").onclick = e => { const c = e.target.closest(".chip"); if (c) { cat = c.dataset.cat; draw(); } };
  $("#sort").onchange = e => { sort = e.target.value; draw(); };
  $("#search").oninput = e => { q = e.target.value.toLowerCase().trim(); draw(); };
  cardEvents(g); draw();
}

/* ================= PAGE: CHECKOUT ================= */
function fieldCheck(form) {
  const v = n => form.elements[n].value.trim(), errs = {};
  if (!/^[A-Za-z\u0600-\u06FF .'-]{3,}$/.test(v("name"))) errs.name = "Poora naam likhein (kam az kam 3 huroof).";
  const ph = v("phone").replace(/[\s-]/g, "");
  if (!/^(03\d{9}|\+?923\d{9})$/.test(ph)) errs.phone = "Sahi mobile number likhein, jaise 03001234567.";
  if (v("email") && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v("email"))) errs.email = "Email ka format sahi nahi hai.";
  if (v("city").length < 3) errs.city = "Apna shehar likhein.";
  if (v("address").length < 15 || !/\d|house|street|gali|road|block|sector|mohalla|phase|colony/i.test(v("address"))) errs.address = "Poora address likhein: ghar/makaan number, gali ya street, mohalla ya area.";
  return { errs, ph };
}

function initCheckout() {
  const form = $("#checkoutForm"); if (!form) return;
  const sumEl = $("#sumItems");
  const drawSum = () => {
    sumEl.innerHTML = cart.map(i => { const p = byId(i.id); return `<div class="line"><span>${p.name}<small>${i.color}, ${i.size}, x${i.qty}</small></span><b>${money(p.price * i.qty)}</b></div>`; }).join("")
      + `<div class="line"><span>Subtotal</span><b>${money(subtotal())}</b></div><div class="line"><span>Delivery</span><b>${shipping() ? money(shipping()) : "Free"}</b></div>
         <div class="line tot"><span>Total</span><span>${money(subtotal() + shipping())}</span></div>`;
  };
  if (!cart.length) { form.parentElement.innerHTML = `<div class="ok-box"><h2>Cart khali hai</h2><p>Pehle collection se suit chunein.</p><br><a class="btn" href="collection.html">Collection dekhein</a></div>`; return; }
  drawSum();
  const payUpd = () => {
    const m = form.elements.pay.value; $$(".pay label").forEach(l => l.classList.toggle("on", l.querySelector("input").checked));
    const b = $("#payBox"); if (m === "cod") { b.hidden = false; b.textContent = "Suit milne par rider ko payment karein."; return; }
    const a = CFG.pay[m]; b.hidden = false;
    b.innerHTML = `<b>${a.title}</b> par payment bhejein:<br>Number: <b>${a.num}</b><br>Account title: <b>${a.name}</b><br>Payment ke baad screenshot WhatsApp par bhej dein.`;
  };
  form.addEventListener("change", payUpd); payUpd();
  form.addEventListener("submit", e => {
    e.preventDefault();
    const { errs, ph } = fieldCheck(form);
    $$(".err", form).forEach(s => s.textContent = ""); $$(".bad", form).forEach(x => x.classList.remove("bad"));
    const keys = Object.keys(errs);
    keys.forEach(k => { form.elements[k].classList.add("bad"); $(`[data-e="${k}"]`).textContent = errs[k]; });
    if (keys.length) { form.elements[keys[0]].focus(); return toast("Form mein ghalti hai, durust karein"); }
    const id = "SH-" + Date.now().toString().slice(-6), f = n => form.elements[n].value.trim();
    const payName = { cod: "Cash on Delivery", easypaisa: "Easypaisa", jazzcash: "JazzCash" }[f("pay")];
    const items = cart.map((i, n) => `${n + 1}. ${byId(i.id).name} | ${i.color} | Size ${i.size} | x${i.qty} | ${money(byId(i.id).price * i.qty)}`).join("\n");
    const msg = `*NEW ORDER ${id}* - ${CFG.brand}\n\n*Customer*\nNaam: ${f("name")}\nPhone: ${ph}\n${f("email") ? "Email: " + f("email") + "\n" : ""}Shehar: ${f("city")}\nAddress: ${f("address")}\n${f("note") ? "Note: " + f("note") + "\n" : ""}\n*Items*\n${items}\n\nSubtotal: ${money(subtotal())}\nDelivery: ${shipping() ? money(shipping()) : "Free"}\n*Total: ${money(subtotal() + shipping())}*\nPayment: ${payName}`;
    try { localStorage.setItem("sahar_last", JSON.stringify({ id, msg })); } catch (x) {}
                                                           
