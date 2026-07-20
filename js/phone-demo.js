const CONFETTI_COLOURS = ["#d99a2b", "#a63a2e", "#4f7a3d", "#2f6f73", "#70486f", "#f7f2e6"];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function getRoles(root) {
  return [...root.querySelectorAll("[data-role]")].reduce((roles, element) => {
    const key = element.dataset.role.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    roles[key] = element;
    return roles;
  }, {});
}

function schedule(timers, delay, callback) {
  timers.push(window.setTimeout(callback, delay));
}

function setStatus(roles, message) {
  roles.status.textContent = message;
}

function setHidden(element, hidden) {
  element.hidden = hidden;
}

function replaceList(list, items) {
  list.replaceChildren(...items.map((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    return item;
  }));
}

function spawnHearts(root, button, count = 5, ambient = false) {
  if (reducedMotion) return;
  const rootRect = root.getBoundingClientRect();
  const buttonRect = button.getBoundingClientRect();
  const startX = ambient ? rootRect.width * 0.72 : buttonRect.left - rootRect.left + buttonRect.width / 2;
  const startY = ambient ? rootRect.height * 0.68 : buttonRect.top - rootRect.top + 4;

  for (let index = 0; index < count; index += 1) {
    const heart = document.createElement("span");
    heart.className = "khaya-heart";
    heart.setAttribute("aria-hidden", "true");
    heart.textContent = "❤";
    heart.style.left = `${startX + (Math.random() * 30 - 15)}px`;
    heart.style.top = `${startY + (Math.random() * 8 - 4)}px`;
    heart.style.setProperty("--heart-delay", `${index * 75}ms`);
    heart.style.setProperty("--heart-x", `${Math.random() * 40 - 20}px`);
    root.appendChild(heart);
    window.setTimeout(() => heart.remove(), 1550);
  }
}

function celebrateMarketOpen(root) {
  if (reducedMotion) return;
  for (let index = 0; index < 70; index += 1) {
    const piece = document.createElement("span");
    piece.className = "demo-confetti";
    piece.setAttribute("aria-hidden", "true");
    piece.style.setProperty("--confetti-left", `${Math.random() * 100}%`);
    piece.style.setProperty("--confetti-colour", CONFETTI_COLOURS[index % CONFETTI_COLOURS.length]);
    piece.style.setProperty("--confetti-delay", `${Math.random() * .65}s`);
    piece.style.setProperty("--confetti-duration", `${2.6 + Math.random() * 1.7}s`);
    piece.style.setProperty("--confetti-drift", `${Math.random() * 150 - 75}px`);
    piece.style.setProperty("--confetti-turn", `${360 + Math.random() * 720}deg`);
    root.appendChild(piece);
    window.setTimeout(() => piece.remove(), 5000);
  }
}

function resetPhoto(root, roles) {
  root.classList.remove("is-complete");
  roles.changePhoto.classList.remove("is-tapped");
  roles.takePhoto.classList.remove("is-tapped");
  roles.cameraFlash.classList.remove("is-flashing");
  roles.usePhoto.classList.remove("is-tapped");
  roles.realtimeBeam.classList.remove("is-sending");
  roles.zoomLevel.classList.remove("is-zooming");
  setHidden(roles.photoSheet, true);
  setHidden(roles.cropModal, true);
  roles.ownerImage.src = "assets/khaya/cappuccino-muffins.svg";
  roles.visitorImage.src = "assets/khaya/cappuccino-muffins.svg";
  roles.visitorImage.alt = "Cappuccino Muffins";
  roles.visitorName.textContent = "Cappuccino Muffins";
  roles.visitorPhoto.classList.remove("is-purple");
  roles.visitorCard.classList.remove("is-live-updated");
  roles.visitorPrice.textContent = "R18";
  replaceList(roles.visitorDescription, ["Coffee-swirled sponge, whipped topping", "Baked fresh to order"]);
  roles.visitorLabel.textContent = "Visitor’s phone";
  roles.visitorLabel.classList.remove("is-updated");
  setStatus(roles, "The owner is ready to change the product photo.");
}

function finishPhoto(root, roles) {
  setHidden(roles.cropModal, true);
  roles.ownerImage.src = "assets/khaya/carrot-cake-muffins.svg";
  roles.visitorImage.classList.add("is-swapping");
  roles.realtimeBeam.classList.add("is-sending");
  window.setTimeout(() => {
    roles.visitorImage.src = "assets/khaya/carrot-cake-muffins.svg";
    roles.visitorImage.alt = "Carrot Cake Muffins";
    roles.visitorName.textContent = "Carrot Cake Muffins";
    roles.visitorPhoto.classList.add("is-purple");
    roles.visitorPrice.textContent = "R20";
    replaceList(roles.visitorDescription, ["Cream cheese icing, toasted walnut", "Made with fresh farm carrots"]);
    roles.visitorImage.classList.remove("is-swapping");
    roles.visitorCard.classList.add("is-live-updated");
    roles.visitorLabel.textContent = "Updated live";
    roles.visitorLabel.classList.add("is-updated");
    root.classList.add("is-complete");
  }, reducedMotion ? 0 : 320);
  setStatus(roles, "The new photo appears on the visitor’s phone in real time.");
}

function playPhoto(root, roles, timers) {
  resetPhoto(root, roles);
  if (reducedMotion) {
    finishPhoto(root, roles);
    return;
  }
  schedule(timers, 900, () => {
    roles.changePhoto.classList.add("is-tapped");
    setStatus(roles, "The owner taps “Change photo”.");
  });
  schedule(timers, 1700, () => {
    setHidden(roles.photoSheet, false);
    setStatus(roles, "Take a new photo, or choose one from the phone’s library.");
  });
  schedule(timers, 2700, () => {
    roles.takePhoto.classList.add("is-tapped");
    roles.cameraFlash.classList.add("is-flashing");
    setStatus(roles, "The owner chooses “Take Photo” and captures the new product.");
  });
  schedule(timers, 3500, () => {
    setHidden(roles.photoSheet, true);
    setHidden(roles.cropModal, false);
    setStatus(roles, "Khaya Kos opens its square crop tool.");
  });
  schedule(timers, 4800, () => {
    roles.zoomLevel.classList.add("is-zooming");
    setStatus(roles, "Drag to frame the product, then adjust the zoom.");
  });
  schedule(timers, 6200, () => {
    roles.usePhoto.classList.add("is-tapped");
    setStatus(roles, "The owner taps “Use this photo”.");
  });
  schedule(timers, 6950, () => finishPhoto(root, roles));
}

function resetProduct(root, roles) {
  root.classList.remove("is-complete");
  roles.ownerControl.classList.remove("is-editing", "is-sold");
  roles.ownerPrice.textContent = "18";
  roles.ownerStock.textContent = "1";
  roles.productPrice.textContent = "R18";
  roles.productPrice.classList.remove("is-changing");
  roles.productCard.classList.remove("is-sold-out", "is-live-updated");
  setStatus(roles, "The customer currently sees R18 and one item remaining.");
}

function playProduct(root, roles, timers) {
  resetProduct(root, roles);
  const finish = () => {
    roles.ownerStock.textContent = "0";
    roles.ownerControl.classList.add("is-sold");
    roles.productCard.classList.add("is-sold-out", "is-live-updated");
    root.classList.add("is-complete");
    setStatus(roles, "The last sale is recorded and the visitor sees Sold Out.");
  };
  if (reducedMotion) {
    roles.ownerPrice.textContent = "20";
    roles.productPrice.textContent = "R20";
    finish();
    return;
  }
  schedule(timers, 1000, () => {
    roles.ownerControl.classList.add("is-editing");
    roles.ownerPrice.textContent = "20";
    setStatus(roles, "The owner changes the price from R18 to R20.");
  });
  schedule(timers, 2200, () => {
    roles.productPrice.textContent = "R20";
    roles.productPrice.classList.add("is-changing");
    roles.productCard.classList.add("is-live-updated");
    setStatus(roles, "R20 appears on the visitor’s phone without a refresh.");
  });
  schedule(timers, 4200, finish);
}

function resetLikes(root, roles) {
  root.querySelectorAll(".khaya-heart").forEach((heart) => heart.remove());
  roles.likeButton.classList.remove("is-liked");
  roles.likeIcon.textContent = "♡";
  roles.likeCount.textContent = "0";
  setStatus(roles, "The Khaya Kos heart is ready for a visitor.");
}

function playLikes(root, roles, timers) {
  resetLikes(root, roles);
  const firstLike = () => {
    roles.likeButton.classList.add("is-liked");
    roles.likeIcon.textContent = "❤";
    roles.likeCount.textContent = "1";
    spawnHearts(root, roles.likeButton, 5);
    setStatus(roles, "Five hearts rise as the visitor’s like is counted.");
  };
  if (reducedMotion) {
    firstLike();
    roles.likeCount.textContent = "2";
    return;
  }
  schedule(timers, 1200, firstLike);
  schedule(timers, 3600, () => {
    roles.likeCount.textContent = "2";
    spawnHearts(root, roles.likeButton, 3, true);
    setStatus(roles, "A second live like arrives from another visitor.");
  });
}

function resetMarket(root, roles) {
  root.querySelectorAll(".demo-confetti").forEach((piece) => piece.remove());
  roles.marketToggle.classList.remove("is-opening", "is-open");
  roles.marketToggleTitle.textContent = "Market closed";
  roles.marketToggleDetail.textContent = "Tap to open";
  setHidden(roles.menuView, false);
  setHidden(roles.marketView, true);
  setStatus(roles, "Visitors are browsing the regular weekly menu.");
}

function playMarket(root, roles, timers) {
  resetMarket(root, roles);
  const openMarket = () => {
    roles.marketToggle.classList.remove("is-opening");
    roles.marketToggle.classList.add("is-open");
    roles.marketToggleTitle.textContent = "Market open";
    roles.marketToggleDetail.textContent = "Live at Gazebo Valley";
    setHidden(roles.menuView, true);
    setHidden(roles.marketView, false);
    celebrateMarketOpen(root);
    setStatus(roles, "Connected visitors enter the live market under the confetti.");
  };
  if (reducedMotion) {
    openMarket();
    return;
  }
  schedule(timers, 1200, () => {
    roles.marketToggle.classList.add("is-opening");
    setStatus(roles, "The owner taps “Market closed”.");
  });
  schedule(timers, 2300, openMarket);
}

function createChapterController(root) {
  const roles = getRoles(root);
  const demoName = root.dataset.demoChapter;
  let timers = [];
  let hasPlayed = false;

  function clearTimers() {
    timers.forEach((timer) => window.clearTimeout(timer));
    timers = [];
  }

  function play() {
    clearTimers();
    hasPlayed = true;
    root.classList.add("is-in-view");
    if (demoName === "photo") playPhoto(root, roles, timers);
    if (demoName === "product") playProduct(root, roles, timers);
    if (demoName === "likes") playLikes(root, roles, timers);
    if (demoName === "market") playMarket(root, roles, timers);
  }

  roles.replay.addEventListener("click", play);
  return { play, get hasPlayed() { return hasPlayed; } };
}

export function initialisePhoneDemo() {
  const chapters = [...document.querySelectorAll("[data-demo-chapter]")];
  if (!chapters.length) return;

  const controllers = new Map(chapters.map((chapter) => [chapter, createChapterController(chapter)]));
  if (reducedMotion || !("IntersectionObserver" in window)) {
    controllers.forEach((controller) => controller.play());
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const controller = controllers.get(entry.target);
      if (!entry.isIntersecting || controller.hasPlayed) return;
      entry.target.classList.add("is-in-view");
      window.setTimeout(() => controller.play(), 550);
      observer.unobserve(entry.target);
    });
  }, { threshold: .28, rootMargin: "0px 0px -8%" });

  chapters.forEach((chapter) => observer.observe(chapter));
}
