import { DEMO_STORIES } from "./config.js";

const STORY_DURATION = 3400;

function getDemoElements() {
  return {
    price: document.getElementById("price"),
    stock: document.getElementById("stock"),
    stockDot: document.getElementById("stockDot"),
    foodPhoto: document.getElementById("foodPhoto"),
    addButton: document.getElementById("addButton"),
    storyCount: document.getElementById("storyCount"),
    storyTitle: document.getElementById("storyTitle"),
    storyText: document.getElementById("storyText"),
    livePill: document.getElementById("livePill"),
    progressItems: [...document.querySelectorAll(".progress span")],
  };
}

function renderStory(elements, story, index) {
  elements.storyCount.textContent = story.count;
  elements.storyTitle.textContent = story.title;
  elements.storyText.textContent = story.text;
  elements.price.textContent = story.price;
  elements.stock.textContent = story.stock;
  elements.foodPhoto.classList.toggle("sold", story.sold);
  elements.stockDot.style.background = story.sold ? "#b15b3a" : "#81ae18";
  elements.addButton.textContent = story.sold ? "NOTIFY ME" : "ADD TO ORDER";
  elements.addButton.style.background = story.sold ? "#727872" : "#202720";
  elements.livePill.textContent = index === 0 ? "Ready to edit" : "Updated live";

  if (story.flash) {
    elements.price.classList.add("flash");
    window.setTimeout(() => elements.price.classList.remove("flash"), 650);
  }

  elements.progressItems.forEach((node, progressIndex) => {
    node.className = progressIndex < index ? "done" : progressIndex === index ? "active" : "";
  });
}

export function initialisePhoneDemo() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const elements = getDemoElements();
  let currentStory = 0;

  window.setInterval(() => {
    currentStory = (currentStory + 1) % DEMO_STORIES.length;
    renderStory(elements, DEMO_STORIES[currentStory], currentStory);
  }, STORY_DURATION);
}
