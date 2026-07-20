import { DEMOS } from "./config.js";

const DEMO_DURATION = 7800;
const CONFETTI_COLOURS = ["#d99a2b", "#a63a2e", "#4f7a3d", "#2f6f73", "#70486f", "#f7f2e6"];

function getElements() {
  return {
    showcase: document.getElementById("demoShowcase"),
    panel: document.getElementById("demo-panel"),
    tabs: [...document.querySelectorAll(".demo-tab")],
    customerView: document.getElementById("customerView"),
    ownerView: document.getElementById("ownerView"),
    cropView: document.getElementById("cropView"),
    marketView: document.getElementById("marketView"),
    productCard: document.getElementById("productCard"),
    productPhoto: document.getElementById("productPhoto"),
    ownerPhoto: document.getElementById("ownerPhoto"),
    productName: document.getElementById("productName"),
    productDescription: document.getElementById("productDescription"),
    productPrice: document.getElementById("productPrice"),
    soldStamp: document.getElementById("soldStamp"),
    ownerProductName: document.getElementById("ownerProductName"),
    ownerPrice: document.getElementById("ownerPrice"),
    ownerStock: document.getElementById("ownerStock"),
    changePhotoControl: document.getElementById("changePhotoControl"),
    cropUseButton: document.getElementById("cropUseButton"),
    likeButton: document.getElementById("likeButton"),
    likeIcon: document.getElementById("likeIcon"),
    likeCount: document.getElementById("likeCount"),
    marketSwitch: document.getElementById("marketSwitch"),
    marketState: document.getElementById("marketState"),
    marketAction: document.getElementById("marketAction"),
    livePill: document.getElementById("livePill"),
    storyCount: document.getElementById("storyCount"),
    storyTitle: document.getElementById("storyTitle"),
    storyText: document.getElementById("storyText"),
    status: document.getElementById("demoStatus"),
    progress: document.querySelector(".demo-side .progress span"),
    replay: document.getElementById("replayDemo"),
  };
}

function showView(elements, view) {
  elements.customerView.hidden = view !== "customer";
  elements.ownerView.hidden = view !== "owner";
  elements.cropView.hidden = view !== "crop";
}

function setStatus(elements, text, pill = "Owner is editing") {
  elements.status.textContent = text;
  elements.livePill.textContent = pill;
  elements.livePill.classList.toggle("is-live", pill.includes("live") || pill.includes("Live"));
}

function restartProgress(elements, reducedMotion) {
  elements.progress.classList.remove("active");
  void elements.progress.offsetWidth;
  if (!reducedMotion) elements.progress.classList.add("active");
}

function resetDemo(elements) {
  elements.showcase.querySelectorAll(".demo-heart, .demo-confetti").forEach((node) => node.remove());
  showView(elements, "customer");
  elements.marketView.hidden = true;
  elements.productCard.hidden = false;
  elements.productCard.className = "kk-card";
  elements.productPhoto.className = "kk-photo kk-photo-muffin";
  elements.ownerPhoto.className = "owner-photo kk-photo kk-photo-muffin";
  elements.productName.textContent = "Cappuccino Muffins";
  elements.productDescription.textContent = "Soft coffee muffins with a sweet café-style finish.";
  elements.productPrice.textContent = "R35";
  elements.productPrice.className = "kk-price";
  elements.ownerProductName.value = "Cappuccino Muffins";
  elements.ownerPrice.value = "35";
  elements.ownerStock.value = "6";
  elements.ownerPrice.classList.remove("is-editing");
  elements.ownerStock.classList.remove("is-editing");
  elements.changePhotoControl.classList.remove("is-tapped");
  elements.cropUseButton.classList.remove("is-tapped");
  elements.likeButton.classList.remove("is-liked");
  elements.likeIcon.textContent = "♡";
  elements.likeCount.textContent = "12";
  elements.marketSwitch.className = "market-switch";
  elements.marketState.textContent = "Market closed";
  elements.marketAction.textContent = "Tap to open";
  elements.livePill.classList.remove("is-live");
}

function schedule(timers, delay, callback) {
  timers.push(window.setTimeout(callback, delay));
}

function animateCard(elements) {
  elements.productCard.classList.remove("is-updated");
  void elements.productCard.offsetWidth;
  elements.productCard.classList.add("is-updated");
}

function spawnHearts(elements, count = 6, ambient = false) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  for (let index = 0; index < count; index += 1) {
    const heart = document.createElement("span");
    heart.className = "demo-heart";
    heart.setAttribute("aria-hidden", "true");
    heart.textContent = "❤";
    heart.style.setProperty("--heart-delay", `${index * 80}ms`);
    heart.style.setProperty("--heart-x", `${(index - (count - 1) / 2) * (ambient ? 15 : 10)}px`);
    heart.style.setProperty("--heart-turn", `${(index - 2) * 7}deg`);
    if (ambient) {
      heart.style.left = `${8 + index * 3}%`;
      heart.style.top = "78%";
      heart.style.fontSize = "1.5rem";
    }
    elements.showcase.appendChild(heart);
    window.setTimeout(() => heart.remove(), 1700);
  }
}

function celebrateMarketOpen(elements) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  for (let index = 0; index < 70; index += 1) {
    const piece = document.createElement("span");
    piece.className = "demo-confetti";
    piece.setAttribute("aria-hidden", "true");
    piece.style.setProperty("--confetti-left", `${Math.random() * 100}%`);
    piece.style.setProperty("--confetti-colour", CONFETTI_COLOURS[index % CONFETTI_COLOURS.length]);
    piece.style.setProperty("--confetti-delay", `${Math.random() * .65}s`);
    piece.style.setProperty("--confetti-duration", `${2.4 + Math.random() * 1.5}s`);
    piece.style.setProperty("--confetti-drift", `${Math.random() * 150 - 75}px`);
    piece.style.setProperty("--confetti-turn", `${360 + Math.random() * 720}deg`);
    elements.showcase.appendChild(piece);
    window.setTimeout(() => piece.remove(), 4800);
  }
}

function runPhotoDemo(elements, timers) {
  showView(elements, "owner");
  setStatus(elements, "Opening the owner photo controls…");

  schedule(timers, 1100, () => {
    elements.changePhotoControl.classList.add("is-tapped");
    setStatus(elements, "Choosing a new product photo…");
  });
  schedule(timers, 2000, () => {
    showView(elements, "crop");
    setStatus(elements, "Framing the photo for a perfect square…");
  });
  schedule(timers, 4300, () => {
    elements.cropUseButton.classList.add("is-tapped");
    setStatus(elements, "Publishing the new image…", "Syncing now");
  });
  schedule(timers, 5050, () => {
    elements.productPhoto.className = "kk-photo kk-photo-cake";
    elements.productName.textContent = "Carrot Cake Muffins";
    elements.productDescription.textContent = "Moist spiced muffins finished with a creamy topping.";
    showView(elements, "customer");
    animateCard(elements);
    setStatus(elements, "Customers can already see the new photo.", "Photo updated live");
  });
}

function runProductDemo(elements, timers) {
  showView(elements, "owner");
  setStatus(elements, "The owner is changing today’s price…");

  schedule(timers, 1250, () => {
    elements.ownerPrice.classList.add("is-editing");
    elements.ownerPrice.value = "40";
    setStatus(elements, "R35 becomes R40—no developer needed.");
  });
  schedule(timers, 2600, () => {
    elements.productPrice.textContent = "R40";
    elements.productPrice.classList.add("is-changing");
    showView(elements, "customer");
    animateCard(elements);
    setStatus(elements, "The new price is visible immediately.", "Price updated live");
  });
  schedule(timers, 4300, () => {
    showView(elements, "owner");
    elements.ownerStock.classList.add("is-editing");
    elements.ownerStock.value = "0";
    setStatus(elements, "The last item just sold at the market…");
  });
  schedule(timers, 5550, () => {
    showView(elements, "customer");
    elements.productCard.classList.add("is-sold-out");
    setStatus(elements, "Sold out is now unmistakable to customers.", "Stock updated live");
  });
}

function runLikesDemo(elements, timers) {
  showView(elements, "customer");
  setStatus(elements, "A customer has found a favourite…", "Customer view");

  schedule(timers, 1550, () => {
    elements.likeButton.classList.add("is-liked");
    elements.likeIcon.textContent = "❤";
    elements.likeCount.textContent = "13";
    spawnHearts(elements);
    setStatus(elements, "Their like appears instantly for everyone.", "Liked live");
  });
  schedule(timers, 3800, () => {
    elements.likeCount.textContent = "14";
    spawnHearts(elements, 4, true);
    setStatus(elements, "Someone else is liking it right now.", "Another live like");
  });
  schedule(timers, 5700, () => {
    elements.likeCount.textContent = "15";
    spawnHearts(elements, 5, true);
    setStatus(elements, "Real activity makes the business feel busy.", "15 people love this");
  });
}

function runMarketDemo(elements, timers) {
  showView(elements, "owner");
  setStatus(elements, "The Saturday stall is ready to open…");

  schedule(timers, 1500, () => {
    elements.marketSwitch.classList.add("is-opening");
    setStatus(elements, "The owner taps one clear control…");
  });
  schedule(timers, 2350, () => {
    elements.marketSwitch.className = "market-switch is-open";
    elements.marketState.textContent = "Market open";
    elements.marketAction.textContent = "Live for visitors";
    setStatus(elements, "Market day is now live for everyone.", "Market is live");
  });
  schedule(timers, 3200, () => {
    showView(elements, "customer");
    elements.productCard.hidden = true;
    elements.marketView.hidden = false;
    celebrateMarketOpen(elements);
    setStatus(elements, "Live products, stock and directions appear together.", "Open now · Gazebo Valley");
  });
}

function showReducedMotionFinal(elements, demoName) {
  if (demoName === "photo") {
    elements.productPhoto.className = "kk-photo kk-photo-cake";
    elements.productName.textContent = "Carrot Cake Muffins";
    setStatus(elements, "The new customer-facing photo is live.", "Photo updated live");
  } else if (demoName === "product") {
    elements.productPrice.textContent = "R40";
    elements.productCard.classList.add("is-sold-out");
    setStatus(elements, "The new price and sold-out state are live.", "Stock updated live");
  } else if (demoName === "likes") {
    elements.likeButton.classList.add("is-liked");
    elements.likeIcon.textContent = "❤";
    elements.likeCount.textContent = "15";
    setStatus(elements, "The live like total is now 15.", "Liked live");
  } else {
    elements.productCard.hidden = true;
    elements.marketView.hidden = false;
    setStatus(elements, "The Saturday market is open for customers.", "Market is live");
  }
  elements.progress.style.width = "100%";
}

export function initialisePhoneDemo() {
  const elements = getElements();
  if (!elements.showcase) return;

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
    resetDemo(elements);
    const copy = DEMOS[demoName];
    elements.storyCount.textContent = copy.count;
    elements.storyTitle.textContent = copy.title;
    elements.storyText.textContent = copy.text;
    restartProgress(elements, reducedMotion);

    elements.tabs.forEach((tab) => {
      const selected = tab.dataset.demo === demoName;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    const activeTab = elements.tabs.find((tab) => tab.dataset.demo === demoName);
    if (activeTab) elements.panel.setAttribute("aria-labelledby", activeTab.id);

    if (reducedMotion) {
      showReducedMotionFinal(elements, demoName);
      return;
    }

    if (demoName === "photo") runPhotoDemo(elements, timers);
    if (demoName === "product") runProductDemo(elements, timers);
    if (demoName === "likes") runLikesDemo(elements, timers);
    if (demoName === "market") runMarketDemo(elements, timers);
  }

  elements.tabs.forEach((tab, tabIndex) => {
    tab.addEventListener("click", () => play(tab.dataset.demo));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let nextIndex = tabIndex;
      if (event.key === "ArrowLeft") nextIndex = (tabIndex - 1 + elements.tabs.length) % elements.tabs.length;
      if (event.key === "ArrowRight") nextIndex = (tabIndex + 1) % elements.tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = elements.tabs.length - 1;
      elements.tabs[nextIndex].focus();
      play(elements.tabs[nextIndex].dataset.demo);
    });
  });

  elements.replay.addEventListener("click", () => play(activeDemo));
  play(activeDemo);
}
