import "./index-intro.scss";

class HeroAnimation {
  constructor() {
    this.config = {
      animationDuration: 2000,
      maxMovement: 7,
      mouseFollowDistance: 10,
      scrollDistance: this.getAdaptiveScrollDistance(),
    };

    this.heroItems = [];
    this.heroItemsMap = new Map();
    this.topsItemsMap = new Map();
    this.duplicatedSVGsMap = new Map();
    this.pulseShownFor = new Set();
    this.pulseActive = false;
    this.isInteracting = false;
    this.interactionTimer = null;
    this.allAnimationsCompleted = false;

    this.scrollLockTriggered = false;
    this.scrollLocked = false;
    this.scrollLockTimeout = null;

    this.animatedItemIds = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    ];
    this.animationConfig = this.getAdaptiveAnimationConfig();

    this.scrollProgress = 0;
    this.animationInterval = null;
    this.isScrollAnimating = false;

    this.init();
  }

  getAdaptiveScrollDistance() {
    const screenWidth = window.innerWidth;

    // швидкість прокрутки анімації
    if (screenWidth <= 676) {
      return 1100;
    } else {
      return 1100;
    }
  }

  getAdaptiveAnimationConfig() {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 676) {
      return {
        1: {
          speed: 1.8,
          direction: "left",
          rotation: -10,
          targetId: "tops_1",
          offsetX: 0,
        },
        2: {
          speed: 1.9,
          direction: "left",
          rotation: -10,
          targetId: "tops_3",
          offsetX: 0,
        },
        3: {
          speed: 2.0,
          direction: "right",
          rotation: -8,
          targetId: "tops_7",
          offsetX: 0,
        },
        4: {
          speed: 2.1,
          direction: "right",
          rotation: 8,
          targetId: "tops_7",
          offsetX: 0,
        },
        5: {
          speed: 2.5,
          direction: "right",
          rotation: 8,
          targetId: "tops_6",
          offsetX: 0,
        },
        6: {
          speed: 2.4,
          direction: "right",
          rotation: 10,
          targetId: "tops_5",
          offsetX: 0,
        },
        7: {
          speed: 2.3,
          direction: "right",
          rotation: 12,
          targetId: "tops_7",
          offsetX: 0,
        },
        8: {
          speed: 2.1,
          direction: "left",
          rotation: -8,
          targetId: "tops_1",
          offsetX: 0,
        },
        9: {
          speed: 2.2,
          direction: "left",
          rotation: -10,
          targetId: "tops_1",
          offsetX: 0,
        },
        10: {
          speed: 2.25,
          direction: "right",
          rotation: -10,
          targetId: "tops_4",
          offsetX: 0,
        },
        11: {
          speed: 2.3,
          direction: "right",
          rotation: 10,
          targetId: "tops_7",
          offsetX: 0,
        },
        12: {
          speed: 2.35,
          direction: "right",
          rotation: 6,
          targetId: "tops_7",
          offsetX: 0,
        },
        13: {
          speed: 2.7,
          direction: "left",
          rotation: -12,
          targetId: "tops_2",
          offsetX: 0,
        },
        14: {
          speed: 2.5,
          direction: "left",
          rotation: -10,
          targetId: "tops_4",
          offsetX: 0,
        },
        15: {
          speed: 2.5,
          direction: "right",
          rotation: -9,
          targetId: "tops_7",
          offsetX: 0,
        },
        16: {
          speed: 2.55,
          direction: "right",
          rotation: -8,
          targetId: "tops_5",
          offsetX: 0,
        },
        17: {
          speed: 2.6,
          direction: "right",
          rotation: 10,
          targetId: "tops_7",
          offsetX: 0,
        },
        18: {
          speed: 2.65,
          direction: "right",
          rotation: 9,
          targetId: "tops_7",
          offsetX: 0,
        },
        19: {
          speed: 2.7,
          direction: "right",
          rotation: 12,
          targetId: "tops_7",
          offsetX: 0,
        },
        20: {
          speed: 2.75,
          direction: "right",
          rotation: -10,
          targetId: "tops_8",
          offsetX: 0,
        },
      };
    } else {
      return {
        1: {
          speed: 1.0,
          direction: "left",
          rotation: -15,
          targetId: "tops_1",
          offsetX: -50,
        },
        2: {
          speed: 1.05,
          direction: "left",
          rotation: -15,
          targetId: "tops_3",
          offsetX: -30,
        },
        3: {
          speed: 1.1,
          direction: "left",
          rotation: -12,
          targetId: "tops_3",
          offsetX: -20,
        },
        4: {
          speed: 1.15,
          direction: "right",
          rotation: 10,
          targetId: "tops_7",
          offsetX: 20,
        },
        5: {
          speed: 1.5,
          direction: "right",
          rotation: 10,
          targetId: "tops_6",
          offsetX: 30,
        },
        6: {
          speed: 1.4,
          direction: "right",
          rotation: 12,
          targetId: "tops_5",
          offsetX: 20,
        },
        7: {
          speed: 1.3,
          direction: "right",
          rotation: 15,
          targetId: "tops_7",
          offsetX: 40,
        },
        8: {
          speed: 1.15,
          direction: "left",
          rotation: -10,
          targetId: "tops_1",
          offsetX: -40,
        },
        9: {
          speed: 1.2,
          direction: "left",
          rotation: -15,
          targetId: "tops_1",
          offsetX: -25,
        },
        10: {
          speed: 1.25,
          direction: "left",
          rotation: -15,
          targetId: "tops_4",
          offsetX: -35,
        },
        11: {
          speed: 1.3,
          direction: "right",
          rotation: 12,
          targetId: "tops_7",
          offsetX: 25,
        },
        12: {
          speed: 1.35,
          direction: "right",
          rotation: 8,
          targetId: "tops_7",
          offsetX: 35,
        },
        13: {
          speed: 1.7,
          direction: "left",
          rotation: -18,
          targetId: "tops_2",
          offsetX: -15,
        },
        14: {
          speed: 1.5,
          direction: "left",
          rotation: -15,
          targetId: "tops_4",
          offsetX: -45,
        },
        15: {
          speed: 1.5,
          direction: "left",
          rotation: -14,
          targetId: "tops_1",
          offsetX: -25,
        },
        16: {
          speed: 1.55,
          direction: "left",
          rotation: -11,
          targetId: "tops_1",
          offsetX: -10,
        },
        17: {
          speed: 1.6,
          direction: "right",
          rotation: 13,
          targetId: "tops_7",
          offsetX: 45,
        },
        18: {
          speed: 1.65,
          direction: "right",
          rotation: 11,
          targetId: "tops_7",
          offsetX: 25,
        },
        19: {
          speed: 1.7,
          direction: "right",
          rotation: 16,
          targetId: "tops_7",
          offsetX: 35,
        },
        20: {
          speed: 1.75,
          direction: "right",
          rotation: -13,
          targetId: "tops_8",
          offsetX: 15,
        },
      };
    }
  }

  init() {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    window.addEventListener("scroll", this._onUserInteraction.bind(this), {
      passive: true,
    });
    window.addEventListener("scroll", this._checkBuilderPosition.bind(this), {
      passive: true,
    });
    window.addEventListener("resize", this._onUserInteraction.bind(this));

    document.addEventListener("DOMContentLoaded", () => {
      // Додатково скролимо на початок після завантаження DOM
      window.scrollTo(0, 0);

      this.setupHeroItems();
      this.setupScrollAnimation();
      this.startAnimation();
    });
  }

  _onUserInteraction() {
    this.isInteracting = true;
    if (this.interactionTimer) {
      clearTimeout(this.interactionTimer);
    }
    this.interactionTimer = setTimeout(() => {
      this.isInteracting = false;
      this._resumeAfterInteraction();
    }, 150);
  }

  _resumeAfterInteraction() {
    this.heroItems.forEach((item) => {
      if (item && item.element) {
        item.element.style.transition = "transform 300ms ease-out";
        item.element.style.transform = "none";
        item.currentX = 0;
        item.currentY = 0;
      }
    });
  }

  _checkBuilderPosition() {
    if (this.scrollLockTriggered) {
      return;
    }

    if (this.scrollLocked) {
      return;
    }

    const builderWrap = document.querySelector(".builder__wrap");
    if (!builderWrap) {
      return;
    }

    const rect = builderWrap.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const screenWidth = window.innerWidth;

    let isInPosition = false;

    if (screenWidth <= 676) {
      // Мобільні екрани: центр елемента по центру екрану
      const elementCenter = rect.top + rect.height / 2;
      const screenCenter = windowHeight / 2;
      isInPosition = Math.abs(elementCenter - screenCenter) < 20;
    } else {
      // Десктоп: низ елемента на відстані 50px від низу екрану
      const elementBottom = rect.bottom;
      const targetPosition = windowHeight - 50;
      isInPosition = Math.abs(elementBottom - targetPosition) < 20;
    }

    if (isInPosition) {
      this._lockScrollAndContinueAnimation();
      this.scrollLockTriggered = true;
    }
  }

  _lockScrollAndContinueAnimation() {
    if (this.scrollLocked) {
      return;
    }

    this.scrollLocked = true;
    const currentScrollY = window.scrollY;
    this.lockedScrollPosition = currentScrollY;

    const screenWidth = window.innerWidth;
    
    if (screenWidth <= 676) {
      // Мобільні: блокуємо скрол сторінки, але дозволяємо анімацію продовжуватись
      this.touchStartY = 0;
      this.lastTouchY = 0;
      this.virtualScrollY = currentScrollY; // Зберігаємо віртуальний скрол
      
      this.preventPageScroll = (e) => {
        if (e.type === 'touchstart') {
          this.touchStartY = e.touches[0].clientY;
          this.lastTouchY = e.touches[0].clientY;
        } else if (e.type === 'touchmove') {
          const touchY = e.touches[0].clientY;
          const deltaY = this.lastTouchY - touchY;
          this.lastTouchY = touchY;
          
          // Блокуємо скрол сторінки
          e.preventDefault();
          
          // Але продовжуємо анімацію елементів
          if (deltaY !== 0) {
            // Оновлюємо віртуальний скрол
            this.virtualScrollY += deltaY;
            this.virtualScrollY = Math.max(this.lockedScrollPosition, this.virtualScrollY);
            
            // Оновлюємо scrollProgress для анімації елементів
            this.scrollProgress = Math.min(this.virtualScrollY / this.config.scrollDistance, 1);
            
            if (this.scrollProgress > 0) {
              this.animatedItemIds.forEach((itemId) => {
                this.animateClonedElement(itemId);
              });
            }
          }
        } else if (e.type === 'wheel') {
          e.preventDefault();
        }
      };
      
      document.addEventListener('touchstart', this.preventPageScroll, { passive: false });
      document.addEventListener('touchmove', this.preventPageScroll, { passive: false });
      document.addEventListener('wheel', this.preventPageScroll, { passive: false });
    } else {
      // Десктоп: блокуємо скрол сторінки, але дозволяємо анімацію продовжуватись
      this.virtualScrollY = currentScrollY;
      this.targetVirtualScrollY = currentScrollY;
      this.isAnimatingScroll = false;
      
      // Функція для плавної анімації
      const smoothAnimate = () => {
        if (!this.scrollLocked) return;
        
        const diff = this.targetVirtualScrollY - this.virtualScrollY;
        if (Math.abs(diff) > 0.5) {
          this.virtualScrollY += diff * 0.2; // Плавність 20%
          
          // Оновлюємо scrollProgress для анімації елементів
          this.scrollProgress = Math.min(this.virtualScrollY / this.config.scrollDistance, 1);
          
          if (this.scrollProgress > 0) {
            this.animatedItemIds.forEach((itemId) => {
              this.animateClonedElement(itemId);
            });
          }
          
          requestAnimationFrame(smoothAnimate);
        } else {
          this.virtualScrollY = this.targetVirtualScrollY;
          this.isAnimatingScroll = false;
        }
      };
      
      this.preventPageScroll = (e) => {
        e.preventDefault();
        
        // Але продовжуємо анімацію елементів
        if (e.type === 'wheel' && e.deltaY !== 0) {
          // Оновлюємо цільовий віртуальний скрол
          this.targetVirtualScrollY += e.deltaY;
          this.targetVirtualScrollY = Math.max(this.lockedScrollPosition, this.targetVirtualScrollY);
          
          // Запускаємо плавну анімацію якщо вона ще не запущена
          if (!this.isAnimatingScroll) {
            this.isAnimatingScroll = true;
            requestAnimationFrame(smoothAnimate);
          }
        }
      };
      
      document.addEventListener('wheel', this.preventPageScroll, { passive: false });
    }

    this.setupUnlockScrollListeners();
  }

  _lockScroll() {
    this._lockScrollAndContinueAnimation();
  }

  _unlockScroll() {
    if (!this.scrollLocked) {
      return;
    }

    this.scrollLocked = false;

    // Видаляємо обробники preventDefault (і для мобільних, і для десктопу)
    if (this.preventPageScroll) {
      document.removeEventListener('touchstart', this.preventPageScroll);
      document.removeEventListener('touchmove', this.preventPageScroll);
      document.removeEventListener('wheel', this.preventPageScroll);
      this.preventPageScroll = null;
    }

    if (this.scrollLockTimeout) {
      clearTimeout(this.scrollLockTimeout);
      this.scrollLockTimeout = null;
    }

    if (this.unlockScrollHandler) {
      document.removeEventListener("click", this.unlockScrollHandler, true);
      this.unlockScrollHandler = null;
    }

    this.removeAllPulses();
  }

  _unlockScrollWithoutRemovingPulse() {
    if (!this.scrollLocked) {
      return;
    }

    this.scrollLocked = false;

    // Видаляємо обробники preventDefault (і для мобільних, і для десктопу)
    if (this.preventPageScroll) {
      document.removeEventListener('touchstart', this.preventPageScroll);
      document.removeEventListener('touchmove', this.preventPageScroll);
      document.removeEventListener('wheel', this.preventPageScroll);
      this.preventPageScroll = null;
    }

    if (this.scrollLockTimeout) {
      clearTimeout(this.scrollLockTimeout);
      this.scrollLockTimeout = null;
    }

    if (this.unlockScrollHandler) {
      document.removeEventListener("click", this.unlockScrollHandler, true);
      this.unlockScrollHandler = null;
    }
  }

  setupUnlockScrollListeners() {
    this.unlockScrollHandler = (event) => {
      // Перевіряємо чи це справжній клік користувача (не програмний)
      if (!event.isTrusted) return;
      
      const target = event.target;
      const itemCard = target.closest(".item-card");
      const categoryTab = target.closest(".category-tabs");

      if (itemCard || categoryTab) {
        this._unlockScroll();
      }
    };

    document.addEventListener("click", this.unlockScrollHandler, true);
  }

  setupHeroItems() {
    for (let i = 1; i <= 20; i++) {
      const element = document.getElementById(`heroItem${i}`);
      if (element) {
        const itemData = {
          id: i,
          element: element,
          initialLeft: 0,
          initialTop: 0,
          currentX: 0,
          currentY: 0,
          originalX: 0,
          originalY: 0,
          isFollowingMouse: false,
        };

        const rect = element.getBoundingClientRect();
        itemData.initialLeft =
          rect.left +
          (window.pageXOffset || document.documentElement.scrollLeft);
        itemData.initialTop =
          rect.top + (window.pageYOffset || document.documentElement.scrollTop);
        element.style.transformOrigin = "center center";
        this.heroItems.push(itemData);
        this.heroItemsMap.set(i, itemData);
        this.setupMouseEvents(itemData);

        if (this.animatedItemIds.includes(i)) {
          setTimeout(() => this.createDuplicatedSVG(i), 100);
        }
      }
    }
  }

  getRandomMovement() {
    const distance = Math.random() * this.config.maxMovement;
    const angle = Math.random() * Math.PI * 2;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  }

  setupMouseEvents(itemData) {
    const element = itemData.element;

    element.addEventListener("mouseenter", (e) => {
      itemData.isFollowingMouse = true;
      itemData.originalX = itemData.currentX;
      itemData.originalY = itemData.currentY;
      element.style.transition = "transform 0.2s ease-out";
    });

    element.addEventListener("mouseleave", () => {
      itemData.isFollowingMouse = false;
      element.style.transition = `transform 0.5s ease-out`;
      element.style.transform = `translate(${itemData.originalX}px, ${itemData.originalY}px)`;
      itemData.currentX = itemData.originalX;
      itemData.currentY = itemData.originalY;
    });

    element.addEventListener("mousemove", (e) => {
      if (itemData.isFollowingMouse) {
        this.followMouse(e, itemData);
      }
    });
  }

  followMouse(event, itemData) {
    const rect = itemData.element.getBoundingClientRect();
    const elementCenterX = rect.left + rect.width / 2;
    const elementCenterY = rect.top + rect.height / 2;

    const deltaX = event.clientX - elementCenterX;
    const deltaY = event.clientY - elementCenterY;

    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = this.config.mouseFollowDistance;

    let moveX = deltaX;
    let moveY = deltaY;

    if (distance > maxDistance) {
      const ratio = maxDistance / distance;
      moveX = deltaX * ratio;
      moveY = deltaY * ratio;
    }

    const newX = itemData.originalX + moveX * 0.3;
    const newY = itemData.originalY + moveY * 0.3;

    itemData.element.style.transform = `translate(${newX}px, ${newY}px)`;
  }

  moveAllItems() {
    if (this.isInteracting) return;

    this.heroItems.forEach((item) => {
      if (!item.isFollowingMouse && item.element) {
        const movement = this.getRandomMovement();
        const newX = movement.x;
        const newY = movement.y;

        item.element.style.transition = `transform ${this.config.animationDuration}ms linear`;
        item.element.style.transform = `translate(${newX}px, ${newY}px)`;

        item.currentX = newX;
        item.currentY = newY;
      }
    });
  }

  findTopsItem(itemId, targetId = null) {
    const actualTargetId = targetId || `tops_${itemId}`;

    const selectors = [
      `#${actualTargetId}`,
      `#${actualTargetId.replace("_", "-")}`,
      `[data-item-id="${actualTargetId}"]`,
      `[data-item-id="${actualTargetId.replace("_", "-")}"]`,
      `.item-card[data-item-id="${actualTargetId}"]`,
      `.item-card[data-item-id="${actualTargetId.replace("_", "-")}"]`,
      `img[src*="${actualTargetId}"]`,
      `img[src*="${actualTargetId.replace("_", "-")}"]`,
      `img[alt*="${actualTargetId}"]`,
      `img[alt*="${actualTargetId.replace("_", "-")}"]`,
      `[id*="${actualTargetId}"]`,
      `[id*="${actualTargetId.replace("_", "-")}"]`,
      `[class*="${actualTargetId}"]`,
      `[class*="${actualTargetId.replace("_", "-")}"]`,
      `.${actualTargetId}`,
      `.${actualTargetId.replace("_", "-")}`,
      `[data-id="${actualTargetId}"]`,
      `[data-target="${actualTargetId}"]`,
    ];

    for (const selector of selectors) {
      try {
        const element = document.querySelector(selector);
        if (element) {
          return element;
        }
      } catch (e) {}
    }

    return null;
  }

  hideAllTopsElements() {
    //Приховання елементів (tops_1 до tops_8)
    for (let i = 1; i <= 8; i++) {
      const element = document.querySelector(`[data-item-id="tops_${i}"]`);
      if (element) {
        const img = element.querySelector("img.item-thumbnail");
        if (img) {
          img.style.opacity = "0";
          img.style.transition = "opacity 0.3s ease-in";
        }
      }
    }
  }

  setupScrollAnimation() {
    this.hideAllTopsElements();

    const setupTopsItemObserver = (itemId) => {
      const animConfig = this.animationConfig[itemId];
      const targetId = animConfig ? animConfig.targetId : null;

      const findTopsElement = () => {
        const element = this.findTopsItem(itemId, targetId);
        if (element) {
          this.topsItemsMap.set(itemId, element);
          const img = element.querySelector("img.item-thumbnail");
          if (img) {
            img.style.opacity = "0";
          }

          // Приховуємо pulse при кліку на будь-який tops елемент
          element.addEventListener("click", () => {
            this.removeAllPulses();
          });

          return true;
        }
        return false;
      };

      if (!findTopsElement()) {
        const observer = new MutationObserver(() => {
          if (findTopsElement()) {
            observer.disconnect();
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    };

    this.animatedItemIds.forEach((id) => {
      setupTopsItemObserver(id);
    });

    window.addEventListener("scroll", () => {
      this.handleScroll();
      if (this.pulseActive && window.scrollY > 0 && window.innerWidth <= 676) {
        this.removeAllPulses();
      }
    });

    window.addEventListener("resize", () => {
      this.config.scrollDistance = this.getAdaptiveScrollDistance();
      this.animationConfig = this.getAdaptiveAnimationConfig();
    });
  }

  createDuplicatedSVG(itemId) {
    const heroItem = this.heroItemsMap.get(itemId);
    if (!heroItem) return;

    const originalGroup = heroItem.element;
    const originalGroupRect = originalGroup.getBoundingClientRect();
    const newSVG = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    const bbox = originalGroup.getBBox();

    newSVG.setAttribute(
      "viewBox",
      `${bbox.x} ${bbox.y} ${bbox.width} ${bbox.height}`
    );

    Object.assign(newSVG.style, {
      width: `${originalGroupRect.width}px`,
      height: `${originalGroupRect.height}px`,
      position: "fixed",
      zIndex: "0",
      pointerEvents: "none",
      opacity: "0",
      transformOrigin: "center center",
      left: `${originalGroupRect.left}px`,
      top: `${originalGroupRect.top}px`,
    });

    newSVG.id = `heroItem${itemId}Clone`;

    const clonedGroup = originalGroup.cloneNode(true);
    clonedGroup.id = `heroItem${itemId}CloneGroup`;

    const images = clonedGroup.querySelectorAll("image");
    images.forEach((img) => {
      const href = img.getAttribute("xlink:href") || img.getAttribute("href");
      if (href && !href.startsWith("http") && !href.startsWith("/")) {
        const basePath =
          window.location.origin +
          window.location.pathname.replace(/\/[^\/]*$/, "/");
        img.setAttribute("xlink:href", basePath + href);
        img.setAttribute("href", basePath + href);
      }
    });

    newSVG.appendChild(clonedGroup);
    document.body.appendChild(newSVG);
    this.duplicatedSVGsMap.set(itemId, newSVG);
  }

  handleScroll() {
    const scrollY = window.scrollY;
    this.scrollProgress = Math.min(scrollY / this.config.scrollDistance, 1);

    if (this.scrollProgress > 0) {
      this.animatedItemIds.forEach((itemId) => {
        this.animateClonedElement(itemId);
      });
    }
  }

  animateClonedElement(itemId) {
    const duplicatedSVG = this.duplicatedSVGsMap.get(itemId);
    const heroItem = this.heroItemsMap.get(itemId);
    const animConfig = this.animationConfig[itemId] || {
      speed: 1.0,
      direction: "right",
      rotation: 0,
      offsetX: 0,
      arcOffset: 300,
    };

    if (!duplicatedSVG || !heroItem) {
      return;
    }

    duplicatedSVG.style.opacity = "1";
    heroItem.element.style.opacity = "0";

    const originalRect = heroItem.element.getBoundingClientRect();

    duplicatedSVG.style.left = `${originalRect.left}px`;
    duplicatedSVG.style.top = `${originalRect.top}px`;

    let topsElement = this.topsItemsMap.get(itemId);
    if (!topsElement) {
      const targetId = animConfig.targetId;
      topsElement = this.findTopsItem(itemId, targetId);
      if (topsElement) {
        this.topsItemsMap.set(itemId, topsElement);
      }
    }

    if (!topsElement) {
      return;
    }

    let endX,
      endY,
      targetWidth = 50,
      targetHeight = 50;

    if (topsElement) {
      const topsRect = topsElement.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const absoluteLeft = topsRect.left + scrollX;
      const absoluteTop = topsRect.top + scrollY;

      endX = topsRect.left + topsRect.width / 2 - originalRect.width / 2;
      endY = topsRect.top + topsRect.height / 2 - originalRect.height / 2;

      const offsetX = animConfig.offsetX || 0;
      endX += offsetX;
      targetWidth = topsRect.width;
      targetHeight = topsRect.height;
    } else {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      endX = animConfig.direction === "left" ? 200 : windowWidth - 200;
      endY = windowHeight / 2;
    }

    const startX = originalRect.left;
    const startY = originalRect.top;
    const progress = Math.min(this.scrollProgress * animConfig.speed, 1);

    const { currentX, currentY } = this.calculateArcMovement(
      startX,
      startY,
      endX,
      endY,
      progress,
      animConfig.direction,
      animConfig.arcOffset
    );
    const originalWidth = parseFloat(duplicatedSVG.style.width);
    const originalHeight = parseFloat(duplicatedSVG.style.height);
    const finalScaleX = targetWidth / originalWidth;
    const finalScaleY = targetHeight / originalHeight;
    const finalScale = Math.min(finalScaleX, finalScaleY);
    const currentScale = 1 + (finalScale - 1) * progress;

    duplicatedSVG.style.left = `${currentX}px`;
    duplicatedSVG.style.top = `${currentY}px`;
    duplicatedSVG.style.transform = `scale(${currentScale}) rotate(${
      progress * animConfig.rotation
    }deg)`;

    if (progress > 0.85 && topsElement) {
      const img = topsElement.querySelector("img.item-thumbnail");
      if (img) {
        img.style.opacity = "1";
        img.style.transition = "opacity 0.3s ease-in";
      }
    }

    if (progress > 0.95) {
      duplicatedSVG.style.opacity = Math.max(0, (1 - progress) * 20);
    }

    // Повернення елемента при завершенні анімації і видалення дубліката
    if (progress >= 1) {
      heroItem.element.style.opacity = "1";

      if (duplicatedSVG && duplicatedSVG.parentNode) {
        duplicatedSVG.parentNode.removeChild(duplicatedSVG);
        this.duplicatedSVGsMap.delete(itemId);
      }

      // Перевіряємо чи всі анімації завершились
      this.checkAllAnimationsCompleted();
    }
  }

  calculateArcMovement(
    startX,
    startY,
    endX,
    endY,
    progress,
    direction,
    arcOffset = 300
  ) {
    const windowWidth = window.innerWidth;

    // Зменшуємо дугу на мобільних екранах
    let adaptiveArcOffset = arcOffset;
    if (windowWidth <= 676) {
      adaptiveArcOffset = arcOffset * 0.4;
    }

    const offset = Math.min(adaptiveArcOffset, windowWidth * 0.3);
    const isLeft = direction === "left";

    let currentX, currentY;

    if (progress <= 0.6) {
      const earlyProgress = progress / 0.6;
      const easedEarly = 1 - Math.pow(1 - earlyProgress, 2);
      currentX = startX + (isLeft ? -offset : offset) * easedEarly;
    } else {
      const lateProgress = (progress - 0.6) / 0.4;
      const maxArcX = startX + (isLeft ? -offset : offset);
      const easedProgress =
        lateProgress < 0.5
          ? 2 * lateProgress * lateProgress
          : 1 - Math.pow(-2 * lateProgress + 2, 2) / 2;
      currentX = maxArcX + (endX - maxArcX) * easedProgress;
    }

    if (progress <= 0.4) {
      const earlyYProgress = progress / 0.4;
      currentY = startY + (endY - startY) * earlyYProgress * 0.3;
    } else {
      const lateYProgress = (progress - 0.4) / 0.6;
      const baseY = startY + (endY - startY) * 0.3;
      const remainingY = (endY - startY) * 0.7;
      currentY = baseY + remainingY * lateYProgress;
    }

    return { currentX, currentY };
  }

  showPulseOnTarget(targetElement, idAttr) {
    const key = `pulse-${idAttr}`;
    if (this[key]) {
      return;
    }

    const itemsGridContainer = document.querySelector(".items-grid-container");
    if (!itemsGridContainer) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "hero-pulse-wrapper";
    wrapper.setAttribute("aria-hidden", "true");

    wrapper.innerHTML = `
   <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000000"><path d="M471-80q-22.59 0-43.29-8.33Q407-96.67 390.67-113L184-320l20-25q12.67-16 31.5-22.17 18.83-6.16 38.5-.83l86 23.67V-680q0-14.17 9.62-23.75 9.61-9.58 23.83-9.58 14.22 0 23.72 9.58 9.5 9.58 9.5 23.75v424.33l-115-31 126.78 126.79q6.22 6.21 14.8 9.71 8.59 3.5 17.75 3.5h169q39 0 66.17-27.16Q733.33-201 733.33-240v-173.33q0-14.17 9.62-23.75 9.62-9.59 23.83-9.59 14.22 0 23.72 9.59 9.5 9.58 9.5 23.75V-240q0 66-47 113T640-80H471Zm13.67-286.67v-166.66q0-14.17 9.61-23.75 9.62-9.59 23.84-9.59 14.21 0 23.71 9.59 9.5 9.58 9.5 23.75v166.66h-66.66Zm124 0v-126.66q0-14.17 9.61-23.75 9.62-9.59 23.84-9.59 14.21 0 23.71 9.59 9.5 9.58 9.5 23.75v126.66h-66.66ZM571.33-270ZM880-693.33H693.33V-740h127.34q-72-62.67-158.67-98-86.67-35.33-182-35.33T298-838q-86.67 35.33-158.67 98h127.34v46.67H80V-880h46.67v89q76-61 165.66-95Q382-920 480-920q98 0 187.67 34 89.66 34 165.66 95v-89H880v186.67Z"/></svg>
    `;

    // Додаємо wrapper до items-grid-container
    const originalPosition = itemsGridContainer.style.position;
    if (!originalPosition || originalPosition === "static") {
      itemsGridContainer.style.position = "relative";
    }

    itemsGridContainer.appendChild(wrapper);
    this.pulseActive = true;

    // Прокручуємо tops-items вправо на мобільних і десктопі
    const screenWidth = window.innerWidth;
    const topsItems = document.getElementById("tops-items");
    const categoryTabs = document.querySelector(".category-tabs");
    
    if (topsItems) {
      const scrollAmount = screenWidth <= 676 ? 200 : 200;
      const duration = 2500; // тривалість анімації 2.5 секунди
      
      // Вимикаємо CSS scroll-behavior для контролю анімації
      const originalScrollBehaviorTops = topsItems.style.scrollBehavior;
      const originalScrollBehaviorTabs = categoryTabs ? categoryTabs.style.scrollBehavior : null;
      topsItems.style.scrollBehavior = 'auto';
      if (categoryTabs) categoryTabs.style.scrollBehavior = 'auto';
      
      let activeAnimations = [];
      let animationCancelled = false;
      
      // Функція для скасування всіх анімацій
      const cancelAnimations = () => {
        animationCancelled = true;
        activeAnimations.forEach(id => cancelAnimationFrame(id));
        activeAnimations = [];
        // Повертаємо оригінальні scroll-behavior
        topsItems.style.scrollBehavior = originalScrollBehaviorTops;
        if (categoryTabs) categoryTabs.style.scrollBehavior = originalScrollBehaviorTabs;
      };
      
      // Слухачі для скасування анімації при взаємодії користувача
      const cancelOnInteraction = (e) => {
        // Перевіряємо чи це справжній клік користувача (не програмний)
        if (!e.isTrusted) return;
        
        // Перевіряємо чи клік був на item-card або category-tab
        const clickedOnItemCard = e.target.closest('.item-card');
        const clickedOnTabs = e.target.closest('.category-tabs');
        const clickedOnTab = e.target.classList.contains('category-tab') || e.target.closest('.category-tab');
        
        if (clickedOnItemCard || clickedOnTabs || clickedOnTab) {
          animationCancelled = true;
          cancelAnimations();
          
          // Розблоковуємо скрол сторінки
          this._unlockScroll();
          
          // Видаляємо SVG свайп
          this.removeAllPulses();
          
          // Приховуємо текст "Try Demo To Scroll"
          const demoText = document.querySelector('.demo-scroll-text');
          if (demoText) {
            demoText.classList.add('hidden');
          }
          
          // Видаляємо слухачі після скасування
          document.removeEventListener('click', cancelOnInteraction);
          topsItems.removeEventListener('wheel', cancelOnInteraction);
          if (categoryTabs) categoryTabs.removeEventListener('wheel', cancelOnInteraction);
        }
      };
      
      document.addEventListener('click', cancelOnInteraction, true);
      topsItems.addEventListener('wheel', cancelOnInteraction, { passive: true });
      if (categoryTabs) categoryTabs.addEventListener('wheel', cancelOnInteraction, { passive: true });
      
      // Функція плавної анімації скролу
      const smoothScroll = (element, targetPosition, duration, onComplete) => {
        if (animationCancelled) return;
        
        const startPosition = element.scrollLeft;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = (currentTime) => {
          if (animationCancelled) {
            if (onComplete) onComplete();
            return;
          }
          
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          
          // Дуже плавна easing function
          const easeInOutQuint = progress < 0.5
            ? 16 * progress * progress * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 5) / 2;
          
          element.scrollLeft = startPosition + distance * easeInOutQuint;
          
          if (progress < 1) {
            const animId = requestAnimationFrame(animation);
            activeAnimations.push(animId);
          } else {
            // Видаляємо слухачі після завершення анімації
            document.removeEventListener('click', cancelOnInteraction);
            topsItems.removeEventListener('wheel', cancelOnInteraction);
            if (categoryTabs) categoryTabs.removeEventListener('wheel', cancelOnInteraction);
            
            if (onComplete) onComplete();
          }
        };

        const animId = requestAnimationFrame(animation);
        activeAnimations.push(animId);
      };
      
      // Рекурсивна функція для циклічного відтворення анімації
      const runAnimationCycle = (isFirstRun = false) => {
        if (animationCancelled) return;
        
        // Блокуємо скрол сторінки тільки при першому запуску
        if (isFirstRun) {
          this._lockScrollAndContinueAnimation();
        }
        
        // Активуємо таб jumpsuits (з автоматичним центруванням при кліку користувача)
        setTimeout(() => {
          if (animationCancelled) return;
          
          const jumpsuitsTab = document.querySelector('.category-tab[data-category="jumpsuits"]');
          if (jumpsuitsTab) {
            jumpsuitsTab.click();
            
            // Після активації jumpsuits активуємо shoes
            setTimeout(() => {
              if (animationCancelled) return;
              
              const shoesTab = document.querySelector('.category-tab[data-category="shoes"]');
              if (shoesTab) {
                shoesTab.click();

                
                // Чекаємо паузу перед поверненням на початок
                setTimeout(() => {
                  if (animationCancelled) return;
                  
                  // Активуємо таб tops
                  const topsTab = document.querySelector('.category-tab[data-category="tops"]');
                  if (topsTab) {
                    topsTab.click();
                    
                    // Розблоковуємо скрол після повернення на початок (без видалення SVG)
                    this._unlockScrollWithoutRemovingPulse();
                    
                    // Приховуємо текст "Try Demo To Scroll"
                    const demoText = document.querySelector('.demo-scroll-text');
                    if (demoText) {
                      demoText.classList.add('hidden');
                    }
                    
                    // Пауза перед новим циклом
                    setTimeout(() => {
                      if (animationCancelled) return;
                      runAnimationCycle(); // Запускаємо новий цикл
                    }, 500);
                  }
                }, 2000);
              }
            }, 2500);
          }
        }, 2500);
      };
      
      // Запускаємо перший цикл анімації з блокуванням скролу
      if (categoryTabs) {
        runAnimationCycle(true);
      }
    }

    this[key] = { wrapper, targetElement, itemsGridContainer };
  }

  removePulseForTarget(idAttr) {
    const key = `pulse-${idAttr}`;
    if (!this[key]) return;
    try {
      const { wrapper, targetElement, itemsGridContainer } = this[key];
      if (wrapper && wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    } catch (e) {
      console.error("Error removing pulse:", e);
    }
    delete this[key];
    this.pulseActive = false;
  }

  removeAllPulses() {
    const pulseKeys = Object.keys(this).filter((key) =>
      key.startsWith("pulse-")
    );
    pulseKeys.forEach((key) => {
      const idAttr = key.replace("pulse-", "");
      this.removePulseForTarget(idAttr);
    });
  }

  checkAllAnimationsCompleted() {
    // Перевіряємо чи всі дубльовані SVG видалені (анімації завершені)
    if (this.duplicatedSVGsMap.size === 0 && !this.allAnimationsCompleted) {
      this.allAnimationsCompleted = true;

      const topsElement = this.topsItemsMap.get(1); // tops_1
      if (topsElement) {
        const idAttr =
          topsElement.getAttribute("data-item-id") || topsElement.id || "";
        if (idAttr === "tops_1" && !this.pulseShownFor.has(idAttr)) {
          this.pulseShownFor.add(idAttr);
          // Затримка для того, щоб opacity встигла змінитись
          setTimeout(() => {
            this.showPulseOnTarget(topsElement, idAttr);
          }, 300);
        }
      }
    }
  }

  startAnimation() {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    this.animationInterval = setInterval(() => {
      this.moveAllItems();
    }, this.config.animationDuration);
  }
}

const heroAnimation = new HeroAnimation();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (!heroAnimation.animationInterval) {
      heroAnimation.startAnimation();
    }
  });
} else {
  if (!heroAnimation.animationInterval) {
    heroAnimation.startAnimation();
  }
}

export default HeroAnimation;
