import { DEMOS } from "./config.js";

const DEMO_DURATION = 7600;
const CONFETTI_COLOURS = ["#d99a2b", "#a63a2e", "#4f7a3d", "#2f6f73", "#70486f", "#f7f2e6"];

function collectRoles(root) {
  return [...root.querySelectorAll("[data-role]")].reduce((roles, element) => {
    const key = element.dataset.role.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    roles[key] = element;
    return roles;
  }, {});
}

function replaceList(list, items) {
  list.replaceChildren(...items.map((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
  }));
}

function setAction(roles, title, detail) {
  roles.ownerActionTitle.textContent = title;
  roles.ownerActionDetail.textContent = detail;
}

function setStatus(roles, message, pill = "Customer view") {
  roles.demoStatus.textContent = message;
  roles.livePill.textContent = pill;
  roles.livePill.classList.toggle("is-live", /live|open/i.test(pill));
}

function resetVisitor(roles, root) {
  root.querySelectorAll(".khaya-heart, .demo-confetti").forEach((element) => element.remove());
  roles.menuView.hidden = false;
  roles.marketView.hidden = true;
  roles.productCard.className = "khaya-card";
  roles.productPhoto.className = "khaya-card-photo";
  roles.productImage.className = "";
  roles.productImage.src = "assets/khaya/cappuccino-muffins.svg";
  roles.productImage.alt = "Cappuccino Muffins";
  roles.productName.textContent = "Cappuccino Muffins";
  replaceList(roles.productDescription, [
    "Coffee-swirled sponge, whipped topping",
    "Baked fresh to order",
  ]);
  roles.productPrice.textContent = "R18";
  roles.productPrice.className = "khaya-price";
  roles.likeButton.classList.remove("is-liked");
  roles.likeIcon.textContent = "♡";
  roles.likeCount.textContent = "0";
  roles.livePill.classList.remove("is-live");
}

function restartProgress(progress, reducedMotion) {
  progress.classList.remove("active");
  progress.style.width = "";
  void progress.offsetWidth;
  if (reducedMotion) progress.style.width = "100%";
  else progress.classList.add("active");
}

function schedule(timers, delay, callback) {
  timers.push(window.setTimeout(callback, delay));
}

function swapProductPhoto(roles) {
  roles.productImage.classList.add("is-swapping");
  window.setTimeout(() => {
    roles.productImage.src = "assets/khaya/carrot-cake-muffins.svg";
    roles.productImage.alt = "Carrot Cake Muffins";
    roles.productName.textContent = "Carrot Cake Muffins";
    roles.productPhoto.classList.add("is-purple");
    replaceList(roles.productDescription, [
      "Cream cheese icing, toasted walnut",
      "Made with fresh farm carrots",
    ]);
    roles.productPrice.textContent = "R20";
    roles.productImage.classList.remove("is-swapping");
  }, 300);
}

function spawnLikeHearts(root, button, count = 5, ambient = false) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const rootRect = root.getBoundingClientRect();
  const buttonRect = button.getBoundingClientRect();
  const originX = ambient ? 18 : buttonRect.left - rootRect.left + buttonRect.width / 2;
  const originY = ambient ? rootRect.height - 90 : buttonRect.top - rootRect.top + 4;

  for (let index = 0; index < count; index += 1) {
    const heart = document.createElement("span");
    heart.className = "khaya-heart";
    heart.setAttribute("aria-hidden", "true");
    heart.textContent = "❤";
    heart.style.left = `${originX + (Math.random() * 24 - 12)}px`;
    heart.style.top = `${originY + (Math.random() * 8 - 4)}px`;
    heart.style.setProperty("--heart-delay", `${index * 70}ms`);
    heart.style.setProperty("--heart-x", `${Math.random() * 30 - 15}px`);
    if (ambient) heart.style.fontSize = "1.35rem";
    root.appendChild(heart);
    window.setTimeout(() => heart.remove(), 1500);
  }
}

function celebrateMarketOpen(root) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  for (let index = 0; index < 70; index += 1) {
    const piece = document.createElement("span");
    piece.className = "demo-confetti";
    piece.setAttribute("aria-hidden", "true");
    piece.style.setProperty("--confetti-left", `${Math.random() * 100}%`);
    piece.style.setProperty("--confetti-colour", CONFETTI_COLOURS[index % CONFETTI_COLOURS.length]);
    piece.style.setProperty("--confetti-delay", `${Math.random() * .8}s`);
    piece.style.setProperty("--confetti-duration", `${2.5 + Math.random() * 1.8}s`);
    piece.style.setProperty("--confetti-drift", `${Math.random() * 160 - 80}px`);
    piece.style.setProperty("--confetti-turn", `${360 + Math.random() * 720}deg`);
    root.appendChild(piece);
    window.setTimeout(() => piece.remove(), 5200);
  }
}

function runPhotoDemo(root, roles, timers) {
  setAction(roles, "Choose a new product photo", "The customer continues seeing the original Cappuccino Muffins card.");
  setStatus(roles, "Customer currently sees the original product.");

  schedule(timers, 1650, () => {
    setAction(roles, "Frame it inside the square", "Khaya Kos compresses and crops every owner photo before publishing.");
    setStatus(roles, "The current product remains stable while the photo is prepared.");
  });
  schedule(timers, 3550, () => {
    setAction(roles, "Tap “Use this photo”", "The saved image is sent once and the visitor card is patched in place.");
    setStatus(roles, "The new photo is syncing…", "Updating live");
  });
  schedule(timers, 4550, () => {
    swapProductPhoto(roles);
    setStatus(roles, "The same card now shows the new product photo.", "Updated live");
  });
}

function runProductDemo(roles, timers) {
  setAction(roles, "Change the product price", "The owner edits R18 to R20 in the focused inventory workspace.");
  setStatus(roles, "The visitor still sees R18 until the change arrives.");

  schedule(timers, 1800, () => {
    roles.productPrice.textContent = "R20";
    roles.productPrice.classList.add("is-changing");
    setStatus(roles, "The yellow price tag updates to R20.", "Price updated live");
  });
  schedule(timers, 3800, () => {
    setAction(roles, "Record the last item sold", "At zero stock, Khaya Kos applies its real market sold-out treatment.");
    setStatus(roles, "The final stock update is arriving…", "Stock syncing");
  });
  schedule(timers, 5050, () => {
    roles.productCard.classList.add("is-sold-out");
    setStatus(roles, "The product is now clearly marked Sold Out.", "Stock updated live");
  });
}

function runLikesDemo(root, roles, timers) {
  setAction(roles, "A visitor taps the heart", "This is a public interaction—no owner login or page reload is needed.");
  setStatus(roles, "The real Khaya Kos like button is ready.");

  schedule(timers, 1700, () => {
    roles.likeButton.classList.add("is-liked");
    roles.likeIcon.textContent = "❤";
    roles.likeCount.textContent = "1";
    spawnLikeHearts(root, roles.likeButton);
    setStatus(roles, "Five hearts rise from the button as the count becomes 1.", "Liked live");
  });
  schedule(timers, 4200, () => {
    setAction(roles, "Someone else likes it", "Ambient hearts show visitors that another person is active on the site.");
    roles.likeCount.textContent = "2";
    spawnLikeHearts(root, roles.likeButton, 3, true);
    setStatus(roles, "Another live like arrives from a different visitor.", "2 live likes");
  });
}

function runMarketDemo(root, roles, timers) {
  setAction(roles, "Tap “Market closed”", "The owner’s market toggle publishes today’s prepared stock.");
  setStatus(roles, "Visitors currently see the regular weekly menu.");

  schedule(timers, 1900, () => {
    setAction(roles, "Market is now open", "Every connected visitor receives the live market state instantly.");
    setStatus(roles, "The site is switching to today’s market view…", "Opening market");
  });
  schedule(timers, 2800, () => {
    roles.menuView.hidden = true;
    roles.marketView.hidden = false;
    celebrateMarketOpen(root);
    setStatus(roles, "The visitor is taken to live stock under the confetti.", "Open now · Gazebo Valley");
  });
}

function showReducedMotionFinal(root, roles, demoName) {
  if (demoName === "photo") swapProductPhoto(roles);
  if (demoName === "product") {
    roles.productPrice.textContent = "R20";
    roles.productCard.classList.add("is-sold-out");
  }
  if (demoName === "likes") {
    roles.likeButton.classList.add("is-liked");
    roles.likeIcon.textContent = "❤";
    roles.likeCount.textContent = "2";
  }
  if (demoName === "market") {
    roles.menuView.hidden = true;
    roles.marketView.hidden = false;
  }
  setStatus(roles, "Final customer-visible state shown.", "Customer view");
}

export function initialisePhoneDemo() {
  const root = document.querySelector("[data-demo-showcase]");
  if (!root) return;

  const roles = collectRoles(root);
  const tabs = [...root.querySelectorAll("[role='tab']")];
  const panel = root.querySelector("[role='tabpanel']");
  const progress = root.querySelector(".progress span");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeDemo = "photo";
  let timers = [];

  function clearTimers() {
    timers.forEach((timer) => window.clearTimeout(timer));
    timers = [];
  }

  function play(demoName) {
    clearTimers();
    activeDemo = demoName;
    resetVisitor(roles, root);

    const copy = DEMOS[demoName];
    roles.storyCount.textContent = copy.count;
    roles.storyTitle.textContent = copy.title;
    roles.storyText.textContent = copy.text;
    restartProgress(progress, reducedMotion);

    tabs.forEach((tab) => {
      const selected = tab.dataset.demo === demoName;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", tabs.find((tab) => tab.dataset.demo === demoName).id);

    if (reducedMotion) {
      showReducedMotionFinal(root, roles, demoName);
      return;
    }

    if (demoName === "photo") runPhotoDemo(root, roles, timers);
    if (demoName === "product") runProductDemo(roles, timers);
    if (demoName === "likes") runLikesDemo(root, roles, timers);
    if (demoName === "market") runMarketDemo(root, roles, timers);
  }

  tabs.forEach((tab, tabIndex) => {
    tab.addEventListener("click", () => play(tab.dataset.demo));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = tabIndex;
      if (event.key === "ArrowLeft") nextIndex = (tabIndex - 1 + tabs.length) % tabs.length;
      if (event.key === "ArrowRight") nextIndex = (tabIndex + 1) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      tabs[nextIndex].focus();
      play(tabs[nextIndex].dataset.demo);
    });
  });

  roles.replay.addEventListener("click", () => play(activeDemo));
  root.style.setProperty("--demo-duration", `${DEMO_DURATION}ms`);
  play(activeDemo);
}
