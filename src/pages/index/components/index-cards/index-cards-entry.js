import "./index-cards.scss";

class CardsAnimation {
  constructor() {
    this.isMobile = window.innerWidth <= 767;
    this.cardItems = [];
    this.init();
  }

  init() {
    if (!this.isMobile) return;

    document.addEventListener("DOMContentLoaded", () => {
      this.setupCards();
      this.handleScroll();
      window.addEventListener("scroll", () => this.handleScroll());
      window.addEventListener("resize", () => this.handleResize());
    });
  }

  setupCards() {
    this.cardItems = Array.from(document.querySelectorAll(".cards__item"));
  }

  handleScroll() {
    if (!this.isMobile) return;

    this.cardItems.forEach((card) => {
      if (this.isElementInViewport(card)) {
        card.classList.add("animate-in");
      }
    });
  }

  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;

    return rect.top <= windowHeight * 0.8 && rect.bottom >= 0;
  }

  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 767;

    if (wasMobile !== this.isMobile) {
      if (!this.isMobile) {
        this.cardItems.forEach((card) => {
          card.classList.remove("animate-in");
        });
      } else {
        this.handleScroll();
      }
    }
  }
}

new CardsAnimation();
