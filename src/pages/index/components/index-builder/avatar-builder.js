import "./index-builder.scss";
import manifestData from "../../../../cata_manifest_handoff.json";

class AvatarBuilder {
  constructor() {
    this.manifestData = manifestData;
    this.selectedItems = {
      tops: null,
      bottoms: null,
      dresses: null,
      jumpsuits: null,
      outerwear: null,
      shoes: null,
      accessories: null,
    };
    this.currentCategory = "tops";
    this.init();
  }

  init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.setupInterface()
      );
    } else {
      this.setupInterface();
    }
  }

  setupInterface() {
    this.populateItems();
    this.setupEventListeners();
    this.showAvatar();
  }

  populateItems() {
    const categories = [
      "tops",
      "bottoms",
      "dresses",
      "jumpsuits",
      "outerwear",
      "shoes",
      "accessories",
    ];

    categories.forEach((category) => {
      const container = document.getElementById(`${category}-items`);
      if (!container) return;

      let items = this.manifestData.items.filter(
        (item) => item.category === category
      );

      container.innerHTML = items
        .map(
          (item) => `
        <div class="item-card" data-item-id="${item.id}" data-category="${category}">
          <img src="${item.thumbPath}" alt="${item.id}" class="item-thumbnail" />
        </div>
      `
        )
        .join("");
    });
  }

  setupEventListeners() {
    document.querySelectorAll(".category-tab").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        const category = e.target.dataset.category;
        this.switchCategory(category, true); // true = клік користувача
      });
    });

    const collapseToggle = document.querySelector(".collapse-toggle");
    if (collapseToggle) {
      collapseToggle.addEventListener("click", () =>
        this.toggleCategoriesCollapse()
      );
    }

    document.addEventListener("click", (e) => {
      if (e.target.closest(".item-card")) {
        const card = e.target.closest(".item-card");
        const itemId = card.dataset.itemId;
        const category = card.dataset.category;
        this.selectItem(itemId, category);
      }
    });

    const clearBtn = document.getElementById("clear-all");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.clearAll());
    }

    const randomBtn = document.getElementById("randomize");
    if (randomBtn) {
      randomBtn.addEventListener("click", () => this.randomLook());
    }

    const presetsBtn = document.getElementById("show-presets");
    if (presetsBtn) {
      presetsBtn.addEventListener("click", () => this.showPresetsModal());
    }

    const closePresetsBtn = document.getElementById("close-presets");
    if (closePresetsBtn) {
      closePresetsBtn.addEventListener("click", () => this.hidePresetsModal());
    }

    const presetsModal = document.getElementById("presets-modal");
    if (presetsModal) {
      presetsModal.addEventListener("click", (e) => {
        if (e.target === presetsModal) {
          this.hidePresetsModal();
        }
      });
    }

    this.setupHorizontalScroll();
    this.setupZoomControls();
    this.setupInfoBlocksAnimation();
  }

  setupInfoBlocksAnimation() {
    const isMobile = window.innerWidth <= 867;

    if (!isMobile) {
      return;
    }

    const builderSection = document.getElementById("builder");
    if (!builderSection) return;

    const infoBlocks = [
      document.querySelector(".info-block-1"),
      document.querySelector(".info-block-2"),
      document.querySelector(".info-block-3"),
    ].filter((block) => block !== null);

    if (infoBlocks.length === 0) return;

    let animationInProgress = false;
    let animationTimeouts = [];
    let canStartAnimation = false;

    const showBlock = (block, duration = 3000) => {
      return new Promise((resolve) => {
        block.classList.add("show");

        const timeout = setTimeout(() => {
          block.classList.remove("show");
          resolve();
        }, duration);

        animationTimeouts.push(timeout);
      });
    };

    const triggerAnimation = async () => {
      if (animationInProgress || !canStartAnimation) return;
      animationInProgress = true;

      animationTimeouts.forEach((timeout) => clearTimeout(timeout));
      animationTimeouts = [];

      for (const block of infoBlocks) {
        await showBlock(block, 3000);
        await new Promise((resolve) => {
          const timeout = setTimeout(resolve, 300);
          animationTimeouts.push(timeout);
        });
      }

      setTimeout(() => {
        animationInProgress = false;
      }, 500);
    };

    const waitForTopsItemsVisible = () => {
      let tops1Visible = false;
      let tops6Visible = false;

      const checkVisibility = () => {
        // Шукаємо елементи tops_1 та tops_6
        const tops1Element = document.querySelector('[data-item-id="tops_1"]');
        const tops6Element = document.querySelector('[data-item-id="tops_6"]');

        if (tops1Element && tops6Element) {
          const tops1Img = tops1Element.querySelector("img.item-thumbnail");
          const tops6Img = tops6Element.querySelector("img.item-thumbnail");

          if (tops1Img && tops6Img) {
            const tops1Opacity = parseFloat(
              window.getComputedStyle(tops1Img).opacity
            );
            const tops6Opacity = parseFloat(
              window.getComputedStyle(tops6Img).opacity
            );

            tops1Visible = tops1Opacity >= 0.9;
            tops6Visible = tops6Opacity >= 0.9;

            if (tops1Visible && tops6Visible && !canStartAnimation) {
              canStartAnimation = true;
              if (builderSectionVisible) {
                triggerAnimation();
              }
            }
          }
        }
      };

      const visibilityInterval = setInterval(() => {
        checkVisibility();

        if (tops1Visible && tops6Visible) {
          clearInterval(visibilityInterval);
        }
      }, 100);

      const observer = new MutationObserver(() => {
        checkVisibility();
        if (tops1Visible && tops6Visible) {
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["style"],
        subtree: true,
        childList: true,
      });
    };

    waitForTopsItemsVisible();

    // Intersection Observer для відстеження видимості builder секції
    let builderSectionVisible = false;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        builderSectionVisible = entry.isIntersecting;

        if (entry.isIntersecting && !animationInProgress && canStartAnimation) {
          triggerAnimation();
        }
      });
    }, observerOptions);

    observer.observe(builderSection);

    // Очищення при зміні розміру вікна
    const handleResize = () => {
      const newIsMobile = window.innerWidth <= 867;
      if (!newIsMobile) {
        // Якщо переключилися на десктоп, прибираємо класи
        infoBlocks.forEach((block) => {
          block.classList.remove("show");
        });
        animationTimeouts.forEach((timeout) => clearTimeout(timeout));
        animationTimeouts = [];
        observer.disconnect();
      }
    };

    window.addEventListener("resize", handleResize);
  }

  setupHorizontalScroll() {
    const scrollableElements = [
      ...document.querySelectorAll(".items-grid"),
      ...document.querySelectorAll(".category-tabs"),
    ];

    scrollableElements.forEach((element) => {
      element.addEventListener("wheel", (e) => {
        if (element.scrollWidth > element.clientWidth) {
          e.preventDefault();
          const scrollAmount = e.deltaY * 2;
          element.scrollLeft += scrollAmount;
        }
      });

      let isDown = false;
      let startX;
      let scrollLeft;

      element.addEventListener("mousedown", (e) => {
        if (
          element.classList.contains("category-tabs") &&
          e.target.classList.contains("category-tab")
        ) {
          return;
        }
        isDown = true;
        element.style.cursor = "grabbing";
        startX = e.pageX - element.offsetLeft;
        scrollLeft = element.scrollLeft;
      });

      element.addEventListener("mouseleave", () => {
        isDown = false;
        if (element.scrollWidth > element.clientWidth) {
          element.style.cursor = "grab";
        }
      });

      element.addEventListener("mouseup", () => {
        isDown = false;
        if (element.scrollWidth > element.clientWidth) {
          element.style.cursor = "grab";
        }
      });

      element.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - element.offsetLeft;
        const walk = (x - startX) * 2;
        element.scrollLeft = scrollLeft - walk;
      });

      let startTouchX;
      let startScrollLeft;
      let touchStartTime;

      element.addEventListener(
        "touchstart",
        (e) => {
          startTouchX = e.touches[0].pageX;
          startScrollLeft = element.scrollLeft;
          touchStartTime = Date.now();
        },
        { passive: true }
      );

      element.addEventListener(
        "touchmove",
        (e) => {
          if (!startTouchX) return;
          if (
            element.classList.contains("category-tabs") &&
            e.target.classList.contains("category-tab")
          ) {
            return;
          }

          const touchX = e.touches[0].pageX;
          const diff = startTouchX - touchX;

          const isMobile = window.innerWidth <= 676;

          if (isMobile && element.classList.contains("items-grid")) {
            element.scrollLeft = startScrollLeft + diff;
          } else {
            const walk = diff * 1.5;
            element.scrollLeft = startScrollLeft + walk;
          }
        },
        { passive: true }
      );

      element.addEventListener(
        "touchend",
        (e) => {
          if (!startTouchX) return;

          const isMobile = window.innerWidth <= 676;

          if (isMobile && element.classList.contains("items-grid")) {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            const touchDistance = startScrollLeft - element.scrollLeft;

            const velocity = Math.abs(touchDistance / touchDuration);

            const itemWidth = 72;
            const itemsPerSnap = 4;
            const snapDistance = itemWidth * 2;

            let targetScroll = element.scrollLeft;

            if (Math.abs(touchDistance) > 30) {
              if (velocity > 0.3) {
                const direction = touchDistance > 0 ? -1 : 1;
                const currentSnapIndex = Math.round(
                  element.scrollLeft / snapDistance
                );
                targetScroll = (currentSnapIndex + direction) * snapDistance;
              } else {
                targetScroll =
                  Math.round(element.scrollLeft / snapDistance) * snapDistance;
              }
            } else {
              targetScroll =
                Math.round(element.scrollLeft / snapDistance) * snapDistance;
            }

            targetScroll = Math.max(
              0,
              Math.min(targetScroll, element.scrollWidth - element.clientWidth)
            );

            element.scrollTo({
              left: targetScroll,
              behavior: "smooth",
            });
          }

          startTouchX = null;
          touchStartTime = null;
        },
        { passive: true }
      );

      if (
        element.scrollWidth > element.clientWidth &&
        !("ontouchstart" in window)
      ) {
        element.style.cursor = "grab";
      }
    });
  }

  switchCategory(category, isUserClick = false) {
    this.currentCategory = category;

    document.querySelectorAll(".category-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.category === category);
    });

    document.querySelectorAll(".items-grid").forEach((grid) => {
      grid.classList.toggle("active", grid.id === `${category}-items`);
    });
    
    // Прокручуємо активний таб до центру тільки при кліку користувача
    if (isUserClick) {
      const activeTab = document.querySelector(`.category-tab[data-category="${category}"]`);
      const categoryTabsContainer = document.querySelector(".category-tabs");
      
      if (activeTab && categoryTabsContainer) {
        const screenWidth = window.innerWidth;
        
        // Для мобільних: якщо це перший таб (tops), скролимо на початок
        if (screenWidth <= 676 && category === 'tops') {
          categoryTabsContainer.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else {
          // Інакше центруємо таб
          // Отримуємо позиції елементів
          const tabRect = activeTab.getBoundingClientRect();
          const containerRect = categoryTabsContainer.getBoundingClientRect();
          
          // Обчислюємо зсув для центрування
          const tabCenter = tabRect.left + tabRect.width / 2;
          const containerCenter = containerRect.left + containerRect.width / 2;
          const scrollOffset = tabCenter - containerCenter;
          
          // Плавно прокручуємо
          categoryTabsContainer.scrollBy({
            left: scrollOffset,
            behavior: 'smooth'
          });
        }
      }
    }
  }

  selectItem(itemId, category) {
    const itemData = this.manifestData.items.find((item) => item.id === itemId);
    if (!itemData) {
      return;
    }

    if (
      this.selectedItems[category] &&
      this.selectedItems[category].id !== itemId
    ) {
      this.clearLayer(category);
    }

    const previousSelection = this.selectedItems[category];
    this.selectedItems[category] = itemData;

    this.checkReverseCompatibility(category, itemId);
    this.applyClearingRules(category, itemId);
    this.showClothingItem(itemData, category);
    this.updateItemSelection(itemId, category);
  }

  /**
   * Застосовує правила взаємного виключення категорій одягу
   * Логіка:
   * - Dresses виключають: tops, bottoms, jumpsuits (сукня це цілісний образ)
   * - Jumpsuits виключають: tops, bottoms, dresses (комбінезон це цілісний образ)
   * - Tops/Bottoms виключають: dresses, jumpsuits (роздільний одяг несумісний з цілісним)
   * - Спеціальні правила для конкретних предметів з itemSpecificRules
   */

  applyClearingRules(selectedCategory, selectedItemId = null) {
    const clearingRules = {
      dresses: ["tops", "bottoms", "jumpsuits"],
      jumpsuits: ["tops", "bottoms", "dresses"],
      tops: ["dresses", "jumpsuits"],
      bottoms: ["dresses", "jumpsuits"],
    };

    if (selectedItemId && this.manifestData.rules.itemSpecificRules) {
      const itemRules =
        this.manifestData.rules.itemSpecificRules[selectedItemId];
      if (itemRules) {
        if (itemRules.incompatibleCategories) {
          itemRules.incompatibleCategories.forEach((categoryToClear) => {
            if (this.selectedItems[categoryToClear]) {
              this.selectedItems[categoryToClear] = null;
              this.clearLayer(categoryToClear);
            }
          });
        }

        if (itemRules.incompatibleItems) {
          itemRules.incompatibleItems.forEach((incompatibleItemId) => {
            const allCategories = [
              "tops",
              "bottoms",
              "dresses",
              "jumpsuits",
              "outerwear",
              "shoes",
              "accessories",
            ];
            allCategories.forEach((cat) => {
              if (
                this.selectedItems[cat] &&
                this.selectedItems[cat].id === incompatibleItemId
              ) {
                this.selectedItems[cat] = null;
                this.clearLayer(cat);
              }
            });
          });
        }
      }
    }

    const categoriesToClear = clearingRules[selectedCategory];

    if (categoriesToClear && categoriesToClear.length > 0) {
      categoriesToClear.forEach((categoryToClear) => {
        if (this.selectedItems[categoryToClear]) {
          this.selectedItems[categoryToClear] = null;
          this.clearLayer(categoryToClear);
        }
      });
    }
  }

  checkReverseCompatibility(selectedCategory, selectedItemId) {
    if (!this.manifestData.rules.itemSpecificRules) {
      return;
    }

    if (selectedCategory === "outerwear") {
      const incompatibleDresses = [
        "dresses_2",
        "dresses_5",
        "dresses_8",
        "dresses_12",
      ];

      if (this.selectedItems.dresses) {
        const selectedDressId = this.selectedItems.dresses.id;

        if (incompatibleDresses.includes(selectedDressId)) {
          this.selectedItems.dresses = null;
          this.clearLayer("dresses");
        }
      }

      const incompatibleJumpsuits = [
        "jumpsuits_1",
        "jumpsuits_3",
        "jumpsuits_5",
        "jumpsuits_6",
        "jumpsuits_7",
        "jumpsuits_8",
      ];

      if (this.selectedItems.jumpsuits) {
        const selectedJumpsuitId = this.selectedItems.jumpsuits.id;

        if (incompatibleJumpsuits.includes(selectedJumpsuitId)) {
          this.selectedItems.jumpsuits = null;
          this.clearLayer("jumpsuits");
        }
      }
    }

    if (selectedCategory === "dresses") {
      const incompatibleDresses = [
        "dresses_2",
        "dresses_5",
        "dresses_8",
        "dresses_12",
      ];

      if (incompatibleDresses.includes(selectedItemId)) {
        if (this.selectedItems.outerwear) {
          this.selectedItems.outerwear = null;
          this.clearLayer("outerwear");
        }
      }
    }

    if (selectedCategory === "jumpsuits") {
      const incompatibleJumpsuits = [
        "jumpsuits_1",
        "jumpsuits_3",
        "jumpsuits_5",
        "jumpsuits_6",
        "jumpsuits_7",
        "jumpsuits_8",
      ];

      if (incompatibleJumpsuits.includes(selectedItemId)) {
        if (this.selectedItems.outerwear) {
          this.selectedItems.outerwear = null;
          this.clearLayer("outerwear");
        }
      }
    }

    Object.keys(this.selectedItems).forEach((category) => {
      const selectedItem = this.selectedItems[category];
      if (selectedItem && category !== selectedCategory) {
        const itemRules =
          this.manifestData.rules.itemSpecificRules[selectedItem.id];
        if (itemRules) {
          if (
            itemRules.incompatibleCategories &&
            itemRules.incompatibleCategories.includes(selectedCategory)
          ) {
            this.selectedItems[category] = null;
            this.clearLayer(category);
          }

          if (
            itemRules.incompatibleItems &&
            itemRules.incompatibleItems.includes(selectedItemId)
          ) {
            this.selectedItems[category] = null;
            this.clearLayer(category);
          }
        }
      }
    });
  }

  showClothingItem(itemData, category) {
    const layer = document.getElementById(`${category}-layer`);
    if (!layer) {
      return;
    }

    if (itemData.sublayers) {
      this.handleSublayers(itemData, category);
    } else {
      layer.src = itemData.garmentPath;
      layer.style.display = "block";
      layer.style.zIndex = this.getZIndex(itemData, category);
    }
  }

  clearLayer(category) {
    const layer = document.getElementById(`${category}-layer`);
    if (layer) {
      layer.style.display = "none";
      layer.src = "";
    }

    const backLayer = document.getElementById(`${category}-back-layer`);
    if (backLayer) {
      backLayer.style.display = "none";
      backLayer.src = "";
    }

    const frontLayer = document.getElementById(`${category}-front-layer`);
    if (frontLayer) {
      frontLayer.style.display = "none";
      frontLayer.src = "";
    }
  }

  getZIndex(itemData, category) {
    if (itemData.zIndexOverride) {
      return itemData.zIndexOverride;
    }

    const zIndexMap = this.manifestData.rules?.zOrder || {
      shoes: 200,
      bottoms: 300,
      dresses: 350,
      jumpsuits: 360,
      tops: 400,
      outerwear: 500,
      accessories: 600,
    };

    return zIndexMap[category] || 300;
  }

  handleSublayers(itemData, category) {
    if (itemData.sublayers.backPath && itemData.sublayers.frontPath) {
      const backLayer = document.getElementById(`${category}-back-layer`);
      const frontLayer = document.getElementById(`${category}-front-layer`);

      if (backLayer && frontLayer) {
        backLayer.src = itemData.sublayers.backPath;
        backLayer.style.display = "block";

        frontLayer.src = itemData.sublayers.frontPath;
        frontLayer.style.display = "block";
      }
    }
  }

  updateItemSelection(selectedItemId, category) {
    const allCategories = [
      "tops",
      "bottoms",
      "dresses",
      "jumpsuits",
      "outerwear",
      "shoes",
      "accessories",
    ];

    allCategories.forEach((cat) => {
      document.querySelectorAll(`#${cat}-items .item-card`).forEach((card) => {
        if (
          !this.selectedItems[cat] ||
          card.dataset.itemId !== this.selectedItems[cat].id
        ) {
          card.classList.remove("selected");
        }
      });
    });

    const selectedCard = document.querySelector(
      `[data-item-id="${selectedItemId}"]`
    );
    if (selectedCard) {
      selectedCard.classList.add("selected");
    }
  }

  showAvatar() {
    const avatarBase = document.getElementById("avatar-base");
    if (avatarBase) {
      avatarBase.onload = () => {};
    }
  }

  clearAll() {
    Object.keys(this.selectedItems).forEach((category) => {
      this.selectedItems[category] = null;
      this.clearLayer(category);
    });

    const allCategories = [
      "tops",
      "bottoms",
      "dresses",
      "jumpsuits",
      "outerwear",
      "shoes",
      "accessories",
    ];
    allCategories.forEach((category) => {
      document
        .querySelectorAll(`#${category}-items .item-card`)
        .forEach((card) => {
          card.classList.remove("selected");
        });
    });
  }

  randomLook() {
    this.clearAll();

    const presets = this.manifestData.ui?.presets || [];
    if (presets.length === 0) return;

    const randomPreset = presets[Math.floor(Math.random() * presets.length)];

    randomPreset.items.forEach((itemId) => {
      const itemData = this.manifestData.items.find(
        (item) => item.id === itemId
      );
      if (itemData) {
        this.selectItem(itemId, itemData.category);
      }
    });
  }

  getCategoryStats() {
    const stats = {};
    const categories = [
      "tops",
      "bottoms",
      "dresses",
      "jumpsuits",
      "outerwear",
      "shoes",
      "accessories",
    ];

    categories.forEach((category) => {
      const items = this.manifestData.items.filter(
        (item) => item.category === category
      );
      stats[category] = items.length;

      if (category === "accessories") {
        const subtypes = {};
        items.forEach((item) => {
          const subtype = item.subtype || "other";
          subtypes[subtype] = (subtypes[subtype] || 0) + 1;
        });
        stats[`${category}_subtypes`] = subtypes;
      }
    });

    return stats;
  }

  showPresetsModal() {
    const modal = document.getElementById("presets-modal");
    const presetsGrid = document.getElementById("presets-grid");

    if (!modal || !presetsGrid) return;

    const presets = this.manifestData.ui?.presets || [];
    presetsGrid.innerHTML = presets
      .map(
        (preset) => `
      <div class="preset-card" data-preset-name="${preset.name}">
        <h4 class="preset-name">${preset.name}</h4>
        <div class="preset-items">
          ${preset.items
            .slice(0, 4)
            .map((itemId) => {
              const item = this.manifestData.items.find((i) => i.id === itemId);
              return item
                ? `<img src="${item.thumbPath}" alt="${itemId}" class="preset-item-thumb" />`
                : "";
            })
            .join("")}
        </div>
        <button class="apply-preset-btn" data-preset-name="${
          preset.name
        }">Apply Look</button>
      </div>
    `
      )
      .join("");

    presetsGrid.querySelectorAll(".apply-preset-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const presetName = e.target.dataset.presetName;
        this.applyPreset(presetName);
        this.hidePresetsModal();
      });
    });

    modal.style.display = "flex";
  }

  hidePresetsModal() {
    const modal = document.getElementById("presets-modal");
    if (modal) {
      modal.style.display = "none";
    }
  }

  applyPreset(presetName) {
    const preset = this.manifestData.ui?.presets.find(
      (p) => p.name === presetName
    );
    if (!preset) return;

    this.clearAll();

    preset.items.forEach((itemId) => {
      const itemData = this.manifestData.items.find(
        (item) => item.id === itemId
      );
      if (itemData) {
        this.selectItem(itemId, itemData.category);
      }
    });
  }

  setupZoomControls() {
    const avatarContainer = document.querySelector(".avatar-container");
    const zoomSlider = document.getElementById("zoom-slider");
    const zoomInBtn = document.getElementById("zoom-in");
    const zoomOutBtn = document.getElementById("zoom-out");

    if (!avatarContainer || !zoomSlider || !zoomInBtn || !zoomOutBtn) {
      return;
    }

    let currentZoom = 1;

    let dragOffset = { x: 0, y: 0 };
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };

    const applyZoom = (zoomValue) => {
      currentZoom = zoomValue;

      clampPosition();

      const avatarBase = avatarContainer.querySelector("#avatar-base");
      const clothingLayers = avatarContainer.querySelector(".clothing-layers");

      const transform = `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(${zoomValue})`;

      if (avatarBase) {
        avatarBase.style.transform = transform;
        avatarBase.style.transformOrigin = "center center";
      }

      if (clothingLayers) {
        clothingLayers.style.transform = transform;
        clothingLayers.style.transformOrigin = "center center";
      }

      zoomSlider.value = zoomValue;

      if (zoomValue > 1) {
        avatarContainer.style.cursor = "grab";
      } else {
        avatarContainer.style.cursor = "default";
        dragOffset = { x: 0, y: 0 };
        applyTransform();
      }
    };

    const calculateDragBounds = () => {
      const containerRect = avatarContainer.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      if (currentZoom <= 1) {
        return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
      }

      const overflowX = (containerWidth * currentZoom - containerWidth) / 2;
      const overflowY = (containerHeight * currentZoom - containerHeight) / 2;

      const maxOffsetX = overflowX / currentZoom;
      const maxOffsetY = overflowY / currentZoom;

      const verticalExtension = maxOffsetY * 0.8;

      return {
        minX: -maxOffsetX,
        maxX: maxOffsetX,
        minY: -maxOffsetY - verticalExtension,
        maxY: maxOffsetY + verticalExtension,
      };
    };

    const clampPosition = () => {
      if (currentZoom <= 1) {
        dragOffset = { x: 0, y: 0 };
        return;
      }

      const bounds = calculateDragBounds();

      dragOffset.x = Math.max(bounds.minX, Math.min(bounds.maxX, dragOffset.x));
      dragOffset.y = Math.max(bounds.minY, Math.min(bounds.maxY, dragOffset.y));
    };

    const applyTransform = () => {
      clampPosition();

      const avatarBase = avatarContainer.querySelector("#avatar-base");
      const clothingLayers = avatarContainer.querySelector(".clothing-layers");

      const transform = `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(${currentZoom})`;

      if (avatarBase) {
        avatarBase.style.transform = transform;
        avatarBase.style.transformOrigin = "center center";
      }

      if (clothingLayers) {
        clothingLayers.style.transform = transform;
        clothingLayers.style.transformOrigin = "center center";
      }
    };

    avatarContainer.addEventListener("mousedown", (e) => {
      if (e.target.closest(".zoom-controls")) return;

      if (currentZoom > 1) {
        isDragging = true;
        avatarContainer.style.cursor = "grabbing";
        dragStart.x = e.clientX - dragOffset.x;
        dragStart.y = e.clientY - dragOffset.y;
        e.preventDefault();
      }
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging && currentZoom > 1) {
        dragOffset.x = e.clientX - dragStart.x;
        dragOffset.y = e.clientY - dragStart.y;
        applyTransform();
      }
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        if (currentZoom > 1) {
          avatarContainer.style.cursor = "grab";
        }
      }
    });

    let touchStart = { x: 0, y: 0 };

    avatarContainer.addEventListener(
      "touchstart",
      (e) => {
        if (
          e.target.closest(".zoom-controls") ||
          e.target.classList.contains("zoom-btn") ||
          e.target.closest(".zoom-btn")
        ) {
          return;
        }

        if (currentZoom > 1 && e.touches.length === 1) {
          const touch = e.touches[0];
          touchStart.x = touch.clientX - dragOffset.x;
          touchStart.y = touch.clientY - dragOffset.y;
          e.preventDefault();
        }
      },
      { passive: false }
    );

    avatarContainer.addEventListener("touchmove", (e) => {
      if (currentZoom > 1 && e.touches.length === 1) {
        const touch = e.touches[0];
        dragOffset.x = touch.clientX - touchStart.x;
        dragOffset.y = touch.clientY - touchStart.y;
        applyTransform();
        e.preventDefault();
      }
    });

    zoomSlider.addEventListener("input", (e) => {
      const zoomValue = parseFloat(e.target.value);
      applyZoom(zoomValue);
    });

    // Додаємо обробник для touch на slider
    zoomSlider.addEventListener("change", (e) => {
      const zoomValue = parseFloat(e.target.value);
      applyZoom(zoomValue);
    });

    zoomSlider.addEventListener(
      "touchstart",
      (e) => {
        e.stopPropagation();
      },
      { passive: true }
    );

    zoomSlider.addEventListener(
      "touchmove",
      (e) => {
        e.stopPropagation();
      },
      { passive: true }
    );

    // Обробники для кнопок zoom-in
    zoomInBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const newZoom = Math.min(currentZoom + 0.1, 2);
      applyZoom(newZoom);
    });

    zoomInBtn.addEventListener(
      "touchstart",
      (e) => {
        e.stopPropagation();
      },
      { passive: true }
    );

    // Обробники для кнопок zoom-out
    zoomOutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const newZoom = Math.max(currentZoom - 0.1, 1);
      applyZoom(newZoom);
    });

    zoomOutBtn.addEventListener(
      "touchstart",
      (e) => {
        e.stopPropagation();
      },
      { passive: true }
    );

    avatarContainer.addEventListener("wheel", (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newZoom = Math.max(1, Math.min(2, currentZoom + delta));
        applyZoom(newZoom);
      }
    });
  }

  toggleCategoriesCollapse() {
    const avatarContainer = document.querySelector(".avatar-container");
    const collapseToggle = document.querySelector(".collapse-toggle");

    if (!avatarContainer) return;

    const isCollapsed = avatarContainer.classList.contains(
      "categories-collapsed"
    );

    if (isCollapsed) {
      avatarContainer.classList.remove("categories-collapsed");
      collapseToggle.classList.remove("collapsed");
    } else {
      avatarContainer.classList.add("categories-collapsed");
      collapseToggle.classList.add("collapsed");
    }
  }
}

const avatarBuilder = new AvatarBuilder();

export default avatarBuilder;
